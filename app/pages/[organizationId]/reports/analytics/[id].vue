<script setup lang="ts">
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  Calendar,
  ArrowLeft,
  Download,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const templateId = route.params.id as string;

const selectedPeriod = ref("today");
const selectedMetric = ref("all");
const dateFrom = ref("");
const dateTo = ref("");
const useCustomDateRange = ref(false);

const { data: analyticsData, pending } = await useLazyFetch(
  () => {
    const params = new URLSearchParams();
    
    if (useCustomDateRange.value) {
      if (dateFrom.value) params.append('dateFrom', dateFrom.value);
      if (dateTo.value) params.append('dateTo', dateTo.value);
    } else {
      params.append('period', selectedPeriod.value);
    }
    
    const queryString = params.toString();
    return `/api/${organizationId}/analytics/${templateId}${queryString ? `?${queryString}` : ''}`;
  },
  { 
    key: `analytics-${templateId}`,
    watch: [selectedPeriod, dateFrom, dateTo, useCustomDateRange]
  },
);

const filteredDailyData = computed(() => {
  if (!analyticsData.value?.analytics?.dailyBreakdown) return [];
  return analyticsData.value.analytics.dailyBreakdown;
});

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toFixed(2);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const maxValue = computed(() => {
  if (!filteredDailyData.value || filteredDailyData.value.length === 0) return 100;
  return Math.max(
    ...filteredDailyData.value.map((d: any) => d.reportCount),
    1
  );
});

