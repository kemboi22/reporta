<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Grid3x3,
  List,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const viewMode = ref<"grid" | "list">("grid");
const searchQuery = ref("");
const selectedDepartment = ref("all");
const selectedStatus = ref("all");
const showAddStaffDialog = ref(false);

const departments = [
  "All",
  "Nursing",
  "Emergency",
  "Pharmacy",
  "Surgery",
  "Radiology",
  "Administration",
];
const statuses = ["All", "Active", "On Leave", "Suspended"];

const staffMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    employeeId: "EMP001",
    department: "Nursing",
    role: "Senior Nurse",
    status: "Active",
    email: "sarah.j@hospital.com",
    phone: "+1 234-567-8901",
    photo: "/placeholder-user.jpg",
    hireDate: "2020-03-15",
    shift: "Morning",
  },
  {
    id: 2,
    name: "Mike Chen",
    employeeId: "EMP002",
    department: "Emergency",
    role: "ER Doctor",
    status: "Active",
    email: "mike.c@hospital.com",
    phone: "+1 234-567-8902",
    photo: "/placeholder-user.jpg",
    hireDate: "2019-06-20",
    shift: "Night",
  },
  {
    id: 3,
    name: "Emma Davis",
    employeeId: "EMP003",
    department: "Pharmacy",
    role: "Pharmacist",
    status: "On Leave",
    email: "emma.d@hospital.com",
    phone: "+1 234-567-8903",
    photo: "/placeholder-user.jpg",
    hireDate: "2021-01-10",
    shift: "Morning",
  },
  {
    id: 4,
    name: "James Wilson",
    employeeId: "EMP004",
    department: "Surgery",
    role: "Surgeon",
    status: "Active",
    email: "james.w@hospital.com",
    phone: "+1 234-567-8904",
    photo: "/placeholder-user.jpg",
    hireDate: "2018-09-05",
    shift: "Afternoon",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    employeeId: "EMP005",
    department: "Radiology",
    role: "Radiologist",
    status: "Active",
    email: "lisa.a@hospital.com",
    phone: "+1 234-567-8905",
    photo: "/placeholder-user.jpg",
    hireDate: "2020-11-22",
    shift: "Morning",
  },
  {
    id: 6,
    name: "Robert Taylor",
    employeeId: "EMP006",
    department: "Administration",
    role: "HR Manager",
    status: "Active",
    email: "robert.t@hospital.com",
    phone: "+1 234-567-8906",
    photo: "/placeholder-user.jpg",
    hireDate: "2017-04-12",
    shift: "Morning",
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    "On Leave": "bg-amber-100 text-amber-700 hover:bg-amber-100",
    Suspended: "bg-red-100 text-red-700 hover:bg-red-100",
  };
  return colors[status] || "bg-slate-100 text-slate-700";
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Staff Directory</h1>
        <p class="text-slate-600 mt-1">Manage your organization's workforce</p>
      </div>

      <Dialog v-model:open="showAddStaffDialog">
        <DialogTrigger as-child>
          <Button class="bg-blue-600 hover:bg-blue-700 text-white">
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
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Doe" />
              </div>
              <div class="space-y-2">
                <Label for="employeeId">Employee ID</Label>
                <Input id="employeeId" placeholder="EMP007" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@hospital.com"
                />
              </div>
              <div class="space-y-2">
                <Label for="phone">Phone</Label>
                <Input id="phone" placeholder="+1 234-567-8900" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nursing">Nursing</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label for="role">Role</Label>
                <Input id="role" placeholder="Nurse" />
              </div>
            </div>
            <div class="flex justify-end gap-3">
              <Button variant="outline" @click="showAddStaffDialog = false"
                >Cancel</Button
              >
              <Button class="bg-blue-600 hover:bg-blue-700 text-white"
                >Add Staff Member</Button
              >
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Filters and Search -->
    <Card class="border-slate-200">
      <CardContent class="p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
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
                <SelectItem
                  v-for="dept in departments"
                  :key="dept"
                  :value="dept.toLowerCase()"
                >
                  {{ dept }}
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
            <div class="flex border border-slate-200 rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                :class="viewMode === 'grid' && 'bg-slate-100'"
                @click="viewMode = 'grid'"
              >
                <Grid3x3 class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :class="viewMode === 'list' && 'bg-slate-100'"
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
      <Card
        v-for="staff in staffMembers"
        :key="staff.id"
        class="border-slate-200 hover:shadow-lg transition-all cursor-pointer"
      >
        <CardContent class="p-6">
          <div class="flex items-start justify-between mb-4">
            <Avatar class="h-16 w-16">
              <AvatarImage :src="staff.photo" />
              <AvatarFallback class="bg-blue-100 text-blue-700 text-lg">
                {{ getInitials(staff.name) }}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>

          <div class="space-y-3">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                {{ staff.name }}
              </h3>
              <p class="text-sm text-slate-500">{{ staff.employeeId }}</p>
            </div>

            <div class="flex items-center gap-2">
              <Badge class="bg-blue-100 text-blue-700 hover:bg-blue-100">{{
                staff.department
              }}</Badge>
              <Badge :class="getStatusColor(staff.status)">{{
                staff.status
              }}</Badge>
            </div>

            <div class="space-y-2 pt-2 border-t border-slate-100">
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <Mail class="h-4 w-4" />
                <span class="truncate">{{ staff.email }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <Phone class="h-4 w-4" />
                <span>{{ staff.phone }}</span>
              </div>
            </div>

            <div class="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                class="flex-1"
                @click="navigateTo(`/hr/staff/${staff.id}`)"
              >
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
    <Card v-else class="border-slate-200">
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Staff
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Employee ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr
                v-for="staff in staffMembers"
                :key="staff.id"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <Avatar class="h-10 w-10">
                      <AvatarImage :src="staff.photo" />
                      <AvatarFallback class="bg-blue-100 text-blue-700">
                        {{ getInitials(staff.name) }}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div class="text-sm font-medium text-slate-900">
                        {{ staff.name }}
                      </div>
                      <div class="text-sm text-slate-500">
                        {{ staff.shift }} Shift
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ staff.employeeId }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge class="bg-blue-100 text-blue-700 hover:bg-blue-100">{{
                    staff.department
                  }}</Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ staff.role }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :class="getStatusColor(staff.status)">{{
                    staff.status
                  }}</Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  <div>{{ staff.email }}</div>
                  <div class="text-slate-400">{{ staff.phone }}</div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="navigateTo(`/hr/staff/${staff.id}`)"
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
