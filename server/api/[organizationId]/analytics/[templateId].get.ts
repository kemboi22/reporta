import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const templateId = getRouterParam(event, "templateId");
  const { period, dateFrom, dateTo } = getQuery(event);

  if (!organizationId) {
    throw createError({
      statusCode: 400,
      message: "Organization ID is required",
    });
  }

  if (!templateId) {
    throw createError({ statusCode: 400, message: "Template ID is required" });
  }

  // Calculate date range
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (dateFrom && dateTo) {
    // Custom date range
    startDate = new Date(dateFrom as string);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(dateTo as string);
    endDate.setHours(23, 59, 59, 999);
  } else if (period) {
    // Predefined period
    const days = parseInt(period as string);
    endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);
  }

  const workspace = await prisma.workspace.findFirst({
    where: { organizationId },
  });

  if (!workspace) {
    throw createError({ statusCode: 404, message: "Workspace not found" });
  }

  const template = await prisma.reportTemplate.findUnique({
    where: { id: templateId, workspaceId: workspace.id },
  });

  if (!template) {
    throw createError({ statusCode: 404, message: "Template not found" });
  }

  const summaryConfig = template.summaryConfig as any;
  const whereClause: any = {
    templateId: template.id,
  };

  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  }

  const reports = await prisma.report.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
  });

  const analytics: any = {
    totalReports: reports.length,
    sums: {},
    counts: {},
    averages: {},
    dailyBreakdown: [],
    fieldBreakdown: {},
    reports,
  };

  if (summaryConfig && reports.length > 0) {
    const fieldLabels: Record<string, string> = {};
    const sections = (template.fields as any)?.sections || [];
    sections.forEach((section: any) => {
      section.fields.forEach((field: any) => {
        if (field.id && field.label) {
          fieldLabels[field.id] = field.label;
        }
      });
    });

    if (
      summaryConfig.summableFields &&
      summaryConfig.summableFields.length > 0
    ) {
      summaryConfig.summableFields.forEach((fieldId: string) => {
        const sum = reports.reduce((acc: number, report: any) => {
          if (!report.content) return acc;
          const value = report.content[fieldId] as any;
          if (typeof value === "number") {
            return acc + value;
          }
          const parsed = parseFloat(value);
          return isNaN(parsed) ? acc : acc + parsed;
        }, 0);
        analytics.sums[fieldId] = {
          label: fieldLabels[fieldId] || fieldId,
          value: sum,
        };
      });
    }

    if (
      summaryConfig.countableFields &&
      summaryConfig.countableFields.length > 0
    ) {
      summaryConfig.countableFields.forEach((fieldId: string) => {
        const count = reports.filter((report: any) => {
          if (!report.content) return false;
          const value = report.content[fieldId] as any;
          return value !== undefined && value !== null && value !== "";
        }).length;
        analytics.counts[fieldId] = {
          label: fieldLabels[fieldId] || fieldId,
          value: count,
        };
      });
    }

    if (
      summaryConfig.summableFields &&
      summaryConfig.summableFields.length > 0
    ) {
      summaryConfig.summableFields.forEach((fieldId: string) => {
        const numericValues = reports
          .map((report: any) => {
            if (!report.content) return null;
            const value = report.content[fieldId] as any;
            if (typeof value === "number") return value;
            const parsed = parseFloat(value);
            return isNaN(parsed) ? null : parsed;
          })
          .filter((v) => v !== null);

        if (numericValues.length > 0) {
          const average =
            numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
          analytics.averages[fieldId] = {
            label: fieldLabels[fieldId] || fieldId,
            value: parseFloat(average.toFixed(2)),
          };
        }
      });
    }

    const dailyData: Record<
      string,
      { count: number; sums: Record<string, number> }
    > = {};
    reports.forEach((report: any) => {
      const dateKey = new Date(report.createdAt).toISOString().split("T")[0];
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { count: 0, sums: {} };
      }
      dailyData[dateKey].count++;

      if (summaryConfig.summableFields) {
        summaryConfig.summableFields.forEach((fieldId: string) => {
          if (!dailyData[dateKey].sums[fieldId]) {
            dailyData[dateKey].sums[fieldId] = 0;
          }
          if (!report.content) return;
          const value = report.content[fieldId] as any;
          if (typeof value === "number") {
            dailyData[dateKey].sums[fieldId] += value;
          } else {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
              dailyData[dateKey].sums[fieldId] += parsed;
            }
          }
        });
      }
    });

    analytics.dailyBreakdown = Object.entries(dailyData)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, data]) => ({
        date,
        reportCount: data.count,
        sums: data.sums,
      }));

    if (summaryConfig.showInSummaryFields) {
      summaryConfig.showInSummaryFields.forEach((fieldId: string) => {
        const values = reports
          .map((report) => report.content ? (report.content[fieldId] as any) : null)
          .filter((v) => v !== undefined && v !== null && v !== "");
        analytics.fieldBreakdown[fieldId] = {
          label: fieldLabels[fieldId] || fieldId,
          values: values,
          uniqueCount: new Set(values).size,
        };
      });
    }
  }

  return {
    template: {
      id: template.id,
      name: template.name,
      description: template.description,
    },
    summaryConfig,
    analytics,
    reports: reports.map((r) => ({
      id: r.id,
      title: r.title,
      status: r.status,
      submittedAt: r.submittedAt,
      createdAt: r.createdAt,
    })),
  };
});
