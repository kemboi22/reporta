<script setup lang="ts">
import { NuxtLink } from "#components";
import {
  LayoutDashboard,
  Users,
  Clock,
  CheckSquare,
  FileText,
  FolderOpen,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  Building2,
  Plus,
  Check,
  Calendar as CalendarIcon,
  FolderKanban,
  Building,
} from "lucide-vue-next";
defineProps<{
  collapsed: boolean;
}>();

const expandedSections = ref<Record<string, boolean>>({});

const toggleSection = (name: string) => {
  expandedSections.value[name] = !expandedSections.value[name];
};

const currentWorkspace = ref({
  id: 1,
  name: "Acme Hospital",
  logo: null,
  subdomain: "acme",
});

const otherWorkspaces = ref([
  { id: 2, name: "City Medical Center", subdomain: "citymed", logo: null },
  { id: 3, name: "Springfield Clinic", subdomain: "springfield", logo: null },
]);

const isSwitching = ref(false);

const getInitials = (name: string) => {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

const switchWorkspace = async (
  workspaceId: number,
  workspaceName: string,
  subdomain: string,
) => {
  isSwitching.value = true;

  // Simulate workspace switch with animation
  await new Promise((resolve) => setTimeout(resolve, 800));

  currentWorkspace.value = {
    id: workspaceId,
    name: workspaceName,
    logo: null,
    subdomain,
  };

  isSwitching.value = false;
  await navigateTo("/dashboard");
};

const navigationItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    badge: null,
  },
  {
    name: "Organizations",
    icon: Building2,
    children: [
      { name: "All Organizations", href: "/organizations" },
      { name: "Switch Workspace", href: "/workspace/switch" },
    ],
  },
  {
    name: "Projects",
    icon: FolderKanban,
    href: "/projects",
  },
  {
    name: "Tasks",
    icon: CheckSquare,
    href: "/tasks",
    badge: "12",
  },
  {
    name: "Calendar",
    icon: CalendarIcon,
    href: "/calendar",
  },
  {
    name: "HR Management",
    icon: Users,
    children: [
      { name: "Staff Directory", href: "/hr/staff" },
      { name: "Shifts & Schedules", href: "/hr/shifts" },
      { name: "Leave Management", href: "/hr/leave" },
      { name: "Appraisals", href: "/hr/appraisals" },
    ],
  },
  {
    name: "Attendance",
    icon: Clock,
    children: [
      { name: "Live Attendance", href: "/attendance/live" },
      { name: "Reports", href: "/attendance/reports" },
      { name: "Biometric Devices", href: "/attendance/devices" },
    ],
  },
  {
    name: "Reports",
    icon: FileText,
    children: [
      { name: "Templates", href: "/reports/templates" },
      { name: "Submitted Reports", href: "/reports/submitted" },
      { name: "Analytics", href: "/reports/analytics" },
    ],
  },
  {
    name: "Documents",
    icon: FolderOpen,
    href: "/documents",
  },
  {
    name: "Notifications",
    icon: Bell,
    href: "/notifications",
    badge: "5",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/settings",
  },
];
</script>

