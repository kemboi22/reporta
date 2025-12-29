<script setup lang="ts">
import {
  CheckSquare,
  Calendar,
  Clock,
  Paperclip,
  MessageSquare,
  MoreVertical,
  Play,
  CheckCircle2,
  Timer,
  ArrowLeft,
  Edit2,
  Trash2,
  UserPlus,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const taskId = route.params.id as string;

const showAddComment = ref(false);
const showAddChecklist = ref(false);
const showAddTimeLog = ref(false);
const showAssignDialog = ref(false);
const showEditDialog = ref(false);

const newComment = ref("");
const newChecklistItem = ref("");
const newAssignee = ref("");
const editingData = ref<any>(null);

const { data: task, pending } = await useLazyFetch(
  `/api/${organizationId}/tasks/${taskId}`,
  {
    key: `task-${taskId}`,
  },
);

const { data: usersData } = await useLazyFetch(`/api/${organizationId}/staff`);

const comments = computed(() => task.value?.comments || []);
const checklist = computed(() => task.value?.checklist || []);
const timeLogs = computed(() => task.value?.timeLogs || []);
const assignees = computed(() => task.value?.assignees || []);

const users = computed(() => {
  return (usersData.value || []).map((u: any) => ({
    id: u.id,
    name: u.firstName + " " + u.lastName,
    avatar: u.avatar,
    email: u.email,
  }));
});

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    TODO: "bg-blue-500",
    IN_PROGRESS: "bg-purple-500",
    COMPLETED: "bg-emerald-500",
    CANCELLED: "bg-red-500",
  };
  return colors[status] || "bg-gray-500";
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

const checklistProgress = computed(() => {
  const total = checklist.value.length;
  const completed = checklist.value.filter((c: any) => c.isCompleted).length;
  return total === 0 ? 0 : Math.round((completed / total) * 100);
});

