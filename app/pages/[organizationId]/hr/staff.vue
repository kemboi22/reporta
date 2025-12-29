<script setup lang="ts">
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
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

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
const isLoading = ref(false);
const error = ref<string | null>(null);

const { data: departments } = await useFetch(
  `/api/${organizationId}/departments`,
);
const statuses = ["All", "Active", "On Leave", "Suspended"];

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

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-500 hover:bg-emerald-50",
    "On Leave": "bg-amber-50 text-amber-500 hover:bg-amber-50",
    Suspended: "bg-red-50 text-red-500 hover:bg-red-50",
  };
  return colors[status] || "bg-muted text-muted-foreground";
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
};

const getStaffName = (staff: any) => {
  return `${staff.firstName || ""} ${staff.lastName || ""}`.trim() || "Unknown";
};

const getStaffPhoto = (staff: any) => {
  return staff.user?.image || "/placeholder-user.jpg";
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
              <AvatarImage :src="getStaffPhoto(staff)" />
              <AvatarFallback class="bg-primary/10 text-primary text-lg">
                {{ getInitials(staff.firstName, staff.lastName) }}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>

          <div class="space-y-3">
            <div>
              <h3 class="text-lg font-semibold text-foreground">
                {{ getStaffName(staff) }}
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
                :class="getStatusColor(staff.isActive ? 'Active' : 'Inactive')"
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
              <Button variant="outline" size="sm" class="flex-1">
                View Profile
              </Button>
              <Button variant="outline" size="sm" class="flex-1">
                Assign Task
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
                      <AvatarImage :src="getStaffPhoto(staff)" />
                      <AvatarFallback class="bg-primary/10 text-primary">
                        {{ getInitials(staff.firstName, staff.lastName) }}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div class="text-sm font-medium text-foreground">
                        {{ getStaffName(staff) }}
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
                    :class="
                      getStatusColor(staff.isActive ? 'Active' : 'Inactive')
                    "
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
                  <Button variant="ghost" size="sm"> View </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
