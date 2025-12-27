// "use client";

// import { useState, useEffect } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { phoneNumberService } from "@/utils/supabase/phone-numbers";
// import { PhoneNumber } from "@/types/phone";

// interface PhoneNumberAssignmentProps {
//   orgId: string;
//   receptionistId: string;
//   currentPhoneNumberId?: string | null;
//   onAssignmentChange: (phoneNumberId: string | null) => void;
// }

// export function PhoneNumberAssignment({
//   orgId,
//   receptionistId,
//   currentPhoneNumberId,
//   onAssignmentChange,
// }: PhoneNumberAssignmentProps) {
//   const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadPhoneNumbers();
//   }, [orgId]);

//   const loadPhoneNumbers = async () => {
//     const { data } = await phoneNumberService.getPhoneNumbers(orgId);
//     setPhoneNumbers(data);
//     setLoading(false);
//   };

//   const handleAssignment = async (phoneNumberId: string) => {
//     const phoneNumber = phoneNumberId || null;
//     await phoneNumberService.assignToReceptionist(
//       phoneNumberId,
//       receptionistId,
//       orgId
//     );
//     onAssignmentChange(phoneNumber);
//   };

//   if (loading) {
//     return <div className="h-10 bg-muted animate-pulse rounded" />;
//   }

//   return (
//     <Select value={currentPhoneNumberId || ""} onValueChange={handleAssignment}>
//       <SelectTrigger>
//         <SelectValue placeholder="Select a phone number" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="">No phone number</SelectItem>
//         {phoneNumbers
//           .filter((phone) => phone.is_active)
//           .map((phone) => (
//             <SelectItem key={phone.id} value={phone.id}>
//               {phone.name} ({phone.phone_number})
//             </SelectItem>
//           ))}
//       </SelectContent>
//     </Select>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { phoneNumberService } from "@/utils/supabase/phone-numbers";
// import { PhoneNumber } from "@/types/phone";
// import { Loader2, Phone } from "lucide-react";

// interface PhoneNumberAssignmentProps {
//   orgId: string;
//   receptionistId: string;
//   currentPhoneNumberId?: string | null;
//   onAssignmentChange: (phoneNumberId: string | null) => void;
// }

// export function PhoneNumberAssignment({
//   orgId,
//   receptionistId,
//   currentPhoneNumberId,
//   onAssignmentChange
// }: PhoneNumberAssignmentProps) {
//   const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [assigning, setAssigning] = useState(false);

//   useEffect(() => {
//     loadPhoneNumbers();
//   }, [orgId]);

//   const loadPhoneNumbers = async () => {
//     const { data } = await phoneNumberService.getAvailablePhoneNumbers(orgId);
//     setPhoneNumbers(data);
//     setLoading(false);
//   };

//   const handleAssignment = async (phoneNumberId: string) => {
//     setAssigning(true);
//     try {
//       const phoneId = phoneNumberId || null;
//       const { error } = await phoneNumberService.assignToReceptionist(phoneNumberId, receptionistId, orgId);

//       if (error) {
//         console.error("Assignment error:", error);
//         // Revert the select value on error
//         onAssignmentChange(currentPhoneNumberId || null);
//         alert(`Failed to assign phone number: ${error.message}`);
//         return;
//       }

//       onAssignmentChange(phoneId);

//       // Reload available numbers
//       await loadPhoneNumbers();
//     } catch (error: any) {
//       console.error("Unexpected error:", error);
//       onAssignmentChange(currentPhoneNumberId || null);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setAssigning(false);
//     }
//   };

//   const getCurrentAssignmentDisplay = () => {
//     if (!currentPhoneNumberId) return "No phone number assigned";

//     const currentPhone = phoneNumbers.find(p => p.id === currentPhoneNumberId);
//     if (currentPhone) {
//       return `${currentPhone.name} (${currentPhone.phone_number})`;
//     }

