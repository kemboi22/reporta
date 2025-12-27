import { getOrganizationById } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }
  const organization = await getOrganizationById(id);
  if (!organization) {
    throw createError({ statusCode: 404, message: "Organization not found" });
  }
  return organization;
});
