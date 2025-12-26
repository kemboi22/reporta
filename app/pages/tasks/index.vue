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
} from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const viewMode = ref<"kanban" | "list">("kanban");
const showCreateTaskDialog = ref(false);
const showEditTaskDialog = ref(false);
const selectedFilter = ref("all");
const selectedAssignee = ref<string | null>(null);
const searchQuery = ref("");
const draggedTask = ref<{ columnId: string; taskId: number } | null>(null);
const dragOverColumn = ref<string | null>(null);
const editingTask = ref<any>(null);

const columns = [
  { id: "backlog", title: "Backlog", color: "bg-slate-500", count: 8, icon: "○" },
  { id: "todo", title: "To Do", color: "bg-blue-500", count: 12, icon: "◐" },
  { id: "in-progress", title: "In Progress", color: "bg-purple-500", count: 5, icon: "◑" },
  { id: "review", title: "Review", color: "bg-amber-500", count: 3, icon: "◎" },
  { id: "completed", title: "Completed", color: "bg-emerald-500", count: 24, icon: "●" },
];

const teamMembers = [
  { id: "emma", name: "Emma Davis", photo: "/placeholder-user.jpg", role: "Pharmacist" },
  { id: "sarah", name: "Sarah Johnson", photo: "/placeholder-user.jpg", role: "Quality" },
  { id: "mike", name: "Mike Chen", photo: "/placeholder-user.jpg", role: "Maintenance" },
  { id: "robert", name: "Robert Taylor", photo: "/placeholder-user.jpg", role: "HR" },
  { id: "james", name: "James Wilson", photo: "/placeholder-user.jpg", role: "Compliance" },
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
      dueDate: "2024-12-27",
      comments: 4,
      attachments: 2,
      subtasks: { completed: 4, total: 4 },
    },
  ],
  completed: [],
});

const getAssignee = (assigneeId: string) => {
  return teamMembers.find((m) => m.id === assigneeId) || { name: "Unassigned", photo: "" };
};

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
    urgent: "border-red-500 bg-red-50 dark:bg-red-950/20",
    high: "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
    medium: "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
    low: "border-slate-300 bg-slate-50 dark:bg-slate-950/20",
  };
  return colors[priority] || colors.medium;
};

const getPriorityBadge = (priority: string) => {
  const badges: Record<string, any> = {
    urgent: { variant: "destructive" as const, icon: AlertCircle, label: "Urgent" },
    high: { variant: "default" as const, class: "bg-orange-500 hover:bg-orange-600 text-white", label: "High" },
    medium: { variant: "default" as const, class: "bg-blue-500 hover:bg-blue-600 text-white", label: "Medium" },
    low: { variant: "secondary" as const, label: "Low" },
  };
  return badges[priority] || badges.medium;
};

