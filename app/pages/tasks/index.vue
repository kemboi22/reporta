<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Calendar,
  MessageSquare,
  Paperclip,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const viewMode = ref<"kanban" | "list">("kanban");
const showCreateTaskDialog = ref(false);
const selectedFilter = ref("all");

const columns = [
  { id: "backlog", title: "Backlog", color: "bg-muted", count: 8 },
  { id: "todo", title: "To Do", color: "bg-blue-100", count: 12 },
  { id: "in-progress", title: "In Progress", color: "bg-purple-100", count: 5 },
  { id: "review", title: "Review", color: "bg-amber-100", count: 3 },
  { id: "completed", title: "Completed", color: "bg-emerald-100", count: 24 },
];

const tasks = {
  backlog: [
    {
      id: 1,
      title: "Update medication inventory system",
      description: "Review and update the medication tracking system",
      priority: "medium",
      category: "Pharmacy",
      assignee: { name: "Emma Davis", photo: "/placeholder-user.jpg" },
      dueDate: "Dec 30",
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
      assignee: { name: "Robert Taylor", photo: "/placeholder-user.jpg" },
      dueDate: "Jan 5",
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
      assignee: { name: "Emma Davis", photo: "/placeholder-user.jpg" },
      dueDate: "Dec 25",
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
      assignee: { name: "Sarah Johnson", photo: "/placeholder-user.jpg" },
      dueDate: "Dec 26",
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
      assignee: { name: "Mike Chen", photo: "/placeholder-user.jpg" },
      dueDate: "Dec 24",
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
      assignee: { name: "James Wilson", photo: "/placeholder-user.jpg" },
      dueDate: "Dec 27",
      comments: 4,
      attachments: 2,
      subtasks: { completed: 4, total: 4 },
    },
  ],
  completed: [],
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    urgent: "border-l-4 border-l-red-500",
    high: "border-l-4 border-l-orange-500",
    medium: "border-l-4 border-l-blue-500",
    low: "border-l-4 border-l-slate-400",
  };
  return colors[priority] || colors.medium;
};

