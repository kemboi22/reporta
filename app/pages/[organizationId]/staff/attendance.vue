<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta } from "#imports"; // Declare definePageMeta
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const currentMonth = ref("December 2024");

const attendanceData = ref([
  { date: 1, status: "present", hours: 8, clockIn: "08:00", clockOut: "17:00" },
  {
    date: 2,
    status: "present",
    hours: 8.5,
    clockIn: "07:55",
    clockOut: "17:25",
  },
  { date: 3, status: "late", hours: 7.5, clockIn: "08:30", clockOut: "17:00" },
  { date: 4, status: "present", hours: 8, clockIn: "08:00", clockOut: "17:00" },
  { date: 5, status: "present", hours: 8, clockIn: "08:05", clockOut: "17:05" },
  { date: 6, status: "leave", hours: 0, clockIn: "-", clockOut: "-" },
  { date: 7, status: "leave", hours: 0, clockIn: "-", clockOut: "-" },
  // ... more days
]);

const stats = ref({
  attendanceRate: 95,
  daysPresent: 19,
  totalDays: 20,
  lateArrivals: 1,
  totalHours: 152,
});
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">My Attendance</h1>
      <p class="text-muted-foreground mt-1">Track your attendance and working hours</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Attendance Rate</p>
              <p class="text-3xl font-bold text-green-600">
                {{ stats.attendanceRate }}%
              </p>
            </div>
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <TrendingUp class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Days Present</p>
              <p class="text-3xl font-bold text-foreground">
                {{ stats.daysPresent }}/{{ stats.totalDays }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <CalendarIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Late Arrivals</p>
              <p class="text-3xl font-bold text-orange-600">
                {{ stats.lateArrivals }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
            >
              <AlertCircle class="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Total Hours</p>
              <p class="text-3xl font-bold text-purple-600">
                {{ stats.totalHours }}h
              </p>
            </div>
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <Clock class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Calendar & History -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{{ currentMonth }}</CardTitle>
          <CardDescription>Your attendance calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']"
              :key="day"
              class="text-center text-sm font-medium text-muted-foreground p-2"
            >
              {{ day }}
            </div>
            <div
              v-for="item in attendanceData.slice(0, 21)"
              :key="item.date"
              :class="[
                'aspect-square rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-colors',
                item.status === 'present' &&
                  'bg-green-100 text-green-700 hover:bg-green-200',
                item.status === 'late' &&
                  'bg-orange-100 text-orange-700 hover:bg-orange-200',
                item.status === 'absent' &&
                  'bg-red-100 text-red-700 hover:bg-red-200',
                item.status === 'leave' &&
                  'bg-blue-100 text-blue-700 hover:bg-blue-200',
              ]"
            >
              {{ item.date }}
            </div>
          </div>
          <div class="flex items-center gap-4 mt-6 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-green-100 rounded"></div>
              <span class="text-muted-foreground">Present</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-orange-100 rounded"></div>
              <span class="text-muted-foreground">Late</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-red-100 rounded"></div>
              <span class="text-muted-foreground">Absent</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-blue-100 rounded"></div>
              <span class="text-muted-foreground">Leave</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clock-in History</CardTitle>
          <CardDescription>Recent attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="item in attendanceData.slice(0, 8)"
              :key="item.date"
              class="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <div class="flex items-center gap-3">
                <div class="text-sm font-medium text-foreground">
                  Dec {{ item.date }}
                </div>
                <Badge
                  :class="{
                    'bg-green-100 text-green-700 border-green-200':
                      item.status === 'present',
                    'bg-orange-100 text-orange-700 border-orange-200':
                      item.status === 'late',
                    'bg-blue-100 text-blue-700 border-blue-200':
                      item.status === 'leave',
                  }"
                  variant="outline"
                >
                  {{ item.status }}
                </Badge>
              </div>
              <div class="text-sm text-muted-foreground">
                {{ item.clockIn }} - {{ item.clockOut }} ({{ item.hours }}h)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
