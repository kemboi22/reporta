<script setup lang="ts">
import { Search, Users, Clock, AlertCircle, TrendingUp } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const departments = [
  { name: "Nursing", onDuty: 18, total: 20, color: "bg-blue-600" },
  { name: "Emergency", onDuty: 12, total: 15, color: "bg-emerald-600" },
  { name: "Pharmacy", onDuty: 7, total: 8, color: "bg-purple-600" },
  { name: "Surgery", onDuty: 10, total: 12, color: "bg-amber-600" },
  { name: "Radiology", onDuty: 5, total: 6, color: "bg-rose-600" },
  { name: "Administration", onDuty: 8, total: 10, color: "bg-slate-600" },
];

const liveAttendance = [
  {
    id: 1,
    name: "Sarah Johnson",
    employeeId: "EMP001",
    department: "Nursing",
    time: "2 min ago",
    clockTime: "08:00 AM",
    status: "in",
    verification: "Biometric",
    location: "Main Entrance",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Mike Chen",
    employeeId: "EMP002",
    department: "Emergency",
    time: "5 min ago",
    clockTime: "07:57 AM",
    status: "in",
    verification: "Biometric",
    location: "ER Wing",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Emma Davis",
    employeeId: "EMP003",
    department: "Pharmacy",
    time: "8 min ago",
    clockTime: "05:50 PM",
    status: "out",
    verification: "Biometric",
    location: "Pharmacy Exit",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "James Wilson",
    employeeId: "EMP004",
    department: "Surgery",
    time: "12 min ago",
    clockTime: "08:05 AM",
    status: "in",
    verification: "Manual",
    location: "Surgery Wing",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    employeeId: "EMP005",
    department: "Radiology",
    time: "15 min ago",
    clockTime: "07:45 AM",
    status: "in",
    verification: "Biometric",
    location: "Main Entrance",
    photo: "/placeholder-user.jpg",
  },
];

const absentToday = [
  {
    name: "John Doe",
    employeeId: "EMP010",
    department: "Surgery",
    expectedTime: "08:00 AM",
    photo: "/placeholder-user.jpg",
  },
  {
    name: "Jane Smith",
    employeeId: "EMP015",
    department: "Nursing",
    expectedTime: "06:00 AM",
    photo: "/placeholder-user.jpg",
  },
];

