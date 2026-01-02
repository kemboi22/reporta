<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Grid3x3,
  List,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Send,
  Copy,
  Check,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const viewMode = ref<"grid" | "list">("grid");
const searchQuery = ref("");
const selectedDepartment = ref("");
const selectedStatus = ref("all");
const showAddStaffDialog = ref(false);
const showInviteDialog = ref(false);
const showInvitationsDialog = ref(false);
const isLoading = ref(false);
const error = ref<string | null>(null);
const inviteLink = ref("");
const copiedToClipboard = ref("");

const { data: departments, refresh: refreshDepartments } = await useFetch(
  `/api/${organizationId}/departments`,
);
const statuses = ["All", "Active", "On Leave", "Suspended"];

const showAddDepartmentDialog = ref(false);
const newDepartmentForm = ref({
  name: "",
  description: "",
  headId: "",
});

const inviteForm = ref({
  email: "",
  role: "MEMBER" as "OWNER" | "ADMIN" | "MEMBER" | "VIEWER",
  departmentId: "",
});

const sendInvitation = async () => {
  isLoading.value = true;
  error.value = null;
  inviteLink.value = "";

  try {
    const invitation = await $fetch(`/api/${organizationId}/invitations`, {
      method: "POST",
      body: {
        email: inviteForm.value.email,
        role: inviteForm.value.role,
        departmentId: inviteForm.value.departmentId || undefined,
      },
    });

    inviteLink.value = `${window.location.origin}/invite/${invitation.token}`;
    inviteForm.value = {
      email: "",
      role: "MEMBER",
      departmentId: "",
    };
  } catch (e: any) {
    error.value = e.data?.message || "Failed to send invitation";
  } finally {
    isLoading.value = false;
  }
};

const copyInviteLink = async (token: string, id: string) => {
  let link = window.location.origin + "/invite/" + token;
  try {
    await navigator.clipboard.writeText(link);
    copiedToClipboard.value = id;
    setTimeout(() => {
      copiedToClipboard.value = "";
    }, 2000);
    toast.success("Invitation link copied successful");
  } catch (e) {
    console.error("Failed to copy:", e);
  }
};

const { data: pendingInvitations, refresh: refreshInvitations } =
  await useLazyFetch(`/api/${organizationId}/invitations`);

const formatExpiry = (date: string) => {
  const expiry = new Date(date);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Expired";
  return `${days} day${days > 1 ? "s" : ""}`;
};

const addDepartment = async () => {
  try {
    await $fetch(`/api/${organizationId}/departments`, {
      method: "POST",
      body: {
        name: newDepartmentForm.value.name,
        description: newDepartmentForm.value.description || undefined,
      },
    });
    showAddDepartmentDialog.value = false;
    newDepartmentForm.value = {
      name: "",
      description: "",
      headId: "",
    };
    await refreshDepartments();
  } catch (e: any) {
    error.value = e.data?.message || "Failed to add department";
  }
};

const { data: staffMembers, refresh: refreshStaff } = await useFetch(
  `/api/${organizationId}/staff`,
  {
    query: {
      search: searchQuery,
      departmentId: selectedDepartment,
    },
  },
);

const newStaffForm = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  employeeId: "",
  departmentId: "",
  position: "",
  employmentType: "FULL_TIME" as const,
  hireDate: "",
});

const addStaffMember = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    await $fetch(`/api/${organizationId}/staff`, {
      method: "POST",
      body: {
        firstName: newStaffForm.value.firstName,
        lastName: newStaffForm.value.lastName,
        email: newStaffForm.value.email,
        phone: newStaffForm.value.phone || undefined,
        employeeId: newStaffForm.value.employeeId || undefined,
        departmentId: newStaffForm.value.departmentId || undefined,
        position: newStaffForm.value.position || undefined,
        employmentType: newStaffForm.value.employmentType,
        hireDate: newStaffForm.value.hireDate
          ? new Date(newStaffForm.value.hireDate)
          : new Date(),
        isActive: true,
      },
    });

    showAddStaffDialog.value = false;
    newStaffForm.value = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      employeeId: "",
      departmentId: "",
      position: "",
      employmentType: "FULL_TIME",
      hireDate: "",
    };
    await refreshStaff();
  } catch (e: any) {
    error.value = e.data?.message || "Failed to add staff member";
  } finally {
    isLoading.value = false;
  }
};

