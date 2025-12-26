<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, Settings, Plus, MoreVertical, Globe, Mail } from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();

const organization = ref({
  id: route.params.id,
  name: "Acme Corporation",
  slug: "acme-corp",
  description: "Leading technology solutions provider",
  logo: "/placeholder-logo.png",
  website: "https://acme.com",
  industry: "Technology",
  size: "medium",
  createdAt: new Date("2023-01-15"),
});

const workspaces = ref([
  {
    id: "1",
    name: "Engineering",
    slug: "engineering",
    description: "Software development and engineering team",
    color: "#3b82f6",
    members: 12,
    projects: 8,
  },
  {
    id: "2",
    name: "Marketing",
    slug: "marketing",
    description: "Marketing and communications team",
    color: "#8b5cf6",
    members: 8,
    projects: 5,
  },
  {
    id: "3",
    name: "Sales",
    slug: "sales",
    description: "Sales and business development team",
    color: "#10b981",
    members: 15,
    projects: 4,
  },
]);

const members = ref([
  {
    id: "1",
    name: "John Doe",
    email: "john@acme.com",
    avatar: "/placeholder-user.jpg",
    role: "OWNER",
    joinedAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@acme.com",
    avatar: "/placeholder-user.jpg",
    role: "ADMIN",
    joinedAt: new Date("2023-02-01"),
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@acme.com",
    avatar: "/placeholder-user.jpg",
    role: "MEMBER",
    joinedAt: new Date("2023-03-10"),
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@acme.com",
    avatar: "/placeholder-user.jpg",
    role: "MEMBER",
    joinedAt: new Date("2023-04-05"),
  },
]);

const roleColors: Record<string, string> = {
  OWNER: "bg-purple-500",
  ADMIN: "bg-blue-500",
  MEMBER: "bg-gray-500",
  VIEWER: "bg-gray-400",
};

const showAddMember = ref(false);
const showAddWorkspace = ref(false);

const newMember = ref({
  name: "",
  email: "",
  role: "MEMBER",
});

const newWorkspace = ref({
  name: "",
  description: "",
  color: "#3b82f6",
});

const addMember = () => {
  console.log("Adding member:", newMember.value);
  showAddMember.value = false;
};

const addWorkspace = () => {
  console.log("Adding workspace:", newWorkspace.value);
  showAddWorkspace.value = false;
};

const totalMembers = computed(() => {
  return workspaces.value.reduce((sum, ws) => sum + ws.members, 0);
});

const totalProjects = computed(() => {
  return workspaces.value.reduce((sum, ws) => sum + ws.projects, 0);
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">{{ organization.name }}</h1>
        <p class="text-muted-foreground mt-1">{{ organization.description }}</p>
      </div>
      <div class="flex items-center gap-3">
        <Button variant="outline">Settings</Button>
        <Button>
          <Settings class="h-4 w-4 mr-2" />
          Manage
        </Button>
      </div>
    </div>

    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users class="h-6 w-6 text-primary" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Total Members</p>
              <p class="text-2xl font-bold">{{ members.length }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Building2 class="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Workspaces</p>
              <p class="text-2xl font-bold">{{ workspaces.length }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <span class="text-2xl">📊</span>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Projects</p>
              <p class="text-2xl font-bold">{{ totalProjects }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <span class="text-2xl">📅</span>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Created</p>
              <p class="text-lg font-bold">
                {{ organization.createdAt.toLocaleDateString() }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Tabs default-value="workspaces" class="space-y-6">
      <TabsList>
        <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="workspaces" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Workspaces</h2>
          <Dialog v-model:open="showAddWorkspace">
            <DialogTrigger as-child>
              <Button>
                <Plus class="h-4 w-4 mr-2" />
                New Workspace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
              </DialogHeader>
              <div class="space-y-4">
                <div>
                  <Label for="ws-name">Name</Label>
                  <Input id="ws-name" v-model="newWorkspace.name" placeholder="Workspace name" />
                </div>
                <div>
                  <Label for="ws-desc">Description</Label>
                  <Textarea id="ws-desc" v-model="newWorkspace.description" placeholder="Workspace description" />
                </div>
                <div>
                  <Label for="ws-color">Color</Label>
                  <Input id="ws-color" type="color" v-model="newWorkspace.color" class="h-10 w-full" />
                </div>
                <Button @click="addWorkspace" class="w-full">Create Workspace</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="ws in workspaces"
            :key="ws.id"
            class="border-border hover:border-primary/50 transition-colors cursor-pointer"
          >
            <CardHeader>
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="h-12 w-12 rounded-lg flex items-center justify-center"
                    :style="{ backgroundColor: ws.color + '20' }"
                  >
                    <Building2 class="h-6 w-6" :style="{ color: ws.color }" />
                  </div>
                  <div>
                    <CardTitle class="text-lg">{{ ws.name }}</CardTitle>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical class="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground mb-4">{{ ws.description }}</p>
              <div class="flex gap-4 text-sm">
                <div>
                  <span class="font-semibold">{{ ws.members }}</span>
                  <span class="text-muted-foreground ml-1">members</span>
                </div>
                <div>
                  <span class="font-semibold">{{ ws.projects }}</span>
                  <span class="text-muted-foreground ml-1">projects</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="members" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Members</h2>
          <Dialog v-model:open="showAddMember">
            <DialogTrigger as-child>
              <Button>
                <Plus class="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New Member</DialogTitle>
              </DialogHeader>
              <div class="space-y-4">
                <div>
                  <Label for="member-name">Name</Label>
                  <Input id="member-name" v-model="newMember.name" placeholder="Member name" />
                </div>
                <div>
                  <Label for="member-email">Email</Label>
                  <Input id="member-email" type="email" v-model="newMember.email" placeholder="member@email.com" />
                </div>
                <div>
                  <Label for="member-role">Role</Label>
                  <Select v-model="newMember.role">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNER">Owner</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button @click="addMember" class="w-full">Send Invitation</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card class="border-border">
          <CardContent class="p-6">
            <div class="space-y-4">
              <div
                v-for="member in members"
                :key="member.id"
                class="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage :src="member.avatar" />
                    <AvatarFallback>{{ member.name.charAt(0) }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-semibold">{{ member.name }}</h4>
                      <Badge
                        :class="[
                          roleColors[member.role] || 'bg-gray-500',
                          'text-white'
                        ]"
                      >
                        {{ member.role }}
                      </Badge>
                    </div>
                    <div class="flex items-center gap-4 text-sm text-muted-foreground">
                      <div class="flex items-center gap-1">
                        <Mail class="h-3 w-3" />
                        <span>{{ member.email }}</span>
                      </div>
                      <span>Joined {{ member.joinedAt.toLocaleDateString() }}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" class="space-y-6">
        <h2 class="text-xl font-semibold">Organization Settings</h2>
        <Card class="border-border">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <Label>Organization Name</Label>
              <Input :value="organization.name" disabled />
            </div>
            <div>
              <Label>Slug</Label>
              <Input :value="organization.slug" disabled />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea :value="organization.description" />
            </div>
            <div>
              <Label>Website</Label>
              <div class="flex items-center gap-2">
                <Globe class="h-4 w-4 text-muted-foreground" />
                <Input :value="organization.website" />
              </div>
            </div>
            <div>
              <Label>Industry</Label>
              <Input :value="organization.industry" />
            </div>
            <div>
              <Label>Organization Size</Label>
              <Select :value="organization.size">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (1-50)</SelectItem>
                  <SelectItem value="medium">Medium (51-200)</SelectItem>
                  <SelectItem value="large">Large (201-500)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (500+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
