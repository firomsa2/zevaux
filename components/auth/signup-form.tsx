// "use client";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signUp } from "@/actions/auth";

// export function SignupForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setLoading(true);
//     setError(null);

//     const formData = new FormData(event.currentTarget);
//     const result = await signUp(formData);

//     if (result.status === "success") {
//       router.push("/login");
//     } else {
//       setError(result.status);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader className="text-center">
//           <CardTitle className="text-xl">Create your account</CardTitle>
//           <CardDescription>
//             Enter your email below to create your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <FieldGroup>
//               <Field>
//                 <FieldLabel htmlFor="name">Full Name</FieldLabel>
//                 <Input id="name" type="text" placeholder="John Doe" required />
//               </Field>
//               <Field>
//                 <FieldLabel htmlFor="email">Email</FieldLabel>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="m@example.com"
//                   required
//                 />
//               </Field>
//               <Field>
//                 <Field className="grid grid-cols-2 gap-4">
//                   <Field>
//                     <FieldLabel htmlFor="password">Password</FieldLabel>
//                     <Input id="password" type="password" required />
//                   </Field>
//                   <Field>
//                     <FieldLabel htmlFor="confirm-password">
//                       Confirm Password
//                     </FieldLabel>
//                     <Input id="confirm-password" type="password" required />
//                   </Field>
//                 </Field>
//                 <FieldDescription>
//                   Must be at least 8 characters long.
//                 </FieldDescription>
//               </Field>
//               <Field>
//                 <Button type="submit" disabled={loading}>
//                   {loading ? "Creating..." : "Create Account"}
//                 </Button>
//                 <FieldDescription className="text-center">
//                   Already have an account? <a href="/login">Sign in</a>
//                 </FieldDescription>
//               </Field>
//             </FieldGroup>
//           </form>
//         </CardContent>
//         {error && (
//           <CardDescription className="px-6 text-center text-red-600">
//             {error}
//           </CardDescription>
//         )}
//       </Card>
//       <FieldDescription className="px-6 text-center">
//         By clicking continue, you agree to our{" "}
//         <a href="/login">Terms of Service</a> and <a href="#">Privacy Policy</a>
//         .
//       </FieldDescription>
//     </div>
//   );
// }

// "use client";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldSeparator,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signUp } from "@/actions/auth";
// import { GoogleButton } from "./google-button";

// export function SignupForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const router = useRouter();

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);

//     const formData = new FormData(event.currentTarget);

