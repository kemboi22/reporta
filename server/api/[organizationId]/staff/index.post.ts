import { createStaff } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const body = await readBody(event);
  
  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const staff = await createStaff({
    ...body,
    organizationId,
  });
  
  setResponseStatus(event, 201);
  return staff;
});
