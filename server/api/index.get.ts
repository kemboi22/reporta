export default defineEventHandler(() => {
  return {
    name: "Reporta API",
    version: "1.0.0",
    endpoints: {
      onboarding: {
        checkSubdomain: "/api/onboarding/check-subdomain",
        complete: "/api/onboarding/complete"
      },
      organizations: "/api/organizations",
      workspaces: "/api/[organizationId]/workspaces",
      staff: "/api/[organizationId]/staff",
      tasks: "/api/[organizationId]/tasks",
      projects: "/api/[organizationId]/projects",
      attendance: "/api/[organizationId]/attendance",
      departments: "/api/[organizationId]/departments",
      leaveRequests: "/api/[organizationId]/leave-requests",
      reports: "/api/[organizationId]/reports",
      documents: "/api/[organizationId]/documents",
      notifications: "/api/[organizationId]/notifications",
    },
  };
});
