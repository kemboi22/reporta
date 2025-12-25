<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  CheckSquare,
  FileText,
  Bell,
  LogIn,
  LogOut,
  Calendar,
  TrendingUp,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const isOnDuty = ref(false);
const currentTime = ref(new Date().toLocaleTimeString());
const todayHours = ref(4.38);

const clockInOut = () => {
  isOnDuty.value = !isOnDuty.value;
};

// Update time every second
// setInterval(() => {
//   currentTime.value = new Date().toLocaleTimeString();
// }, 1000);

const tasks = ref([
  {
    id: 1,
    title: "Complete Q4 Performance Review",
    dueDate: "Today, 5:00 PM",
    priority: "high",
    completed: false,
  },
  {
    id: 2,
    title: "Submit Weekly Report",
    dueDate: "Today, 6:00 PM",
    priority: "urgent",
    completed: false,
  },
  {
    id: 3,
    title: "Review Marketing Materials",
    dueDate: "Tomorrow",
    priority: "normal",
    completed: false,
  },
]);

const reports = ref([
  {
    id: 1,
    name: "Weekly Operations Summary",
    status: "not-started",
    dueDate: "Dec 24, 5:00 PM",
    dueIn: "8 hours",
  },
  {
    id: 2,
    name: "Monthly Sales Report",
    status: "in-progress",
    dueDate: "Dec 25",
    dueIn: "1 day",
  },
]);

const activities = ref([
  { time: "2 hours ago", action: "Completed task: Client Meeting Notes" },
  { time: "4 hours ago", action: "Clocked in for morning shift" },
  { time: "Yesterday", action: "Submitted Weekly Report" },
]);
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">My Dashboard</h1>
      <p class="text-slate-600 mt-1">
        Welcome back! Here's your day at a glance
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Clock Status Card -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Clock Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-center space-y-6">
            <div class="text-6xl font-bold text-slate-900">
              {{ currentTime }}
            </div>
            <div class="flex items-center justify-center gap-4">
              <Badge
                :class="
                  isOnDuty
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                "
                variant="outline"
                class="text-lg px-4 py-2"
              >
                {{ isOnDuty ? "On Duty" : "Off Duty" }}
              </Badge>
              <div class="text-sm text-slate-600">
                Shift:
                <span class="font-medium text-slate-900"
                  >Morning (6 AM - 2 PM)</span
                >
              </div>
            </div>
            <Button
              size="lg"
              :variant="isOnDuty ? 'destructive' : 'default'"
              class="w-full max-w-sm"
              @click="clockInOut"
            >
              <component :is="isOnDuty ? LogOut : LogIn" class="h-5 w-5 mr-2" />
              {{ isOnDuty ? "Clock Out" : "Clock In" }}
            </Button>
            <div class="text-sm text-slate-600">
              Today's Hours:
              <span class="font-bold text-lg text-slate-900"
                >{{ todayHours }}h</span
              >
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Stats -->
      <div class="space-y-4">
        <Card>
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-600">Tasks Assigned</p>
                <p class="text-3xl font-bold text-slate-900">8</p>
              </div>
              <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <CheckSquare class="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-600">Reports Due</p>
                <p class="text-3xl font-bold text-orange-600">2</p>
              </div>
              <div
                class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
              >
                <FileText class="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-600">Notifications</p>
                <p class="text-3xl font-bold text-purple-600">5</p>
              </div>
              <div
                class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
              >
                <Bell class="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- My Tasks Today -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>My Tasks Today</CardTitle>
            <Button variant="link">View All</Button>
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <input type="checkbox" class="mt-1" v-model="task.completed" />
            <div class="flex-1">
              <p class="font-medium text-slate-900">{{ task.title }}</p>
              <p class="text-sm text-slate-600 mt-1">Due: {{ task.dueDate }}</p>
            </div>
            <Badge
              :class="{
                'bg-red-100 text-red-700 border-red-200':
                  task.priority === 'urgent',
                'bg-orange-100 text-orange-700 border-orange-200':
                  task.priority === 'high',
                'bg-slate-100 text-slate-700 border-slate-200':
                  task.priority === 'normal',
              }"
              variant="outline"
            >
              {{ task.priority }}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <!-- My Reports -->
      <Card>
        <CardHeader>
          <CardTitle>My Reports</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-for="report in reports"
            :key="report.id"
            class="space-y-3 p-4 rounded-lg border border-slate-200"
          >
            <div>
              <p class="font-medium text-slate-900">{{ report.name }}</p>
              <p class="text-sm text-slate-600 mt-1">
                Due: {{ report.dueDate }}
              </p>
            </div>
            <Badge
              :class="{
                'bg-slate-100 text-slate-700 border-slate-200':
                  report.status === 'not-started',
                'bg-blue-100 text-blue-700 border-blue-200':
                  report.status === 'in-progress',
              }"
              variant="outline"
            >
              {{ report.status }}
            </Badge>
            <Button variant="outline" size="sm" class="w-full">
              Fill Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Activity -->
      <Card class="lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="(activity, index) in activities"
              :key="index"
              class="flex items-start gap-4 pb-4 border-b border-slate-200 last:border-0"
            >
              <div class="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p class="text-sm text-slate-900">{{ activity.action }}</p>
                <p class="text-xs text-slate-500 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
