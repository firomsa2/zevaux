"use client";

import { useEffect, useState } from "react";
import { getUserWithBusiness } from "@/utils/supabase/user";
import { smsService } from "@/utils/supabase/sms";
import {
  SMS,
  CreateSMSData,
  UpdateSMSData,
  SMSStats,
  SMSMode,
  SMSFilters,
} from "@/types/sms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SMSList } from "@/components/sms/sms-list";
import { SMSStats as SMSStatsComponent } from "@/components/sms/sms-stats";
import { SMSForm } from "@/components/sms/sms-form";
import { ModeSelector } from "@/components/sms/mode-selector";
import { SMSFilters as SMSFiltersComponent } from "@/components/sms/sms-filters";
import { DeleteConfirmationDialog } from "@/components/sms/delete-confirmation-dialog";
import { Plus, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { User } from "@supabase/supabase-js";

export default function SMSPage() {
  // const [smsList, setSmsList] = useState<SMS[]>([]);
  // const [stats, setStats] = useState<SMSStats>({
  //   total: 0,
  //   draft: 0,
  //   pending: 0,
  //   approved: 0,
  //   sent: 0,
  //   failed: 0,
  // });
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);
  // const [showCreateDialog, setShowCreateDialog] = useState(false);
  // const [editingSMS, setEditingSMS] = useState<SMS | null>(null);
  // const [deleteSMS, setDeleteSMS] = useState<SMS | null>(null);
  // const [orgId, setOrgId] = useState<string | null>(null);
  // const [user, setUser] = useState<User | null>(null);
  // const [actionLoading, setActionLoading] = useState<string | null>(null);

  // // New state for mode and filters
  // const [smsMode, setSmsMode] = useState<SMSMode>("hybrid");
  // const [filters, setFilters] = useState<SMSFilters>({
  //   status: "all",
  //   mode: "all",
  // });

  // const loadSMSData = async () => {
  //   if (!orgId) return;

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const [smsResult, statsResult] = await Promise.all([
  //       smsService.getSMSList(orgId, filters),
  //       smsService.getSMSStats(orgId),
  //     ]);

  //     if (smsResult.error) {
  //       setError(`Failed to load SMS: ${smsResult.error.message}`);
  //       return;
  //     }

  //     if (statsResult.error) {
  //       console.error("Failed to load stats:", statsResult.error);
  //     }

  //     setSmsList(smsResult.data);
  //     setStats(statsResult.data);
  //   } catch (err: any) {
  //     console.error("Unexpected error:", err);
  //     setError(`Unexpected error: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const loadInitialData = async () => {
      const {
        businessId: userOrgId,
        error: userError,
        user,
      } = await getUserWithBusiness();

  //     if (userError || !userOrgId) {
  //       setError("Failed to load organization data");
  //       return;
  //     }

  //     setOrgId(userOrgId);
  //     setUser(user);
  //   };

  //   loadInitialData();
  // }, []);

  // useEffect(() => {
  //   if (orgId) {
  //     loadSMSData();
  //   }
  // }, [orgId, filters]);

  // // Auto-clear success messages after 5 seconds
  // useEffect(() => {
  //   if (success) {
  //     const timer = setTimeout(() => {
  //       setSuccess(null);
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [success]);

  // const handleCreateSMS = async (data: CreateSMSData) => {
  //   if (!orgId) {
  //     setError("Organization not found");
  //     return;
  //   }

  //   setActionLoading("create");
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const { data: newSMS, error } = await smsService.createSMS(
  //       {
  //         ...data,
  //         status: "draft",
  //       },
  //       orgId
  //     );

  //     if (error) {
  //       setError(`Failed to create SMS: ${error.message}`);
  //       return;
  //     }

  //     setSuccess("SMS created successfully");
  //     setShowCreateDialog(false);
  //     await loadSMSData();
  //   } catch (err: any) {
  //     console.error("Error creating SMS:", err);
  //     setError(`Error: ${err.message}`);
  //   } finally {
  //     setActionLoading(null);
  //   }
  // };

  // const handleUpdateSMS = async (sms: SMS, updates: UpdateSMSData) => {
  //   if (!orgId) return;

  //   setActionLoading(sms.id);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const { error } = await smsService.updateSMS(sms.id, updates, orgId);

  //     if (error) {
  //       setError(`Failed to update SMS: ${error.message}`);
  //       return;
  //     }

  //     setSuccess("SMS updated successfully");
  //     setShowCreateDialog(false);
  //     await loadSMSData();
  //   } catch (err: any) {
  //     console.error("Error updating SMS:", err);
  //     setError(`Error: ${err.message}`);
  //   } finally {
  //     setActionLoading(null);
  //   }
  // };

  // const handleEdit = (sms: SMS) => {
  //   setEditingSMS(sms);
  //   setShowCreateDialog(true);
  // };

  // const handleDeleteClick = (sms: SMS) => {
  //   setDeleteSMS(sms);
  // };

  // const handleDeleteConfirm = async () => {
  //   if (!deleteSMS || !orgId) return;

  //   setActionLoading(deleteSMS.id);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const { error } = await smsService.deleteSMS(deleteSMS.id, orgId);

  //     if (error) {
  //       setError(`Failed to delete SMS: ${error.message}`);
  //       return;
  //     }

  //     setSuccess("SMS deleted successfully");
  //     setDeleteSMS(null);
  //     await loadSMSData();
  //   } catch (err: any) {
  //     console.error("Error deleting SMS:", err);
  //     setError(`Error: ${err.message}`);
  //   } finally {
  //     setActionLoading(null);
  //   }
  // };

  // const handleApproveSMS = async (sms: SMS) => {
  //   if (!orgId) return;

  //   setActionLoading(sms.id);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const { data: approvedSMS, error } = await smsService.approveSMS(
  //       sms.id,
  //       orgId,
  //       user
  //     );

  //     if (error) {
  //       setError(`Failed to approve SMS: ${error.message}`);
  //       return;
  //     }

  //     setSuccess("SMS approved successfully");
  //     await loadSMSData();
  //   } catch (err: any) {
  //     console.error("Error approving SMS:", err);
  //     setError(`Error: ${err.message}`);
  //   } finally {
  //     setActionLoading(null);
  //   }
  // };

  // const handleSendSMS = async (sms: SMS) => {
  //   if (!orgId) return;

  //   setActionLoading(sms.id);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     // Update status to pending and send to webhook
  //     await smsService.updateSMS(sms.id, { status: "pending" }, orgId);
  //     await handleSendToWebhook(sms);

  //     setSuccess("SMS sent successfully");
  //     await loadSMSData();
  //   } catch (err: any) {
  //     console.error("Error sending SMS:", err);
  //     setError(`Error: ${err.message}`);
  //   } finally {
  //     setActionLoading(null);
  //   }
  // };

  // const handleRetrySMS = async (sms: SMS) => {
  //   if (!orgId) return;

  //   setActionLoading(sms.id);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     await smsService.updateSMS(
  //       sms.id,
  //       {
  //         status: "retry",
  //         retry_count: (sms.retry_count || 0) + 1,
  //       },
  //       orgId
  //     );
  //     await handleSendToWebhook(sms);

  //     setSuccess("SMS retry initiated");
  //     await loadSMSData();
  //   } catch (err: any) {
  //     console.error("Error retrying SMS:", err);
  //     setError(`Error: ${err.message}`);
  //   } finally {
  //     setActionLoading(null);
  //   }
  // };

  // const handleSendToWebhook = async (sms: SMS) => {
  //   try {
  //     const webhookData = {
  //       orgId: sms.org_id,
  //       smsId: sms.id,
  //       mobileNumber: sms.mobile_number,
  //       body: sms.body,
  //       mode: sms.mode,
  //       status: sms.status,
  //     };

  //     console.log("Sending SMS to webhook:", webhookData);

  //     // TODO: Replace with your actual webhook URL
  //     const webhookResponse = await fetch("https://your-n8n-webhook-url/sms", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(webhookData),
  //     });

  //     if (!webhookResponse.ok) {
  //       throw new Error(`Webhook failed: ${webhookResponse.statusText}`);
  //     }

  //     console.log("SMS sent to webhook successfully");
  //   } catch (err: any) {
  //     console.error("Error sending to webhook:", err);
  //     // Mark as failed if webhook fails
  //     if (orgId) {
  //       await smsService.updateSMS(
  //         sms.id,
  //         {
  //           status: "failed",
  //           error_message: err.message,
  //         },
  //         orgId
  //       );
  //     }
  //     throw err;
  //   }
  // };

  // const handleModeChange = async (newMode: SMSMode) => {
  //   setSmsMode(newMode);
  //   setSuccess(
  //     `SMS mode changed to ${newMode === "fully_ai" ? "Fully AI" : "Hybrid"}`
  //   );

  //   // Trigger backend processing based on mode
  //   if (newMode === "fully_ai") {
  //     await processAISMS();
  //   }
  // };

  // const processAISMS = async () => {
  //   if (!orgId) return;

  //   try {
  //     const { data, error } = await smsService.processAISMS(orgId);
  //     if (error) {
  //       console.error("Error processing AI SMS:", error);
  //     } else {
  //       console.log("AI SMS processed:", data);
  //       await loadSMSData();
  //     }
  //   } catch (err) {
  //     console.error("Error in AI processing:", err);
  //   }
  // };

  // const handleClearFilters = () => {
  //   setFilters({
  //     status: "all",
  //     mode: "all",
  //     dateRange: undefined,
  //   });
  // };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      hello
    </div>
  );
}
