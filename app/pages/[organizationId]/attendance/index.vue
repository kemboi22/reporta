<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { definePageMeta, navigateTo } from "#imports";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Calendar,
  Users,
  LogIn,
  LogOut,
  MapPin,
  History,
  RefreshCw,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const { checkIn, checkOut, getTodayAttendance, getAttendance } = useAttendance();

const selectedStaffId = ref<string>("");
const currentTime = ref(new Date());
const isCheckingIn = ref(false);
const isCheckingOut = ref(false);
const todayAttendance = ref<any[]>([]);
const recentAttendance = ref<any[]>([]);

let timeInterval: ReturnType<typeof setInterval>;

const { data: staffList } = await useLazyFetch(`/api/${organizationId}/staff`, {
  key: `staff-${organizationId}`,
  transform: (data) => data || [],
});

onMounted(async () => {
  await loadAttendanceData();
  timeInterval = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
});

const loadAttendanceData = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    todayAttendance.value = await getTodayAttendance() as any[];
    recentAttendance.value = await getAttendance({ take: 10 }) as any[];
  } catch (error) {
    console.error("Failed to load attendance data:", error);
  }
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getAttendanceStatus = (attendance: any) => {
  if (attendance.checkOut) return { label: "Checked Out", color: "bg-slate-100 text-slate-700" };
  return { label: "Checked In", color: "bg-emerald-100 text-emerald-700" };
};

const getTimeSinceCheckIn = (checkInTime: string) => {
  const checkIn = new Date(checkInTime);
  const now = new Date();
  const diffMs = now.getTime() - checkIn.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMins % 60}m`;
  }
  return `${diffMins}m`;
};

const canCheckOut = (attendance: any) => {
  return !attendance.checkOut && attendance.staffId === selectedStaffId.value;
};

const handleCheckIn = async () => {
  if (!selectedStaffId.value) {
    toast.error("Please select a staff member");
    return;
  }

  isCheckingIn.value = true;
  try {
    await checkIn({
      staffId: selectedStaffId.value,
      location: "Main Office",
    });
    toast.success("Successfully checked in!");
    await loadAttendanceData();
  } catch (error) {
    console.error("Failed to check in:", error);
    toast.error("Failed to check in. Please try again.");
  } finally {
    isCheckingIn.value = false;
  }
};

const handleCheckOut = async (attendanceId: string) => {
  isCheckingOut.value = true;
  try {
    await checkOut(attendanceId);
    toast.success("Successfully checked out!");
    await loadAttendanceData();
  } catch (error) {
    console.error("Failed to check out:", error);
    toast.error("Failed to check out. Please try again.");
  } finally {
    isCheckingOut.value = false;
  }
};

const stats = computed(() => {
  const total = todayAttendance.value?.length || 0;
  const checkedIn = todayAttendance.value?.filter((a: any) => !a.checkOut).length || 0;
  const checkedOut = total - checkedIn;
  
  return {
    total,
    checkedIn,
    checkedOut,
  };
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Attendance</h1>
        <p class="text-muted-foreground mt-1">{{ formatDate(currentTime) }}</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-sm text-muted-foreground">Current Time</p>
          <p class="text-xl font-semibold text-foreground">{{ formatTime(currentTime) }}</p>
        </div>
        <Button variant="outline" size="icon" @click="loadAttendanceData">
          <RefreshCw class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Staff On Duty</p>
              <p class="text-3xl font-bold text-emerald-500">{{ stats.checkedIn }}</p>
            </div>
            <div class="h-12 w-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <LogIn class="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <p class="text-sm text-muted-foreground mt-2">Checked in today</p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Checked Out</p>
              <p class="text-3xl font-bold text-slate-500">{{ stats.checkedOut }}</p>
            </div>
            <div class="h-12 w-12 bg-slate-50 rounded-lg flex items-center justify-center">
              <LogOut class="h-6 w-6 text-slate-500" />
            </div>
          </div>
          <p class="text-sm text-muted-foreground mt-2">Left for the day</p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Total Records</p>
              <p class="text-3xl font-bold text-blue-500">{{ stats.total }}</p>
            </div>
            <div class="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <History class="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p class="text-sm text-muted-foreground mt-2">Today's attendance</p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">Total Staff</p>
              <p class="text-3xl font-bold text-purple-500">{{ staffList?.length || 0 }}</p>
            </div>
            <div class="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users class="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <p class="text-sm text-muted-foreground mt-2">Registered staff</p>
        </CardContent>
      </Card>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <Card class="lg:col-span-1 border-border">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Clock class="h-5 w-5" />
            Check In / Check Out
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <label class="text-sm font-medium text-foreground mb-2 block">Select Staff Member</label>
            <Select v-model="selectedStaffId">
              <SelectTrigger>
                <SelectValue placeholder="Choose a staff member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="staff in staffList"
                  :key="staff.id"
                  :value="staff.id"
                >
                  {{ staff.firstName }} {{ staff.lastName }} ({{ staff.employeeId }})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="pt-4 border-t space-y-3">
            <Button
              class="w-full"
              :disabled="isCheckingIn || !selectedStaffId"
              @click="handleCheckIn"
            >
              <LogIn class="h-4 w-4 mr-2" />
              {{ isCheckingIn ? "Checking in..." : "Check In" }}
            </Button>

            <Button
              variant="outline"
              class="w-full"
              :disabled="!selectedStaffId"
              @click="navigateTo(`/${organizationId}/attendance/live`)"
            >
              <Users class="h-4 w-4 mr-2" />
              View Live Attendance
            </Button>

            <Button
              variant="outline"
              class="w-full"
              @click="navigateTo(`/${organizationId}/attendance/reports`)"
            >
              <Calendar class="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card class="lg:col-span-2 border-border">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <History class="h-5 w-5" />
            Recent Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="recentAttendance.length === 0" class="text-center py-8">
            <Clock class="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p class="text-muted-foreground">No attendance records found</p>
          </div>

          <div v-else class="space-y-3 max-h-[500px] overflow-y-auto">
            <div
              v-for="attendance in recentAttendance"
              :key="attendance.id"
              class="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users class="h-5 w-5 text-primary" />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <p class="font-medium text-foreground">
                    {{ attendance.staff?.firstName }} {{ attendance.staff?.lastName }}
                  </p>
                  <Badge
                    :class="getAttendanceStatus(attendance).color"
                    class="text-xs"
                  >
                    {{ getAttendanceStatus(attendance).label }}
                  </Badge>
                </div>
                <div class="flex items-center gap-3 text-sm text-muted-foreground">
                  <span class="flex items-center gap-1">
                    <LogIn class="h-3 w-3" />
                    {{ new Date(attendance.checkIn).toLocaleTimeString() }}
                  </span>
                  <span v-if="attendance.checkOut" class="flex items-center gap-1">
                    <LogOut class="h-3 w-3" />
                    {{ new Date(attendance.checkOut).toLocaleTimeString() }}
                  </span>
                  <span v-else class="flex items-center gap-1 text-emerald-600">
                    <Clock class="h-3 w-3" />
                    {{ getTimeSinceCheckIn(attendance.checkIn) }} ago
                  </span>
                </div>
              </div>

              <div v-if="canCheckOut(attendance)" class="flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  :disabled="isCheckingOut"
                  @click="handleCheckOut(attendance.id)"
                >
                  <LogOut class="h-4 w-4 mr-1" />
                  Check Out
                </Button>
              </div>

              <div v-else class="flex-shrink-0">
                <Badge variant="secondary">
                  {{ attendance.staff?.employeeId }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
