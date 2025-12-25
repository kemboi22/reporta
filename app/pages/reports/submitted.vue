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
import {
  Search,
  Download,
  Eye,
  Filter,
  FileText,
  Calendar,
  User,
  CheckCircle2,
} from "lucide-vue-next";
import { definePageMeta, navigateTo } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const searchQuery = ref("");
const selectedTemplate = ref("all");
const selectedStatus = ref("all");
const selectedDateRange = ref("7days");

const reports = [
  {
    id: 1,
    templateName: "Daily Ward Report",
    submittedBy: "Sarah Johnson",
    submittedAt: "2024-01-15 09:30 AM",
    department: "Nursing",
    status: "Approved",
    data: {
      "Ward Name": "Ward A",
      "Total Patients": 24,
      "New Admissions": 3,
      Discharges: 2,
    },
  },
  {
    id: 2,
    templateName: "Medication Inventory",
    submittedBy: "Mike Chen",
    submittedAt: "2024-01-14 02:15 PM",
    department: "Pharmacy",
    status: "Pending",
    data: {
      "Stock Level": "Good",
      "Items Low": 5,
      "Expired Items": 0,
    },
  },
  {
    id: 3,
    templateName: "Incident Report Form",
    submittedBy: "Emily Davis",
    submittedAt: "2024-01-14 11:20 AM",
    department: "Safety",
    status: "Under Review",
    data: {
      "Incident Type": "Near Miss",
      Severity: "Low",
      Location: "Ward B",
    },
  },
  {
    id: 4,
    templateName: "Equipment Maintenance Log",
    submittedBy: "James Wilson",
    submittedAt: "2024-01-13 04:45 PM",
    department: "Maintenance",
    status: "Approved",
    data: {
      Equipment: "MRI Machine",
      Status: "Functional",
      "Next Service": "2024-02-13",
    },
  },
  {
    id: 5,
    templateName: "Patient Satisfaction Survey",
    submittedBy: "Lisa Anderson",
    submittedAt: "2024-01-13 10:00 AM",
    department: "Quality",
    status: "Approved",
    data: {
      "Overall Rating": "4.5/5",
      "Response Count": 28,
      Satisfaction: "90%",
    },
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Approved: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    Pending: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    "Under Review": "bg-blue-100 text-blue-700 hover:bg-blue-100",
    Rejected: "bg-red-100 text-red-700 hover:bg-red-100",
  };
  return colors[status] || colors["Pending"];
};

const viewReport = (reportId: number) => {
  navigateTo(`/reports/view/${reportId}`);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Submitted Reports</h1>
        <p class="text-slate-600 mt-1">View and manage all submitted reports</p>
      </div>

      <Button class="bg-blue-600 hover:bg-blue-700 text-white">
        <Download class="h-4 w-4 mr-2" />
        Export All
      </Button>
    </div>

    <!-- Filters -->
    <Card class="border-slate-200">
      <CardContent class="p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search reports..."
              class="pl-10"
            />
          </div>

          <Select v-model="selectedTemplate">
            <SelectTrigger class="w-48">
              <SelectValue placeholder="All Templates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              <SelectItem value="ward">Daily Ward Report</SelectItem>
              <SelectItem value="inventory">Medication Inventory</SelectItem>
              <SelectItem value="incident">Incident Report</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedStatus">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="review">Under Review</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedDateRange">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Reports List -->
    <div class="space-y-4">
      <Card
        v-for="report in reports"
        :key="report.id"
        class="border-slate-200 hover:shadow-md transition-all cursor-pointer"
        @click="viewReport(report.id)"
      >
        <CardContent class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex gap-4 flex-1">
              <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <FileText class="h-6 w-6 text-blue-600" />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <h3 class="text-lg font-semibold text-slate-900">
                      {{ report.templateName }}
                    </h3>
                    <div
                      class="flex items-center gap-4 mt-1 text-sm text-slate-600"
                    >
                      <div class="flex items-center gap-1.5">
                        <User class="h-4 w-4" />
                        <span>{{ report.submittedBy }}</span>
                      </div>
                      <div class="flex items-center gap-1.5">
                        <Calendar class="h-4 w-4" />
                        <span>{{ report.submittedAt }}</span>
                      </div>
                    </div>
                  </div>

                  <Badge :class="getStatusColor(report.status)">
                    {{ report.status }}
                  </Badge>
                </div>

                <div class="flex items-center gap-2 mb-3">
                  <Badge class="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    {{ report.department }}
                  </Badge>
                </div>

                <!-- Report Data Preview -->
                <div class="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div v-for="(value, key) in report.data" :key="key">
                    <p class="text-xs text-slate-500 mb-1">{{ key }}</p>
                    <p class="text-sm font-semibold text-slate-900">
                      {{ value }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                @click.stop="viewReport(report.id)"
              >
                <Eye class="h-4 w-4 mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm" @click.stop>
                <Download class="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Stats -->
    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-slate-200">
        <CardContent class="p-6">
          <p class="text-sm text-slate-600 mb-1">Total Submitted</p>
          <p class="text-3xl font-bold text-slate-900">156</p>
          <p class="text-sm text-emerald-600 mt-2">+12% this week</p>
        </CardContent>
      </Card>

      <Card class="border-slate-200">
        <CardContent class="p-6">
          <p class="text-sm text-slate-600 mb-1">Approved</p>
          <p class="text-3xl font-bold text-emerald-600">142</p>
          <p class="text-sm text-slate-500 mt-2">91% approval rate</p>
        </CardContent>
      </Card>

      <Card class="border-slate-200">
        <CardContent class="p-6">
          <p class="text-sm text-slate-600 mb-1">Pending Review</p>
          <p class="text-3xl font-bold text-amber-600">8</p>
          <p class="text-sm text-slate-500 mt-2">Awaiting action</p>
        </CardContent>
      </Card>

      <Card class="border-slate-200">
        <CardContent class="p-6">
          <p class="text-sm text-slate-600 mb-1">Avg Response Time</p>
          <p class="text-3xl font-bold text-blue-600">2.4h</p>
          <p class="text-sm text-emerald-600 mt-2">-15% faster</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
