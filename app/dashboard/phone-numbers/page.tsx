// "use client";

// import { useEffect, useState } from "react";
// import { getUserWithOrg } from "@/utils/supabase/user";
// import { phoneNumberService } from "@/utils/supabase/phone-numbers";
// import { PhoneNumber, CreatePhoneNumberData } from "@/types/phone";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Plus,
//   Phone,
//   Edit,
//   Trash2,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
//   X,
// } from "lucide-react";

// export default function PhoneNumbersPage() {
//   const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [showCreateDialog, setShowCreateDialog] = useState(false);
//   const [editingPhone, setEditingPhone] = useState<PhoneNumber | null>(null);
//   const [orgId, setOrgId] = useState<string | null>(null);
//   const [receptionists, setReceptionists] = useState<any[]>([]);

//   const [formData, setFormData] = useState<CreatePhoneNumberData>({
//     name: "",
//     phone_number: "",
//     twilio_account_sid: "",
//     twilio_auth_token: "",
//     fallback_number: "",
//   });

//   const loadReceptionists = async () => {
//     if (!orgId) return;

//     const { data } = await phoneNumberService.getReceptionistsForAssignment(
//       orgId
//     );
//     setReceptionists(data);
//   };

//   // const loadPhoneNumbers = async () => {
//   //   setLoading(true);
//   //   setError(null);

//   //   try {
//   //     const { orgId: userOrgId, error: userError } = await getUserWithOrg();

//   //     if (userError || !userOrgId) {
//   //       setError("Failed to load organization data");
//   //       return;
//   //     }

//   //     setOrgId(userOrgId);

//   //     const [phonesResult, receptionistsResult] = await Promise.all([
//   //       phoneNumberService.getPhoneNumbers(userOrgId),
//   //       phoneNumberService.getReceptionistsForAssignment(userOrgId),
//   //     ]);

//   //     if (phonesResult.error) {
//   //       setError(`Failed to load phone numbers: ${phonesResult.error.message}`);
//   //       return;
//   //     }

//   //     setPhoneNumbers(phonesResult.data);
//   //     setReceptionists(receptionistsResult.data || []);
//   //   } catch (err: any) {
//   //     console.error("Unexpected error:", err);
//   //     setError(`Unexpected error: ${err.message}`);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const loadPhoneNumbers = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const { orgId: userOrgId, error: userError } = await getUserWithOrg();

//       if (userError || !userOrgId) {
//         setError("Failed to load organization data");
//         return;
//       }

//       setOrgId(userOrgId);

//       console.log("🔄 Loading fresh phone numbers data...");

//       const [phonesResult, receptionistsResult] = await Promise.all([
//         phoneNumberService.getPhoneNumbers(userOrgId),
//         phoneNumberService.getReceptionistsForAssignment(userOrgId),
//       ]);

//       if (phonesResult.error) {
//         setError(`Failed to load phone numbers: ${phonesResult.error.message}`);
//         return;
//       }

//       console.log("✅ Loaded phone numbers:", phonesResult.data);
//       console.log("✅ Loaded receptionists:", receptionistsResult.data);

//       setPhoneNumbers(phonesResult.data);
//       setReceptionists(receptionistsResult.data || []);
//     } catch (err: any) {
//       console.error("Unexpected error:", err);
//       setError(`Unexpected error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadPhoneNumbers();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     if (!orgId) {
//       setError("Organization not found");
//       return;
//     }

//     try {
//       if (editingPhone) {
//         const { error: updateError } =
//           await phoneNumberService.updatePhoneNumber(
//             editingPhone.id,
//             formData,
//             orgId
//           );

//         if (updateError) {
//           setError(`Failed to update phone number: ${updateError.message}`);
//           return;
//         }

//         setSuccess("Phone number updated successfully");
//       } else {
//         const webhookData = {
//           orgId: orgId,
//           name: formData.name,
//           phone_number: formData.phone_number,
//           twilio_account_sid: formData.twilio_account_sid,
//           twilio_auth_token: formData.twilio_auth_token,
//           fallback_number: formData.fallback_number,
//         };

