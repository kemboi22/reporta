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
import { FolderKanban, Users, Calendar, CheckCircle2, Circle, AlertCircle, Plus, MoreVertical, Timer } from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();

const project = ref({
  id: route.params.id,
  name: "Website Redesign",
  slug: "website-redesign",
  description: "Complete redesign of company website with modern UI/UX",
  status: "ACTIVE" as const,
  priority: "HIGH" as const,
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-06-30"),
  budget: 50000,
  currency: "USD",
  color: "#3b82f6",
  icon: "🎨",
});

const tasks = ref([
  {
    id: "1",
    title: "Design homepage mockup",
    description: "Create initial design concepts for homepage",
    status: "COMPLETED" as const,
    priority: "HIGH" as const,
    dueDate: new Date("2024-02-15"),
    assignees: [
      { id: "1", name: "Alice", avatar: "/placeholder-user.jpg" },
    ],
    estimatedHours: 16,
    actualHours: 18,
  },
  {
    id: "2",
    title: "Implement responsive design",
    description: "Make design mobile-responsive",
    status: "IN_PROGRESS" as const,
    priority: "HIGH" as const,
    dueDate: new Date("2024-03-01"),
    assignees: [
      { id: "2", name: "Bob", avatar: "/placeholder-user.jpg" },
      { id: "3", name: "Charlie", avatar: "/placeholder-user.jpg" },
    ],
    estimatedHours: 24,
    actualHours: 12,
  },
  {
    id: "3",
    title: "Setup CI/CD pipeline",
    description: "Configure automated deployment",
    status: "TODO" as const,
    priority: "MEDIUM" as const,
    dueDate: new Date("2024-03-15"),
    assignees: [
      { id: "4", name: "David", avatar: "/placeholder-user.jpg" },
    ],
    estimatedHours: 8,
    actualHours: 0,
  },
  {
    id: "4",
    title: "Write API documentation",
    description: "Document all API endpoints",
    status: "TODO" as const,
    priority: "LOW" as const,
    dueDate: new Date("2024-04-01"),
    assignees: [],
    estimatedHours: 12,
    actualHours: 0,
  },
]);

const teamMembers = ref([
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    avatar: "/placeholder-user.jpg",
    role: "OWNER",
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@example.com",
    avatar: "/placeholder-user.jpg",
    role: "ADMIN",
  },
  {
    id: "3",
    name: "Charlie",
    email: "charlie@example.com",
    avatar: "/placeholder-user.jpg",
    role: "MEMBER",
  },
  {
    id: "4",
    name: "David",
    email: "david@example.com",
    avatar: "/placeholder-user.jpg",
    role: "MEMBER",
  },
]);

const milestones = ref([
  {
    id: "1",
    name: "Design Phase Complete",
    dueDate: new Date("2024-02-28"),
    status: "COMPLETED" as const,
  },
  {
    id: "2",
    name: "Development Sprint 1",
    dueDate: new Date("2024-03-31"),
    status: "IN_PROGRESS" as const,
  },
  {
    id: "3",
    name: "Beta Launch",
    dueDate: new Date("2024-05-15"),
    status: "PLANNED" as const,
  },
  {
    id: "4",
    name: "Final Release",
    dueDate: new Date("2024-06-30"),
    status: "PLANNED" as const,
  },
]);

const showAddTask = ref(false);
const showAddMember = ref(false);

const newTask = ref({
  title: "",
  description: "",
  priority: "MEDIUM",
  dueDate: "",
  estimatedHours: "",
});

const newMember = ref({
  email: "",
  role: "MEMBER",
});

const addTask = () => {
  console.log("Adding task:", newTask.value);
  showAddTask.value = false;
};

const addMember = () => {
  console.log("Adding member:", newMember.value);
  showAddMember.value = false;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    TODO: "bg-gray-500",
    IN_PROGRESS: "bg-blue-500",
    COMPLETED: "bg-emerald-500",
    CANCELLED: "bg-red-500",
  };
  return colors[status] || "bg-gray-500";
};

