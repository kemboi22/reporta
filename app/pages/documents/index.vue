<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  FileText,
  Download,
  Upload,
  Grid3x3,
  List,
  UserPlus,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const viewMode = ref<"grid" | "list">("grid");
const selectedCategory = ref("all");
const showUploadDialog = ref(false);
const showAssignDialog = ref(false);
const selectedDocument = ref<any>(null);

const selectedFile = ref<File | null>(null);
const uploadCategory = ref("");
const assignedStaff = ref<string[]>([]);

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
};

const handleUpload = () => {
  console.log("[v0] Uploading file:", selectedFile.value?.name);
  showUploadDialog.value = false;
  selectedFile.value = null;
};

const openAssignDialog = (doc: any) => {
  selectedDocument.value = doc;
  showAssignDialog.value = true;
};

const handleAssign = () => {
  console.log("[v0] Assigning document to:", assignedStaff.value);
  showAssignDialog.value = false;
  assignedStaff.value = [];
};

const documents = [
  {
    id: 1,
    name: "Safety Protocol 2024",
    type: "PDF",
    category: "Policy",
    size: "2.4 MB",
    uploadedBy: "Admin",
    uploadedDate: "Dec 20, 2024",
    downloads: 45,
    assignedTo: ["Sarah Johnson", "Mike Chen"],
  },
  {
    id: 2,
    name: "Staff Handbook",
    type: "PDF",
    category: "HR",
    size: "5.1 MB",
    uploadedBy: "Robert Taylor",
    uploadedDate: "Dec 15, 2024",
    downloads: 120,
  },
  {
    id: 3,
    name: "Emergency Procedures",
    type: "PDF",
    category: "Compliance",
    size: "1.8 MB",
    uploadedBy: "Sarah Johnson",
    uploadedDate: "Dec 10, 2024",
    downloads: 89,
  },
  {
    id: 4,
    name: "Equipment Manual",
    type: "PDF",
    category: "Training",
    size: "3.2 MB",
    uploadedBy: "Mike Chen",
    uploadedDate: "Dec 5, 2024",
    downloads: 34,
  },
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Policy: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    HR: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    Compliance: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    Training: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  };
  return colors[category] || "bg-muted text-foreground";
};
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-foreground">Documents</h1>
          <p class="text-muted-foreground mt-1">Centralized document repository</p>
        </div>

        <!-- Added upload dialog -->
        <Dialog v-model:open="showUploadDialog">
          <DialogTrigger as-child>
            <Button class="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus class="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription
                >Upload a new document to the repository</DialogDescription
              >
            </DialogHeader>
            <div class="space-y-4 py-4">
              <div class="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <div class="flex items-center gap-2">
                  <Input id="file" type="file" @change="handleFileSelect" />
                  <Button size="icon" variant="outline">
                    <Upload class="h-4 w-4" />
                  </Button>
                </div>
                <p v-if="selectedFile" class="text-sm text-muted-foreground">
                  Selected: {{ selectedFile.name }}
                </p>
              </div>

              <div class="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select v-model="uploadCategory">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="flex justify-end gap-2">
                <Button variant="outline" @click="showUploadDialog = false"
                  >Cancel</Button
                >
                <Button @click="handleUpload" :disabled="!selectedFile"
                  >Upload</Button
                >
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <!-- Filters -->
      <Card class="border-border">
        <CardContent class="p-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="relative flex-1">
              <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input placeholder="Search documents..." class="pl-10" />
            </div>

            <Select v-model="selectedCategory">
              <SelectTrigger class="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>

            <div class="flex border border-border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                :class="viewMode === 'grid' && 'bg-muted'"
                @click="viewMode = 'grid'"
              >
                <Grid3x3 class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :class="viewMode === 'list' && 'bg-muted'"
                @click="viewMode = 'list'"
              >
                <List class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Documents Grid -->
      <div
        v-if="viewMode === 'grid'"
        class="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card
          v-for="doc in documents"
          :key="doc.id"
          class="border-border hover:shadow-lg transition-all cursor-pointer"
        >
          <CardContent class="p-6">
            <div
              class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4"
            >
              <FileText class="h-6 w-6 text-red-600" />
            </div>

            <h3 class="font-semibold text-foreground mb-2 line-clamp-2">
              {{ doc.name }}
            </h3>
            <Badge :class="getCategoryColor(doc.category)" class="mb-3">{{
              doc.category
            }}</Badge>

            <div class="space-y-2 text-sm text-muted-foreground">
              <div class="flex justify-between">
                <span>Size</span>
                <span class="font-medium text-foreground">{{ doc.size }}</span>
              </div>
              <div class="flex justify-between">
                <span>Downloads</span>
                <span class="font-medium text-foreground">{{
                  doc.downloads
                }}</span>
              </div>
            </div>

            <!-- Added assign button -->
            <div class="grid grid-cols-2 gap-2 mt-4">
              <Button variant="outline" size="sm">
                <Download class="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                @click="openAssignDialog(doc)"
              >
                <UserPlus class="h-4 w-4 mr-2" />
                Assign
              </Button>
            </div>

            <div
              v-if="doc.assignedTo && doc.assignedTo.length > 0"
              class="mt-3 pt-3 border-t border-border"
            >
              <p class="text-xs text-muted-foreground mb-2">Assigned to:</p>
              <div class="flex flex-wrap gap-1">
                <Badge
                  v-for="staff in doc.assignedTo"
                  :key="staff"
                  variant="secondary"
                  class="text-xs"
                >
                  {{ staff }}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Documents List -->
      <Card v-else class="border-border">
        <CardContent class="p-0">
          <table class="w-full">
              <thead class="bg-muted border-b border-border">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                >
                  Document
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                >
                  Category
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                >
                  Size
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                >
                  Uploaded By
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="doc in documents"
                :key="doc.id"
                class="hover:bg-muted transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <FileText class="h-5 w-5 text-red-600" />
                    <span class="font-medium text-foreground">{{
                      doc.name
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <Badge :class="getCategoryColor(doc.category)">{{
                    doc.category
                  }}</Badge>
                </td>
                <td class="px-6 py-4 text-sm text-muted-foreground">{{ doc.size }}</td>
                <td class="px-6 py-4 text-sm text-muted-foreground">
                  {{ doc.uploadedBy }}
                </td>
                <td class="px-6 py-4 text-sm text-muted-foreground">
                  {{ doc.uploadedDate }}
                </td>
                <td class="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm">
                    <Download class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="openAssignDialog(doc)"
                  >
                    <UserPlus class="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <!-- Stats -->
      <div class="grid md:grid-cols-4 gap-6">
        <Card class="border-border">
          <CardContent class="p-6">
            <p class="text-sm text-muted-foreground mb-1">Total Documents</p>
            <p class="text-3xl font-bold text-foreground">248</p>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardContent class="p-6">
            <p class="text-sm text-muted-foreground mb-1">Storage Used</p>
            <p class="text-3xl font-bold text-blue-600">12.4 GB</p>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardContent class="p-6">
            <p class="text-sm text-muted-foreground mb-1">Categories</p>
            <p class="text-3xl font-bold text-purple-600">8</p>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardContent class="p-6">
            <p class="text-sm text-muted-foreground mb-1">Downloads</p>
            <p class="text-3xl font-bold text-emerald-600">1,234</p>
          </CardContent>
        </Card>
      </div>

      <!-- Added assign dialog -->
      <Dialog v-model:open="showAssignDialog">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Document</DialogTitle>
            <DialogDescription
              >Select staff members to assign this document
              to</DialogDescription
            >
          </DialogHeader>
          <div class="space-y-4 py-4">
            <div class="space-y-2">
              <Label>Staff Members</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="mike">Mike Chen</SelectItem>
                  <SelectItem value="emma">Emma Davis</SelectItem>
                  <SelectItem value="robert">Robert Taylor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex justify-end gap-2">
              <Button variant="outline" @click="showAssignDialog = false"
                >Cancel</Button
              >
              <Button @click="handleAssign">Assign</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </NuxtLayout>
</template>
