<script setup lang="ts">
import { ref, computed } from "vue";
import { definePageMeta } from "#imports";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

definePageMeta({
  layout: "dashboard",
});

const searchQuery = ref("");
const showCreateProjectSheet = ref(false);
const showAddTeamSheet = ref(false);
const selectedStatus = ref("all");
const selectedAssignee = ref<number | null>(null);
const editingProject = ref<any>(null);
const selectedProject = ref<any>(null);
const showAddTeammateSheet = ref(false);

const teamMembers = [
  { id: 1, name: "Sarah Johnson", role: "Project Lead", photo: "/placeholder-user.jpg" },
  { id: 2, name: "Mike Chen", role: "Developer", photo: "/placeholder-user.jpg" },
  { id: 3, name: "Emma Davis", role: "Designer", photo: "/placeholder-user.jpg" },
  { id: 4, name: "James Wilson", role: "QA Engineer", photo: "/placeholder-user.jpg" },
];

const projects = ref([
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of the company website with new branding",
    status: "in-progress",
    priority: "high",
    startDate: "Nov 15, 2024",
    endDate: "Jan 30, 2025",
    progress: 65,
    team: [1, 2, 3],
    tasks: { completed: 18, total: 28 },
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Build native iOS and Android applications",
    status: "active",
    priority: "urgent",
    startDate: "Dec 01, 2024",
    endDate: "Mar 15, 2025",
    progress: 30,
    team: [2, 3],
    tasks: { completed: 12, total: 40 },
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "API Integration",
    description: "Connect with third-party services and build documentation",
    status: "planning",
    priority: "medium",
    startDate: "Jan 01, 2025",
    endDate: "Feb 28, 2025",
    progress: 0,
    team: [2, 4],
    tasks: { completed: 2, total: 15 },
    color: "bg-emerald-500",
  },
  {
    id: 4,
    name: "Marketing Campaign",
    description: "Q1 marketing initiatives and social media strategy",
    status: "completed",
    priority: "high",
    startDate: "Oct 01, 2024",
    endDate: "Dec 31, 2024",
    progress: 100,
    team: [1, 4],
    tasks: { completed: 24, total: 24 },
    color: "bg-amber-500",
  },
  {
    id: 5,
    name: "Customer Portal",
    description: "Self-service portal for customer account management",
    status: "on-hold",
    priority: "low",
    startDate: "Dec 15, 2024",
    endDate: "Apr 01, 2025",
    progress: 15,
    team: [1],
    tasks: { completed: 3, total: 20 },
    color: "bg-slate-500",
  },
]);

const getFilteredProjects = () => {
  return projects.value.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           project.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = selectedStatus.value === "all" || project.status === selectedStatus.value;
    const matchesAssignee = !selectedAssignee.value || project.team.includes(selectedAssignee.value);
    return matchesSearch && matchesStatus && matchesAssignee;
  });
};

const getInitials = (name: string) => {
  return name.split(" ").map((n) => n[0]).join("");
};

const getTeamMember = (id: number) => {
  return teamMembers.find((m) => m.id === id);
};

const getStatusBadge = (status: string) => {
  const badges: Record<string, any> = {
    "completed": { variant: "default", class: "bg-emerald-500 hover:bg-emerald-600 text-white" },
    "in-progress": { variant: "default", class: "bg-blue-500 hover:bg-blue-600 text-white" },
    "active": { variant: "default", class: "bg-purple-500 hover:bg-purple-600 text-white" },
    "planning": { variant: "secondary", class: "" },
    "on-hold": { variant: "outline", class: "" },
  };
  return badges[status] || badges["planning"];
};

const openCreateProjectSheet = () => {
  editingProject.value = null;
  showCreateProjectSheet.value = true;
};

const openAddTeamSheet = (project: any) => {
  selectedProject.value = project;
  showAddTeamSheet.value = true;
};

const saveProject = () => {
  showCreateProjectSheet.value = false;
};

