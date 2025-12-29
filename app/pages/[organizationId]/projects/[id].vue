<script setup lang="ts">
import {
  FolderKanban,
  Users,
  Calendar,
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  MoreVertical,
  Timer,
  ArrowLeft,
  X,
} from "lucide-vue-next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const projectId = route.params.id as string;

const { data: project, pending: projectPending, refresh: refreshProject } = await useLazyFetch(
  `/api/${organizationId}/projects/${projectId}`,
  {
    key: `project-${projectId}`,
  },
);

const tasks = computed(() => project.value?.tasks || []);
const members = computed(() => project.value?.members || []);
const milestones = computed(() => project.value?.milestones || []);

const showAddTask = ref(false);

const newTask = ref({
  title: "",
  description: "",
  priority: "MEDIUM",
  dueDate: "",
  estimatedHours: "",
});

const addTask = async () => {
  try {
    await $fetch(`/api/${organizationId}/tasks`, {
      method: "POST",
      body: {
        ...newTask.value,
        workspaceId: project.value?.workspaceId,
        projectId,
        estimatedHours: parseFloat(newTask.value.estimatedHours) || null,
      },
    });

    newTask.value = {
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
      estimatedHours: "",
    };
    showAddTask.value = false;

    await refreshProject();
  } catch (error) {
    console.error("Failed to add task:", error);
  }
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    TODO: "bg-blue-500",
    IN_PROGRESS: "bg-purple-500",
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

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const taskStats = computed(() => {
  return {
    total: tasks.value?.length || 0,
    completed: tasks.value?.filter((t) => t.status === "COMPLETED").length || 0,
    inProgress: tasks.value?.filter((t) => t.status === "IN_PROGRESS").length || 0,
    todo: tasks.value?.filter((t) => t.status === "TODO").length || 0,
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
      <NuxtLink :to="`/${organizationId}/projects`">
        <Button variant="ghost" size="sm" class="gap-2">
          <ArrowLeft class="h-4 w-4" />
          Back to Projects
        </Button>
      </NuxtLink>
      <div class="flex items-center gap-3">
        <Button variant="outline">Settings</Button>
        <Button>
          <FolderKanban class="h-4 w-4 mr-2" />
          Manage
        </Button>
      </div>
    </div>

    <div v-if="projectPending" class="animate-pulse space-y-4">
      <div class="h-20 bg-muted rounded-lg" />
      <div class="grid md:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="h-24 bg-muted rounded-lg" />
      </div>
    </div>

    <div v-else-if="project" class="space-y-6">
      <div class="flex items-center gap-4">
        <div
          class="h-12 w-12 rounded-lg flex items-center justify-center text-2xl"
          :style="{ backgroundColor: project.color || '#3b82f6' }"
        >
          {{ project.icon || "📁" }}
        </div>
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-foreground flex items-center gap-2">
            {{ project.name }}
            <Badge :class="[getStatusColor(project.status), 'text-white']">
              {{ project.status?.replace("_", "-")?.toLowerCase() }}
            </Badge>
          </h1>
          <p class="text-muted-foreground mt-1">
            {{ project.description || "No description" }}
          </p>
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
                <p class="text-sm text-muted-foreground">Tasks</p>
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
                <p class="text-sm text-muted-foreground">Team</p>
                <p class="text-2xl font-bold">{{ members?.length || 0 }}</p>
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
                <p class="text-sm text-muted-foreground">Due</p>
                <p class="text-lg font-bold">
                  {{ project.endDate ? new Date(project.endDate).toLocaleDateString() : "No date" }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Tasks</h2>
            <Dialog v-model:open="showAddTask">
              <DialogTrigger as-child>
                <Button size="sm">
                  <Plus class="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Task</DialogTitle>
                </DialogHeader>
                <div class="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input v-model="newTask.title" placeholder="Task title" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea v-model="newTask.description" placeholder="Task description" rows="3" />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Priority</Label>
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
                      <Label>Est. Hours</Label>
                      <Input v-model="newTask.estimatedHours" type="number" placeholder="8" />
                    </div>
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input v-model="newTask.dueDate" type="date" />
                  </div>
                  <Button @click="addTask" class="w-full">Create Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div v-if="projectPending" class="space-y-4">
            <div v-for="i in 3" :key="i" class="h-24 bg-muted rounded-lg animate-pulse" />
          </div>

          <div v-else class="space-y-4">
            <div v-if="tasks.length === 0" class="text-center py-12 text-muted-foreground">
              No tasks yet. Create your first task above.
            </div>
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
                        <p class="text-sm text-muted-foreground mt-1">
                          {{ task.description || "No description" }}
                        </p>
                      </div>
                      <Badge :class="[getStatusColor(task.status), 'text-white']">
                        {{ task.status?.replace("_", "-")?.toLowerCase() }}
                      </Badge>
                    </div>
                    <div class="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <div v-if="task.dueDate" class="flex items-center gap-2">
                        <Calendar class="h-4 w-4" />
                        {{ new Date(task.dueDate).toLocaleDateString() }}
                      </div>
                      <div v-if="task.estimatedHours" class="flex items-center gap-2">
                        <Timer class="h-4 w-4" />
                        {{ task.actualHours || 0 }}/{{ task.estimatedHours }}h
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Progress</CardTitle>
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
                <div class="space-y-2 text-sm">
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span>Completed</span>
                    <span class="font-medium ml-auto">{{ taskStats.completed }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>In Progress</span>
                    <span class="font-medium ml-auto">{{ taskStats.inProgress }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-gray-500"></div>
                    <span>TODO</span>
                    <span class="font-medium ml-auto">{{ taskStats.todo }}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div v-if="projectPending" class="space-y-3">
                <div v-for="i in 3" :key="i" class="h-12 bg-muted rounded animate-pulse" />
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="member in members"
                  :key="member.id"
                  class="flex items-center gap-3"
                >
                  <Avatar class="h-8 w-8">
                    <AvatarImage :src="member.user?.avatar" />
                    <AvatarFallback class="text-xs">
                      {{ getInitials(member.user?.name || "") }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium truncate">
                      {{ member.user?.name }}
                    </div>
                    <Badge variant="outline" class="text-xs mt-1">
                      {{ member.role }}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
