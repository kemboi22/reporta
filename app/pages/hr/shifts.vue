<script setup lang="ts">
import { ref } from "vue";
import { definePageMeta } from "#imports";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-vue-next";

definePageMeta({
  layout: "dashboard",
});

const currentDate = ref(new Date());
const viewMode = ref<"week" | "month">("week");

const shiftTemplates = [
  {
    id: 1,
    name: "Morning Shift",
    time: "6 AM - 2 PM",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    name: "Afternoon Shift",
    time: "2 PM - 10 PM",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 3,
    name: "Night Shift",
    time: "10 PM - 6 AM",
    color: "bg-slate-100 text-slate-700",
  },
];

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const weekSchedule = [
  {
    day: "Monday",
    date: "Dec 23",
    shifts: [
      {
        type: "Morning Shift",
        staff: ["Sarah Johnson", "Mike Chen", "Lisa Anderson"],
        color: "bg-blue-100 border-blue-300",
      },
      {
        type: "Afternoon Shift",
        staff: ["Emma Davis", "James Wilson"],
        color: "bg-purple-100 border-purple-300",
      },
      {
        type: "Night Shift",
        staff: ["Robert Taylor"],
        color: "bg-slate-100 border-slate-300",
      },
    ],
  },
  {
    day: "Tuesday",
    date: "Dec 24",
    shifts: [
      {
        type: "Morning Shift",
        staff: ["Mike Chen", "Lisa Anderson", "Robert Taylor"],
        color: "bg-blue-100 border-blue-300",
      },
      {
        type: "Afternoon Shift",
        staff: ["Sarah Johnson", "Emma Davis"],
        color: "bg-purple-100 border-purple-300",
      },
      {
        type: "Night Shift",
        staff: ["James Wilson"],
        color: "bg-slate-100 border-slate-300",
      },
    ],
  },
];

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
        <h1 class="text-3xl font-bold text-slate-900">Shifts & Schedules</h1>
        <p class="text-slate-600 mt-1">
          Manage staff shifts and work schedules
        </p>
      </div>

      <div class="flex gap-3">
        <Button variant="outline">
          <CalendarIcon class="h-4 w-4 mr-2" />
          Auto-Generate
        </Button>
        <Button class="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus class="h-4 w-4 mr-2" />
          Add Shift
        </Button>
      </div>
    </div>

    <!-- Calendar Navigation -->
    <Card class="border-slate-200">
      <CardContent class="p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <div class="text-center">
              <h2 class="text-lg font-semibold text-slate-900">
                December 23-29, 2024
              </h2>
              <p class="text-sm text-slate-500">Week 52</p>
            </div>
            <Button variant="outline" size="icon">
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>

          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              :class="viewMode === 'week' && 'bg-slate-100'"
              @click="viewMode = 'week'"
            >
              Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              :class="viewMode === 'month' && 'bg-slate-100'"
              @click="viewMode = 'month'"
            >
              Month
            </Button>
            <Button variant="outline" size="sm">Today</Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Shift Templates -->
    <Card class="border-slate-200">
      <CardContent class="p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">
          Shift Templates
        </h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div
            v-for="template in shiftTemplates"
            :key="template.id"
            :class="[
              'p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all',
              template.color,
            ]"
          >
            <div class="flex items-center gap-3">
              <Clock class="h-5 w-5" />
              <div>
                <h4 class="font-medium">{{ template.name }}</h4>
                <p class="text-sm opacity-75">{{ template.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Weekly Schedule -->
    <div class="space-y-4">
      <div v-for="schedule in weekSchedule" :key="schedule.day">
        <Card class="border-slate-200">
          <CardContent class="p-6">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-24">
                <h3 class="font-semibold text-slate-900">{{ schedule.day }}</h3>
                <p class="text-sm text-slate-500">{{ schedule.date }}</p>
              </div>

              <div class="flex-1 grid md:grid-cols-3 gap-4">
                <div
                  v-for="(shift, index) in schedule.shifts"
                  :key="index"
                  :class="['p-4 rounded-lg border-2', shift.color]"
                >
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-sm">{{ shift.type }}</h4>
                    <Badge variant="secondary" class="text-xs">{{
                      shift.staff.length
                    }}</Badge>
                  </div>

                  <div class="flex -space-x-2">
                    <Avatar
                      v-for="(staffName, staffIndex) in shift.staff.slice(0, 3)"
                      :key="staffIndex"
                      class="h-8 w-8 border-2 border-white"
                    >
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback class="bg-white text-slate-700 text-xs">
                        {{ getInitials(staffName) }}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      v-if="shift.staff.length > 3"
                      class="h-8 w-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600"
                    >
                      +{{ shift.staff.length - 3 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Shift Statistics -->
    <div class="grid md:grid-cols-3 gap-6">
      <Card class="border-slate-200">
        <CardContent class="p-6">
          <div class="text-sm text-slate-600 mb-1">Total Scheduled Hours</div>
          <div class="text-3xl font-bold text-slate-900">320</div>
          <p class="text-sm text-slate-500 mt-2">This week</p>
        </CardContent>
      </Card>

      <Card class="border-slate-200">
        <CardContent class="p-6">
          <div class="text-sm text-slate-600 mb-1">Coverage Rate</div>
          <div class="text-3xl font-bold text-emerald-600">95%</div>
          <p class="text-sm text-slate-500 mt-2">All shifts covered</p>
        </CardContent>
      </Card>

      <Card class="border-slate-200">
        <CardContent class="p-6">
          <div class="text-sm text-slate-600 mb-1">Conflicts</div>
          <div class="text-3xl font-bold text-amber-600">2</div>
          <p class="text-sm text-slate-500 mt-2">Require attention</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
