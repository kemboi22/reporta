<script setup lang="ts">
import {
  Bell,
  CheckSquare,
  Clock,
  CheckCircle2,
  MessageSquare,
  FileText,
  AlertTriangle,
  Calendar,
  Filter,
  Trash2,
} from "lucide-vue-next";
import { authClient } from "~/lib/auth";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const selectedTab = ref("all");
const selectedNotifications = ref<number[]>([]);

const { data: notifications, refresh: refreshNotifications } =
  await useLazyFetch(
    `/api/notifications?unreadOnly=${selectedTab === "unread"}`,
    {
      key: `notifications-${organizationId}-${selectedTab.value}`,
      transform: (data) => data || [],
    },
  );

const { data: session } = await authClient.useSession();

const { data: unreadCountData, refresh: refreshUnreadCount } =
  await useLazyFetch("/api/notifications/unread-count");

const filteredNotifications = computed(() => {
  return notifications.value || [];
});

const unreadCount = computed(() => unreadCountData.value?.count || 0);

watch(selectedTab, async () => {
  await refreshNotifications();
});

const markAsRead = async (id: string) => {
  try {
    await $fetch(`/api/notifications/${id}/read`, {
      method: "POST",
    });
    await refreshNotifications();
    await refreshUnreadCount();
  } catch (error) {
    console.error("Failed to mark as read:", error);
  }
};

const markAllAsRead = async () => {
  try {
    await $fetch("/api/notifications/read-all", {
      method: "POST",
    });
    await refreshNotifications();
    await refreshUnreadCount();
  } catch (error) {
    console.error("Failed to mark all as read:", error);
  }
};

const deleteSelected = async () => {
  for (const id of selectedNotifications.value) {
    try {
      await $fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  }
  selectedNotifications.value = [];
  await refreshNotifications();
  await refreshUnreadCount();
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

const getNotificationIcon = (type: string) => {
  const icons: Record<string, any> = {
    task: CheckSquare,
    alert: AlertTriangle,
    comment: MessageSquare,
    report: FileText,
    leave: Calendar,
    invitation: Mail,
  };
  return icons[type] || Bell;
};
</script>

<template>
  <div class="p-6 space-y-6">
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
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Total</p>
              <p class="text-2xl font-bold text-foreground">
                {{ notifications?.length || 0 }}
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
    </div>

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
            v-if="filteredNotifications.length === 0"
            class="p-12 text-center"
          >
            <div
              class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Bell class="h-8 w-8 text-muted-foreground" />
            </div>
            <p class="text-foreground font-medium">No notifications</p>
            <p class="text-sm text-muted-foreground mt-1">
              You're all caught up!
            </p>
          </div>

          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            :class="[
              'p-4 hover:bg-muted transition-colors cursor-pointer flex items-start gap-4',
              !notification.isRead && 'bg-blue-50/50',
            ]"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="notification.isRead ? 'bg-muted' : 'bg-blue-100'"
            >
              <component
                :is="getNotificationIcon(notification.type)"
                :class="[
                  'h-5 w-5',
                  notification.isRead
                    ? 'text-muted-foreground'
                    : 'text-blue-600',
                ]"
              />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <p
                    :class="[
                      'text-sm font-medium',
                      notification.isRead
                        ? 'text-muted-foreground'
                        : 'text-foreground',
                    ]"
                  >
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {{ notification.message }}
                  </p>
                </div>
                <span
                  class="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0"
                >
                  {{ new Date(notification.createdAt).toLocaleString() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
