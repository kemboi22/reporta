<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  AlertCircle,
  AlertTriangle,
  Info,
  Users,
  CheckSquare,
  FileText,
  Shield,
  TrendingUp,
  ArrowRight,
  BarChart3,
  PieChart,
  RefreshCw,
  Calendar,
  AlertOctagon,
} from "lucide-vue-next";
import QuickActionButton from "@/components/QuickActionButton.vue";
import AttendanceItem from "@/components/AttendanceItem.vue";
import ActivityItem from "@/components/ActivityItem.vue";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const currentTime = ref("");
const {
  data: dashboardData,
  pending: loading,
  error,
} = await useLazyFetch(`/api/${organizationId}/dashboard`, {
  key: `dashboard-${organizationId}`,
  transform: (data: any) => data?.data,
});

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

let timeInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 60000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
});

const metrics = computed(
  () =>
    dashboardData.value?.metrics || {
      onDuty: 0,
      totalStaff: 0,
      tasksDueToday: 0,
      tasksCompletedToday: 0,
      pendingReports: 0,
      complianceScore: 0,
    },
);

const recentAttendance = computed(
  () => dashboardData.value?.recentAttendance || [],
);
const recentActivity = computed(
  () => dashboardData.value?.recentActivity || [],
);
const alerts = computed(() => dashboardData.value?.alerts || []);
const attendanceTrend = computed(
  () => dashboardData.value?.attendanceTrend || [],
);
const taskCompletionData = computed(
  () => dashboardData.value?.taskCompletionData || {},
);
const workspaces = computed(() => dashboardData.value?.workspaces || []);
const departments = computed(() => dashboardData.value?.departments || []);
const userRole = computed(() => dashboardData.value?.role || "MEMBER");
const dueTasks = computed(() => dashboardData.value?.dueTasks || []);

const quickActions = computed(() => {
  const actions = [
    {
      label: "Projects",
      icon: "Clock",
      color: "blue",
      action: "/projects",
    },
    {
      label: "Create Task",
      icon: "CheckSquare",
      color: "emerald",
      action: "/tasks",
    },
    {
      label: "Fill Report",
      icon: "FileText",
      color: "amber",
      action: "/reports/templates",
    },
    {
      label: "Upload Doc",
      icon: "Upload",
      color: "purple",
      action: "/documents",
    },
  ];

  if (userRole.value === "VIEWER") {
    return actions.filter((a) => a.action === "clock");
  }

  return actions;
});

const handleQuickAction = async (action: string) => {
  await navigateTo(`/${organizationId}${action}`);
};

const getAlertIcon = (type: string) => {
  const icons: Record<string, any> = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };
  return icons[type] || Info;
};
</script>

