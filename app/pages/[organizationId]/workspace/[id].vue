<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, FolderKanban, Calendar, FileText, Settings, Plus, MoreVertical } from "lucide-vue-next";
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

const showAddProject = ref(false);
const showAddMember = ref(false);

const newProject = ref({
  name: "",
  slug: "",
  description: "",
  priority: "MEDIUM",
  dueDate: "",
  color: "#3b82f6",
});

const newMember = ref({
  email: "",
  role: "MEMBER",
});

const addProject = async () => {
  try {
    await $fetch(`/api/${organizationId}/projects`, {
      method: "POST",
      body: {
        ...newProject.value,
        slug: newProject.value.slug || newProject.value.name.toLowerCase().replace(/\s+/g, "-"),
        workspaceId,
      },
    });
    showAddProject.value = false;
    newProject.value = {
      name: "",
      slug: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
      color: "#3b82f6",
    };
    await refreshProjects();
  } catch (error) {
    console.error("Failed to add project:", error);
  }
};

const addMember = () => {
  console.log("Adding member:", newMember.value);
  showAddMember.value = false;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PLANNING: "bg-gray-500",
    ACTIVE: "bg-blue-500",
    IN_PROGRESS: "bg-purple-500",
    ON_HOLD: "bg-amber-500",
    COMPLETED: "bg-emerald-500",
    CANCELLED: "bg-red-500",
  };
  return colors[status] || "bg-gray-500";
};

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    OWNER: "bg-purple-500",
    ADMIN: "bg-blue-500",
    MEMBER: "bg-gray-500",
    VIEWER: "bg-gray-400",
  };
  return colors[role] || "bg-gray-500";
};

const totalProjects = computed(() => projects.value?.length || 0);
const activeProjects = computed(() => (projects.value || []).filter((p: any) => p.status === "ACTIVE" || p.status === "IN_PROGRESS").length);
const totalTasks = computed(() => (projects.value || []).reduce((sum: number, p: any) => sum + (p.tasks?.length || 0), 0));
const completedTasks = computed(() => (projects.value || []).reduce((sum: number, p: any) => {
  return sum + (p.tasks?.filter((t: any) => t.status === "COMPLETED")?.length || 0);
}, 0));

const workspaceMembers = computed(() => {
  const members = new Set();
  (projects.value || []).forEach((p: any) => {
    (p.members || []).forEach((m: any) => members.add(m.userId));
  });
  return Array.from(members);
});
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
            class="h-12 w-12 rounded-lg flex items-center justify-center"
            :style="{ backgroundColor: workspace.color + '20' }"
          >
            <Building2 class="h-6 w-6" :style="{ color: workspace.color }" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-foreground">{{ workspace.name }}</h1>
            <p class="text-muted-foreground mt-1">{{ workspace.description || "" }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Button variant="outline">
            <Settings class="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus class="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div class="grid md:grid-cols-4 gap-6">
        <Card class="border-border">
          <CardContent class="p-6">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FolderKanban class="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Projects</p>
                <p class="text-2xl font-bold">{{ totalProjects }}</p>
                <p class="text-xs text-muted-foreground">{{ activeProjects }} active</p>
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
                <p class="text-2xl font-bold">{{ workspaceMembers.length }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="border-border">
          <CardContent class="p-6">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText class="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Tasks</p>
                <p class="text-2xl font-bold">{{ completedTasks }}/{{ totalTasks }}</p>
                <Progress :value="totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0" class="mt-2 h-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="border-border">
          <CardContent class="p-6">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Calendar class="h-6 w-6 text-amber-500" />
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
        </TabsList>

        <TabsContent value="projects" class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Projects</h2>
            <Dialog v-model:open="showAddProject">
              <DialogTrigger as-child>
                <Button>
                  <Plus class="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div class="space-y-4">
                  <div>
                    <Label for="project-name">Name</Label>
                    <Input id="project-name" v-model="newProject.name" placeholder="Project name" />
                  </div>
                  <div>
                    <Label for="project-desc">Description</Label>
                    <Textarea id="project-desc" v-model="newProject.description" placeholder="Project description" />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <Label for="project-priority">Priority</Label>
                      <Select v-model="newProject.priority">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label for="project-due">Due Date</Label>
                      <Input id="project-due" type="date" v-model="newProject.dueDate" />
                    </div>
                  </div>
                  <Button @click="addProject" class="w-full">Create Project</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div v-if="!projects || projects.length === 0" class="text-center py-12 text-muted-foreground">
            No projects yet. Create your first project above.
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
                      <FolderKanban class="h-5 w-5" :style="{ color: project.color || '#3b82f6' }" />
                    </div>
                    <div class="flex items-center gap-2">
                      <Badge :class="[getStatusColor(project.status), 'text-white']">
                        {{ project.status?.replace("_", "-")?.toLowerCase() }}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <MoreVertical class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 class="font-semibold text-lg">{{ project.name }}</h3>
                  <p class="text-sm text-muted-foreground mt-1">{{ project.description || "No description" }}</p>
                  <div class="mt-4 space-y-2">
                    <div class="flex items-center gap-2 text-sm text-muted-foreground">
                      <FolderKanban class="h-3 w-3" />
                      <span>{{ project.tasks?.length || 0 }} tasks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </NuxtLink>
          </div>
        </TabsContent>

        <TabsContent value="members" class="space-y-6">
          <h2 class="text-xl font-semibold">Team Members</h2>
          <div v-if="workspaceMembers.length === 0" class="text-center py-12 text-muted-foreground">
            No members yet. Add members to projects.
          </div>
          <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              v-for="member in workspaceMembers"
              :key="member"
              class="border-border"
            >
              <CardContent class="p-6">
                <div class="flex items-start gap-4">
                  <Avatar class="h-12 w-12">
                    <AvatarFallback>{{ member.charAt(0) }}</AvatarFallback>
                  </Avatar>
                  <div class="flex-1">
                    <h4 class="font-semibold">{{ member }}</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
