import { google, calendar_v3 } from "googleapis";
import { oauth2Client } from "@/lib/google-auth";
import { createAdminClient } from "@/utils/supabase/admin";

export class CalendarService {
  private supabase = createAdminClient();

  private async getAuthenticatedClient(userId: string) {
    // 1. Fetch tokens from DB
    const { data: integration, error } = await this.supabase
      .from("user_integrations")
      .select("*")
      .eq("user_id", userId)
      .eq("provider", "google_calendar")
      .single();

    if (error || !integration) {
      throw new Error("Google Calendar integration not found for this user");
    }

    // 2. Set credentials
    oauth2Client.setCredentials({
      access_token: integration.access_token,
      refresh_token: integration.refresh_token,
      expiry_date: integration.expires_at,
    });

    // 3. Check if expired and refresh if needed
    // googleapis automatically refreshes if refresh_token is present and access_token is expired
    // but we need to listen to the 'tokens' event or check manually to save the new tokens to DB.

    // However, oauth2Client.getAccessToken() will refresh if needed.
    // Let's force a check or just rely on the client.
    // To ensure we save new tokens, we can wrap the client or check expiry.

    const now = Date.now();
    if (integration.expires_at && integration.expires_at < now + 60000) {
      // 1 minute buffer
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();

        // Update DB with new tokens
        await this.supabase
          .from("user_integrations")
          .update({
            access_token: credentials.access_token,
            refresh_token:
              credentials.refresh_token || integration.refresh_token, // refresh_token might not be returned
            expires_at: credentials.expiry_date,
            updated_at: new Date().toISOString(),
          })
          .eq("id", integration.id);

        oauth2Client.setCredentials(credentials);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        throw new Error("Failed to refresh Google Calendar tokens");
      }
    }

    return google.calendar({ version: "v3", auth: oauth2Client });
  }

  async getAvailability(userId: string, startTime: string, endTime: string) {
    const calendar = await this.getAuthenticatedClient(userId);

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startTime,
        timeMax: endTime,
        items: [{ id: "primary" }],
      },
    });

    return response.data.calendars?.primary?.busy || [];
  }

  async createEvent(
    userId: string,
    eventDetails: {
      summary: string;
      description?: string;
      startTime: string;
      endTime: string;
      attendees?: string[];
    }
  ) {
    const calendar = await this.getAuthenticatedClient(userId);

    const event: calendar_v3.Schema$Event = {
      summary: eventDetails.summary,
      description: eventDetails.description,
      start: {
        dateTime: eventDetails.startTime,
      },
      end: {
        dateTime: eventDetails.endTime,
      },
      attendees: eventDetails.attendees?.map((email) => ({ email })),
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return response.data;
  }

  async listEvents(userId: string, startTime: string, endTime: string) {
    const calendar = await this.getAuthenticatedClient(userId);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items || [];
  }
}

export const calendarService = new CalendarService();
