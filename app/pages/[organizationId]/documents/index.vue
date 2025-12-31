<script setup lang="ts">
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

const route = useRoute();
const organizationId = route.params.organizationId as string;

const viewMode = ref<"grid" | "list">("grid");
const selectedCategory = ref("all");
const showUploadDialog = ref(false);
const showAssignDialog = ref(false);
const selectedDocument = ref<any>(null);
const searchQuery = ref("");

const selectedFile = ref<File | null>(null);
const uploadCategory = ref("");
const uploadDescription = ref("");
const uploadWorkspaceId = ref("");
const uploadProjectId = ref<string | null>(null);
const uploadTags = ref("");
const uploadVisibility = ref("WORKSPACE");
const uploadIsPinned = ref(false);

const { data: documents, refresh: refreshDocuments } = await useLazyFetch(
  `/api/${organizationId}/documents`,
  {
    key: `documents-${organizationId}`,
    transform: (data) => data || [],
  },
);

const { data: staffMembers } = await useLazyFetch(
  `/api/${organizationId}/staff`,
  {
    key: `staff-${organizationId}`,
    transform: (data) => data || [],
  },
);

const { data: workspaces } = await useLazyFetch(
  `/api/${organizationId}/workspaces`,
  {
    key: `workspaces-${organizationId}`,
    transform: (data) => data || [],
  },
);

const { data: projects } = await useLazyFetch(
  `/api/${organizationId}/projects`,
  {
    key: `projects-${organizationId}`,
    transform: (data) => data || [],
  },
);

watchEffect(() => {
  if (
    workspaces.value &&
    workspaces.value.length > 0 &&
    !uploadWorkspaceId.value
  ) {
    uploadWorkspaceId.value = workspaces.value[0].id;
  }
});

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
};

const handleUpload = async () => {
  if (!selectedFile.value || !uploadWorkspaceId.value) return;

  try {
    const formData = new FormData();
    formData.append("file", selectedFile.value);
    formData.append("workspaceId", uploadWorkspaceId.value);
    if (uploadProjectId.value)
      formData.append("projectId", uploadProjectId.value);
    formData.append("name", selectedFile.value.name);
    if (uploadDescription.value)
      formData.append("description", uploadDescription.value);
    if (uploadCategory.value) formData.append("category", uploadCategory.value);
    if (uploadTags.value) formData.append("tags", uploadTags.value);
    formData.append("visibility", uploadVisibility.value);
    formData.append("isPinned", uploadIsPinned.value.toString());

    await $fetch(`/api/${organizationId}/documents`, {
      method: "POST",
      body: formData,
    });

    showUploadDialog.value = false;
    selectedFile.value = null;
    uploadCategory.value = "";
    uploadDescription.value = "";
    uploadWorkspaceId.value =
      workspaces.value && workspaces.value.length > 0
        ? workspaces.value[0].id
        : "";
    uploadProjectId.value = null;
    uploadTags.value = "";
    uploadVisibility.value = "WORKSPACE";
    uploadIsPinned.value = false;
    await refreshDocuments();
  } catch (error: any) {
    console.error("Failed to upload document:", error);
    throw error;
  }
};

const openAssignDialog = (doc: any) => {
  selectedDocument.value = doc;
  showAssignDialog.value = true;
};