<template>
  <div class="space-y-8">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <RefreshCw class="h-8 w-8 animate-spin text-primary" />
    </div>

    <div v-else-if="error" class="p-6">
      <Alert variant="destructive">
        <AlertCircle class="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>
    </div>

    <template v-else>
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          >
            Dashboard
          </h1>
          <p class="text-muted-foreground mt-2 text-lg">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <Badge v-if="userRole" variant="outline" class="capitalize">
            {{ userRole }}
          </Badge>
          <div
            class="flex items-center gap-3 px-4 py-2 rounded-full bg-muted/50 border border-border"
          >
            <Clock class="h-5 w-5 text-primary" />
            <span class="text-sm font-medium text-foreground">{{
              currentTime
            }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          class="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 p-6 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"
          ></div>
          <div class="relative">
            <div class="flex items-start justify-between">
              <div>
                <p
                  class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide"
                >
                  Staff On Duty
                </p>
                <div class="flex items-baseline gap-2 mt-3">
                  <h3 class="text-4xl font-bold text-foreground">
                    {{ metrics.onDuty }}
                  </h3>
                  <span class="text-xl text-muted-foreground"
                    >/ {{ metrics.totalStaff }}</span
                  >
                </div>
                <div
                  class="flex items-center gap-1 mt-3 text-sm text-emerald-600 dark:text-emerald-400"
                >
                  <TrendingUp class="h-4 w-4" />
                  <span class="font-medium"
                    >{{
                      metrics.totalStaff > 0
                        ? Math.round(
                            (metrics.onDuty / metrics.totalStaff) * 100,
                          )
                        : 0
                    }}% attendance rate</span
                  >
                </div>
              </div>
              <div
                class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <Users class="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div
          class="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"
          ></div>
          <div class="relative">
            <div class="flex items-start justify-between">
              <div>
                <p
                  class="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide"
                >
                  Tasks Due Today
                </p>
                <div class="flex items-baseline gap-2 mt-3">
                  <h3 class="text-4xl font-bold text-foreground">
                    {{ metrics.tasksDueToday }}
                  </h3>
                </div>
                <div
                  class="flex items-center gap-1 mt-3 text-sm text-blue-600 dark:text-blue-400"
                >
                  <TrendingUp class="h-4 w-4" />
                  <span class="font-medium"
                    >{{ metrics.tasksCompletedToday }} completed</span
                  >
                </div>
              </div>
              <div
                class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <CheckSquare class="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div
          class="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 p-6 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"
          ></div>
          <div class="relative">
            <div class="flex items-start justify-between">
              <div>
                <p
                  class="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide"
                >
                  Pending Reports
                </p>
                <div class="flex items-baseline gap-2 mt-3">
                  <h3 class="text-4xl font-bold text-foreground">
                    {{ metrics.pendingReports }}
                  </h3>
                </div>
                <div
                  class="flex items-center gap-1 mt-3 text-sm text-destructive"
                >
                  <AlertCircle class="h-4 w-4" />
                  <span class="font-medium">Awaiting submission</span>
                </div>
              </div>
              <div
                class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
              >
                <FileText class="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div
          class="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 p-6 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"
          ></div>
          <div class="relative">
            <div class="flex items-start justify-between">
              <div>
                <p
                  class="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide"
                >
                  Compliance Score
                </p>
                <div class="flex items-baseline gap-2 mt-3">
                  <h3 class="text-4xl font-bold text-foreground">
                    {{ metrics.complianceScore }}%
                  </h3>
                </div>
                <div
                  class="flex items-center gap-1 mt-3 text-sm text-purple-600 dark:text-purple-400"
                >
                  <TrendingUp class="h-4 w-4" />
                  <span class="font-medium">Report compliance</span>
                </div>
              </div>
              <div
                class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
              >
                <Shield class="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card class="border-border bg-gradient-to-br from-background to-muted/20">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-foreground">Quick Actions</h2>
            <Badge variant="secondary" class="font-medium"
              >{{ quickActions.length }} available</Badge
            >
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              v-for="action in quickActions"
              :key="action.label"
              :label="action.label"
              :icon="action.icon"
              :color="action.color"
              @click="handleQuickAction(action.action)"
            />
          </div>
        </CardContent>
      </Card>

      <div class="grid lg:grid-cols-2 gap-6">
        <Card
          class="border-border bg-gradient-to-br from-background to-muted/20 overflow-hidden"
        >
          <CardContent class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2
                class="text-xl font-bold text-foreground flex items-center gap-3"
              >
                <span class="relative flex h-3 w-3">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"
                  ></span>
                </span>
                Live Attendance
              </h2>
              <Button variant="ghost" size="sm" class="gap-2">
                View All
                <ArrowRight class="h-4 w-4" />
              </Button>
            </div>

            <div class="space-y-1 max-h-[420px] overflow-y-auto pr-2">
              <AttendanceItem
                v-for="attendance in recentAttendance"
                :key="attendance.id"
                :attendance="attendance"
              />
              <div
                v-if="recentAttendance.length === 0"
                class="text-center py-8 text-muted-foreground"
              >
                No recent attendance records
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          class="border-border bg-gradient-to-br from-background to-muted/20"
        >
          <CardContent class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-foreground">Recent Activity</h2>
              <Button variant="ghost" size="sm" class="gap-2">
                View All
                <ArrowRight class="h-4 w-4" />
              </Button>
            </div>

            <div class="space-y-1 max-h-[420px] overflow-y-auto pr-2">
              <ActivityItem
                v-for="activity in recentActivity"
                :key="activity.id"
                :activity="activity"
              />
              <div
                v-if="recentActivity.length === 0"
                class="text-center py-8 text-muted-foreground"
              >
                No recent activity
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card class="border-border bg-gradient-to-br from-background to-muted/20">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-foreground">Due Tasks Today</h2>
            <Badge variant="secondary" class="font-medium"
              >{{ dueTasks.length }} tasks</Badge
            >
          </div>
          <div v-if="dueTasks.length > 0" class="space-y-3">
            <div
              v-for="task in dueTasks"
              :key="task.id"
              class="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                :class="{
                  'bg-red-500/20 text-red-600': task.priority === 'URGENT',
                  'bg-amber-500/20 text-amber-600': task.priority === 'HIGH',
                  'bg-blue-500/20 text-blue-600': task.priority === 'MEDIUM',
                  'bg-gray-500/20 text-gray-600': task.priority === 'LOW',
                }"
              >
                <AlertOctagon class="h-5 w-5" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-semibold text-foreground truncate">
                    {{ task.title }}
                  </h3>
                  <Badge
                    variant="outline"
                    :class="{
                      'border-red-500/50 text-red-600':
                        task.priority === 'URGENT',
                      'border-amber-500/50 text-amber-600':
                        task.priority === 'HIGH',
                      'border-blue-500/50 text-blue-600':
                        task.priority === 'MEDIUM',
                      'border-gray-500/50 text-gray-600':
                        task.priority === 'LOW',
                    }"
                    class="capitalize flex-shrink-0"
                  >
                    {{ task.priority.toLowerCase() }}
                  </Badge>
                </div>
                <p
                  v-if="task.description"
                  class="text-sm text-muted-foreground mt-1 line-clamp-2"
                >
                  {{ task.description }}
                </p>
                <div
                  class="flex items-center gap-4 mt-3 text-xs text-muted-foreground"
                >
                  <div class="flex items-center gap-1">
                    <Calendar class="h-3.5 w-3.5" />
                    <span>{{
                      task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "No due date"
                    }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Users class="h-3.5 w-3.5" />
                    <span
                      >{{ task.assignees.length }} assignee{{
                        task.assignees.length !== 1 ? "s" : ""
                      }}</span
                    >
                  </div>
                  <Badge
                    variant="secondary"
                    :class="{
                      'bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30':
                        task.status === 'COMPLETED',
                      'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30':
                        task.status === 'IN_PROGRESS',
                      'bg-gray-500/20 text-gray-600 hover:bg-gray-500/30':
                        task.status === 'TODO',
                    }"
                    class="capitalize"
                  >
                    {{ task.status.toLowerCase().replace("_", " ") }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-muted-foreground">
            <CheckSquare
              class="h-12 w-12 mx-auto mb-3 text-muted-foreground/50"
            />
            <p class="text-sm font-medium">No tasks due today</p>
          </div>
        </CardContent>
      </Card>

      <div class="grid lg:grid-cols-3 gap-6">
        <Card
          class="lg:col-span-2 border-border bg-gradient-to-br from-background to-muted/20"
        >
          <CardContent class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-foreground">
                Attendance Trend (Last 7 Days)
              </h2>
              <Button variant="outline" size="sm" class="gap-2">
                <BarChart3 class="h-4 w-4" />
                Detailed View
              </Button>
            </div>
            <div
              v-if="attendanceTrend.length > 0"
              class="h-72 flex items-end justify-around gap-2 p-4 bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl border-2 border-dashed border-border"
            >
              <div
                v-for="item in attendanceTrend"
                :key="item.date"
                class="flex flex-col items-center gap-2 flex-1"
              >
                <div
                  class="w-full bg-primary/80 hover:bg-primary transition-all rounded-t-md"
                  :style="{
                    height: `${Math.max((item.count / 10) * 100, 10)}%`,
                  }"
                ></div>
                <span class="text-xs text-muted-foreground">{{
                  item.date
                }}</span>
                <span class="text-sm font-semibold">{{ item.count }}</span>
              </div>
            </div>
            <div
              v-else
              class="h-72 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl border-2 border-dashed border-border"
            >
              <p class="text-sm font-medium text-muted-foreground">
                No attendance data available
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          class="border-border bg-gradient-to-br from-background to-muted/20"
        >
          <CardContent class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-foreground">Task Completion</h2>
              <Badge
                class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
              >
                {{ taskCompletionData.percentage || 0 }}%
              </Badge>
            </div>
            <div
              v-if="taskCompletionData.percentage !== undefined"
              class="h-72 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl border-2 border-dashed border-border"
            >
              <div class="text-center space-y-4">
                <div class="grid grid-cols-3 gap-4">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-emerald-600">
                      {{ taskCompletionData.completed || 0 }}
                    </p>
                    <p class="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold text-blue-600">
                      {{ taskCompletionData.inProgress || 0 }}
                    </p>
                    <p class="text-xs text-muted-foreground">In Progress</p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold text-amber-600">
                      {{ taskCompletionData.todo || 0 }}
                    </p>
                    <p class="text-xs text-muted-foreground">To Do</p>
                  </div>
                </div>
                <div class="w-full bg-muted rounded-full h-4 overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                    :style="{ width: `${taskCompletionData.percentage}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="h-72 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl border-2 border-dashed border-border"
            >
              <p class="text-sm font-medium text-muted-foreground">
                No task data available
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card class="border-border bg-gradient-to-br from-background to-muted/20">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-foreground">
              Alerts & Reminders
            </h2>
            <Badge variant="secondary" class="font-medium"
              >{{ alerts.length }} active</Badge
            >
          </div>
          <div class="space-y-3">
            <Alert
              v-for="alert in alerts"
              :key="alert.id"
              :class="
                alert.type === 'error'
                  ? 'border-destructive/50 bg-destructive/5 hover:bg-destructive/10 transition-colors'
                  : alert.type === 'warning'
                    ? 'border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10 transition-colors'
                    : 'border-primary/50 bg-primary/5 hover:bg-primary/10 transition-colors'
              "
            >
              <component :is="getAlertIcon(alert.type)" class="h-4 w-4" />
              <AlertTitle class="font-semibold">{{ alert.title }}</AlertTitle>
              <AlertDescription class="text-sm">{{
                alert.description
              }}</AlertDescription>
            </Alert>
            <div
              v-if="alerts.length === 0"
              class="text-center py-4 text-muted-foreground"
            >
              No alerts at this time
            </div>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
