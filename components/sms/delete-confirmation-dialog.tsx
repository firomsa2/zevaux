"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  sms?: {
    mobile_number: string;
    body: string;
  };
  loading?: boolean;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  sms,
  loading = false,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Delete SMS Message</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Are you sure you want to delete this SMS message? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {sms && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm font-medium">Message Details:</div>
            <div className="text-sm text-muted-foreground mt-1">
              <div>To: {sms.mobile_number}</div>
              <div className="mt-1 whitespace-pre-wrap wrap-break-words ">
                Message: {sms.body}
              </div>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete Message"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
