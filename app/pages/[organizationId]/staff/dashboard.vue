<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta } from "#imports";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, FolderKanban, Users } from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const { data: staff } = await useLazyFetch(`/api/${organizationId}/staff`, {
  key: `staff-${organizationId}`,
  transform: (data) => data || [],
});

const { data: tasks } = await useLazyFetch(`/api/${organizationId}/tasks`, {
  key: `tasks-${organizationId}`,
  transform: (data) => data || [],
});

const { data: attendances } = await useLazyFetch(`/api/${organizationId}/attendance`, {
  key: `attendance-${organizationId}`,
  transform: (data) => data || [],
});

const { data: departments } = await useLazyFetch(`/api/${organizationId}/departments`, {
  key: `departments-${organizationId}`,
  transform: (data) => data || [],
});

const stats = computed(() => ({
  totalStaff: staff.value?.length || 0,
  totalTasks: tasks.value?.length || 0,
  onTimeToday: attendances.value?.filter((a: any) => a.status === "PRESENT").length || 0,
  myTasks: tasks.value?.filter((t: any) => t.assignedTo === staff.value?.[0]?.id).length || 0,
}));
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">My Dashboard</h1>
        <p class="text-muted-foreground mt-1">
          Welcome back! Here's your overview
        </p>
      </div>
    </div>

    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <Clock class="h-6 w-6 text-blue-500" />
            <div>
              <p class="text-sm text-muted-foreground">On Duty</p>
              <p class="text-2xl font-bold">
                {{ stats.onTimeToday > 0 ? "Yes" : "No" }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <CheckCircle2 class="h-6 w-6 text-emerald-500" />
            <div>
              <p class="text-sm text-muted-foreground">Tasks Done</p>
              <p class="text-2xl font-bold">{{ stats.myTasks }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <FolderKanban class="h-6 w-6 text-purple-500" />
            <div>
              <p class="text-sm text-muted-foreground">Assigned</p>
              <p class="text-2xl font-bold">{{ stats.totalTasks }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <Users class="h-6 w-6 text-emerald-500" />
            <div>
              <p class="text-sm text-muted-foreground">My Tasks</p>
              <p class="text-2xl font-bold">{{ stats.myTasks }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
