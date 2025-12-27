import { getDepartments } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const { skip, take } = getQuery(event);
  
  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const departments = await getDepartments({
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    where: { organizationId },
  });
  
  return departments;
});
