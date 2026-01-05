<script setup lang="ts">
import { definePageMeta, navigateTo } from "#imports";
import {
  FolderKanban,
  Plus,
  Search,
  MoreVertical,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  X,
} from "lucide-vue-next";
import { authClient } from "@/lib/auth";
import { isAdmin } from "~/utils";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

if (!isAdmin()) {
  navigateTo(`/${organizationId}/dashboard`);
}

const state = ref({
  searchQuery: "",
  showCreateProjectSheet: false,
  showAddTeamSheet: false,
  selectedStatus: "all",
  selectedAssignee: null as string | null,
  editingProject: null as any,
  selectedProject: null as any,
  showAddTeammateSheet: false,
  loading: false,
  showStats: true,
});

const form = ref({
  name: "",
  slug: "",
  description: "",
  status: "PLANNING",
  priority: "MEDIUM",
  startDate: "",
  endDate: "",
  budget: "",
  currency: "USD",
  color: "",
  icon: "",
  teamMembers: [] as string[],
});

const session = authClient.useSession();
const { data: workspaces } = await useLazyFetch(
  `/api/${organizationId}/workspaces`,
  {
    key: `workspaces-${organizationId}`,
    transform: (data) => data || [],
  },
);

const currentWorkspaceId = computed(() => workspaces.value?.[0]?.id || "");

const { data: projects, refresh: refreshProjects } = await useLazyFetch(
  `/api/${organizationId}/projects`,
  {
    key: `projects-${organizationId}`,
    transform: (data) => data || [],
  },
);

const { data: teamMembers } = await useLazyFetch(
  `/api/${organizationId}/staff`,
  {
    key: `staff-${organizationId}`,
    transform: (data) =>
      (data || []).map((s: any) => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        role: s.position || "Team Member",
        photo: s.avatar || "/placeholder-user.jpg",
        userId: s.userId,
      })),
  },
);

const getFilteredProjects = () => {
  if (!projects.value) return [];

  return projects.value.filter((project) => {
    const matchesSearch =
      project.name
        .toLowerCase()
        .includes(state.value.searchQuery.toLowerCase()) ||
      (project.description &&
        project.description
          .toLowerCase()
          .includes(state.value.searchQuery.toLowerCase()));
    const matchesStatus =
      state.value.selectedStatus === "all" ||
      project.status?.toLowerCase() ===
        state.value.selectedStatus.toLowerCase();
    const matchesAssignee =
      !state.value.selectedAssignee ||
      project.members?.some((m) => m.userId === state.value.selectedAssignee);
    return matchesSearch && matchesStatus && matchesAssignee;
  });
};

