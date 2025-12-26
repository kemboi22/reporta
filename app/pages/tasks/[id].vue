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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();

const task = ref({
  id: route.params.id,
  title: "Implement user authentication flow",
  description:
    "Create login, register, and password reset functionality with JWT tokens",
  status: "IN_PROGRESS" as const,
  priority: "HIGH" as const,
  dueDate: new Date("2024-03-15"),
  estimatedHours: 24,
  actualHours: 12,
  tags: ["authentication", "security", "backend"],
  attachments: [
    { name: "auth-design.png", size: 245, url: "/placeholder.jpg" },
    { name: "api-spec.pdf", size: 1024, url: "/placeholder.pdf" },
  ],
});

const assignees = ref([
  { id: "1", name: "Alice", avatar: "/placeholder-user.jpg" },
  { id: "2", name: "Bob", avatar: "/placeholder-user.jpg" },
]);

const checklist = ref([
  { id: "1", title: "Create login form component", completed: true },
  { id: "2", title: "Implement register endpoint", completed: true },
  { id: "3", title: "Add password reset flow", completed: false },
  { id: "4", title: "Add JWT token validation", completed: false },
  { id: "5", title: "Write unit tests", completed: false },
]);

const comments = ref([
  {
    id: "1",
    userId: "1",
    userName: "Alice",
    userAvatar: "/placeholder-user.jpg",
    content:
      "Started working on the login form. Should be ready for review tomorrow.",
    createdAt: new Date("2024-02-20T10:30:00"),
  },
  {
    id: "2",
    userId: "2",
    userName: "Bob",
    userAvatar: "/placeholder-user.jpg",
    content:
      "Great progress! Don't forget to add proper error handling for invalid credentials.",
    createdAt: new Date("2024-02-20T11:15:00"),
  },
]);

const timeLogs = ref([
  {
    id: "1",
    userId: "1",
    userName: "Alice",
    description: "Initial setup and form design",
    startTime: new Date("2024-02-19T09:00:00"),
    endTime: new Date("2024-02-19T12:00:00"),
    duration: 3,
  },
  {
    id: "2",
    userId: "1",
    userName: "Alice",
    description: "API integration",
    startTime: new Date("2024-02-20T09:00:00"),
    endTime: new Date("2024-02-20T11:00:00"),
    duration: 2,
  },
]);

const showAddComment = ref(false);
const showAddChecklist = ref(false);
const showAddTimeLog = ref(false);

const newComment = ref("");
const newChecklistItem = ref("");

const addComment = () => {
  console.log("Adding comment:", newComment.value);
  showAddComment.value = false;
};

const addChecklistItem = () => {
  console.log("Adding checklist item:", newChecklistItem.value);
  showAddChecklist.value = false;
};

const toggleChecklistItem = (id: string) => {
  const item = checklist.value.find((c) => c.id === id);
  if (item) {
    item.completed = !item.completed;
  }
};

const startTimer = () => {
  console.log("Starting timer for task");
};

const stopTimer = () => {
  console.log("Stopping timer for task");
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
  const completed = checklist.value.filter((c) => c.completed).length;
  return total === 0 ? 0 : Math.round((completed / total) * 100);
});

