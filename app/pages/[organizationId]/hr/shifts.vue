<script setup lang="ts">
import { ref, computed } from "vue";
import { definePageMeta, navigateTo } from "#imports";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  MoreVertical,
  Edit2,
  Trash2,
  Filter,
  Printer,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { canManageHR } from "~/utils";

definePageMeta({
  layout: "dashboard",
});

if (!canManageHR()) {
  const route = useRoute();
  const orgId = route.params.organizationId as string;
  navigateTo(`/${orgId}/dashboard`);
}

const currentDate = ref(new Date());
const viewMode = ref<"week" | "month">("week");
const selectedDepartment = ref("all");
const showCreateShiftSheet = ref(false);
const editingShift = ref<any>(null);

const departments = [
  { id: "all", name: "All Departments" },
  { id: "pharmacy", name: "Pharmacy" },
  { id: "nursing", name: "Nursing" },
  { id: "administration", name: "Administration" },
  { id: "maintenance", name: "Maintenance" },
];

const shiftTemplates = [
  { id: 1, name: "Morning Shift", time: "6 AM - 2 PM", hours: 8, color: "bg-blue-500" },
  { id: 2, name: "Afternoon Shift", time: "2 PM - 10 PM", hours: 8, color: "bg-purple-500" },
  { id: 3, name: "Night Shift", time: "10 PM - 6 AM", hours: 8, color: "bg-slate-500" },
  { id: 4, name: "On-Call", time: "24 Hours", hours: 24, color: "bg-amber-500" },
];

const staff = [
  { id: 1, name: "Sarah Johnson", role: "Pharmacist", department: "pharmacy", photo: "/placeholder-user.jpg" },
  { id: 2, name: "Mike Chen", role: "Nurse", department: "nursing", photo: "/placeholder-user.jpg" },
  { id: 3, name: "Emma Davis", role: "Pharmacist", department: "pharmacy", photo: "/placeholder-user.jpg" },
  { id: 4, name: "James Wilson", role: "Admin", department: "administration", photo: "/placeholder-user.jpg" },
  { id: 5, name: "Robert Taylor", role: "Maintenance", department: "maintenance", photo: "/placeholder-user.jpg" },
  { id: 6, name: "Lisa Anderson", role: "Nurse", department: "nursing", photo: "/placeholder-user.jpg" },
];

const weekSchedule = ref([
  {
    day: "Monday",
    date: "Dec 23",
    isToday: true,
    shifts: [
      { id: 1, type: "Morning Shift", time: "6:00 AM - 2:00 PM", staffIds: [1, 2, 3], color: "bg-blue-500" },
      { id: 2, type: "Afternoon Shift", time: "2:00 PM - 10:00 PM", staffIds: [4, 5], color: "bg-purple-500" },
      { id: 3, type: "Night Shift", time: "10:00 PM - 6:00 AM", staffIds: [6], color: "bg-slate-500" },
    ],
  },
  {
    day: "Tuesday",
    date: "Dec 24",
    isToday: false,
    shifts: [
      { id: 4, type: "Morning Shift", time: "6:00 AM - 2:00 PM", staffIds: [2, 3, 5], color: "bg-blue-500" },
      { id: 5, type: "Afternoon Shift", time: "2:00 PM - 10:00 PM", staffIds: [1, 4], color: "bg-purple-500" },
      { id: 6, type: "Night Shift", time: "10:00 PM - 6:00 AM", staffIds: [6], color: "bg-slate-500" },
    ],
  },
  {
    day: "Wednesday",
    date: "Dec 25",
    isToday: false,
    isHoliday: true,
    shifts: [],
  },
  {
    day: "Thursday",
    date: "Dec 26",
    isToday: false,
    shifts: [
      { id: 7, type: "Morning Shift", time: "6:00 AM - 2:00 PM", staffIds: [1, 2, 6], color: "bg-blue-500" },
      { id: 8, type: "Afternoon Shift", time: "2:00 PM - 10:00 PM", staffIds: [3, 4], color: "bg-purple-500" },
    ],
  },
  {
    day: "Friday",
    date: "Dec 27",
    isToday: false,
    shifts: [
      { id: 9, type: "Morning Shift", time: "6:00 AM - 2:00 PM", staffIds: [5, 6], color: "bg-blue-500" },
      { id: 10, type: "Afternoon Shift", time: "2:00 PM - 10:00 PM", staffIds: [1, 2], color: "bg-purple-500" },
      { id: 11, type: "Night Shift", time: "10:00 PM - 6:00 AM", staffIds: [3], color: "bg-slate-500" },
    ],
  },
  {
    day: "Saturday",
    date: "Dec 28",
    isToday: false,
    shifts: [
      { id: 12, type: "On-Call", time: "24 Hours", staffIds: [4], color: "bg-amber-500" },
    ],
  },
  {
    day: "Sunday",
    date: "Dec 29",
    isToday: false,
    shifts: [
      { id: 13, type: "On-Call", time: "24 Hours", staffIds: [5], color: "bg-amber-500" },
    ],
  },
]);

