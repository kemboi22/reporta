import { prisma } from "../utils/db";
import { cacheGet, cacheSet } from "../utils/redis";

export interface DashboardMetrics {
  onDuty: number;
  totalStaff: number;
  tasksDueToday: number;
  tasksCompletedToday: number;
  pendingReports: number;
  complianceScore: number;
}

export interface AttendanceTrendItem {
  date: string;
  count: number;
}

export interface TaskCompletionData {
  completed: number;
  inProgress: number;
  todo: number;
  percentage: number;
}

export interface DashboardData {
  role: string;
  metrics: DashboardMetrics;
  recentAttendance: any[];
  recentActivity: any[];
  alerts: any[];
  attendanceTrend: AttendanceTrendItem[];
  taskCompletionData: TaskCompletionData;
  workspaces: any[];
  departments: any[];
  dueTasks: any[];
}

const CACHE_TTL = 300;

export async function getDashboardData(
  organizationId: string,
  userId?: string,
  userRole?: string
): Promise<DashboardData> {
  const CACHE_KEY = `dashboard:${organizationId}${userId ? `:${userId}` : ""}${userRole ? `:${userRole}` : ""}`;

  const cached = await cacheGet<DashboardData>(CACHE_KEY);
  if (cached) {
    return cached;
  }

  const data = await buildDashboardData(organizationId, userId, userRole);
  await cacheSet(CACHE_KEY, data, CACHE_TTL);

  return data;
}

export async function getOrganizationSettings(organizationId: string) {
  return await prisma.organization.findFirst({
    where: { id: organizationId },
    include: {
      settings: true,
    },
  });
}

export async function getStaffMetrics(
  organizationId: string,
  userRole?: string
): Promise<{ totalStaff: number; staffOnDuty: number }> {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));

  const totalStaff = await prisma.staff.count({
    where: { organizationId, isActive: true },
  });

  const activeAttendance = await prisma.attendance.groupBy({
    by: ["staffId"],
    where: {
      organizationId,
      checkIn: { gte: startOfDay },
      checkOut: null,
      status: "PRESENT",
    },
  });

  return {
    totalStaff,
    staffOnDuty: activeAttendance.length,
  };
}

export async function getTaskMetrics(
  organizationId: string,
  userRole?: string,
  userId?: string
): Promise<{
  tasksDueToday: number;
  completedTasksToday: number;
}> {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const baseWhere: any = {
    workspace: {
      organizationId,
    },
  };

  if (userRole === "MEMBER" && userId) {
    baseWhere.OR = [
      { assignees: { some: { userId } } },
      { assignedBy: userId },
    ];
  }

  const [tasksDueToday, completedTasksToday] = await Promise.all([
    prisma.task.count({
      where: {
        ...baseWhere,
        status: { in: ["TODO", "IN_PROGRESS"] },
        dueDate: { lte: endOfDay },
      },
    }),
    prisma.task.count({
      where: {
        ...baseWhere,
        status: "COMPLETED",
        completedAt: { gte: startOfDay, lte: endOfDay },
      },
    }),
  ]);

  return {
    tasksDueToday,
    completedTasksToday,
  };
}

export async function getReportMetrics(organizationId: string): Promise<{
  pendingReports: number;
  complianceScore: number;
}> {
  const [pendingReports, totalReports] = await Promise.all([
    prisma.report.count({
      where: {
        workspace: { organizationId },
        status: { in: ["DRAFT", "SUBMITTED"] },
      },
    }),
    prisma.report.count({
      where: { workspace: { organizationId } },
    }),
  ]);

  const complianceScore =
    totalReports > 0
      ? Math.round(((totalReports - pendingReports) / totalReports) * 100)
      : 100;

  return {
    pendingReports,
    complianceScore,
  };
}

export async function getOverdueTasks(organizationId: string): Promise<number> {
  return await prisma.task.count({
    where: {
      workspace: { organizationId },
      status: { in: ["TODO", "IN_PROGRESS"] },
      dueDate: { lt: new Date() },
    },
  });
}

export async function getPendingLeaveRequests(
  organizationId: string
): Promise<number> {
  return await prisma.leaveRequest.count({
    where: {
      organizationId,
      status: "PENDING",
    },
  });
}

export async function getRecentAttendance(
  organizationId: string,
  userRole?: string,
  userId?: string
): Promise<any[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const where: any = {
    organizationId,
    checkIn: { gte: sevenDaysAgo },
  };

  if (userRole === "MEMBER" && userId) {
    const userStaff = await prisma.staff.findFirst({
      where: { userId, organizationId },
    });

    if (userStaff && userStaff.departmentId) {
      const departmentStaff = await prisma.staff.findMany({
        where: {
          organizationId,
          departmentId: userStaff.departmentId,
        },
        select: { id: true },
      });

      where.staffId = { in: departmentStaff.map((s) => s.id) };
    }
  }

  return await prisma.attendance.findMany({
    where,
    include: {
      staff: {
        include: {
          department: true,
          user: true,
        },
      },
    },
    orderBy: { checkIn: "desc" },
    take: 10,
  });
}

export async function getRecentActivity(
  organizationId: string,
  userRole?: string,
  userId?: string
): Promise<any[]> {
  const where: any = { organizationId };

  if (userRole === "MEMBER" && userId) {
    where.userId = userId;
  }

  const auditLogs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return auditLogs.map((log: any) => ({
    id: log.id,
    type: log.action.toLowerCase(),
    user: log.userId ? `User ${log.userId.substring(0, 8)}` : "System",
    action: log.action.toLowerCase(),
    target: log.entityType,
    time: formatRelativeTime(log.createdAt),
  }));
}

