<script setup lang="ts">
import {
  FileText,
  Download,
  Share2,
  Eye,
  Lock,
  Globe,
  MoreVertical,
  Pin,
  History,
  Calendar,
  HardDrive,
  Trash2,
  Link as LinkIcon,
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const organizationId = route.params.organizationId as string;
const documentId = route.params.id as string;

const {
  data: doc,
  pending,
  refresh: refreshDocument,
} = await useLazyFetch(`/api/${organizationId}/documents/${documentId}`, {
  key: `document-${documentId}`,
});

const showShareDialog = ref(false);
const showVersionHistory = ref(false);
const showTaskLinkDialog = ref(false);
const shareLink = ref("");
const shareSettings = ref({
  visibility: doc.value?.visibility || "PRIVATE",
  allowDownload: true,
  expiresIn: "",
});

const selectedTasks = ref<string[]>([]);
const { data: tasks } = await useLazyFetch(`/api/${organizationId}/tasks`, {
  key: `tasks-${organizationId}`,
  transform: (data) => data || [],
});

const downloadDocument = async () => {
  try {
    const response = await $fetch(
      `/api/${organizationId}/documents/${documentId}/download`,
      {
        responseType: "blob",
      },
    );
    const blob = new Blob([response], { type: doc.value?.mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.value?.name;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download document:", error);
  }
};

const generateShareLink = async () => {
  try {
    const response = await $fetch(
      `/api/${organizationId}/documents/${documentId}/share`,
      {
        method: "POST",
        body: {
          visibility: shareSettings.value.visibility,
        },
      },
    );
    shareLink.value = response.shareLink;
  } catch (error) {
    console.error("Failed to generate share link:", error);
  }
};

const copyShareLink = () => {
  if (shareLink.value) {
    const baseUrl = window.location.origin;
    const fullLink = `${baseUrl}${shareLink.value}`;
    navigator.clipboard.writeText(fullLink);
  }
};

const shareDocument = async () => {
  try {
    await $fetch(`/api/${organizationId}/documents/${documentId}`, {
      method: "PUT",
      body: {
        visibility: shareSettings.value.visibility,
        allowDownload: shareSettings.value.allowDownload,
      },
    });
    showShareDialog.value = false;
    await refreshDocument();
  } catch (error) {
    console.error("Failed to share document:", error);
  }
};

const linkToTasks = async () => {
  try {
    await Promise.all(
      selectedTasks.value.map((taskId) =>
        $fetch(`/api/${organizationId}/documents/${documentId}/link-task`, {
          method: "POST",
          body: {
            documentId,
            taskId,
            action: "link",
          },
        }),
      ),
    );
    showTaskLinkDialog.value = false;
    selectedTasks.value = [];
  } catch (error) {
    console.error("Failed to link document to tasks:", error);
  }
};

const handleTaskSelection = (taskId: string, checked: boolean) => {
  if (checked) {
    selectedTasks.value.push(taskId);
  } else {
    selectedTasks.value = selectedTasks.value.filter((id) => id !== taskId);
  }
};

const togglePin = async () => {
  try {
    await $fetch(`/api/${organizationId}/documents/${documentId}`, {
      method: "PUT",
      body: {
        isPinned: !doc.value?.isPinned,
      },
    });
    await refreshDocument();
  } catch (error) {
    console.error("Failed to toggle pin:", error);
  }
};

const deleteDocument = async () => {
  if (!confirm("Are you sure you want to delete this document?")) return;

  try {
    await $fetch(`/api/${organizationId}/documents/${documentId}`, {
      method: "DELETE",
    });
    navigateTo(`/${organizationId}/documents`);
  } catch (error) {
    console.error("Failed to delete document:", error);
  }
};

const getVisibilityIcon = (visibility: string) => {
  const icons: Record<string, any> = {
    PRIVATE: Lock,
    WORKSPACE: Globe,
    PROJECT: Globe,
    ORGANIZATION: Globe,
    PUBLIC: Globe,
  };
  return icons[visibility] || Globe;
};

const getVisibilityColor = (visibility: string) => {
  const colors: Record<string, string> = {
    PRIVATE: "bg-red-500",
    WORKSPACE: "bg-blue-500",
    PROJECT: "bg-purple-500",
    ORGANIZATION: "bg-emerald-500",
    PUBLIC: "bg-amber-500",
  };
  return colors[visibility] || "bg-gray-500";
};

const formatFileSize = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const downloadCount = computed(() => doc.value?.downloadedBy?.length || 0);
</script>

<template>
  <div class="space-y-6">
    <div v-if="pending" class="animate-pulse space-y-4">
      <div class="h-20 bg-muted rounded-lg" />
      <div class="grid md:grid-cols-3 gap-6">
        <div class="h-96 bg-muted rounded-lg" />
        <div class="space-y-4">
          <div class="h-48 bg-muted rounded-lg" />
          <div class="h-32 bg-muted rounded-lg" />
        </div>
      </div>
    </div>

    <div v-else-if="doc" class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
          >
            <FileText class="h-6 w-6 text-primary" />
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h1 class="text-2xl font-bold text-foreground">
                {{ doc.name }}
              </h1>
              <Badge
                :class="[getVisibilityColor(doc.visibility), 'text-white']"
              >
                <component
                  :is="getVisibilityIcon(doc.visibility)"
                  class="h-3 w-3 mr-1"
                />
                {{ doc.visibility }}
              </Badge>
              <Badge v-if="doc.isPinned" variant="secondary">
                <Pin class="h-3 w-3 mr-1" />
                Pinned
              </Badge>
            </div>
            <p class="text-muted-foreground">{{ doc.description }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Button variant="outline" @click="togglePin">
            <Pin :class="['h-4 w-4 mr-2', doc.isPinned && 'fill-current']" />
            {{ doc.isPinned ? "Unpin" : "Pin" }}
          </Button>
          <Dialog v-model:open="showShareDialog">
            <DialogTrigger as-child>
              <Button variant="outline">
                <Share2 class="h-4 w-4 mr-2" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Document</DialogTitle>
              </DialogHeader>
              <div class="space-y-4">
                <div>
                  <Label>Visibility</Label>
                  <Select v-model="shareSettings.visibility">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIVATE">
                        <Lock class="h-4 w-4 mr-2" />
                        Private - Only you
                      </SelectItem>
                      <SelectItem value="WORKSPACE">
                        <Globe class="h-4 w-4 mr-2" />
                        Workspace - All members
                      </SelectItem>
                      <SelectItem value="PROJECT">
                        <Globe class="h-4 w-4 mr-2" />
                        Project - Project members
                      </SelectItem>
                      <SelectItem value="ORGANIZATION">
                        <Globe class="h-4 w-4 mr-2" />
                        Organization - All org members
                      </SelectItem>
                      <SelectItem value="PUBLIC">
                        <Globe class="h-4 w-4 mr-2" />
                        Public - Anyone with link
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div v-if="shareSettings.visibility === 'PUBLIC'">
                  <Button
                    @click="generateShareLink"
                    variant="outline"
                    class="w-full"
                  >
                    Generate Share Link
                  </Button>
                  <div v-if="shareLink" class="mt-2">
                    <div class="flex gap-2">
                      <Input :value="shareLink" readonly />
                      <Button @click="copyShareLink" size="icon">
                        <Share2 class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <Checkbox
                    id="download"
                    v-model:checked="shareSettings.allowDownload"
                  />
                  <Label for="download" class="cursor-pointer"
                    >Allow download</Label
                  >
                </div>
                <div>
                  <Label>Link expires in</Label>
                  <Select v-model="shareSettings.expiresIn">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="null">Never</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                      <SelectItem value="30d">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button @click="shareDocument" class="w-full"
                  >Save Settings</Button
                >
              </div>
            </DialogContent>
          </Dialog>

          <Dialog v-model:open="showTaskLinkDialog">
            <DialogTrigger as-child>
              <Button variant="outline">
                <LinkIcon class="h-4 w-4 mr-2" />
                Link to Tasks
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link Document to Tasks</DialogTitle>
              </DialogHeader>
              <div class="space-y-4">
                <div class="space-y-2 max-h-60 overflow-y-auto">
                  <Label>Select Tasks</Label>
                  <div
                    v-for="task in tasks"
                    :key="task.id"
                    class="flex items-center space-x-2"
                  >
                    <Checkbox
                      :id="`task-${task.id}`"
                      :checked="selectedTasks.includes(task.id)"
                      @update:checked="handleTaskSelection(task.id, $event)"
                    />
                    <Label
                      :for="`task-${task.id}`"
                      class="cursor-pointer flex-1"
                    >
                      {{ task.title }}
                    </Label>
                  </div>
                </div>
                <Button
                  @click="linkToTasks"
                  class="w-full"
                  :disabled="selectedTasks.length === 0"
                >
                  Link to Selected Tasks
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button @click="downloadDocument">
            <Download class="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <Card class="border-border">
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                class="h-96 bg-muted rounded-lg flex items-center justify-center"
              >
                <div class="text-center">
                  <FileText
                    class="h-16 w-16 mx-auto text-muted-foreground mb-4"
                  />
                  <p class="text-muted-foreground">
                    Document preview would appear here
                  </p>
                  <Button
                    variant="outline"
                    class="mt-4"
                    @click="downloadDocument"
                  >
                    <Download class="h-4 w-4 mr-2" />
                    Download to view
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="border-border">
            <CardHeader>
              <CardTitle>Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-center py-8 text-muted-foreground">
                Version history coming soon
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="space-y-6">
          <Card class="border-border">
            <CardHeader>
              <CardTitle>Document Info</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <Label>Category</Label>
                <p class="font-medium">{{ doc.category }}</p>
              </div>
              <div>
                <Label>File Type</Label>
                <p class="font-medium">{{ doc.mimeType }}</p>
              </div>
              <div>
                <Label>File Size</Label>
                <p class="font-medium">
                  {{ formatFileSize(doc.fileSize) }}
                </p>
              </div>
              <div>
                <Label>Downloads</Label>
                <div class="flex items-center gap-2">
                  <Download class="h-4 w-4 text-muted-foreground" />
                  <p class="font-medium">{{ downloadCount }} times</p>
                </div>
              </div>
              <div class="pt-4 border-t border-border">
                <div class="flex items-center gap-2">
                  <Calendar class="h-4 w-4 text-muted-foreground" />
                  <div class="text-sm">
                    <p class="text-muted-foreground">Created</p>
                    <p class="font-medium">
                      {{ new Date(doc.createdAt).toLocaleDateString() }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 mt-3">
                  <Calendar class="h-4 w-4 text-muted-foreground" />
                  <div class="text-sm">
                    <p class="text-muted-foreground">Last Modified</p>
                    <p class="font-medium">
                      {{ new Date(doc.updatedAt).toLocaleDateString() }}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="border-border">
            <CardHeader>
              <CardTitle>Uploaded By</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center gap-3">
                <Avatar class="h-12 w-12">
                  <AvatarImage :src="doc.uploadedBy?.avatar" />
                  <AvatarFallback>{{
                    doc.uploadedBy?.name?.charAt(0) || "?"
                  }}</AvatarFallback>
                </Avatar>
                <div>
                  <p class="font-medium">{{ doc.uploadedBy?.name }}</p>
                  <p class="text-sm text-muted-foreground">Document Owner</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="border-border">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <Button variant="outline" class="w-full" size="sm">
                <Eye class="h-4 w-4 mr-2" />
                View File
              </Button>
              <Button variant="outline" class="w-full" size="sm">
                <History class="h-4 w-4 mr-2" />
                Restore Version
              </Button>
              <Button variant="outline" class="w-full" size="sm">
                <Share2 class="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button
                variant="destructive"
                class="w-full"
                size="sm"
                @click="deleteDocument"
              >
                <Trash2 class="h-4 w-4 mr-2" />
                Delete Document
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
