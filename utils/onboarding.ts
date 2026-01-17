// "use server";

// import { createClient } from "@/utils/supabase/server";
// import type {
//   OnboardingStep,
//   OnboardingProgress,
//   OnboardingStepId,
//   ReceptionistSubStep,
//   ReceptionistProgress,
// } from "@/types/onboarding";

// const ONBOARDING_STEPS: Omit<OnboardingStep, "completed">[] = [
//   {
//     id: "welcome",
//     title: "Welcome to Zevaux!",
//     description: "Get started by setting up your account",
//     actionLabel: "Get Started",
//     actionUrl: "/dashboard",
//     order: 1,
//   },
//   {
//     id: "business_setup",
//     title: "Set Up Your Business",
//     description: "Configure your business information and details",
//     actionLabel: "Configure Business",
//     actionUrl: "/dashboard/receptionist/configure",
//     order: 2,
//   },
//   {
//     id: "phone_number",
//     title: "Add Phone Number",
//     description: "Connect your phone number to start receiving calls",
//     actionLabel: "Add Phone Number",
//     actionUrl: "/dashboard/phone-numbers",
//     order: 3,
//   },
//   {
//     id: "receptionist_config",
//     title: "Configure AI Receptionist",
//     description: "Set up voice, greeting, and business hours",
//     actionLabel: "Configure Receptionist",
//     actionUrl: "/dashboard/receptionist/configure",
//     order: 4,
//   },
//   {
//     id: "knowledge_base",
//     title: "Add Knowledge Base",
//     description: "Upload documents or connect your website for better AI responses",
//     actionLabel: "Add Knowledge",
//     actionUrl: "/dashboard/knowledge",
//     order: 5,
//   },
//   {
//     id: "first_call",
//     title: "Test Your Setup",
//     description: "Make your first test call to verify everything works",
//     actionLabel: "View Dashboard",
//     actionUrl: "/dashboard",
//     order: 6,
//   },
//   {
//     id: "complete",
//     title: "Setup Complete!",
//     description: "Congratulations! Your AI receptionist is ready to go",
//     order: 7,
//   },
// ];

// export async function getOnboardingProgress(
//   userId: string
// ): Promise<OnboardingProgress> {
//   const supabase = await createClient();

//   // Get user's business_id
//   const { data: userData } = await supabase
//     .from("users")
//     .select("business_id")
//     .eq("id", userId)
//     .single();

//   const businessId = userData?.business_id;

//   if (!businessId) {
//     // User hasn't set up business yet
//     const steps: OnboardingStep[] = ONBOARDING_STEPS.map((step) => ({
//       ...step,
//       completed: step.id === "welcome",
//     }));

//     return {
//       steps,
//       currentStep: steps.find((s) => !s.completed) || null,
//       completedSteps: 1,
//       totalSteps: steps.length,
//       progressPercentage: Math.round((1 / steps.length) * 100),
//       isComplete: false,
//     };
//   }

//   // Check business setup - business should have name and basic info
//   const { data: business } = await supabase
//     .from("businesses")
//     .select("name, assistant_name, description")
//     .eq("id", businessId)
//     .single();

//   const hasBusiness = !!business?.name && business.name.trim().length > 0;

//   // Check phone number
//   const { count: phoneCount } = await supabase
//     .from("phone_endpoints")
//     .select("*", { count: "exact", head: true })
//     .eq("business_id", businessId);

//   const hasPhoneNumber = (phoneCount || 0) > 0;

//   // Check receptionist sub-sections in detail
//   const { data: businessConfigRes } = await supabase
//     .from("business_configs")
//     .select("config")
//     .eq("business_id", businessId)
//     .maybeSingle();

//   const businessConfig = businessConfigRes?.config || {};

//   const { data: businessData } = await supabase
//     .from("businesses")
//     .select("name, industry, tone, default_language, description")
//     .eq("id", businessId)
//     .single();

//   // Check if business configuration is complete (has essential fields)
//   const hasBusinessConfig = !!(
//     businessData?.name &&
//     businessData?.industry &&
//     businessData?.tone &&
//     (businessConfig.introScript && businessConfig.closingScript || businessData?.description)
//   );

//   // Check if services are configured (stored in business_configs.config.services)
//   const hasServices = !!(
//     businessConfig.services &&
//     Array.isArray(businessConfig.services) &&
//     businessConfig.services.length > 0
//   );

//   // Check if voice is configured (in business_configs)
//   const hasVoice = !!(
//     businessConfig.voiceProfile?.voice ||
//     businessData?.default_language
//   );