const exportAnalytics = () => {
  if (!analyticsData.value) return;

  const rows: string[][] = [];
  rows.push(["Date", "Report Count"]);

  const sumsKeys = Object.keys(
    analyticsData.value.analytics.sums || {}
  );

  if (sumsKeys.length > 0) {
    sumsKeys.forEach((key) => {
      rows.push(["", analyticsData.value.analytics.sums[key].label]);
    });
  }

  filteredDailyData.value.forEach((dayData: any) => {
    const row = [formatDate(dayData.date), dayData.reportCount.toString()];
    if (sumsKeys.length > 0) {
      sumsKeys.forEach((key) => {
        row.push(dayData.sums[key]?.toString() || "0");
      });
    }
    rows.push(row);
  });

  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const escaped = String(cell).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `analytics_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);

  toast.success("Analytics exported to CSV");
};
</script>

<template>
  <div v-if="pending" class="flex items-center justify-center h-[60vh]">
    <div
      class="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"
    ></div>
  </div>

  <div v-else-if="analyticsData" class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          @click="navigateTo(`/${organizationId}/reports/templates`)"
          class="rounded-lg hover:bg-muted"
        >
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">
            {{ analyticsData.template.name }} Analytics
          </h1>
          <p class="text-sm text-muted-foreground">
            {{ analyticsData.template.description }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            @click="useCustomDateRange = false"
            :class="{ 'bg-primary text-primary-foreground': !useCustomDateRange }"
          >
            Period
          </Button>
          <Button
            variant="outline"
            size="sm"
            @click="useCustomDateRange = true"
            :class="{ 'bg-primary text-primary-foreground': useCustomDateRange }"
          >
            Date Range
          </Button>
        </div>

        <Select v-if="!useCustomDateRange" v-model="selectedPeriod" class="w-[140px]">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>

        <div v-if="useCustomDateRange" class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <Calendar class="h-4 w-4 text-muted-foreground" />
            <Input
              v-model="dateFrom"
              type="date"
              class="w-[140px]"
              placeholder="From date"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted-foreground">to</span>
            <Input
              v-model="dateTo"
              type="date"
              class="w-[140px]"
              placeholder="To date"
            />
          </div>
        </div>

        <Button variant="outline" size="sm" @click="exportAnalytics">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">
                Total Reports
              </p>
              <p class="text-2xl font-bold mt-1">
                {{ analyticsData.analytics.totalReports }}
              </p>
            </div>
            <div class="p-3 bg-primary/10 rounded-lg">
              <BarChart3 class="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        v-if="Object.keys(analyticsData.analytics.sums || {}).length > 0"
      >
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Sum</p>
              <p class="text-2xl font-bold mt-1">
                {{
                  formatNumber(
                    Object.values(analyticsData.analytics.sums).reduce(
                      (acc: number, v: any) => acc + v.value,
                      0
                    )
                  )
                }}
              </p>
            </div>
            <div class="p-3 bg-emerald-10 rounded-lg">
              <DollarSign class="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        v-if="Object.keys(analyticsData.analytics.counts || {}).length > 0"
      >
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">
                Total Counted
              </p>
              <p class="text-2xl font-bold mt-1">
                {{
                  Object.values(analyticsData.analytics.counts).reduce(
                    (acc: number, v: any) => acc + v.value,
                    0
                  )
                }}
              </p>
            </div>
            <div class="p-3 bg-blue-10 rounded-lg">
              <Users class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        v-if="Object.keys(analyticsData.analytics.averages || {}).length > 0"
      >
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Average</p>
              <p class="text-2xl font-bold mt-1">
                {{
                  formatNumber(
                    Object.values(analyticsData.analytics.averages).reduce(
                      (acc: number, v: any) => acc + v.value,
                      0
                    ) /
                      Object.keys(analyticsData.analytics.averages).length
                  )
                }}
              </p>
            </div>
            <div class="p-3 bg-amber-10 rounded-lg">
              <TrendingUp class="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Calendar class="h-5 w-5" />
          Daily Trend - Report Count
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          v-if="filteredDailyData.length === 0"
          class="text-center py-12 text-muted-foreground"
        >
          No data available for the selected period
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="(dayData, index) in filteredDailyData"
            :key="dayData.date"
            class="flex items-center gap-4"
          >
            <div class="w-24 text-sm text-muted-foreground flex-shrink-0">
              {{ formatDate(dayData.date) }}
            </div>
            <div
              class="flex-1 h-8 bg-muted rounded-lg relative overflow-hidden flex items-center px-3 gap-4"
            >
              <div
                class="h-6 bg-primary rounded flex items-center justify-center text-xs font-medium text-primary-foreground transition-all absolute"
                :style="{
                  width: `${(dayData.reportCount / maxValue) * 100}%`,
                }"
              >
                <span
                  v-if="(dayData.reportCount / maxValue) * 100 > 15"
                  class="ml-2"
                >
                  {{ dayData.reportCount }}
                </span>
              </div>
              <div class="w-full flex">
                <span
                  v-if="(dayData.reportCount / maxValue) * 100 <= 15"
                  class="text-sm font-medium ml-2"
                >
                  {{ dayData.reportCount }} report{{
                    dayData.reportCount !== 1 ? "s" : ""
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card
      v-if="Object.keys(analyticsData.analytics.sums || {}).length > 0"
    >
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <DollarSign class="h-5 w-5" />
          Summable Fields Totals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="(sumData, fieldId) in analyticsData.analytics.sums"
            :key="fieldId"
            class="bg-muted/50"
          >
            <CardContent class="p-4">
              <p class="text-sm text-muted-foreground mb-1">
                {{ sumData.label }}
              </p>
              <p class="text-2xl font-bold">
                {{ formatNumber(sumData.value) }}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>

    <Card
      v-if="Object.keys(analyticsData.analytics.counts || {}).length > 0"
    >
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Users class="h-5 w-5" />
          Counted Fields
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="(countData, fieldId) in analyticsData.analytics.counts"
            :key="fieldId"
            class="bg-muted/50"
          >
            <CardContent class="p-4">
              <p class="text-sm text-muted-foreground mb-1">
                {{ countData.label }}
              </p>
              <p class="text-2xl font-bold">{{ countData.value }}</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>

    <Card
      v-if="Object.keys(analyticsData.analytics.averages || {}).length > 0"
    >
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <TrendingUp class="h-5 w-5" />
          Averages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="(avgData, fieldId) in analyticsData.analytics.averages"
            :key="fieldId"
            class="bg-muted/50"
          >
            <CardContent class="p-4">
              <p class="text-sm text-muted-foreground mb-1">
                {{ avgData.label }}
              </p>
              <p class="text-2xl font-bold">{{ formatNumber(avgData.value) }}</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>

    <Card
      v-if="Object.keys(analyticsData.analytics.fieldBreakdown || {}).length > 0"
    >
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <BarChart3 class="h-5 w-5" />
          Field Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <Card
            v-for="(breakdown, fieldId) in analyticsData.analytics
              .fieldBreakdown"
            :key="fieldId"
            class="border-border"
          >
            <CardContent class="p-4">
              <div class="mb-4">
                <p class="font-medium">{{ breakdown.label }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ breakdown.values.length }} entries ·
                  {{ breakdown.uniqueCount }} unique values
                </p>
              </div>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="(value, idx) in breakdown.values.slice(0, 20)"
                  :key="idx"
                  variant="secondary"
                  class="text-xs"
                >
                  {{ value }}
                </Badge>
                <Badge
                  v-if="breakdown.values.length > 20"
                  variant="outline"
                  class="text-xs"
                >
                  +{{ breakdown.values.length - 20 }} more
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  </div>
</template>