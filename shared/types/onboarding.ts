export type OrganizationType = 
  | "healthcare"
  | "corporate"
  | "manufacturing"
  | "education"
  | "retail"
  | "hospitality"
  | "other";

export type WeekDay = 
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface OnboardingStep1Data {
  organizationName: string;
  subdomain: string;
  organizationType: OrganizationType;
}

export interface OnboardingStep2Data {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface OnboardingStep3Data {
  timezone: string;
  currency: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  weekendDays: WeekDay[];
  logo?: File | null;
  logoBase64?: string;
}

export interface OnboardingStep4Data {
  emails: string[];
}

export interface OnboardingData {
  step1: OnboardingStep1Data;
  step2: OnboardingStep2Data;
  step3: OnboardingStep3Data;
  step4: OnboardingStep4Data;
}

export interface SubdomainCheckResponse {
  available: boolean;
  message?: string;
}

export interface OnboardingCompleteRequest {
  organizationName: string;
  subdomain: string;
  organizationType: OrganizationType;
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  settings: {
    timezone: string;
    currency: string;
    workingHoursStart: string;
    workingHoursEnd: string;
    weekendDays: WeekDay[];
    logo?: string;
  };
  invitations: string[];
}

export interface OnboardingCompleteResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
    subdomain: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
  };
  workspace: {
    id: string;
    name: string;
    slug: string;
  };
  invitationsSent: number;
}