const getPriorityBadge = (priority: string) => {
  const badges: Record<string, string> = {
    urgent: "bg-red-100 text-red-700 hover:bg-red-100",
    high: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    medium: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    low: "bg-muted text-foreground hover:bg-muted",
  };
  return badges[priority] || badges.medium;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

const draggedTask = ref<{ columnId: string; taskId: number } | null>(null);

const onTaskDragStart = (columnId: string, taskId: number) => {
  draggedTask.value = { columnId, taskId };
};

const onColumnDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const onColumnDrop = (targetColumnId: string) => {
  if (!draggedTask.value) return;

  const { columnId: sourceColumnId, taskId } = draggedTask.value;

  if (sourceColumnId === targetColumnId) {
    draggedTask.value = null;
    return;
  }

  // Find the task in source column
  const sourceColumn = tasks[sourceColumnId as keyof typeof tasks];
  const taskIndex = sourceColumn.findIndex((t) => t.id === taskId);

  if (taskIndex !== -1) {
    // Remove from source
    const [task] = sourceColumn.splice(taskIndex, 1);
    // Add to target
    const targetColumn = tasks[targetColumnId as keyof typeof tasks];
    targetColumn.push(task);
  }

  draggedTask.value = null;
};
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-foreground">Task Management</h1>
          <p class="text-muted-foreground mt-1">Organize and track your team's work</p>
        </div>

        <Dialog v-model:open="showCreateTaskDialog">
          <DialogTrigger as-child>
            <Button class="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus class="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription
                >Add a new task to your board</DialogDescription
              >
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <div class="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" placeholder="Enter task title" />
              </div>
              <div class="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the task..."
                  rows="3"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label htmlFor="assignee">Assign To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="mike">Mike Chen</SelectItem>
                      <SelectItem value="emma">Emma Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
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
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="e.g., Reports" />
                </div>
                <div class="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>
              <div class="flex justify-end gap-3">
                <Button variant="outline" @click="showCreateTaskDialog = false"
                  >Cancel</Button
                >
                <Button class="bg-blue-600 hover:bg-blue-700 text-white"
                  >Create Task</Button
                >
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <!-- Toolbar -->
      <Card class="border-border">
        <CardContent class="p-4">
          <div class="flex flex-col md:flex-row items-center gap-4">
            <!-- Search -->
            <div class="relative flex-1 w-full">
              <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input placeholder="Search tasks..." class="pl-10" />
            </div>

            <!-- Filters -->
            <div class="flex gap-2 w-full md:w-auto">
              <Select v-model="selectedFilter">
                <SelectTrigger class="w-40">
                  <SelectValue placeholder="All Tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="my-tasks">My Tasks</SelectItem>
                  <SelectItem value="urgent">Urgent Only</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter class="h-4 w-4" />
              </Button>

              <!-- View Toggle -->
              <div class="flex border border-border rounded-lg">
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

      <!-- Kanban Board -->
      <div v-if="viewMode === 'kanban'" class="overflow-x-auto pb-4">
        <div class="flex gap-6 min-w-max">
          <div
            v-for="column in columns"
            :key="column.id"
            class="w-80 flex-shrink-0"
            @dragover="onColumnDragOver"
            @drop="onColumnDrop(column.id)"
          >
            <Card class="border-border">
              <CardContent class="p-4">
                <!-- Column Header -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <div
                      :class="[
                        'w-3 h-3 rounded-full',
                        column.color
                          .replace('bg-', 'bg-')
                          .replace('100', '500'),
                      ]"
                    ></div>
                    <h3 class="font-semibold text-foreground">
                      {{ column.title }}
                    </h3>
                    <Badge variant="secondary" class="text-xs">{{
                      column.count
                    }}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" class="h-8 w-8">
                    <Plus class="h-4 w-4" />
                  </Button>
                </div>

                <!-- Tasks -->
                <div
                  class="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto"
                >
                  <Card
                    v-for="task in tasks[column.id as keyof typeof tasks]"
                    :key="task.id"
                    :class="[
                      'border-border hover:shadow-md transition-all cursor-move',
                      getPriorityColor(task.priority),
                    ]"
                    draggable="true"
                    @dragstart="onTaskDragStart(column.id, task.id)"
                  >
                    <CardContent class="p-4">
                      <!-- Priority Badge -->
                      <div class="flex items-start justify-between mb-3">
                        <Badge
                          :class="getPriorityBadge(task.priority)"
                          class="text-xs uppercase"
                        >
                          {{ task.priority }}
                        </Badge>
                        <Badge variant="secondary" class="text-xs">{{
                          task.category
                        }}</Badge>
                      </div>

                      <!-- Task Title -->
                       <h4 class="font-medium text-foreground mb-2 line-clamp-2">
                         {{ task.title }}
                       </h4>
                       <p class="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {{ task.description }}
                      </p>

                      <!-- Task Meta -->
                      <div
                        class="flex items-center justify-between pt-3 border-t border-border"
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

                        <Avatar class="h-7 w-7">
                          <AvatarImage :src="task.assignee.photo" />
                          <AvatarFallback
                            class="bg-blue-100 text-blue-700 text-xs"
                          >
                            {{ getInitials(task.assignee.name) }}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <!-- Subtasks Progress -->
                      <div
                        v-if="task.subtasks.total > 0"
                        class="mt-3 pt-3 border-t border-border"
                      >
                        <div
                           class="flex items-center justify-between text-xs text-muted-foreground mb-2"
                        >
                          <span>Subtasks</span>
                          <span class="font-medium"
                            >{{ task.subtasks.completed }}/{{
                              task.subtasks.total
                            }}</span
                          >
                        </div>
                        <div class="w-full bg-muted rounded-full h-1.5">
                          <div
                            class="bg-blue-600 h-1.5 rounded-full transition-all"
                            :style="{
                              width: `${(task.subtasks.completed / task.subtasks.total) * 100}%`,
                            }"
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <!-- List View -->
      <Card v-else class="border-border">
        <CardContent class="p-0">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-muted border-b border-border">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                  >
                    Task
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                  >
                    Priority
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                  >
                    Category
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                  >
                    Assignee
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                  >
                    Due Date
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-background divide-y divide-border">
                <tr class="hover:bg-muted transition-colors cursor-pointer">
                  <td class="px-6 py-4">
                    <div>
                      <p class="text-sm font-medium text-foreground">
                        Sample Task
                      </p>
                      <p class="text-sm text-muted-foreground">
                        Task description here
                      </p>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <Badge class="bg-red-100 text-red-700 hover:bg-red-100"
                      >Urgent</Badge
                    >
                  </td>
                  <td class="px-6 py-4">
                    <Badge variant="secondary">Reports</Badge>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <Avatar class="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback class="bg-blue-100 text-blue-700"
                          >SJ</AvatarFallback
                        >
                      </Avatar>
                      <span class="text-sm text-foreground">Sarah Johnson</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-muted-foreground">Dec 25</td>
                  <td class="px-6 py-4">
                    <Badge class="bg-blue-100 text-blue-700 hover:bg-blue-100"
                      >To Do</Badge
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Task Statistics -->
      <div class="grid md:grid-cols-4 gap-6">
        <Card class="border-border">
          <CardContent class="p-6">
            <p class="text-sm text-muted-foreground mb-1">Total Tasks</p>
            <p class="text-3xl font-bold text-foreground">52</p>
            <p class="text-sm text-muted-foreground mt-2">Across all boards</p>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardContent class="p-6">
            <p class="text-sm text-muted-foreground mb-1">In Progress</p>
            <p class="text-3xl font-bold text-purple-600">5</p>
            <p class="text-sm text-muted-foreground mt-2">Active tasks</p>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardContent class="p-6">
            <p class="text-sm text-muted-foreground mb-1">Completed</p>
            <p class="text-3xl font-bold text-emerald-600">24</p>
            <p class="text-sm text-emerald-600 mt-2">46% completion rate</p>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardContent class="p-6">
            <p class="text-sm text-muted-foreground mb-1">Overdue</p>
            <p class="text-3xl font-bold text-red-600">0</p>
            <p class="text-sm text-muted-foreground mt-2">Great work!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </NuxtLayout>
</template>
