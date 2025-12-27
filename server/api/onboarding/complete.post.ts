import { completeOnboarding } from "../../services/onboarding.service";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.organizationName || !body.subdomain || !body.admin?.email || !body.admin?.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields"
    });
  }

  try {
    const result = await completeOnboarding(body);
    setResponseStatus(event, 201);
    return result;
  } catch (error: any) {
    throw createError({
      statusCode: error.code === "P2002" ? 409 : 500,
      statusMessage: error.message || "Failed to complete onboarding"
    });
  }
});
