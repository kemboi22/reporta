<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Edit,
  Key,
  Mail,
  User,
  Building2,
  Briefcase,
  MapPin,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";
import { toast } from "vue-sonner";
import { authClient } from "~/lib/auth";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;

const session = authClient.useSession();
const userId = session.value.data?.user?.id;

const staffId = computed(() => userId || null);

const { data: staffData, refresh: refreshStaff } = await useLazyFetch(
  () => `/api/${organizationId}/staff?userId=${staffId.value}`,
  {
    key: `staff-profile-${staffId.value}`,
    transform: (data) => data || null,
  },
);

const staff = computed(() => {
  if (staffData.value?.length > 0) {
    return staffData.value[0];
  }
});

watch(
  () => session.value.data?.user?.id,
  async (newId) => {
    if (newId) {
      await refreshStaff();
    }
  },
);

const { data: departments } = await useLazyFetch(
  `/api/${organizationId}/departments`,
  {
    key: `departments-${organizationId}`,
    transform: (data) => data || [],
  },
);

const showEditDialog = ref(false);
const showPasswordDialog = ref(false);
const isSaving = ref(false);
const isChangingPassword = ref(false);

const editedStaff = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  position: "",
  address: "",
  departmentId: "",
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const openEditDialog = () => {
  if (!staff.value) return;
  editedStaff.value = {
    firstName: staff.value.firstName || "",
    lastName: staff.value.lastName || "",
    email: staff.value.user?.email || staff.value.email || "",
    phone: staff.value.phone || "",
    position: staff.value.position || "",
    address: staff.value.address || "",
    departmentId: staff.value.department?.id || staff.value.departmentId || "",
  };
  showEditDialog.value = true;
};