const totalTimeLogged = computed(() => {
  return timeLogs.value.reduce((sum, log) => sum + (log.duration || 0), 0);
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <Badge :class="[getStatusColor(task.status), 'text-white']">
            {{ task.status }}
          </Badge>
          <Badge variant="outline" :class="[getPriorityColor(task.priority)]">
            {{ task.priority }}
          </Badge>
        </div>
        <h1 class="text-3xl font-bold text-foreground">{{ task.title }}</h1>
      </div>
      <div class="flex items-center gap-3">
        <Button
          variant="outline"
          @click="stopTimer"
          v-if="task.status === 'IN_PROGRESS'"
        >
          <Timer class="h-4 w-4 mr-2" />
          Stop Timer
        </Button>
        <Button v-else @click="startTimer">
          <Play class="h-4 w-4 mr-2" />
          Start Timer
        </Button>
        <Button variant="outline">More</Button>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <Card class="border-border">
          <CardContent class="p-6">
            <h2 class="font-semibold mb-3">Description</h2>
            <p class="text-muted-foreground">{{ task.description }}</p>
            <div class="flex flex-wrap gap-2 mt-4">
              <Badge v-for="tag in task.tags" :key="tag" variant="secondary">
                {{ tag }}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs default-value="checklist" class="space-y-6">
          <TabsList>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="comments"
              >Comments ({{ comments.length }})</TabsTrigger
            >
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Subtasks</h3>
              <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground"
                  >{{ checklistProgress }}% complete</span
                >
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
                  v-for="item in checklist"
                  :key="item.id"
                  class="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    :checked="item.completed"
                    @update:checked="toggleChecklistItem(item.id)"
                  />
                  <span
                    :class="{
                      'line-through text-muted-foreground': item.completed,
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
                      />
                    </div>
                    <Button @click="addComment" class="w-full">Post</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div class="space-y-4">
              <Card
                v-for="comment in comments"
                :key="comment.id"
                class="border-border"
              >
                <CardContent class="p-6">
                  <div class="flex items-start gap-4">
                    <Avatar class="h-10 w-10">
                      <AvatarImage :src="comment.userAvatar" />
                      <AvatarFallback>{{
                        comment.userName.charAt(0)
                      }}</AvatarFallback>
                    </Avatar>
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <h4 class="font-semibold">{{ comment.userName }}</h4>
                        <span class="text-sm text-muted-foreground">
                          {{ comment.createdAt.toLocaleString() }}
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
            <div class="grid md:grid-cols-2 gap-4">
              <Card
                v-for="attachment in task.attachments"
                :key="attachment.name"
                class="border-border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <CardContent class="p-6">
                  <div class="flex items-start gap-4">
                    <div
                      class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
                    >
                      <Paperclip class="h-6 w-6 text-primary" />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium">{{ attachment.name }}</h4>
                      <p class="text-sm text-muted-foreground">
                        {{ (attachment.size / 1024).toFixed(2) }} KB
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
        </Tabs>
      </div>

      <div class="space-y-6">
        <Card class="border-border">
          <CardHeader>
            <CardTitle>Assignees</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div
                v-for="assignee in assignees"
                :key="assignee.id"
                class="flex items-center gap-3"
              >
                <Avatar class="h-10 w-10">
                  <AvatarImage :src="assignee.avatar" />
                  <AvatarFallback>{{ assignee.name.charAt(0) }}</AvatarFallback>
                </Avatar>
                <span class="font-medium">{{ assignee.name }}</span>
              </div>
              <Button variant="ghost" class="w-full" size="sm">
                + Add Assignee
              </Button>
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
              <div>
                <p class="font-semibold">
                  {{ task.dueDate.toLocaleDateString() }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{
                    task.dueDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                </p>
              </div>
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
                <span class="font-semibold">{{ task.estimatedHours }}h</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <Timer class="h-5 w-5 text-muted-foreground" />
                  <span class="text-sm">Logged</span>
                </div>
                <span class="font-semibold">{{ totalTimeLogged }}h</span>
              </div>
              <div class="pt-4 border-t border-border">
                <p class="text-sm text-muted-foreground mb-2">Time Logs</p>
                <div class="space-y-2">
                  <div
                    v-for="log in timeLogs"
                    :key="log.id"
                    class="p-2 rounded bg-muted/50 text-sm"
                  >
                    <div class="font-medium">{{ log.userName }}</div>
                    <div class="text-muted-foreground">
                      {{ log.description }}
                    </div>
                    <div class="text-muted-foreground">{{ log.duration }}h</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <Button variant="outline" class="w-full" size="sm">
              Mark as Completed
            </Button>
            <Button variant="outline" class="w-full" size="sm">
              Move to TODO
            </Button>
            <Button variant="outline" class="w-full text-destructive" size="sm">
              Delete Task
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
