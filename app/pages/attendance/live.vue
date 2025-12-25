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
        <h1 class="text-3xl font-bold text-foreground">Live Attendance</h1>
        <p class="text-muted-foreground mt-1">Real-time staff attendance monitoring</p>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-sm text-muted-foreground">Current Time</p>
          <p class="text-lg font-semibold text-foreground">08:45 AM</p>
        </div>
        <Button class="bg-blue-500 hover:bg-blue-600 text-white">
          <Clock class="h-4 w-4 mr-2" />
          Manual Clock In
        </Button>
      </div>
    </div>

    <!-- Top Metrics -->
    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Staff On Duty</p>
              <div class="flex items-baseline gap-2">
                <p class="text-3xl font-bold text-emerald-500">60</p>
                <span class="text-lg text-muted-foreground">/ 71</span>
              </div>
            </div>
            <div
              class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center"
            >
              <Users class="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <div class="mt-4">
            <Progress :value="(60 / 71) * 100" class="h-2" />
            <p class="text-sm text-muted-foreground mt-2">84.5% present</p>
          </div>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Late Arrivals</p>
              <p class="text-3xl font-bold text-amber-500">1</p>
            </div>
            <div
              class="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center"
            >
              <Clock class="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <p class="text-sm text-muted-foreground mt-4">Average delay: 35 min</p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Absent Today</p>
              <p class="text-3xl font-bold text-red-500">2</p>
            </div>
            <div
              class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center"
            >
              <AlertCircle class="h-6 w-6 text-red-500" />
            </div>
          </div>
          <p class="text-sm text-muted-foreground mt-4">2.8% absence rate</p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">On Time Rate</p>
              <p class="text-3xl font-bold text-blue-500">98%</p>
            </div>
            <div
              class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center"
            >
              <TrendingUp class="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p class="text-sm text-emerald-500 mt-4">+5% from yesterday</p>
        </CardContent>
      </Card>
    </div>

    <!-- Department Breakdown -->
    <Card class="border-border">
      <CardContent class="p-6">
        <h2 class="text-lg font-semibold text-foreground mb-6">
          Department Attendance
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="dept in departments"
            :key="dept.name"
            class="p-4 border border-border rounded-lg hover:shadow-md transition-all cursor-pointer"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium text-foreground">{{ dept.name }}</h3>
              <Badge variant="secondary"
                >{{ dept.onDuty }}/{{ dept.total }}</Badge
              >
            </div>

            <Progress
              :value="(dept.onDuty / dept.total) * 100"
              class="h-2 mb-2"
            />

            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">On Duty</span>
              <span class="font-medium text-foreground"
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
      <Card class="lg:col-span-2 border-border">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-6">
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
              Live Activity Feed
            </h2>

            <div class="relative w-64">
              <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input placeholder="Search..." class="pl-10" />
            </div>
          </div>

          <div class="space-y-3 max-h-[600px] overflow-y-auto">
            <div
              v-for="record in liveAttendance"
              :key="record.id"
              class="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Avatar class="h-12 w-12">
                <AvatarImage :src="record.photo" />
                <AvatarFallback class="bg-blue-50 text-blue-600">
                  {{ getInitials(record.name) }}
                </AvatarFallback>
              </Avatar>

              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-medium text-foreground">{{ record.name }}</h3>
                  <Badge
                    :class="
                      record.status === 'in'
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-muted text-muted-foreground hover:bg-muted'
                    "
                  >
                    {{ record.status === "in" ? "Clocked In" : "Clocked Out" }}
                  </Badge>
                </div>
                <div class="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{{ record.employeeId }}</span>
                  <span>•</span>
                  <span>{{ record.department }}</span>
                  <span>•</span>
                  <span>{{ record.clockTime }}</span>
                </div>
              </div>

              <div class="text-right">
                <div class="text-sm font-medium text-foreground">
                  {{ record.location }}
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ record.verification }}
                </div>
                <div class="text-xs text-muted-foreground mt-1">{{ record.time }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Alerts Sidebar -->
      <div class="space-y-6">
        <!-- Late Arrivals -->
        <Card class="border-amber-300 bg-amber-50">
          <CardContent class="p-6">
            <div class="flex items-center gap-2 mb-4">
              <Clock class="h-5 w-5 text-amber-600" />
              <h3 class="font-semibold text-amber-900">Late Arrivals (1)</h3>
            </div>

            <div class="space-y-3">
              <div
                v-for="person in lateArrivals"
                :key="person.employeeId"
                class="p-3 bg-background border border-amber-300 rounded-lg"
              >
                <div class="flex items-start gap-3">
                  <Avatar class="h-10 w-10">
                    <AvatarImage :src="person.photo" />
                    <AvatarFallback class="bg-amber-100 text-amber-700">
                      {{ getInitials(person.name) }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-foreground truncate">
                      {{ person.name }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ person.employeeId }}
                    </p>
                    <div class="mt-2 text-xs">
                      <span class="text-muted-foreground"
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
        <Card class="border-red-300 bg-red-50">
          <CardContent class="p-6">
            <div class="flex items-center gap-2 mb-4">
              <AlertCircle class="h-5 w-5 text-red-600" />
              <h3 class="font-semibold text-red-900">Absent Today (2)</h3>
            </div>

            <div class="space-y-3">
              <div
                v-for="person in absentToday"
                :key="person.employeeId"
                class="p-3 bg-background border border-red-300 rounded-lg"
              >
                <div class="flex items-start gap-3">
                  <Avatar class="h-10 w-10">
                    <AvatarImage :src="person.photo" />
                    <AvatarFallback class="bg-red-100 text-red-700">
                      {{ getInitials(person.name) }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-foreground truncate">
                      {{ person.name }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ person.employeeId }}
                    </p>
                    <p class="text-xs text-muted-foreground mt-1">
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
        <Card class="border-border">
          <CardContent class="p-6">
            <h3 class="font-semibold text-foreground mb-4">Current Shift</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-muted-foreground">Morning Shift</span>
                  <span class="font-medium text-foreground">6 AM - 2 PM</span>
                </div>
                <Progress :value="75" class="h-2" />
                <p class="text-xs text-muted-foreground mt-1">
                  5 hours 15 minutes remaining
                </p>
              </div>

              <div class="pt-3 border-t border-border">
                <p class="text-sm text-muted-foreground mb-2">Next Handover</p>
                <p class="text-lg font-semibold text-foreground">2:00 PM</p>
                <p class="text-xs text-muted-foreground">Afternoon Shift</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
