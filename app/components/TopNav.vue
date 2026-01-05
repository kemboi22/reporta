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
  Mail,
  LogIn,
} from "lucide-vue-next";
import { authClient } from "~/lib/auth";
import { Badge } from "@/components/ui/badge";
import { toast } from "vue-sonner";
import { NuxtLink } from "#components";

defineEmits(["toggle-sidebar"]);

const route = useRoute();
const organizationId = computed(() => {
  const params = route.params as Record<string, string>;
  return params.organizationId;
});

const session = authClient.useSession();
const isOnDuty = ref(false);
const isCheckingIn = ref(false);
const isCheckingOut = ref(false);
const currentAttendance = ref<any>(null);

const { data: notifications, refresh: refreshNotifications } =
  await useLazyFetch(`/api/notifications?unreadOnly=false`, {
    transform: (data) => data?.slice(0, 5) || [],
  });

const { data: unreadCountData, refresh: refreshUnreadCount } =
  await useLazyFetch("/api/notifications/unread-count");

const unreadCount = computed(() => unreadCountData.value?.count || 0);

const { data: staffMembers, refresh: refreshStaff } = await useLazyFetch(
  () =>
    `/api/${organizationId.value}/staff?userId=${session.value.data?.user.id}`,
  { key: `staff-for-clock-${organizationId.value}` },
);

const currentStaff = computed(() => {
  if (staffMembers.value && staffMembers.value.length > 0) {
    return staffMembers.value[0];
  }
  return null;
});
const checkTodayAttendance = async () => {
  if (!currentStaff.value) return;

  try {
    const today = new Date().toISOString().split("T")[0];
    const response = (await $fetch(
      `/api/${organizationId.value}/attendance?staffId=${currentStaff.value.id}&startDate=${today}T00:00:00.000Z`,
    )) as any[];

    if (response && response.length > 0) {
      const todayRecord = response.find((a: any) => {
        const checkInDate = new Date(a.checkIn).toISOString().split("T")[0];
        return checkInDate === today;
      });

      if (todayRecord) {
        currentAttendance.value = todayRecord;
        isOnDuty.value = !todayRecord.checkOut;
      } else {
        currentAttendance.value = null;
        isOnDuty.value = false;
      }
    } else {
      currentAttendance.value = null;
      isOnDuty.value = false;
    }
  } catch (error) {
    console.error("Failed to check today's attendance:", error);
  }
};

onMounted(async () => {
  await checkTodayAttendance();
});

watch(
  () => session.value.data?.user,
  async () => {
    await checkTodayAttendance();
  },
  { immediate: true },
);

const handleClockInOut = async () => {
  if (!currentStaff.value) {
    toast.error("Staff record not found. Please contact your administrator.");
    return;
  }

  if (isOnDuty.value && currentAttendance.value) {
    await handleCheckOut();
  } else {
    await handleCheckIn();
  }
};

const handleCheckIn = async () => {
  if (!currentStaff.value) return;

  isCheckingIn.value = true;
  try {
    await $fetch(`/api/${organizationId.value}/attendance`, {
      method: "POST",
      body: {
        staffId: currentStaff.value.id,
        location: "Main Office",
      },
    });

    toast.success("Successfully checked in!");
    isOnDuty.value = true;
    await checkTodayAttendance();
  } catch (error) {
    console.error("Failed to check in:", error);
    toast.error("Failed to check in. Please try again.");
  } finally {
    isCheckingIn.value = false;
  }
};

const handleCheckOut = async () => {
  if (!currentAttendance.value?.id) return;

  isCheckingOut.value = true;
  try {
    await $fetch(
      `/api/${organizationId.value}/attendance/${currentAttendance.value.id}/checkout`,
      {
        method: "POST",
        body: { notes: "" },
      },
    );

    toast.success("Successfully checked out!");
    isOnDuty.value = false;
    await checkTodayAttendance();
  } catch (error) {
    console.error("Failed to check out:", error);
    toast.error("Failed to check out. Please try again.");
  } finally {
    isCheckingOut.value = false;
  }
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
  () => session.value.data?.user,
  () => {
    refreshNotifications();
    refreshUnreadCount();
    refreshStaff();
  },
);
</script>

<template>
  <header
    class="h-16 bg-background border-b border-border flex items-center justify-between px-6"
  >
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

    <div class="flex items-center gap-3">
      <ThemeToggle />
      <Button
        v-if="currentStaff"
        :class="[
          'hidden md:flex items-center gap-2',
          isOnDuty
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white',
        ]"
        :disabled="isCheckingIn || isCheckingOut"
        @click="handleClockInOut"
      >
        <LogIn v-if="!isOnDuty" class="h-4 w-4" />
        <LogOut v-else class="h-4 w-4" />
        {{
          isCheckingIn || isCheckingOut
            ? "Processing..."
            : isOnDuty
              ? "Clock Out"
              : "Clock In"
        }}
      </Button>
      <Button
        v-else
        variant="outline"
        class="hidden md:flex items-center gap-2"
        disabled
      >
        <Clock class="h-4 w-4" />
        No Staff Record
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon">
            <Plus class="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
          <DropdownMenuItem :as="NuxtLink" :to="`/${organizationId}/tasks`">
            <CheckSquare class="h-4 w-4 mr-2" />
            New Task
          </DropdownMenuItem>
          <DropdownMenuItem
            :as="NuxtLink"
            :to="`/${organizationId}/reports/templates`"
          >
            <FileText class="h-4 w-4 mr-2" />
            Fill Report
          </DropdownMenuItem>
          <DropdownMenuItem :as="NuxtLink" :to="`/${organizationId}/documents`">
            <Upload class="h-4 w-4 mr-2" />
            Upload Document
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
          <div class="p-3 border-b">
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
              >
                <span class="text-sm font-bold text-primary">
                  {{ session.data?.user.name?.substring(0, 2).toUpperCase() }}
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
          </div>

          <DropdownMenuItem
            @click="navigateTo(`/${organizationId}/staff/profile`)"
          >
            <User class="h-4 w-4 mr-2" />
            My Profile
          </DropdownMenuItem>
          <!-- <DropdownMenuItem @click="navigateTo('/settings')"> -->
          <!--   <Settings class="h-4 w-4 mr-2" /> -->
          <!--   Settings -->
          <!-- </DropdownMenuItem> -->
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