//   // Check if business hours are configured
//   const hasBusinessHours = !!(
//     businessConfig.hours &&
//     Object.keys(businessConfig.hours).length > 0 &&
//     Object.values(businessConfig.hours).some(
//       (dayHours: any) => Array.isArray(dayHours) && dayHours.length > 0
//     )
//   );

//   // Receptionist is complete if all sub-sections are done
//   const hasReceptionistConfig =
//     hasBusinessConfig && hasServices && hasVoice && hasBusinessHours;

//   // Check knowledge base
//   const { count: knowledgeCount } = await supabase
//     .from("knowledge_base_documents")
//     .select("*", { count: "exact", head: true })
//     .eq("business_id", businessId);

//   const hasKnowledgeBase = (knowledgeCount || 0) > 0;

//   // Check for first call
//   const { count: callCount } = await supabase
//     .from("call_logs")
//     .select("*", { count: "exact", head: true })
//     .eq("business_id", businessId);

//   const hasFirstCall = (callCount || 0) > 0;

//   // Build steps with completion status
//   const steps: OnboardingStep[] = ONBOARDING_STEPS.map((step) => {
//     let completed = false;

//     switch (step.id) {
//       case "welcome":
//         completed = true;
//         break;
//       case "business_setup":
//         completed = hasBusiness;
//         break;
//       case "phone_number":
//         completed = hasPhoneNumber;
//         break;
//       case "receptionist_config":
//         completed = hasReceptionistConfig;
//         break;
//       case "knowledge_base":
//         completed = hasKnowledgeBase;
//         break;
//       case "first_call":
//         completed = hasFirstCall;
//         break;
//       case "complete":
//         completed =
//           hasBusiness &&
//           hasPhoneNumber &&
//           hasReceptionistConfig &&
//           hasKnowledgeBase &&
//           hasFirstCall;
//         break;
//     }

//     return { ...step, completed };
//   });

//   const completedSteps = steps.filter((s) => s.completed).length;
//   const currentStep = steps.find((s) => !s.completed) || null;
//   const isComplete = completedSteps === steps.length;

//   // Build receptionist sub-steps
//   const receptionistSubSteps: ReceptionistSubStep[] = [
//     {
//       id: "receptionist_configuration",
//       title: "Business Configuration",
//       description: "Set up business name, industry, and tone",
//       actionLabel: "Configure Business",
//       actionUrl: "/dashboard/receptionist/configure",
//       completed: hasBusinessConfig,
//       order: 1,
//     },
//     {
//       id: "receptionist_services",
//       title: "Services",
//       description: "Add your services and offerings",
//       actionLabel: "Add Services",
//       actionUrl: "/dashboard/receptionist/services",
//       completed: hasServices,
//       order: 2,
//     },
//     {
//       id: "receptionist_voice",
//       title: "Voice & Language",
//       description: "Configure voice profile and language settings",
//       actionLabel: "Configure Voice",
//       actionUrl: "/dashboard/receptionist/voice",
//       completed: hasVoice,
//       order: 3,
//     },
//     {
//       id: "receptionist_hours",
//       title: "Business Hours",
//       description: "Set your operating hours",
//       actionLabel: "Set Hours",
//       actionUrl: "/dashboard/receptionist/hours",
//       completed: hasBusinessHours,
//       order: 4,
//     },
//   ];

//   const completedSubSteps = receptionistSubSteps.filter((s) => s.completed).length;
//   const currentSubStep = receptionistSubSteps.find((s) => !s.completed) || null;

//   const receptionistProgress: ReceptionistProgress = {
//     subSteps: receptionistSubSteps,
//     completedSubSteps,
//     totalSubSteps: receptionistSubSteps.length,
//     progressPercentage: Math.round(
//       (completedSubSteps / receptionistSubSteps.length) * 100
//     ),
//     isComplete: completedSubSteps === receptionistSubSteps.length,
//     currentSubStep,
//   };

//   // Add sub-steps to receptionist_config step
//   const stepsWithSubSteps = steps.map((step) => {
//     if (step.id === "receptionist_config") {
//       return {
//         ...step,
//         subSteps: receptionistSubSteps,
//       };
//     }
//     return step;
//   });

//   return {
//     steps: stepsWithSubSteps,
//     currentStep,
//     completedSteps,
//     totalSteps: steps.length,
//     progressPercentage: Math.round((completedSteps / steps.length) * 100),
//     isComplete,
//     receptionistProgress,
//   };
// }

// export async function isFirstTimeUser(userId: string): Promise<boolean> {
//   const progress = await getOnboardingProgress(userId);
//   return progress.completedSteps <= 1 && !progress.isComplete;
// }