const getStatusIcon = (status: string) => {
  const icons: Record<string, any> = {
    TODO: Circle,
    IN_PROGRESS: Timer,
    COMPLETED: CheckCircle2,
    CANCELLED: AlertCircle,
  };
  return icons[status] || Circle;
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    LOW: "text-emerald-500",
    MEDIUM: "text-amber-500",
    HIGH: "text-orange-500",
    URGENT: "text-red-500",
  };
  return colors[priority] || "text-gray-500";
};

const taskStats = computed(() => {
  return {
    total: tasks.value.length,
    completed: tasks.value.filter((t) => t.status === "COMPLETED").length,
    inProgress: tasks.value.filter((t) => t.status === "IN_PROGRESS").length,
    todo: tasks.value.filter((t) => t.status === "TODO").length,
  };
});

const completionPercentage = computed(() => {
  if (taskStats.value.total === 0) return 0;
  return Math.round((taskStats.value.completed / taskStats.value.total) * 100);
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
          {{ project.icon }}
        </div>
        <div>
          <h1 class="text-3xl font-bold text-foreground flex items-center gap-2">
            {{ project.name }}
            <Badge :class="[getStatusColor(project.status), 'text-white']">
              {{ project.status }}
            </Badge>
          </h1>
          <p class="text-muted-foreground mt-1">{{ project.description }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Button variant="outline">Settings</Button>
        <Button>
          <FolderKanban class="h-4 w-4 mr-2" />
          Manage
        </Button>
      </div>
    </div>

    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <CheckCircle2 class="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Progress</p>
              <p class="text-2xl font-bold">{{ completionPercentage }}%</p>
              <Progress :value="completionPercentage" class="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <FolderKanban class="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Total Tasks</p>
              <p class="text-2xl font-bold">{{ taskStats.total }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Users class="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Team Size</p>
              <p class="text-2xl font-bold">{{ teamMembers.length }}</p>
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
              <p class="text-sm text-muted-foreground">Due Date</p>
              <p class="text-lg font-bold">{{ project.endDate.toLocaleDateString() }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Tabs default-value="tasks" class="space-y-6">
      <TabsList>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="milestones">Milestones</TabsTrigger>
        <TabsTrigger value="overview">Overview</TabsTrigger>
      </TabsList>

      <TabsContent value="tasks" class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Badge variant="outline">{{ taskStats.todo }} TODO</Badge>
            <Badge variant="outline">{{ taskStats.inProgress }} In Progress</Badge>
            <Badge variant="outline">{{ taskStats.completed }} Completed</Badge>
          </div>
          <Dialog v-model:open="showAddTask">
            <DialogTrigger as-child>
              <Button>
                <Plus class="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div class="space-y-4">
                <div>
                  <Label for="task-title">Title</Label>
                  <Input id="task-title" v-model="newTask.title" placeholder="Task title" />
                </div>
                <div>
                  <Label for="task-desc">Description</Label>
                  <Textarea id="task-desc" v-model="newTask.description" placeholder="Task description" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <Label for="task-priority">Priority</Label>
                    <Select v-model="newTask.priority">
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
                    <Label for="task-hours">Est. Hours</Label>
                    <Input id="task-hours" v-model="newTask.estimatedHours" type="number" placeholder="8" />
                  </div>
                </div>
                <div>
                  <Label for="task-due">Due Date</Label>
                  <Input id="task-due" type="date" v-model="newTask.dueDate" />
                </div>
                <Button @click="addTask" class="w-full">Create Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div class="grid lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <Card
              v-for="task in tasks"
              :key="task.id"
              class="border-border hover:border-primary/50 transition-colors cursor-pointer"
            >
              <CardContent class="p-6">
                <div class="flex items-start gap-4">
                  <component
                    :is="getStatusIcon(task.status)"
                    class="h-5 w-5 mt-1"
                    :class="[getStatusColor(task.status), 'text-white']"
                  />
                  <div class="flex-1">
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <h3 class="font-semibold text-lg">{{ task.title }}</h3>
                        <p class="text-sm text-muted-foreground mt-1">{{ task.description }}</p>
                      </div>
                      <div class="flex items-center gap-2">
                        <Badge :class="[getStatusColor(task.status), 'text-white']">
                          {{ task.status }}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <MoreVertical class="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div class="flex items-center gap-4 mt-4">
                      <div class="flex items-center gap-2">
                        <Calendar class="h-4 w-4 text-muted-foreground" />
                        <span class="text-sm text-muted-foreground">
                          Due {{ task.dueDate.toLocaleDateString() }}
                        </span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Timer class="h-4 w-4 text-muted-foreground" />
                        <span class="text-sm text-muted-foreground">
                          {{ task.actualHours }}/{{ task.estimatedHours }}h
                        </span>
                      </div>
                      <div class="flex -space-x-2">
                        <Avatar v-for="assignee in task.assignees" :key="assignee.id" class="h-6 w-6 border-2 border-background">
                          <AvatarImage :src="assignee.avatar" />
                          <AvatarFallback class="text-xs">{{ assignee.name.charAt(0) }}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card class="border-border">
            <CardHeader>
              <CardTitle>Task Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>Completed</span>
                    <span class="font-medium">{{ taskStats.completed }}/{{ taskStats.total }}</span>
                  </div>
                  <Progress :value="completionPercentage" class="h-2" />
                </div>
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span class="text-sm">Completed</span>
                    <span class="text-sm font-medium ml-auto">{{ taskStats.completed }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span class="text-sm">In Progress</span>
                    <span class="text-sm font-medium ml-auto">{{ taskStats.inProgress }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-gray-500"></div>
                    <span class="text-sm">TODO</span>
                    <span class="text-sm font-medium ml-auto">{{ taskStats.todo }}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="team" class="space-y-6">
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
            v-for="member in teamMembers"
            :key="member.id"
            class="border-border"
          >
            <CardContent class="p-6">
              <div class="flex items-center gap-4">
                <Avatar class="h-12 w-12">
                  <AvatarImage :src="member.avatar" />
                  <AvatarFallback>{{ member.name.charAt(0) }}</AvatarFallback>
                </Avatar>
                <div class="flex-1">
                  <h4 class="font-semibold">{{ member.name }}</h4>
                  <p class="text-sm text-muted-foreground">{{ member.email }}</p>
                  <Badge :class="[getStatusColor(member.role), 'text-white mt-2']">
                    {{ member.role }}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical class="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="milestones" class="space-y-6">
        <h2 class="text-xl font-semibold">Project Milestones</h2>
        <div class="space-y-4">
          <Card
            v-for="milestone in milestones"
            :key="milestone.id"
            class="border-border"
          >
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div
                    class="h-8 w-8 rounded-full flex items-center justify-center"
                    :class="[
                      milestone.status === 'COMPLETED' ? 'bg-emerald-500' : milestone.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-gray-500'
                    ]"
                  >
                    <CheckCircle2 v-if="milestone.status === 'COMPLETED'" class="h-4 w-4 text-white" />
                    <Timer v-else-if="milestone.status === 'IN_PROGRESS'" class="h-4 w-4 text-white" />
                    <Circle v-else class="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 class="font-semibold">{{ milestone.name }}</h4>
                    <div class="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar class="h-3 w-3" />
                      <span>Due {{ milestone.dueDate.toLocaleDateString() }}</span>
                    </div>
                  </div>
                </div>
                <Badge :class="[getStatusColor(milestone.status), 'text-white']">
                  {{ milestone.status }}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="overview" class="space-y-6">
        <h2 class="text-xl font-semibold">Project Overview</h2>
        <Card class="border-border">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Project Name</Label>
                <Input :value="project.name" />
              </div>
              <div>
                <Label>Slug</Label>
                <Input :value="project.slug" />
              </div>
              <div class="md:col-span-2">
                <Label>Description</Label>
                <Textarea :value="project.description" />
              </div>
              <div>
                <Label>Status</Label>
                <Select :value="project.status">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNING">Planning</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select :value="project.priority">
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
                <Label>Start Date</Label>
                <Input :value="project.startDate.toISOString().split('T')[0]" type="date" />
              </div>
              <div>
                <Label>End Date</Label>
                <Input :value="project.endDate.toISOString().split('T')[0]" type="date" />
              </div>
              <div>
                <Label>Budget</Label>
                <div class="flex">
                  <Input :value="project.budget" type="number" />
                  <Select :value="project.currency">
                    <SelectTrigger class="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
