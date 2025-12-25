<script setup lang="ts">
import { ref, computed } from "vue";
import { definePageMeta } from "#imports"; // Import definePageMeta from Nuxt
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckSquare,
  Clock,
  CheckCircle2,
  MessageSquare,
  FileText,
  AlertTriangle,
  UserPlus,
  Calendar,
  FolderOpen,
  AlertCircle,
  Filter,
  Trash2,
} from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const selectedTab = ref("all");
const selectedNotifications = ref<number[]>([]);

const notifications = ref([
  {
    id: 1,
    type: "task",
    icon: CheckSquare,
    title: "Sarah Johnson assigned you a task",
    description: "Complete Q4 Performance Review Reports",
    time: "5 minutes ago",
    unread: true,
    priority: "high",
  },
  {
    id: 2,
    type: "alert",
    icon: Clock,
    title: "Task due soon",
    description: "Employee Onboarding Checklist is due in 2 hours",
    time: "15 minutes ago",
    unread: true,
    priority: "urgent",
  },
  {
    id: 3,
    type: "task",
    icon: CheckCircle2,
    title: "Michael Chen completed a task",
    description: "Monthly Safety Inspection Report - Approved",
    time: "1 hour ago",
    unread: true,
    priority: "normal",
  },
  {
    id: 4,
    type: "comment",
    icon: MessageSquare,
    title: "Emma Wilson commented",
    description: "Added feedback on Marketing Campaign Analysis",
    time: "2 hours ago",
    unread: false,
    priority: "normal",
  },
  {
    id: 5,
    type: "report",
    icon: FileText,
    title: "Report due today",
    description: "Your Weekly Operations Summary is due by 5:00 PM",
    time: "3 hours ago",
    unread: false,
    priority: "high",
  },
  {
    id: 6,
    type: "alert",
    icon: AlertTriangle,
    title: "Staff clocked in late",
    description: "John Smith clocked in 25 minutes late",
    time: "4 hours ago",
    unread: false,
    priority: "normal",
  },
  {
    id: 7,
    type: "leave",
    icon: Calendar,
    title: "Leave request approved",
    description: "Your leave request for Dec 20-22 has been approved",
    time: "5 hours ago",
    unread: false,
    priority: "normal",
  },
  {
    id: 8,
    type: "document",
    icon: FolderOpen,
    title: "New policy uploaded",
    description: "Remote Work Policy 2024 requires acknowledgment",
    time: "1 day ago",
    unread: false,
    priority: "high",
  },
]);

const filteredNotifications = computed(() => {
  if (selectedTab.value === "unread") {
    return notifications.value.filter((n) => n.unread);
  }
  return notifications.value;
});

const unreadCount = computed(
  () => notifications.value.filter((n) => n.unread).length,
);

const markAsRead = (id: number) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) notification.unread = false;
};

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.unread = false));
};

const deleteSelected = () => {
  notifications.value = notifications.value.filter(
    (n) => !selectedNotifications.value.includes(n.id),
  );
  selectedNotifications.value = [];
};

const toggleSelection = (id: number) => {
  const index = selectedNotifications.value.indexOf(id);
  if (index > -1) {
    selectedNotifications.value.splice(index, 1);
  } else {
    selectedNotifications.value.push(id);
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-700 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-muted text-foreground border-border";
  }
};
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Notifications</h1>
        <p class="text-muted-foreground mt-1">
          Stay updated with your workspace activity
        </p>
      </div>
      <div class="flex items-center gap-3">
        <Button
          variant="outline"
          @click="markAllAsRead"
          :disabled="unreadCount === 0"
        >
          <CheckCircle2 class="h-4 w-4 mr-2" />
          Mark All Read
        </Button>
        <Button
          variant="outline"
          @click="deleteSelected"
          :disabled="selectedNotifications.length === 0"
        >
          <Trash2 class="h-4 w-4 mr-2" />
          Delete ({{ selectedNotifications.length }})
        </Button>
        <Button @click="navigateTo('/notifications/settings')">
          <Bell class="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Total</p>
              <p class="text-2xl font-bold text-foreground">
                {{ notifications.length }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <Bell class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Unread</p>
              <p class="text-2xl font-bold text-orange-600">
                {{ unreadCount }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
            >
              <AlertCircle class="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">High Priority</p>
              <p class="text-2xl font-bold text-red-600">3</p>
            </div>
            <div
              class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"
            >
              <AlertTriangle class="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Today</p>
              <p class="text-2xl font-bold text-green-600">12</p>
            </div>
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <Clock class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Notifications List -->
    <Card>
      <CardHeader>
        <Tabs v-model="selectedTab" class="w-full">
          <TabsList class="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all"> All Notifications </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({{ unreadCount }})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent class="p-0">
        <div class="divide-y divide-border">
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            :class="[
              'p-4 hover:bg-muted transition-colors cursor-pointer flex items-start gap-4',
              notification.unread && 'bg-blue-50/50',
            ]"
          >
            <Checkbox
              :checked="selectedNotifications.includes(notification.id)"
              @update:checked="toggleSelection(notification.id)"
              class="mt-1"
            />

            <div
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                notification.unread ? 'bg-blue-100' : 'bg-muted',
              ]"
            >
              <component
                :is="notification.icon"
                :class="[
                  'h-5 w-5',
                  notification.unread ? 'text-blue-600' : 'text-muted-foreground',
                ]"
              />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <p
                    :class="[
                      'text-sm font-medium',
                      notification.unread ? 'text-foreground' : 'text-muted-foreground',
                    ]"
                  >
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-muted-foreground mt-1">
                    {{ notification.description }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <Badge
                    v-if="notification.priority !== 'normal'"
                    :class="getPriorityColor(notification.priority)"
                    variant="outline"
                    class="text-xs"
                  >
                    {{ notification.priority }}
                  </Badge>
                   <span class="text-xs text-muted-foreground whitespace-nowrap">
                    {{ notification.time }}
                  </span>
                </div>
              </div>
            </div>

            <Button
              v-if="notification.unread"
              variant="ghost"
              size="sm"
              @click.stop="markAsRead(notification.id)"
              class="flex-shrink-0"
            >
              Mark Read
            </Button>
          </div>

          <div
            v-if="filteredNotifications.length === 0"
            class="p-12 text-center"
          >
            <div
              class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Bell class="h-8 w-8 text-muted-foreground" />
            </div>
            <p class="text-foreground font-medium">No notifications</p>
            <p class="text-sm text-muted-foreground mt-1">You're all caught up!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
