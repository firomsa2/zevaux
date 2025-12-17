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

//   return (
//     <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
//           <div className="flex-1">
//             <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
//               Phone Numbers
//             </h1>
//             <p className="text-muted-foreground mt-2 text-sm sm:text-base">
//               Manage your Twilio phone numbers and assign them to receptionists
//             </p>
//           </div>
//           <Button
//             onClick={() => setShowCreateDialog(true)}
//             className="flex items-center gap-2 w-full sm:w-auto"
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
//               <div className="text-center py-8 sm:py-12">
//                 <Phone className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">
//                   No phone numbers yet
//                 </h3>
//                 <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
//                   Add your first Twilio phone number to start receiving calls
//                   through your AI receptionists.
//                 </p>
//                 <Button
//                   onClick={() => setShowCreateDialog(true)}
//                   size="lg"
//                   className="w-full sm:w-auto"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Your First Phone Number
//                 </Button>
//               </div>
//             ) : (
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <Table className="min-w-full">
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead className="whitespace-nowrap">
//                           Name
//                         </TableHead>
//                         <TableHead className="whitespace-nowrap">
//                           Phone Number
//                         </TableHead>
//                         <TableHead className="whitespace-nowrap hidden lg:table-cell">
//                           Twilio SID
//                         </TableHead>
//                         <TableHead className="whitespace-nowrap">
//                           Assigned To
//                         </TableHead>
//                         <TableHead className="whitespace-nowrap">
//                           Status
//                         </TableHead>
//                         <TableHead className="whitespace-nowrap hidden md:table-cell">
//                           Fallback
//                         </TableHead>
//                         <TableHead className="whitespace-nowrap text-right">
//                           Actions
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {phoneNumbers.map((phone) => (
//                         <TableRow key={phone.id}>
//                           <TableCell className="font-medium whitespace-nowrap max-w-[120px] truncate">
//                             {phone.name}
//                           </TableCell>
//                           <TableCell className="font-mono text-xs sm:text-sm whitespace-nowrap">
//                             {phone.phone_number}
//                           </TableCell>
//                           <TableCell className="hidden lg:table-cell">
//                             <code className="text-xs bg-muted px-1.5 py-0.5 rounded truncate inline-block max-w-[140px]">
//                               {phone.twilio_account_sid.substring(0, 8)}...
//                             </code>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex flex-col gap-1 min-w-[140px]">
//                               <Select
//                                 value={phone.receptionist_id || "none"}
//                                 onValueChange={(value) =>
//                                   handleAssignReceptionist(
//                                     phone.id,
//                                     value === "none" ? null : value
//                                   )
//                                 }
//                               >
//                                 <SelectTrigger className="w-full text-xs sm:text-sm">
//                                   <SelectValue placeholder="Unassigned" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="none">
//                                     Unassigned
//                                   </SelectItem>
//                                   {receptionists.map((receptionist) => (
//                                     <SelectItem
//                                       key={receptionist.id}
//                                       value={receptionist.id}
//                                       className="text-xs sm:text-sm"
//                                     >
//                                       <span className="truncate block max-w-[200px]">
//                                         {receptionist.name} (
//                                         {receptionist?.assistant_vapi_id})
//                                       </span>
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>

//                               {phone.receptionist && (
//                                 <div className="text-xs text-green-600 flex items-center gap-1 truncate">
//                                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></div>
//                                   <span className="truncate">
//                                     {phone.receptionist.name}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <Badge
//                               variant={
//                                 phone.is_active ? "default" : "secondary"
//                               }
//                               className={
//                                 phone.is_active
//                                   ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs"
//                                   : "bg-gray-100 text-gray-800 hover:bg-gray-100 text-xs"
//                               }
//                             >
//                               {phone.is_active ? "Active" : "Inactive"}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="font-mono text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">
//                             {phone.fallback_number}
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex justify-end gap-1 sm:gap-2">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleEdit(phone)}
//                                 className="h-8 px-2 sm:px-3"
//                               >
//                                 <Edit className="h-3 w-3 sm:mr-1" />
//                                 <span className="hidden sm:inline">Edit</span>
//                               </Button>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleDelete(phone)}
//                                 disabled={!!phone.receptionist_id}
//                                 className="h-8 px-2 sm:px-3"
//                               >
//                                 <Trash2 className="h-3 w-3 sm:mr-1" />
//                                 <span className="hidden sm:inline">Delete</span>
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Create/Edit Dialog */}
//       <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
//         <DialogContent className="max-w-[95vw] sm:max-w-[525px] mx-2">
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
//             <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto px-1">
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

//             <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={resetForm}
//                 className="w-full sm:w-auto"
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" className="w-full sm:w-auto">
//                 {editingPhone ? "Update Phone Number" : "Add Phone Number"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { getUserWithOrg } from "@/utils/supabase/user";
// import { phoneNumberService } from "@/utils/supabase/phone-numbers";
// import { PhoneNumber } from "@/types/phone";
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
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Plus,
//   Phone,
//   Edit,
//   Trash2,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
//   X,
//   Search,
//   Globe,
//   Check,
//   ChevronsUpDown,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// // Country data - you can expand this list
// const COUNTRIES = [
//   { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
//   { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
//   { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
//   { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
//   { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
//   { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
//   { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
//   { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
//   { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
//   { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
// ];

// interface AvailableNumber {
//   phoneNumber: string;
//   countryCode: string;
//   capabilities: string[];
//   region?: string;
//   monthlyPrice?: number;
// }

// export default function PhoneNumbersPage() {
//   const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchingNumbers, setSearchingNumbers] = useState(false);
//   const [purchasingNumber, setPurchasingNumber] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [businessId, setBusinessId] = useState<string | null>(null);
//   const [receptionists, setReceptionists] = useState<any[]>([]);

//   // New number purchase states
//   const [showBuyDialog, setShowBuyDialog] = useState(false);
//   const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
//   const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>(
//     []
//   );
//   const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
//   const [phoneNumberName, setPhoneNumberName] = useState("");
//   const [searchPrefix, setSearchPrefix] = useState("");
//   const [openCountryDropdown, setOpenCountryDropdown] = useState(false);

//   const loadPhoneNumbers = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const { businessId: userBusinessId, error: userError } =
//         await getUserWithOrg();

//       if (userError || !userBusinessId) {
//         setError("Failed to load organization data");
//         return;
//       }

//       setBusinessId(userBusinessId);

//       console.log("🔄 Loading fresh phone numbers data...");

//       const [phonesResult, receptionistsResult] = await Promise.all([
//         phoneNumberService.getPhoneNumbers(userBusinessId),
//         phoneNumberService.getReceptionistsForAssignment(userBusinessId),
//       ]);

//       if (phonesResult.error) {
//         setError(`Failed to load phone numbers: ${phonesResult.error.message}`);
//         return;
//       }

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

//   // Search for available numbers
//   const handleSearchNumbers = async () => {
//     if (!orgId) {
//       setError("Organization not found");
//       return;
//     }

//     setSearchingNumbers(true);
//     setError(null);
//     setAvailableNumbers([]);
//     setSelectedNumber(null);

//     try {
//       const searchData = {
//         orgId,
//         countryCode: selectedCountry.code,
//         dialCode: selectedCountry.dialCode,
//         areaCode: searchPrefix,
//         capabilities: ["voice", "sms", "mms"], // You can make this selectable
//       };

//       console.log("Searching numbers with:", searchData);

//       // Call your n8n webhook to search for available numbers
//       const response = await fetch(
//         "https://ddconsult.app.n8n.cloud/webhook/active39cd31ba-70b1-4680-8d7f-b4b52502b44b",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(searchData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to search numbers: ${response.statusText}`);
//       }

//       const data = await response.json();

//       if (data.numbers && Array.isArray(data.numbers)) {
//         setAvailableNumbers(data.numbers);
//         if (data.numbers.length === 0) {
//           setError(
//             "No numbers found for your search criteria. Try a different area code."
//           );
//         }
//       } else {
//         // Fallback to mock data if webhook isn't ready
//         setAvailableNumbers(generateMockNumbers());
//       }
//     } catch (err: any) {
//       console.error("Error searching numbers:", err);
//       setError(`Error searching numbers: ${err.message}`);
//       // Use mock data for demo
//       setAvailableNumbers(generateMockNumbers());
//     } finally {
//       setSearchingNumbers(false);
//     }
//   };

//   // Purchase selected number
//   const handlePurchaseNumber = async () => {
//     if (!selectedNumber || !orgId || !phoneNumberName.trim()) {
//       setError("Please select a number and provide a name");
//       return;
//     }

//     setPurchasingNumber(true);
//     setError(null);

//     try {
//       const purchaseData = {
//         orgId,
//         name: phoneNumberName,
//         phone_number: selectedNumber,
//         countryCode: selectedCountry.code,
//         capabilities: ["voice", "sms", "mms"],
//       };

//       console.log("Purchasing number:", purchaseData);

//       // Call your n8n webhook to purchase the number
//       const response = await fetch(
//         "https://ddconsult.app.n8n.cloud/webhook/buy39cd31ba-70b1-4680-8d7f-b4b52502b44b", // Update this URL
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(purchaseData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to purchase number: ${response.statusText}`);
//       }

//       const result = await response.json();

//       if (result.success) {
//         // Save to your database
//         const { error: createError } =
//           await phoneNumberService.createPhoneNumber(
//             {
//               name: phoneNumberName,
//               phone_number: selectedNumber,
//               twilio_account_sid: result.twilioAccountSid || "pending",
//               twilio_auth_token: result.twilioAuthToken || "pending",
//               fallback_number: "", // You can add this as another field
//             },
//             orgId
//           );

//         if (createError) {
//           throw new Error(`Failed to save number: ${createError.message}`);
//         }

//         setSuccess(`Successfully purchased ${selectedNumber}!`);
//         setShowBuyDialog(false);
//         resetPurchaseForm();
//         loadPhoneNumbers();
//       } else {
//         throw new Error(result.message || "Purchase failed");
//       }
//     } catch (err: any) {
//       console.error("Error purchasing number:", err);
//       setError(`Error: ${err.message}`);
//     } finally {
//       setPurchasingNumber(false);
//     }
//   };

//   // Reset purchase form
//   const resetPurchaseForm = () => {
//     setSelectedCountry(COUNTRIES[0]);
//     setAvailableNumbers([]);
//     setSelectedNumber(null);
//     setPhoneNumberName("");
//     setSearchPrefix("");
//   };

//   // Mock data generator for demo
//   const generateMockNumbers = (): AvailableNumber[] => {
//     const prefixes = [
//       "201",
//       "202",
//       "212",
//       "310",
//       "415",
//       "646",
//       "702",
//       "713",
//       "818",
//       "917",
//     ];
//     const areaCode =
//       searchPrefix || prefixes[Math.floor(Math.random() * prefixes.length)];

//     return Array.from({ length: 6 }, (_, i) => ({
//       phoneNumber: `${selectedCountry.dialCode}${areaCode}${String(
//         1000000 + Math.floor(Math.random() * 9000000)
//       ).slice(1)}`,
//       countryCode: selectedCountry.code,
//       capabilities: ["voice", "sms"],
//       region: [
//         "New York",
//         "Los Angeles",
//         "Chicago",
//         "Miami",
//         "Dallas",
//         "Seattle",
//       ][i % 6],
//       monthlyPrice: 1.0 + Math.random() * 2.0,
//     }));
//   };

//   // Handle number assignment (from your existing code)
//   const handleAssignReceptionist = async (
//     phoneNumberId: string,
//     receptionistId: string | null
//   ) => {
//     if (!orgId) return;
//     // ... (your existing code)
//   };

//   const handleDelete = async (phone: PhoneNumber) => {
//     // ... (your existing code)
//   };

//   const handleEdit = (phone: PhoneNumber) => {
//     // ... (your existing code)
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

//   return (
//     <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
//           <div className="flex-1">
//             <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
//               Phone Numbers
//             </h1>
//             <p className="text-muted-foreground mt-2 text-sm sm:text-base">
//               Manage your phone numbers and assign them to receptionists
//             </p>
//           </div>
//           <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
//             <DialogTrigger asChild>
//               <Button className="flex items-center gap-2 w-full sm:w-auto">
//                 <Plus className="h-4 w-4" />
//                 Get New Number
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>Get a New Phone Number</DialogTitle>
//                 <DialogDescription>
//                   Search for available numbers and add them to your organization
//                 </DialogDescription>
//               </DialogHeader>

//               <div className="space-y-6 py-4">
//                 {/* Alerts */}
//                 {error && (
//                   <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertDescription>{error}</AlertDescription>
//                   </Alert>
//                 )}

//                 {/* Step 1: Country Selection */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">1. Select Country</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>Country</Label>
//                       <Popover
//                         open={openCountryDropdown}
//                         onOpenChange={setOpenCountryDropdown}
//                       >
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             role="combobox"
//                             aria-expanded={openCountryDropdown}
//                             className="w-full justify-between"
//                           >
//                             {selectedCountry ? (
//                               <div className="flex items-center gap-2">
//                                 <span>{selectedCountry.flag}</span>
//                                 <span>{selectedCountry.name}</span>
//                                 <span className="text-muted-foreground">
//                                   ({selectedCountry.dialCode})
//                                 </span>
//                               </div>
//                             ) : (
//                               "Select country..."
//                             )}
//                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-full p-0">
//                           <Command>
//                             <CommandInput placeholder="Search country..." />
//                             <CommandList>
//                               <CommandEmpty>No country found.</CommandEmpty>
//                               <CommandGroup>
//                                 {COUNTRIES.map((country) => (
//                                   <CommandItem
//                                     key={country.code}
//                                     value={country.name}
//                                     onSelect={() => {
//                                       setSelectedCountry(country);
//                                       setOpenCountryDropdown(false);
//                                     }}
//                                   >
//                                     <Check
//                                       className={cn(
//                                         "mr-2 h-4 w-4",
//                                         selectedCountry.code === country.code
//                                           ? "opacity-100"
//                                           : "opacity-0"
//                                       )}
//                                     />
//                                     <span className="mr-2">{country.flag}</span>
//                                     {country.name}
//                                     <span className="ml-auto text-muted-foreground">
//                                       {country.dialCode}
//                                     </span>
//                                   </CommandItem>
//                                 ))}
//                               </CommandGroup>
//                             </CommandList>
//                           </Command>
//                         </PopoverContent>
//                       </Popover>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="areaCode">
//                         Area Code / Prefix (Optional)
//                       </Label>
//                       <Input
//                         id="areaCode"
//                         placeholder="e.g., 212 for New York"
//                         value={searchPrefix}
//                         onChange={(e) =>
//                           setSearchPrefix(
//                             e.target.value.replace(/\D/g, "").slice(0, 3)
//                           )
//                         }
//                       />
//                       <p className="text-sm text-muted-foreground">
//                         Leave empty for any available number
//                       </p>
//                     </div>
//                   </div>

//                   <Button
//                     onClick={handleSearchNumbers}
//                     disabled={searchingNumbers}
//                     className="w-full"
//                   >
//                     {searchingNumbers ? (
//                       <>
//                         <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                         Searching Numbers...
//                       </>
//                     ) : (
//                       <>
//                         <Search className="h-4 w-4 mr-2" />
//                         Search Available Numbers
//                       </>
//                     )}
//                   </Button>
//                 </div>

//                 {/* Step 2: Available Numbers */}
//                 {availableNumbers.length > 0 && (
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">
//                       2. Select a Number
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                       {availableNumbers.map((number, index) => (
//                         <Card
//                           key={index}
//                           className={cn(
//                             "cursor-pointer transition-all hover:border-primary",
//                             selectedNumber === number.phoneNumber
//                               ? "border-primary border-2 bg-primary/5"
//                               : ""
//                           )}
//                           onClick={() => setSelectedNumber(number.phoneNumber)}
//                         >
//                           <CardContent className="p-4">
//                             <div className="flex items-start justify-between">
//                               <div>
//                                 <p className="font-mono font-bold text-lg">
//                                   {number.phoneNumber}
//                                 </p>
//                                 <div className="flex flex-wrap gap-1 mt-2">
//                                   {number.capabilities?.map((cap) => (
//                                     <Badge
//                                       key={cap}
//                                       variant="secondary"
//                                       className="text-xs"
//                                     >
//                                       {cap.toUpperCase()}
//                                     </Badge>
//                                   ))}
//                                 </div>
//                                 {number.region && (
//                                   <p className="text-sm text-muted-foreground mt-1">
//                                     {number.region}
//                                   </p>
//                                 )}
//                               </div>
//                               {selectedNumber === number.phoneNumber && (
//                                 <Check className="h-5 w-5 text-primary" />
//                               )}
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Step 3: Purchase */}
//                 {selectedNumber && (
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">
//                       3. Configure Number
//                     </h3>
//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="phoneName">Number Name</Label>
//                         <Input
//                           id="phoneName"
//                           placeholder="e.g., Main Business Line"
//                           value={phoneNumberName}
//                           onChange={(e) => setPhoneNumberName(e.target.value)}
//                           required
//                         />
//                         <p className="text-sm text-muted-foreground">
//                           Give this number a descriptive name
//                         </p>
//                       </div>

//                       <div className="p-4 border rounded-lg bg-muted/50">
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <p className="font-semibold">Selected Number</p>
//                             <p className="font-mono text-lg">
//                               {selectedNumber}
//                             </p>
//                           </div>
//                           <Badge variant="outline">
//                             {selectedCountry.flag} {selectedCountry.name}
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <DialogFooter className="flex flex-col sm:flex-row gap-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => {
//                     setShowBuyDialog(false);
//                     resetPurchaseForm();
//                   }}
//                   className="w-full sm:w-auto"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={handlePurchaseNumber}
//                   disabled={
//                     !selectedNumber ||
//                     purchasingNumber ||
//                     !phoneNumberName.trim()
//                   }
//                   className="w-full sm:w-auto"
//                 >
//                   {purchasingNumber ? (
//                     <>
//                       <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                       Purchasing...
//                     </>
//                   ) : (
//                     `Purchase ${selectedNumber}`
//                   )}
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Success Alert */}
//         {success && (
//           <Alert className="bg-green-50 border-green-200">
//             <CheckCircle className="h-4 w-4 text-green-600" />
//             <AlertDescription className="text-green-800">
//               {success}
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Error Alert */}
//         {error && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {/* Existing Phone Numbers Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Your Phone Numbers</CardTitle>
//             <CardDescription>
//               {phoneNumbers.length} phone number
//               {phoneNumbers.length !== 1 ? "s" : ""} in your organization
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* ... (your existing table code) */}
//             {phoneNumbers.length === 0 ? (
//               <div className="text-center py-12">
//                 <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">
//                   No phone numbers yet
//                 </h3>
//                 <p className="text-muted-foreground mb-6 max-w-md mx-auto">
//                   Get your first phone number to start receiving calls through
//                   your AI receptionists.
//                 </p>
//                 <Button onClick={() => setShowBuyDialog(true)} size="lg">
//                   Get Your First Number
//                 </Button>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Name</TableHead>
//                       <TableHead>Phone Number</TableHead>
//                       <TableHead>Country</TableHead>
//                       <TableHead>Assigned To</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {phoneNumbers.map((phone) => (
//                       <TableRow key={phone.id}>
//                         <TableCell className="font-medium">
//                           {phone.name}
//                         </TableCell>
//                         <TableCell className="font-mono">
//                           {phone.phone_number}
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="outline">
//                             {phone.phone_number.startsWith("+1")
//                               ? "🇺🇸 US"
//                               : phone.phone_number.startsWith("+44")
//                               ? "🇬🇧 UK"
//                               : phone.phone_number.startsWith("+61")
//                               ? "🇦🇺 AU"
//                               : "🌍 Global"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           {/* Assignment dropdown - use your existing code */}
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
//                         <TableCell className="text-right">
//                           <div className="flex justify-end gap-2">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleEdit(phone)}
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleDelete(phone)}
//                             >
//                               <Trash2 className="h-4 w-4" />
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
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { getUserWithBusiness } from "@/utils/supabase/user";
import { phoneNumberService } from "@/utils/supabase/phone-numbers";
import { PhoneNumber } from "@/types/phone";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Phone,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Check,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Country data
const COUNTRIES = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
];

interface AvailableNumber {
  phoneNumber: string;
  // countryCode: string;
  // capabilities: string[];
  // region?: string;
  // monthlyPrice?: number;
}

export default function PhoneNumbersPage() {
  const [phoneEndpoints, setPhoneEndpoints] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchingNumbers, setSearchingNumbers] = useState(false);
  const [purchasingNumber, setPurchasingNumber] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  // New endpoint purchase states
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>(
    []
  );
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [phoneNumberName, setPhoneNumberName] = useState("");
  const [searchPrefix, setSearchPrefix] = useState("");
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [channelType, setChannelType] = useState<"voice" | "sms" | "whatsapp">(
    "voice"
  );

  console.log("available ", availableNumbers);
  const loadPhoneEndpoints = async () => {
    setLoading(true);
    setError(null);

    try {
      const { businessId: userBusinessId, error: userError } =
        await getUserWithBusiness();

      if (userError || !userBusinessId) {
        setError("Failed to load business data");
        return;
      }

      setBusinessId(userBusinessId);

      console.log("🔄 Loading fresh phone endpoints data...");

      const { data, error: endpointsError } =
        await phoneNumberService.getPhoneNumbers(userBusinessId);

      if (endpointsError) {
        setError(`Failed to load phone endpoints: ${endpointsError.message}`);
        return;
      }

      setPhoneEndpoints(data || []);
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhoneEndpoints();
  }, []);

  // Search for available numbers via n8n
  const handleSearchNumbers = async () => {
    if (!businessId) {
      setError("Business not found");
      return;
    }

    setSearchingNumbers(true);
    setError(null);
    setAvailableNumbers([]);
    setSelectedNumber(null);

    try {
      const searchData = {
        businessId,
        countryCode: selectedCountry.code,
        // dialCode: selectedCountry.dialCode,
        // areaCode: searchPrefix,
        // channelType: channelType,
        // timestamp: new Date().toISOString(),
      };

      console.log("🔍 Searching numbers via n8n:", searchData);

      // Call n8n webhook to search for available numbers

      const response = await fetch(
        "https://ddconsult.app.n8n.cloud/webhook/active39cd31ba-70b1-4680-8d7f-b4b52502b44b", // Your n8n webhook URL for searching
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to search numbers: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("🚀 ~ handleSearchNumbers ~ result:", result);

      if (result && Array.isArray(result)) {
        setAvailableNumbers(result);
        if (result.length === 0) {
          setError(
            "No numbers found for your search criteria. Try a different area code or country."
          );
        }
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        throw new Error("Invalid response from number search service");
      }
      if (Array.isArray(result)) {
        const normalized = result.map((n) => ({
          phoneNumber: n.phone_number,
        }));

        setAvailableNumbers(normalized);
      }
    } catch (err: any) {
      console.error("Error searching numbers:", err);
      setError(`Error searching numbers: ${err.message}`);
    } finally {
      setSearchingNumbers(false);
    }
  };

  // Purchase selected number via n8n
  const handlePurchaseNumber = async () => {
    if (!selectedNumber || !businessId || !phoneNumberName.trim()) {
      setError(
        "Please select a number, provide a name, and select channel type"
      );
      return;
    }

    setPurchasingNumber(true);
    setError(null);

    try {
      const purchaseData = {
        businessId,
        name: phoneNumberName,
        phoneNumber: selectedNumber,
        // countryCode: selectedCountry.code,
        // channelType: channelType,
        // areaCode:
        //   searchPrefix ||
        //   selectedNumber.substring(
        //     selectedCountry.dialCode.length,
        //     selectedCountry.dialCode.length + 3
        //   ),
        // timestamp: new Date().toISOString(),
      };

      console.log("🛒 Purchasing number via n8n:", purchaseData);

      // Call n8n webhook to purchase the number
      const response = await fetch(
        "https://ddconsult.app.n8n.cloud/webhook/buy39cd31ba-70b1-4680-8d7f-b4b52502b44b", // Your n8n webhook URL for purchasing
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(purchaseData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to purchase number: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("🚀 ~ handlePurchaseNumber ~ result:", result)

      if (result.success) {
        console.log("✅ Purchase successful, creating local record...");

        // Create local record in phone_endpoints
        const { data: newEndpoint, error: createError } =
          await phoneNumberService.createPhoneNumber(
            {
              name: phoneNumberName,
              phone_number: selectedNumber,
              channel_type: channelType,
              // Add any other required fields
            },
            businessId
          );

        if (createError) {
          console.warn(
            "Created in n8n but local creation failed:",
            createError
          );
          // Still show success since n8n handled it, but log the error
        }

        setSuccess(
          `Successfully purchased ${selectedNumber}! The number is being configured...`
        );
        setShowBuyDialog(false);
        resetPurchaseForm();
        loadPhoneEndpoints();
      } else {
        throw new Error(result.error || "Purchase failed");
      }
    } catch (err: any) {
      console.error("Error purchasing number:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setPurchasingNumber(false);
    }
  };

  // Reset purchase form
  const resetPurchaseForm = () => {
    setSelectedCountry(COUNTRIES[0]);
    setAvailableNumbers([]);
    setSelectedNumber(null);
    setPhoneNumberName("");
    setSearchPrefix("");
    setChannelType("voice");
  };

  const handleDelete = async (phone: PhoneNumber) => {
    if (
      !businessId ||
      !confirm("Are you sure you want to delete this phone endpoint?")
    ) {
      return;
    }

    // Optionally: Call n8n webhook to release the number from Twilio
    try {
      // You might want to call an n8n webhook to release the number first
      const releaseResponse = await fetch(
        "https://ddconsult.app.n8n.cloud/webhook/release-number",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessId,
            phoneNumber: phone.phone_number,
            phoneId: phone.id,
          }),
        }
      );

      if (!releaseResponse.ok) {
        console.warn(
          "Failed to release number from provider, continuing with local deletion"
        );
      }
    } catch (releaseError) {
      console.warn("Error releasing number:", releaseError);
    }

    // Delete local record
    const { error: deleteError } = await phoneNumberService.deletePhoneNumber(
      phone.id,
      businessId
    );

    if (deleteError) {
      setError(`Failed to delete: ${deleteError.message}`);
    } else {
      setSuccess("Phone endpoint deleted successfully");
      loadPhoneEndpoints();
    }
  };

  const handleEdit = async (phone: PhoneNumber) => {
    const newName = prompt(
      "Enter new name for the phone endpoint:",
      phone.name
    );
    if (newName && businessId) {
      const { error: updateError } = await phoneNumberService.updatePhoneNumber(
        phone.id,
        { name: newName },
        businessId
      );

      if (updateError) {
        setError(`Failed to update: ${updateError.message}`);
      } else {
        setSuccess("Phone endpoint updated successfully");
        loadPhoneEndpoints();
      }
    }
  };

  const handleToggleStatus = async (phone: PhoneNumber) => {
    if (!businessId) return;

    const newStatus = !phone.is_active;
    const { error: updateError } = await phoneNumberService.updatePhoneNumber(
      phone.id,
      { is_active: newStatus },
      businessId
    );

    if (updateError) {
      setError(`Failed to update status: ${updateError.message}`);
    } else {
      setSuccess(
        `Phone endpoint ${newStatus ? "activated" : "deactivated"} successfully`
      );
      loadPhoneEndpoints();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading phone endpoints...</p>
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
              Phone Endpoints
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Manage your phone endpoints and communication channels
            </p>
          </div>
          <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Purchase New Number
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Purchase New Phone Number</DialogTitle>
                <DialogDescription>
                  Search for available numbers and purchase through our n8n
                  integration
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Alerts */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Step 1: Channel Type */}
                {/* <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    1. Select Channel Type
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(["voice", "sms", "whatsapp"] as const).map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={channelType === type ? "default" : "outline"}
                        onClick={() => setChannelType(type)}
                        className="capitalize"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {channelType === "voice" && "Voice calls only"}
                    {channelType === "sms" && "Text messages (SMS)"}
                    {channelType === "whatsapp" && "WhatsApp messaging"}
                  </p>
                </div> */}

                {/* Step 2: Country Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Country</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Popover
                        open={openCountryDropdown}
                        onOpenChange={setOpenCountryDropdown}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCountryDropdown}
                            className="w-full justify-between"
                          >
                            {selectedCountry ? (
                              <div className="flex items-center gap-2">
                                <span>{selectedCountry.flag}</span>
                                <span>{selectedCountry.name}</span>
                                <span className="text-muted-foreground">
                                  ({selectedCountry.dialCode})
                                </span>
                              </div>
                            ) : (
                              "Select country..."
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandList>
                              <CommandEmpty>No country found.</CommandEmpty>
                              <CommandGroup>
                                {COUNTRIES.map((country) => (
                                  <CommandItem
                                    key={country.code}
                                    value={country.name}
                                    onSelect={() => {
                                      setSelectedCountry(country);
                                      setOpenCountryDropdown(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedCountry.code === country.code
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <span className="mr-2">{country.flag}</span>
                                    {country.name}
                                    <span className="ml-auto text-muted-foreground">
                                      {country.dialCode}
                                    </span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="areaCode">Area Code (Optional)</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 border rounded bg-gray-50">
                          {selectedCountry.dialCode}
                        </div>
                        <Input
                          id="areaCode"
                          placeholder="e.g., 212"
                          value={searchPrefix}
                          onChange={(e) =>
                            setSearchPrefix(
                              e.target.value.replace(/\D/g, "").slice(0, 3)
                            )
                          }
                          className="flex-1"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Leave empty for any available number
                      </p>
                    </div> */}
                  </div>

                  <Button
                    onClick={handleSearchNumbers}
                    disabled={searchingNumbers}
                    className="w-full"
                  >
                    {searchingNumbers ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Searching Available Numbers...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search Available Numbers
                      </>
                    )}
                  </Button>
                </div>

                {/* Step 3: Available Numbers */}
                {availableNumbers.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      3. Select a Number ({availableNumbers.length} available)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                      {availableNumbers.map((number, index) => (
                        <Card
                          key={index}
                          className={cn(
                            "cursor-pointer transition-all hover:border-primary",
                            selectedNumber === number.phoneNumber
                              ? "border-primary border-2 bg-primary/5"
                              : ""
                          )}
                          onClick={() => setSelectedNumber(number.phoneNumber)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-mono font-bold">
                                  {number.phoneNumber}
                                </p>
                                {/* <div className="flex flex-wrap gap-1 mt-1">
                                  {number.capabilities?.map((cap) => (
                                    <Badge
                                      key={cap}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {cap.toUpperCase()}
                                    </Badge>
                                  ))}
                                </div> */}
                                {/* {number.region && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {number.region}
                                  </p>
                                )}
                                {number.monthlyPrice && (
                                  <p className="text-xs font-semibold mt-1">
                                    ${number.monthlyPrice.toFixed(2)}/month
                                  </p>
                                )} */}
                              </div>
                              {selectedNumber === number.phoneNumber && (
                                <Check className="h-5 w-5 text-primary shrink-0" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Configure & Purchase */}
                {selectedNumber && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      4. Configure & Purchase
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneName">Friendly Name *</Label>
                        <Input
                          id="phoneName"
                          placeholder="e.g., Main Business Line, Support Hotline"
                          value={phoneNumberName}
                          onChange={(e) => setPhoneNumberName(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          This name will help you identify this number in your
                          dashboard
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-muted/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <p className="font-semibold">Selected Number</p>
                            <p className="font-mono text-lg font-bold">
                              {selectedNumber}
                            </p>
                            
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mt-1">
                              {/* <Badge variant="outline" className="capitalize">
                                {channelType}
                              </Badge> */}
                              <Badge variant="outline">
                                {selectedCountry.flag}
                                 {selectedCountry.name}
                              </Badge>
                            </div>
                            {/* <p className="text-sm text-muted-foreground">
                              Monthly cost
                            </p>
                            <p className="text-xl font-bold">$1.00</p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowBuyDialog(false);
                    resetPurchaseForm();
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handlePurchaseNumber}
                  disabled={
                    !selectedNumber ||
                    purchasingNumber ||
                    !phoneNumberName.trim()
                  }
                  className="w-full sm:w-auto"
                >
                  {purchasingNumber ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing Purchase...
                    </>
                  ) : (
                    `Purchase ${selectedNumber}`
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Success Alert */}
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto -mr-2 -my-2"
              onClick={() => setSuccess(null)}
            >
              Dismiss
            </Button>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto -mr-2 -my-2 text-white hover:text-white hover:bg-red-800"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </Alert>
        )}

        {/* Phone Endpoints Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Your Phone Endpoints</CardTitle>
                <CardDescription>
                  {phoneEndpoints.length} endpoint
                  {phoneEndpoints.length !== 1 ? "s" : ""} in your business
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadPhoneEndpoints}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {phoneEndpoints.length === 0 ? (
              <div className="text-center py-12">
                <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No phone endpoints yet
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Purchase your first phone number to start receiving calls and
                  messages.
                </p>
                <Button onClick={() => setShowBuyDialog(true)} size="lg">
                  Purchase Your First Number
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {phoneEndpoints.map((endpoint) => (
                      <TableRow key={endpoint.id}>
                        <TableCell className="font-medium">
                          {endpoint.name}
                        </TableCell>
                        <TableCell className="font-mono">
                          {endpoint.phone_number}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {endpoint.channel_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {endpoint.phone_number.startsWith("+1")
                              ? "🇺🇸 US"
                              : endpoint.phone_number.startsWith("+44")
                              ? "🇬🇧 UK"
                              : endpoint.phone_number.startsWith("+61")
                              ? "🇦🇺 AU"
                              : "🌍 Global"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(endpoint)}
                              className="h-6 px-2"
                            >
                              <Badge
                                variant={
                                  endpoint.is_active ? "default" : "secondary"
                                }
                                className={
                                  endpoint.is_active
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                }
                              >
                                {endpoint.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(endpoint.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(endpoint)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(endpoint)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
