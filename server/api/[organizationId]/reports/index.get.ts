import { getReports, getReportCount } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const {
    page = "1",
    limit = "12",
    status,
    workspaceId,
    templateId,
    search,
    sortBy = "newest",
  } = getQuery(event);

  if (!organizationId) {
    throw createError({
      statusCode: 400,
      message: "Organization ID is required",
    });
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = { workspace: { organizationId } };

  if (workspaceId) {
    where.workspaceId = workspaceId;
  }

  if (templateId) {
    where.templateId = templateId;
  }

  if (status) {
    if (Array.isArray(status)) {
      where.status = { in: status };
    } else {
      where.status = status;
    }
  }

  const [reports, total] = await Promise.all([
    getReports({
      skip,
      take,
      where,
      include: {
        workspace: true,
        template: true,
      },
      orderBy: { createdAt: sortBy === "oldest" ? "asc" : "desc" },
    }),
    getReportCount({ where }),
  ]);

  const transformedReports = reports.map((report: any) => ({
    ...report,
    submittedBy: {
      id: report.submittedBy,
      name: report.submittedBy,
    },
  }));

  return {
    data: transformedReports,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      hasNextPage: skip + take < total,
      hasPrevPage: Number(page) > 1,
    },
  };
});
