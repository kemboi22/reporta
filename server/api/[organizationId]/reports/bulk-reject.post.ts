import { auth } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const body = await readBody(event);
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!organizationId) {
    throw createError({
      statusCode: 400,
      message: "Organization ID is required",
    });
  }

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { reportIds } = body;

  if (!reportIds || !Array.isArray(reportIds) || reportIds.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Report IDs are required",
    });
  }

  const workspace = await prisma.workspace.findFirst({
    where: { organizationId },
  });

  if (!workspace) {
    throw createError({ statusCode: 404, message: "Workspace not found" });
  }

  const reports = await prisma.report.findMany({
    where: {
      id: { in: reportIds },
      workspaceId: workspace.id,
      status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
    },
  });

  if (reports.length === 0) {
    throw createError({
      statusCode: 404,
      message: "No valid reports found to reject",
    });
  }

  await prisma.report.updateMany({
    where: { id: { in: reportIds } },
    data: { status: "REJECTED" },
  });

  return {
    success: true,
    count: reports.length,
    message: `${reports.length} report(s) rejected successfully`,
  };
});