const addTeammate = () => {
  showAddTeamSheet.value = false;
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Projects</h1>
        <p class="text-muted-foreground mt-1">Manage and track your team's projects</p>
      </div>
      <Button @click="openCreateProjectSheet">
        <Plus class="h-4 w-4 mr-2" />
        New Project
      </Button>
    </div>

    <Card>
      <CardContent class="p-4">
        <div class="flex flex-col lg:flex-row items-start gap-4">
          <div class="relative flex-1 w-full">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input v-model="searchQuery" placeholder="Search projects..." class="pl-10 h-11" />
          </div>
          <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Select v-model="selectedStatus">
              <SelectTrigger class="w-[150px] h-11">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
              </SelectContent>
            </Select>
            <Select v-model="selectedAssignee">
              <SelectTrigger class="w-[160px] h-11">
                <SelectValue placeholder="All Members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem v-for="member in teamMembers" :key="member.id" :value="member.id">
                  <div class="flex items-center gap-2">
                    <Avatar class="h-5 w-5">
                      <AvatarImage :src="member.photo" />
                      <AvatarFallback class="text-[10px] bg-primary/10 text-primary">
                        {{ getInitials(member.name) }}
                      </AvatarFallback>
                    </Avatar>
                    {{ member.name }}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" class="h-11 w-11" @click="() => { selectedStatus = 'all'; selectedAssignee = null; searchQuery = '' }">
              <X class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="project in getFilteredProjects()" :key="project.id" class="hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group border-2 hover:border-primary/30">
        <CardContent class="p-6">
          <div class="flex items-start justify-between mb-5">
            <div class="flex items-center gap-4">
              <div :class="['h-14 w-14 rounded-xl flex items-center justify-center text-white shadow-lg', project.color, 'group-hover:scale-110 transition-transform duration-300']">
                <FolderKanban class="h-7 w-7" />
              </div>
              <div>
                <h3 class="font-bold text-lg group-hover:text-primary transition-colors">{{ project.name }}</h3>
                <p class="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wide">{{ project.priority }} priority</p>
              </div>
            </div>
            <Badge :variant="getStatusBadge(project.status).variant" :class="[getStatusBadge(project.status).class, 'text-xs font-semibold px-3 py-1.5']">
              {{ project.status }}
            </Badge>
          </div> 

          <p class="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">{{ project.description }}</p> 

          <div class="mb-5">
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-muted-foreground font-medium">Progress</span>
              <span class="font-bold text-foreground">{{ project.tasks.completed }}/{{ project.tasks.total }} tasks</span>
            </div>
            <div class="relative">
              <div class="h-2 bg-muted/50 rounded-full overflow-hidden">
                <Progress :value="project.progress" class="h-2" />
              </div>
            </div>
          </div> 

          <div class="grid grid-cols-2 gap-4 mb-5 text-sm">
            <div class="flex items-center gap-2.5">
              <div class="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <Calendar class="h-4 w-4 text-primary" />
              </div>
              <span class="font-medium text-foreground">{{ project.endDate }}</span>
            </div>
            <div class="flex items-center gap-2.5" :class="project.tasks.completed === project.tasks.total ? 'text-emerald-600' : 'text-muted-foreground'">
              <div class="h-8 w-8 rounded-lg flex items-center justify-center" :class="project.tasks.completed === project.tasks.total ? 'bg-emerald-500/10' : 'bg-amber-500/10'">
                <component :is="project.tasks.completed === project.tasks.total ? CheckCircle2 : Clock" class="h-4 w-4" :class="project.tasks.completed === project.tasks.total ? 'text-emerald-600' : 'text-amber-600'" />
              </div>
              <span class="font-medium">{{ project.tasks.completed === project.tasks.total ? 'Completed' : 'In Progress' }}</span>
            </div>
          </div> 

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="flex -space-x-3">
                <Avatar
                  v-for="(memberId, index) in project.team.slice(0, 3)"
                  :key="memberId"
                  class="h-10 w-10 border-2 border-background ring-2 ring-background transition-transform hover:scale-110 cursor-pointer"
                  :style="{ zIndex: 10 - index }"
                >
                  <AvatarImage :src="getTeamMember(memberId)?.photo" />
                  <AvatarFallback class="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-semibold">
                    {{ getInitials(getTeamMember(memberId)?.name || '') }}
                  </AvatarFallback>
                </Avatar>
                <div v-if="project.team.length > 3" class="h-10 w-10 rounded-full bg-primary border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground ring-2 ring-background">
                  +{{ project.team.length - 3 }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="outline" size="sm" @click="openAddTeamSheet(project)" class="h-9 px-4 hover:bg-primary/5">
                <Users class="h-3.5 w-3.5 mr-1.5" />
                Team
              </Button>
              <Button variant="ghost" size="icon" class="h-9 w-9 hover:bg-muted">
                <MoreVertical class="h-4 w-4" />
              </Button>
            </div>
          </div>
         </CardContent>
      </Card>
    </div>

    <div class="grid md:grid-cols-4 gap-5">
      <Card class="hover:shadow-lg transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-center gap-4 mb-3">
            <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <FolderKanban class="h-6 w-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground font-medium">Total Projects</p>
              <p class="text-3xl font-bold text-foreground">{{ projects.length }}</p>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">Across all teams</p>
        </CardContent>
      </Card>
      <Card class="hover:shadow-lg transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-center gap-4 mb-3">
            <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
              <CheckCircle2 class="h-6 w-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground font-medium">Completed</p>
              <p class="text-3xl font-bold text-emerald-600">{{ projects.filter(p => p.progress === 100).length }}</p>
            </div>
          </div>
          <p class="text-xs text-emerald-600 font-medium">All tasks done</p>
        </CardContent>
      </Card>
      <Card class="hover:shadow-lg transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-center gap-4 mb-3">
            <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
              <Clock class="h-6 w-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground font-medium">In Progress</p>
              <p class="text-3xl font-bold text-amber-600">{{ projects.filter(p => p.progress > 0 && p.progress < 100).length }}</p>
            </div>
          </div>
          <p class="text-xs text-amber-600 font-medium">Currently active</p>
        </CardContent>
      </Card>
      <Card class="hover:shadow-lg transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-center gap-4 mb-3">
            <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md">
              <AlertCircle class="h-6 w-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground font-medium">On Hold</p>
              <p class="text-3xl font-bold text-slate-600">{{ projects.filter(p => p.status === 'on-hold').length }}</p>
            </div>
          </div>
          <p class="text-xs text-slate-600 font-medium">Paused projects</p>
        </CardContent>
      </Card>
    </div>

    <Sheet v-model:open="showCreateProjectSheet">
      <SheetContent class="w-full sm:w-[650px] overflow-y-auto">
        <SheetHeader class="px-6 pt-6 pb-2">
          <SheetTitle>{{ editingProject ? 'Edit Project' : 'Create New Project' }}</SheetTitle>
          <SheetDescription>
            {{ editingProject ? 'Update project details' : 'Set up a new project for your team' }}
          </SheetDescription>
        </SheetHeader>
        <div class="space-y-5 px-6 py-4">
          <div class="space-y-2">
            <Label for="project-name">Project Name</Label>
            <Input id="project-name" placeholder="e.g., Website Redesign" />
          </div>
          <div class="space-y-2">
            <Label for="project-description">Description</Label>
            <Textarea id="project-description" placeholder="Describe the project goals and scope..." rows="3" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="project-status">Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="project-priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="start-date">Start Date</Label>
              <Input id="start-date" type="date" />
            </div>
            <div class="space-y-2">
              <Label for="end-date">End Date</Label>
              <Input id="end-date" type="date" />
            </div>
          </div>
          <div class="space-y-2">
            <Label>Team Members</Label>
            <div class="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
              <div v-for="member in teamMembers" :key="member.id" class="flex items-center gap-3">
                <Switch :id="'member-' + member.id" :default-checked="member.id === 1" />
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="member.photo" />
                  <AvatarFallback class="bg-primary text-primary-foreground text-xs">
                    {{ getInitials(member.name) }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex-1">
                  <div class="text-sm font-medium">{{ member.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ member.role }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter class="px-6 pt-4 border-t">
          <Button variant="outline" @click="showCreateProjectSheet = false" class="h-11 px-6">Cancel</Button>
          <Button @click="saveProject" class="h-11 px-6">{{ editingProject ? 'Save Changes' : 'Create Project' }}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>

    <Sheet v-model:open="showAddTeamSheet">
      <SheetContent class="w-full sm:w-[550px] overflow-y-auto">
        <SheetHeader class="px-6 pt-6 pb-2">
          <SheetTitle>Add Team Members</SheetTitle>
          <SheetDescription>Invite team members to {{ selectedProject?.name }}</SheetDescription>
        </SheetHeader>
        <div class="space-y-5 px-6 py-4">
          <div class="space-y-2">
            <Label for="member-email">Email Address</Label>
            <Input id="member-email" type="email" placeholder="colleague@company.com" />
          </div>
          <div class="space-y-2">
            <Label for="member-role">Role</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Project Lead</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="qa">QA Engineer</SelectItem>
                <SelectItem value="contributor">Contributor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="p-4 rounded-lg bg-muted/30">
            <p class="text-sm text-muted-foreground mb-3">Current Team</p>
            <div class="space-y-2">
              <div v-for="memberId in selectedProject?.team" :key="memberId" class="flex items-center gap-3">
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="getTeamMember(memberId)?.photo" />
                  <AvatarFallback class="bg-primary text-primary-foreground text-xs">
                    {{ getInitials(getTeamMember(memberId)?.name || '') }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex-1 flex items-center justify-between">
                  <span class="text-sm">{{ getTeamMember(memberId)?.name }}</span>
                  <Button variant="ghost" size="sm" class="h-7 text-destructive">Remove</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter class="px-6 pt-4 border-t">
          <Button variant="outline" @click="showAddTeamSheet = false" class="h-11 px-6">Cancel</Button>
          <Button @click="addTeammate" class="h-11 px-6">
            <Plus class="h-4 w-4 mr-1.5" />
            Add Member
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>
