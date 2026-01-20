"use client";

import { SMS, SMSFilters } from "@/types/sms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Trash2,
  Send,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Bot,
  Users,
} from "lucide-react";

interface SMSListProps {
  smsList: SMS[];
  onEdit: (sms: SMS) => void;
  onDelete: (sms: SMS) => void;
  onApprove: (sms: SMS) => void;
  onSend: (sms: SMS) => void;
  onRetry: (sms: SMS) => void;
  loading?: boolean;
  actionLoading?: string | null;
  filters: SMSFilters;
}

export function SMSList({
  filters,
  smsList,
  onEdit,
  onDelete,
  onApprove,
  onSend,
  onRetry,
  loading,
  actionLoading,
}: SMSListProps) {
  const getStatusIcon = (status: SMS["status"]) => {
    switch (status) {
      case "draft":
        return <FileText className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "approved":
        return <CheckCircle className="h-3 w-3" />;
      case "sent":
        return <CheckCircle className="h-3 w-3" />;
      case "failed":
        return <AlertCircle className="h-3 w-3" />;
      case "retry":
        return <RefreshCw className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const getStatusVariant = (status: SMS["status"]) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "pending":
        return "outline";
      case "approved":
        return "default";
      case "sent":
        return "default";
      case "failed":
        return "destructive";
      case "retry":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: SMS["status"]) => {
    switch (status) {
      case "draft":
        return "text-gray-600 bg-gray-100";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "sent":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "retry":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getModeBadge = (sms: SMS) => {
    const baseClass = "flex items-center gap-1 w-fit text-xs";

    if (sms.mode === "manual") {
      return (
        <Badge variant="secondary" className={baseClass}>
          <MessageSquare className="h-3 w-3" />
          Manual
        </Badge>
      );
    }

    return (
      <Badge
        variant={sms.mode === "fully_ai" ? "default" : "secondary"}
        className={baseClass}
      >
        {sms.mode === "fully_ai" ? (
          <Bot className="h-3 w-3" />
        ) : (
          <Users className="h-3 w-3" />
        )}
        {sms.mode === "fully_ai" ? "Fully AI" : "Hybrid"}
      </Badge>
    );
  };

  const canEdit = (sms: SMS) => {
    return (
      (sms.mode === "manual" && sms.status === "draft") ||
      (sms.mode === "hybrid" && sms.status === "pending")
    );
  };

  const canDelete = (sms: SMS) => {
    return ["draft", "pending", "failed"].includes(sms.status);
  };

  const canApprove = (sms: SMS) => {
    return sms.mode === "hybrid" && sms.status === "pending";
  };

  const canSend = (sms: SMS) => {
    return (
      (sms.mode === "manual" && sms.status === "draft") ||
      (sms.mode === "hybrid" && sms.status === "approved")
    );
  };

  const canRetry = (sms: SMS) => {
    return sms.status === "failed";
  };

  const LoadingSpinner = () => (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        <div className="text-center">
          <p className="font-medium">Loading messages...</p>
          <p className="text-sm text-muted-foreground">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (smsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">No messages found</h3>
        <p className="text-muted-foreground max-w-md">
          {filters?.status !== "all" || filters?.mode !== "all"
            ? "No messages match your current filters. Try adjusting your filters."
            : "Get started by creating your first SMS message."}
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Mobile Number</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="w-[100px]">Mode</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="w-[180px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {smsList.map((sms) => (
              <TableRow key={sms.id} className="group">
                <TableCell className="font-mono text-sm">
                  {sms.mobile_number}
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px]">
                    <div className="truncate" title={sms.body}>
                      {sms.body}
                    </div>
                    {sms.error_message && (
                      <div
                        className="text-xs text-red-600 mt-1 truncate"
                        title={sms.error_message}
                      >
                        Error: {sms.error_message}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getModeBadge(sms)}</TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(sms.status)}
                    className={`flex items-center gap-1 w-fit ${getStatusColor(
                      sms.status
                    )}`}
                  >
                    {getStatusIcon(sms.status)}
                    <span className="capitalize">{sms.status}</span>
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(sms.created_at).toLocaleDateString()}
                  <div className="text-xs">
                    {new Date(sms.created_at).toLocaleTimeString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {canEdit(sms) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(sms)}
                        disabled={actionLoading === sms.id}
                        className="h-8 w-8 p-0"
                        title="Edit message"
                      >
                        {actionLoading === sms.id ? (
                          <LoadingSpinner />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    {canApprove(sms) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApprove(sms)}
                        disabled={actionLoading === sms.id}
                        className="h-8 w-8 p-0"
                        title="Approve message"
                      >
                        {actionLoading === sms.id ? (
                          <LoadingSpinner />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    {canSend(sms) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSend(sms)}
                        disabled={actionLoading === sms.id}
                        className="h-8 w-8 p-0"
                        title="Send message"
                      >
                        {actionLoading === sms.id ? (
                          <LoadingSpinner />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    {canRetry(sms) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRetry(sms)}
                        disabled={actionLoading === sms.id}
                        className="h-8 w-8 p-0"
                        title="Retry sending"
                      >
                        {actionLoading === sms.id ? (
                          <LoadingSpinner />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    {canDelete(sms) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(sms)}
                        disabled={actionLoading === sms.id}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Delete message"
                      >
                        {actionLoading === sms.id ? (
                          <LoadingSpinner />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