//         console.log("Sending webhook data:", webhookData);
//         // Send to webhook
//         const webhookResponse = await fetch(
//           "https://ddconsult.app.n8n.cloud/webhook/phone48391dcb-6b32-4673-a821-fcbf6453d7fe",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(webhookData),
//           }
//         );

//         if (!webhookResponse.ok) {
//           throw new Error(`Webhook failed: ${webhookResponse.statusText}`);
//         }

//         const { error: createError } =
//           await phoneNumberService.createPhoneNumber(formData, orgId);

//         if (createError) {
//           setError(`Failed to create phone number: ${createError.message}`);
//           return;
//         }

//         setSuccess("Phone number created successfully");
//       }

//       // Reset form and refresh data
//       resetForm();
//       loadPhoneNumbers();
//     } catch (err: any) {
//       console.error("Error saving phone number:", err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   const handleDelete = async (phone: PhoneNumber) => {
//     if (
//       !confirm(
//         `Are you sure you want to delete "${phone.name}"? This action cannot be undone.`
//       )
//     ) {
//       return;
//     }

//     if (!orgId) return;

//     setError(null);
//     setSuccess(null);

//     try {
//       const { error: deleteError } = await phoneNumberService.deletePhoneNumber(
//         phone.id,
//         orgId
//       );

//       if (deleteError) {
//         setError(`Failed to delete phone number: ${deleteError.message}`);
//         return;
//       }

//       setSuccess("Phone number deleted successfully");
//       loadPhoneNumbers();
//     } catch (err: any) {
//       console.error("Error deleting phone number:", err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   const handleEdit = (phone: PhoneNumber) => {
//     setEditingPhone(phone);
//     setFormData({
//       name: phone.name,
//       phone_number: phone.phone_number,
//       twilio_account_sid: phone.twilio_account_sid,
//       twilio_auth_token: phone.twilio_auth_token,
//       fallback_number: phone.fallback_number,
//     });
//     setShowCreateDialog(true);
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       phone_number: "",
//       twilio_account_sid: "",
//       twilio_auth_token: "",
//       fallback_number: "",
//     });
//     setEditingPhone(null);
//     setShowCreateDialog(false);
//   };

//   // const handleAssignReceptionist = async (
//   //   phoneNumberId: string,
//   //   receptionistId: string | null
//   // ) => {
//   //   if (!orgId) return;

//   //   setError(null);
//   //   setSuccess(null);

//   //   try {
//   //     const { error } = await phoneNumberService.assignToReceptionist(
//   //       phoneNumberId,
//   //       receptionistId,
//   //       orgId
//   //     );

//   //     if (error) {
//   //       setError(`Failed to assign phone number: ${error.message}`);
//   //       return;
//   //     }

//   //     setSuccess("Phone number assignment updated");
//   //     loadPhoneNumbers();
//   //   } catch (err: any) {
//   //     console.error("Error assigning phone number:", err);
//   //     setError(`Error: ${err.message}`);
//   //   }
//   // };
//   const handleAssignReceptionist = async (
//     phoneNumberId: string,
//     receptionistId: string | null
//   ) => {
//     if (!orgId) return;

//     setError(null);
//     setSuccess(null);

//     console.log("🔄 Assigning phone number:", {
//       phoneNumberId,
//       receptionistId,
//       orgId,
//     });

//     try {
//       const { error } = await phoneNumberService.assignToReceptionist(
//         phoneNumberId,
//         receptionistId,
//         orgId
//       );

//       if (error) {
//         console.error("❌ Assignment error:", error);
//         setError(`Failed to assign phone number: ${error.message}`);
//         return;
//       }

//       console.log("✅ Assignment successful");
//       setSuccess("Phone number assignment updated");

//       // Reload the data to reflect changes
//       await loadPhoneNumbers();
//     } catch (err: any) {
//       console.error("💥 Error assigning phone number:", err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p>Loading phone numbers...</p>
//         </div>
//       </div>
//     );
//   }
//   console.log("phone Numbers ", phoneNumbers);

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight">Phone Numbers</h1>
//             <p className="text-muted-foreground mt-2">
//               Manage your Twilio phone numbers and assign them to receptionists
//             </p>
//           </div>
//           <Button
//             onClick={() => setShowCreateDialog(true)}
//             className="flex items-center gap-2"
//           >
//             <Plus className="h-4 w-4" />
//             Add Phone Number
//           </Button>
//         </div>

