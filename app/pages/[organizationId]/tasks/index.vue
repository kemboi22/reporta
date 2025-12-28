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
  UserPlus,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderKanban,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const viewMode = ref<"kanban" | "list">("kanban");
const showCreateTaskSheet = ref(false);
const showEditTaskSheet = ref(false);
const showAddTeammateSheet = ref(false);
const selectedFilter = ref("all");
const selectedProject = ref<string | null>(null);
const selectedAssignee = ref<string | null>(null);
const searchQuery = ref("");
const memberSearchQuery = ref("");
const draggedTask = ref<{ columnId: string; taskId: number } | null>(null);
const dragOverColumn = ref<string | null>(null);
const editingTask = ref<any>(null);
const selectedTaskForTeam = ref<any>(null);

const columns = [
  { id: "backlog", title: "Backlog", color: "bg-slate-500", count: 8 },
  { id: "todo", title: "To Do", color: "bg-blue-500", count: 12 },
  { id: "in-progress", title: "In Progress", color: "bg-purple-500", count: 5 },
  { id: "review", title: "Review", color: "bg-amber-500", count: 3 },
  { id: "completed", title: "Completed", color: "bg-emerald-500", count: 24 },
];

const teamMembers = [
  {
    id: "emma",
    name: "Emma Davis",
    photo: "/placeholder-user.jpg",
    role: "Pharmacist",
  },
  {
    id: "sarah",
    name: "Sarah Johnson",
    photo: "/placeholder-user.jpg",
    role: "Quality",
  },
  {
    id: "mike",
    name: "Mike Chen",
    photo: "/placeholder-user.jpg",
    role: "Maintenance",
  },
  {
    id: "robert",
    name: "Robert Taylor",
    photo: "/placeholder-user.jpg",
    role: "HR",
  },
  {
    id: "james",
    name: "James Wilson",
    photo: "/placeholder-user.jpg",
    role: "Compliance",
  },
];

const projects = [
  { id: "p1", name: "Website Redesign", color: "bg-blue-500" },
  { id: "p2", name: "Mobile App", color: "bg-purple-500" },
  { id: "p3", name: "API Integration", color: "bg-emerald-500" },
  { id: "p4", name: "Marketing Campaign", color: "bg-amber-500" },
];

const tasks = ref({
  backlog: [
    {
      id: 1,
      title: "Update medication inventory system",
      description: "Review and update the medication tracking system",
      priority: "medium",
      category: "Pharmacy",
      assigneeId: "emma",
      projectId: "p1",
      teamIds: ["emma", "sarah"],
      dueDate: "2024-12-30",
      comments: 2,
      attachments: 1,
      subtasks: { completed: 0, total: 3 },
    },
    {
      id: 2,
      title: "Staff training documentation",
      description: "Create training materials for new protocols",
      priority: "low",
      category: "HR",
      assigneeId: "robert",
      projectId: "p3",
      teamIds: ["robert"],
      dueDate: "2025-01-05",
      comments: 0,
      attachments: 2,
      subtasks: { completed: 1, total: 4 },
    },
  ],
  todo: [
    {
      id: 3,
      title: "Prepare monthly pharmacy report",
      description: "Compile all pharmacy statistics for December",
      priority: "urgent",
      category: "Reports",
      assigneeId: "emma",
      projectId: "p1",
      teamIds: ["emma"],
      dueDate: "2024-12-25",
      comments: 5,
      attachments: 3,
      subtasks: { completed: 2, total: 5 },
    },
    {
      id: 4,
      title: "Review patient feedback forms",
      description: "Analyze and categorize patient satisfaction surveys",
      priority: "high",
      category: "Quality",
      assigneeId: "sarah",
      projectId: "p2",
      teamIds: ["sarah", "mike"],
      dueDate: "2024-12-26",
      comments: 1,
      attachments: 0,
      subtasks: { completed: 0, total: 2 },
    },
  ],
  "in-progress": [
    {
      id: 5,
      title: "Emergency equipment maintenance",
      description: "Quarterly maintenance check on all ER equipment",
      priority: "urgent",
      category: "Maintenance",
      assigneeId: "mike",
      projectId: "p2",
      teamIds: ["mike", "robert"],
      dueDate: "2024-12-24",
      comments: 8,
      attachments: 5,
      subtasks: { completed: 3, total: 6 },
    },
  ],
  review: [
    {
      id: 6,
      title: "Update safety protocols document",
      description: "Review and update hospital safety guidelines",
      priority: "high",
      category: "Compliance",
      assigneeId: "james",
      projectId: "p3",
      teamIds: ["james"],
      dueDate: "2024-12-27",
      comments: 4,
      attachments: 2,
      subtasks: { completed: 4, total: 4 },
    },
  ],
  completed: [],
});