const saveProfile = async () => {
  if (!staffId.value) {
    toast.error("Invalid profile");
    return;
  }

  isSaving.value = true;
  try {
    await $fetch(`/api/${organizationId}/staff/${staffId.value}`, {
      method: "PUT",
      body: editedStaff.value,
    });
    showEditDialog.value = false;
    await refreshStaff();
    toast.success("Profile updated successfully");
  } catch (error) {
    console.error("Failed to save profile:", error);
    toast.error("Failed to save profile");
  } finally {
    isSaving.value = false;
  }
};

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  if (passwordForm.value.newPassword.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  isChangingPassword.value = true;
  try {
    await authClient.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    });
    showPasswordDialog.value = false;
    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    toast.success("Password changed successfully");
  } catch (error: any) {
    console.error("Failed to change password:", error);
    toast.error(error.message || "Failed to change password");
  } finally {
    isChangingPassword.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-4">
        <Button
          variant="ghost"
          @click="navigateTo(`/${organizationId}/dashboard`)"
        >
          <ArrowLeft class="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 class="text-2xl font-bold text-foreground">My Profile</h1>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="showPasswordDialog = true" size="sm">
          <Key class="h-4 w-4 mr-2" />
          <span class="hidden sm:inline">Change Password</span>
          <span class="sm:hidden">Password</span>
        </Button>
        <Button @click="openEditDialog()" size="sm">
          <Edit class="h-4 w-4 mr-2" />
          <span class="hidden sm:inline">Edit Profile</span>
          <span class="sm:hidden">Edit</span>
        </Button>
      </div>
    </div>

    <div v-if="!staffId" class="flex items-center justify-center py-12">
      <p class="text-muted-foreground">Loading session...</p>
    </div>

    <div v-else-if="!staff" class="flex items-center justify-center py-12">
      <p class="text-muted-foreground">Loading profile...</p>
    </div>

    <template v-else>
      <div class="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <User class="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <Label class="text-muted-foreground text-sm">Email</Label>
              <div class="flex items-center gap-2 mt-1">
                <Mail class="h-4 w-4 text-muted-foreground" />
                <p class="text-sm">
                  {{ staff.user?.email || staff.email || "" }}
                </p>
              </div>
            </div>
            <div>
              <Label class="text-muted-foreground text-sm">Full Name</Label>
              <div class="flex items-center gap-2 mt-1">
                <User class="h-4 w-4 text-muted-foreground" />
                <p class="text-sm">
                  {{ staff.firstName }} {{ staff.lastName }}
                </p>
              </div>
            </div>
            <div>
              <Label class="text-muted-foreground text-sm">Phone</Label>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-sm">{{ staff.phone || "Not provided" }}</p>
              </div>
            </div>
            <div>
              <Label class="text-muted-foreground text-sm">Address</Label>
              <div class="flex items-start gap-2 mt-1">
                <MapPin class="h-4 w-4 text-muted-foreground mt-0.5" />
                <p class="text-sm">{{ staff.address || "Not provided" }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Building2 class="h-5 w-5" />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <Label class="text-muted-foreground text-sm">Employee ID</Label>
              <p class="text-sm mt-1 font-medium">
                {{ staff.employeeId || "Not assigned" }}
              </p>
            </div>
            <div>
              <Label class="text-muted-foreground text-sm">Department</Label>
              <div class="flex items-center gap-2 mt-1">
                <Building2 class="h-4 w-4 text-muted-foreground" />
                <p class="text-sm">
                  {{ staff.department?.name || "Not assigned" }}
                </p>
              </div>
            </div>
            <div>
              <Label class="text-muted-foreground text-sm">Position</Label>
              <div class="flex items-center gap-2 mt-1">
                <Briefcase class="h-4 w-4 text-muted-foreground" />
                <p class="text-sm">{{ staff.position || "Not assigned" }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label class="text-muted-foreground text-sm">Hire Date</Label>
                <p class="text-sm mt-1">
                  {{
                    staff.hireDate
                      ? new Date(staff.hireDate).toLocaleDateString()
                      : "N/A"
                  }}
                </p>
              </div>
              <div>
                <Label class="text-muted-foreground text-sm"
                  >Employment Type</Label
                >
                <p class="text-sm mt-1">{{ staff.employmentType || "N/A" }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>
  </div>

  <Dialog v-model:open="showEditDialog">
    <DialogContent class="max-w-2xl w-full mx-4">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription
          >Update your personal information and employment
          details.</DialogDescription
        >
      </DialogHeader>
      <div class="space-y-4 max-h-[70vh] overflow-y-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input v-model="editedStaff.firstName" />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input v-model="editedStaff.lastName" />
          </div>
        </div>
        <div>
          <Label>Email</Label>
          <Input v-model="editedStaff.email" type="email" />
        </div>
        <div>
          <Label>Phone</Label>
          <Input v-model="editedStaff.phone" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Department</Label>
            <Select v-model="editedStaff.departmentId">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
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
          <div>
            <Label>Position</Label>
            <Input v-model="editedStaff.position" />
          </div>
        </div>
        <div>
          <Label>Address</Label>
          <Textarea v-model="editedStaff.address" rows="3" />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showEditDialog = false">
            Cancel
          </Button>
          <Button @click="saveProfile" :disabled="isSaving">
            {{ isSaving ? "Saving..." : "Save Changes" }}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="showPasswordDialog">
    <DialogContent class="max-w-md w-full mx-4">
      <DialogHeader>
        <DialogTitle>Change Password</DialogTitle>
        <DialogDescription
          >Enter your current password and a new secure
          password.</DialogDescription
        >
      </DialogHeader>
      <div class="space-y-4">
        <div>
          <Label>Current Password</Label>
          <Input v-model="passwordForm.currentPassword" type="password" />
        </div>
        <div>
          <Label>New Password</Label>
          <Input v-model="passwordForm.newPassword" type="password" />
        </div>
        <div>
          <Label>Confirm New Password</Label>
          <Input v-model="passwordForm.confirmPassword" type="password" />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showPasswordDialog = false">
            Cancel
          </Button>
          <Button @click="changePassword" :disabled="isChangingPassword">
            {{ isChangingPassword ? "Changing..." : "Change Password" }}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>
