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

const workspaces = ref([
  {
    id: 1,
    name: "Acme Corporation",
    subdomain: "acme",
    role: "Admin",
    logo: null,
    members: 45,
    active: true,
  },
  {
    id: 2,
    name: "TechStart Inc",
    subdomain: "techstart",
    role: "Manager",
    logo: null,
    members: 12,
    active: false,
  },
  {
    id: 3,
    name: "Global Healthcare",
    subdomain: "globalhealth",
    role: "Staff",
    logo: null,
    members: 234,
    active: false,
  },
]);

const switchingTo = ref<number | null>(null);

const switchWorkspace = async (workspaceId: number) => {
  switchingTo.value = workspaceId;

  // Simulate workspace switch with smooth transition
  await new Promise((resolve) => setTimeout(resolve, 1000));

  navigateTo("/dashboard");
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
      return "bg-slate-100 text-slate-700";
  }
};
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="p-6 max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Switch Workspace</h1>
        <p class="text-slate-600">
          Select a workspace to continue working, or create a new one
        </p>
      </div>

      <!-- Enhanced workspace cards with shadcn-vue components -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card
          v-for="workspace in workspaces"
          :key="workspace.id"
          :class="[
            'cursor-pointer transition-all hover:shadow-lg group',
            workspace.active && 'ring-2 ring-blue-600',
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
              <Badge v-if="workspace.active" class="bg-blue-600 text-white">
                Active
              </Badge>
            </div>
            <CardTitle class="text-lg">{{ workspace.name }}</CardTitle>
            <CardDescription class="text-sm">
              {{ workspace.subdomain }}.workforcepro.com
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <Users class="h-4 w-4" />
                <span>{{ workspace.members }} members</span>
              </div>
              <Badge :class="getRoleBadgeClass(workspace.role)" class="text-xs">
                {{ workspace.role }}
              </Badge>
            </div>

            <!-- Loading indicator during switch -->
            <div
              v-if="switchingTo === workspace.id"
              class="mt-4 flex items-center justify-center gap-2 text-sm text-blue-600"
            >
              <div
                class="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
              ></div>
              <span>Switching...</span>
            </div>

            <!-- Hover action indicator -->
            <div
              v-else
              class="mt-4 flex items-center justify-between text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span class="font-medium">Switch to workspace</span>
              <ArrowRight class="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Enhanced create workspace card -->
      <Card
        class="border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group"
        @click="createNewWorkspace"
      >
        <CardContent class="flex items-center justify-center py-8">
          <div class="text-center">
            <div
              class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 transition-colors mb-3"
            >
              <Plus
                class="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors"
              />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-1">
              Create New Workspace
            </h3>
            <p class="text-sm text-slate-600">
              Set up a new organization workspace
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>
