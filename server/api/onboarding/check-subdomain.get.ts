import { checkSubdomainAvailability } from "../../services/onboarding.service";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const subdomain = query.subdomain as string;

  if (!subdomain) {
    throw createError({
      statusCode: 400,
      statusMessage: "Subdomain is required"
    });
  }

  const result = await checkSubdomainAvailability(subdomain);
  return result;
});
