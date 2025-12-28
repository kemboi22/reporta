<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarPlus, ChevronLeft, ChevronRight, Filter, Users, Clock } from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const currentDate = ref(new Date());
const selectedView = ref<"month" | "week" | "day">("month");
const selectedFilter = ref<string>("all");
const showAddEvent = ref(false);

const filters = [
  { value: "all", label: "All Events" },
  { value: "event", label: "Events" },
  { value: "deadline", label: "Deadlines" },
  { value: "reminder", label: "Reminders" },
  { value: "holiday", label: "Holidays" },
  { value: "meeting", label: "Meetings" },
];

const events = ref([
  {
    id: 1,
    title: "Team Meeting",
    description: "Weekly sync with the development team",
    type: "MEETING" as const,
    startDate: new Date(new Date().setHours(10, 0, 0, 0)),
    endDate: new Date(new Date().setHours(11, 0, 0, 0)),
    allDay: false,
    location: "Conference Room A",
    attendees: ["user-1", "user-2", "user-3"],
    color: "#3b82f6",
  },
  {
    id: 2,
    title: "Project Deadline",
    description: "Submit final project deliverables",
    type: "DEADLINE" as const,
    startDate: new Date(new Date().setDate(currentDate.value.getDate() + 3)),
    endDate: null,
    allDay: true,
    location: null,
    attendees: [],
    color: "#ef4444",
  },
  {
    id: 3,
    title: "Client Presentation",
    description: "Quarterly review presentation",
    type: "EVENT" as const,
    startDate: new Date(new Date().setDate(currentDate.value.getDate() + 5)),
    endDate: new Date(new Date().setDate(currentDate.value.getDate() + 5)),
    allDay: false,
    location: "Boardroom",
    attendees: ["user-1", "user-4"],
    color: "#8b5cf6",
  },
  {
    id: 4,
    title: "Reminder: Submit timesheet",
    description: "Weekly timesheet due by 5 PM",
    type: "REMINDER" as const,
    startDate: new Date(new Date().setDate(currentDate.value.getDate() + 1)),
    endDate: null,
    allDay: false,
    location: null,
    attendees: [],
    color: "#f59e0b",
  },
]);

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const daysInMonth = computed(() => {
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).getDay();
});

