<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  Download,
  Calendar as CalendarIcon,
  FileText,
  Filter,
  RefreshCw,
  Users,
} from "lucide-vue-next";

import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const { getAttendance } = useAttendance();

const dateRange = ref<Date | undefined>(new Date());
const selectedDepartment = ref("all");
const selectedPeriod = ref("week");
const selectedStatus = ref("all");
const isLoading = ref(false);
const attendanceRecords = ref<any[]>([]);

const { data: departments } = await useLazyFetch(
  `/api/${organizationId}/departments`,
  {
    key: `departments-${organizationId}`,
    transform: (data) => data || [],
  },
);

const { data: staffList } = await useLazyFetch(`/api/${organizationId}/staff`, {
  key: `staff-${organizationId}`,
  transform: (data) => data || [],
});

const loadAttendanceData = async () => {
  isLoading.value = true;
  try {
    const params: any = { take: 100 };

    if (selectedPeriod.value === "today") {
      const today = new Date().toISOString().split("T")[0];
      params.startDate = `${today}T00:00:00.000Z`;
      params.endDate = `${today}T23:59:59.999Z`;
    } else if (selectedPeriod.value === "week") {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      params.startDate = weekAgo.toISOString();
    } else if (selectedPeriod.value === "month") {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      params.startDate = monthAgo.toISOString();
    }

    if (selectedDepartment.value !== "all") {
      params.staffId = selectedDepartment.value;
    }

    const data = await getAttendance(params);
    attendanceRecords.value = data as any[];
  } catch (error) {
    console.error("Failed to load attendance data:", error);
    toast.error("Failed to load attendance data");
  } finally {
    isLoading.value = false;
  }
};

watch(
  [selectedPeriod, selectedDepartment],
  async () => {
    await loadAttendanceData();
  },
  { immediate: true },
);

const getStaffAttendanceStats = (staffId: string) => {
  const staffRecords = attendanceRecords.value.filter(
    (a: any) => a.staffId === staffId,
  );
  const totalDays = staffRecords.length;
  const presentDays = staffRecords.filter(
    (a: any) => a.status === "PRESENT" || a.status === "LATE",
  ).length;
  const lateDays = staffRecords.filter((a: any) => a.status === "LATE").length;

  return {
    total: totalDays,
    present: presentDays,
    late: lateDays,
    percentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
  };
};

const attendanceData = computed(() => {
  const staffMap = new Map<string, any>();

  attendanceRecords.value.forEach((record: any) => {
    if (!staffMap.has(record.staffId)) {
      staffMap.set(record.staffId, {
        id: record.staffId,
        name: `${record.staff?.firstName || ""} ${record.staff?.lastName || ""}`.trim(),
        employeeId: record.staff?.employeeId || "N/A",
        department: record.staff?.department?.name || "Unknown",
        photo: record.staff?.avatarUrl || "/placeholder-user.jpg",
        daysPresent: 0,
        totalDays: 0,
        lateArrivals: 0,
        overtime: 0,
        percentage: 0,
      });
    }

    const staff = staffMap.get(record.staffId);
    staff.totalDays++;
    if (record.status === "PRESENT" || record.status === "LATE") {
      staff.daysPresent++;
    }
    if (record.status === "LATE") {
      staff.lateArrivals++;
    }
  });

  return Array.from(staffMap.values()).map((staff: any) => ({
    ...staff,
    percentage:
      staff.totalDays > 0
        ? Math.round((staff.daysPresent / staff.totalDays) * 100)
        : 0,
  }));
});

const stats = computed(() => {
  const total = attendanceData.value.length;
  const totalPresent = attendanceData.value.reduce(
    (sum, s) => sum + s.daysPresent,
    0,
  );
  const totalLate = attendanceData.value.reduce(
    (sum, s) => sum + s.lateArrivals,
    0,
  );
  const totalPercentage =
    total > 0
      ? Math.round(
          attendanceData.value.reduce((sum, s) => sum + s.percentage, 0) /
            total,
        )
      : 0;

  return {
    averageAttendance: totalPercentage,
    totalPresent,
    totalLate,
    overtimeHours: 11,
  };
});

