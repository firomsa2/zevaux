"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/actions/auth";
import { toast } from "@/lib/toast";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await resetPassword(
      formData,
      searchParams.get("code") as string
    );

    if (result.status === "success") {
      toast.success("Password reset successfully", {
        description: "You can now sign in with your new password.",
      });
      router.push("/login?reset=success");
    } else {
      const errorMessage = result.status || "An unexpected error occurred.";
      toast.error("Failed to reset password", {
        description: errorMessage,
      });
      setError(errorMessage);
    }
    setLoading(false);
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your new password"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <FieldDescription className="text-sm">
                    Make sure to enter the same password
                  </FieldDescription>
                </div>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Reset Password"}
                </Button>
                {error && (
                  <FieldDescription className="text-destructive">
                    {error}
                  </FieldDescription>
                )}
                <FieldSeparator />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