export async function getAttendanceTrend(
  organizationId: string
): Promise<AttendanceTrendItem[]> {
  const trend: AttendanceTrendItem[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const dayAttendance = await prisma.attendance.count({
      where: {
        organizationId,
        checkIn: { gte: dayStart, lte: dayEnd },
      },
    });

    trend.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      count: dayAttendance,
    });
  }

  return trend;
}

export async function getTaskCompletionData(
  organizationId: string
): Promise<TaskCompletionData> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const taskStatusCounts = await prisma.task.groupBy({
    by: ["status"],
    _count: true,
    where: {
      workspace: { organizationId },
      createdAt: { gte: sevenDaysAgo },
    },
  });

  const totalTasks = taskStatusCounts.reduce(
    (sum: number, group: any) => sum + (group._count || 0),
    0
  );

  const completedTasks =
    taskStatusCounts.find((t: any) => t.status === "COMPLETED")?._count || 0;

  return {
    completed: completedTasks,
    inProgress: taskStatusCounts.find((t: any) => t.status === "IN_PROGRESS")?._count || 0,
    todo: taskStatusCounts.find((t: any) => t.status === "TODO")?._count || 0,
    percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
  };
}

export async function getDueTasks(
  organizationId: string,
  userRole?: string,
  userId?: string
): Promise<any[]> {
  const today = new Date();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const where: any = {
    workspace: {
      organizationId,
    },
    status: { in: ["TODO", "IN_PROGRESS"] },
    dueDate: { lte: endOfDay },
  };

  if (userRole === "MEMBER" && userId) {
    where.OR = [
      { assignees: { some: { userId } } },
      { assignedBy: userId },
    ];
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      assignees: {
        include: {
          user: true,
        },
      },
    },
    orderBy: [
      { priority: "desc" },
      { dueDate: "asc" },
    ],
    take: 10,
  });

  return tasks.map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    assignees: task.assignees.map((a: any) => ({
      id: a.id,
      name: a.user?.name || "Unassigned",
      avatar: a.user?.image || "/placeholder-user.jpg",
    })),
    workspace: task.workspace,
  }));
}

export async function getWorkspacesForDashboard(organizationId: string): Promise<any[]> {
  return await prisma.workspace.findMany({
    where: { organizationId },
    orderBy: { name: "asc" },
  });
}

export async function getDepartmentsForDashboard(organizationId: string): Promise<any[]> {
  return await prisma.department.findMany({
    where: { organizationId },
    include: {
      _count: {
        select: { staff: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function buildAlerts(
  organizationId: string,
  userRole?: string
): Promise<any[]> {
  const alerts: any[] = [];

  const [overdueTasks, pendingLeaveRequests, pendingReports] = await Promise.all([
    getOverdueTasks(organizationId),
    userRole === "VIEWER" ? 0 : getPendingLeaveRequests(organizationId),
    getReportMetrics(organizationId).then((r) => r.pendingReports),
  ]);

  if (overdueTasks > 0) {
    alerts.push({
      id: 1,
      type: "error",
      variant: "destructive",
      title: "Overdue Tasks",
      description: `${overdueTasks} tasks are overdue and require immediate attention.`,
    });
  }

  if (userRole !== "VIEWER" && pendingLeaveRequests > 0) {
    alerts.push({
      id: 2,
      type: "warning",
      variant: "default",
      title: "Leave Requests Pending",
      description: `${pendingLeaveRequests} leave requests awaiting approval.`,
    });
  }

  if (pendingReports > 0) {
    alerts.push({
      id: 3,
      type: "warning",
      variant: "default",
      title: "Pending Reports",
      description: `${pendingReports} reports need to be submitted.`,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 4,
      type: "info",
      variant: "default",
      title: "All Caught Up!",
      description: "No pending alerts at the moment.",
    });
  }

  return alerts;
}

async function buildDashboardData(
  organizationId: string,
  userId?: string,
  userRole: string = "MEMBER"
): Promise<DashboardData> {
  const [
    orgSettings,
    { totalStaff, staffOnDuty },
    { tasksDueToday, completedTasksToday },
    { pendingReports, complianceScore },
    recentAttendance,
    recentActivity,
    attendanceTrend,
    taskCompletionData,
    dueTasks,
    workspaces,
    departments,
    alerts,
  ] = await Promise.all([
    getOrganizationSettings(organizationId),
    getStaffMetrics(organizationId, userRole),
    getTaskMetrics(organizationId, userRole, userId),
    getReportMetrics(organizationId),
    getRecentAttendance(organizationId, userRole, userId),
    getRecentActivity(organizationId, userRole, userId),
    getAttendanceTrend(organizationId),
    getTaskCompletionData(organizationId),
    getDueTasks(organizationId, userRole, userId),
    getWorkspacesForDashboard(organizationId),
    getDepartmentsForDashboard(organizationId),
    buildAlerts(organizationId, userRole),
  ]);

  if (!orgSettings) {
    throw new Error("Organization not found");
  }

  return {
    role: userRole,
    metrics: {
      onDuty: staffOnDuty,
      totalStaff,
      tasksDueToday,
      tasksCompletedToday: completedTasksToday,
      pendingReports,
      complianceScore,
    },
    recentAttendance: recentAttendance.map((att: any) => ({
      id: att.id,
      name: `${att.staff.firstName} ${att.staff.lastName}`,
      department: att.staff.department?.name || "Unassigned",
      time: formatRelativeTime(att.checkIn),
      status: att.checkOut ? "out" : "in",
      photo: att.staff.avatar || att.staff.user?.image || "/placeholder-user.jpg",
    })),
    recentActivity,
    alerts,
    attendanceTrend,
    taskCompletionData,
    workspaces,
    departments,
    dueTasks,
  };
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