const getInitials = (name: string) => {
  return name.split(" ").map((n) => n[0]).join("");
};

const getStaffById = (id: number) => {
  return staff.find((s) => s.id === id);
};

const getFilteredSchedule = computed(() => {
  if (selectedDepartment.value === "all") return weekSchedule.value;
  return weekSchedule.value.map((day) => ({
    ...day,
    shifts: day.shifts.filter((shift) => 
      shift.staffIds.some((id) => getStaffById(id)?.department === selectedDepartment.value)
    ),
  }));
});

const openCreateShiftSheet = () => {
  editingShift.value = null;
  showCreateShiftSheet.value = true;
};

const openEditShiftSheet = (shift: any) => {
  editingShift.value = { ...shift };
  showCreateShiftSheet.value = true;
};

const saveShift = () => {
  showCreateShiftSheet.value = false;
  editingShift.value = null;
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Shifts & Schedules</h1>
        <p class="text-muted-foreground mt-1">Manage staff shifts and work schedules</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline">
          <Printer class="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline">
          <CalendarIcon class="h-4 w-4 mr-2" />
          Auto-Generate
        </Button>
        <Button @click="openCreateShiftSheet">
          <Plus class="h-4 w-4 mr-2" />
          Add Shift
        </Button>
      </div>
    </div>

    <Card>
      <CardContent class="p-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <div class="text-center min-w-[200px]">
              <h2 class="text-lg font-semibold text-foreground">December 23-29, 2024</h2>
              <p class="text-sm text-muted-foreground">Week 52</p>
            </div>
            <Button variant="outline" size="icon">
              <ChevronRight class="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">Today</Button>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center border rounded-md">
              <Button variant="ghost" size="sm" :class="viewMode === 'week' && 'bg-muted'" @click="viewMode = 'week'">
                Week
              </Button>
              <Button variant="ghost" size="sm" :class="viewMode === 'month' && 'bg-muted'" @click="viewMode = 'month'">
                Month
              </Button>
            </div>
            <Button variant="outline" size="icon">
              <Filter class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <Tabs default-value="templates" class="w-full">
      <TabsList class="grid w-full md:w-auto md:inline-grid grid-cols-3 bg-muted/50">
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="stats">Statistics</TabsTrigger>
      </TabsList>

      <TabsContent value="templates" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Shift Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="template in shiftTemplates"
                :key="template.id"
                class="p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer group"
                :class="template.color.replace('bg-', 'border-').replace('500', '300') + ' hover:' + template.color + '10'"
              >
                <div class="flex items-start justify-between mb-3">
                  <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', template.color, 'text-white']">
                    <Clock class="h-5 w-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="openEditShiftSheet(template)">
                        <Edit2 class="h-4 w-4 mr-2" />
                        Edit Template
                      </DropdownMenuItem>
                      <DropdownMenuItem class="text-destructive">
                        <Trash2 class="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h4 class="font-semibold text-foreground mb-1">{{ template.name }}</h4>
                <p class="text-sm text-muted-foreground mb-2">{{ template.time }}</p>
                <div class="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock class="h-3 w-3" />
                  <span>{{ template.hours }} hours</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="schedule" class="space-y-4">
        <div class="grid gap-4">
          <div v-for="schedule in getFilteredSchedule" :key="schedule.day">
            <Card :class="schedule.isToday && 'ring-2 ring-primary ring-offset-2'">
              <CardContent class="p-0">
                <div class="flex items-stretch">
                  <div :class="['w-24 p-4 flex flex-col items-center justify-center rounded-l-lg', schedule.isToday ? 'bg-primary text-primary-foreground' : 'bg-muted']">
                    <div class="text-xs uppercase tracking-wider opacity-75">{{ schedule.day.substring(0, 3) }}</div>
                    <div class="text-2xl font-bold">{{ schedule.date.split(' ')[1] }}</div>
                    <div v-if="schedule.isHoliday" class="text-xs mt-1 bg-amber-500 text-white px-2 py-0.5 rounded">Holiday</div>
                  </div>
                  <div class="flex-1 p-4">
                    <div v-if="schedule.shifts.length === 0" class="h-full flex items-center justify-center text-muted-foreground text-sm py-4">
                      No shifts scheduled
                    </div>
                    <div v-else class="grid md:grid-cols-3 gap-3">
                      <div
                        v-for="shift in schedule.shifts"
                        :key="shift.id"
                        class="p-3 rounded-lg border-2 hover:shadow-md transition-all group"
                        :class="shift.color.replace('bg-', 'border-').replace('500', '300')"
                      >
                        <div class="flex items-start justify-between mb-2">
                          <div :class="['w-6 h-6 rounded flex items-center justify-center', shift.color, 'text-white']">
                            <Clock class="h-3.5 w-3.5" />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                              <Button variant="ghost" size="icon" class="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical class="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem @click="openEditShiftSheet(shift)">
                                <Edit2 class="h-4 w-4 mr-2" />
                                Edit Shift
                              </DropdownMenuItem>
                              <DropdownMenuItem class="text-destructive">
                                <Trash2 class="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div class="text-xs font-medium text-muted-foreground mb-1">{{ shift.type }}</div>
                        <div class="text-sm text-foreground mb-3">{{ shift.time }}</div>
                        <div class="flex items-center justify-between">
                          <div class="flex -space-x-1.5">
                            <Avatar
                              v-for="staffId in shift.staffIds.slice(0, 3)"
                              :key="staffId"
                              class="h-6 w-6 border-2 border-background"
                            >
                              <AvatarImage :src="getStaffById(staffId)?.photo" />
                              <AvatarFallback class="bg-primary text-primary-foreground text-[9px]">
                                {{ getInitials(getStaffById(staffId)?.name || '') }}
                              </AvatarFallback>
                            </Avatar>
                            <div v-if="shift.staffIds.length > 3" class="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-medium text-muted-foreground">
                              +{{ shift.staffIds.length - 3 }}
                            </div>
                          </div>
                          <Badge variant="secondary" class="text-xs">{{ shift.staffIds.length }}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="stats" class="space-y-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-muted-foreground">Total Hours</div>
                  <div class="text-3xl font-bold text-foreground mt-1">320</div>
                </div>
                <div class="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Clock class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p class="text-xs text-muted-foreground mt-2">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-muted-foreground">Staff Scheduled</div>
                  <div class="text-3xl font-bold text-foreground mt-1">6</div>
                </div>
                <div class="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <Users class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p class="text-xs text-muted-foreground mt-2">Active this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-muted-foreground">Coverage</div>
                  <div class="text-3xl font-bold text-emerald-600 mt-1">95%</div>
                </div>
                <div class="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <Users class="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <p class="text-xs text-muted-foreground mt-2">All shifts covered</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-muted-foreground">Conflicts</div>
                  <div class="text-3xl font-bold text-amber-600 mt-1">2</div>
                </div>
                <div class="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                  <AlertCircle class="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <p class="text-xs text-muted-foreground mt-2">Require attention</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Staff Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div v-for="person in staff" :key="person.id" class="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div class="flex items-center gap-3">
                  <Avatar class="h-10 w-10">
                    <AvatarImage :src="person.photo" />
                    <AvatarFallback class="bg-primary text-primary-foreground">
                      {{ getInitials(person.name) }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="font-medium text-foreground">{{ person.name }}</div>
                    <div class="text-xs text-muted-foreground">{{ person.role }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <Badge :class="['text-xs', person.department === 'pharmacy' && 'bg-blue-100 text-blue-700', person.department === 'nursing' && 'bg-purple-100 text-purple-700', person.department === 'administration' && 'bg-orange-100 text-orange-700', person.department === 'maintenance' && 'bg-emerald-100 text-emerald-700']">
                    {{ person.department }}
                  </Badge>
                  <Badge variant="outline" class="text-xs">32h</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <Sheet v-model:open="showCreateShiftSheet">
      <SheetContent class="w-full sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{{ editingShift ? 'Edit Shift' : 'Create New Shift' }}</SheetTitle>
          <SheetDescription>
            {{ editingShift ? 'Update shift details' : 'Configure a new shift for your team' }}
          </SheetDescription>
        </SheetHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="shift-type">Shift Type</Label>
            <div class="grid grid-cols-2 gap-2">
              <Button v-for="template in shiftTemplates" :key="template.id" variant="outline" class="justify-start" type="button">
                <div :class="['w-3 h-3 rounded-full mr-2', template.color]"></div>
                {{ template.name }}
              </Button>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="date">Date</Label>
              <Input id="date" type="date" />
            </div>
            <div class="space-y-2">
              <Label for="department">Department</Label>
              <select id="department" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option v-for="dept in departments.slice(1)" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="start-time">Start Time</Label>
              <Input id="start-time" type="time" />
            </div>
            <div class="space-y-2">
              <Label for="end-time">End Time</Label>
              <Input id="end-time" type="time" />
            </div>
          </div>
          <div class="space-y-2">
            <Label>Assign Staff</Label>
            <div class="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
              <div v-for="person in staff" :key="person.id" class="flex items-center gap-3">
                <Switch :id="'staff-' + person.id" />
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="person.photo" />
                  <AvatarFallback class="bg-primary text-primary-foreground text-xs">
                    {{ getInitials(person.name) }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex-1">
                  <div class="text-sm font-medium">{{ person.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ person.role }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <Label for="break-duration">Break Duration</Label>
            <Input id="break-duration" type="number" placeholder="minutes" />
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" @click="showCreateShiftSheet = false">Cancel</Button>
          <Button @click="saveShift">{{ editingShift ? 'Save Changes' : 'Create Shift' }}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>
