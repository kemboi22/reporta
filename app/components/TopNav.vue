<script setup lang="ts">
import {
  Menu,
  Search,
  Clock,
  Plus,
  Bell,
  User,
  Settings,
  LogOut,
  CheckSquare,
  FileText,
  Upload,
  ArrowRightLeftIcon,
  Mail,
  CheckCircle,
  CheckSquare2,
} from "lucide-vue-next";
import { authClient } from "~/lib/auth";
import { Badge } from "@/components/ui/badge";

defineEmits(["toggle-sidebar"]);

const route = useRoute();
const organizationId = route.params.organizationId as string;

const isOnDuty = ref(false);
const session = authClient.useSession();

const { data: notifications, refresh: refreshNotifications } =
  await useLazyFetch(`/api/notifications?unreadOnly=false`, {
    transform: (data) => data?.slice(0, 5) || [],
  });

const { data: unreadCountData, refresh: refreshUnreadCount } =
  await useLazyFetch("/api/notifications/unread-count");

const unreadCount = computed(() => unreadCountData.value?.count || 0);

const toggleClockStatus = () => {
  isOnDuty.value = !isOnDuty.value;
};

const logout = async () => {
  await authClient.signOut({
    fetchOptions: {
      async onSuccess(context) {
        await navigateTo("/auth/login");
      },
    },
  });
};

const markAllAsRead = async () => {
  try {
    await $fetch("/api/notifications/read-all", { method: "POST" });
    await refreshNotifications();
    await refreshUnreadCount();
  } catch (e) {
    console.error("Failed to mark all as read:", e);
  }
};

const markAsRead = async (id: string) => {
  try {
    await $fetch(`/api/notifications/${id}/read`, { method: "POST" });
    await refreshNotifications();
    await refreshUnreadCount();
  } catch (e) {
    console.error("Failed to mark as read:", e);
  }
};

const getNotificationIcon = (type: string) => {
  const icons: Record<string, any> = {
    task: CheckSquare,
    report: FileText,
    leave: Clock,
    invitation: Mail,
    default: Bell,
  };
  return icons[type] || Bell;
};

const formatTime = (date: string) => {
  const notificationDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - notificationDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

watch(
  () => session.data?.user?.id,
  () => {
    refreshNotifications();
    refreshUnreadCount();
  },
);
</script>

<template>
  <header
    class="h-16 bg-background border-b border-border flex items-center justify-between px-6"
  >
    <!-- Left Section -->
    <div class="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        @click="$emit('toggle-sidebar')"
        class="lg:hidden"
      >
        <Menu class="h-5 w-5" />
      </Button>

      <div class="relative hidden md:block">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />
        <Input placeholder="Search anything..." class="pl-10 w-64 lg:w-96" />
      </div>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-3">
      <ThemeToggle />
      <!-- Clock In/Out Button -->
      <Button
        :class="[
          'hidden md:flex items-center gap-2',
          isOnDuty
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white',
        ]"
        @click="toggleClockStatus"
      >
        <Clock class="h-4 w-4" />
        {{ isOnDuty ? "Clock Out" : "Clock In" }}
      </Button>

      <!-- Quick Actions -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon">
            <Plus class="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
          <DropdownMenuItem>
            <CheckSquare class="h-4 w-4 mr-2" />
            New Task
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText class="h-4 w-4 mr-2" />
            Fill Report
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Upload class="h-4 w-4 mr-2" />
            Upload Document
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Notifications -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="relative">
            <Bell class="h-5 w-5" />
            <Badge
              v-if="unreadCount > 0"
              class="absolute top-0 right-0 h-5 px-1.5 text-xs flex items-center justify-center"
              variant="destructive"
            >
              {{ unreadCount > 9 ? "9+" : unreadCount }}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-80">
          <div class="flex items-center justify-between p-3 border-b">
            <h3 class="font-semibold text-sm">Notifications</h3>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 text-xs"
              @click="markAllAsRead"
              :disabled="unreadCount === 0"
            >
              Mark all read
            </Button>
          </div>
          <div class="max-h-96 overflow-y-auto">
            <div
              v-if="!notifications || notifications.length === 0"
              class="p-8 text-center"
            >
              <Mail
                class="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50"
              />
              <p class="text-sm text-muted-foreground">No notifications</p>
            </div>
            <div
              v-for="notification in notifications"
              :key="notification.id"
              :class="[
                'p-3 border-b hover:bg-muted cursor-pointer',
                !notification.isRead && 'bg-accent',
              ]"
              @click="markAsRead(notification.id)"
            >
              <div class="flex items-start gap-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="!notification.isRead ? 'bg-primary/10' : 'bg-muted'"
                >
                  <component
                    :is="getNotificationIcon(notification.type)"
                    :class="[
                      'h-4 w-4',
                      !notification.isRead
                        ? 'text-primary'
                        : 'text-muted-foreground',
                    ]"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    :class="[
                      'text-sm font-medium',
                      !notification.isRead
                        ? 'text-foreground'
                        : 'text-muted-foreground',
                    ]"
                  >
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-muted-foreground mt-1">
                    {{ formatTime(notification.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              class="w-full justify-center"
              @click="navigateTo(`/${organizationId}/notifications`)"
            >
              View all notifications
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- User Menu -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="relative h-10 w-10 rounded-full p-0">
            <Avatar>
              <AvatarImage
                :src="session.data?.user.image ?? `/placeholder-user.jpg`"
              />
              <AvatarFallback class="bg-primary/10 text-primary">{{
                getInitials(session.data?.user.name ?? "")
              }}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-72">
          <!-- Added workspace info section -->
          <div class="p-3 border-b">
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
              >
                <span class="text-sm font-bold text-primary">
                  {{ session.data?.user.name.substring(0, 2).toUpperCase() }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm text-foreground truncate">
                  {{ session.data?.user.name }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ session.data?.user.email }}
                </p>
              </div>
            </div>
          <!--   <Button -->
          <!--     variant="outline" -->
          <!--     size="sm" -->
          <!--     class="w-full justify-start text-xs h-8" -->
          <!--     @click="navigateTo('/workspace/switch')" -->
          <!--   > -->
          <!--     <ArrowRightLeftIcon class="h-3.5 w-3.5 mr-2" /> -->
          <!--     Switch Workspace -->
          <!--   </Button> -->
          <!-- </div> -->

          <DropdownMenuItem @click="navigateTo('/staff/profile')">
            <User class="h-4 w-4 mr-2" />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem @click="navigateTo('/settings')">
            <Settings class="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-red-600" @click="logout()">
            <LogOut class="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
