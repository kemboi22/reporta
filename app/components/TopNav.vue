<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle.vue";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "lucide-vue-next";

defineEmits(["toggle-sidebar"]);

const isOnDuty = ref(false);

const currentWorkspace = ref({
  name: "Acme Corporation",
  subdomain: "acme",
  logo: null,
});

const toggleClockStatus = () => {
  isOnDuty.value = !isOnDuty.value;
};

const recentNotifications = [
  {
    id: 1,
    type: "task",
    title: "New task assigned",
    description: 'John assigned you "Prepare monthly report"',
    time: "5m ago",
    unread: true,
  },
  {
    id: 2,
    type: "report",
    title: "Report due soon",
    description: "Daily attendance report due in 2 hours",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    type: "leave",
    title: "Leave approved",
    description: "Your leave request has been approved",
    time: "3h ago",
    unread: false,
  },
];

const navigateTo = (path: string) => {
  // Implement navigation logic here
};
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
        <Input
          placeholder="Search anything..."
          class="pl-10 w-64 lg:w-96"
        />
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
            <span
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background"
            ></span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-80">
          <div class="flex items-center justify-between p-3 border-b">
            <h3 class="font-semibold text-sm">Notifications</h3>
            <Button variant="ghost" size="sm" class="h-7 text-xs"
              >Mark all read</Button
            >
          </div>
          <div class="max-h-96 overflow-y-auto">
            <div
              v-for="notification in recentNotifications"
              :key="notification.id"
              :class="[
                'p-3 border-b hover:bg-muted cursor-pointer',
                notification.unread && 'bg-accent',
              ]"
            >
              <div class="flex items-start gap-3">
                <div
                  class="w-2 h-2 mt-2 rounded-full"
                  :class="notification.unread ? 'bg-primary' : 'bg-muted-foreground'"
                ></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-foreground">
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-muted-foreground mt-1">
                    {{ notification.description }}
                  </p>
                  <p class="text-xs text-muted-foreground mt-1">
                    {{ notification.time }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- User Menu -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="relative h-10 w-10 rounded-full p-0">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback class="bg-primary/10 text-primary"
                >AD</AvatarFallback
              >
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
                  {{ currentWorkspace.name.substring(0, 2).toUpperCase() }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm text-foreground truncate">
                  {{ currentWorkspace.name }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ currentWorkspace.subdomain }}.app
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              class="w-full justify-start text-xs h-8"
              @click="navigateTo('/workspace/switch')"
            >
              <svg
                class="h-3.5 w-3.5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              Switch Workspace
            </Button>
          </div>

          <DropdownMenuItem @click="navigateTo('/staff/profile')">
            <User class="h-4 w-4 mr-2" />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem @click="navigateTo('/settings')">
            <Settings class="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="text-red-600"
            @click="navigateTo('/auth/login')"
          >
            <LogOut class="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