//         {/* Alerts */}
//         {error && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {success && (
//           <Alert className="bg-green-50 border-green-200">
//             <CheckCircle className="h-4 w-4 text-green-600" />
//             <AlertDescription className="text-green-800">
//               {success}
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Phone Numbers Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Phone Numbers</CardTitle>
//             <CardDescription>
//               {phoneNumbers.length} phone number
//               {phoneNumbers.length !== 1 ? "s" : ""} configured in your
//               organization
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {phoneNumbers.length === 0 ? (
//               <div className="text-center py-12">
//                 <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">
//                   No phone numbers yet
//                 </h3>
//                 <p className="text-muted-foreground mb-6 max-w-md mx-auto">
//                   Add your first Twilio phone number to start receiving calls
//                   through your AI receptionists.
//                 </p>
//                 <Button onClick={() => setShowCreateDialog(true)} size="lg">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Your First Phone Number
//                 </Button>
//               </div>
//             ) : (
//               <div className="rounded-md border overflow-x-auto">
//                 <Table className="min-w-full">
//                   <TableHeader>
//                     <TableRow className="">
//                       <TableHead>Name</TableHead>
//                       <TableHead>Phone Number</TableHead>
//                       <TableHead>Twilio Account SID</TableHead>
//                       <TableHead>Assigned To</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Fallback Number</TableHead>
//                       <TableHead className="text-center">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {phoneNumbers.map((phone) => (
//                       <TableRow key={phone.id}>
//                         <TableCell className="font-medium whitespace-nowrap">
//                           {phone.name}
//                         </TableCell>
//                         <TableCell className="font-mono text-sm">
//                           {phone.phone_number}
//                         </TableCell>
//                         <TableCell className="text-ellipsis max-w-[180px] truncate">
//                           <code className="text-xs bg-muted px-2 py-1 rounded truncate">
//                             {phone.twilio_account_sid.substring(0, 10)}...
//                           </code>
//                         </TableCell>
//                         {/* <TableCell>
//                           <Select
//                             value={phone.receptionist_id || ""}
//                             onValueChange={(value) =>
//                               handleAssignReceptionist(phone.id, value || null)
//                             }
//                           >
//                             <SelectTrigger className="w-40">
//                               <SelectValue placeholder="Unassigned" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="">Unassigned</SelectItem> */}
//                         {/* You would fetch receptionists here */}
//                         {/* <SelectItem value="receptionist-1">
//                                 Main Receptionist
//                               </SelectItem>
//                               <SelectItem value="receptionist-2">
//                                 Sales Line
//                               </SelectItem>
//                             </SelectContent>
//                           </Select> */}
//                         {/* </TableCell> */}
//                         {/* <TableCell>
//                           <Select
//                             value={phone.receptionist_id || "none"}
//                             onValueChange={(value) =>
//                               handleAssignReceptionist(
//                                 phone.id,
//                                 value === "none" ? null : value
//                               )
//                             }
//                           >
//                             <SelectTrigger className="w-40">
//                               <SelectValue placeholder="Unassigned" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="none">Unassigned</SelectItem>
//                               {receptionists.map((receptionist) => (
//                                 <SelectItem
//                                   key={receptionist.id}
//                                   value={receptionist.id}
//                                 >
//                                   {receptionist.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </TableCell> */}
//                         <TableCell>
//                           <div className="flex flex-col gap-1">
//                             <Select
//                               value={phone.receptionist_id || "none"}
//                               onValueChange={(value) =>
//                                 handleAssignReceptionist(
//                                   phone.id,
//                                   value === "none" ? null : value
//                                 )
//                               }
//                             >
//                               <SelectTrigger className=" sm:w-48 md:w-56 lg:w-64">
//                                 <SelectValue placeholder="Unassigned" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="none">Unassigned</SelectItem>
//                                 {receptionists.map((receptionist) => (
//                                   <SelectItem
//                                     key={receptionist.id}
//                                     value={receptionist.id}
//                                   >
//                                     {receptionist.name}(
//                                     {receptionist?.assistant_vapi_id})
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>

//                             {/* Display current assignment */}
//                             {phone.receptionist && (
//                               <div className="text-xs text-green-600 flex items-center gap-1">
//                                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex flex-wrap"></div>
//                                 Currently assigned to: {phone.receptionist.name}
//                                 ({phone.receptionist?.assistant_vapi_id})
//                               </div>
//                             )}
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             variant={phone.is_active ? "default" : "secondary"}
//                             className={
//                               phone.is_active
//                                 ? "bg-green-100 text-green-800 hover:bg-green-100"
//                                 : "bg-gray-100 text-gray-800 hover:bg-gray-100"
//                             }
//                           >
//                             {phone.is_active ? "Active" : "Inactive"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="font-mono text-sm">
//                           {phone.fallback_number}
//                         </TableCell>
//                         <TableCell className=" text-center">
//                           <div className="flex justify-end gap-2">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleEdit(phone)}
//                             >
//                               <Edit className="h-3 w-3 mr-1" />
//                               Edit
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleDelete(phone)}
//                               disabled={!!phone.receptionist_id}
//                             >
//                               <Trash2 className="h-3 w-3 mr-1" />
//                               Delete
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Create/Edit Dialog */}
//       <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
//         <DialogContent className="sm:max-w-[525px]">
//           <DialogHeader>
//             <DialogTitle>
//               {editingPhone ? "Edit Phone Number" : "Add New Phone Number"}
//             </DialogTitle>
//             <DialogDescription>
//               {editingPhone
//                 ? "Update your Twilio phone number details"
//                 : "Add a new Twilio phone number to your organization"}
//             </DialogDescription>
//           </DialogHeader>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Phone Number Name</Label>
//                 <Input
//                   id="name"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   placeholder="e.g., Main Business Line"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="phone_number">Phone Number</Label>
//                 <Input
//                   id="phone_number"
//                   value={formData.phone_number}
//                   onChange={(e) =>
//                     setFormData({ ...formData, phone_number: e.target.value })
//                   }
//                   placeholder="e.g., +1234567890"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="twilio_account_sid">Twilio Account SID</Label>
//                 <Input
//                   id="twilio_account_sid"
//                   value={formData.twilio_account_sid}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       twilio_account_sid: e.target.value,
//                     })
//                   }
//                   placeholder="AC..."
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="twilio_auth_token">Twilio Auth Token</Label>
//                 <Input
//                   id="twilio_auth_token"
//                   type="password"
//                   value={formData.twilio_auth_token}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       twilio_auth_token: e.target.value,
//                     })
//                   }
//                   placeholder="Your Twilio auth token..."
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="fallback_number">Fallback Number</Label>
//                 <Label className="text-sm text-muted-foreground">
//                   Set a fallback destination for inbound calls when the
//                   assistant or agent is not available.{" "}
//                 </Label>
//                 <Input
//                   id="fallback_number"
//                   value={formData.fallback_number}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       fallback_number: e.target.value,
//                     })
//                   }
//                   placeholder="e.g., +1234567890"
//                   required
//                 />
//               </div>
//             </div>