const getStatusBadge = (status: string) => {
  const badges: Record<string, any> = {
    COMPLETED: {
      variant: "default",
      class: "bg-emerald-500 hover:bg-emerald-600 text-white",
    },
    ACTIVE: {
      variant: "default",
      class: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    IN_PROGRESS: {
      variant: "default",
      class: "bg-purple-500 hover:bg-purple-600 text-white",
    },
    PLANNING: { variant: "secondary", class: "" },
    ON_HOLD: { variant: "outline", class: "" },
    CANCELLED: { variant: "outline", class: "text-destructive" },
  };
  return badges[status] || badges["PLANNING"];
};

const openCreateProjectSheet = () => {
  state.value.editingProject = null;
  state.value.showCreateProjectSheet = true;
};

const openAddTeamSheet = (project: any) => {
  state.value.selectedProject = project;
  state.value.showAddTeamSheet = true;
};

const saveProject = async () => {
  try {
    state.value.loading = true;

    const projectData = {
      name: form.value.name,
      slug:
        form.value.slug || form.value.name.toLowerCase().replace(/\s+/g, "-"),
      description: form.value.description,
      status: form.value.status,
      priority: form.value.priority,
      startDate: form.value.startDate
        ? new Date(form.value.startDate).toISOString()
        : null,
      endDate: form.value.endDate
        ? new Date(form.value.endDate).toISOString()
        : null,
      budget: form.value.budget ? parseFloat(form.value.budget) : null,
      currency: form.value.currency,
      color: form.value.color,
      icon: form.value.icon,
      workspaceId: currentWorkspaceId.value,
      teamMembers: form.value.teamMembers,
    };

    await $fetch(`/api/${organizationId}/projects`, {
      method: "POST",
      body: projectData,
    });

    state.value.showCreateProjectSheet = false;
    form.value = {
      name: "",
      slug: "",
      description: "",
      status: "PLANNING",
      priority: "MEDIUM",
      startDate: "",
      endDate: "",
      budget: "",
      currency: "USD",
      color: "",
      icon: "",
      teamMembers: [],
    };

    await refreshNuxtData(`projects-${organizationId}`);
  } catch (error) {
    console.error("Failed to create project:", error);
  } finally {
    state.value.loading = false;
  }
};

const addTeamMember = async () => {
  try {
    state.value.loading = true;

    await $fetch(
      `/api/${organizationId}/projects/${state.value.selectedProject?.id}/members`,
      {
        method: "POST",
        body: {
          userId: addTeamForm.value.userId,
          role: addTeamForm.value.role,
        },
      },
    );

    state.value.showAddTeamSheet = false;
    addTeamForm.value = { userId: "", role: "MEMBER" };

    await refreshNuxtData(`projects-${organizationId}`);
  } catch (error) {
    console.error("Failed to add team member:", error);
  } finally {
    state.value.loading = false;
  }
};

const addTeamForm = ref({
  userId: "",
  role: "MEMBER" as "OWNER" | "ADMIN" | "MEMBER" | "VIEWER",
});

const removeTeamMember = async (memberId: string) => {
  try {
    await $fetch(
      `/api/${organizationId}/projects/${state.value.selectedProject?.id}/members/${memberId}`,
      {
        method: "DELETE",
      },
    );

    await refreshNuxtData(`projects-${organizationId}`);
  } catch (error) {
    console.error("Failed to remove team member:", error);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Projects</h1>
        <p class="text-muted-foreground mt-1">
          Manage and track your team's projects
        </p>
      </div>
      <Button @click="openCreateProjectSheet">
        <Plus class="h-4 w-4 mr-2" />
        New Project
      </Button>
    </div>

    <Card v-if="state.showStats" class="border border-primary/10">
      <CardContent class="p-3">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-semibold text-foreground">
            Project Overview
          </h3>
          <Button
            variant="ghost"
            size="sm"
            class="h-6 w-6 p-0"
            @click="state.showStats = false"
          >
            <X class="h-3 w-3" />
          </Button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="flex items-center gap-2">
            <div
              class="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center"
            >
              <FolderKanban class="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <p class="text-lg font-bold">{{ projects?.length || 0 }}</p>
              <p class="text-[10px] text-muted-foreground">Total</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div
              class="h-8 w-8 rounded-md bg-emerald-500/10 flex items-center justify-center"
            >
              <CheckCircle2 class="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <p class="text-lg font-bold text-emerald-600">
                {{
                  projects?.filter((p) => p.status === "COMPLETED").length || 0
                }}
              </p>
              <p class="text-[10px] text-muted-foreground">Completed</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div
              class="h-8 w-8 rounded-md bg-amber-500/10 flex items-center justify-center"
            >
              <Clock class="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div>
              <p class="text-lg font-bold text-amber-600">
                {{ projects?.filter((p) => p.status === "ACTIVE").length || 0 }}
              </p>
              <p class="text-[10px] text-muted-foreground">Active</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div
              class="h-8 w-8 rounded-md bg-slate-500/10 flex items-center justify-center"
            >
              <AlertCircle class="h-3.5 w-3.5 text-slate-500" />
            </div>
            <div>
              <p class="text-lg font-bold text-slate-600">
                {{
                  projects?.filter((p) => p.status === "ON_HOLD").length || 0
                }}
              </p>
              <p class="text-[10px] text-muted-foreground">On Hold</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent class="p-4">
        <div class="flex flex-col lg:flex-row items-start gap-4">
          <div class="relative flex-1 w-full">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="state.searchQuery"
              placeholder="Search projects..."
              class="pl-10 h-11"
            />
          </div>
          <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Select v-model="state.selectedStatus">
              <SelectTrigger class="w-[150px] h-11">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PLANNING">Planning</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select v-model="state.selectedAssignee">
              <SelectTrigger class="w-[160px] h-11">
                <SelectValue placeholder="All Members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem
                  v-for="member in teamMembers"
                  :key="member.id"
                  :value="member.userId"
                >
                  <div class="flex items-center gap-2">
                    <Avatar class="h-5 w-5">
                      <AvatarImage :src="member.photo" />
                      <AvatarFallback
                        class="text-[10px] bg-primary/10 text-primary"
                      >
                        {{ getInitials(member.name) }}
                      </AvatarFallback>
                    </Avatar>
                    {{ member.name }}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              class="h-11 w-11"
              @click="
                () => {
                  state.selectedStatus = 'all';
                  state.selectedAssignee = null;
                  state.searchQuery = '';
                }
              "
            >
              <X class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="project in getFilteredProjects()"
        :key="project.id"
        :to="`/${organizationId}/projects/${project.id}`"
        class="group"
      >
        <Card
          class="h-full hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer border-2 hover:border-primary/30"
        >
          <CardContent class="p-6">
            <div class="flex items-start justify-between mb-5">
              <div class="flex items-center gap-4">
                <div
                  :class="[
                    'h-14 w-14 rounded-xl flex items-center justify-center text-white shadow-lg',
                    project.color || 'bg-blue-500',
                    'group-hover:scale-110 transition-transform duration-300',
                  ]"
                >
                  <FolderKanban class="h-7 w-7" />
                </div>
                <div>
                  <h3
                    class="font-bold text-lg group-hover:text-primary transition-colors"
                  >
                    {{ project.name }}
                  </h3>
                  <p
                    class="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wide"
                  >
                    {{ project.priority?.toLowerCase() }} priority
                  </p>
                </div>
              </div>
              <Badge
                :variant="getStatusBadge(project.status).variant"
                :class="[
                  getStatusBadge(project.status).class,
                  'text-xs font-semibold px-3 py-1.5',
                ]"
              >
                {{ project.status?.replace("_", "-")?.toLowerCase() }}
              </Badge>
            </div>

            <p
              class="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed"
            >
              {{ project.description || "No description" }}
            </p>

            <div class="grid grid-cols-2 gap-4 mb-5 text-sm">
              <div class="flex items-center gap-2.5">
                <div
                  class="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center"
                >
                  <Calendar class="h-4 w-4 text-primary" />
                </div>
                <span class="font-medium text-foreground">{{
                  project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : "No date"
                }}</span>
              </div>
              <div
                class="flex items-center gap-2.5"
                :class="
                  project.status === 'COMPLETED'
                    ? 'text-emerald-600'
                    : 'text-muted-foreground'
                "
              >
                <div
                  class="h-8 w-8 rounded-lg flex items-center justify-center"
                  :class="
                    project.status === 'COMPLETED'
                      ? 'bg-emerald-500/10'
                      : 'bg-amber-500/10'
                  "
                >
                  <component
                    :is="project.status === 'COMPLETED' ? CheckCircle2 : Clock"
                    class="h-4 w-4"
                    :class="
                      project.status === 'COMPLETED'
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    "
                  />
                </div>
                <span class="font-medium">{{
                  project.status === "COMPLETED" ? "Completed" : "In Progress"
                }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="flex -space-x-3">
                  <Avatar
                    v-for="(member, index) in (project.members || []).slice(
                      0,
                      3,
                    )"
                    :key="member.id"
                    class="h-10 w-10 border-2 border-background ring-2 ring-background transition-transform hover:scale-110 cursor-pointer"
                    :style="{ zIndex: 10 - index }"
                  >
                    <AvatarImage :src="member.user?.avatar" />
                    <AvatarFallback
                      class="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-semibold"
                    >
                      {{ getInitials(member.user?.name || "") }}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    v-if="project.members?.length > 3"
                    class="h-10 w-10 rounded-full bg-primary border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground ring-2 ring-background"
                  >
                    +{{ project.members.length - 3 }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  @click="openAddTeamSheet(project)"
                  class="h-9 px-4 hover:bg-primary/5"
                >
                  <Users class="h-3.5 w-3.5 mr-1.5" />
                  Team
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="h-9 w-9 hover:bg-muted"
                >
                  <MoreVertical class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>

    <Button
      v-if="!state.showStats"
      variant="outline"
      size="sm"
      @click="state.showStats = true"
      class="w-full"
    >
      <FolderKanban class="h-4 w-4 mr-2" />
      Show Stats
    </Button>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card class="hover:shadow-lg transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-center gap-4 mb-3">
            <div
              class="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md"
            >
              <FolderKanban class="h-6 w-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground font-medium">
                Total Projects
              </p>
              <p class="text-3xl font-bold text-foreground">
                {{ projects?.length || 0 }}
              </p>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">Across all teams</p>
        </CardContent>
      </Card>
      <Card class="hover:shadow-lg transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-center gap-4 mb-3">
            <div
              class="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md"
            >
              <CheckCircle2 class="h-6 w-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground font-medium">Completed</p>
              <p class="text-3xl font-bold text-emerald-600">
                {{
                  projects?.filter((p) => p.status === "COMPLETED").length || 0
                }}
              </p>
            </div>
          </div>
          <p class="text-xs text-emerald-600 font-medium">All tasks done</p>
        </CardContent>
      </Card>
      <Card class="hover:shadow-lg transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-center gap-4 mb-3">
            <div
              class="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md"
            >
              <Clock class="h-6 w-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground font-medium">Active</p>
              <p class="text-3xl font-bold text-amber-600">
                {{ projects?.filter((p) => p.status === "ACTIVE").length || 0 }}
              </p>
            </div>
          </div>
          <p class="text-xs text-amber-600 font-medium">Currently active</p>
        </CardContent>
      </Card>
      <Card class="hover:shadow-lg transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-center gap-4 mb-3">
            <div
              class="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md"
            >
              <AlertCircle class="h-6 w-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground font-medium">On Hold</p>
              <p class="text-3xl font-bold text-slate-600">
                {{
                  projects?.filter((p) => p.status === "ON_HOLD").length || 0
                }}
              </p>
            </div>
          </div>
          <p class="text-xs text-slate-600 font-medium">Paused projects</p>
        </CardContent>
      </Card>
    </div>

    <Sheet v-model:open="state.showCreateProjectSheet">
      <SheetContent class="w-full sm:w-[650px] overflow-y-auto">
        <SheetHeader class="px-6 pt-6 pb-2">
          <SheetTitle>{{
            state.editingProject ? "Edit Project" : "Create New Project"
          }}</SheetTitle>
          <SheetDescription>
            {{
              state.editingProject
                ? "Update project details"
                : "Set up a new project for your team"
            }}
          </SheetDescription>
        </SheetHeader>
        <div class="space-y-5 px-6 py-4">
          <div class="space-y-2">
            <Label for="project-name">Project Name</Label>
            <Input
              id="project-name"
              v-model="form.name"
              placeholder="e.g., Website Redesign"
            />
          </div>
          <div class="space-y-2">
            <Label for="project-description">Description</Label>
            <Textarea
              id="project-description"
              v-model="form.description"
              placeholder="Describe the project goals and scope..."
              rows="3"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="project-status">Status</Label>
              <Select v-model="form.status">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANNING">Planning</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="project-priority">Priority</Label>
              <Select v-model="form.priority">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="start-date">Start Date</Label>
              <Input id="start-date" v-model="form.startDate" type="date" />
            </div>
            <div class="space-y-2">
              <Label for="end-date">End Date</Label>
              <Input id="end-date" v-model="form.endDate" type="date" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="budget">Budget</Label>
              <Input
                id="budget"
                v-model="form.budget"
                type="number"
                placeholder="50000"
              />
            </div>
            <div class="space-y-2">
              <Label for="currency">Currency</Label>
              <Select v-model="form.currency">
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="space-y-2">
            <Label>Team Members</Label>
            <div
              class="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto"
            >
              <div
                v-for="member in teamMembers"
                :key="member.id"
                class="flex items-center gap-3"
              >
                <Switch
                  :id="'member-' + member.id"
                  :model-value="form.teamMembers.includes(member.userId)"
                  @update:model-value="
                    (checked: boolean) => {
                      if (checked) {
                        form.teamMembers.push(member.userId);
                      } else {
                        const index = form.teamMembers.indexOf(member.userId);
                        if (index > -1) form.teamMembers.splice(index, 1);
                      }
                    }
                  "
                />
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="member.photo" />
                  <AvatarFallback
                    class="bg-primary text-primary-foreground text-xs"
                  >
                    {{ getInitials(member.name) }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex-1">
                  <div class="text-sm font-medium">{{ member.name }}</div>
                  <div class="text-xs text-muted-foreground">
                    {{ member.role }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter class="px-6 pt-4 border-t">
          <Button
            variant="outline"
            @click="state.showCreateProjectSheet = false"
            class="h-11 px-6"
            >Cancel</Button
          >
          <Button
            @click="saveProject"
            :disabled="state.loading"
            class="h-11 px-6"
          >
            {{
              state.loading
                ? "Creating..."
                : state.editingProject
                  ? "Save Changes"
                  : "Create Project"
            }}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>

    <Sheet v-model:open="state.showAddTeamSheet">
      <SheetContent class="w-full sm:w-[550px] overflow-y-auto">
        <SheetHeader class="px-6 pt-6 pb-2">
          <SheetTitle>Add Team Members</SheetTitle>
          <SheetDescription
            >Invite team members to
            {{ state.selectedProject?.name }}</SheetDescription
          >
        </SheetHeader>
        <div class="space-y-5 px-6 py-4">
          <div class="space-y-2">
            <Label for="member-select">Select Member</Label>
            <Select v-model="addTeamForm.userId">
              <SelectTrigger id="member-select">
                <SelectValue placeholder="Choose a team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="member in teamMembers"
                  :key="member.userId"
                  :value="member.userId"
                >
                  <div class="flex items-center gap-2">
                    <Avatar class="h-5 w-5">
                      <AvatarImage :src="member.photo" />
                      <AvatarFallback
                        class="text-[10px] bg-primary/10 text-primary"
                      >
                        {{ getInitials(member.name) }}
                      </AvatarFallback>
                    </Avatar>
                    {{ member.name }}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="member-role">Role</Label>
            <Select v-model="addTeamForm.role">
              <SelectTrigger id="member-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OWNER">Owner</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="p-4 rounded-lg bg-muted/30">
            <p class="text-sm text-muted-foreground mb-3">Current Team</p>
            <div class="space-y-2">
              <div
                v-for="member in state.selectedProject?.members || []"
                :key="member.id"
                class="flex items-center gap-3"
              >
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="member.user?.avatar" />
                  <AvatarFallback
                    class="bg-primary text-primary-foreground text-xs"
                  >
                    {{ getInitials(member.user?.name || "") }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex-1">
                  <div class="text-sm font-medium">{{ member.user?.name }}</div>
                  <Badge variant="outline" class="text-xs mt-1">
                    {{ member.role }}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-7 text-destructive"
                  @click="removeTeamMember(member.id)"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter class="px-6 pt-4 border-t">
          <Button
            variant="outline"
            @click="state.showAddTeamSheet = false"
            class="h-11 px-6"
          >
            Cancel
          </Button>
          <Button
            @click="addTeamMember"
            class="h-11 px-6"
            :disabled="!addTeamForm.userId || state.loading"
          >
            <Plus class="h-4 w-4 mr-1.5" />
            {{ state.loading ? "Adding..." : "Add Member" }}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>
