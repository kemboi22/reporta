<script setup lang="ts">
import { ref, computed } from "vue";
import { definePageMeta, navigateTo } from "#imports";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, MapPin, Calendar, Building2, Briefcase, DollarSign, Clock, FileText, Settings, Edit, MoreVertical, ArrowLeft, UserPlus, Link, Link2, UserCog } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { canManageUsers } from "~/utils";

definePageMeta({
  layout: "dashboard",
});

if (!canManageUsers()) {
  navigateTo(`/${organizationId}/dashboard`);
}

const route = useRoute();
const organizationId = route.params.organizationId as string;
const staffId = route.params.id as string;

const { data: staff, pending: isLoading, error, refresh: refreshStaff } = await useFetch(`/api/${organizationId}/staff/${staffId}`);

const { data: orgUsers, refresh: refreshOrgUsers } = await useLazyFetch(`/api/${organizationId}/users`);

const showEditDialog = ref(false);
const editedStaff = ref({
  userId: staff.value?.userId || null,
});

const showLinkUserDialog = ref(false);
const selectedUserId = ref<string | null>(null);

const linkUserAccount = async () => {
  try {
    await $fetch(`/api/${organizationId}/staff/${staffId}`, {
      method: "PUT",
      body: {
        userId: selectedUserId.value,
      },
    });
    showLinkUserDialog.value = false;
    await refreshNuxtData();
    await refreshStaff();
  } catch (e: any) {
    console.error("Failed to link user account:", e);
  }
};

const unlinkUserAccount = async () => {
  try {
    await $fetch(`/api/${organizationId}/staff/${staffId}`, {
      method: "PUT",
      body: {
        userId: null,
      },
    });
    await refreshNuxtData();
    await refreshStaff();
  } catch (e: any) {
    console.error("Failed to unlink user account:", e);
  }
};

const editStaff = async () => {
  try {
    await $fetch(`/api/${organizationId}/staff/${staffId}`, {
      method: "PUT",
      body: editedStaff.value,
    });
    showEditDialog.value = false;
    await refreshNuxtData();
  } catch (e: any) {
    console.error("Failed to update staff:", e);
  }
};

const getAttendanceStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PRESENT: "bg-emerald-500",
    ABSENT: "bg-red-500",
    LATE: "bg-amber-500",
    HALF_DAY: "bg-orange-500",
  };
  return colors[status] || "bg-gray-500";
};

const getLeaveStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-500",
    APPROVED: "bg-emerald-500",
    REJECTED: "bg-red-500",
    CANCELLED: "bg-gray-500",
  };
  return colors[status] || "bg-gray-500";
};

const getLeaveTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    SICK: "bg-red-100 text-red-700",
    VACATION: "bg-blue-100 text-blue-700",
    PERSONAL: "bg-purple-100 text-purple-700",
    MATERNITY: "bg-pink-100 text-pink-700",
    PATERNITY: "bg-cyan-100 text-cyan-700",
    UNPAID: "bg-gray-100 text-gray-700",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
};

const getEmploymentTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERN: "Intern",
    FREELANCE: "Freelance",
  };
  return labels[type] || type;
};

const totalAttendanceDays = ref(0);
const presentDays = ref(0);
const attendanceRate = ref(0);

const totalLeaveTaken = ref(0);
const approvedLeave = ref(0);
const pendingLeave = ref(0);

const averageRating = ref(0);

const showRoleDialog = ref(false);
const selectedRole = ref("MEMBER");

const openRoleDialog = () => {
  if (staff.value?.user) {
    selectedRole.value = staff.value.user.organizationUsers?.[0]?.role || "MEMBER";
    showRoleDialog.value = true;
  }
};

