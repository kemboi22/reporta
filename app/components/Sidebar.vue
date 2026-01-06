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
} from "lucide-vue-next";
import { authClient } from "~/lib/auth";
import {
  isAdmin,
  canManageHR,
  canManageUsers,
  canManageBilling,
  canManageIntegrations,
  canManageSecurity,
} from "~/utils";
defineProps<{
  collapsed: boolean;
}>();

const route = useRoute();
const session = authClient.useSession();
const expandedSections = ref<Record<string, boolean>>({});

const toggleSection = (name: string) => {
  expandedSections.value[name] = !expandedSections.value[name];
};
const currentOrganization = computed(() => {
  const organizations = session.value.data?.user.organizations;
  const orgId = route.params.organizationId as string;
  if (organizations && organizations.length > 0 && orgId) {
    return organizations.find((org) => org.id === orgId);
  }
});

const otherOrganizations = computed(() => {
  const organizations = session.value.data?.user.organizations;
  const orgId = route.params.organizationId as string;
  if (organizations && organizations.length > 0 && orgId) {
    return organizations.filter((org) => org.id !== orgId);
  }
  return [];
});

const navigationItems = computed(() => {
  const items = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      badge: null,
    },
    {
      name: "Organizations",
      icon: Building2,
      roles: ["ADMIN", "OWNER"],
      children: [
        {
          name: "All Organizations",
          href: "/organizations",
          roles: ["ADMIN", "OWNER"],
        },
        { name: "Switch Workspace", href: "/workspace/switch" },
      ],
    },
    {
      name: "Projects",
      icon: FolderKanban,
      href: "/projects",
      roles: ["ADMIN", "OWNER"],
    },
    {
      name: "Tasks",
      icon: CheckSquare,
      href: "/tasks",
      badge: null,
    },
    {
      name: "Calendar",
      icon: CalendarIcon,
      href: "/calendar",
    },
    {
      name: "HR Management",
      icon: Users,
      roles: ["ADMIN", "OWNER"],
      children: [
        {
          name: "Staff Directory",
          href: "/hr/staff",
          roles: ["ADMIN", "OWNER"],
        },
        {
          name: "Shifts & Schedules",
          href: "/hr/shifts",
          roles: ["ADMIN", "OWNER"],
        },
        {
          name: "Leave Management",
          href: "/hr/leave",
          roles: ["ADMIN", "OWNER"],
        },
        {
          name: "Appraisals",
          href: "/hr/appraisals",
          roles: ["ADMIN", "OWNER"],
        },
      ],
    },
    {
      name: "Attendance",
      icon: Clock,
      children: [
        { name: "Attendance", href: "/attendance" },
        { name: "Live Attendance", href: "/attendance/live" },
        {
          name: "Reports",
          href: "/attendance/reports",
          roles: ["ADMIN", "OWNER"],
        },
        {
          name: "Biometric Devices",
          href: "/attendance/devices",
          roles: ["ADMIN", "OWNER"],
        },
      ],
    },
    {
      name: "Reports",
      icon: FileText,
      roles: ["ADMIN", "OWNER"],
      children: [
        { name: "Reports", href: "/reports" },
        {
          name: "Templates",
          href: "/reports/templates",
          roles: ["ADMIN", "OWNER"],
        },
        //   { name: "Analytics", href: "/reports/analytics", roles: ["ADMIN", "OWNER"] },
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
      badge: null,
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/settings",
      roles: ["ADMIN", "OWNER"],
    },
  ];

  const admin = isAdmin();

  return items.filter((item) => {
    if (item.roles && !admin) return false;

    if (item.children) {
      item.children = item.children.filter((child) => {
        if (child.roles && !admin) return false;
        return true;
      });
      return item.children.length > 0;
    }

    return true;
  });
});
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
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <Avatar class="h-7 w-7 shrink-0">
                <AvatarFallback
                  class="bg-primary/10 text-primary text-xs font-semibold"
                >
                  {{ getInitials(currentOrganization?.name ?? "") }}
                </AvatarFallback>
              </Avatar>
              <div class="flex flex-col items-start min-w-0">
                <span
                  class="text-sm font-semibold text-foreground truncate w-full"
                >
                  {{ currentOrganization?.name ?? "" }}
                </span>
              </div>
            </div>
            <ChevronDown :class="['h-4 w-4 text-muted-foreground']" />
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
                  {{ getInitials(currentOrganization?.name ?? "") }}
                </AvatarFallback>
              </Avatar>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-foreground truncate">
                  {{ currentOrganization?.name }}
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
            v-for="workspace in otherOrganizations"
            :key="workspace.id"
            :as="NuxtLink"
            :to="`/${workspace.id}/dashboard`"
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
                  {{ workspace.slug }}
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
            <span class="font-medium text-primary">Create Organization</span>
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
                :as="NuxtLink"
                :to="`/${currentOrganization?.id}${child.href}`"
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
            :to="`/${currentOrganization?.id}${item.href}`"
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
          <AvatarFallback class="bg-primary/10 text-primary">{{
            getInitials(session.data?.user.name ?? "")
          }}</AvatarFallback>
        </Avatar>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-foreground truncate">
            {{ session.data?.user.name }}
          </div>
          <div class="text-xs text-muted-foreground truncate">
            {{ session.data?.user.email }}
          </div>
        </div>
      </div>
      <Avatar v-else class="h-10 w-10 mx-auto">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback class="bg-primary/10 text-primary">{{
          getInitials(session.data?.user.name ?? "")
        }}</AvatarFallback>
      </Avatar>
    </div>
  </aside>
</template>