const lateArrivals = [
  {
    name: "Robert Taylor",
    employeeId: "EMP006",
    department: "Administration",
    expectedTime: "08:00 AM",
    actualTime: "08:35 AM",
    delay: "35 min",
    photo: "/placeholder-user.jpg",
  },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Live Attendance</h1>
        <p class="text-slate-600 mt-1">Real-time staff attendance monitoring</p>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-sm text-slate-500">Current Time</p>
          <p class="text-lg font-semibold text-slate-900">08:45 AM</p>
        </div>
        <Button class="bg-blue-600 hover:bg-blue-700 text-white">
          <Clock class="h-4 w-4 mr-2" />
          Manual Clock In
        </Button>
      </div>
    </div>

    <!-- Top Metrics -->
    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-slate-200">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-slate-600 mb-1">Staff On Duty</p>
              <div class="flex items-baseline gap-2">
                <p class="text-3xl font-bold text-emerald-600">60</p>
                <span class="text-lg text-slate-400">/ 71</span>
              </div>
            </div>
            <div
              class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center"
            >
              <Users class="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div class="mt-4">
            <Progress :value="(60 / 71) * 100" class="h-2" />
            <p class="text-sm text-slate-500 mt-2">84.5% present</p>
          </div>
        </CardContent>
      </Card>

      <Card class="border-slate-200">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-slate-600 mb-1">Late Arrivals</p>
              <p class="text-3xl font-bold text-amber-600">1</p>
            </div>
            <div
              class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center"
            >
              <Clock class="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <p class="text-sm text-slate-500 mt-4">Average delay: 35 min</p>
        </CardContent>
      </Card>

      <Card class="border-slate-200">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-slate-600 mb-1">Absent Today</p>
              <p class="text-3xl font-bold text-red-600">2</p>
            </div>
            <div
              class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"
            >
              <AlertCircle class="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p class="text-sm text-slate-500 mt-4">2.8% absence rate</p>
        </CardContent>
      </Card>

      <Card class="border-slate-200">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-slate-600 mb-1">On Time Rate</p>
              <p class="text-3xl font-bold text-blue-600">98%</p>
            </div>
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <TrendingUp class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p class="text-sm text-emerald-600 mt-4">+5% from yesterday</p>
        </CardContent>
      </Card>
    </div>

    <!-- Department Breakdown -->
    <Card class="border-slate-200">
      <CardContent class="p-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-6">
          Department Attendance
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="dept in departments"
            :key="dept.name"
            class="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium text-slate-900">{{ dept.name }}</h3>
              <Badge variant="secondary"
                >{{ dept.onDuty }}/{{ dept.total }}</Badge
              >
            </div>

            <Progress
              :value="(dept.onDuty / dept.total) * 100"
              class="h-2 mb-2"
            />

            <div class="flex justify-between text-sm">
              <span class="text-slate-600">On Duty</span>
              <span class="font-medium text-slate-900"
                >{{ Math.round((dept.onDuty / dept.total) * 100) }}%</span
              >
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Main Content -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Live Feed -->
      <Card class="lg:col-span-2 border-slate-200">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2
              class="text-lg font-semibold text-slate-900 flex items-center gap-2"
            >
              <span class="relative flex h-3 w-3">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"
                ></span>
              </span>
              Live Activity Feed
            </h2>

            <div class="relative w-64">
              <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              />
              <Input placeholder="Search..." class="pl-10" />
            </div>
          </div>

          <div class="space-y-3 max-h-[600px] overflow-y-auto">
            <div
              v-for="record in liveAttendance"
              :key="record.id"
              class="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Avatar class="h-12 w-12">
                <AvatarImage :src="record.photo" />
                <AvatarFallback class="bg-blue-100 text-blue-700">
                  {{ getInitials(record.name) }}
                </AvatarFallback>
              </Avatar>

              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-medium text-slate-900">{{ record.name }}</h3>
                  <Badge
                    :class="
                      record.status === 'in'
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-100'
                    "
                  >
                    {{ record.status === "in" ? "Clocked In" : "Clocked Out" }}
                  </Badge>
                </div>
                <div class="flex items-center gap-3 text-sm text-slate-600">
                  <span>{{ record.employeeId }}</span>
                  <span>•</span>
                  <span>{{ record.department }}</span>
                  <span>•</span>
                  <span>{{ record.clockTime }}</span>
                </div>
              </div>

              <div class="text-right">
                <div class="text-sm font-medium text-slate-900">
                  {{ record.location }}
                </div>
                <div class="text-xs text-slate-500">
                  {{ record.verification }}
                </div>
                <div class="text-xs text-slate-400 mt-1">{{ record.time }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Alerts Sidebar -->
      <div class="space-y-6">
        <!-- Late Arrivals -->
        <Card class="border-amber-200 bg-amber-50">
          <CardContent class="p-6">
            <div class="flex items-center gap-2 mb-4">
              <Clock class="h-5 w-5 text-amber-600" />
              <h3 class="font-semibold text-amber-900">Late Arrivals (1)</h3>
            </div>

            <div class="space-y-3">
              <div
                v-for="person in lateArrivals"
                :key="person.employeeId"
                class="p-3 bg-white border border-amber-200 rounded-lg"
              >
                <div class="flex items-start gap-3">
                  <Avatar class="h-10 w-10">
                    <AvatarImage :src="person.photo" />
                    <AvatarFallback class="bg-amber-100 text-amber-700">
                      {{ getInitials(person.name) }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-900 truncate">
                      {{ person.name }}
                    </p>
                    <p class="text-xs text-slate-500">
                      {{ person.employeeId }}
                    </p>
                    <div class="mt-2 text-xs">
                      <span class="text-slate-600"
                        >Expected: {{ person.expectedTime }}</span
                      >
                      <br />
                      <span class="text-amber-700 font-medium"
                        >Actual: {{ person.actualTime }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Absent Staff -->
        <Card class="border-red-200 bg-red-50">
          <CardContent class="p-6">
            <div class="flex items-center gap-2 mb-4">
              <AlertCircle class="h-5 w-5 text-red-600" />
              <h3 class="font-semibold text-red-900">Absent Today (2)</h3>
            </div>

            <div class="space-y-3">
              <div
                v-for="person in absentToday"
                :key="person.employeeId"
                class="p-3 bg-white border border-red-200 rounded-lg"
              >
                <div class="flex items-start gap-3">
                  <Avatar class="h-10 w-10">
                    <AvatarImage :src="person.photo" />
                    <AvatarFallback class="bg-red-100 text-red-700">
                      {{ getInitials(person.name) }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-900 truncate">
                      {{ person.name }}
                    </p>
                    <p class="text-xs text-slate-500">
                      {{ person.employeeId }}
                    </p>
                    <p class="text-xs text-slate-600 mt-1">
                      {{ person.department }}
                    </p>
                    <p class="text-xs text-red-700 mt-1">
                      Expected: {{ person.expectedTime }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Shift Status -->
        <Card class="border-slate-200">
          <CardContent class="p-6">
            <h3 class="font-semibold text-slate-900 mb-4">Current Shift</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-600">Morning Shift</span>
                  <span class="font-medium text-slate-900">6 AM - 2 PM</span>
                </div>
                <Progress :value="75" class="h-2" />
                <p class="text-xs text-slate-500 mt-1">
                  5 hours 15 minutes remaining
                </p>
              </div>

              <div class="pt-3 border-t border-slate-200">
                <p class="text-sm text-slate-600 mb-2">Next Handover</p>
                <p class="text-lg font-semibold text-slate-900">2:00 PM</p>
                <p class="text-xs text-slate-500">Afternoon Shift</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
