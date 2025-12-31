// import { NextResponse } from "next/server";
// import { calendarService } from "@/lib/services/calendar-service";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { userId, summary, description, startTime, endTime, attendees } =
//       body;

//     if (!userId || !summary || !startTime || !endTime) {
//       return NextResponse.json(
//         {
//           error: "Missing required fields: userId, summary, startTime, endTime",
//         },
//         { status: 400 }
//       );
//     }

//     // TODO: Add authentication check here

//     const event = await calendarService.createEvent(userId, {
//       summary,
//       description,
//       startTime,
//       endTime,
//       attendees,
//     });

//     return NextResponse.json({ event });
//   } catch (error: any) {
//     console.error("Error creating event:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to create event" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
export async function POST(request: Request) {
  return NextResponse.json({
    message: "Create event endpoint is under construction.",
  });
}