const totalTimeLogged = computed(() => {
  return timeLogs.value.reduce(
    (sum: number, log: any) => sum + (log.duration || 0),
    0,
  );
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString();
};

const refreshData = async () => {
  await refreshNuxtData(`task-${taskId}`);
};

const addComment = async () => {
  if (!newComment.value.trim()) return;
  try {
    await $fetch(`/api/${organizationId}/tasks/${taskId}/comments`, {
      method: "POST",
      body: { content: newComment.value },
    });
    newComment.value = "";
    showAddComment.value = false;
    await refreshData();
  } catch (error) {
    console.error("Failed to add comment:", error);
  }
};

const addChecklistItem = async () => {
  if (!newChecklistItem.value.trim()) return;
  try {
    await $fetch(`/api/${organizationId}/tasks/${taskId}/checklist`, {
      method: "POST",
      body: { title: newChecklistItem.value },
    });
    newChecklistItem.value = "";
    showAddChecklist.value = false;
    await refreshData();
  } catch (error) {
    console.error("Failed to add checklist item:", error);
  }
};

const toggleChecklistItem = async (item: any) => {
  try {
    await $fetch(
      `/api/${organizationId}/tasks/${taskId}/checklist/${item.id}`,
      {
        method: "PUT",
        body: { isCompleted: !item.isCompleted },
      },
    );
    await refreshData();
  } catch (error) {
    console.error("Failed to update checklist item:", error);
  }
};

const startTimer = async () => {
  try {
    await $fetch(`/api/${organizationId}/tasks/${taskId}/timelogs`, {
      method: "POST",
      body: {
        description: "Time tracking",
        startTime: new Date().toISOString(),
      },
    });
    await refreshData();
  } catch (error) {
    console.error("Failed to start timer:", error);
  }
};

const stopTimer = async (log: any) => {
  try {
    await $fetch(`/api/${organizationId}/tasks/${taskId}/timelogs/${log.id}`, {
      method: "PUT",
      body: {
        endTime: new Date().toISOString(),
      },
    });
    await refreshData();
  } catch (error) {
    console.error("Failed to stop timer:", error);
  }
};

const updateStatus = async (status: string) => {
  try {
    await $fetch(`/api/${organizationId}/tasks/${taskId}`, {
      method: "PUT",
      body: { status },
    });
    await refreshData();
  } catch (error) {
    console.error("Failed to update status:", error);
  }
};

const deleteTask = async () => {
  if (!confirm("Are you sure you want to delete this task?")) return;
  try {
    await $fetch(`/api/${organizationId}/tasks/${taskId}`, {
      method: "DELETE",
    });
    await navigateTo(`/${organizationId}/tasks`);
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
};

const openEditDialog = () => {
  editingData.value = { ...task.value };
  showEditDialog.value = true;
};

const saveEdit = async () => {
  if (!editingData.value) return;
  try {
    const { id, assignees, comments, checklist, timeLogs, ...updates } =
      editingData.value;
    await $fetch(`/api/${organizationId}/tasks/${taskId}`, {
      method: "PUT",
      body: updates,
    });
    showEditDialog.value = false;
    editingData.value = null;
    await refreshData();
  } catch (error) {
    console.error("Failed to save task:", error);
  }
};

const assignUser = async () => {
  if (!newAssignee.value) return;
  try {
    await $fetch(`/api/${organizationId}/tasks/${taskId}`, {
      method: "PUT",
      body: { assigneeIds: [newAssignee.value] },
    });
    showAssignDialog.value = false;
    newAssignee.value = "";
    await refreshData();
  } catch (error) {
    console.error("Failed to assign user:", error);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div v-if="pending" class="space-y-6">
      <div class="h-8 bg-muted rounded animate-pulse" />
      <div class="h-32 bg-muted rounded animate-pulse" />
      <div class="grid lg:grid-cols-3 gap-6">
        <div
          v-for="i in 3"
          :key="i"
          class="h-64 bg-muted rounded animate-pulse"
        />
      </div>
    </div>

    <div v-else-if="task" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <Badge :class="[getStatusColor(task.status), 'text-white']">
              {{ task.status?.replace("_", "-")?.toLowerCase() }}
            </Badge>
            <Badge variant="outline" :class="[getPriorityColor(task.priority)]">
              {{ task.priority }}
            </Badge>
          </div>
          <h1 class="text-3xl font-bold text-foreground">{{ task.title }}</h1>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink :to="`/${organizationId}/tasks`">
            <Button variant="outline" size="sm">
              <ArrowLeft class="h-4 w-4 mr-2" />
              Back
            </Button>
          </NuxtLink>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline">
                <MoreVertical class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="openEditDialog">
                <Edit2 class="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem @click="showAssignDialog = true">
                <UserPlus class="h-4 w-4 mr-2" />
                Assign
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="task.status !== 'COMPLETED'"
                @click="updateStatus('COMPLETED')"
              >
                <CheckCircle2 class="h-4 w-4 mr-2" />
                Mark Complete
              </DropdownMenuItem>
              <DropdownMenuItem class="text-destructive" @click="deleteTask">
                <Trash2 class="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <Card class="border-border">
            <CardContent class="p-6">
              <h2 class="font-semibold mb-3">Description</h2>
              <p class="text-muted-foreground">
                {{ task.description || "No description" }}
              </p>
              <div class="flex flex-wrap gap-2 mt-4">
                <Badge
                  v-for="tag in task.tags || []"
                  :key="tag"
                  variant="secondary"
                >
                  {{ tag }}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Tabs default-value="checklist" class="space-y-6">
            <TabsList>
              <TabsTrigger value="checklist"
                >Checklist ({{ checklist.length }})</TabsTrigger
              >
              <TabsTrigger value="comments"
                >Comments ({{ comments.length }})</TabsTrigger
              >
              <TabsTrigger value="attachments"
                >Attachments ({{ task.attachments?.length || 0 }})</TabsTrigger
              >
              <TabsTrigger value="timelogs"
                >Time Logs ({{ timeLogs.length }})</TabsTrigger
              >
            </TabsList>

            <TabsContent value="checklist" class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">Subtasks</h3>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-muted-foreground">
                    {{ checklistProgress }}% complete
                  </span>
                  <Dialog v-model:open="showAddChecklist">
                    <DialogTrigger as-child>
                      <Button size="sm">
                        <CheckSquare class="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Checklist Item</DialogTitle>
                      </DialogHeader>
                      <div class="space-y-4">
                        <div>
                          <Label>Item Title</Label>
                          <Input
                            v-model="newChecklistItem"
                            placeholder="Task item"
                          />
                        </div>
                        <Button @click="addChecklistItem" class="w-full"
                          >Add</Button
                        >
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Card class="border-border">
                <CardContent class="p-6 space-y-3">
                  <div
                    v-if="checklist.length === 0"
                    class="text-center text-muted-foreground py-4"
                  >
                    No checklist items yet
                  </div>
                  <div
                    v-for="item in checklist"
                    :key="item.id"
                    class="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      :checked="item.isCompleted"
                      @update:checked="toggleChecklistItem(item)"
                    />
                    <span
                      :class="{
                        'line-through text-muted-foreground': item.isCompleted,
                      }"
                    >
                      {{ item.title }}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">Comments</h3>
                <Dialog v-model:open="showAddComment">
                  <DialogTrigger as-child>
                    <Button size="sm">
                      <MessageSquare class="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Comment</DialogTitle>
                    </DialogHeader>
                    <div class="space-y-4">
                      <div>
                        <Label>Comment</Label>
                        <Textarea
                          v-model="newComment"
                          placeholder="Write a comment..."
                          rows="4"
                        />
                      </div>
                      <Button @click="addComment" class="w-full">Post</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div class="space-y-4">
                <div
                  v-if="comments.length === 0"
                  class="text-center text-muted-foreground py-4"
                >
                  No comments yet
                </div>
                <Card
                  v-for="comment in comments"
                  :key="comment.id"
                  class="border-border"
                >
                  <CardContent class="p-6">
                    <div class="flex items-start gap-4">
                      <Avatar class="h-10 w-10">
                        <AvatarImage :src="comment.user?.avatar" />
                        <AvatarFallback>{{
                          getInitials(comment.user?.name || "")
                        }}</AvatarFallback>
                      </Avatar>
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                          <h4 class="font-semibold">
                            {{ comment.user?.name }}
                          </h4>
                          <span class="text-sm text-muted-foreground">
                            {{ formatDateTime(comment.createdAt) }}
                          </span>
                        </div>
                        <p class="text-sm text-foreground">
                          {{ comment.content }}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical class="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attachments" class="space-y-4">
              <h3 class="font-semibold">Attachments</h3>
              <div
                v-if="!task.attachments || task.attachments.length === 0"
                class="text-center text-muted-foreground py-4"
              >
                No attachments
              </div>
              <div class="grid md:grid-cols-2 gap-4">
                <div
                  v-for="attachment in task.attachments || []"
                  :key="attachment"
                  class="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div class="flex items-start gap-4">
                    <div
                      class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
                    >
                      <Paperclip class="h-6 w-6 text-primary" />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium">{{ attachment }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timelogs" class="space-y-4">
              <h3 class="font-semibold">Time Tracking</h3>
              <div
                v-if="timeLogs.length === 0"
                class="text-center text-muted-foreground py-4"
              >
                No time logs yet
              </div>
              <div class="space-y-3">
                <div
                  v-for="log in timeLogs"
                  :key="log.id"
                  class="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div>
                    <div class="font-medium">
                      {{ log.description || "Time log" }}
                    </div>
                    <div class="text-sm text-muted-foreground">
                      {{ formatDate(log.startTime) }} -
                      {{ log.endTime ? formatDate(log.endTime) : "Running" }}
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-semibold">{{ log.duration || 0 }}h</span>
                    <Button
                      v-if="!log.endTime"
                      variant="ghost"
                      size="icon"
                      @click="stopTimer(log)"
                    >
                      <Timer class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                v-if="task.status === 'IN_PROGRESS'"
                @click="startTimer"
                class="w-full mt-4"
              >
                <Play class="h-4 w-4 mr-2" />
                Start Timer
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        <div class="space-y-6">
          <Card class="border-border">
            <CardHeader>
              <div class="flex items-center justify-between">
                <CardTitle>Assignees</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="showAssignDialog = true"
                >
                  <UserPlus class="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                v-if="assignees.length === 0"
                class="text-center text-muted-foreground py-4"
              >
                No assignees
              </div>
              <div class="space-y-3">
                <div
                  v-for="assignee in assignees"
                  :key="assignee.id"
                  class="flex items-center gap-3"
                >
                  <Avatar class="h-10 w-10">
                    <AvatarImage :src="assignee.user?.avatar" />
                    <AvatarFallback>{{
                      getInitials(assignee.user?.name || "")
                    }}</AvatarFallback>
                  </Avatar>
                  <div class="flex-1">
                    <span class="font-medium">{{ assignee.user?.name }}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="border-border">
            <CardHeader>
              <CardTitle>Due Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center gap-3">
                <Calendar class="h-5 w-5 text-muted-foreground" />
                <div v-if="task.dueDate">
                  <p class="font-semibold">
                    {{ formatDate(task.dueDate) }}
                  </p>
                </div>
                <p v-else class="text-muted-foreground">No due date</p>
              </div>
            </CardContent>
          </Card>

          <Card class="border-border">
            <CardHeader>
              <CardTitle>Time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Clock class="h-5 w-5 text-muted-foreground" />
                    <span class="text-sm">Estimated</span>
                  </div>
                  <span class="font-semibold"
                    >{{ task.estimatedHours || 0 }}h</span
                  >
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Timer class="h-5 w-5 text-muted-foreground" />
                    <span class="text-sm">Logged</span>
                  </div>
                  <span class="font-semibold">{{ totalTimeLogged }}h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="border-border">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <Button
                v-if="task.status !== 'COMPLETED'"
                variant="outline"
                class="w-full"
                @click="updateStatus('COMPLETED')"
              >
                <CheckCircle2 class="h-4 w-4 mr-2" />
                Mark as Completed
              </Button>
              <Button
                v-if="task.status === 'COMPLETED'"
                variant="outline"
                class="w-full"
                @click="updateStatus('TODO')"
              >
                <Play class="h-4 w-4 mr-2" />
                Reopen Task
              </Button>
              <Button
                v-if="task.status !== 'TODO'"
                variant="outline"
                class="w-full"
                @click="updateStatus('TODO')"
              >
                Move to TODO
              </Button>
              <Button variant="outline" class="w-full" @click="openEditDialog">
                <Edit2 class="h-4 w-4 mr-2" />
                Edit Task
              </Button>
              <Button
                variant="outline"
                class="w-full text-destructive"
                @click="deleteTask"
              >
                <Trash2 class="h-4 w-4 mr-2" />
                Delete Task
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <Dialog v-model:open="showEditDialog">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update task details</DialogDescription>
        </DialogHeader>
        <div v-if="editingData" class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="edit-title">Title</Label>
            <Input id="edit-title" v-model="editingData.title" />
          </div>
          <div class="space-y-2">
            <Label for="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              v-model="editingData.description"
              rows="3"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-priority">Priority</Label>
              <Select v-model="editingData.priority">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="edit-status">Status</Label>
              <Select v-model="editingData.status">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="space-y-2">
            <Label for="edit-dueDate">Due Date</Label>
            <Input
              id="edit-dueDate"
              v-model="editingData.dueDate"
              type="date"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <Button variant="outline" @click="showEditDialog = false"
            >Cancel</Button
          >
          <Button @click="saveEdit">Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showAssignDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription
            >Assign this task to a team member</DialogDescription
          >
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label>Select Person</Label>
            <Select v-model="newAssignee">
              <SelectTrigger>
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="null">Unassigned</SelectItem>
                <SelectItem
                  v-for="user in users"
                  :key="user.id"
                  :value="user.id"
                >
                  <div class="flex items-center gap-2">
                    <Avatar class="h-6 w-6">
                      <AvatarImage :src="user.avatar" />
                      <AvatarFallback class="text-[10px]">
                        {{ getInitials(user.name) }}
                      </AvatarFallback>
                    </Avatar>
                    {{ user.name }}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <Button variant="outline" @click="showAssignDialog = false"
            >Cancel</Button
          >
          <Button @click="assignUser">Assign</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
