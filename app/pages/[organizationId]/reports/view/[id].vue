<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-vue-next";
import { useRoute } from "#imports";

const route = useRoute();
const reportId = computed(() => route.params.id);

const showComments = ref(false);
const newComment = ref("");

const report = computed(() => ({
  id: reportId.value,
  templateName: "Daily Ward Report",
  submittedBy: {
    name: "Sarah Johnson",
    role: "Senior Nurse",
    avatar: "SJ",
  },
  submittedAt: "2024-01-15 09:30 AM",
  department: "Nursing",
  status: "Approved",
  approvedBy: "Dr. Michael Chen",
  approvedAt: "2024-01-15 10:15 AM",
  fields: [
    { field: "Ward Name", value: "Ward A - General Medicine", type: "text" },
    { field: "Report Date", value: "2024-01-15", type: "date" },
    { field: "Total Patients", value: "24", type: "number" },
    { field: "New Admissions", value: "3", type: "number" },
    { field: "Discharges", value: "2", type: "number" },
    { field: "Ward Condition", value: "Good", type: "select" },
    {
      field: "Notable Incidents",
      value:
        "Patient in Room 205 required additional monitoring. Situation resolved by evening shift.",
      type: "textarea",
    },
    {
      field: "Staff Notes",
      value:
        "All staff completed their duties on time. Equipment maintenance scheduled for next week.",
      type: "textarea",
    },
    { field: "All equipment functional", value: "Yes", type: "checkbox" },
    { field: "Adequate supplies", value: "Yes", type: "checkbox" },
  ],
}));

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Approved: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    Pending: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    "Under Review": "bg-blue-100 text-blue-700 hover:bg-blue-100",
    Rejected: "bg-red-100 text-red-700 hover:bg-red-100",
  };
  return colors[status] || colors["Pending"];
};

const approveReport = () => {
  // Approve logic
};

const rejectReport = () => {
  // Reject logic
};

const addComment = () => {
  newComment.value = "";
};
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="space-y-6 max-w-6xl mx-auto">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            @click="navigateTo('/reports/submitted')"
          >
            <ArrowLeft class="h-4 w-4" />
          </Button>
          <div>
            <h1 class="text-3xl font-bold text-foreground">
              {{ report.templateName }}
            </h1>
            <p class="text-muted-foreground mt-1">
              Submitted on {{ report.submittedAt }}
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <Button variant="outline">
            <Printer class="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download class="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader class="border-b">
              <div class="flex items-start justify-between">
                <div>
                  <CardTitle class="text-xl">Report Details</CardTitle>
                  <p class="text-sm text-muted-foreground mt-1">
                    Complete submission data
                  </p>
                </div>
                <Badge
                  :class="getStatusColor(report.status)"
                  class="text-base px-4 py-1.5"
                >
                  {{ report.status }}
                </Badge>
              </div>
            </CardHeader>
            <CardContent class="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="w-1/3">Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="(item, index) in report.fields"
                    :key="index"
                    class="hover:bg-muted"
                  >
                    <TableCell class="font-medium text-foreground">
                      {{ item.field }}
                    </TableCell>
                    <TableCell>
                      <div
                        v-if="item.type === 'textarea'"
                        class="text-foreground whitespace-pre-line max-w-2xl"
                      >
                        {{ item.value }}
                      </div>
                      <div
                        v-else-if="item.type === 'checkbox'"
                        class="flex items-center gap-2"
                      >
                        <CheckCircle2
                          v-if="item.value === 'Yes'"
                          class="h-5 w-5 text-emerald-600"
                        />
                        <XCircle v-else class="h-5 w-5 text-red-600" />
                        <span class="text-foreground font-medium">{{
                          item.value
                        }}</span>
                      </div>
                      <Badge
                        v-else-if="item.type === 'select'"
                        class="bg-blue-100 text-blue-700 hover:bg-blue-100"
                      >
                        {{ item.value }}
                      </Badge>
                      <span v-else class="text-foreground font-medium">
                        {{ item.value }}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="border-b">
              <div class="flex items-center justify-between">
                <CardTitle>Comments & Notes</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="showComments = !showComments"
                >
                  <MessageSquare class="h-4 w-4 mr-2" />
                  {{ showComments ? "Hide" : "Show" }}
                </Button>
              </div>
            </CardHeader>

            <CardContent v-if="showComments" class="p-6">
              <div class="space-y-4">
                <div class="space-y-2">
                  <Label for="comment">Add Comment</Label>
                  <Textarea
                    id="comment"
                    v-model="newComment"
                    placeholder="Add a comment or note..."
                    rows="3"
                  />
                  <div class="flex justify-end">
                    <Button size="sm" @click="addComment"> Add Comment </Button>
                  </div>
                </div>

                <Separator />

                <div class="text-center py-8 text-muted-foreground">
                  <MessageSquare
                    class="h-12 w-12 mx-auto mb-3 text-muted-foreground"
                  />
                  <p class="font-medium">No comments yet</p>
                  <p class="text-sm">Be the first to add a comment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle class="text-base">Submitted By</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <span class="text-sm font-semibold text-blue-700">{{
                    report.submittedBy.avatar
                  }}</span>
                </div>
                <div>
                  <p class="font-semibold text-foreground">
                    {{ report.submittedBy.name }}
                  </p>
                  <p class="text-sm text-muted-foreground">
                    {{ report.submittedBy.role }}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card v-if="report.status === 'Approved'">
            <CardHeader>
              <CardTitle class="text-base">Approval Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-3 text-sm">
                <div class="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 class="h-5 w-5" />
                  <span class="font-semibold">Approved</span>
                </div>
                <div class="space-y-1">
                  <p class="text-muted-foreground">
                    By:
                    <span class="text-foreground font-medium">{{
                      report.approvedBy
                    }}</span>
                  </p>
                  <p class="text-muted-foreground">
                    On:
                    <span class="text-foreground font-medium">{{
                      report.approvedAt
                    }}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card v-if="report.status === 'Pending'">
            <CardHeader>
              <CardTitle class="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-2">
                <Button
                  class="w-full bg-emerald-600 hover:bg-emerald-700"
                  @click="approveReport"
                >
                  <CheckCircle2 class="h-4 w-4 mr-2" />
                  Approve Report
                </Button>
                <Button
                  variant="outline"
                  class="w-full border-red-300 text-red-600 hover:bg-red-50"
                  @click="rejectReport"
                >
                  <XCircle class="h-4 w-4 mr-2" />
                  Reject Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle class="text-base">Template Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-3 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Template:</span>
                  <span class="font-medium text-foreground text-right">{{
                    report.templateName
                  }}</span>
                </div>
                <Separator />
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Department:</span>
                  <Badge class="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    {{ report.department }}
                  </Badge>
                </div>
                <Separator />
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Total Fields:</span>
                  <span class="font-medium text-foreground">{{
                    report.fields.length
                  }}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
