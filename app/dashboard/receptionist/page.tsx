// "use client";
// import { useEffect, useState } from "react";
// import ReceptionistForm from "@/components/dashboardForm";
// import { getUserWithOrg } from "@/utils/supabase/user";
// import { createClient } from "@/utils/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { AlertCircle, RefreshCw } from "lucide-react";
// import { PhoneNumberAssignment } from "@/components/phone-number-assignment";

import ReceptionistOverview from "@/components/receptionist/overview";

// export default function ReceptionistPage() {
//   const [receptionist, setReceptionist] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [orgId, setOrgId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const supabase = createClient();

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         // Get user with organization
//         const { user, orgId, error } = await getUserWithOrg();

//         if (error || !orgId) {
//           console.error("Error fetching user org:", error);
//           setError(
//             "Failed to load organization data. Please try logging out and back in."
//           );
//           setLoading(false);
//           return;
//         }

//         setOrgId(orgId);

//         // Fetch receptionist for this organization
//         const { data, error: receptionistError } = await supabase
//           .from("receptionists")
//           .select("*")
//           .eq("org_id", orgId)
//           .single();

//         if (receptionistError && receptionistError.code !== "PGRST116") {
//           console.error("Error fetching receptionist:", receptionistError);
//           setError(`Failed to load receptionist: ${receptionistError.message}`);
//         } else {
//           setReceptionist(data || null);
//         }
//       } catch (err: any) {
//         console.error("Unexpected error:", err);
//         setError(`Unexpected error: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p>Loading receptionist setup...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           <Alert variant="destructive" className="mb-6">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//           <Button
//             onClick={() => window.location.reload()}
//             className="flex items-center gap-2"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-6 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold tracking-tight mb-2">
//             AI Receptionist Setup
//           </h1>
//           <p className="text-muted-foreground">
//             Configure your virtual receptionist to handle calls professionally
//             and efficiently
//           </p>
//         </div>
//         <ReceptionistForm existing={receptionist} orgId={orgId} />
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import ReceptionistForm from "@/components/dashboardForm";
// import { getUserWithOrg } from "@/utils/supabase/user";
// import { createClient } from "@/utils/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { AlertCircle, RefreshCw, Phone } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// export default function ReceptionistPage() {
//   const [receptionist, setReceptionist] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [orgId, setOrgId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const supabase = createClient();

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         // Get user with organization
//         const { user, orgId, error } = await getUserWithOrg();

//         if (error || !orgId) {
//           console.error("Error fetching user org:", error);
//           setError(
//             "Failed to load organization data. Please try logging out and back in."
//           );
//           setLoading(false);
//           return;
//         }

//         setOrgId(orgId);

//         // Fetch receptionist with assigned phone number
//         // const { data, error: receptionistError } = await supabase
//         //   .from("receptionists")
//         //   .select(
//         //     `
//         //     *,
//         //     assigned_phone_number:phone_numbers(id, name, phone_number)
//         //   `
//         //   )
//         //   .eq("org_id", orgId)
//         //   .single();

//         const { data, error: receptionistError } = await supabase
//           .from("receptionists")
//           .select(
//             `
//     *,
//     assigned_phone_number:assigned_phone_number_id(id, name, phone_number)
//   `
//           )
//           .eq("org_id", orgId)
//           .single();

//         if (receptionistError && receptionistError.code !== "PGRST116") {
//           console.error("Error fetching receptionist:", receptionistError);
//           setError(`Failed to load receptionist: ${receptionistError.message}`);
//         } else {
//           setReceptionist(data || null);
//         }
//       } catch (err: any) {
//         console.error("Unexpected error:", err);
//         setError(`Unexpected error: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p>Loading receptionist setup...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           <Alert variant="destructive" className="mb-6">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//           <Button
//             onClick={() => window.location.reload()}
//             className="flex items-center gap-2"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-6 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold tracking-tight mb-2">
//             AI Receptionist Setup
//           </h1>
//           <p className="text-muted-foreground">
//             Configure your virtual receptionist to handle calls professionally
//             and efficiently
//           </p>
//         </div>

//         {/* Phone Number Assignment Card - Show if receptionist exists */}
//         {receptionist && (
//           <Card className="mb-6 border-blue-200 bg-blue-50">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Phone className="h-5 w-5" />
//                 Phone Number Assignment
//               </CardTitle>
//               <CardDescription>
//                 Manage which phone number this receptionist will answer
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">Current Assignment</p>
//                   {receptionist.assigned_phone_number ? (
//                     <div className="flex items-center gap-2 mt-1">
//                       <Badge
//                         variant="default"
//                         className="bg-green-100 text-green-800"
//                       >
//                         <Phone className="h-3 w-3 mr-1" />
//                         Active
//                       </Badge>
//                       <span className="text-sm">
//                         {receptionist.assigned_phone_number.name}(
//                         {receptionist.assigned_phone_number.phone_number})
//                       </span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2 mt-1">
//                       <Badge variant="secondary">Not Assigned</Badge>
//                       <span className="text-sm text-muted-foreground">
//                         No phone number assigned
//                       </span>
//                     </div>
//                   )}
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => {
//                     // Scroll to phone number assignment section in form
//                     document
//                       .getElementById("phone-number-assignment")
//                       ?.scrollIntoView({
//                         behavior: "smooth",
//                       });
//                   }}
//                 >
//                   Change Assignment
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         <ReceptionistForm existing={receptionist} orgId={orgId} />
//       </div>
//     </div>
//   );
// }

// import ReceptionistOverview from "@/components/dashboard/overview";

export default function ReceptionistPage() {
  return <ReceptionistOverview />;
}