const calendarDays = computed(() => {
  const days = [];
  const prevMonthDays = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 0).getDate();

  for (let i = firstDayOfMonth.value - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  for (let i = 1; i <= daysInMonth.value; i++) {
    const isToday =
      i === new Date().getDate() &&
      currentDate.value.getMonth() === new Date().getMonth() &&
      currentDate.value.getFullYear() === new Date().getFullYear();

    days.push({
      day: i,
      isCurrentMonth: true,
      isToday,
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return days;
});

const filteredEvents = computed(() => {
  if (selectedFilter.value === "all") return events.value;
  return events.value.filter((e) => e.type.toLowerCase() === selectedFilter.value);
});

const getEventsForDay = (day: number, isCurrentMonth: boolean) => {
  if (!isCurrentMonth) return [];

  const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day);
  return filteredEvents.value.filter((event) => {
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getDate() === day &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
};

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1);
};

const goToToday = () => {
  currentDate.value = new Date();
};

const getEventColor = (type: string) => {
  const colors: Record<string, string> = {
    MEETING: "bg-blue-500",
    DEADLINE: "bg-red-500",
    REMINDER: "bg-amber-500",
    HOLIDAY: "bg-green-500",
    EVENT: "bg-purple-500",
  };
  return colors[type] || "bg-gray-500";
};

const getEventTypeBadge = (type: string) => {
  const badges: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    MEETING: { label: "Meeting", variant: "default" },
    DEADLINE: { label: "Deadline", variant: "destructive" },
    REMINDER: { label: "Reminder", variant: "secondary" },
    HOLIDAY: { label: "Holiday", variant: "default" },
    EVENT: { label: "Event", variant: "outline" },
  };
  return badges[type] || { label: type, variant: "secondary" };
};

const newEvent = ref({
  title: "",
  description: "",
  type: "EVENT",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  allDay: false,
  location: "",
});

const addEvent = () => {
  console.log("Adding event:", newEvent.value);
  showAddEvent.value = false;
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Calendar</h1>
        <p class="text-muted-foreground mt-1">Manage your schedule and team events</p>
      </div>
      <div class="flex items-center gap-3">
        <Button variant="outline" size="sm" @click="goToToday">Today</Button>
        <div class="flex items-center gap-1">
          <Button variant="ghost" size="icon" @click="previousMonth">
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <span class="text-lg font-semibold min-w-[150px] text-center">
            {{ months[currentDate.getMonth()] }} {{ currentDate.getFullYear() }}
          </span>
          <Button variant="ghost" size="icon" @click="nextMonth">
            <ChevronRight class="h-4 w-4" />
          </Button>
        </div>
        <Dialog v-model:open="showAddEvent">
          <DialogTrigger as-child>
            <Button>
              <CalendarPlus class="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div class="space-y-4">
              <div>
                <Label for="title">Title</Label>
                <Input id="title" v-model="newEvent.title" placeholder="Event title" />
              </div>
              <div>
                <Label for="type">Type</Label>
                <Select v-model="newEvent.type">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EVENT">Event</SelectItem>
                    <SelectItem value="MEETING">Meeting</SelectItem>
                    <SelectItem value="DEADLINE">Deadline</SelectItem>
                    <SelectItem value="REMINDER">Reminder</SelectItem>
                    <SelectItem value="HOLIDAY">Holiday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="startDate">Start Date</Label>
                  <Input id="startDate" type="date" v-model="newEvent.startDate" />
                </div>
                <div>
                  <Label for="startTime">Start Time</Label>
                  <Input id="startTime" type="time" v-model="newEvent.startTime" />
                </div>
              </div>
              <div>
                <Label for="description">Description</Label>
                <Textarea id="description" v-model="newEvent.description" placeholder="Event description" />
              </div>
              <Button @click="addEvent" class="w-full">Create Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <div class="grid lg:grid-cols-4 gap-6">
      <div class="lg:col-span-3">
        <Card class="border-border">
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>Monthly View</CardTitle>
              <div class="flex items-center gap-2">
                <Select v-model="selectedFilter">
                  <SelectTrigger class="w-[150px]">
                    <Filter class="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="filter in filters" :key="filter.value" :value="filter.value">
                      {{ filter.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              <div
                v-for="day in daysOfWeek"
                :key="day"
                class="bg-muted p-3 text-center text-sm font-medium text-muted-foreground"
              >
                {{ day }}
              </div>
              <div
                v-for="(day, index) in calendarDays"
                :key="index"
                :class="[
                  'bg-background min-h-[100px] p-2',
                  !day.isCurrentMonth && 'opacity-50',
                  day.isToday && 'bg-primary/5'
                ]"
              >
                <span :class="['text-sm', day.isToday ? 'font-bold text-primary' : '']">{{ day.day }}</span>
                <div class="mt-1 space-y-1">
                  <div
                    v-for="event in getEventsForDay(day.day, day.isCurrentMonth)"
                    :key="event.id"
                    class="text-xs p-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                    :style="{ backgroundColor: event.color + '20', borderLeft: `3px solid ${event.color}` }"
                  >
                    <div class="font-medium truncate">{{ event.title }}</div>
                    <div v-if="!event.allDay" class="text-xs opacity-75">
                      {{ new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-6">
        <Card class="border-border">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div
                v-for="event in filteredEvents.slice(0, 5)"
                :key="event.id"
                class="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <Badge v-bind="getEventTypeBadge(event.type)">
                        {{ getEventTypeBadge(event.type).label }}
                      </Badge>
                    </div>
                    <h4 class="font-medium mt-2">{{ event.title }}</h4>
                    <p class="text-sm text-muted-foreground mt-1">{{ event.description }}</p>
                  </div>
                  <div
                    class="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    :style="{ backgroundColor: event.color }"
                  ></div>
                </div>
                <div class="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div class="flex items-center gap-1">
                    <Clock class="h-3 w-3" />
                    <span>{{
                      event.allDay
                        ? "All day"
                        : new Date(event.startDate).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })
                    }}</span>
                  </div>
                  <div v-if="event.attendees?.length" class="flex items-center gap-1">
                    <Users class="h-3 w-3" />
                    <span>{{ event.attendees.length }} attendees</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">Total Events</span>
                <span class="font-semibold">{{ events.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">This Month</span>
                <span class="font-semibold">{{ filteredEvents.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">Deadlines</span>
                <span class="font-semibold">{{ events.filter((e) => e.type === "DEADLINE").length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">Meetings</span>
                <span class="font-semibold">{{ events.filter((e) => e.type === "MEETING").length }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
