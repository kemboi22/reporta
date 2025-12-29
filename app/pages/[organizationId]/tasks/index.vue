<script setup lang="ts">
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Calendar,
  MessageSquare,
  Paperclip,
  MoreVertical,
  Edit2,
  Trash2,
  FolderKanban,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const viewMode = ref<"kanban" | "list">("kanban");
const showCreateTaskSheet = ref(false);
const showEditTaskSheet = ref(false);
const selectedFilter = ref("all");
const selectedProject = ref<string | null>(null);
const searchQuery = ref("");
const draggedTask = ref<{ columnId: string; taskId: string } | null>(null);
const dragOverColumn = ref<string | null>(null);
const editingTask = ref<any>(null);

const columns = [
  { id: "TODO", title: "To Do", color: "bg-blue-500" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-purple-500" },
  { id: "COMPLETED", title: "Completed", color: "bg-emerald-500" },
  { id: "CANCELLED", title: "Cancelled", color: "bg-red-500" },
];

const { data: tasksData, pending: tasksPending, refresh: refreshTasks } = await useLazyFetch(
  `/api/${organizationId}/tasks`,
  {
    query: {
      projectId: selectedProject,
      take: 100,
    },
  },
);

const { data: projectsData } = await useLazyFetch(
  `/api/${organizationId}/projects`,
);

const tasks = computed(() => {
  const allTasks = tasksData.value || [];
  const result: Record<string, any[]> = {
    TODO: [],
    IN_PROGRESS: [],
    COMPLETED: [],
    CANCELLED: [],
  };
  
  allTasks.forEach((task: any) => {
    const status = task.status || "TODO";
    if (result[status]) {
      result[status].push(task);
    }
  });
  
  return result;
});

const projects = computed(() => {
  return (projectsData.value || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    color: p.color || "bg-blue-500",
  }));
});

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    URGENT: "border-red-500 bg-red-50 dark:bg-red-950/20",
    HIGH: "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
    MEDIUM: "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
    LOW: "border-slate-300 bg-slate-50 dark:bg-slate-950/20",
  };
  return colors[priority] || colors.MEDIUM;
};

const getPriorityBadge = (priority: string) => {
  const badges: Record<string, any> = {
    URGENT: { variant: "destructive" as const },
    HIGH: {
      variant: "default" as const,
      class: "bg-orange-500 hover:bg-orange-600 text-white",
    },
    MEDIUM: {
      variant: "default" as const,
      class: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    LOW: { variant: "secondary" as const },
  };
  return badges[priority] || badges.MEDIUM;
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

const getProject = (projectId: string) => {
  return (
    projects.value.find((p) => p.id === projectId) || {
      name: "No Project",
      color: "bg-muted",
    }
  );
};

const getFilteredTasks = (columnId: string) => {
  const columnTasks = tasks.value[columnId] || [];
  return columnTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
    const matchesProject =
      !selectedProject.value || task.projectId === selectedProject.value;
    const matchesFilter =
      selectedFilter.value === "all" ||
      (selectedFilter.value === "urgent" && task.priority === "URGENT");
    return matchesSearch && matchesProject && matchesFilter;
  });
};

const onTaskDragStart = (columnId: string, taskId: string) => {
  draggedTask.value = { columnId, taskId };
};

const onColumnDragEnter = (columnId: string) => {
  dragOverColumn.value = columnId;
};

const onColumnDragLeave = () => {
  dragOverColumn.value = null;
};

const onColumnDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const onColumnDrop = async (targetColumnId: string) => {
  if (!draggedTask.value) return;
  const { columnId: sourceColumnId, taskId } = draggedTask.value;
  if (sourceColumnId === targetColumnId) {
    draggedTask.value = null;
    dragOverColumn.value = null;
    return;
  }

  try {
    await $fetch(`/api/${organizationId}/tasks/${taskId}`, {
      method: "PUT",
      body: { status: targetColumnId },
    });
    await refreshTasks();
  } catch (error) {
    console.error("Failed to update task status:", error);
  }
  draggedTask.value = null;
  dragOverColumn.value = null;
};