const getAssignee = (assigneeId: string) => {
  return (
    teamMembers.find((m) => m.id === assigneeId) || {
      name: "Unassigned",
      photo: "",
    }
  );
};

const getProject = (projectId: string) => {
  return (
    projects.find((p) => p.id === projectId) || {
      name: "No Project",
      color: "bg-muted",
    }
  );
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const filteredTeamMembers = computed(() => {
  if (!memberSearchQuery.value) return teamMembers;
  return teamMembers.filter((member) => {
    const matchesSearch =
      member.name
        .toLowerCase()
        .includes(memberSearchQuery.value.toLowerCase()) ||
      member.role.toLowerCase().includes(memberSearchQuery.value.toLowerCase());
    return matchesSearch;
  });
});

const toggleTeamMember = (memberId: string) => {
  if (!selectedTaskForTeam.value) return;
  const memberIds = selectedTaskForTeam.value.teamIds || [];
  if (memberIds.includes(memberId)) {
    selectedTaskForTeam.value.teamIds = memberIds.filter(
      (id) => id !== memberId,
    );
  } else {
    selectedTaskForTeam.value.teamIds = [...memberIds, memberId];
  }
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    urgent: "border-red-500 bg-red-50 dark:bg-red-950/20",
    high: "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
    medium: "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
    low: "border-slate-300 bg-slate-50 dark:bg-slate-950/20",
  };
  return colors[priority] || colors.medium;
};

const getPriorityBadge = (priority: string) => {
  const badges: Record<string, any> = {
    urgent: { variant: "destructive" as const, label: "Urgent" },
    high: {
      variant: "default" as const,
      class: "bg-orange-500 hover:bg-orange-600 text-white",
      label: "High",
    },
    medium: {
      variant: "default" as const,
      class: "bg-blue-500 hover:bg-blue-600 text-white",
      label: "Medium",
    },
    low: { variant: "secondary" as const, label: "Low" },
  };
  return badges[priority] || badges.medium;
};

const getFilteredTasks = (columnId: string) => {
  const columnTasks = tasks.value[columnId as keyof typeof tasks.value] || [];
  return columnTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesAssignee =
      !selectedAssignee.value || task.assigneeId === selectedAssignee.value;
    const matchesProject =
      !selectedProject.value || task.projectId === selectedProject.value;
    const matchesFilter =
      selectedFilter.value === "all" ||
      (selectedFilter.value === "urgent" && task.priority === "urgent");
    return matchesSearch && matchesAssignee && matchesProject && matchesFilter;
  });
};

const getFilteredColumnCount = (columnId: string) => {
  return getFilteredTasks(columnId).length;
};

const onTaskDragStart = (columnId: string, taskId: number) => {
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

const onColumnDrop = (targetColumnId: string) => {
  if (!draggedTask.value) return;
  const { columnId: sourceColumnId, taskId } = draggedTask.value;
  if (sourceColumnId === targetColumnId) {
    draggedTask.value = null;
    dragOverColumn.value = null;
    return;
  }
  const sourceColumn = tasks.value[sourceColumnId as keyof typeof tasks.value];
  const taskIndex = sourceColumn.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    const [task] = sourceColumn.splice(taskIndex, 1);
    const targetColumn =
      tasks.value[targetColumnId as keyof typeof tasks.value];
    targetColumn.push(task);
  }
  draggedTask.value = null;
  dragOverColumn.value = null;
};

