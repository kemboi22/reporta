<script setup lang="ts">
import { ref } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Users, ArrowRight } from "lucide-vue-next";
import { navigateTo } from "#app";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const { data: workspaces } = await useLazyFetch(
  `/api/${organizationId}/workspaces`,
  {
    key: `workspaces-${organizationId}`,
    transform: (data) => data || [],
  },
);

const switchingTo = ref<number | null>(null);

const switchWorkspace = async (workspaceId: number) => {
  switchingTo.value = workspaceId;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  navigateTo(`/${organizationId}/dashboard`);
};

const createNewWorkspace = () => {
  navigateTo("/onboarding/step-1");
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-purple-100 text-purple-700";
    case "Manager":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-muted text-foreground";
  }
};
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="p-6 max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">Switch Workspace</h1>
        <p class="text-muted-foreground">
          Select a workspace to continue working, or create a new one
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card
          v-for="workspace in workspaces"
          :key="workspace.id"
          :class="[
            'cursor-pointer transition-all hover:shadow-lg group',
            switchingTo === workspace.id && 'opacity-50 pointer-events-none',
          ]"
          @click="switchWorkspace(workspace.id)"
        >
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between mb-3">
              <Avatar class="h-12 w-12">
                <AvatarFallback
                  class="bg-blue-100 text-blue-700 text-lg font-bold"
                >
                  {{ getInitials(workspace.name) }}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle class="text-lg">{{ workspace.name }}</CardTitle>
            <CardDescription class="text-sm">
              {{ workspace.slug }}.workforcepro.com
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <Users class="h-4 w-4" />
                <span>{{ workspace.members?.length || 0 }} members</span>
              </div>
              <div
                v-if="switchingTo === workspace.id"
                class="flex items-center justify-center gap-2 text-sm text-blue-600"
              >
                <div
                  class="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
                ></div>
                <span>Switching...</span>
              </div>
              <div
                v-else
                class="flex items-center justify-between text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span class="font-medium">Switch to workspace</span>
                <ArrowRight class="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card
        class="border-2 border-dashed border-border hover:border-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer group"
        @click="createNewWorkspace"
      >
        <CardContent class="flex items-center justify-center py-8">
          <div class="text-center">
            <div
              class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted group-hover:bg-blue-100 transition-colors mb-3"
            >
              <Plus
                class="h-6 w-6 text-muted-foreground group-hover:text-blue-600 transition-colors"
              />
            </div>
            <h3 class="text-lg font-semibold text-foreground mb-1">
              Create New Workspace
            </h3>
            <p class="text-sm text-muted-foreground">
              Set up a new organization workspace
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>
