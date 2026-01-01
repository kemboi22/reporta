<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Search, Users, Clock, AlertCircle, TrendingUp } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const { getTodayAttendance } = useAttendance();

const searchQuery = ref("");
const currentTime = ref(new Date());
const attendanceData = ref<any[]>([]);
const isLoading = ref(true);

let timeInterval: ReturnType<typeof setInterval>;
let pollInterval: ReturnType<typeof setInterval>;

onMounted(async () => {
  await loadAttendanceData();
  timeInterval = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
  pollInterval = setInterval(async () => {
    await loadAttendanceData();
  }, 30000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
  clearInterval(pollInterval);
});

const loadAttendanceData = async () => {
  isLoading.value = true;
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await getTodayAttendance();
    attendanceData.value = data as any[];
  } catch (error) {
    console.error("Failed to load attendance data:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const departments = computed(() => {
  const deptMap = new Map<string, { name: string; onDuty: number; total: number; color: string }>();
  
  attendanceData.value.forEach((a: any) => {
    const dept = a.staff?.department?.name || "Other";
    if (!deptMap.has(dept)) {
      deptMap.set(dept, { name: dept, onDuty: 0, total: 0, color: "bg-blue-600" });
    }
    deptMap.get(dept)!.onDuty++;
  });

  return Array.from(deptMap.values());
});

const liveAttendance = computed(() => {
  let filtered = attendanceData.value || [];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((a: any) => 
      a.staff?.firstName?.toLowerCase().includes(query) ||
      a.staff?.lastName?.toLowerCase().includes(query) ||
      a.staff?.employeeId?.toLowerCase().includes(query)
    );
  }

  return filtered.map((a: any) => ({
    id: a.id,
    name: `${a.staff?.firstName || ""} ${a.staff?.lastName || ""}`.trim(),
    employeeId: a.staff?.employeeId || "N/A",
    department: a.staff?.department?.name || "Other",
    time: getTimeSince(a.checkIn),
    clockTime: formatTime(new Date(a.checkIn)),
    status: a.checkOut ? "out" : "in",
    verification: a.device?.type === "BIOMETRIC" ? "Biometric" : "Manual",
    location: a.location || "Main Entrance",
    photo: a.staff?.avatarUrl || "/placeholder-user.jpg",
    checkIn: a.checkIn,
    checkOut: a.checkOut,
  }));
});

const getTimeSince = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffHours / 24)} days ago`;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const stats = computed(() => {
  const total = attendanceData.value?.length || 0;
  const checkedIn = attendanceData.value?.filter((a: any) => !a.checkOut).length || 0;
  const checkedOut = total - checkedIn;
  
  return {
    staffOnDuty: checkedIn,
    totalStaff: 100,
    lateArrivals: 1,
    absentToday: 2,
    onTimeRate: 98,
  };
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Live Attendance</h1>
        <p class="text-muted-foreground mt-1">Real-time staff attendance monitoring</p>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-sm text-muted-foreground">Current Time</p>
          <p class="text-lg font-semibold text-foreground">{{ formatTime(currentTime) }}</p>
        </div>
        <Button class="bg-blue-500 hover:bg-blue-600 text-white" @click="loadAttendanceData" :disabled="isLoading">
          <Clock class="h-4 w-4 mr-2" />
          {{ isLoading ? "Loading..." : "Manual Clock In" }}
        </Button>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Clock class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>

    <template v-else>
      <div class="grid md:grid-cols-4 gap-6">
        <Card class="border-border">
          <CardContent class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-muted-foreground mb-1">Staff On Duty</p>
                <div class="flex items-baseline gap-2">
                  <p class="text-3xl font-bold text-emerald-500">{{ stats.staffOnDuty }}</p>
                  <span class="text-lg text-muted-foreground">/ {{ stats.totalStaff }}</span>
                </div>
              </div>
              <div class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Users class="h-6 w-6 text-emerald-500" />
              </div>
            </div>
            <div class="mt-4">
              <Progress :value="(stats.staffOnDuty / stats.totalStaff) * 100" class="h-2" />
              <p class="text-sm text-muted-foreground mt-2">
                {{ Math.round((stats.staffOnDuty / stats.totalStaff) * 100) }}% present
              </p>
            </div>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardContent class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-muted-foreground mb-1">Late Arrivals</p>
                <p class="text-3xl font-bold text-amber-500">{{ stats.lateArrivals }}</p>
              </div>
              <div class="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
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
                <p class="text-3xl font-bold text-red-500">{{ stats.absentToday }}</p>
              </div>
              <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle class="h-6 w-6 text-red-500" />
              </div>
            </div>
            <p class="text-sm text-muted-foreground mt-2">{{ (stats.absentToday / stats.totalStaff * 100).toFixed(1) }}% absence rate</p>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardContent class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-muted-foreground mb-1">On Time Rate</p>
                <p class="text-3xl font-bold text-blue-500">{{ stats.onTimeRate }}%</p>
              </div>
              <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp class="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p class="text-sm text-emerald-500 mt-4">+5% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <Card class="border-border">
        <CardContent class="p-6">
          <h2 class="text-lg font-semibold text-foreground mb-6">Department Attendance</h2>
          <div v-if="departments.length === 0" class="text-center py-4 text-muted-foreground">
            No attendance data available
          </div>
          <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="dept in departments"
              :key="dept.name"
              class="p-4 border border-border rounded-lg hover:shadow-md transition-all cursor-pointer"
            >
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-medium text-foreground">{{ dept.name }}</h3>
                <Badge variant="secondary">{{ dept.onDuty }}</Badge>
              </div>

              <Progress :value="100" class="h-2 mb-2" />

              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">On Duty</span>
                <span class="font-medium text-foreground">{{ dept.onDuty }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div class="grid lg:grid-cols-3 gap-6">
        <Card class="lg:col-span-2 border-border">
          <CardContent class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-foreground flex items-center gap-2">
                <span class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                Live Activity Feed
              </h2>

              <div class="relative w-64">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input v-model="searchQuery" placeholder="Search staff..." class="pl-10" />
              </div>
            </div>

            <div v-if="liveAttendance.length === 0" class="text-center py-8">
              <Users class="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p class="text-muted-foreground">No attendance records found</p>
            </div>

            <div v-else class="space-y-3 max-h-[600px] overflow-y-auto">
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

        <div class="space-y-6">
          <Card class="border-amber-300 bg-amber-50">
            <CardContent class="p-6">
              <div class="flex items-center gap-2 mb-4">
                <Clock class="h-5 w-5 text-amber-600" />
                <h3 class="font-semibold text-amber-900">Late Arrivals ({{ stats.lateArrivals }})</h3>
              </div>

              <div class="space-y-3">
                <div class="p-3 bg-background border border-amber-300 rounded-lg">
                  <p class="text-sm text-muted-foreground text-center">No late arrivals recorded</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="border-red-300 bg-red-50">
            <CardContent class="p-6">
              <div class="flex items-center gap-2 mb-4">
                <AlertCircle class="h-5 w-5 text-red-600" />
                <h3 class="font-semibold text-red-900">Absent Today ({{ stats.absentToday }})</h3>
              </div>

              <div class="space-y-3">
                <div class="p-3 bg-background border border-red-300 rounded-lg">
                  <p class="text-sm text-muted-foreground text-center">No absences recorded</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <p class="text-xs text-muted-foreground mt-1">5 hours 15 minutes remaining</p>
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
    </template>
  </div>
</template>
