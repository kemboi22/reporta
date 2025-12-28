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

const workspace = ref({
  id: route.params.id,
  name: "Engineering Workspace",
  slug: "engineering",
  description: "Software development and engineering team workspace",
  color: "#3b82f6",
  createdAt: new Date("2023-01-15"),
});

const projects = ref([
  {
    id: "1",
    name: "Website Redesign",
    slug: "website-redesign",
    description: "Complete redesign of company website",
    status: "ACTIVE" as const,
    priority: "HIGH" as const,
    tasks: 24,
    completedTasks: 18,
    dueDate: new Date("2024-06-30"),
    members: 8,
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "Mobile App",
    slug: "mobile-app",
    description: "Native mobile application development",
    status: "ACTIVE" as const,
    priority: "MEDIUM" as const,
    tasks: 36,
    completedTasks: 12,
    dueDate: new Date("2024-09-30"),
    members: 6,
    color: "#8b5cf6",
  },
  {
    id: "3",
    name: "API Integration",
    slug: "api-integration",
    description: "Third-party API integrations",
    status: "PLANNING" as const,
    priority: "LOW" as const,
    tasks: 15,
    completedTasks: 0,
    dueDate: new Date("2024-12-31"),
    members: 4,
    color: "#10b981",
  },
]);

const members = ref([
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder-user.jpg",
    role: "OWNER",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/placeholder-user.jpg",
    role: "ADMIN",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    avatar: "/placeholder-user.jpg",
    role: "MEMBER",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    avatar: "/placeholder-user.jpg",
    role: "MEMBER",
  },
]);

const recentActivity = ref([
  {
    id: 1,
    type: "task",
    user: "John Doe",
    action: "completed",
    target: "API endpoint implementation",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "project",
    user: "Jane Smith",
    action: "created",
    target: "New feature branch",
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "document",
    user: "Bob Johnson",
    action: "uploaded",
    target: "Technical documentation",
    time: "6 hours ago",
  },
]);

const showAddProject = ref(false);
const showAddMember = ref(false);

const newProject = ref({
  name: "",
  description: "",
  priority: "MEDIUM",
  dueDate: "",
});

const newMember = ref({
  email: "",
  role: "MEMBER",
});

const addProject = () => {
  console.log("Adding project:", newProject.value);
  showAddProject.value = false;
};

const addMember = () => {
  console.log("Adding member:", newMember.value);
  showAddMember.value = false;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PLANNING: "bg-gray-500",
    ACTIVE: "bg-blue-500",
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

const totalProjects = computed(() => projects.value.length);
const activeProjects = computed(() => projects.value.filter((p) => p.status === "ACTIVE").length);
const totalTasks = computed(() => projects.value.reduce((sum, p) => sum + p.tasks, 0));
const completedTasks = computed(() => projects.value.reduce((sum, p) => sum + p.completedTasks, 0));
</script>

<template>
  <div class="space-y-6">
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
          <p class="text-muted-foreground mt-1">{{ workspace.description }}</p>
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
              <p class="text-2xl font-bold">{{ members.length }}</p>
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
              <Progress :value="(completedTasks / totalTasks) * 100" class="mt-2 h-1" />
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
              <p class="text-lg font-bold">{{ workspace.createdAt.toLocaleDateString() }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Tabs default-value="projects" class="space-y-6">
      <TabsList>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
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

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="project in projects"
            :key="project.id"
            class="border-border hover:border-primary/50 transition-colors cursor-pointer"
          >
            <CardHeader>
              <div class="flex items-start justify-between">
                <div
                  class="h-10 w-10 rounded-lg flex items-center justify-center"
                  :style="{ backgroundColor: project.color + '20' }"
                >
                  <FolderKanban class="h-5 w-5" :style="{ color: project.color }" />
                </div>
                <div class="flex items-center gap-2">
                  <Badge :class="[getStatusColor(project.status), 'text-white']">
                    {{ project.status }}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreVertical class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 class="font-semibold text-lg">{{ project.name }}</h3>
              <p class="text-sm text-muted-foreground mt-1">{{ project.description }}</p>
              <div class="mt-4 space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-muted-foreground">Progress</span>
                  <span class="font-medium">{{ Math.round((project.completedTasks / project.tasks) * 100) }}%</span>
                </div>
                <Progress :value="(project.completedTasks / project.tasks) * 100" class="h-2" />
                <div class="flex items-center justify-between text-sm">
                  <span class="text-muted-foreground">Tasks</span>
                  <span class="font-medium">{{ project.completedTasks }}/{{ project.tasks }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-muted-foreground">Members</span>
                  <span class="font-medium">{{ project.members }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar class="h-3 w-3" />
                  <span>Due {{ project.dueDate.toLocaleDateString() }}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="tasks" class="space-y-6">
        <h2 class="text-xl font-semibold">All Tasks</h2>
        <Card class="border-border">
          <CardContent class="p-6">
            <div class="text-center py-12 text-muted-foreground">
              <FileText class="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Task list will appear here</p>
              <p class="text-sm mt-1">View and manage all tasks across projects</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="members" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Team Members</h2>
          <Dialog v-model:open="showAddMember">
            <DialogTrigger as-child>
              <Button>
                <Plus class="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <div class="space-y-4">
                <div>
                  <Label for="member-email">Email</Label>
                  <Input id="member-email" type="email" v-model="newMember.email" placeholder="member@email.com" />
                </div>
                <div>
                  <Label for="member-role">Role</Label>
                  <Select v-model="newMember.role">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNER">Owner</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button @click="addMember" class="w-full">Add Member</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="member in members"
            :key="member.id"
            class="border-border"
          >
            <CardContent class="p-6">
              <div class="flex items-start gap-4">
                <Avatar class="h-12 w-12">
                  <AvatarImage :src="member.avatar" />
                  <AvatarFallback>{{ member.name.charAt(0) }}</AvatarFallback>
                </Avatar>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-semibold">{{ member.name }}</h4>
                    <Button variant="ghost" size="icon">
                      <MoreVertical class="h-4 w-4" />
                    </Button>
                  </div>
                  <p class="text-sm text-muted-foreground">{{ member.email }}</p>
                  <Badge :class="[getRoleColor(member.role), 'text-white mt-2']">
                    {{ member.role }}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="activity" class="space-y-6">
        <h2 class="text-xl font-semibold">Recent Activity</h2>
        <Card class="border-border">
          <CardContent class="p-6">
            <div class="space-y-4">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span class="text-sm font-semibold text-primary">{{ activity.user.charAt(0) }}</span>
                </div>
                <div class="flex-1">
                  <p>
                    <span class="font-semibold">{{ activity.user }}</span>
                    <span class="text-muted-foreground"> {{ activity.action }} </span>
                    <span class="font-medium">{{ activity.target }}</span>
                  </p>
                  <p class="text-sm text-muted-foreground mt-1">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
