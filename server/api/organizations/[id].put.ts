import { updateOrganization } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }
  const body = await readBody(event);
  const organization = await updateOrganization(id, body);
  return organization;
});