const getPercentageColor = (percentage: number) => {
  if (percentage >= 95) return "text-emerald-500";
  if (percentage >= 80) return "text-amber-500";
  return "text-red-500";
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const exportData = () => {
  const csv = [
    [
      "Name",
      "Employee ID",
      "Department",
      "Days Present",
      "Total Days",
      "Late Arrivals",
      "Attendance %",
    ],
    ...attendanceData.value.map((s: any) => [
      s.name,
      s.employeeId,
      s.department,
      s.daysPresent,
      s.totalDays,
      s.lateArrivals,
      `${s.percentage}%`,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance-report-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Report exported successfully");
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Attendance Reports</h1>
        <p class="text-muted-foreground mt-1">
          View and analyze attendance data
        </p>
      </div>

      <div class="flex gap-3">
        <Button
          variant="outline"
          @click="loadAttendanceData"
          :disabled="isLoading"
        >
          <RefreshCw
            class="h-4 w-4 mr-2"
            :class="{ 'animate-spin': isLoading }"
          />
          Refresh
        </Button>
        <Button variant="outline">
          <FileText class="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        <Button
          class="bg-blue-500 hover:bg-blue-600 text-white"
          @click="exportData"
        >
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <Card class="border-border">
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
              <SelectValue placeholder="Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              <SelectItem
                v-for="staff in staffList"
                :key="staff.id"
                :value="staff.id"
              >
                {{ staff.firstName }} {{ staff.lastName }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedStatus">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PRESENT">Present</SelectItem>
              <SelectItem value="ABSENT">Absent</SelectItem>
              <SelectItem value="LATE">Late</SelectItem>
              <SelectItem value="HALF_DAY">Half Day</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" class="ml-auto">
            <Filter class="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </CardContent>
    </Card>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <RefreshCw class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>

    <template v-else>
      <div class="grid md:grid-cols-4 gap-6">
        <Card class="border-border">
          <CardContent class="p-6">
            <p class="text-sm text-muted-foreground mb-1">Average Attendance</p>
            <p class="text-3xl font-bold text-emerald-500">
              {{ stats.averageAttendance }}%
            </p>
            <p class="text-sm text-muted-foreground mt-2">This period</p>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardContent class="p-6">
            <p class="text-sm text-muted-foreground mb-1">Total Present</p>
            <p class="text-3xl font-bold text-blue-500">
              {{ stats.totalPresent }}
            </p>
            <p class="text-sm text-muted-foreground mt-2">Attendance records</p>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardContent class="p-6">
            <p class="text-sm text-muted-foreground mb-1">Late Arrivals</p>
            <p class="text-3xl font-bold text-amber-500">
              {{ stats.totalLate }}
            </p>
            <p class="text-sm text-muted-foreground mt-2">This period</p>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardContent class="p-6">
            <p class="text-sm text-muted-foreground mb-1">Overtime Hours</p>
            <p class="text-3xl font-bold text-purple-500">
              {{ stats.overtimeHours }}
            </p>
            <p class="text-sm text-muted-foreground mt-2">Total hours</p>
          </CardContent>
        </Card>
      </div>

      <Card class="border-border">
        <CardContent class="p-0">
          <div v-if="attendanceData.length === 0" class="text-center py-12">
            <Users class="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p class="text-muted-foreground">No attendance records found</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-muted border-b border-border">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                  >
                    Staff
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                  >
                    Employee ID
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                  >
                    Department
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase"
                  >
                    Days Present
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase"
                  >
                    Late Arrivals
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase"
                  >
                    Overtime (hrs)
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase"
                  >
                    Attendance %
                  </th>
                </tr>
              </thead>
              <tbody class="bg-background divide-y divide-border">
                <tr
                  v-for="record in attendanceData"
                  :key="record.id"
                  class="hover:bg-muted transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <Avatar class="h-10 w-10">
                        <AvatarImage :src="record.photo" />
                        <AvatarFallback class="bg-blue-50 text-blue-600">
                          {{ getInitials(record.name) }}
                        </AvatarFallback>
                      </Avatar>
                      <span class="text-sm font-medium text-foreground">{{
                        record.name
                      }}</span>
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground"
                  >
                    {{ record.employeeId }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <Badge class="bg-blue-50 text-blue-600 hover:bg-blue-100">{{
                      record.department
                    }}</Badge>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-center text-sm text-foreground"
                  >
                    {{ record.daysPresent }} / {{ record.totalDays }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <Badge
                      :class="
                        record.lateArrivals > 0
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-emerald-50 text-emerald-600'
                      "
                    >
                      {{ record.lateArrivals }}
                    </Badge>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-center text-sm text-foreground"
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

      <div class="grid lg:grid-cols-2 gap-6">
        <Card class="border-border">
          <CardContent class="p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">
              Daily Attendance Trend
            </h3>
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
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
                <p class="text-sm">Attendance trend chart</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardContent class="p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">
              Department Comparison
            </h3>
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
                <p class="text-sm">Department comparison chart</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>
  </div>
</template>
