// import { NextResponse } from "next/server";
// import { calendarService } from "@/lib/services/calendar-service";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { userId, startTime, endTime } = body;

//     if (!userId || !startTime || !endTime) {
//       return NextResponse.json(
//         { error: "Missing required fields: userId, startTime, endTime" },
//         { status: 400 }
//       );
//     }

//     // TODO: Add authentication check here (e.g., verify API key from external backend)

//     const busySlots = await calendarService.getAvailability(
//       userId,
//       startTime,
//       endTime
//     );

//     return NextResponse.json({ busy: busySlots });
//   } catch (error: any) {
//     console.error("Error fetching availability:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to fetch availability" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
export async function POST(request: Request) {
  return NextResponse.json({
    message: "Calendar availability endpoint is under construction.",
  });
}
