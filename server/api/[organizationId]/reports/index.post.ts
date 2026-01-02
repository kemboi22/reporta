import { createReport, createReports } from "~~/server/services";
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

  const workspace = await prisma.workspace.findFirst({
    where: { organizationId },
  });

  if (!workspace) {
    throw createError({ statusCode: 404, message: "Workspace not found" });
  }

  if (body.records && Array.isArray(body.records) && body.records.length > 0) {
    const reports = await createReports(
      body.records.map((record: any) => ({
        title: record.title,
        content: record.content || {},
        workspaceId: workspace.id,
        templateId: body.templateId || record.templateId,
        submittedBy: session.user.name,
        status: "SUBMITTED",
      })),
    );

    setResponseStatus(event, 201);
    return reports;
  }

  const createData: any = {
    title: body.title,
    content: body.content || {},
    workspace: { connect: { id: workspace.id } },
    submittedBy: session.user.name,
    status: "SUBMITTED",
  };

  if (body.templateId) {
    createData.template = { connect: { id: body.templateId } };
  }

  const report = await createReport(createData);

  setResponseStatus(event, 201);
  return report;
});