const updateUserRole = async () => {
  if (!staff.value?.user?.id) return;
  
  try {
    await $fetch(`/api/${organizationId}/users/${staff.value.user.id}`, {
      method: "PUT",
      body: {
        role: selectedRole.value,
      },
    });
    showRoleDialog.value = false;
    await refreshNuxtData();
    await refreshStaff();
    toast.success("Role updated successfully");
  } catch (e: any) {
    console.error("Failed to update role:", e);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <p class="text-muted-foreground">Loading...</p>
    </div>
    <div v-else-if="error" class="flex items-center justify-center py-12">
      <p class="text-destructive">Failed to load staff profile</p>
    </div>
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <Button variant="ghost" @click="navigateTo(`/${organizationId}/hr/staff`)">
          <ArrowLeft class="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Avatar class="h-16 w-16">
          <AvatarImage :src="staff?.user?.image" />
          <AvatarFallback class="text-2xl">{{ staff?.firstName?.charAt(0) }}{{ staff?.lastName?.charAt(0) }}</AvatarFallback>
        </Avatar>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold text-foreground">
              {{ staff?.firstName }} {{ staff?.lastName }}
            </h1>
            <Badge v-if="staff?.isActive" class="bg-emerald-500 text-white">Active</Badge>
            <Badge v-else class="bg-gray-500 text-white">Inactive</Badge>
            <Badge v-if="staff?.userId" class="bg-blue-500 text-white">
              <Link2 class="h-3 w-3 mr-1" />
              Linked to User
            </Badge>
            <Badge v-else class="bg-amber-500 text-white">
              No User Account
            </Badge>
          </div>
          <p class="text-muted-foreground">{{ staff?.position }}</p>
          <p class="text-sm text-muted-foreground">{{ staff?.department?.name }}</p>
          <p v-if="staff?.user" class="text-sm text-muted-foreground">
            User: {{ staff?.user?.name }} ({{ staff?.user?.email }})
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Button variant="outline">
          <Settings class="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Dialog v-model:open="showLinkUserDialog" v-if="!staff?.userId">
          <DialogTrigger as-child>
            <Button>
              <UserPlus class="h-4 w-4 mr-2" />
              Link User Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link User Account</DialogTitle>
            </DialogHeader>
            <div class="space-y-4">
              <div>
                <Label>Select User</Label>
                <Select v-model="selectedUserId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="user in orgUsers"
                      :key="user.id"
                      :value="user.id"
                      :disabled="user.staff?.id && user.staff.id !== staffId"
                    >
                      <div class="flex items-center gap-2">
                        <span>{{ user.name }} ({{ user.email }})</span>
                        <Badge v-if="user.staff?.id === staffId" class="bg-emerald-500 text-white text-xs">Current</Badge>
                        <Badge v-else-if="user.staff" class="bg-amber-500 text-white text-xs">Linked to {{ user.staff.firstName }} {{ user.staff.lastName }}</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex gap-2">
                <Button @click="linkUserAccount">Link Account</Button>
                <Button variant="outline" @click="showLinkUserDialog = false">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="outline" @click="unlinkUserAccount" v-if="staff?.userId">
          <UserPlus class="h-4 w-4 mr-2" />
          Unlink User Account
        </Button>
        <Dialog v-model:open="showEditDialog">
          <DialogTrigger as-child>
            <Button>
              <Edit class="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Staff Profile</DialogTitle>
            </DialogHeader>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <Label>User Account</Label>
                <Select v-model="editedStaff.userId">
                  <SelectTrigger>
                    <SelectValue :placeholder="staff?.userId ? 'Change linked user' : 'Select a user to link'" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="null">
                      No user account
                    </SelectItem>
                    <SelectItem
                      v-for="user in orgUsers"
                      :key="user.id"
                      :value="user.id"
                      :disabled="user.staff?.id && user.staff.id !== staffId"
                    >
                      <div class="flex items-center gap-2">
                        <span>{{ user.name }} ({{ user.email }})</span>
                        <Badge v-if="user.staff?.id === staffId" class="bg-emerald-500 text-white text-xs">Current</Badge>
                        <Badge v-else-if="user.staff" class="bg-amber-500 text-white text-xs">Linked to {{ user.staff.firstName }} {{ user.staff.lastName }}</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p class="text-xs text-muted-foreground mt-1">
                  Link a user account to allow this staff member to be assigned tasks, log in, and more.
                </p>
              </div>
              <div>
                <Label>First Name</Label>
                <Input v-model="editedStaff.firstName" />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input v-model="editedStaff.lastName" />
              </div>
              <div>
                <Label>Email</Label>
                <Input v-model="editedStaff.email" type="email" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input v-model="editedStaff.phone" />
              </div>
              <div>
                <Label>Position</Label>
                <Input v-model="editedStaff.position" />
              </div>
              <div>
                <Label>Department</Label>
                <Input v-model="editedStaff.department" />
              </div>
              <div>
                <Label>Employee ID</Label>
                <Input v-model="editedStaff.employeeId" />
              </div>
              <div>
                <Label>Employment Type</Label>
                <Select v-model="editedStaff.employmentType">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERN">Intern</SelectItem>
                    <SelectItem value="FREELANCE">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Salary</Label>
                <Input v-model="editedStaff.salary" type="number" />
              </div>
              <div>
                <Label>Currency</Label>
                <Input v-model="editedStaff.currency" />
              </div>
              <div class="md:col-span-2">
                <Label>Address</Label>
                <Input v-model="editedStaff.address" />
              </div>
              <div>
                <Label>City</Label>
                <Input v-model="editedStaff.city" />
              </div>
              <div>
                <Label>State</Label>
                <Input v-model="editedStaff.state" />
              </div>
              <div>
                <Label>Country</Label>
                <Input v-model="editedStaff.country" />
              </div>
              <div>
                <Label>Postal Code</Label>
                <Input v-model="editedStaff.postalCode" />
              </div>
              <div>
                <Label>Hire Date</Label>
                <Input v-model="editedStaff.hireDate" type="date" />
              </div>
              <div>
                <Label>Birth Date</Label>
                <Input v-model="editedStaff.birthDate" type="date" />
              </div>
              <div class="md:col-span-2">
                <Label>Emergency Contact</Label>
                <textarea
                  v-model="editedStaff.emergencyContact"
                  class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button @click="editStaff" class="md:col-span-2">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Calendar class="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Attendance Rate</p>
              <p class="text-2xl font-bold">--%</p>
              <p class="text-xs text-muted-foreground">No data</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Clock class="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Leave Taken</p>
              <p class="text-2xl font-bold">-- days</p>
              <p class="text-xs text-muted-foreground">No data</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <User class="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Avg Rating</p>
              <p class="text-2xl font-bold">--/5</p>
              <p class="text-xs text-muted-foreground">No data</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Briefcase class="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Tenure</p>
              <p class="text-lg font-bold">
                {{ staff?.hireDate ? new Date().getFullYear() - new Date(staff.hireDate).getFullYear() + 'y' : 'N/A' }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Tabs default-value="info" class="space-y-6">
      <TabsList>
        <TabsTrigger value="info">Personal Info</TabsTrigger>
      </TabsList>

      <TabsContent value="info" class="space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <Card class="border-border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex items-start gap-3">
                <User class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Full Name</p>
                  <p class="font-medium">{{ staff?.firstName }} {{ staff?.lastName }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Mail class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Email</p>
                  <p class="font-medium">{{ staff?.email }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Phone class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Phone</p>
                  <p class="font-medium">{{ staff?.phone }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <MapPin class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Address</p>
                  <p class="font-medium">{{ staff?.address }}</p>
                  <p class="font-medium">{{ staff?.city }}, {{ staff?.state }} {{ staff?.postalCode }}</p>
                  <p class="font-medium">{{ staff?.country }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Calendar class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Date of Birth</p>
                  <p class="font-medium">{{ staff?.birthDate ? new Date(staff.birthDate).toLocaleDateString() : 'N/A' }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="border-border">
            <CardHeader>
              <CardTitle>Employment Information</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex items-start gap-3">
                <Building2 class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Employee ID</p>
                  <p class="font-medium">{{ staff?.employeeId }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Briefcase class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Position</p>
                  <p class="font-medium">{{ staff?.position }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Building2 class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Department</p>
                  <p class="font-medium">{{ staff?.department?.name }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Briefcase class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Employment Type</p>
                  <Badge variant="secondary">{{ getEmploymentTypeLabel(staff?.employmentType) }}</Badge>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Calendar class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Hire Date</p>
                  <p class="font-medium">{{ staff?.hireDate ? new Date(staff.hireDate).toLocaleDateString() : 'N/A' }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <DollarSign class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Salary</p>
                  <p class="font-medium">
                    {{ staff?.currency }} {{ staff?.salary?.toLocaleString() }}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card class="border-border">
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="whitespace-pre-line">{{ staff?.emergencyContact || 'N/A' }}</p>
          </CardContent>
        </Card>

        <Card v-if="staff?.workSchedule" class="border-border">
          <CardHeader>
            <CardTitle>Work Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(schedule, day) in staff.workSchedule" :key="day" class="p-3 rounded-lg bg-muted/50">
                <p class="font-medium capitalize">{{ day }}</p>
                <p class="text-sm text-muted-foreground">{{ schedule }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  </div>

  <Dialog v-model:open="showRoleDialog">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Change User Role</DialogTitle>
        <DialogDescription>
          Update the role for {{ staff?.firstName }} {{ staff?.lastName }}
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="staffUserRole">Role</Label>
          <Select v-model="selectedRole">
            <SelectTrigger id="staffUserRole">
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
        <div class="flex justify-end gap-3">
          <Button variant="outline" @click="showRoleDialog = false">
            Cancel
          </Button>
          <Button @click="updateUserRole">
            <UserCog class="h-4 w-4 mr-2" />
            Update Role
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