"use server";

import { createClient } from "@/utils/supabase/server";
import type {
  OnboardingStep,
  OnboardingProgress,
  BusinessInfoSubStep,
} from "@/types/onboarding";

const ONBOARDING_STEPS: Omit<OnboardingStep, "completed">[] = [
  {
    id: "website_training",
    title: "Train with Website",
    description: "Train your AI receptionist with your website content",
    actionLabel: "Start Training",
    actionUrl: "/onboarding/website",
    order: 1,
  },
  {
    id: "business_info",
    title: "Business Information",
    description: "Tell us about your business and AI receptionist",
    actionLabel: "Get Started",
    actionUrl: "/dashboard/onboarding",
    order: 2,
  },
  {
    id: "phone_verification",
    title: "Phone Number",
    description: "Get your dedicated phone number",
    actionLabel: "Verify Number",
    actionUrl: "/dashboard/onboarding",
    order: 3,
  },
  {
    id: "go_live",
    title: "Go Live",
    description: "Your AI receptionist is ready to receive calls!",
    order: 4,
  },
];

const BUSINESS_INFO_SUBSTEPS: Omit<BusinessInfoSubStep, "completed">[] = [
  {
    id: "business_details",
    title: "Business Details",
    description: "Business name, industry, timezone, description",
    order: 1,
  },
  {
    id: "agent_setup",
    title: "Agent Setup",
    description: "Create your AI receptionist name",
    order: 2,
  },
  {
    id: "greeting_tone",
    title: "Greeting & Tone",
    description: "Customize the welcome greeting",
    order: 3,
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm all your settings",
    order: 4,
  },
];

export async function getOnboardingProgress(
  userId: string,
): Promise<OnboardingProgress> {
  const supabase = await createClient();

  // Get user's business
  const { data: userData } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", userId)
    .single();

  const businessId = userData?.business_id;

  if (!businessId) {
    // User hasn't created business yet
    const steps: OnboardingStep[] = ONBOARDING_STEPS.map((step) => ({
      ...step,
      completed: false,
    }));

    return {
      steps,
      currentStep: steps[0] || null,
      completedSteps: 0,
      totalSteps: steps.length,
      progressPercentage: 0,
      isComplete: false,
    };
  }

  // Get business data
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .single();

  // Get onboarding progress
  const { data: onboardingProgress } = await supabase
    .from("onboarding_progress")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle();

  // Get phone endpoint
  const { data: phoneEndpoint } = await supabase
    .from("phone_endpoints")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle();

  // Check website training completion (prefers new step_1_website flag)
  // First check the database flags
  const websiteStepCompletedFlag =
    onboardingProgress?.step_1_website ??
    onboardingProgress?.website_training_completed ??
    onboardingProgress?.step_1_review ??
    false;

  let hasWebsiteTraining = !!websiteStepCompletedFlag;

  // If flag doesn't exist or is false, check documents directly (for backward compatibility)
  if (!hasWebsiteTraining) {
    const { data: websiteDocs } = await supabase
      .from("knowledge_base_documents")
      .select("id, status")
      .eq("business_id", businessId)
      .eq("source_type", "url")
      .limit(1);

    const hasProcessedWebsite = !!(
      websiteDocs &&
      websiteDocs.length > 0 &&
      websiteDocs[0].status === "processed"
    );

    if (hasProcessedWebsite) {
      hasWebsiteTraining = true;

      // Auto-update the flag if document is processed but flag isn't set
      // Only try if we have the column (won't error if column doesn't exist due to graceful handling)
      try {
        await saveOnboardingProgress(businessId, {
          step_1_website: true,
          website_training_completed: true,
        });
      } catch (error) {
        // Silent fail - column might not exist yet
        console.warn(
          "Could not update website_training_completed flag:",
          error,
        );
      }
    }
  }

  // Check call logs for first call
  const { count: callCount } = await supabase
    .from("call_logs")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId);

  const steps: OnboardingStep[] = ONBOARDING_STEPS.map((step) => {
    let completed = false;
    let subSteps: BusinessInfoSubStep[] | undefined = undefined;

    const businessInfoCompleted =
      onboardingProgress?.step_2_business_info ??
      onboardingProgress?.step_1_review ??
      !!(
        business?.name &&
        business?.industry &&
        business?.timezone &&
        business?.assistant_name
      );

    const phoneSetupCompleted =
      onboardingProgress?.step_3_phone_setup ??
      onboardingProgress?.step_2_phone_verified ??
      !!phoneEndpoint?.phone_number;

    const goLiveCompleted =
      onboardingProgress?.step_4_go_live ??
      onboardingProgress?.step_3_go_live ??
      false;

    switch (step.id) {
      case "website_training":
        completed = hasWebsiteTraining;
        break;
      case "business_info":
        completed = businessInfoCompleted;
        subSteps = BUSINESS_INFO_SUBSTEPS.map((subStep) => {
          let subCompleted = false;
          switch (subStep.id) {
            case "business_details":
              subCompleted = !!(
                business?.name &&
                business?.industry &&
                business?.timezone
              );
              break;
            case "agent_setup":
              subCompleted = !!business?.assistant_name;
              break;
            case "greeting_tone":
              subCompleted = !!business?.personalized_greeting;
              break;
            case "review":
              subCompleted = businessInfoCompleted;
              break;
          }
          return { ...subStep, completed: subCompleted };
        });
        break;
      case "phone_verification":
        completed = !!phoneEndpoint && phoneSetupCompleted;
        break;
      case "go_live":
        completed = goLiveCompleted;
        break;
    }

    return { ...step, completed, subSteps };
  });

  const completedSteps = steps.filter((s) => s.completed).length;
  const currentStep = steps.find((s) => !s.completed) || null;

  return {
    steps,
    currentStep,
    currentSubStep:
      currentStep?.id === "business_info"
        ? currentStep.subSteps?.find((s) => !s.completed)
        : undefined,
    completedSteps,
    totalSteps: steps.length,
    progressPercentage: Math.round((completedSteps / steps.length) * 100),
    isComplete: completedSteps === steps.length,
    phoneProvisioningStatus:
      (onboardingProgress?.phone_provisioning_status as any) || "pending",
    phoneNumber: phoneEndpoint?.phone_number || null,
    phoneProvisioningError:
      onboardingProgress?.phone_provisioning_error || null,
  };
}