//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={resetForm}>
//                 Cancel
//               </Button>
//               <Button type="submit">
//                 {editingPhone ? "Update Phone Number" : "Add Phone Number"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { getUserWithOrg } from "@/utils/supabase/user";
import { phoneNumberService } from "@/utils/supabase/phone-numbers";
import { PhoneNumber, CreatePhoneNumberData } from "@/types/phone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Phone,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPhone, setEditingPhone] = useState<PhoneNumber | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [receptionists, setReceptionists] = useState<any[]>([]);

  const [formData, setFormData] = useState<CreatePhoneNumberData>({
    name: "",
    phone_number: "",
    twilio_account_sid: "",
    twilio_auth_token: "",
    fallback_number: "",
  });

  const loadReceptionists = async () => {
    if (!orgId) return;

    const { data } = await phoneNumberService.getReceptionistsForAssignment(
      orgId
    );
    setReceptionists(data);
  };

  const loadPhoneNumbers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { orgId: userOrgId, error: userError } = await getUserWithOrg();

      if (userError || !userOrgId) {
        setError("Failed to load organization data");
        return;
      }

      setOrgId(userOrgId);

      console.log("🔄 Loading fresh phone numbers data...");

      const [phonesResult, receptionistsResult] = await Promise.all([
        phoneNumberService.getPhoneNumbers(userOrgId),
        phoneNumberService.getReceptionistsForAssignment(userOrgId),
      ]);

      if (phonesResult.error) {
        setError(`Failed to load phone numbers: ${phonesResult.error.message}`);
        return;
      }

      console.log("✅ Loaded phone numbers:", phonesResult.data);
      console.log("✅ Loaded receptionists:", receptionistsResult.data);

      setPhoneNumbers(phonesResult.data);
      setReceptionists(receptionistsResult.data || []);
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhoneNumbers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!orgId) {
      setError("Organization not found");
      return;
    }

    try {
      if (editingPhone) {
        const { error: updateError } =
          await phoneNumberService.updatePhoneNumber(
            editingPhone.id,
            formData,
            orgId
          );

        if (updateError) {
          setError(`Failed to update phone number: ${updateError.message}`);
          return;
        }

        setSuccess("Phone number updated successfully");
      } else {
        const webhookData = {
          orgId: orgId,
          name: formData.name,
          phone_number: formData.phone_number,
          twilio_account_sid: formData.twilio_account_sid,
          twilio_auth_token: formData.twilio_auth_token,
          fallback_number: formData.fallback_number,
        };

        console.log("Sending webhook data:", webhookData);
        // Send to webhook
        const webhookResponse = await fetch(
          "https://ddconsult.app.n8n.cloud/webhook/phone48391dcb-6b32-4673-a821-fcbf6453d7fe",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(webhookData),
          }
        );

        if (!webhookResponse.ok) {
          throw new Error(`Webhook failed: ${webhookResponse.statusText}`);
        }

        const { error: createError } =
          await phoneNumberService.createPhoneNumber(formData, orgId);

        if (createError) {
          setError(`Failed to create phone number: ${createError.message}`);
          return;
        }

        setSuccess("Phone number created successfully");
      }

      // Reset form and refresh data
      resetForm();
      loadPhoneNumbers();
    } catch (err: any) {
      console.error("Error saving phone number:", err);
      setError(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (phone: PhoneNumber) => {
    if (
      !confirm(
        `Are you sure you want to delete "${phone.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    if (!orgId) return;

    setError(null);
    setSuccess(null);

    try {
      const { error: deleteError } = await phoneNumberService.deletePhoneNumber(
        phone.id,
        orgId
      );

      if (deleteError) {
        setError(`Failed to delete phone number: ${deleteError.message}`);
        return;
      }

      setSuccess("Phone number deleted successfully");
      loadPhoneNumbers();
    } catch (err: any) {
      console.error("Error deleting phone number:", err);
      setError(`Error: ${err.message}`);
    }
  };

  const handleEdit = (phone: PhoneNumber) => {
    setEditingPhone(phone);
    setFormData({
      name: phone.name,
      phone_number: phone.phone_number,
      twilio_account_sid: phone.twilio_account_sid,
      twilio_auth_token: phone.twilio_auth_token,
      fallback_number: phone.fallback_number,
    });
    setShowCreateDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone_number: "",
      twilio_account_sid: "",
      twilio_auth_token: "",
      fallback_number: "",
    });
    setEditingPhone(null);
    setShowCreateDialog(false);
  };

  const handleAssignReceptionist = async (
    phoneNumberId: string,
    receptionistId: string | null
  ) => {
    if (!orgId) return;

    setError(null);
    setSuccess(null);

    console.log("🔄 Assigning phone number:", {
      phoneNumberId,
      receptionistId,
      orgId,
    });

    try {
      const { error } = await phoneNumberService.assignToReceptionist(
        phoneNumberId,
        receptionistId,
        orgId
      );

      if (error) {
        console.error("❌ Assignment error:", error);
        setError(`Failed to assign phone number: ${error.message}`);
        return;
      }

      console.log("✅ Assignment successful");
      setSuccess("Phone number assignment updated");

      // Reload the data to reflect changes
      await loadPhoneNumbers();
    } catch (err: any) {
      console.error("💥 Error assigning phone number:", err);
      setError(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading phone numbers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Phone Numbers
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Manage your Twilio phone numbers and assign them to receptionists
            </p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Phone Number
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Phone Numbers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Phone Numbers</CardTitle>
            <CardDescription>
              {phoneNumbers.length} phone number
              {phoneNumbers.length !== 1 ? "s" : ""} configured in your
              organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {phoneNumbers.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Phone className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No phone numbers yet
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
                  Add your first Twilio phone number to start receiving calls
                  through your AI receptionists.
                </p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Phone Number
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">
                          Name
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Phone Number
                        </TableHead>
                        <TableHead className="whitespace-nowrap hidden lg:table-cell">
                          Twilio SID
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Assigned To
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          Status
                        </TableHead>
                        <TableHead className="whitespace-nowrap hidden md:table-cell">
                          Fallback
                        </TableHead>
                        <TableHead className="whitespace-nowrap text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {phoneNumbers.map((phone) => (
                        <TableRow key={phone.id}>
                          <TableCell className="font-medium whitespace-nowrap max-w-[120px] truncate">
                            {phone.name}
                          </TableCell>
                          <TableCell className="font-mono text-xs sm:text-sm whitespace-nowrap">
                            {phone.phone_number}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded truncate inline-block max-w-[140px]">
                              {phone.twilio_account_sid.substring(0, 8)}...
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 min-w-[140px]">
                              <Select
                                value={phone.receptionist_id || "none"}
                                onValueChange={(value) =>
                                  handleAssignReceptionist(
                                    phone.id,
                                    value === "none" ? null : value
                                  )
                                }
                              >
                                <SelectTrigger className="w-full text-xs sm:text-sm">
                                  <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">
                                    Unassigned
                                  </SelectItem>
                                  {receptionists.map((receptionist) => (
                                    <SelectItem
                                      key={receptionist.id}
                                      value={receptionist.id}
                                      className="text-xs sm:text-sm"
                                    >
                                      <span className="truncate block max-w-[200px]">
                                        {receptionist.name} (
                                        {receptionist?.assistant_vapi_id})
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {phone.receptionist && (
                                <div className="text-xs text-green-600 flex items-center gap-1 truncate">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></div>
                                  <span className="truncate">
                                    {phone.receptionist.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                phone.is_active ? "default" : "secondary"
                              }
                              className={
                                phone.is_active
                                  ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100 text-xs"
                              }
                            >
                              {phone.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">
                            {phone.fallback_number}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1 sm:gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(phone)}
                                className="h-8 px-2 sm:px-3"
                              >
                                <Edit className="h-3 w-3 sm:mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(phone)}
                                disabled={!!phone.receptionist_id}
                                className="h-8 px-2 sm:px-3"
                              >
                                <Trash2 className="h-3 w-3 sm:mr-1" />
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-[525px] mx-2">
          <DialogHeader>
            <DialogTitle>
              {editingPhone ? "Edit Phone Number" : "Add New Phone Number"}
            </DialogTitle>
            <DialogDescription>
              {editingPhone
                ? "Update your Twilio phone number details"
                : "Add a new Twilio phone number to your organization"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label htmlFor="name">Phone Number Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Main Business Line"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  placeholder="e.g., +1234567890"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilio_account_sid">Twilio Account SID</Label>
                <Input
                  id="twilio_account_sid"
                  value={formData.twilio_account_sid}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      twilio_account_sid: e.target.value,
                    })
                  }
                  placeholder="AC..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilio_auth_token">Twilio Auth Token</Label>
                <Input
                  id="twilio_auth_token"
                  type="password"
                  value={formData.twilio_auth_token}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      twilio_auth_token: e.target.value,
                    })
                  }
                  placeholder="Your Twilio auth token..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fallback_number">Fallback Number</Label>
                <Label className="text-sm text-muted-foreground">
                  Set a fallback destination for inbound calls when the
                  assistant or agent is not available.{" "}
                </Label>
                <Input
                  id="fallback_number"
                  value={formData.fallback_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fallback_number: e.target.value,
                    })
                  }
                  placeholder="e.g., +1234567890"
                  required
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {editingPhone ? "Update Phone Number" : "Add Phone Number"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
