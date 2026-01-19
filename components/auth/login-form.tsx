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
import { useRouter } from "next/navigation";
import { signIn } from "@/actions/auth";
import { GoogleButton } from "./google-button";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signIn(formData);
    console.log("Login form data:", {
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (result.status === "success") {
      router.push("/dashboard");
    } else {
      setError(result.status);
    }

    setLoading(false);
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account or Email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <GoogleButton variant="signin" />

            {!showEmailForm ? (
              <Button
                variant="outline"
                onClick={() => setShowEmailForm(true)}
                className="w-full"
              >
                Continue with Email
              </Button>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="animate-in fade-in slide-in-from-top-4 duration-300"
              >
                <FieldGroup>
                  <FieldSeparator className="my-4">
                    Or continue with email
                  </FieldSeparator>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="m@example.com"
                      required
                      autoFocus
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "Loading..." : "Login"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}

            {error && (
              <div className="text-sm text-destructive text-center">
                {error}
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground mt-2">
              <div className="mb-2">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </a>
              </div>
              <div>
                Forgot your password?{" "}
                <a
                  href="/forgot-password"
                  className="text-primary hover:underline font-medium"
                >
                  Reset
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
