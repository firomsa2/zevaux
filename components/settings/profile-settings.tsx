"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";

export function ProfileSettings({ user, profile }: any) {
  const [businessName, setBusinessName] = useState(
    profile?.business_name || ""
  );
  const [phone, setPhone] = useState(profile?.phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    // try {
    //   const { error: updateError } = await supabase
    //     .from("profiles")
    //     .update({
    //       business_name: businessName,
    //       phone,
    //     })
    //     .eq("id", user.id);

    //   if (updateError) throw updateError;

    //   setSuccess(true);
    //   setTimeout(() => setSuccess(false), 3000);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : "Failed to save profile");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your business profile details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
            Profile updated successfully
          </div>
        )}

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={user?.email}
            disabled
            className="mt-2 bg-surface"
          />
          <p className="text-xs text-text-tertiary mt-2">
            Your email cannot be changed
          </p>
        </div>

        <div>
          <Label htmlFor="business">Business Name</Label>
          <Input
            id="business"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your Business Name"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="mt-2"
          />
        </div>

        <Button onClick={handleSave} disabled={loading} className="btn-primary">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
