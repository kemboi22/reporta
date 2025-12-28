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
import { User, Mail, Phone, MapPin, Calendar, Building2, Briefcase, DollarSign, Clock, FileText, Settings, Edit, MoreVertical } from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();

const staff = ref({
  id: route.params.id,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  position: "Senior Software Engineer",
  department: "Engineering",
  employeeId: "EMP-2024-001",
  avatar: "/placeholder-user.jpg",
  isActive: true,
  hireDate: new Date("2021-03-15"),
  birthDate: new Date("1990-06-10"),
  address: "123 Main Street, Apt 4B",
  city: "San Francisco",
  state: "CA",
  country: "USA",
  postalCode: "94102",
  emergencyContact: "Jane Doe - Spouse\n+1 (555) 987-6543",
  salary: 120000,
  currency: "USD",
  employmentType: "FULL_TIME" as const,
  workSchedule: {
    monday: "9:00 AM - 5:00 PM",
    tuesday: "9:00 AM - 5:00 PM",
    wednesday: "9:00 AM - 5:00 PM",
    thursday: "9:00 AM - 5:00 PM",
    friday: "9:00 AM - 5:00 PM",
  },
  createdAt: new Date("2021-03-15"),
  updatedAt: new Date("2024-02-20"),
});

const attendance = ref([
  {
    id: "1",
    date: new Date("2024-02-20"),
    checkIn: new Date("2024-02-20T09:00:00"),
    checkOut: new Date("2024-02-20T17:30:00"),
    breakDuration: 60,
    status: "PRESENT" as const,
  },
  {
    id: "2",
    date: new Date("2024-02-19"),
    checkIn: new Date("2024-02-19T09:05:00"),
    checkOut: new Date("2024-02-19T17:15:00"),
    breakDuration: 45,
    status: "PRESENT" as const,
  },
  {
    id: "3",
    date: new Date("2024-02-18"),
    checkIn: null,
    checkOut: null,
    breakDuration: 0,
    status: "ABSENT" as const,
  },
]);

const leaveRequests = ref([
  {
    id: "1",
    type: "VACATION" as const,
    startDate: new Date("2024-03-10"),
    endDate: new Date("2024-03-15"),
    days: 5,
    reason: "Family vacation",
    status: "APPROVED" as const,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "2",
    type: "SICK" as const,
    startDate: new Date("2024-02-05"),
    endDate: new Date("2024-02-06"),
    days: 2,
    reason: "Flu",
    status: "APPROVED" as const,
    createdAt: new Date("2024-02-04"),
  },
]);

const appraisals = ref([
  {
    id: "1",
    period: "2024-Q1",
    rating: 4.5,
    goals: "Complete API refactoring, mentor 2 junior developers",
    achievements: "Successfully led the API refactoring project, improved performance by 40%. Mentored 2 junior developers who have now been promoted.",
    feedback: "Excellent performance and leadership skills. John consistently delivers high-quality work and is a valuable team member.",
    status: "COMPLETED" as const,
    reviewedAt: new Date("2024-01-30"),
  },
  {
    id: "2",
    period: "2023-Q4",
    rating: 4.2,
    goals: "Improve test coverage, lead code reviews",
    achievements: "Increased test coverage from 60% to 85%. Led all major code reviews, maintaining high code quality standards.",
    feedback: "Strong performance with attention to detail. Good progress on technical goals.",
    status: "COMPLETED" as const,
    reviewedAt: new Date("2023-12-30"),
  },
]);

const showEditDialog = ref(false);
const editedStaff = ref({ ...staff.value });

