<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  FileText,
  Users,
  Clock,
  CheckCircle2,
  BarChart3,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const selectedDepartment = ref("all");
const selectedPeriod = ref("30days");

const metricsData = [
  {
    label: "Total Submissions",
    value: "1,248",
    change: "+12.5%",
    trend: "up",
    icon: FileText,
    color: "blue",
  },
  {
    label: "Active Templates",
    value: "24",
    change: "+3",
    trend: "up",
    icon: BarChart3,
    color: "purple",
  },
  {
    label: "Avg Completion Time",
    value: "4.2 min",
    change: "-8.3%",
    trend: "down",
    icon: Clock,
    color: "emerald",
  },
  {
    label: "Approval Rate",
    value: "94.8%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle2,
    color: "amber",
  },
];

const departmentStats = [
  {
    department: "Nursing",
    submissions: 342,
    completion: 96,
    avgTime: "3.8 min",
  },
  {
    department: "Pharmacy",
    submissions: 156,
    completion: 98,
    avgTime: "2.4 min",
  },
  {
    department: "Quality",
    submissions: 289,
    completion: 94,
    avgTime: "5.2 min",
  },
  {
    department: "Maintenance",
    submissions: 124,
    completion: 92,
    avgTime: "6.1 min",
  },
  {
    department: "Safety",
    submissions: 198,
    completion: 97,
    avgTime: "4.5 min",
  },
  { department: "HR", submissions: 139, completion: 95, avgTime: "4.8 min" },
];

const topTemplates = [
  { name: "Daily Ward Report", submissions: 342, trend: 12 },
  { name: "Patient Satisfaction", submissions: 289, trend: 8 },
  { name: "Incident Report", submissions: 198, trend: -3 },
  { name: "Medication Inventory", submissions: 156, trend: 15 },
  { name: "Equipment Maintenance", submissions: 124, trend: 5 },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
  };
  return colors[color] || colors.blue;
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Report Analytics</h1>
        <p class="text-slate-600 mt-1">
          Track performance and insights across all reports
        </p>
      </div>

      <div class="flex gap-3">
        <Select v-model="selectedPeriod">
          <SelectTrigger class="w-40">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" class="border-slate-300">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        v-for="metric in metricsData"
        :key="metric.label"
        class="border-slate-200"
      >
        <CardContent class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div
              :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center',
                getColorClasses(metric.color),
              ]"
            >
              <component :is="metric.icon" class="h-6 w-6" />
            </div>
            <Badge
              :class="
                metric.trend === 'up'
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-red-100 text-red-700 hover:bg-red-100'
              "
            >
              <component
                :is="metric.trend === 'up' ? TrendingUp : TrendingDown"
                class="h-3 w-3 mr-1"
              />
              {{ metric.change }}
            </Badge>
          </div>

          <p class="text-sm text-slate-600 mb-1">{{ metric.label }}</p>
          <p class="text-3xl font-bold text-slate-900">{{ metric.value }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Submission Trends -->
      <Card class="border-slate-200">
        <CardContent class="p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                Submission Trends
              </h3>
              <p class="text-sm text-slate-600">Daily submission volume</p>
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
          </div>

          <!-- Chart Placeholder -->
          <div
            class="h-64 bg-slate-50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200"
          >
            <div class="text-center">
              <BarChart3 class="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p class="text-sm text-slate-600">Chart visualization area</p>
              <p class="text-xs text-slate-500">
                Integrate with Chart.js or similar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Template Distribution -->
      <Card class="border-slate-200">
        <CardContent class="p-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-slate-900">
              Template Distribution
            </h3>
            <p class="text-sm text-slate-600">Usage by template type</p>
          </div>

          <!-- Chart Placeholder -->
          <div
            class="h-64 bg-slate-50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200"
          >
            <div class="text-center">
              <BarChart3 class="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p class="text-sm text-slate-600">Pie/Donut chart area</p>
              <p class="text-xs text-slate-500">Template usage breakdown</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Department Performance -->
    <Card class="border-slate-200">
      <CardContent class="p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-slate-900">
              Department Performance
            </h3>
            <p class="text-sm text-slate-600">
              Compare metrics across departments
            </p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-200">
                <th
                  class="text-left py-3 px-4 text-sm font-semibold text-slate-900"
                >
                  Department
                </th>
                <th
                  class="text-right py-3 px-4 text-sm font-semibold text-slate-900"
                >
                  Submissions
                </th>
                <th
                  class="text-right py-3 px-4 text-sm font-semibold text-slate-900"
                >
                  Completion Rate
                </th>
                <th
                  class="text-right py-3 px-4 text-sm font-semibold text-slate-900"
                >
                  Avg Time
                </th>
                <th
                  class="text-right py-3 px-4 text-sm font-semibold text-slate-900"
                >
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="dept in departmentStats"
                :key="dept.department"
                class="border-b border-slate-100 hover:bg-slate-50"
              >
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                    >
                      <Users class="h-5 w-5 text-blue-600" />
                    </div>
                    <span class="font-medium text-slate-900">{{
                      dept.department
                    }}</span>
                  </div>
                </td>
                <td class="text-right py-4 px-4 font-semibold text-slate-900">
                  {{ dept.submissions }}
                </td>
                <td class="text-right py-4 px-4">
                  <div class="flex items-center justify-end gap-2">
                    <div
                      class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden"
                    >
                      <div
                        class="h-full bg-emerald-500 rounded-full"
                        :style="{ width: `${dept.completion}%` }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium text-slate-900"
                      >{{ dept.completion }}%</span
                    >
                  </div>
                </td>
                <td class="text-right py-4 px-4 text-slate-700">
                  {{ dept.avgTime }}
                </td>
                <td class="text-right py-4 px-4">
                  <Badge
                    :class="
                      dept.completion >= 95
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                    "
                  >
                    {{ dept.completion >= 95 ? "Excellent" : "Good" }}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Top Templates -->
    <Card class="border-slate-200">
      <CardContent class="p-6">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-slate-900">Top Templates</h3>
          <p class="text-sm text-slate-600">
            Most frequently used report templates
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(template, index) in topTemplates"
            :key="template.name"
            class="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm"
              >
                {{ index + 1 }}
              </div>
              <div>
                <p class="font-medium text-slate-900">{{ template.name }}</p>
                <p class="text-sm text-slate-600">
                  {{ template.submissions }} submissions
                </p>
              </div>
            </div>

            <Badge
              :class="
                template.trend > 0
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-red-100 text-red-700 hover:bg-red-100'
              "
            >
              <component
                :is="template.trend > 0 ? TrendingUp : TrendingDown"
                class="h-3 w-3 mr-1"
              />
              {{ Math.abs(template.trend) }}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
