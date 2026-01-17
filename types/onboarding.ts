// export type OnboardingStepId =
//   | "welcome"
//   | "business_setup"
//   | "phone_number"
//   | "receptionist_config"
//   | "knowledge_base"
//   | "first_call"
//   | "complete";

// export type ReceptionistSubStepId =
//   | "receptionist_configuration"
//   | "receptionist_services"
//   | "receptionist_voice"
//   | "receptionist_hours";

// export interface ReceptionistSubStep {
//   id: ReceptionistSubStepId;
//   title: string;
//   description: string;
//   actionLabel: string;
//   actionUrl: string;
//   completed: boolean;
//   order: number;
// }

// export interface OnboardingStep {
//   id: OnboardingStepId;
//   title: string;
//   description: string;
//   actionLabel?: string;
//   actionUrl?: string;
//   completed: boolean;
//   order: number;
//   subSteps?: ReceptionistSubStep[];
// }

// export interface ReceptionistProgress {
//   subSteps: ReceptionistSubStep[];
//   completedSubSteps: number;
//   totalSubSteps: number;
//   progressPercentage: number;
//   isComplete: boolean;
//   currentSubStep: ReceptionistSubStep | null;
// }

// export interface OnboardingProgress {
//   steps: OnboardingStep[];
//   currentStep: OnboardingStep | null;
//   completedSteps: number;
//   totalSteps: number;
//   progressPercentage: number;
//   isComplete: boolean;
//   receptionistProgress?: ReceptionistProgress;
// }

export type OnboardingStepId =
  | "welcome"
  | "website_training"
  | "business_info"
  | "phone_verification"
  | "go_live";

export type BusinessInfoSubStepId =
  | "business_details"
  | "agent_setup"
  | "greeting_tone"
  | "review";

export interface BusinessInfoSubStep {
  id: BusinessInfoSubStepId;
  title: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface OnboardingStep {
  id: OnboardingStepId;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  completed: boolean;
  order: number;
  subSteps?: BusinessInfoSubStep[];
}

export interface OnboardingProgress {
  steps: OnboardingStep[];
  currentStep: OnboardingStep | null;
  currentSubStep?: BusinessInfoSubStep | null;
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
  isComplete: boolean;
  phoneProvisioningStatus?: "pending" | "in_progress" | "completed" | "failed";
  phoneNumber?: string | null;
  phoneProvisioningError?: string | null;
}

export type ReceptionistSubStepId =
  | "receptionist_configuration"
  | "receptionist_services"
  | "receptionist_voice"
  | "receptionist_hours";

export interface ReceptionistSubStep {
  id: ReceptionistSubStepId;
  title: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
  completed: boolean;
  order: number;
}

export interface ReceptionistProgress {
  subSteps: ReceptionistSubStep[];
  completedSubSteps: number;
  totalSubSteps: number;
  progressPercentage: number;
  isComplete: boolean;
  currentSubStep: ReceptionistSubStep | null;
}
