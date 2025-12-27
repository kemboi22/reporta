import { deleteOrganization } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }
  const organization = await deleteOrganization(id);
  return organization;
});
