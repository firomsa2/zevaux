// utils/supabase/sms.ts
import { User } from "@supabase/supabase-js";
import { createClient } from "./client";
import {
  SMS,
  CreateSMSData,
  UpdateSMSData,
  SMSStats,
  SMSFilters,
} from "@/types/sms";

export class SMSService {
  private supabase = createClient();

  async getSMSList(
    orgId: string,
    filters?: SMSFilters
  ): Promise<{ data: SMS[]; error: any }> {
    try {
      let query = this.supabase
        .from("sms")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters?.mode && filters.mode !== "all") {
        query = query.eq("mode", filters.mode);
      }

      // Date range filter
      if (filters?.dateRange?.from) {
        query = query.gte("created_at", filters.dateRange.from.toISOString());
      }
      if (filters?.dateRange?.to) {
        query = query.lte("created_at", filters.dateRange.to.toISOString());
      }

      const { data, error } = await query;

      return { data: data || [], error };
    } catch (error) {
      console.error("Error fetching SMS list:", error);
      return { data: [], error };
    }
  }

  async getSMSById(
    id: string,
    orgId: string
  ): Promise<{ data: SMS | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from("sms")
        .select("*")
        .eq("id", id)
        .eq("org_id", orgId)
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error fetching SMS:", error);
      return { data: null, error };
    }
  }

  async createSMS(
    smsData: CreateSMSData,
    orgId: string
  ): Promise<{ data: SMS | null; error: any }> {
    try {
      // For manual creation, set mode to 'manual'
      const dataToInsert = {
        ...smsData,
        org_id: orgId,
        mode: smsData.mode || "manual",
      };

      const { data, error } = await this.supabase
        .from("sms")
        .insert([dataToInsert])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error creating SMS:", error);
      return { data: null, error };
    }
  }

  async updateSMS(
    id: string,
    updates: UpdateSMSData,
    orgId: string
  ): Promise<{ data: SMS | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from("sms")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("org_id", orgId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error updating SMS:", error);
      return { data: null, error };
    }
  }

  async deleteSMS(id: string, orgId: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from("sms")
        .delete()
        .eq("id", id)
        .eq("org_id", orgId);

      return { error };
    } catch (error) {
      console.error("Error deleting SMS:", error);
      return { error };
    }
  }

  async approveSMS(
    id: string,
    orgId: string,
    user: User | null
  ): Promise<{ data: SMS | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from("sms")
        .update({
          status: "approved",
          approved_by: user?.id || null,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("org_id", orgId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error approving SMS:", error);
      return { data: null, error };
    }
  }

  async sendSMS(
    id: string,
    orgId: string
  ): Promise<{ data: SMS | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from("sms")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("org_id", orgId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error marking SMS as sent:", error);
      return { data: null, error };
    }
  }

  async getSMSStats(orgId: string): Promise<{ data: SMSStats; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from("sms")
        .select("status")
        .eq("org_id", orgId);

      if (error) {
        return { data: this.getDefaultStats(), error };
      }

      const stats: SMSStats = {
        total: data.length,
        draft: data.filter((s) => s.status === "draft").length,
        pending: data.filter((s) => s.status === "pending").length,
        approved: data.filter((s) => s.status === "approved").length,
        sent: data.filter((s) => s.status === "sent").length,
        failed: data.filter((s) => s.status === "failed").length,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error("Error fetching SMS stats:", error);
      return { data: this.getDefaultStats(), error };
    }
  }

  private getDefaultStats(): SMSStats {
    return {
      total: 0,
      draft: 0,
      pending: 0,
      approved: 0,
      sent: 0,
      failed: 0,
    };
  }

  async processAISMS(orgId: string): Promise<{ data: SMS[]; error: any }> {
    try {
      // This would typically call your AI backend to generate SMS
      // For now, we'll return pending AI-generated messages
      const { data, error } = await this.supabase
        .from("sms")
        .select("*")
        .eq("org_id", orgId)
        .eq("mode", "fully_ai")
        // .eq("metadata->>ai_generated', 'true')
        .order("created_at", { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      console.error("Error processing AI SMS:", error);
      return { data: [], error };
    }
  }

  async getPendingApprovals(
    orgId: string
  ): Promise<{ data: SMS[]; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from("sms")
        .select("*")
        .eq("org_id", orgId)
        .eq("mode", "hybrid")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      return { data: data || [], error };
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
      return { data: [], error };
    }
  }
}

export const smsService = new SMSService();