watch([searchQuery, selectedDepartment], () => {
  refreshStaff();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Staff Directory</h1>
        <p class="text-muted-foreground mt-1">
          Manage your organization's workforce
        </p>
      </div>

      <div class="flex items-center gap-3">
        <Dialog v-model:open="showAddDepartmentDialog">
          <DialogTrigger as-child>
            <Button variant="outline">
              <Plus class="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>Create a new department</DialogDescription>
            </DialogHeader>
            <div class="space-y-4 py-4">
              <div
                v-if="error"
                class="p-3 bg-destructive/10 text-destructive rounded-md text-sm"
              >
                {{ error }}
              </div>
              <div class="space-y-2">
                <Label for="deptName">Department Name</Label>
                <Input
                  id="deptName"
                  v-model="newDepartmentForm.name"
                  placeholder="e.g., Engineering"
                />
              </div>
              <div class="space-y-2">
                <Label for="deptDescription">Description</Label>
                <Textarea
                  id="deptDescription"
                  v-model="newDepartmentForm.description"
                  placeholder="Optional description..."
                />
              </div>
              <div class="flex justify-end gap-3">
                <Button
                  variant="outline"
                  @click="showAddDepartmentDialog = false"
                  >Cancel</Button
                >
                <Button @click="addDepartment">Add Department</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog v-model:open="showInviteDialog">
          <DialogTrigger as-child>
            <Button variant="outline">
              <Send class="h-4 w-4 mr-2" />
              Invite Staff
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Staff Member</DialogTitle>
              <DialogDescription
                >Send an invitation link to join your
                organization</DialogDescription
              >
            </DialogHeader>
            <div class="space-y-4 py-4">
              <div
                v-if="error"
                class="p-3 bg-destructive/10 text-destructive rounded-md text-sm"
              >
                {{ error }}
              </div>

              <div v-if="inviteLink" class="space-y-3">
                <div
                  class="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-md"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <Check
                      class="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                    />
                    <p
                      class="font-semibold text-emerald-900 dark:text-emerald-100"
                    >
                      Invitation Created!
                    </p>
                  </div>
                  <p
                    class="text-sm text-emerald-700 dark:text-emerald-300 mb-3"
                  >
                    Share this link with staff member to join your organization
                  </p>
                  <div class="flex gap-2">
                    <Input :value="inviteLink" readonly class="flex-1" />
                    <Button
                      @click="copyInviteLink(inviteLink, 'new')"
                      :variant="
                        copiedToClipboard === 'new' ? 'default' : 'outline'
                      "
                      class="shrink-0"
                    >
                      <Copy
                        v-if="copiedToClipboard !== 'new'"
                        class="h-4 w-4"
                      />
                      <Check v-else class="h-4 w-4" />
                      {{ copiedToClipboard === "new" ? "Copied!" : "Copy" }}
                    </Button>
                  </div>
                </div>
                <div class="flex justify-end">
                  <Button variant="outline" @click="showInviteDialog = false">
                    Close
                  </Button>
                </div>
              </div>

              <div v-else class="space-y-4">
                <div class="space-y-2">
                  <Label for="inviteEmail">Email Address</Label>
                  <Input
                    id="inviteEmail"
                    v-model="inviteForm.email"
                    type="email"
                    placeholder="staff@example.com"
                  />
                </div>

                <div class="space-y-2">
                  <Label for="inviteRole">Role</Label>
                  <Select v-model="inviteForm.role">
                    <SelectTrigger id="inviteRole">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2">
                  <Label for="inviteDepartment">Department (Optional)</Label>
                  <Select v-model="inviteForm.departmentId">
                    <SelectTrigger id="inviteDepartment">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="null">No Department</SelectItem>
                      <SelectItem
                        v-for="dept in departments"
                        :key="dept.id"
                        :value="dept.id"
                      >
                        {{ dept.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="flex justify-end gap-3">
                  <Button variant="outline" @click="showInviteDialog = false"
                    >Cancel</Button
                  >
                  <Button
                    @click="sendInvitation"
                    :disabled="isLoading || !inviteForm.email"
                  >
                    <Send v-if="!isLoading" class="h-4 w-4 mr-2" />
                    <span v-if="isLoading">Sending...</span>
                    <span v-else>Send Invitation</span>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          v-model:open="showInvitationsDialog"
          @open-change="(open) => open && refreshInvitations()"
        >
          <DialogTrigger as-child>
            <Button variant="outline">
              <Mail class="h-4 w-4 mr-2" />
              View Invitations
              <Badge
                v-if="pendingInvitations && pendingInvitations.length > 0"
                class="ml-2"
              >
                {{ pendingInvitations.length }}
              </Badge>
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pending Invitations</DialogTitle>
              <DialogDescription
                >View and manage your organization's pending
                invitations</DialogDescription
              >
            </DialogHeader>
            <div class="space-y-4 py-4">
              <div
                v-if="!pendingInvitations || pendingInvitations.length === 0"
                class="text-center py-8 text-muted-foreground"
              >
                <Mail class="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No pending invitations</p>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="invitation in pendingInvitations"
                  :key="invitation.id"
                  class="border border-border rounded-lg p-4 space-y-3"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1 space-y-2">
                      <div class="flex items-center gap-3">
                        <Mail class="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p class="font-medium">{{ invitation.email }}</p>
                          <p class="text-sm text-muted-foreground">
                            Invited by {{ invitation.inviter.name }}
                          </p>
                        </div>
                      </div>
                      <div class="flex flex-wrap gap-2 ml-8">
                        <Badge variant="secondary">{{ invitation.role }}</Badge>
                        <Badge v-if="invitation.department" variant="outline">{{
                          invitation.department.name
                        }}</Badge>
                        <Badge
                          :variant="
                            formatExpiry(invitation.expiresAt) === 'Expired'
                              ? 'destructive'
                              : 'default'
                          "
                        >
                          {{ formatExpiry(invitation.expiresAt) }}
                        </Badge>
                      </div>
                      <div class="ml-8">
                        <p class="text-xs text-muted-foreground">
                          Created
                          {{
                            new Date(invitation.createdAt).toLocaleDateString()
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex items-center gap-2 pt-2 border-t border-border"
                  >
                    <Input
                      :value="`/invite/${invitation.token}`"
                      readonly
                      class="flex-1 text-sm"
                    />
                    <Button
                      @click="
                        copyInviteLink(`${invitation.token}`, invitation.id)
                      "
                      :variant="
                        copiedToClipboard === invitation.id
                          ? 'default'
                          : 'outline'
                      "
                      size="sm"
                    >
                      <Copy
                        v-if="copiedToClipboard !== invitation.id"
                        class="h-4 w-4"
                      />
                      <Check v-else class="h-4 w-4" />
                      {{
                        copiedToClipboard === invitation.id ? "Copied!" : "Copy"
                      }}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog v-model:open="showAddStaffDialog">
          <DialogTrigger as-child>
            <Button>
              <Plus class="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription
                >Enter the details of the new staff member</DialogDescription
              >
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <div
                v-if="error"
                class="p-3 bg-destructive/10 text-destructive rounded-md text-sm"
              >
                {{ error }}
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    v-model="newStaffForm.firstName"
                    placeholder="John"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    v-model="newStaffForm.lastName"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    v-model="newStaffForm.email"
                    type="email"
                    placeholder="john.doe@hospital.com"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="phone">Phone</Label>
                  <Input
                    id="phone"
                    v-model="newStaffForm.phone"
                    placeholder="+1 234-567-8900"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    v-model="newStaffForm.employeeId"
                    placeholder="EMP007"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="hireDate">Hire Date</Label>
                  <Input
                    id="hireDate"
                    v-model="newStaffForm.hireDate"
                    type="date"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="department">Department</Label>
                  <Select v-model="newStaffForm.departmentId">
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="null">No Department</SelectItem>
                      <SelectItem
                        v-for="dept in departments"
                        :key="dept.id"
                        :value="dept.id"
                      >
                        {{ dept.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="space-y-2">
                  <Label for="position">Position/Role</Label>
                  <Input
                    id="position"
                    v-model="newStaffForm.position"
                    placeholder="Nurse"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <Label for="employmentType">Employment Type</Label>
                <Select v-model="newStaffForm.employmentType">
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
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
              <div class="flex justify-end gap-3">
                <Button variant="outline" @click="showAddStaffDialog = false"
                  >Cancel</Button
                >
                <Button
                  class="bg-blue-600 hover:bg-blue-700 text-white"
                  @click="addStaffMember"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading">Adding...</span>
                  <span v-else>Add Staff Member</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- Filters and Search -->
    <Card class="border-border">
      <CardContent class="p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search by name, ID, or email..."
              class="pl-10"
            />
          </div>

          <!-- Filters -->
          <div class="flex gap-3">
            <Select v-model="selectedDepartment">
              <SelectTrigger class="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="null">All Departments</SelectItem>
                <SelectItem
                  v-for="dept in departments"
                  :key="dept.id"
                  :value="dept.id"
                >
                  {{ dept.name }}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select v-model="selectedStatus">
              <SelectTrigger class="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="status in statuses"
                  :key="status"
                  :value="status.toLowerCase()"
                >
                  {{ status }}
                </SelectItem>
              </SelectContent>
            </Select>

            <!-- View Toggle -->
            <div class="flex border border-border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                :class="viewMode === 'grid' && 'bg-muted'"
                @click="viewMode = 'grid'"
              >
                <Grid3x3 class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :class="viewMode === 'list' && 'bg-muted'"
                @click="viewMode = 'list'"
              >
                <List class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Staff Grid View -->
    <div
      v-if="viewMode === 'grid'"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-if="!staffMembers || staffMembers.length === 0"
        class="col-span-full text-center py-12 text-muted-foreground"
      >
        No staff members found
      </div>
      <Card
        v-for="staff in staffMembers"
        :key="staff.id"
        class="border-border hover:shadow-lg transition-all cursor-pointer"
      >
        <CardContent class="p-6">
          <div class="flex items-start justify-between mb-4">
            <Avatar class="h-16 w-16">
              <AvatarImage
                :src="staff.user?.image || '/placeholder-user.jpg'"
              />
              <AvatarFallback class="bg-primary/10 text-primary text-lg">
                {{
                  `${staff.firstName?.[0] || ""}${staff.lastName?.[0] || ""}`
                }}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>

          <div class="space-y-3">
            <div>
              <h3 class="text-lg font-semibold text-foreground">
                {{
                  `${staff.firstName || ""} ${staff.lastName || ""}`.trim() ||
                  "Unknown"
                }}
              </h3>
              <p class="text-sm text-muted-foreground">
                {{ staff.employeeId || "No ID" }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <Badge class="bg-primary/10 text-primary hover:bg-primary/20">{{
                staff.department?.name || "No Department"
              }}</Badge>
              <Badge
                :class="{
                  'bg-emerald-50 text-emerald-500 hover:bg-emerald-50':
                    staff.isActive,
                  'bg-red-50 text-red-500 hover:bg-red-50': !staff.isActive,
                }"
                >{{ staff.isActive ? "Active" : "Inactive" }}</Badge
              >
            </div>

            <div class="space-y-2 pt-2 border-t border-border">
              <div
                class="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Mail class="h-4 w-4" />
                <span class="truncate">{{ staff.email }}</span>
              </div>
              <div
                class="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Phone class="h-4 w-4" />
                <span>{{ staff.phone || "No phone" }}</span>
              </div>
            </div>

            <div class="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                class="flex-1"
                @click="navigateTo(`/${organizationId}/hr/staff/${staff.id}`)"
              >
                View Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Staff List View -->
    <Card v-else class="border-border">
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-muted border-b border-border">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Staff
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Employee ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Position
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-background divide-y divide-border">
              <tr v-if="!staffMembers || staffMembers.length === 0">
                <td
                  colspan="7"
                  class="px-6 py-12 text-center text-muted-foreground"
                >
                  No staff members found
                </td>
              </tr>
              <tr
                v-for="staff in staffMembers"
                :key="staff.id"
                class="hover:bg-muted transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <Avatar class="h-10 w-10">
                      <AvatarImage
                        :src="staff.user?.image || '/placeholder-user.jpg'"
                      />
                      <AvatarFallback class="bg-primary/10 text-primary">
                        {{
                          `${staff.firstName?.[0] || ""}${staff.lastName?.[0] || ""}`
                        }}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div class="text-sm font-medium text-foreground">
                        {{
                          `${staff.firstName || ""} ${staff.lastName || ""}`.trim() ||
                          "Unknown"
                        }}
                      </div>
                      <div class="text-sm text-muted-foreground">
                        {{ staff.employmentType?.replace("_", " ") || "N/A" }}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground"
                >
                  {{ staff.employeeId || "N/A" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge
                    class="bg-primary/10 text-primary hover:bg-primary/20"
                    >{{ staff.department?.name || "No Department" }}</Badge
                  >
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground"
                >
                  {{ staff.position || "N/A" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge
                    :class="{
                      'bg-emerald-50 text-emerald-500 hover:bg-emerald-50':
                        staff.isActive,
                      'bg-red-50 text-red-500 hover:bg-red-50': !staff.isActive,
                    }"
                    >{{ staff.isActive ? "Active" : "Inactive" }}</Badge
                  >
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground"
                >
                  <div>{{ staff.email }}</div>
                  <div class="text-muted-foreground">
                    {{ staff.phone || "No phone" }}
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="
                      navigateTo(`/${organizationId}/hr/staff/${staff.id}`)
                    "
                  >
                    View
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
