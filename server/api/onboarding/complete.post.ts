import { completeOnboarding } from "../../services/onboarding.service";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const body = await readBody(event);

  if (!body.organizationName || !body.subdomain || !body.organizationType) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  const nameParts = session.user.name?.split(" ") || ["", ""];

  try {
    const result = await completeOnboarding({
      organizationName: body.organizationName,
      subdomain: body.subdomain,
      organizationType: body.organizationType,
      admin: {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: session.user.email,
        password: "",
      },
      settings: {
        timezone: body.settings?.timezone || "UTC",
        currency: body.settings?.currency || "USD",
        workingHoursStart: body.settings?.workingHoursStart || "09:00",
        workingHoursEnd: body.settings?.workingHoursEnd || "17:00",
        weekendDays: body.settings?.weekendDays || ["saturday", "sunday"],
        logo: body.settings?.logo,
      },
      invitations: body.invitations || [],
      userId: session.user.id,
    });
    setResponseStatus(event, 201);
    return result;
  } catch (error: any) {
    throw createError({
      statusCode: error.code === "P2002" ? 409 : 500,
      statusMessage: error.message || "Failed to complete onboarding",
    });
  }
});