<template>
  <aside
    :class="[
      'bg-background border-r border-border transition-all duration-300 flex flex-col h-screen',
      collapsed ? 'w-20' : 'w-64',
    ]"
  >
    <!-- Logo -->
    <div
      class="h-16 flex items-center justify-center border-b border-border px-4 flex-shrink-0"
    >
      <div v-if="!collapsed" class="flex items-center gap-2">
        <div
          class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <span class="font-bold text-foreground">WorkFlow</span>
      </div>
      <div
        v-else
        class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
      >
        <svg
          class="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
    </div>

    <!-- Enhanced workspace switcher with seamless transitions -->
    <div v-if="!collapsed" class="px-3 py-3 border-b border-border shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="outline"
            class="w-full justify-between h-auto py-2.5 hover:bg-muted transition-all"
            :disabled="isSwitching"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <Avatar class="h-7 w-7 shrink-0">
                <AvatarFallback
                  class="bg-primary/10 text-primary text-xs font-semibold"
                >
                  {{ getInitials(currentWorkspace.name) }}
                </AvatarFallback>
              </Avatar>
              <div class="flex flex-col items-start min-w-0">
                <span
                  class="text-sm font-semibold text-foreground truncate w-full"
                >
                  {{ currentWorkspace.name }}
                </span>
                <span class="text-xs text-muted-foreground">{{
                  currentWorkspace.subdomain
                }}</span>
              </div>
            </div>
            <ChevronDown
              :class="[
                'h-4 w-4 text-muted-foreground',
                isSwitching && 'animate-spin',
              ]"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-64" align="start">
          <DropdownMenuLabel class="text-xs text-muted-foreground font-normal">
            Current Workspace
          </DropdownMenuLabel>

          <!-- Current Workspace -->
          <DropdownMenuItem class="py-3 cursor-default" disabled>
            <div class="flex items-center gap-3 w-full">
              <Avatar class="h-9 w-9">
                <AvatarFallback
                  class="bg-primary/10 text-primary text-sm font-semibold"
                >
                  {{ getInitials(currentWorkspace.name) }}
                </AvatarFallback>
              </Avatar>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-foreground truncate">
                  {{ currentWorkspace.name }}
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ currentWorkspace.subdomain }}
                </div>
              </div>
              <Check class="h-4 w-4 text-primary" />
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel class="text-xs text-muted-foreground font-normal">
            Switch to
          </DropdownMenuLabel>

          <!-- Other Workspaces -->
          <DropdownMenuItem
            v-for="workspace in otherWorkspaces"
            :key="workspace.id"
            @click="
              switchWorkspace(workspace.id, workspace.name, workspace.subdomain)
            "
            class="py-3 cursor-pointer"
          >
            <div class="flex items-center gap-3 w-full">
              <Avatar class="h-9 w-9">
                <AvatarFallback
                  class="bg-muted text-muted-foreground text-sm font-semibold"
                >
                  {{ getInitials(workspace.name) }}
                </AvatarFallback>
              </Avatar>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-foreground truncate">
                  {{ workspace.name }}
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ workspace.subdomain }}
                </div>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            :as="NuxtLink"
            to="/onboarding/step-1"
            class="py-2.5"
          >
            <Plus class="h-4 w-4 mr-2 text-primary" />
            <span class="font-medium text-primary">Create Workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Navigation with ScrollArea for better UX -->
    <ScrollArea class="flex-1 px-3 py-4">
      <nav class="space-y-1">
        <template v-for="item in navigationItems" :key="item.name">
          <!-- Parent item with children -->
          <div v-if="item.children">
            <Button
              variant="ghost"
              :class="[
                'w-full justify-start hover:bg-muted',
                collapsed && 'justify-center px-2',
              ]"
              @click="toggleSection(item.name)"
            >
              <component
                :is="item.icon"
                class="h-5 w-5 text-muted-foreground"
                :class="collapsed ? '' : 'mr-3'"
              />
              <template v-if="!collapsed">
                <span
                  class="flex-1 text-left text-sm font-medium text-foreground"
                  >{{ item.name }}</span
                >
                <component
                  :is="expandedSections[item.name] ? ChevronDown : ChevronRight"
                  class="h-4 w-4 text-slate-400"
                />
              </template>
            </Button>

            <!-- Children -->
            <div
              v-if="expandedSections[item.name] && !collapsed"
              class="ml-8 mt-1 space-y-1"
            >
              <Button
                v-for="child in item.children"
                :key="child.name"
                variant="ghost"
                class="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                @click="navigateTo(child.href)"
                :as="NuxtLink"
                :to="child.href"
              >
                {{ child.name }}
              </Button>
            </div>
          </div>

          <!-- Single item -->
          <Button
            v-else
            variant="ghost"
            :class="[
              'w-full justify-start hover:bg-muted',
              collapsed && 'justify-center px-2',
            ]"
            :as="NuxtLink"
            :to="item.href"
          >
            <div class="relative">
              <component
                :is="item.icon"
                class="h-5 w-5 text-muted-foreground"
                :class="collapsed ? '' : 'mr-3'"
              />
              <Badge
                v-if="item.badge && collapsed"
                variant="destructive"
                class="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                {{ item.badge }}
              </Badge>
            </div>
            <template v-if="!collapsed">
              <span
                class="flex-1 text-left text-sm font-medium text-foreground"
                >{{ item.name }}</span
              >
              <Badge v-if="item.badge" variant="destructive" class="ml-auto">{{
                item.badge
              }}</Badge>
            </template>
          </Button>
        </template>
      </nav>
    </ScrollArea>

    <Separator />

    <!-- User Section -->
    <div class="border-t border-border p-4 flex-shrink-0">
      <div v-if="!collapsed" class="flex items-center gap-3">
        <Avatar class="h-10 w-10">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback class="bg-primary/10 text-primary">AD</AvatarFallback>
        </Avatar>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-foreground truncate">
            Admin User
          </div>
          <div class="text-xs text-muted-foreground truncate">
            admin@company.com
          </div>
        </div>
      </div>
      <Avatar v-else class="h-10 w-10 mx-auto">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback class="bg-primary/10 text-primary">AD</AvatarFallback>
      </Avatar>
    </div>
  </aside>
</template>
