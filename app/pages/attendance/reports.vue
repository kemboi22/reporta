<script setup lang="ts">
import {
  Download,
  Calendar as CalendarIcon,
  FileText,
  Filter,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const dateRange = ref<Date | undefined>(new Date());
const selectedDepartment = ref("all");
const selectedPeriod = ref("week");

const attendanceData = [
  {
    id: 1,
    name: "Sarah Johnson",
    employeeId: "EMP001",
    department: "Nursing",
    daysPresent: 5,
    totalDays: 5,
    lateArrivals: 0,
    overtime: 2.5,
    percentage: 100,
    photo: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Mike Chen",
    employeeId: "EMP002",
    department: "Emergency",
    daysPresent: 4,
    totalDays: 5,
    lateArrivals: 1,
    overtime: 4.0,
    percentage: 80,
    photo: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Emma Davis",
    employeeId: "EMP003",
    department: "Pharmacy",
    daysPresent: 5,
    totalDays: 5,
    lateArrivals: 0,
    overtime: 1.5,
    percentage: 100,
    photo: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "James Wilson",
    employeeId: "EMP004",
    department: "Surgery",
    daysPresent: 5,
    totalDays: 5,
    lateArrivals: 2,
    overtime: 3.0,
    percentage: 100,
    photo: "/placeholder-user.jpg",
  },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

const getPercentageColor = (percentage: number) => {
  if (percentage >= 95) return "text-emerald-600";
  if (percentage >= 80) return "text-amber-600";
  return "text-red-600";
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Attendance Reports</h1>
        <p class="text-slate-600 mt-1">View and analyze attendance data</p>
      </div>

      <div class="flex gap-3">
        <Button variant="outline">
          <FileText class="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        <Button class="bg-blue-600 hover:bg-blue-700 text-white">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <Card class="border-slate-200">
      <CardContent class="p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <Select v-model="selectedPeriod">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline" class="w-60 justify-start">
                <CalendarIcon class="h-4 w-4 mr-2" />
                {{ dateRange ? dateRange.toLocaleDateString() : "Pick a date" }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar v-model="dateRange" />
            </PopoverContent>
          </Popover>

          <Select v-model="selectedDepartment">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="nursing">Nursing</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="pharmacy">Pharmacy</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" class="ml-auto">
            <Filter class="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Summary Cards -->
    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-slate-200">
        <CardContent class="p-6">
          <p class="text-sm text-slate-600 mb-1">Average Attendance</p>
          <p class="text-3xl font-bold text-emerald-600">95%</p>
          <p class="text-sm text-slate-500 mt-2">This week</p>
        </CardContent>
      </Card>

      <Card class="border-slate-200">
        <CardContent class="p-6">
          <p class="text-sm text-slate-600 mb-1">Total Present</p>
          <p class="text-3xl font-bold text-blue-600">19</p>
          <p class="text-sm text-slate-500 mt-2">Out of 20 days</p>
        </CardContent>
      </Card>

      <Card class="border-slate-200">
        <CardContent class="p-6">
          <p class="text-sm text-slate-600 mb-1">Late Arrivals</p>
          <p class="text-3xl font-bold text-amber-600">3</p>
          <p class="text-sm text-slate-500 mt-2">This week</p>
        </CardContent>
      </Card>

      <Card class="border-slate-200">
        <CardContent class="p-6">
          <p class="text-sm text-slate-600 mb-1">Overtime Hours</p>
          <p class="text-3xl font-bold text-purple-600">11</p>
          <p class="text-sm text-slate-500 mt-2">Total hours</p>
        </CardContent>
      </Card>
    </div>

    <!-- Attendance Table -->
    <Card class="border-slate-200">
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase"
                >
                  Staff
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase"
                >
                  Employee ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase"
                >
                  Department
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase"
                >
                  Days Present
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase"
                >
                  Late Arrivals
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase"
                >
                  Overtime (hrs)
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase"
                >
                  Attendance %
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr
                v-for="record in attendanceData"
                :key="record.id"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <Avatar class="h-10 w-10">
                      <AvatarImage :src="record.photo" />
                      <AvatarFallback class="bg-blue-100 text-blue-700">
                        {{ getInitials(record.name) }}
                      </AvatarFallback>
                    </Avatar>
                    <span class="text-sm font-medium text-slate-900">{{
                      record.name
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ record.employeeId }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge class="bg-blue-100 text-blue-700 hover:bg-blue-100">{{
                    record.department
                  }}</Badge>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-900"
                >
                  {{ record.daysPresent }} / {{ record.totalDays }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <Badge
                    :class="
                      record.lateArrivals > 0
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    "
                  >
                    {{ record.lateArrivals }}
                  </Badge>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-900"
                >
                  {{ record.overtime }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    :class="[
                      'text-sm font-semibold',
                      getPercentageColor(record.percentage),
                    ]"
                  >
                    {{ record.percentage }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Charts Placeholder -->
    <div class="grid lg:grid-cols-2 gap-6">
      <Card class="border-slate-200">
        <CardContent class="p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">
            Daily Attendance Trend
          </h3>
          <div
            class="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200"
          >
            <div class="text-center text-slate-400">
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
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
              <p class="text-sm">Attendance trend chart</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-slate-200">
        <CardContent class="p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">
            Department Comparison
          </h3>
          <div
            class="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200"
          >
            <div class="text-center text-slate-400">
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
              <p class="text-sm">Department comparison chart</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
