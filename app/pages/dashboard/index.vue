<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, AlertCircle, AlertTriangle, Info } from "lucide-vue-next";
import MetricCard from "@/components/MetricCard.vue";
import QuickActionButton from "@/components/QuickActionButton.vue";
import AttendanceItem from "@/components/AttendanceItem.vue";
import ActivityItem from "@/components/ActivityItem.vue";
import { definePageMeta } from "#imports"; // Import definePageMeta

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const currentTime = ref("");

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

const metrics = {
  onDuty: 45,
  totalStaff: 50,
  tasksDue: 12,
  pendingReports: 8,
  complianceScore: 94,
};

const quickActions = [
  { label: "Clock In/Out", icon: "Clock", color: "blue", action: "clock" },
  {
    label: "Create Task",
    icon: "CheckSquare",
    color: "emerald",
    action: "task",
  },
  { label: "Fill Report", icon: "FileText", color: "amber", action: "report" },
  { label: "Upload Doc", icon: "Upload", color: "purple", action: "document" },
];

const recentAttendance = [
  {
    id: 1,
    name: "Sarah Johnson",
    department: "Nursing",
    time: "2 min ago",
    status: "in",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Mike Chen",
    department: "Emergency",
    time: "5 min ago",
    status: "in",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Emma Davis",
    department: "Pharmacy",
    time: "12 min ago",
    status: "out",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "James Wilson",
    department: "Surgery",
    time: "18 min ago",
    status: "in",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    department: "Radiology",
    time: "25 min ago",
    status: "in",
    photo: "/placeholder-user.jpg",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "task",
    user: "Dr. Smith",
    action: "completed",
    target: "Patient Review Form",
    time: "10 min ago",
  },
  {
    id: 2,
    type: "report",
    user: "Nurse Kelly",
    action: "submitted",
    target: "Daily Ward Report",
    time: "25 min ago",
  },
  {
    id: 3,
    type: "leave",
    user: "John Doe",
    action: "requested",
    target: "Annual Leave (3 days)",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "document",
    user: "Admin",
    action: "uploaded",
    target: "New Safety Protocol",
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "task",
    user: "Dr. Martinez",
    action: "created",
    target: "Equipment Maintenance",
    time: "3 hours ago",
  },
];

const alerts = [
  {
    id: 1,
    type: "error",
    variant: "destructive",
    title: "Overdue Tasks",
    description:
      "3 high-priority tasks are overdue and require immediate attention.",
  },
  {
    id: 2,
    type: "warning",
    variant: "default",
    title: "Report Deadline",
    description: "Monthly compliance report due in 4 hours.",
  },
  {
    id: 3,
    type: "info",
    variant: "default",
    title: "System Update",
    description:
      "Scheduled maintenance tonight at 11 PM. Expected downtime: 30 minutes.",
  },
];

const handleQuickAction = (action: string) => {
  console.log("[v0] Quick action triggered:", action);
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
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Dashboard</h1>
        <p class="text-muted-foreground mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock class="h-4 w-4" />
        <span>{{ currentTime }}</span>
      </div>
    </div>

    <!-- Top Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Staff On Duty"
        :value="metrics.onDuty"
        :total="metrics.totalStaff"
        icon="Users"
        color="emerald"
        trend="+5% from yesterday"
      />
      <MetricCard
        title="Tasks Due Today"
        :value="metrics.tasksDue"
        icon="CheckSquare"
        color="blue"
        trend="12 completed"
      />
      <MetricCard
        title="Pending Reports"
        :value="metrics.pendingReports"
        icon="FileText"
        color="amber"
        trend="3 overdue"
        :alert="true"
      />
      <MetricCard
        title="Compliance Score"
        :value="`${metrics.complianceScore}%`"
        icon="Shield"
        color="purple"
        trend="+2% this month"
      />
    </div>

    <!-- Quick Actions -->
    <Card class="border-border">
      <CardContent class="p-6">
        <h2 class="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
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

    <!-- Main Content Grid -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Live Attendance Feed -->
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2
              class="text-lg font-semibold text-foreground flex items-center gap-2"
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
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div class="space-y-2 max-h-96 overflow-y-auto">
            <AttendanceItem
              v-for="attendance in recentAttendance"
              :key="attendance.id"
              :attendance="attendance"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Recent Activity -->
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-foreground">
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div class="space-y-2 max-h-96 overflow-y-auto">
            <ActivityItem
              v-for="activity in recentActivity"
              :key="activity.id"
              :activity="activity"
            />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Placeholder -->
    <div class="grid lg:grid-cols-3 gap-6">
      <Card class="lg:col-span-2 border-border">
        <CardContent class="p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">
            Attendance Trend (Last 7 Days)
          </h2>
          <div
            class="h-64 flex items-center justify-center bg-muted rounded-lg border border-border"
          >
            <div class="text-center text-muted-foreground">
              <svg
                class="h-12 w-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p class="text-sm">Chart visualization will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">
            Task Completion
          </h2>
          <div
            class="h-64 flex items-center justify-center bg-muted rounded-lg border border-border"
          >
            <div class="text-center text-muted-foreground">
              <svg
                class="h-12 w-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
              <p class="text-sm">Chart visualization will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Alerts Panel -->
    <Card class="border-border">
      <CardContent class="p-6">
        <h2 class="text-lg font-semibold text-foreground mb-4">
          Alerts & Reminders
        </h2>
        <div class="space-y-3">
          <Alert
            v-for="alert in alerts"
            :key="alert.id"
            :class="
              alert.type === 'error'
                ? 'border-destructive bg-destructive/10'
                : alert.type === 'warning'
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-primary bg-primary/10'
            "
          >
            <component :is="getAlertIcon(alert.type)" class="h-4 w-4" />
            <AlertTitle>{{ alert.title }}</AlertTitle>
            <AlertDescription>{{ alert.description }}</AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
