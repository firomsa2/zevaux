"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function getUserSession() {
  const supabase = await createClient();
  const { error, data } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return { status: "success", user: data?.user };
  // return data.session;
}

// export async function signUp(formData: FormData) {
//   const supabase = await createClient();

//   const credentials = {
//     name: formData.get("name") as string,
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//   };

//   const { error, data } = await supabase.auth.signUp({
//     email: credentials.email,
//     password: credentials.password,
//     options: {
//       data: {
//         name: credentials.name,
//       },
//     },
//   });

//   if (error) {
//     return {
//       status: error?.message,
//       user: null,
//     };
//   } else if (data?.user?.identities?.length === 0) {
//     return {
//       status: "User with this email already exists. Please sign in instead.",
//       user: null,
//     };
//   }

//   revalidatePath("/", "layout");
//   return { status: "success", user: data.user };
// }

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const credentials = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirm-password") as string,
  };

  // Validate passwords match
  if (credentials.password !== credentials.confirmPassword) {
    return {
      status: "Passwords do not match",
      user: null,
    };
  }

  // Validate password length
  if (credentials.password.length < 8) {
    return {
      status: "Password must be at least 8 characters long",
      user: null,
    };
  }

  try {
    const { error, data } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
        },
        // emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      // Handle specific error cases
      if (error.message.includes("already registered")) {
        return {
          status:
            "User with this email already exists. Please sign in instead.",
          user: null,
        };
      }
      return {
        status: error.message,
        user: null,
      };
    }

    // Check if user was created successfully
    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      return {
        status: "User with this email already exists. Please sign in instead.",
        user: null,
      };
    }

    revalidatePath("/dashboard", "layout");

    // Success - user created (might need email verification)
    return {
      status: "success",
      user: data.user,
      message:
        data.user?.identities?.length === 0
          ? "User already exists"
          : "Check your email for verification link",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      status: "An unexpected error occurred",
      user: null,
    };
  }
}

// export async function signIn(formData: FormData) {
//   const supabase = await createClient();

//   const credentials = {
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//   };

//   const { error, data } = await supabase.auth.signInWithPassword({
//     email: credentials.email,
//     password: credentials.password,
//   });

//   if (error) {
//     return {
//       status: error?.message,
//       user: null,
//     };
//   }

//   revalidatePath("/", "layout");
//   return { status: "success", user: data.user };
// }

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate that email and password are provided
  if (!credentials.email || !credentials.password) {
    return {
      status: "Email and password are required",
      user: null,
    };
  }

  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error("Login error:", error);

      // Handle specific error cases
      if (error.message.includes("Invalid login credentials")) {
        return {
          status: "Invalid email or password",
          user: null,
        };
      }

      if (error.message.includes("Email not confirmed")) {
        return {
          status: "Please verify your email address before logging in",
          user: null,
        };
      }

      return {
        status: error.message,
        user: null,
      };
    }

    revalidatePath("/dashboard", "layout");
    return { status: "success", user: data.user };
  } catch (error: any) {
    console.error("Unexpected login error:", error);
    return {
      status: "An unexpected error occurred during login",
      user: null,
    };
  }
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      status: error?.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const origin = ((await headers()).get("origin") ?? "") as string;

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    return {
      status: error?.message,
    };
  }

  return { status: "success" };
}

export async function resetPassword(formData: FormData, code: string) {
  const supabase = await createClient();
  const { error: CodeError } = await supabase.auth.exchangeCodeForSession(code);

  if (CodeError) {
    return {
      status: CodeError?.message,
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  });

  if (error) {
    return {
      status: error?.message,
    };
  }

  return { status: "success" };
}

// export async function resetPassword(formData: FormData) {
//   const supabase = await createClient();

//   try {
//     // Get the password from form data
//     const password = formData.get("password") as string;
//     const confirmPassword = formData.get("confirm-password") as string;

//     // Validate passwords match
//     if (password !== confirmPassword) {
//       return {
//         status: "Passwords do not match",
//       };
//     }

//     // Validate password length
//     if (password.length < 8) {
//       return {
//         status: "Password must be at least 8 characters long",
//       };
//     }

//     // Update the user's password - no code exchange needed
//     // Supabase automatically knows which user to update from the session
//     const { error, data } = await supabase.auth.updateUser({
//       password: password,
//     });

//     if (error) {
//       console.error("Password update error:", error);

//       if (error.message.includes("Auth session missing")) {
//         return {
//           status: "Your reset link has expired. Please request a new one.",
//         };
//       }

//       return {
//         status: error.message,
//       };
//     }

//     console.log("Password reset successful:", data);
//     return { status: "success" };
//   } catch (error: any) {
//     console.error("Unexpected reset password error:", error);
//     return {
//       status: "An unexpected error occurred",
//     };
//   }
// }

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google OAuth error:", error);
    return { status: error.message };
  }

  redirect(data.url);
}

export async function signUpWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google OAuth error:", error);
    return { status: error.message };
  }

  redirect(data.url);
}