const assignTask = (columnId: string, taskId: number, assigneeId: string) => {
  const column = tasks.value[columnId as keyof typeof tasks.value];
  const task = column.find((t) => t.id === taskId);
  if (task) {
    task.assigneeId = assigneeId;
  }
};

const openCreateTaskSheet = () => {
  editingTask.value = null;
  showCreateTaskSheet.value = true;
};

const openEditTaskSheet = (columnId: string, taskId: number) => {
  const column = tasks.value[columnId as keyof typeof tasks.value];
  const task = column.find((t) => t.id === taskId);
  if (task) {
    editingTask.value = { ...task, columnId };
    showEditTaskSheet.value = true;
  }
};

const openAddTeammateSheet = (columnId: string, taskId: number) => {
  const column = tasks.value[columnId as keyof typeof tasks.value];
  const task = column.find((t) => t.id === taskId);
  if (task) {
    selectedTaskForTeam.value = { ...task, columnId };
    showAddTeammateSheet.value = true;
  }
};

const saveTask = () => {
  if (editingTask.value) {
    const { columnId, id, ...updates } = editingTask.value;
    const column = tasks.value[columnId as keyof typeof tasks.value];
    const taskIndex = column.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      Object.assign(column[taskIndex], updates);
    }
  }
  showCreateTaskSheet.value = false;
  showEditTaskSheet.value = false;
  editingTask.value = null;
};

const createTask = () => {
  showCreateTaskSheet.value = false;
};

const addTeammate = () => {
  showAddTeammateSheet.value = false;
};

const totalTasks = computed(() => {
  return Object.values(tasks.value).reduce((sum, col) => sum + col.length, 0);
});

const inProgressTasks = computed(() => tasks.value["in-progress"].length);

const completedTasks = computed(() => tasks.value.completed.length);

const completionRate = computed(() => {
  return totalTasks.value > 0
    ? Math.round((completedTasks.value / totalTasks.value) * 100)
    : 0;
});