const downloadDocument = async (doc: any) => {
  try {
    const response = await $fetch(
      `/api/${organizationId}/documents/${doc.id}/download`,
      {
        responseType: "blob",
      },
    );
    const blob = new Blob([response], { type: doc.mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download document:", error);
  }
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    policy: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    hr: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    compliance: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    training: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    technical: "bg-cyan-100 text-cyan-700 hover:bg-cyan-100",
  };
  return colors[category?.toLowerCase()] || "bg-muted text-foreground";
};

const getFilteredDocuments = computed(() => {
  if (!documents.value) return [];

  return documents.value.filter((doc: any) => {
    const matchesSearch =
      doc.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory =
      selectedCategory.value === "all" ||
      doc.category?.toLowerCase() === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Documents</h1>
        <p class="text-muted-foreground mt-1">
          Centralized document repository
        </p>
      </div>

      <Dialog v-model:open="showUploadDialog">
        <DialogTrigger as-child>
          <Button>
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
              <Label for="file">Select File</Label>
              <div class="flex items-center gap-2">
                <Input id="file" type="file" @change="handleFileSelect" />
                <Button size="icon" variant="outline">
                  <Upload class="h-4 w-4" />
                </Button>
              </div>
              <p v-if="selectedFile" class="text-sm text-muted-foreground">
                Selected: {{ selectedFile.name }} ({{
                  (selectedFile.size / 1024 / 1024).toFixed(2)
                }}
                MB)
              </p>
            </div>

            <div class="space-y-2">
              <Label for="workspace">Workspace</Label>
              <Select v-model="uploadWorkspaceId">
                <SelectTrigger>
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="ws in workspaces"
                    :key="ws.id"
                    :value="ws.id"
                  >
                    {{ ws.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="project">Project (Optional)</Label>
              <Select v-model="uploadProjectId">
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="null">None</SelectItem>
                  <SelectItem
                    v-for="proj in projects"
                    :key="proj.id"
                    :value="proj.id"
                  >
                    {{ proj.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="category">Category</Label>
              <Select v-model="uploadCategory">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="visibility">Visibility</Label>
              <Select v-model="uploadVisibility">
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIVATE">Private - Only you</SelectItem>
                  <SelectItem value="WORKSPACE"
                    >Workspace - All members</SelectItem
                  >
                  <SelectItem value="PROJECT"
                    >Project - Project members</SelectItem
                  >
                  <SelectItem value="ORGANIZATION"
                    >Organization - All org members</SelectItem
                  >
                  <SelectItem value="PUBLIC"
                    >Public - Anyone with link</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label for="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                v-model="uploadTags"
                placeholder="e.g., important, urgent, q4-2024"
              />
            </div>

            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Textarea
                id="description"
                v-model="uploadDescription"
                placeholder="Document description..."
                rows="3"
              />
            </div>

            <div class="flex items-center space-x-2">
              <Checkbox id="pinned" v-model:checked="uploadIsPinned" />
              <Label for="pinned" class="cursor-pointer">Pin document</Label>
            </div>

            <div class="flex justify-end gap-2">
              <Button variant="outline" @click="showUploadDialog = false"
                >Cancel</Button
              >
              <Button
                @click="handleUpload"
                :disabled="!selectedFile || !uploadWorkspaceId"
              >
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <Card class="border-border">
      <CardContent class="p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search documents..."
              class="pl-10"
            />
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
              <SelectItem value="technical">Technical</SelectItem>
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

    <div
      v-if="viewMode === 'grid'"
      class="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <Card
        v-for="doc in getFilteredDocuments"
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
              <span class="font-medium text-foreground">{{
                (doc.fileSize / 1024 / 1024).toFixed(2) + " MB"
              }}</span>
            </div>
            <div class="flex justify-between">
              <span>Downloads</span>
              <span class="font-medium text-foreground">{{
                doc.downloadedBy?.length || 0
              }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" size="sm" @click="downloadDocument(doc)">
              <Download class="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              @click="navigateTo(`/${organizationId}/documents/${doc.id}`)"
            >
              <UserPlus class="h-4 w-4 mr-2" />
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

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
              v-for="doc in getFilteredDocuments"
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
              <td class="px-6 py-4 text-sm text-muted-foreground">
                {{ (doc.fileSize / 1024 / 1024).toFixed(2) + " MB" }}
              </td>
              <td class="px-6 py-4 text-sm text-muted-foreground">
                {{ doc.uploadedBy?.name || "Unknown" }}
              </td>
              <td class="px-6 py-4 text-sm text-muted-foreground">
                {{ new Date(doc.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="downloadDocument(doc)"
                >
                  <Download class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="navigateTo(`/${organizationId}/documents/${doc.id}`)"
                >
                  <Eye class="h-4 w-4" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>

    <div class="grid md:grid-cols-4 gap-6">
      <Card class="border-border">
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Total Documents</p>
          <p class="text-3xl font-bold text-foreground">
            {{ documents?.length || 0 }}
          </p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Storage Used</p>
          <p class="text-3xl font-bold text-blue-600">
            {{
              (
                (documents?.reduce(
                  (acc, doc) => acc + (doc.fileSize || 0),
                  0,
                ) || 0) /
                1024 /
                1024 /
                1024
              ).toFixed(2) + " GB"
            }}
          </p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Downloads</p>
          <p class="text-3xl font-bold text-emerald-600">
            {{
              documents?.reduce(
                (acc, doc) => acc + (doc.downloadedBy?.length || 0),
                0,
              ) || 0
            }}
          </p>
        </CardContent>
      </Card>

      <Card class="border-border">
        <CardContent class="p-6">
          <p class="text-sm text-muted-foreground mb-1">Staff Members</p>
          <p class="text-3xl font-bold text-purple-600">
            {{ staffMembers?.length || 0 }}
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