const editStaff = () => {
  console.log("Saving staff:", editedStaff.value);
  staff.value = { ...editedStaff.value };
  showEditDialog.value = false;
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

const totalAttendanceDays = computed(() => attendance.value.length);
const presentDays = computed(() => attendance.value.filter((a) => a.status === "PRESENT").length);
const attendanceRate = computed(() => {
  if (totalAttendanceDays.value === 0) return 0;
  return Math.round((presentDays.value / totalAttendanceDays.value) * 100);
});

const totalLeaveTaken = computed(() => leaveRequests.value.reduce((sum, l) => sum + l.days, 0));
const approvedLeave = computed(() => leaveRequests.value.filter((l) => l.status === "APPROVED").length);
const pendingLeave = computed(() => leaveRequests.value.filter((l) => l.status === "PENDING").length);

const averageRating = computed(() => {
  if (appraisals.value.length === 0) return 0;
  const sum = appraisals.value.reduce((acc, a) => acc + (a.rating || 0), 0);
  return (sum / appraisals.value.length).toFixed(1);
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Avatar class="h-16 w-16">
          <AvatarImage :src="staff.avatar" />
          <AvatarFallback class="text-2xl">{{ staff.firstName.charAt(0) }}{{ staff.lastName.charAt(0) }}</AvatarFallback>
        </Avatar>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold text-foreground">
              {{ staff.firstName }} {{ staff.lastName }}
            </h1>
            <Badge v-if="staff.isActive" class="bg-emerald-500 text-white">Active</Badge>
            <Badge v-else class="bg-gray-500 text-white">Inactive</Badge>
          </div>
          <p class="text-muted-foreground">{{ staff.position }}</p>
          <p class="text-sm text-muted-foreground">{{ staff.department }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Button variant="outline">
          <Settings class="h-4 w-4 mr-2" />
          Settings
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
                <Textarea v-model="editedStaff.emergencyContact" />
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
              <p class="text-2xl font-bold">{{ attendanceRate }}%</p>
              <p class="text-xs text-muted-foreground">{{ presentDays }}/{{ totalAttendanceDays }} days</p>
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
              <p class="text-2xl font-bold">{{ totalLeaveTaken }} days</p>
              <p class="text-xs text-muted-foreground">{{ pendingLeave }} pending</p>
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
              <p class="text-2xl font-bold">{{ averageRating }}/5</p>
              <p class="text-xs text-muted-foreground">{{ appraisals.length }} reviews</p>
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
                {{ new Date().getFullYear() - staff.hireDate.getFullYear() }}y
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Tabs default-value="info" class="space-y-6">
      <TabsList>
        <TabsTrigger value="info">Personal Info</TabsTrigger>
        <TabsTrigger value="attendance">Attendance</TabsTrigger>
        <TabsTrigger value="leave">Leave</TabsTrigger>
        <TabsTrigger value="appraisals">Appraisals</TabsTrigger>
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
                  <p class="font-medium">{{ staff.firstName }} {{ staff.lastName }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Mail class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Email</p>
                  <p class="font-medium">{{ staff.email }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Phone class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Phone</p>
                  <p class="font-medium">{{ staff.phone }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <MapPin class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Address</p>
                  <p class="font-medium">{{ staff.address }}</p>
                  <p class="font-medium">{{ staff.city }}, {{ staff.state }} {{ staff.postalCode }}</p>
                  <p class="font-medium">{{ staff.country }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Calendar class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Date of Birth</p>
                  <p class="font-medium">{{ staff.birthDate?.toLocaleDateString() }}</p>
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
                  <p class="font-medium">{{ staff.employeeId }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Briefcase class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Position</p>
                  <p class="font-medium">{{ staff.position }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Building2 class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Department</p>
                  <p class="font-medium">{{ staff.department }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Briefcase class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Employment Type</p>
                  <Badge variant="secondary">{{ getEmploymentTypeLabel(staff.employmentType) }}</Badge>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <Calendar class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Hire Date</p>
                  <p class="font-medium">{{ staff.hireDate?.toLocaleDateString() }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <DollarSign class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p class="text-sm text-muted-foreground">Salary</p>
                  <p class="font-medium">
                    {{ staff.currency }} {{ staff.salary?.toLocaleString() }}
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
            <p class="whitespace-pre-line">{{ staff.emergencyContact }}</p>
          </CardContent>
        </Card>

        <Card class="border-border">
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

      <TabsContent value="attendance" class="space-y-6">
        <h2 class="text-xl font-semibold">Attendance History</h2>
        <Card class="border-border">
          <CardContent class="p-6">
            <div class="space-y-3">
              <div
                v-for="record in attendance"
                :key="record.id"
                class="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <Badge :class="[getAttendanceStatusColor(record.status), 'text-white']">
                    {{ record.status }}
                  </Badge>
                  <div>
                    <p class="font-medium">{{ record.date.toLocaleDateString() }}</p>
                    <p class="text-sm text-muted-foreground">
                      {{ record.checkIn ? record.checkIn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--" }} -
                      {{ record.checkOut ? record.checkOut.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--" }}
                    </p>
                  </div>
                </div>
                <div class="text-sm text-muted-foreground">
                  Break: {{ record.breakDuration }} min
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="leave" class="space-y-6">
        <h2 class="text-xl font-semibold">Leave Requests</h2>
        <Card class="border-border">
          <CardContent class="p-6">
            <div class="space-y-4">
              <div
                v-for="request in leaveRequests"
                :key="request.id"
                class="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <Badge :class="getLeaveTypeColor(request.type)">
                        {{ request.type }}
                      </Badge>
                      <Badge :class="[getLeaveStatusColor(request.status), 'text-white']">
                        {{ request.status }}
                      </Badge>
                    </div>
                    <p class="font-medium">{{ request.reason }}</p>
                    <div class="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div class="flex items-center gap-1">
                        <Calendar class="h-3 w-3" />
                        <span>{{ request.startDate.toLocaleDateString() }} - {{ request.endDate.toLocaleDateString() }}</span>
                      </div>
                      <span>{{ request.days }} days</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appraisals" class="space-y-6">
        <h2 class="text-xl font-semibold">Performance Appraisals</h2>
        <div class="space-y-6">
          <Card
            v-for="appraisal in appraisals"
            :key="appraisal.id"
            class="border-border"
          >
            <CardHeader>
              <div class="flex items-center justify-between">
                <CardTitle>{{ appraisal.period }}</CardTitle>
                <Badge :class="[getLeaveStatusColor(appraisal.status), 'text-white']">
                  {{ appraisal.status }}
                </Badge>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <Label>Rating</Label>
                  <span class="text-2xl font-bold">{{ appraisal.rating }}/5</span>
                </div>
                <div class="h-2 bg-muted rounded-full overflow-hidden">
                  <div class="h-full bg-primary" :style="{ width: `${(appraisal.rating / 5) * 100}%` }"></div>
                </div>
              </div>
              <div>
                <Label>Goals</Label>
                <p class="text-sm text-muted-foreground">{{ appraisal.goals }}</p>
              </div>
              <div>
                <Label>Achievements</Label>
                <p class="text-sm text-muted-foreground">{{ appraisal.achievements }}</p>
              </div>
              <div>
                <Label>Feedback</Label>
                <p class="text-sm text-muted-foreground">{{ appraisal.feedback }}</p>
              </div>
              <p class="text-xs text-muted-foreground">
                Reviewed on {{ appraisal.reviewedAt?.toLocaleDateString() }}
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
