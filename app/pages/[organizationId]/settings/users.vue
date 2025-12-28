<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta } from "#imports";
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Shield,
  Mail,
  Edit2,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Crown,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

definePageMeta({
  layout: "dashboard",
});

const searchQuery = ref("");
const showAddUserSheet = ref(false);
const editingUser = ref<any>(null);
const selectedRole = ref("all");
const selectedStatus = ref("all");

const roles = [
  { id: "all", name: "All Roles" },
  { id: "admin", name: "Admin" },
  { id: "manager", name: "Manager" },
  { id: "staff", name: "Staff" },
  { id: "viewer", name: "Viewer" },
];

const users = ref([
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "admin",
    department: "Pharmacy",
    status: "active",
    lastActive: "2 hours ago",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@company.com",
    role: "manager",
    department: "Nursing",
    status: "active",
    lastActive: "5 minutes ago",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@company.com",
    role: "staff",
    department: "Pharmacy",
    status: "active",
    lastActive: "1 day ago",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james@company.com",
    role: "manager",
    department: "Administration",
    status: "active",
    lastActive: "3 hours ago",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 5,
    name: "Robert Taylor",
    email: "robert@company.com",
    role: "staff",
    department: "Maintenance",
    status: "inactive",
    lastActive: "2 weeks ago",
    photo: "/placeholder-user.jpg",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa@company.com",
    role: "viewer",
    department: "HR",
    status: "pending",
    lastActive: "Never",
    photo: "/placeholder-user.jpg",
  },
]);

const permissions = {
  admin: { label: "Admin", icon: Crown, color: "bg-purple-500", description: "Full access to all features" },
  manager: { label: "Manager", icon: ShieldCheck, color: "bg-blue-500", description: "Manage team and tasks" },
  staff: { label: "Staff", icon: Shield, color: "bg-emerald-500", description: "View and complete tasks" },
  viewer: { label: "Viewer", icon: ShieldAlert, color: "bg-slate-500", description: "Read-only access" },
};

const getFilteredUsers = () => {
  return users.value.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesRole = selectedRole.value === "all" || user.role === selectedRole.value;
    const matchesStatus = selectedStatus.value === "all" || user.status === selectedStatus.value;
    return matchesSearch && matchesRole && matchesStatus;
  });
};

const getInitials = (name: string) => {
  return name.split(" ").map((n) => n[0]).join("");
};

const openAddUserSheet = () => {
  editingUser.value = null;
  showAddUserSheet.value = true;
};

const openEditUserSheet = (user: any) => {
  editingUser.value = { ...user };
  showAddUserSheet.value = true;
};

const saveUser = () => {
  showAddUserSheet.value = false;
};

const deleteUser = (id: number) => {
  const index = users.value.findIndex((u) => u.id === id);
  if (index > -1) {
    users.value.splice(index, 1);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">User Management</h1>
        <p class="text-muted-foreground mt-1">Manage team members and access permissions</p>
      </div>
      <Button @click="openAddUserSheet">
        <UserPlus class="h-4 w-4 mr-2" />
        Add User
      </Button>
    </div>

    <Card>
      <CardContent class="p-4">
        <div class="flex flex-col md:flex-row items-center gap-4">
          <div class="relative flex-1 w-full">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input v-model="searchQuery" placeholder="Search users by name or email..." class="pl-10" />
          </div>
          <div class="flex gap-2">
            <Select v-model="selectedRole">
              <SelectTrigger class="w-[140px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</SelectItem>
              </SelectContent>
            </Select>
            <Select v-model="selectedStatus">
              <SelectTrigger class="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <Tabs default-value="users" class="w-full">
      <TabsList class="grid w-full md:w-auto md:inline-grid grid-cols-2 bg-muted/50">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
      </TabsList>

      <TabsContent value="users" class="space-y-4">
        <Card>
          <CardContent class="p-0">
            <div class="divide-y">
              <div v-for="user in getFilteredUsers()" :key="user.id" class="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div class="flex items-center gap-3">
                  <Avatar class="h-12 w-12">
                    <AvatarImage :src="user.photo" />
                    <AvatarFallback class="bg-primary text-primary-foreground">
                      {{ getInitials(user.name) }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-medium text-foreground">{{ user.name }}</h4>
                      <Badge v-if="user.status === 'active'" variant="default" class="text-xs bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                      <Badge v-else-if="user.status === 'inactive'" variant="secondary" class="text-xs">Inactive</Badge>
                      <Badge v-else-if="user.status === 'pending'" variant="outline" class="text-xs">Pending</Badge>
                    </div>
                    <p class="text-sm text-muted-foreground">{{ user.email }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" class="text-xs">{{ user.department }}</Badge>
                      <div class="flex items-center gap-1 text-xs text-muted-foreground">
                        <component :is="permissions[user.role as keyof typeof permissions].icon" :class="['h-3 w-3', permissions[user.role as keyof typeof permissions].color.replace('bg-', 'text-').replace('500', '-500')]" />
                        {{ permissions[user.role as keyof typeof permissions].label }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <p class="text-xs text-muted-foreground mr-2">Active {{ user.lastActive }}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="h-8 w-8">
                        <MoreVertical class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="openEditUserSheet(user)">
                        <Edit2 class="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                      <DropdownMenuItem>View Activity</DropdownMenuItem>
                      <DropdownMenuItem class="text-destructive" @click="deleteUser(user.id)">
                        <Trash2 class="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="roles" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <Card v-for="(perm, role) in permissions" :key="role" class="hover:shadow-md transition-all">
            <CardContent class="p-6">
              <div class="flex items-start gap-4 mb-4">
                <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', perm.color, 'text-white']">
                  <component :is="perm.icon" class="h-6 w-6" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-foreground text-lg">{{ perm.label }}</h3>
                  <p class="text-sm text-muted-foreground mt-1">{{ perm.description }}</p>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-foreground">Total Users</span>
                  <Badge variant="secondary">{{ users.value.filter(u => u.role === role).length }}</Badge>
                </div>
                <Button variant="outline" class="w-full mt-2" size="sm">
                  View Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>

    <Sheet v-model:open="showAddUserSheet">
      <SheetContent class="w-full sm:w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{{ editingUser ? 'Edit User' : 'Add New User' }}</SheetTitle>
          <SheetDescription>
            {{ editingUser ? 'Update user information' : 'Invite a new team member to join your organization' }}
          </SheetDescription>
        </SheetHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" :value="editingUser?.name" />
          </div>
          <div class="space-y-2">
            <Label for="email">Email Address</Label>
            <Input id="email" type="email" placeholder="john@company.com" :value="editingUser?.email" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="role">Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="(perm, role) in permissions" :key="role" :value="role">
                    <div class="flex items-center gap-2">
                      <component :is="perm.icon" class="h-4 w-4" />
                      {{ perm.label }}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="department">Department</Label>
              <Input id="department" placeholder="e.g., Pharmacy" :value="editingUser?.department" />
            </div>
          </div>
          <div class="space-y-2">
            <Label>Send Invitation Email</Label>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail class="h-4 w-4" />
              <span>An email will be sent to the user with setup instructions</span>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" @click="showAddUserSheet = false">Cancel</Button>
          <Button @click="saveUser">{{ editingUser ? 'Save Changes' : 'Send Invitation' }}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>