export async function updateBusinessInfo(
  businessId: string,
  data: {
    businessName: string;
    industry: string;
    timezone: string;
    businessDescription: string;
    agentName: string;
    personalizedGreeting: string;
  },
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("businesses")
    .update({
      name: data.businessName,
      industry: data.industry,
      timezone: data.timezone,
      description: data.businessDescription,
      assistant_name: data.agentName,
      personalized_greeting: data.personalizedGreeting,
    })
    .eq("id", businessId);

  if (error) {
    return { error: error.message };
  }

  // Mark step 1 as complete
  await saveOnboardingProgress(businessId, {
    step_2_business_info: true,
    step_1_review: true, // keep legacy flag in sync for backward compatibility
  });

  return { error: null };
}

export async function triggerPhoneProvisioning(
  businessId: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  // Mark as in progress
  await supabase
    .from("onboarding_progress")
    .update({
      phone_provisioning_status: "in_progress",
    })
    .eq("business_id", businessId);

  // Trigger the phone provisioning webhook
  try {
    const response = await fetch("/api/phone/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId }),
    });

    if (!response.ok) {
      const data = await response.json();
      await supabase
        .from("onboarding_progress")
        .update({
          phone_provisioning_status: "failed",
          phone_provisioning_error:
            data.error || "Failed to provision phone number",
        })
        .eq("business_id", businessId);

      return { error: data.error || "Failed to provision phone number" };
    }

    return { error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    await supabase
      .from("onboarding_progress")
      .update({
        phone_provisioning_status: "failed",
        phone_provisioning_error: errorMessage,
      })
      .eq("business_id", businessId);

    return { error: errorMessage };
  }
}

export async function isFirstTimeUser(userId: string): Promise<boolean> {
  const progress = await getOnboardingProgress(userId);
  return !progress.isComplete;
}

/**
 * Save onboarding progress to database
 * This ensures progress persists across sessions
 * Handles missing columns gracefully for backward compatibility
 */