//     // Client-side password confirmation
//     const password = formData.get("password") as string;
//     const confirmPassword = formData.get("confirm-password") as string;

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     if (password.length < 8) {
//       setError("Password must be at least 8 characters long");
//       setLoading(false);
//       return;
//     }

//     const result = await signUp(formData);

//     if (result.status === "success") {
//       setSuccessMessage(
//         "Account created successfully! Please check your email for verification."
//       );
//       // Optional: redirect after delay
//       setTimeout(() => {
//         router.push("/login");
//       }, 3000);
//     } else {
//       setError(result.status);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className={cn("flex flex-col gap-4", className)} {...props}>
//       <Card>
//         <CardHeader className="text-center">
//           <CardTitle className="text-xl">Create your account</CardTitle>
//           <CardDescription>
//             Enter your information below to create your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <FieldGroup>
//               <Field>
//                 <FieldLabel htmlFor="name">Full Name</FieldLabel>
//                 <Input
//                   id="name"
//                   name="name"
//                   type="text"
//                   placeholder="John Doe"
//                   required
//                 />
//               </Field>
//               <Field>
//                 <FieldLabel htmlFor="email">Email</FieldLabel>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="m@example.com"
//                   required
//                 />
//               </Field>
//               <Field>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Field>
//                     <FieldLabel htmlFor="password">Password</FieldLabel>
//                     <Input
//                       id="password"
//                       name="password"
//                       type="password"
//                       required
//                       minLength={8}
//                     />
//                   </Field>
//                   <Field>
//                     <FieldLabel htmlFor="confirm-password">
//                       Confirm Password
//                     </FieldLabel>
//                     <Input
//                       id="confirm-password"
//                       name="confirm-password"
//                       type="password"
//                       required
//                     />
//                   </Field>
//                 </div>
//                 <FieldDescription>
//                   Must be at least 8 characters long.
//                 </FieldDescription>
//               </Field>
//               <Field className="">
//                 <Button type="submit" disabled={loading} className="w-full">
//                   {loading ? "Creating Account..." : "Create Account"}
//                 </Button>
//               </Field>
//               <FieldSeparator>Or continue with email</FieldSeparator>
//               <Field>
//                 <div className="">
//                   <GoogleButton variant="signup">
//                     Sign up with Google
//                   </GoogleButton>
//                 </div>
//                 <FieldDescription className="text-center pt-2">
//                   Already have an account?{" "}
//                   <a href="/login" className="text-blue-600 hover:underline">
//                     Sign in
//                   </a>
//                 </FieldDescription>
//               </Field>
//             </FieldGroup>
//           </form>

//           {/* Divider */}
//           {/* <div className="relative mb-6">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-background px-2 text-muted-foreground"> */}
//           {/* </span>
//             </div>
//           </div> */}

//           {/* Google OAuth Button */}
//         </CardContent>
//         {error && (
//           <div className="px-6 pb-4">
//             <p className="text-center text-red-600 text-sm">{error}</p>
//           </div>
//         )}
//         {successMessage && (
//           <div className="px-6 pb-4">
//             <p className="text-center text-green-600 text-sm">
//               {successMessage}
//             </p>
//           </div>
//         )}
//       </Card>
//       <FieldDescription className="px-6 text-center text-xs">
//         By clicking continue, you agree to our{" "}
//         <a href="/terms" className="text-blue-600 hover:underline">
//           Terms of Service
//         </a>{" "}
//         and{" "}
//         <a href="/privacy" className="text-blue-600 hover:underline">
//           Privacy Policy
//         </a>
//         .
//       </FieldDescription>
//     </div>
//   );
// }

"use client";

import type React from "react";

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
import { signUp } from "@/actions/auth";
import { GoogleButton } from "./google-button";
import { AlertCircle } from "lucide-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);

    // Client-side password confirmation
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    const businessName = formData.get("business-name") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (!businessName || businessName.trim().length === 0) {
      setError("Business name is required");
      setLoading(false);
      return;
    }

    const result = await signUp(formData);

    if (result.status === "success") {
      setSuccessMessage(
        "Account created successfully! Redirecting to setup...",
      );
      // Force hard navigation to clear any client states
      window.location.assign("/onboarding/website");
    } else {
      setError(result.status);
    }
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Join Zevaux and automate your business calls in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <GoogleButton variant="signup">Sign up with Google</GoogleButton>

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
                    <FieldLabel htmlFor="business-name">
                      Business Name
                    </FieldLabel>
                    <Input
                      id="business-name"
                      name="business-name"
                      type="text"
                      placeholder="Acme Corporation"
                      required
                      autoFocus
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </Field>
                  <Field>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          required
                          minLength={8}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="confirm-password">
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id="confirm-password"
                          name="confirm-password"
                          type="password"
                          required
                        />
                      </Field>
                    </div>
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}

            <div className="text-center text-sm text-muted-foreground mt-2">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </a>
            </div>
          </div>
        </CardContent>
        {error && (
          <div className="px-6 pb-4">
            <div className="flex gap-2 rounded-md bg-red-50 dark:bg-red-950/20 p-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="px-6 pb-4">
            <p className="text-center text-green-600 dark:text-green-400 text-sm">
              {successMessage}
            </p>
          </div>
        )}
      </Card>
      <FieldDescription className="px-6 text-center text-xs">
        By clicking continue, you agree to our{" "}
        <a href="/terms" className="text-blue-600 hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