const openEditTaskSheet = (status: string, taskId: string) => {
  const task = tasksData.value?.find((t: any) => t.id === taskId);
  if (task) {
    editingTask.value = { ...task };
    showEditTaskSheet.value = true;
  }
};

const saveTask = async () => {
  if (editingTask.value) {
    try {
      const { id, ...updates } = editingTask.value;
      await $fetch(`/api/${organizationId}/tasks/${id}`, {
        method: "PUT",
        body: updates,
      });
      await refreshTasks();
      showCreateTaskSheet.value = false;
      showEditTaskSheet.value = false;
      editingTask.value = null;
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  }
};

const createTask = async () => {
  showCreateTaskSheet.value = false;
  await refreshTasks();
};

const totalTasks = computed(() => (tasksData.value?.length || 0));

const inProgressTasks = computed(() => {
  return tasksData.value?.filter((t: any) => t.status === "IN_PROGRESS").length || 0;
});

const completedTasks = computed(() => {
  return tasksData.value?.filter((t: any) => t.status === "COMPLETED").length || 0;
});

const completionRate = computed(() => {
  return totalTasks.value > 0
    ? Math.round((completedTasks.value / totalTasks.value) * 100)
    : 0;
});

const allTasks = computed(() => {
  const tasksList = tasksData.value || [];
  return tasksList.filter((task: any) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
    const matchesProject =
      !selectedProject.value || task.projectId === selectedProject.value;
    const matchesFilter =
      selectedFilter.value === "all" ||
      (selectedFilter.value === "urgent" && task.priority === "URGENT");
    return matchesSearch && matchesProject && matchesFilter;
  });
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Task Management</h1>
        <p class="text-muted-foreground mt-1">
          Organize and track your team's work
        </p>
      </div>
      <Sheet v-model:open="showCreateTaskSheet">
        <SheetTrigger as-child>
          <Button class="gap-2">
            <Plus class="h-4 w-4" />
            Create Task
          </Button>
        </SheetTrigger>
        <SheetContent class="w-full sm:w-[500px]">
          <SheetHeader>
            <SheetTitle>Create New Task</SheetTitle>
            <SheetDescription>Add a new task to your board</SheetDescription>
          </SheetHeader>
          <div class="space-y-4 py-4">
            <div class="space-y-2">
              <Label for="title">Title</Label>
              <Input id="title" placeholder="Task title" />
            </div>
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Textarea id="description" placeholder="Describe the task..." rows="4" />
            </div>
            <Button @click="createTask" class="w-full">Create Task</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>

    <Card>
      <CardContent class="p-4">
        <div class="flex flex-col lg:flex-row items-center gap-4">
          <div class="relative flex-1 w-full">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search tasks..."
              class="pl-10"
            />
          </div>
          <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Select v-model="selectedProject">
              <SelectTrigger class="w-[180px] h-11">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="null">All Projects</SelectItem>
                <SelectItem
                  v-for="project in projects"
                  :key="project.id"
                  :value="project.id"
                >
                  <div class="flex items-center gap-2">
                    <div
                      :class="['w-2.5 h-2.5 rounded-full', project.color]"
                    ></div>
                    {{ project.name }}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Select v-model="selectedFilter">
              <SelectTrigger class="w-[140px] h-11">
                <SelectValue placeholder="All Tasks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="urgent">Urgent Only</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              class="h-11 w-11"
              @click="
                () => {
                  selectedFilter = 'all';
                  selectedProject = null;
                  searchQuery = '';
                }
              "
            >
              <Filter class="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" class="h-8 hidden lg:block" />
            <div class="flex border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                :class="viewMode === 'kanban' && 'bg-muted'"
                @click="viewMode = 'kanban'"
              >
                <LayoutGrid class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :class="viewMode === 'list' && 'bg-muted'"
                @click="viewMode = 'list'"
              >
                <ListIcon class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <div v-if="viewMode === 'kanban'" class="overflow-x-auto pb-4">
      <div class="flex gap-4 min-w-max">
        <div
          v-for="column in columns"
          :key="column.id"
          class="w-[320px] flex-shrink-0"
          @dragenter="onColumnDragEnter(column.id)"
          @dragleave="onColumnDragLeave"
          @dragover="onColumnDragOver"
          @drop="onColumnDrop(column.id)"
        >
          <Card
            :class="[
              'transition-all',
              dragOverColumn === column.id &&
                'ring-2 ring-primary ring-offset-2 ring-offset-background',
            ]"
          >
            <CardContent class="p-4">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <div :class="['w-2 h-2 rounded-full', column.color]"></div>
                  <h3 class="font-semibold text-sm">{{ column.title }}</h3>
                  <Badge variant="secondary" class="text-xs font-normal">{{
                    getFilteredTasks(column.id).length
                  }}</Badge>
                </div>
              </div>
              <ScrollArea class="max-h-[calc(100vh-320px)]">
                <div class="space-y-3 pr-2">
                  <Card
                    v-for="task in getFilteredTasks(column.id)"
                    :key="task.id"
                    :class="[
                      'group cursor-grab active:cursor-grabbing hover:shadow-lg transition-all',
                      'border-l-4',
                      getPriorityColor(task.priority),
                    ]"
                    draggable="true"
                    @dragstart="onTaskDragStart(column.id, task.id)"
                  >
                    <CardContent class="p-3">
                      <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center gap-2">
                          <Badge
                            :variant="getPriorityBadge(task.priority).variant"
                            :class="getPriorityBadge(task.priority).class"
                            class="text-[10px] font-medium uppercase px-1.5 py-0.5"
                          >
                            {{ task.priority }}
                          </Badge>
                          <div
                            v-if="task.projectId"
                            class="flex items-center gap-1 text-[10px] text-muted-foreground"
                          >
                            <FolderKanban class="h-3 w-3" />
                            {{ getProject(task.projectId).name }}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger as-child>
                            <Button
                              variant="ghost"
                              size="icon"
                              class="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical class="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              @click="openEditTaskSheet(column.id, task.id)"
                            >
                              <Edit2 class="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem class="text-destructive">
                              <Trash2 class="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h4 class="font-medium text-sm mb-1 line-clamp-2">
                        {{ task.title }}
                      </h4>
                      <p
                        class="text-xs text-muted-foreground mb-3 line-clamp-2"
                      >
                        {{ task.description || "" }}
                      </p>
                      <div
                        class="flex items-center justify-between pt-2 border-t"
                      >
                        <div
                          class="flex items-center gap-3 text-xs text-muted-foreground"
                        >
                          <div v-if="task.dueDate" class="flex items-center gap-1">
                            <Calendar class="h-3 w-3" />
                            <span>{{ new Date(task.dueDate).toLocaleDateString() }}</span>
                          </div>
                          <div
                            v-if="task.comments?.length > 0"
                            class="flex items-center gap-1"
                          >
                            <MessageSquare class="h-3 w-3" />
                            <span>{{ task.comments.length }}</span>
                          </div>
                          <div
                            v-if="task.attachments?.length > 0"
                            class="flex items-center gap-1"
                          >
                            <Paperclip class="h-3 w-3" />
                            <span>{{ task.attachments.length }}</span>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <Avatar v-if="task.assignees && task.assignees[0]" class="h-6 w-6">
                            <AvatarImage
                              :src="task.assignees[0].user?.avatar"
                            />
                            <AvatarFallback class="text-[10px] bg-primary/10 text-primary">
                              {{ getInitials(task.assignees[0].user?.name || "") }}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <Card v-else class="border-border">
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="task in allTasks"
              :key="task.id"
              class="hover:bg-muted/50"
            >
              <TableCell>
                <div>
                  <p class="text-sm font-medium">{{ task.title }}</p>
                  <p class="text-xs text-muted-foreground line-clamp-1">
                    {{ task.description || "" }}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div v-if="task.projectId" class="flex items-center gap-2">
                  <div
                    :class="[
                      'w-2 h-2 rounded-full',
                      getProject(task.projectId).color,
                    ]"
                  ></div>
                  <span class="text-sm">{{
                    getProject(task.projectId).name
                  }}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  :variant="getPriorityBadge(task.priority).variant"
                  :class="getPriorityBadge(task.priority).class"
                  >{{ task.priority }}</Badge
                >
              </TableCell>
              <TableCell>
                <div v-if="task.assignees && task.assignees[0]" class="flex items-center gap-2">
                  <Avatar class="h-6 w-6">
                    <AvatarImage :src="task.assignees[0].user?.avatar" />
                    <AvatarFallback class="text-[10px]">{{
                      getInitials(task.assignees[0].user?.name || "")
                    }}</AvatarFallback>
                  </Avatar>
                  <span class="text-sm">{{
                    task.assignees[0].user?.name
                  }}</span>
                </div>
              </TableCell>
              <TableCell class="text-sm text-muted-foreground">{{
                task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"
              }}</TableCell>
              <TableCell>
                <Badge :class="[getStatusColor(task.status), 'text-white']">
                  {{ task.status?.replace("_", "-")?.toLowerCase() }}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreVertical class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      @click="openEditTaskSheet(task.status, task.id)"
                    >
                      <Edit2 class="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem class="text-destructive">
                      <Trash2 class="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <div class="grid md:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-muted-foreground">Total Tasks</p>
            <div
              class="h-8 w-8 rounded-lg bg-muted flex items-center justify-center"
            >
              <LayoutGrid class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <p class="text-2xl font-bold">{{ totalTasks }}</p>
          <p class="text-xs text-muted-foreground mt-1">Across all projects</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-muted-foreground">In Progress</p>
            <div
              class="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center"
            >
              <FolderKanban class="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {{ inProgressTasks }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">Active tasks</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-muted-foreground">Completed</p>
            <div
              class="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center"
            >
              <FolderKanban class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {{ completedTasks }}
          </p>
          <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            {{ completionRate }}% completion rate
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-muted-foreground">Projects</p>
            <div
              class="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center"
            >
              <FolderKanban class="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ projects.length }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">Active projects</p>
        </CardContent>
      </Card>
    </div>

    <Sheet v-model:open="showEditTaskSheet">
      <SheetContent class="w-full sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>Update task details</SheetDescription>
        </SheetHeader>
        <div v-if="editingTask" class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="edit-title">Task Title</Label>
            <Input id="edit-title" v-model="editingTask.title" />
          </div>
          <div class="space-y-2">
            <Label for="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              v-model="editingTask.description"
              rows="3"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-project">Project</Label>
              <Select v-model="editingTask.projectId">
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Project</SelectItem>
                  <SelectItem
                    v-for="project in projects"
                    :key="project.id"
                    :value="project.id"
                  >
                    {{ project.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="edit-priority">Priority</Label>
              <Select v-model="editingTask.priority">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-dueDate" class="text-sm font-medium">Due Date</Label>
              <Input
                id="edit-dueDate"
                v-model="editingTask.dueDate"
                type="date"
                class="h-11"
              />
            </div>
            <div class="space-y-2">
              <Label for="edit-status" class="text-sm font-medium">Status</Label>
              <Select v-model="editingTask.status">
                <SelectTrigger class="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="col in columns"
                    :key="col.id"
                    :value="col.id"
                  >{{ col.title }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <Button variant="outline" @click="showEditTaskSheet = false">Cancel</Button>
          <Button @click="saveTask">Save Changes</Button>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
