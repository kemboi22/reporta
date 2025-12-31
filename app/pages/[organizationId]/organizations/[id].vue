<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Users,
  Settings,
  Plus,
  MoreVertical,
  Globe,
  Mail,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const workspaceId = route.params.id as string;

const { data: workspace, pending, refresh: refreshWorkspace } = await useLazyFetch(
  `/api/${organizationId}/workspaces/${workspaceId}`,
  {
    key: `workspace-${workspaceId}`,
  },
);

const { data: projects, refresh: refreshProjects } = await useLazyFetch(
  `/api/${organizationId}/projects`,
  {
    key: `projects-${workspaceId}`,
    transform: (data) => (data || []).filter((p: any) => p.workspaceId === workspaceId),
  },
);

const { data: staff, refresh: refreshStaff } = await useLazyFetch(
  `/api/${organizationId}/staff`,
  {
    key: `staff-${workspaceId}`,
    transform: (data) => data || [],
  },
);

const showAddMember = ref(false);

const newMember = ref({
  name: "",
  email: "",
  role: "MEMBER",
});

const addMember = async () => {
  try {
    await $fetch(`/api/${organizationId}/staff`, {
      method: "POST",
      body: {
        firstName: newMember.value.name.split(" ")[0] || "",
        lastName: newMember.value.name.split(" ").slice(1).join(" ") || "",
        email: newMember.value.email,
      },
    });
    showAddMember.value = false;
    newMember.value = { name: "", email: "", role: "MEMBER" };
    await refreshStaff();
  } catch (error) {
    console.error("Failed to add member:", error);
  }
};

const roleColors: Record<string, string> = {
  OWNER: "bg-purple-500",
  ADMIN: "bg-blue-500",
  MEMBER: "bg-gray-500",
  VIEWER: "bg-gray-400",
};

const totalMembers = computed(() => staff.value?.length || 0);
const totalProjects = computed(() => projects.value?.length || 0);
</script>

<template>
  <div class="space-y-6">
    <div v-if="pending" class="animate-pulse space-y-4">
      <div class="h-20 bg-muted rounded-lg" />
      <div class="grid md:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="h-24 bg-muted rounded-lg" />
      </div>
    </div>

    <div v-else-if="workspace" class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
            :style="{ backgroundColor: (workspace.color || '#3b82f6') + '20' }"
          >
            <Building2 class="h-6 w-6" :style="{ color: workspace.color || '#3b82f6' }" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-foreground">
              {{ workspace.name }}
            </h1>
            <p class="text-muted-foreground mt-1">{{ workspace.description || "" }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Button variant="outline">Settings</Button>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <Card class="border-border">
          <CardContent class="p-6">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Building2 class="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Projects</p>
                <p class="text-2xl font-bold">{{ totalProjects }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="border-border">
          <CardContent class="p-6">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Users class="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Members</p>
                <p class="text-2xl font-bold">{{ totalMembers }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="border-border">
          <CardContent class="p-6">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <span class="text-2xl">📊</span>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Created</p>
                <p class="text-lg font-bold">{{ new Date(workspace.createdAt).toLocaleDateString() }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs default-value="projects" class="space-y-6">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Projects</h2>
          </div>

          <div v-if="!projects || projects.length === 0" class="text-center py-12 text-muted-foreground">
            No projects yet.
          </div>

          <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="project in projects"
              :key="project.id"
              :to="`/${organizationId}/projects/${project.id}`"
            >
              <Card
                class="border-border hover:border-primary/50 transition-colors cursor-pointer h-full"
              >
                <CardHeader>
                  <div class="flex items-start justify-between">
                    <div
                      class="h-10 w-10 rounded-lg flex items-center justify-center"
                      :style="{ backgroundColor: (project.color || '#3b82f6') + '20' }"
                    >
                      <span class="text-xl">📁</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium">{{ project.status?.replace("_", "-")?.toLowerCase() }}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 class="font-semibold text-lg">{{ project.name }}</h3>
                  <p class="text-sm text-muted-foreground mt-1">{{ project.description || "No description" }}</p>
                </CardContent>
              </Card>
            </NuxtLink>
          </div>
        </TabsContent>

        <TabsContent value="members" class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Members</h2>
            <Dialog v-model:open="showAddMember">
              <DialogTrigger as-child>
                <Button>
                  <Plus class="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Member</DialogTitle>
                </DialogHeader>
                <div class="space-y-4">
                  <div>
                    <Label for="member-name">Name</Label>
                    <Input
                      id="member-name"
                      v-model="newMember.name"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label for="member-email">Email</Label>
                    <Input
                      id="member-email"
                      type="email"
                      v-model="newMember.email"
                      placeholder="member@email.com"
                    />
                  </div>
                  <Button @click="addMember" class="w-full">Add Member</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div v-if="!staff || staff.length === 0" class="text-center py-12 text-muted-foreground">
            No members yet.
          </div>

          <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              v-for="member in staff"
              :key="member.id"
              class="border-border"
            >
              <CardContent class="p-6">
                <div class="flex items-start gap-4">
                  <Avatar class="h-12 w-12">
                    <AvatarImage :src="member.user?.image" />
                    <AvatarFallback>
                      {{ (member.firstName?.[0] || '') + (member.lastName?.[0] || '') }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <h4 class="font-semibold">{{ member.firstName }} {{ member.lastName }}</h4>
                      <Button variant="ghost" size="icon">
                        <MoreVertical class="h-4 w-4" />
                      </Button>
                    </div>
                    <p class="text-sm text-muted-foreground">{{ member.email }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" class="space-y-6">
          <h2 class="text-xl font-semibold">Workspace Settings</h2>
          <Card class="border-border">
            <CardHeader>
              <CardTitle>Workspace Information</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <Label>Workspace Name</Label>
                <Input :value="workspace.name" disabled />
              </div>
              <div>
                <Label>Slug</Label>
                <Input :value="workspace.slug || 'workspace'" disabled />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea :value="workspace.description || ''" />
              </div>
              <div>
                <Label>Color</Label>
                <div class="flex items-center gap-2">
                  <div
                    class="h-10 w-10 rounded-lg border"
                    :style="{ backgroundColor: workspace.color || '#3b82f6' }"
                  />
                  <Input :value="workspace.color || '#3b82f6'" disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
