<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { definePageMeta, navigateTo } from "#imports";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Calendar, LogIn, LogOut } from "lucide-vue-next";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const { data: staff } = await useLazyFetch(`/api/${organizationId}/staff`, {
  key: `staff-${organizationId}`,
  transform: (data) => data || [],
});

const { data: myAttendance, refresh: refreshMyAttendance } = await useLazyFetch(
  `/api/${organizationId}/attendance/me`,
  {
    key: `my-attendance-${organizationId}`,
    transform: (data) => data || [],
  },
);

const { data: attendances, refresh: refreshAttendances } = await useLazyFetch(`/api/${organizationId}/attendance`, {
  key: `attendance-${organizationId}`,
  transform: (data) => data || [],
});

const { data: tasks } = await useLazyFetch(`/api/${organizationId}/tasks`, {
  key: `tasks-${organizationId}`,
  transform: (data) => data || [],
});

const isClockedIn = computed(() => {
  if (!myAttendance.value || myAttendance.value.length === 0) return false;
  return myAttendance.value.some((a: any) => !a.checkOut);
});

const lastAttendance = computed(() => {
  if (!myAttendance.value || myAttendance.value.length === 0) return null;
  return myAttendance.value[0];
});

const isLoading = ref(false);

const clockIn = async () => {
  isLoading.value = true;
  try {
    await $fetch(`/api/${organizationId}/attendance`, {
      method: "POST",
      body: {},
    });
    await refreshMyAttendance();
    await refreshAttendances();
    toast.success("Successfully clocked in");
  } catch (error: any) {
    toast.error(error.message || "Failed to clock in");
  } finally {
    isLoading.value = false;
  }
};

const clockOut = async () => {
  if (!lastAttendance.value) return;
  isLoading.value = true;
  try {
    await $fetch(`/api/${organizationId}/attendance/${lastAttendance.value.id}/checkout`, {
      method: "POST",
      body: {},
    });
    await refreshMyAttendance();
    await refreshAttendances();
    toast.success("Successfully clocked out");
  } catch (error: any) {
    toast.error(error.message || "Failed to clock out");
  } finally {
    isLoading.value = false;
  }
};

const stats = computed(() => {
  const presentToday = attendances.value?.filter((a: any) => a.status === "PRESENT")?.length || 0;
  const lateToday = attendances.value?.filter((a: any) => a.status === "LATE")?.length || 0;
  return {
    present: presentToday,
    late: lateToday,
  };
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Attendance</h1>
        <p class="text-muted-foreground mt-1">Your attendance records</p>
      </div>
      <div class="flex gap-3">
        <Button
          v-if="!isClockedIn"
          @click="clockIn"
          :disabled="isLoading"
          class="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <LogIn class="h-4 w-4 mr-2" />
          Clock In
        </Button>
        <Button
          v-else
          @click="clockOut"
          :disabled="isLoading"
          class="bg-red-500 hover:bg-red-600 text-white"
        >
          <LogOut class="h-4 w-4 mr-2" />
          Clock Out
        </Button>
        <Button @click="navigateTo(`/${organizationId}/attendance/reports`)">
          <Calendar class="h-4 w-4 mr-2" />
          View Reports
        </Button>
      </div>
    </div>

    <div v-if="isClockedIn && lastAttendance" class="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center">
          <Clock class="h-5 w-5 text-white" />
        </div>
        <div>
          <p class="font-medium text-emerald-700 dark:text-emerald-300">You are currently clocked in</p>
          <p class="text-sm text-emerald-600 dark:text-emerald-400">
            Since {{ new Date(lastAttendance.checkIn).toLocaleTimeString() }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div class="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock class="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Present Today</p>
              <p class="text-2xl font-bold">{{ stats.present }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div class="h-12 w-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock class="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Late Today</p>
              <p class="text-2xl font-bold">{{ stats.late }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
