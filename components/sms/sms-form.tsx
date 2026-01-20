"use client";

import { useState, useEffect } from "react";
import { SMS, CreateSMSData } from "@/types/sms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SMSFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSMSData) => void;
  editingSMS?: SMS | null;
  loading?: boolean;
}

export function SMSForm({
  open,
  onOpenChange,
  onSubmit,
  editingSMS,
  loading,
}: SMSFormProps) {
  const [formData, setFormData] = useState(() => ({
    mobile_number: editingSMS?.mobile_number || "",
    body: editingSMS?.body || "",
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.mobile_number.trim() || !formData.body.trim()) {
      return;
    }

    onSubmit({
      mobile_number: formData.mobile_number.trim(),
      body: formData.body.trim(),
      status: "draft",
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when closing
      setFormData({
        mobile_number: "",
        body: "",
      });
    }
    onOpenChange(open);
  };

  const isFormValid = formData.mobile_number.trim() && formData.body.trim();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {editingSMS ? "Edit SMS Message" : "Create New SMS"}
          </DialogTitle>
          <DialogDescription>
            {editingSMS
              ? "Update your SMS message content"
              : "Create a new SMS message to send"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile_number">
              Mobile Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mobile_number"
              value={formData.mobile_number}
              onChange={(e) =>
                setFormData({ ...formData, mobile_number: e.target.value })
              }
              placeholder="+1234567890"
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Enter the recipient's phone number with country code
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              placeholder="Enter your message here..."
              rows={4}
              required
              disabled={loading}
              className="resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formData.body.length} characters</span>
              <span>Maximum: 1600 characters</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isFormValid}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {editingSMS ? "Updating..." : "Creating..."}
                </div>
              ) : editingSMS ? (
                "Update Message"
              ) : (
                "Create Message"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