const getFilteredTasks = (columnId: string) => {
  const columnTasks = tasks.value[columnId as keyof typeof tasks.value] || [];
  
  return columnTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesAssignee = !selectedAssignee.value || task.assigneeId === selectedAssignee.value;
    const matchesFilter = selectedFilter.value === "all" ||
                         (selectedFilter.value === "urgent" && task.priority === "urgent");
    
    return matchesSearch && matchesAssignee && matchesFilter;
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
    const targetColumn = tasks.value[targetColumnId as keyof typeof tasks.value];
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

const openEditTask = (columnId: string, taskId: number) => {
  const column = tasks.value[columnId as keyof typeof tasks.value];
  const task = column.find((t) => t.id === taskId);
  if (task) {
    editingTask.value = { ...task, columnId };
    showEditTaskDialog.value = true;
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
  showEditTaskDialog.value = false;
  editingTask.value = null;
};

const createTask = () => {
  showCreateTaskDialog.value = false;
};

const totalTasks = computed(() => {
  return Object.values(tasks.value).reduce((sum, col) => sum + col.length, 0);
});

const inProgressTasks = computed(() => tasks.value["in-progress"].length);

const completedTasks = computed(() => tasks.value.completed.length);

const completionRate = computed(() => {
  return totalTasks.value > 0 ? Math.round((completedTasks.value / totalTasks.value) * 100) : 0;
});

const allTasks = computed(() => {
  const result: Array<any> = [];
  Object.entries(tasks.value).forEach(([columnId, columnTasks]) => {
    columnTasks.forEach(task => {
      result.push({ ...task, columnId });
    });
  });
  return result.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesAssignee = !selectedAssignee.value || task.assigneeId === selectedAssignee.value;
    const matchesFilter = selectedFilter.value === "all" ||
                         (selectedFilter.value === "urgent" && task.priority === "urgent");
    return matchesSearch && matchesAssignee && matchesFilter;
  });
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Task Management</h1>
        <p class="text-muted-foreground mt-1">Organize and track your team's work</p>
      </div>
      <Dialog v-model:open="showCreateTaskDialog">
        <DialogTrigger as-child>
          <Button class="gap-2">
            <Plus class="h-4 w-4" />
            Create Task
          </Button>
        </DialogTrigger>
        <DialogContent class="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your board</DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="space-y-2">
              <Label for="title">Task Title</Label>
              <Input id="title" placeholder="Enter task title" />
            </div>
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Textarea id="description" placeholder="Describe the task..." rows="3" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="assignee">Assign To</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="member in teamMembers" :key="member.id" :value="member.id">
                      <div class="flex items-center gap-2">
                        <Avatar class="h-5 w-5">
                          <AvatarImage :src="member.photo" />
                          <AvatarFallback class="text-xs">{{ getInitials(member.name) }}</AvatarFallback>
                        </Avatar>
                        {{ member.name }}
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
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="category">Category</Label>
                <Input id="category" placeholder="e.g., Reports" />
              </div>
              <div class="space-y-2">
                <Label for="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" />
              </div>
            </div>
            <div class="flex justify-end gap-3">
              <Button variant="outline" @click="showCreateTaskDialog = false">Cancel</Button>
              <Button @click="createTask">Create Task</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <Card>
      <CardContent class="p-4">
        <div class="flex flex-col lg:flex-row items-center gap-4">
          <div class="relative flex-1 w-full">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input v-model="searchQuery" placeholder="Search tasks..." class="pl-10" />
          </div>
          <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Select v-model="selectedFilter">
              <SelectTrigger class="w-[140px]">
                <SelectValue placeholder="All Tasks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="urgent">Urgent Only</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" class="gap-2 min-w-[140px] justify-start">
                  <Users class="h-4 w-4" />
                  <span class="truncate">{{ selectedAssignee ? getAssignee(selectedAssignee).name : "Filter by Member" }}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-[240px] p-2" align="end">
                <Command>
                  <CommandInput placeholder="Search members..." />
                  <CommandList>
                    <CommandItem @click="selectedAssignee = null" :value="'all'">
                      <CheckCircle2 v-if="!selectedAssignee" class="mr-2 h-4 w-4" />
                      <div class="mr-2 h-4 w-4" v-else></div>
                      All Members
                    </CommandItem>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem v-for="member in teamMembers" :key="member.id" :value="member.id" @click="selectedAssignee = member.id">
                        <CheckCircle2 v-if="selectedAssignee === member.id" class="mr-2 h-4 w-4" />
                        <div class="mr-2 h-4 w-4" v-else></div>
                        <Avatar class="h-5 w-5 mr-2">
                          <AvatarImage :src="member.photo" />
                          <AvatarFallback class="text-xs">{{ getInitials(member.name) }}</AvatarFallback>
                        </Avatar>
                        <span>{{ member.name }}</span>
                        <span class="ml-auto text-xs text-muted-foreground">{{ member.role }}</span>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon" @click="() => { selectedFilter = 'all'; selectedAssignee = null; searchQuery = '' }">
              <Filter class="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" class="h-8 hidden lg:block" />
            <div class="flex border rounded-md">
              <Button variant="ghost" size="icon" :class="viewMode === 'kanban' && 'bg-muted'" @click="viewMode = 'kanban'">
                <LayoutGrid class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" :class="viewMode === 'list' && 'bg-muted'" @click="viewMode = 'list'">
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
          <Card :class="['transition-all', dragOverColumn === column.id && 'ring-2 ring-primary ring-offset-2 ring-offset-background']">
            <CardContent class="p-4">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <div :class="['w-2 h-2 rounded-full', column.color]"></div>
                  <h3 class="font-semibold text-sm">{{ column.title }}</h3>
                  <Badge variant="secondary" class="text-xs font-normal">{{ getFilteredColumnCount(column.id) }}</Badge>
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
                      <Badge :variant="getPriorityBadge(task.priority).variant" :class="getPriorityBadge(task.priority).class" class="text-[10px] font-medium uppercase px-1.5 py-0.5">
                        {{ task.priority }}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button variant="ghost" size="icon" class="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical class="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem @click="openEditTask(column.id, task.id)">
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
                    <h4 class="font-medium text-sm mb-1 line-clamp-2">{{ task.title }}</h4>
                    <p class="text-xs text-muted-foreground mb-3 line-clamp-2">{{ task.description }}</p>
                    <div class="flex items-center justify-between pt-2 border-t">
                      <div class="flex items-center gap-3 text-xs text-muted-foreground">
                        <div class="flex items-center gap-1">
                          <Calendar class="h-3 w-3" />
                          <span>{{ task.dueDate }}</span>
                        </div>
                        <div v-if="task.comments > 0" class="flex items-center gap-1">
                          <MessageSquare class="h-3 w-3" />
                          <span>{{ task.comments }}</span>
                        </div>
                        <div v-if="task.attachments > 0" class="flex items-center gap-1">
                          <Paperclip class="h-3 w-3" />
                          <span>{{ task.attachments }}</span>
                        </div>
                      </div>
                      <Popover>
                        <PopoverTrigger as-child>
                          <Button variant="ghost" size="icon" class="h-7 w-7 p-0 rounded-full">
                            <Avatar class="h-6 w-6">
                              <AvatarImage :src="getAssignee(task.assigneeId).photo" />
                              <AvatarFallback class="text-[10px] bg-primary/10 text-primary">{{ getInitials(getAssignee(task.assigneeId).name) }}</AvatarFallback>
                            </Avatar>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-[200px] p-2" align="end">
                          <div class="text-xs font-medium mb-2 px-2 text-muted-foreground">Assign to:</div>
                          <Command>
                            <CommandList>
                              <CommandItem v-for="member in teamMembers" :key="member.id" :value="member.id" @click="assignTask(column.id, task.id, member.id)">
                                <CheckCircle2 v-if="task.assigneeId === member.id" class="mr-2 h-3.5 w-3.5" />
                                <div class="mr-2 h-3.5 w-3.5" v-else></div>
                                <Avatar class="h-5 w-5 mr-2">
                                  <AvatarImage :src="member.photo" />
                                  <AvatarFallback class="text-[10px]">{{ getInitials(member.name) }}</AvatarFallback>
                                </Avatar>
                                <span class="text-sm">{{ member.name }}</span>
                              </CommandItem>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div v-if="task.subtasks.total > 0" class="mt-3">
                      <div class="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span class="font-medium">{{ task.subtasks.completed }}/{{ task.subtasks.total }}</span>
                      </div>
                      <div class="w-full bg-muted/50 rounded-full h-1">
                        <div class="h-1 rounded-full transition-all" :class="task.subtasks.completed === task.subtasks.total ? 'bg-emerald-500' : 'bg-primary'" :style="{ width: `${(task.subtasks.completed / task.subtasks.total) * 100}%` }"></div>
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
              <TableHead>Priority</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="task in allTasks" :key="task.id" class="hover:bg-muted/50">
              <TableCell>
                <div>
                  <p class="text-sm font-medium">{{ task.title }}</p>
                  <p class="text-xs text-muted-foreground line-clamp-1">{{ task.description }}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge :variant="getPriorityBadge(task.priority).variant" :class="getPriorityBadge(task.priority).class">{{ task.priority }}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{{ task.category }}</Badge>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <Avatar class="h-6 w-6">
                    <AvatarImage :src="getAssignee(task.assigneeId).photo" />
                    <AvatarFallback class="text-[10px]">{{ getInitials(getAssignee(task.assigneeId).name) }}</AvatarFallback>
                  </Avatar>
                  <span class="text-sm">{{ getAssignee(task.assigneeId).name }}</span>
                </div>
              </TableCell>
              <TableCell class="text-sm text-muted-foreground">{{ task.dueDate }}</TableCell>
              <TableCell>
                <Badge class="bg-blue-100 text-blue-700 hover:bg-blue-100">{{ columns.find(c => c.id === task.columnId)?.title }}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-8 w-8">
                      <MoreVertical class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="openEditTask(task.columnId, task.id)">
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
            <div class="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
              <LayoutGrid class="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <p class="text-2xl font-bold">{{ totalTasks }}</p>
          <p class="text-xs text-muted-foreground mt-1">Across all boards</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-muted-foreground">In Progress</p>
            <div class="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Clock class="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ inProgressTasks }}</p>
          <p class="text-xs text-muted-foreground mt-1">Active tasks</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-muted-foreground">Completed</p>
            <div class="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle2 class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ completedTasks }}</p>
          <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{{ completionRate }}% completion rate</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-5">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-muted-foreground">Team Members</p>
            <div class="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Users class="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ teamMembers.length }}</p>
          <p class="text-xs text-muted-foreground mt-1">Active contributors</p>
        </CardContent>
      </Card>
    </div>

    <Dialog v-model:open="showEditTaskDialog">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update task details</DialogDescription>
        </DialogHeader>
        <div v-if="editingTask" class="grid gap-4 py-4">
          <div class="space-y-2">
            <Label for="edit-title">Task Title</Label>
            <Input id="edit-title" v-model="editingTask.title" />
          </div>
          <div class="space-y-2">
            <Label for="edit-description">Description</Label>
            <Textarea id="edit-description" v-model="editingTask.description" rows="3" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-assignee">Assign To</Label>
              <Select v-model="editingTask.assigneeId">
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="member in teamMembers" :key="member.id" :value="member.id">
                    {{ member.name }}
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
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-category">Category</Label>
              <Input id="edit-category" v-model="editingTask.category" />
            </div>
            <div class="space-y-2">
              <Label for="edit-dueDate">Due Date</Label>
              <Input id="edit-dueDate" v-model="editingTask.dueDate" type="date" />
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <Button variant="outline" @click="showEditTaskDialog = false">Cancel</Button>
            <Button @click="saveTask">Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