export async function saveOnboardingProgress(
  businessId: string,
  updates: {
    step_1_website?: boolean;
    step_2_business_info?: boolean;
    step_3_phone_setup?: boolean;
    step_4_go_live?: boolean;
    website_training_completed?: boolean;
    step_1_review?: boolean;
    step_2_phone_verified?: boolean;
    step_3_go_live?: boolean;
    phone_provisioning_status?:
      | "pending"
      | "in_progress"
      | "completed"
      | "failed";
    phone_provisioning_error?: string | null;
  },
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const toBool = (value: any) => value === true;

  const computeCurrentStep = (flags: {
    step_1_website: boolean;
    step_2_business_info: boolean;
    step_3_phone_setup: boolean;
    step_4_go_live: boolean;
  }) => {
    if (!flags.step_1_website) return 1;
    if (!flags.step_2_business_info) return 2;
    if (!flags.step_3_phone_setup) return 3;
    if (!flags.step_4_go_live) return 4;
    return 4;
  };

  const now = new Date().toISOString();

  // Get existing progress or create new
  const { data: existing } = await supabase
    .from("onboarding_progress")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle();

  const existingFlags = {
    step_1_website: toBool(
      existing?.step_1_website ??
        existing?.website_training_completed ??
        existing?.step_1_review,
    ),
    step_2_business_info: toBool(
      existing?.step_2_business_info ?? existing?.step_1_review,
    ),
    step_3_phone_setup: toBool(
      existing?.step_3_phone_setup ?? existing?.step_2_phone_verified,
    ),
    step_4_go_live: toBool(
      existing?.step_4_go_live ??
        existing?.step_3_go_live ??
        existing?.step_3_test_call_completed,
    ),
  };

  const mergedFlags = {
    step_1_website: toBool(
      updates.step_1_website ?? existingFlags.step_1_website,
    ),
    step_2_business_info: toBool(
      updates.step_2_business_info ?? existingFlags.step_2_business_info,
    ),
    step_3_phone_setup: toBool(
      updates.step_3_phone_setup ?? existingFlags.step_3_phone_setup,
    ),
    step_4_go_live: toBool(
      updates.step_4_go_live ?? existingFlags.step_4_go_live,
    ),
  };

  const currentStep = computeCurrentStep(mergedFlags);

  // Build update object, excluding website_training_completed if column doesn't exist
  const updateData: any = {
    updated_at: now,
    current_step: currentStep,
  };

  // Only include keys that were explicitly provided to avoid overwriting data unintentionally
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      updateData[key] = value;
    }
  }

  if (existing) {
    // Update existing progress
    const { error } = await supabase
      .from("onboarding_progress")
      .update(updateData)
      .eq("business_id", businessId);

    if (error) {
      // If error is about missing column, try without website_training_completed
      if (
        error.message.includes("website_training_completed") ||
        error.message.includes("column") ||
        error.message.includes("schema cache")
      ) {
        const { website_training_completed, ...updateWithoutWebsite } =
          updateData;

        // Try again without website_training_completed
        const { error: retryError } = await supabase
          .from("onboarding_progress")
          .update(updateWithoutWebsite)
          .eq("business_id", businessId);

        if (retryError) {
          return { error: retryError.message };
        }

        // Log warning that column needs to be added
        console.warn(
          "⚠️  website_training_completed column not found. Please run the migration script: scripts/migrations/add-website-training-column.sql",
        );
        return { error: null }; // Return success but with warning
      }

      return { error: error.message };
    }
  } else {
    // Create new progress record
    // Try with website_training_completed first
    const insertData = {
      business_id: businessId,
      current_step: currentStep,
      step_1_website: mergedFlags.step_1_website,
      step_2_business_info: mergedFlags.step_2_business_info,
      step_3_phone_setup: mergedFlags.step_3_phone_setup,
      step_4_go_live: mergedFlags.step_4_go_live,
      phone_provisioning_status: updates.phone_provisioning_status ?? "pending",
      phone_provisioning_error: updates.phone_provisioning_error ?? null,
      website_training_completed: updates.website_training_completed,
      step_1_review: updates.step_1_review,
      step_2_phone_verified: updates.step_2_phone_verified,
      step_3_go_live: updates.step_3_go_live,
      updated_at: now,
    } as Record<string, any>;

    const { error } = await supabase
      .from("onboarding_progress")
      .insert(insertData);

    if (error) {
      // If error is about missing column, try without website_training_completed
      if (
        error.message.includes("website_training_completed") ||
        error.message.includes("column") ||
        error.message.includes("schema cache")
      ) {
        const { website_training_completed, ...insertWithoutWebsite } =
          updateData;

        const { error: retryError } = await supabase
          .from("onboarding_progress")
          .insert({
            business_id: businessId,
            current_step: 1,
            ...insertWithoutWebsite,
          });

        if (retryError) {
          return { error: retryError.message };
        }

        console.warn(
          "⚠️  website_training_completed column not found. Please run the migration script: scripts/migrations/add-website-training-column.sql",
        );
        return { error: null };
      }

      return { error: error.message };
    }
  }

  return { error: null };
}

/**
 * Mark website training as completed
 */
export async function markWebsiteTrainingComplete(
  businessId: string,
): Promise<{ error: string | null }> {
  return saveOnboardingProgress(businessId, {
    step_1_website: true,
    website_training_completed: true,
  });
}