const allTasks = computed(() => {
  const result: Array<any> = [];
  Object.entries(tasks.value).forEach(([columnId, columnTasks]) => {
    columnTasks.forEach((task) => {
      result.push({ ...task, columnId });
    });
  });
  return result.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesAssignee =
      !selectedAssignee.value || task.assigneeId === selectedAssignee.value;
    const matchesProject =
      !selectedProject.value || task.projectId === selectedProject.value;
    const matchesFilter =
      selectedFilter.value === "all" ||
      (selectedFilter.value === "urgent" && task.priority === "urgent");
    return matchesSearch && matchesAssignee && matchesProject && matchesFilter;
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
        <SheetContent class="w-full sm:w-[600px] overflow-y-auto">
          <SheetHeader class="px-6 pt-6 pb-2">
            <SheetTitle>Create New Task</SheetTitle>
            <SheetDescription>Add a new task to your board</SheetDescription>
          </SheetHeader>
          <div class="px-6 py-4 space-y-5">
            <div class="space-y-2 pb-2">
              <Label for="title" class="text-sm font-medium">Task Title</Label>
              <Input id="title" placeholder="Enter task title" class="h-10" />
            </div>
            <div class="space-y-2 pb-2">
              <Label for="description" class="text-sm font-medium"
                >Description</Label
              >
              <Textarea
                id="description"
                placeholder="Describe the task..."
                rows="4"
                class="resize-none"
              />
            </div>
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the task..."
                rows="3"
              />
            </div>
            <div class="grid grid-cols-2 gap-5 pb-4">
              <div class="space-y-2">
                <Label for="project" class="text-sm font-medium">Project</Label>
                <Select>
                  <SelectTrigger class="h-10">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Project</SelectItem>
                    <SelectItem
                      v-for="project in projects"
                      :key="project.id"
                      :value="project.id"
                    >
                      <div class="flex items-center gap-2">
                        <div
                          :class="['w-3 h-3 rounded-full', project.color]"
                        ></div>
                        {{ project.name }}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-5 pb-4">
              <div class="space-y-2">
                <Label for="assignee" class="text-sm font-medium"
                  >Assign To</Label
                >
                <Select>
                  <SelectTrigger class="h-11">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="member in teamMembers"
                      :key="member.id"
                      :value="member.id"
                    >
                      <div class="flex items-center gap-3 py-1">
                        <Avatar class="h-6 w-6">
                          <AvatarImage :src="member.photo" />
                          <AvatarFallback class="text-xs">{{
                            getInitials(member.name)
                          }}</AvatarFallback>
                        </Avatar>
                        <div class="flex-1">
                          <div class="text-sm font-medium">
                            {{ member.name }}
                          </div>
                          <div class="text-xs text-muted-foreground">
                            {{ member.role }}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="dueDate" class="text-sm font-medium"
                  >Due Date</Label
                >
                <Input id="dueDate" type="date" class="h-11" />
                <p class="text-xs text-muted-foreground mt-1">mm/dd/yyyy</p>
              </div>
            </div>
            <div class="space-y-2">
              <Label>Team Members</Label>
              <div
                class="border rounded-md p-3 space-y-2 max-h-32 overflow-y-auto"
              >
                <div
                  v-for="member in teamMembers"
                  :key="member.id"
                  class="flex items-center gap-3"
                >
                  <Switch :id="'team-' + member.id" />
                  <Avatar class="h-8 w-8">
                    <AvatarImage :src="member.photo" />
                    <AvatarFallback
                      class="bg-primary text-primary-foreground text-xs"
                    >
                      {{ getInitials(member.name) }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex-1">
                    <div class="text-sm font-medium">{{ member.name }}</div>
                    <div class="text-xs text-muted-foreground">
                      {{ member.role }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                @click="showCreateTaskSheet = false"
                class="px-6 h-10"
                >Cancel</Button
              >
              <Button @click="createTask" class="px-6 h-10">Create Task</Button>
            </div>
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
                <SelectItem value="all">All Projects</SelectItem>
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
            <Select v-model="selectedAssignee">
              <SelectTrigger class="w-[180px] h-11">
                <SelectValue placeholder="All Members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem
                  v-for="member in teamMembers"
                  :key="member.id"
                  :value="member.id"
                >
                  <div class="flex items-center gap-2">
                    <Avatar class="h-5 w-5">
                      <AvatarImage :src="member.photo" />
                      <AvatarFallback class="text-[10px]">{{
                        getInitials(member.name)
                      }}</AvatarFallback>
                    </Avatar>
                    {{ member.name }}
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
                  selectedAssignee = null;
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
                    getFilteredColumnCount(column.id)
                  }}</Badge>
                </div>
                <Button variant="ghost" size="icon" class="h-7 w-7">
                  <Plus class="h-4 w-4" />
                </Button>
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
                        {{ task.description }}
                      </p>
                      <div
                        class="flex items-center justify-between pt-2 border-t"
                      >
                        <div
                          class="flex items-center gap-3 text-xs text-muted-foreground"
                        >
                          <div class="flex items-center gap-1">
                            <Calendar class="h-3 w-3" />
                            <span>{{ task.dueDate }}</span>
                          </div>
                          <div
                            v-if="task.comments > 0"
                            class="flex items-center gap-1"
                          >
                            <MessageSquare class="h-3 w-3" />
                            <span>{{ task.comments }}</span>
                          </div>
                          <div
                            v-if="task.attachments > 0"
                            class="flex items-center gap-1"
                          >
                            <Paperclip class="h-3 w-3" />
                            <span>{{ task.attachments }}</span>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <Popover>
                            <PopoverTrigger as-child>
                              <Button
                                variant="ghost"
                                size="icon"
                                class="h-7 w-7 p-0 rounded-full"
                              >
                                <Avatar class="h-6 w-6">
                                  <AvatarImage
                                    :src="getAssignee(task.assigneeId).photo"
                                  />
                                  <AvatarFallback
                                    class="text-[10px] bg-primary/10 text-primary"
                                    >{{
                                      getInitials(
                                        getAssignee(task.assigneeId).name,
                                      )
                                    }}</AvatarFallback
                                  >
                                </Avatar>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-[200px] p-2" align="end">
                              <div
                                class="text-xs font-medium mb-2 px-2 text-muted-foreground"
                              >
                                Assign to:
                              </div>
                              <Command>
                                <CommandList>
                                  <CommandItem
                                    v-for="member in teamMembers"
                                    :key="member.id"
                                    :value="member.id"
                                    @click="
                                      assignTask(column.id, task.id, member.id)
                                    "
                                  >
                                    <CheckCircle2
                                      v-if="task.assigneeId === member.id"
                                      class="mr-2 h-3.5 w-3.5"
                                    />
                                    <div class="mr-2 h-3.5 w-3.5" v-else></div>
                                    <Avatar class="h-5 w-5 mr-2">
                                      <AvatarImage :src="member.photo" />
                                      <AvatarFallback class="text-[10px]">{{
                                        getInitials(member.name)
                                      }}</AvatarFallback>
                                    </Avatar>
                                    <span class="text-sm">{{
                                      member.name
                                    }}</span>
                                  </CommandItem>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <Button
                            variant="outline"
                            size="icon"
                            class="h-7 w-7"
                            @click="openAddTeammateSheet(column.id, task.id)"
                          >
                            <Users class="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div v-if="task.subtasks.total > 0" class="mt-3">
                        <div
                          class="flex items-center justify-between text-[10px] text-muted-foreground mb-1"
                        >
                          <span>Progress</span>
                          <span class="font-medium"
                            >{{ task.subtasks.completed }}/{{
                              task.subtasks.total
                            }}</span
                          >
                        </div>
                        <div class="w-full bg-muted/50 rounded-full h-1">
                          <div
                            class="h-1 rounded-full transition-all"
                            :class="
                              task.subtasks.completed === task.subtasks.total
                                ? 'bg-emerald-500'
                                : 'bg-primary'
                            "
                            :style="{
                              width: `${(task.subtasks.completed / task.subtasks.total) * 100}%`,
                            }"
                          ></div>
                        </div>
                      </div>
                      <div
                        v-if="task.teamIds && task.teamIds.length > 1"
                        class="mt-3 pt-3 border-t"
                      >
                        <div
                          class="flex items-center gap-1 text-[10px] text-muted-foreground mb-2"
                        >
                          <Users class="h-3 w-3" />
                          <span>Team ({{ task.teamIds.length }})</span>
                        </div>
                        <div class="flex -space-x-1.5">
                          <Avatar
                            v-for="memberId in task.teamIds.slice(0, 4)"
                            :key="memberId"
                            class="h-6 w-6 border-2 border-background"
                          >
                            <AvatarImage :src="getAssignee(memberId).photo" />
                            <AvatarFallback
                              class="bg-primary text-primary-foreground text-[9px]"
                            >
                              {{ getInitials(getAssignee(memberId).name) }}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            v-if="task.teamIds.length > 4"
                            class="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-medium text-muted-foreground"
                          >
                            +{{ task.teamIds.length - 4 }}
                          </div>
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
              <TableHead>Team</TableHead>
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
                    {{ task.description }}
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
                <div class="flex items-center gap-2">
                  <Avatar class="h-6 w-6">
                    <AvatarImage :src="getAssignee(task.assigneeId).photo" />
                    <AvatarFallback class="text-[10px]">{{
                      getInitials(getAssignee(task.assigneeId).name)
                    }}</AvatarFallback>
                  </Avatar>
                  <span class="text-sm">{{
                    getAssignee(task.assigneeId).name
                  }}</span>
                </div>
              </TableCell>
              <TableCell>
                <div
                  v-if="task.teamIds && task.teamIds.length > 0"
                  class="flex -space-x-1"
                >
                  <Avatar
                    v-for="memberId in task.teamIds.slice(0, 3)"
                    :key="memberId"
                    class="h-6 w-6 border-2 border-background"
                  >
                    <AvatarImage :src="getAssignee(memberId).photo" />
                    <AvatarFallback class="text-[9px]">{{
                      getInitials(getAssignee(memberId).name)
                    }}</AvatarFallback>
                  </Avatar>
                  <div
                    v-if="task.teamIds.length > 3"
                    class="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-medium text-muted-foreground"
                  >
                    +{{ task.teamIds.length - 3 }}
                  </div>
                </div>
              </TableCell>
              <TableCell class="text-sm text-muted-foreground">{{
                task.dueDate
              }}</TableCell>
              <TableCell>
                <Badge class="bg-blue-100 text-blue-700 hover:bg-blue-100">{{
                  columns.find((c) => c.id === task.columnId)?.title
                }}</Badge>
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
                      @click="openEditTaskSheet(task.columnId, task.id)"
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
              <Clock class="h-4 w-4 text-purple-600 dark:text-purple-400" />
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
              <CheckCircle2
                class="h-4 w-4 text-emerald-600 dark:text-emerald-400"
              />
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
      <SheetContent class="w-full sm:w-[600px] overflow-y-auto">
        <SheetHeader class="px-6 pt-6 pb-2">
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>Update task details</SheetDescription>
        </SheetHeader>
        <div v-if="editingTask" class="px-6 py-4 space-y-5">
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
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-5 pb-4">
            <div class="space-y-2">
              <Label for="edit-assignee" class="text-sm font-medium"
                >Assign To</Label
              >
              <Select v-model="editingTask.assigneeId">
                <SelectTrigger class="h-11">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="member in teamMembers"
                    :key="member.id"
                    :value="member.id"
                  >
                    <div class="flex items-center gap-3 py-1">
                      <Avatar class="h-6 w-6">
                        <AvatarImage :src="member.photo" />
                        <AvatarFallback class="text-xs">{{
                          getInitials(member.name)
                        }}</AvatarFallback>
                      </Avatar>
                      <div class="flex-1">
                        <div class="text-sm font-medium">{{ member.name }}</div>
                        <div class="text-xs text-muted-foreground">
                          {{ member.role }}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="edit-category" class="text-sm font-medium"
                >Category</Label
              >
              <Input
                id="edit-category"
                v-model="editingTask.category"
                placeholder="e.g., Reports"
                class="h-11"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 gap-5 pb-4">
            <div class="space-y-2">
              <Label for="edit-dueDate" class="text-sm font-medium"
                >Due Date</Label
              >
              <Input
                id="edit-dueDate"
                v-model="editingTask.dueDate"
                type="date"
                class="h-11"
              />
              <p class="text-xs text-muted-foreground mt-1">mm/dd/yyyy</p>
            </div>
            <div class="space-y-2">
              <Label for="edit-column" class="text-sm font-medium"
                >Move to</Label
              >
              <Select>
                <SelectTrigger class="h-11">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="col in columns"
                    :key="col.id"
                    :value="col.id"
                    >{{ col.title }}</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="space-y-3 pb-4">
            <div class="flex items-center justify-between">
              <Label class="text-sm font-medium"
                >Team Members ({{
                  teamMembers.filter((m) =>
                    editingTask?.teamIds?.includes(m.id),
                  ).length
                }}
                selected)</Label
              >
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">
                  {{ editingTask?.teamIds?.length }} total
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-7 text-xs"
                  @click="editingTask.teamIds = teamMembers.map((m) => m.id)"
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-7 text-xs"
                  @click="editingTask.teamIds = []"
                >
                  Clear All
                </Button>
              </div>
            </div>
            <Input
              v-model="memberSearchQuery"
              placeholder="Search team members..."
              class="mb-3"
            />
            <div class="border rounded-lg overflow-hidden">
              <ScrollArea class="max-h-48">
                <div class="p-2 space-y-1">
                  <div
                    v-for="member in filteredTeamMembers"
                    :key="member.id"
                    @click="toggleTeamMember(member.id)"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    :class="
                      editingTask?.teamIds?.includes(member.id)
                        ? 'bg-primary/10 border-primary/30'
                        : 'hover:bg-muted/50'
                    "
                  >
                    <div class="flex items-center justify-center w-6">
                      <CheckCircle2
                        v-if="editingTask?.teamIds?.includes(member.id)"
                        class="h-4 w-4 text-primary"
                      />
                    </div>
                    <Avatar class="h-9 w-9">
                      <AvatarImage :src="member.photo" />
                      <AvatarFallback
                        class="text-sm bg-primary/10 text-primary font-semibold"
                      >
                        {{ getInitials(member.name) }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="flex-1">
                      <div class="text-sm font-medium">{{ member.name }}</div>
                      <div class="text-xs text-muted-foreground">
                        {{ member.role }}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <Button variant="outline" @click="showEditTaskSheet = false"
            >Cancel</Button
          >
          <Button @click="saveTask">Save Changes</Button>
        </div>
      </SheetContent>
    </Sheet>

    <Sheet v-model:open="showAddTeammateSheet">
      <SheetContent class="w-full sm:w-[500px] overflow-y-auto">
        <SheetHeader class="px-6 pt-6 pb-2">
          <SheetTitle>Manage Task Team</SheetTitle>
          <SheetDescription
            >Add or remove team members for this task</SheetDescription
          >
        </SheetHeader>
        <div v-if="selectedTaskForTeam" class="px-6 py-4 space-y-5">
          <div class="p-4 rounded-lg bg-muted/30">
            <p class="font-medium text-foreground mb-2">
              {{ selectedTaskForTeam.title }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{ selectedTaskForTeam.description }}
            </p>
          </div>
          <div class="space-y-3 pb-4">
            <div class="flex items-center justify-between">
              <Label class="text-sm font-medium"
                >Team Members ({{
                  teamMembers.filter((m) =>
                    selectedTaskForTeam.teamIds?.includes(m.id),
                  ).length
                }}
                selected)</Label
              >
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground"
                  >{{ teamMembers.length }} total</span
                >
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-7 text-xs px-2"
                  @click="
                    selectedTaskForTeam.teamIds = teamMembers.map((m) => m.id)
                  "
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-7 text-xs px-2"
                  @click="selectedTaskForTeam.teamIds = []"
                >
                  Clear All
                </Button>
              </div>
            </div>
            <Input
              v-model="memberSearchQuery"
              placeholder="Search team members..."
              class="mb-3"
            />
            <div class="border rounded-lg overflow-hidden">
              <ScrollArea class="max-h-64">
                <div class="p-2 space-y-1">
                  <div
                    v-for="member in filteredTeamMembers"
                    :key="member.id"
                    @click="toggleTeamMember(member.id)"
                    class="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    :class="
                      selectedTaskForTeam.teamIds?.includes(member.id)
                        ? 'bg-primary/10 border-primary/30'
                        : ''
                    "
                  >
                    <div class="flex items-center justify-center w-7">
                      <CheckCircle2
                        v-if="selectedTaskForTeam.teamIds?.includes(member.id)"
                        class="h-4 w-4 text-primary"
                      />
                    </div>
                    <Avatar class="h-9 w-9">
                      <AvatarImage :src="member.photo" />
                      <AvatarFallback
                        class="text-sm bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold"
                      >
                        {{ getInitials(member.name) }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="flex-1">
                      <div class="text-sm font-medium">{{ member.name }}</div>
                      <div class="text-xs text-muted-foreground">
                        {{ member.role }}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        <SheetFooter class="px-6 pt-4 border-t">
          <Button
            variant="outline"
            @click="showAddTeammateSheet = false"
            class="h-11 px-6"
            >Cancel</Button
          >
          <Button @click="addTeammate" class="h-11 px-6"> Done </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>
