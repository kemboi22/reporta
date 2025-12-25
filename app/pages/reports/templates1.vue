<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, FileText, Copy, Archive, Edit } from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const searchQuery = ref("");
const selectedDepartment = ref("all");
const selectedFrequency = ref("all");

const templates = [
  {
    id: 1,
    name: "Daily Ward Report",
    icon: "FileText",
    department: "Nursing",
    frequency: "Daily",
    fields: 12,
    submissions: 156,
    status: "Active",
    description: "Daily patient care and ward status report",
  },
  {
    id: 2,
    name: "Medication Inventory",
    icon: "FileText",
    department: "Pharmacy",
    frequency: "Weekly",
    fields: 8,
    submissions: 48,
    status: "Active",
    description: "Weekly medication stock and usage tracking",
  },
  {
    id: 3,
    name: "Equipment Maintenance Log",
    icon: "FileText",
    department: "Maintenance",
    frequency: "Monthly",
    fields: 15,
    submissions: 12,
    status: "Active",
    description: "Monthly equipment inspection and maintenance records",
  },
  {
    id: 4,
    name: "Patient Satisfaction Survey",
    icon: "FileText",
    department: "Quality",
    frequency: "On-Demand",
    fields: 20,
    submissions: 342,
    status: "Active",
    description: "Patient feedback and satisfaction assessment",
  },
  {
    id: 5,
    name: "Incident Report Form",
    icon: "FileText",
    department: "Safety",
    frequency: "On-Demand",
    fields: 18,
    submissions: 24,
    status: "Active",
    description: "Safety incident documentation and analysis",
  },
  {
    id: 6,
    name: "Staff Performance Review",
    icon: "FileText",
    department: "HR",
    frequency: "Quarterly",
    fields: 25,
    submissions: 18,
    status: "Draft",
    description: "Quarterly employee performance evaluation",
  },
];

const getFrequencyColor = (frequency: string) => {
  const colors: Record<string, string> = {
    Daily: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    Weekly: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    Monthly: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    Quarterly: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    "On-Demand": "bg-muted text-foreground hover:bg-muted",
  };
  return colors[frequency] || colors["On-Demand"];
};

const getStatusColor = (status: string) => {
  return status === "Active"
    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
    : "bg-muted text-foreground hover:bg-muted";
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Report Templates</h1>
        <p class="text-muted-foreground mt-1">
          Create and manage custom report templates
        </p>
      </div>

      <Button
        class="bg-blue-600 hover:bg-blue-700 text-white"
        @click="navigateTo('/reports/templates/builder')"
      >
        <Plus class="h-4 w-4 mr-2" />
        Create Template
      </Button>
    </div>

    <!-- Filters -->
    <Card class="border-border">
      <CardContent class="p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search templates..."
              class="pl-10"
            />
          </div>

          <Select v-model="selectedDepartment">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="nursing">Nursing</SelectItem>
              <SelectItem value="pharmacy">Pharmacy</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedFrequency">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frequencies</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Templates Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="template in templates"
        :key="template.id"
        class="border-border hover:shadow-lg transition-all cursor-pointer"
      >
        <CardContent class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <FileText class="h-6 w-6 text-blue-600" />
            </div>
            <Badge :class="getStatusColor(template.status)">{{
              template.status
            }}</Badge>
          </div>

          <h3 class="text-lg font-semibold text-foreground mb-2">
            {{ template.name }}
          </h3>
          <p class="text-sm text-muted-foreground mb-4 line-clamp-2">
            {{ template.description }}
          </p>

          <div class="flex items-center gap-2 mb-4">
            <Badge class="bg-blue-100 text-blue-700 hover:bg-blue-100">{{
              template.department
            }}</Badge>
            <Badge :class="getFrequencyColor(template.frequency)">{{
              template.frequency
            }}</Badge>
          </div>

          <div
            class="grid grid-cols-2 gap-4 py-4 border-t border-border text-sm"
          >
            <div>
              <p class="text-muted-foreground">Fields</p>
              <p class="font-semibold text-foreground">{{ template.fields }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Submissions</p>
              <p class="font-semibold text-foreground">
                {{ template.submissions }}
              </p>
            </div>
          </div>

          <div class="flex gap-2 pt-4 border-t border-border">
            <!-- Added Fill Report button -->
            <Button
              variant="outline"
              size="sm"
              class="flex-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              @click="navigateTo(`/reports/fill/${template.id}`)"
            >
              <FileText class="h-4 w-4 mr-2" />
              Fill
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="flex-1"
              @click="
                navigateTo(`/reports/templates/builder?id=${template.id}`)
              "
            >
              <Edit class="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" class="flex-1">
              <Copy class="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Stats -->
    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-border">
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Total Templates</p>
          <p class="text-3xl font-bold text-foreground">6</p>
          <p class="text-sm text-muted-foreground mt-2">5 active, 1 draft</p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Total Submissions</p>
          <p class="text-3xl font-bold text-blue-600">600</p>
          <p class="text-sm text-muted-foreground mt-2">This month</p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Departments</p>
          <p class="text-3xl font-bold text-purple-600">6</p>
          <p class="text-sm text-muted-foreground mt-2">Using templates</p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Avg Completion</p>
          <p class="text-3xl font-bold text-emerald-600">98%</p>
          <p class="text-sm text-emerald-600 mt-2">+3% from last month</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
