import { getOrganizationLeaveRequests } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const { skip, take, status } = getQuery(event);
  
  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const where: any = { organizationId };
  
  if (status) {
    where.status = status;
  }

  const leaveRequests = await getOrganizationLeaveRequests(organizationId, {
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    status: status as any,
  });
  
  return leaveRequests;
});
