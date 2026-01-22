import type { Report, ReportTemplate, Prisma } from "@/generated/prisma/client";
import { prisma } from "../utils/db";
import { cacheGet, cacheSet, cacheDel } from "../utils/redis";

const REPORT_CACHE_TTL = 600;
const TEMPLATE_CACHE_TTL = 3600;
const CACHE_PREFIX = "report:";
const TEMPLATE_PREFIX = "template:";

export type ReportCreateInput = Prisma.ReportCreateInput;
export type ReportUpdateInput = Prisma.ReportUpdateInput;
export type ReportWithRelations = Prisma.ReportGetPayload<{
  include: {
    workspace: true;
    template: true;
  };
}>;

export type TemplateCreateInput = Prisma.ReportTemplateCreateInput;
export type TemplateUpdateInput = Prisma.ReportTemplateUpdateInput;

export const getReportById = async (id: string): Promise<Report | null> => {
  const cacheKey = `${CACHE_PREFIX}${id}`;
  const cached = await cacheGet<Report>(cacheKey);
  if (cached) return cached;

  const report = await prisma.report.findUnique({
    where: { id },
  });

  if (report) {
    await cacheSet(cacheKey, report, REPORT_CACHE_TTL);
  }

  return report;
};

export const getReports = async (params?: {
  skip?: number;
  take?: number;
  where?: Prisma.ReportWhereInput;
  include?: Prisma.ReportInclude;
  orderBy?: Prisma.ReportOrderByWithRelationInput;
  order?: "asc" | "desc";
}): Promise<Report[]> => {
  const { skip = 0, take = 50, where, include, order = "desc" } = params || {};

  return prisma.report.findMany({
    skip,
    take,
    where,
    include,
    orderBy: { createdAt: order },
  });
};

export const getReportCount = async (params?: {
  where?: Prisma.ReportWhereInput;
}): Promise<number> => {
  const { where } = params || {};
  return prisma.report.count({ where });
};

export const createReport = async (
  data: ReportCreateInput,
): Promise<Report> => {
  const report = await prisma.report.create({ data });

  const cacheKey = `${CACHE_PREFIX}${report.id}`;
  await cacheSet(cacheKey, report, REPORT_CACHE_TTL);

  return report;
};

export const createReports = async (
  data: Array<{
    title: string;
    content: any;
    workspaceId: string;
    templateId: string;
    submittedBy: string;
    status: "DRAFT" | "SUBMITTED";
  }>,
): Promise<Report[]> => {
  const createdReports = await Promise.all(
    data.map((report) =>
      prisma.report.create({
        data: {
          title: report.title,
          content: report.content,
          workspaceId: report.workspaceId,
          templateId: report.templateId,
          submittedBy: report.submittedBy,
          status: report.status,
        },
      }),
    ),
  );

  return createdReports;
};

export const submitReport = async (id: string): Promise<Report> => {
  const report = await prisma.report.update({
    where: { id },
    data: {
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  await invalidateReportCache(id, report.workspaceId);

  return report;
};

export const updateReport = async (
  id: string,
  data: ReportUpdateInput,
): Promise<Report> => {
  const report = await prisma.report.update({
    where: { id },
    data,
  });

  await invalidateReportCache(id, report.workspaceId);

  return report;
};

export const deleteReport = async (id: string): Promise<Report> => {
  const report = await prisma.report.delete({
    where: { id },
  });

  await invalidateReportCache(id, report.workspaceId);

  return report;
};

export const approveReport = async (
  id: string,
  reviewedBy: string,
): Promise<Report> => {
  const report = await prisma.report.update({
    where: { id },
    data: {
      status: "APPROVED",
      reviewedBy,
      reviewedAt: new Date(),
    },
  });

  await invalidateReportCache(id, report.workspaceId);

  return report;
};

export const rejectReport = async (
  id: string,
  reviewedBy: string,
): Promise<Report> => {
  const report = await prisma.report.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewedBy,
      reviewedAt: new Date(),
    },
  });

  await invalidateReportCache(id, report.workspaceId);

  return report;
};

export const getTemplateById = async (
  id: string,
): Promise<ReportTemplate | null> => {
  const cacheKey = `${TEMPLATE_PREFIX}${id}`;
  const cached = await cacheGet<ReportTemplate>(cacheKey);
  if (cached) return cached;

  const template = await prisma.reportTemplate.findUnique({
    where: { id },
  });

  if (template) {
    await cacheSet(cacheKey, template, TEMPLATE_CACHE_TTL);
  }

  return template;
};

export const getTemplates = async (params?: {
  skip?: number;
  take?: number;
  where?: Prisma.ReportTemplateWhereInput;
}): Promise<ReportTemplate[]> => {
  const { skip = 0, take = 50, where } = params || {};

  return prisma.reportTemplate.findMany({
    skip,
    take,
    where,
    orderBy: { createdAt: "desc" },
  });
};

export const createTemplate = async (
  data: TemplateCreateInput,
): Promise<ReportTemplate> => {
  const template = await prisma.reportTemplate.create({ data });

  const cacheKey = `${TEMPLATE_PREFIX}${template.id}`;
  await cacheSet(cacheKey, template, TEMPLATE_CACHE_TTL);

  return template;
};

export const updateTemplate = async (
  id: string,
  data: TemplateUpdateInput,
): Promise<ReportTemplate> => {
  const template = await prisma.reportTemplate.update({
    where: { id },
    data,
  });

  await invalidateTemplateCache(id, template.workspaceId);

  return template;
};

export const deleteTemplate = async (id: string): Promise<ReportTemplate> => {
  const template = await prisma.reportTemplate.delete({
    where: { id },
  });

  await invalidateTemplateCache(id, template.workspaceId);

  return template;
};

const invalidateReportCache = async (
  id: string,
  workspaceId: string,
): Promise<void> => {
  await cacheDel(`${CACHE_PREFIX}${id}`);
};

const invalidateTemplateCache = async (
  id: string,
  workspaceId: string,
): Promise<void> => {
  await cacheDel(`${TEMPLATE_PREFIX}${id}`);
};
