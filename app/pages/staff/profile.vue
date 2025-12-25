<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  Upload,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const profile = ref({
  name: "Sarah Johnson",
  email: "sarah.johnson@company.com",
  phone: "+1 (555) 123-4567",
  department: "Engineering",
  position: "Senior Developer",
  joinDate: "2022-01-15",
  location: "New York, USA",
  avatar: "/placeholder-user.jpg",
});

const shifts = ref([
  { day: "Monday", time: "8:00 AM - 5:00 PM" },
  { day: "Tuesday", time: "8:00 AM - 5:00 PM" },
  { day: "Wednesday", time: "8:00 AM - 5:00 PM" },
  { day: "Thursday", time: "8:00 AM - 5:00 PM" },
  { day: "Friday", time: "8:00 AM - 5:00 PM" },
]);

const training = ref([
  { name: "Workplace Safety", completed: true, date: "2024-01-15" },
  { name: "Data Privacy & Security", completed: true, date: "2024-03-20" },
  { name: "Leadership Development", completed: false, date: null },
]);

const performance = ref({
  taskCompletion: 92,
  reportCompliance: 98,
  lastAppraisal: "4.5/5.0",
  appraisalDate: "2024-12-15",
});
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">My Profile</h1>
      <p class="text-slate-600 mt-1">
        Manage your personal information and preferences
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Info -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="flex items-center gap-6">
            <Avatar class="h-24 w-24">
              <AvatarImage :src="profile.avatar" />
              <AvatarFallback class="bg-blue-100 text-blue-700 text-2xl"
                >SJ</AvatarFallback
              >
            </Avatar>
            <div>
              <Button variant="outline">
                <Upload class="h-4 w-4 mr-2" />
                Change Photo
              </Button>
              <p class="text-sm text-slate-600 mt-2">
                JPG, PNG or GIF (max. 2MB)
              </p>
            </div>
          </div>

          <Separator />

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Full Name</Label>
              <Input v-model="profile.name" />
            </div>
            <div class="space-y-2">
              <Label>Email</Label>
              <Input v-model="profile.email" type="email" />
            </div>
            <div class="space-y-2">
              <Label>Phone</Label>
              <Input v-model="profile.phone" type="tel" />
            </div>
            <div class="space-y-2">
              <Label>Location</Label>
              <Input v-model="profile.location" />
            </div>
          </div>

          <Separator />

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <Label>Change Password</Label>
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </div>

          <div class="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <!-- Quick Info -->
      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-start gap-3">
              <User class="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p class="text-sm text-slate-600">Position</p>
                <p class="font-medium text-slate-900">{{ profile.position }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <MapPin class="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p class="text-sm text-slate-600">Department</p>
                <p class="font-medium text-slate-900">
                  {{ profile.department }}
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <Calendar class="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p class="text-sm text-slate-600">Join Date</p>
                <p class="font-medium text-slate-900">{{ profile.joinDate }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-600">Task Completion</span>
                <span class="font-medium text-slate-900"
                  >{{ performance.taskCompletion }}%</span
                >
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-600"
                  :style="{ width: `${performance.taskCompletion}%` }"
                ></div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-600">Report Compliance</span>
                <span class="font-medium text-slate-900"
                  >{{ performance.reportCompliance }}%</span
                >
              </div>
              <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-green-600"
                  :style="{ width: `${performance.reportCompliance}%` }"
                ></div>
              </div>
            </div>
            <Separator />
            <div>
              <p class="text-sm text-slate-600">Last Appraisal</p>
              <p class="text-2xl font-bold text-slate-900 mt-1">
                {{ performance.lastAppraisal }}
              </p>
              <p class="text-xs text-slate-500 mt-1">
                {{ performance.appraisalDate }}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- My Shifts -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>My Shifts</CardTitle>
          <CardDescription>Current shift assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="shift in shifts"
              :key="shift.day"
              class="flex items-center justify-between p-3 rounded-lg border border-slate-200"
            >
              <span class="font-medium text-slate-900">{{ shift.day }}</span>
              <span class="text-slate-600">{{ shift.time }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- My Training -->
      <Card>
        <CardHeader>
          <CardTitle>Training</CardTitle>
          <CardDescription>Completed & upcoming</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <div v-for="item in training" :key="item.name" class="space-y-2">
            <div class="flex items-start justify-between">
              <p class="text-sm font-medium text-slate-900">{{ item.name }}</p>
              <Badge
                :class="
                  item.completed
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-orange-100 text-orange-700 border-orange-200'
                "
                variant="outline"
              >
                {{ item.completed ? "Completed" : "Pending" }}
              </Badge>
            </div>
            <p v-if="item.completed" class="text-xs text-slate-500">
              {{ item.date }}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
