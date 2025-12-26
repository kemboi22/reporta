<script setup lang="ts">
import { ref } from "vue";
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
  ArrowRight,
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
    return project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           project.description.toLowerCase().includes(searchQuery.value.toLowerCase());
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
        <div class="flex items-center gap-4">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input v-model="searchQuery" placeholder="Search projects..." class="pl-10" />
          </div>
          <div class="flex gap-2">
            <Select>
              <SelectTrigger class="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="grid md:grid-cols-2 gap-4">
      <Card v-for="project in getFilteredProjects()" :key="project.id" class="hover:shadow-lg transition-all cursor-pointer group">
        <CardContent class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div :class="['h-12 w-12 rounded-lg flex items-center justify-center', project.color, 'text-white']">
                <FolderKanban class="h-6 w-6" />
              </div>
              <div>
                <h3 class="font-semibold text-foreground group-hover:text-primary transition-colors">{{ project.name }}</h3>
                <p class="text-xs text-muted-foreground mt-0.5">{{ project.priority }} priority</p>
              </div>
            </div>
            <Badge :variant="getStatusBadge(project.status).variant" :class="getStatusBadge(project.status).class" class="text-xs">
              {{ project.status }}
            </Badge>
          </div>

          <p class="text-sm text-muted-foreground mb-4 line-clamp-2">{{ project.description }}</p>

          <div class="mb-4">
            <div class="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Progress</span>
              <span class="font-medium">{{ project.tasks.completed }}/{{ project.tasks.total }} tasks</span>
            </div>
            <Progress :value="project.progress" class="h-2" />
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div class="flex items-center gap-2 text-muted-foreground">
              <Calendar class="h-3.5 w-3.5" />
              <span>{{ project.endDate }}</span>
            </div>
            <div class="flex items-center gap-2" :class="project.tasks.completed === project.tasks.total ? 'text-emerald-600' : 'text-muted-foreground'">
              <component :is="project.tasks.completed === project.tasks.total ? CheckCircle2 : Clock" class="h-3.5 w-3.5" />
              <span>{{ project.tasks.completed === project.tasks.total ? 'Completed' : 'In Progress' }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex -space-x-2">
              <Avatar
                v-for="memberId in project.team.slice(0, 4)"
                :key="memberId"
                class="h-8 w-8 border-2 border-background"
              >
                <AvatarImage :src="getTeamMember(memberId)?.photo" />
                <AvatarFallback class="bg-primary text-primary-foreground text-xs">
                  {{ getInitials(getTeamMember(memberId)?.name || '') }}
                </AvatarFallback>
              </Avatar>
              <div v-if="project.team.length > 4" class="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
                +{{ project.team.length - 4 }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="outline" size="sm" @click="openAddTeamSheet(project)">
                <Users class="h-3.5 w-3.5 mr-1" />
                Team
              </Button>
              <Button variant="ghost" size="icon" class="h-8 w-8">
                <MoreVertical class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid md:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <FolderKanban class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Total</p>
              <p class="text-2xl font-bold text-foreground">{{ projects.length }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle2 class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Completed</p>
              <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ projects.filter(p => p.progress === 100).length }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <Clock class="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">In Progress</p>
              <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ projects.filter(p => p.progress > 0 && p.progress < 100).length }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
              <AlertCircle class="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Overdue</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-slate-400">0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Sheet v-model:open="showCreateProjectSheet">
      <SheetContent class="w-full sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{{ editingProject ? 'Edit Project' : 'Create New Project' }}</SheetTitle>
          <SheetDescription>
            {{ editingProject ? 'Update project details' : 'Set up a new project for your team' }}
          </SheetDescription>
        </SheetHeader>
        <div class="space-y-4 py-4">
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
        <SheetFooter>
          <Button variant="outline" @click="showCreateProjectSheet = false">Cancel</Button>
          <Button @click="saveProject">{{ editingProject ? 'Save Changes' : 'Create Project' }}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>

    <Sheet v-model:open="showAddTeamSheet">
      <SheetContent class="w-full sm:w-[450px]">
        <SheetHeader>
          <SheetTitle>Add Team Members</SheetTitle>
          <SheetDescription>Invite team members to {{ selectedProject?.name }}</SheetDescription>
        </SheetHeader>
        <div class="space-y-4 py-4">
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
        <SheetFooter>
          <Button variant="outline" @click="showAddTeamSheet = false">Cancel</Button>
          <Button @click="addTeammate">
            <Plus class="h-4 w-4 mr-1" />
            Add Member
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>