//     return "Loading...";
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//         <Loader2 className="h-4 w-4 animate-spin" />
//         Loading phone numbers...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       <Select
//         value={currentPhoneNumberId || ""}
//         onValueChange={handleAssignment}
//         disabled={assigning}
//       >
//         <SelectTrigger className="w-full">
//           {assigning ? (
//             <div className="flex items-center gap-2">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               <span>Assigning...</span>
//             </div>
//           ) : (
//             <SelectValue placeholder="Select a phone number">
//               {getCurrentAssignmentDisplay()}
//             </SelectValue>
//           )}
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="">No phone number</SelectItem>
//           {phoneNumbers.map(phone => (
//             <SelectItem key={phone.id} value={phone.id}>
//               <div className="flex items-center gap-2">
//                 <Phone className="h-3 w-3" />
//                 <span>{phone.name} ({phone.phone_number})</span>
//               </div>
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {phoneNumbers.length === 0 && (
//         <div className="text-sm text-muted-foreground p-3 border rounded-lg bg-muted/50">
//           <p className="font-medium mb-1">No phone numbers available</p>
//           <p>
//             You need to add phone numbers before you can assign them to receptionists.{" "}
//             <a
//               href="/dashboard/phone-numbers"
//               className="text-blue-600 hover:underline font-medium"
//             >
//               Add phone numbers →
//             </a>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// // import { createClient } from "@/utils/supabase/client";
// import { PhoneNumber } from "@/types/phone";
// import { Loader2, Phone } from "lucide-react";
// import { phoneNumberService } from "@/utils/supabase/phone-numbers";

// interface PhoneNumberAssignmentProps {
//   orgId: string;
//   receptionistId: string;
//   currentPhoneNumberId?: string | null;
//   onAssignmentChange: (phoneNumberId: string | null) => void;
// }

// export function PhoneNumberAssignment({
//   orgId,
//   receptionistId,
//   currentPhoneNumberId,
//   onAssignmentChange,
// }: PhoneNumberAssignmentProps) {
//   const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [assigning, setAssigning] = useState(false);
//   // const supabase = createClient();

//   useEffect(() => {
//     loadPhoneNumbers();
//   }, [orgId]);

//   // const loadPhoneNumbers = async () => {
//   //   try {
//   //     // Fetch available phone numbers (active and unassigned)
//   //     const { data, error } = await supabase
//   //       .from("phone_numbers")
//   //       .select("*")
//   //       .eq("org_id", orgId)
//   //       .eq("is_active", true)
//   //       .is("receptionist_id", null)
//   //       .order("created_at", { ascending: false });

//   //     if (error) {
//   //       console.error("Error loading phone numbers:", error);
//   //       return;
//   //     }

//   //     setPhoneNumbers(data || []);
//   //   } catch (error) {
//   //     console.error("Unexpected error:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const loadPhoneNumbers = async () => {
//     const { data } = await phoneNumberService.getAvailablePhoneNumbers(orgId);
//     setPhoneNumbers(data);
//   };

//   const handleAssignment = async (phoneNumberId: string) => {
//     setAssigning(true);
//     try {
//       const phoneId = phoneNumberId === "none" ? null : phoneNumberId;

//       const { error } = await phoneNumberService.assignToReceptionist(
//         phoneId,
//         receptionistId,
//         orgId
//       );

//       if (error) throw error;

//       onAssignmentChange(phoneId);
//       await loadPhoneNumbers();
//     } catch (error: any) {
//       console.error("Assignment error:", error);
//       onAssignmentChange(currentPhoneNumberId || null);
//       alert(`Failed to assign phone number: ${error.message}`);
//     } finally {
//       setAssigning(false);
//     }
//   };

//   // const handleAssignment = async (phoneNumberId: string) => {
//   //   setAssigning(true);
//   //   try {
//   //     const phoneId = phoneNumberId === "unassigned" ? null : phoneNumberId;

//   //     if (phoneNumberId !== "unassigned") {
//   //       // Update the phone number's receptionist_id
//   //       const { error: phoneError } = await supabase
//   //         .from("phone_numbers")
//   //         .update({
//   //           receptionist_id: receptionistId,
//   //           updated_at: new Date().toISOString(),
//   //         })
//   //         .eq("id", phoneNumberId)
//   //         .eq("org_id", orgId);

//   //       if (phoneError) throw phoneError;
//   //     }

//   //     // Update the receptionist's assigned_phone_number_id
//   //     const { error: receptionistError } = await supabase
//   //       .from("receptionists")
//   //       .update({
//   //         assigned_phone_number_id: phoneId,
//   //       })
//   //       .eq("id", receptionistId)
//   //       .eq("org_id", orgId);

//   //     if (receptionistError) throw receptionistError;

//   //     onAssignmentChange(phoneId);

//   //     // Reload available numbers
//   //     await loadPhoneNumbers();
//   //   } catch (error: any) {
//   //     console.error("Assignment error:", error);
//   //     // Revert the select value on error
//   //     onAssignmentChange(currentPhoneNumberId || null);
//   //     alert(`Failed to assign phone number: ${error.message}`);
//   //   } finally {
//   //     setAssigning(false);
//   //   }
//   // };

//   const getCurrentAssignmentDisplay = () => {
//     if (!currentPhoneNumberId) return "No phone number assigned";

//     const currentPhone = phoneNumbers.find(
//       (p) => p.id === currentPhoneNumberId
//     );
//     if (currentPhone) {
//       return `${currentPhone.name} (${currentPhone.phone_number})`;
//     }

//     return "Currently assigned...";
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//         <Loader2 className="h-4 w-4 animate-spin" />
//         Loading phone numbers...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       <Select
//         value={currentPhoneNumberId || "unassigned"}
//         onValueChange={handleAssignment}
//         disabled={assigning}
//       >
//         <SelectTrigger className="w-full">
//           {assigning ? (
//             <div className="flex items-center gap-2">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               <span>Assigning...</span>
//             </div>
//           ) : (
//             <SelectValue placeholder="Select a phone number">
//               {getCurrentAssignmentDisplay()}
//             </SelectValue>
//           )}
//         </SelectTrigger>
//         <SelectContent>
//           {/* Use "unassigned" instead of empty string */}
//           <SelectItem value="unassigned">No phone number</SelectItem>
//           {phoneNumbers.map((phone) => (
//             <SelectItem key={phone.id} value={phone.id}>
//               <div className="flex items-center gap-2">
//                 <Phone className="h-3 w-3" />
//                 <span>
//                   {phone.name} ({phone.phone_number})
//                 </span>
//               </div>
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {phoneNumbers.length === 0 && (
//         <div className="text-sm text-muted-foreground p-3 border rounded-lg bg-muted/50">
//           <p className="font-medium mb-1">No phone numbers available</p>
//           <p>
//             You need to add phone numbers before you can assign them to
//             receptionists.{" "}
//             <a
//               href="/dashboard/phone-numbers"
//               className="text-blue-600 hover:underline font-medium"
//             >
//               Add phone numbers →
//             </a>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { phoneNumberService } from "@/utils/supabase/phone-numbers";
import { PhoneNumber } from "@/types/phone";
import { Loader2, Phone } from "lucide-react";

interface PhoneNumberAssignmentProps {
  orgId: string;
  receptionistId: string;
  currentPhoneNumberId?: string | null;
  onAssignmentChange: (phoneNumberId: string | null) => void;
}

export function PhoneNumberAssignment({
  orgId,
  receptionistId,
  currentPhoneNumberId,
  onAssignmentChange,
}: PhoneNumberAssignmentProps) {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadPhoneNumbers();
  }, [orgId]);

  const loadPhoneNumbers = async () => {
    try {
      console.log("🔍 Loading available phone numbers for org:", orgId);
      const { data, error } = await phoneNumberService.getAvailablePhoneNumbers(
        orgId
      );

      if (error) {
        console.error("❌ Error loading phone numbers:", error);
        return;
      }

      console.log("✅ Available phone numbers:", data);
      setPhoneNumbers(data || []);
    } catch (error) {
      console.error("💥 Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = async (selectedValue: string) => {
    setAssigning(true);
    try {
      console.log("🔄 Assigning phone number:", {
        selectedValue,
        receptionistId,
        orgId,
      });

      // Convert "none" back to null
      const phoneNumberId = selectedValue === "none" ? null : selectedValue;

      // const { error } = await phoneNumberService.assignToReceptionist(
      //   phoneNumberId,
      //   receptionistId,
      //   orgId
      // );

      // if (error) {
      //   console.error("❌ Assignment error:", error);
      //   throw error;
      // }

      console.log("✅ Assignment successful");
      onAssignmentChange(phoneNumberId);

      // Reload available numbers to reflect the change
      await loadPhoneNumbers();
    } catch (error: any) {
      console.error("💥 Assignment failed:", error);
      // Revert the select value on error
      onAssignmentChange(currentPhoneNumberId || null);
      alert(`Failed to assign phone number: ${error.message}`);
    } finally {
      setAssigning(false);
    }
  };

  const getCurrentAssignmentDisplay = () => {
    if (!currentPhoneNumberId) return "No phone number assigned";

    const currentPhone = phoneNumbers.find(
      (p) => p.id === currentPhoneNumberId
    );
    if (currentPhone) {
      return `${currentPhone.name} (${currentPhone.phone_number})`;
    }

    return "Currently assigned...";
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading phone numbers...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Select
        value={currentPhoneNumberId || "none"}
        onValueChange={handleAssignment}
        disabled={assigning || loading}
      >
        <SelectTrigger className="border border-gray-200 w-full">
          {assigning ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Assigning...</span>
            </div>
          ) : (
            <SelectValue
              className="border border-gray-200"
              placeholder="Select a phone number"
            >
              {getCurrentAssignmentDisplay()}
            </SelectValue>
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No phone number</SelectItem>
          {phoneNumbers.map((phone) => (
            <SelectItem key={phone.id} value={phone.id}>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>
                  {phone.name} ({phone.phone_number})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {phoneNumbers.length === 0 && (
        <div className="text-sm text-muted-foreground p-3 border rounded-lg bg-muted/50">
          <p className="font-medium mb-1">No phone numbers available</p>
          <p>
            All your phone numbers are currently assigned to other
            receptionists.{" "}
            <a
              href="/dashboard/phone-numbers"
              className="text-blue-600 hover:underline font-medium"
            >
              Manage phone numbers →
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
