<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "lucide-vue-next";
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();

const document = ref({
  id: route.params.id,
  name: "Technical Specification v2.0",
  description: "Complete technical specification document for the new feature",
  filePath: "/documents/tech-spec-v2.pdf",
  fileSize: 2458760,
  mimeType: "application/pdf",
  category: "Technical",
  tags: ["specification", "technical", "v2"],
  visibility: "WORKSPACE" as const,
  uploadedBy: "1",
  uploadedByName: "John Doe",
  uploadedByAvatar: "/placeholder-user.jpg",
  downloadedBy: ["2", "3"],
  isPinned: true,
  version: 2,
  createdAt: new Date("2024-02-15"),
  updatedAt: new Date("2024-02-20"),
});

const versions = ref([
  {
    id: "1",
    version: 2,
    uploadedBy: "John Doe",
    uploadedAt: new Date("2024-02-20"),
    fileSize: 2458760,
    note: "Updated API endpoints section",
  },
  {
    id: "2",
    version: 1,
    uploadedBy: "Jane Smith",
    uploadedAt: new Date("2024-02-15"),
    fileSize: 2345102,
    note: "Initial version",
  },
]);

const showShareDialog = ref(false);
const showVersionHistory = ref(false);

const shareSettings = ref({
  visibility: document.value.visibility,
  allowDownload: true,
  expiresIn: "",
});

const downloadDocument = () => {
  console.log("Downloading document:", document.value.filePath);
};

const shareDocument = () => {
  console.log("Sharing document with settings:", shareSettings.value);
  showShareDialog.value = false;
};

const togglePin = () => {
  document.value.isPinned = !document.value.isPinned;
  console.log("Toggling pin status");
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

const downloadCount = computed(() => document.value.downloadedBy.length);
</script>

<template>
  <div class="space-y-6">
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
              {{ document.name }}
            </h1>
            <Badge
              :class="[getVisibilityColor(document.visibility), 'text-white']"
            >
              <component
                :is="getVisibilityIcon(document.visibility)"
                class="h-3 w-3 mr-1"
              />
              {{ document.visibility }}
            </Badge>
            <Badge v-if="document.isPinned" variant="secondary">
              <Pin class="h-3 w-3 mr-1" />
              Pinned
            </Badge>
          </div>
          <p class="text-muted-foreground">{{ document.description }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Button variant="outline" @click="togglePin">
          <Pin :class="['h-4 w-4 mr-2', document.isPinned && 'fill-current']" />
          {{ document.isPinned ? "Unpin" : "Pin" }}
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
                    <SelectItem value="">Never</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button @click="shareDocument" class="w-full"
                >Share Document</Button
              >
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
            <div class="flex items-center justify-between">
              <CardTitle>Version History</CardTitle>
              <Dialog v-model:open="showVersionHistory">
                <DialogTrigger as-child>
                  <Button variant="outline" size="sm">
                    <History class="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Version History</DialogTitle>
                  </DialogHeader>
                  <div class="space-y-4 max-h-96 overflow-y-auto">
                    <div
                      v-for="version in versions"
                      :key="version.id"
                      class="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div>
                          <span class="font-semibold"
                            >v{{ version.version }}</span
                          >
                          <span class="text-sm text-muted-foreground ml-2">
                            by {{ version.uploadedBy }}
                          </span>
                        </div>
                        <span class="text-sm text-muted-foreground">
                          {{ version.uploadedAt.toLocaleDateString() }}
                        </span>
                      </div>
                      <p class="text-sm text-muted-foreground">
                        {{ version.note }}
                      </p>
                      <div
                        class="flex items-center gap-4 mt-2 text-sm text-muted-foreground"
                      >
                        <div class="flex items-center gap-1">
                          <HardDrive class="h-3 w-3" />
                          <span>{{ formatFileSize(version.fileSize) }}</span>
                        </div>
                      </div>
                      <div class="mt-3 pt-3 border-t border-border flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div
                v-for="version in versions.slice(0, 3)"
                :key="version.id"
                class="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <Badge
                      v-if="version.version === document.version"
                      variant="default"
                    >
                      Current
                    </Badge>
                    <div>
                      <span class="font-semibold">v{{ version.version }}</span>
                      <span class="text-sm text-muted-foreground ml-2">
                        by {{ version.uploadedBy }}
                      </span>
                    </div>
                  </div>
                  <span class="text-sm text-muted-foreground">
                    {{ version.uploadedAt.toLocaleDateString() }}
                  </span>
                </div>
                <p class="text-sm text-muted-foreground mt-2">
                  {{ version.note }}
                </p>
              </div>
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
              <p class="font-medium">{{ document.category }}</p>
            </div>
            <div>
              <Label>File Type</Label>
              <p class="font-medium">{{ document.mimeType }}</p>
            </div>
            <div>
              <Label>File Size</Label>
              <p class="font-medium">{{ formatFileSize(document.fileSize) }}</p>
            </div>
            <div>
              <Label>Version</Label>
              <p class="font-medium">v{{ document.version }}</p>
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
                    {{ document.createdAt.toLocaleDateString() }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-3">
                <Calendar class="h-4 w-4 text-muted-foreground" />
                <div class="text-sm">
                  <p class="text-muted-foreground">Last Modified</p>
                  <p class="font-medium">
                    {{ document.updatedAt.toLocaleDateString() }}
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
                <AvatarImage :src="document.uploadedByAvatar" />
                <AvatarFallback>{{
                  document.uploadedByName.charAt(0)
                }}</AvatarFallback>
              </Avatar>
              <div>
                <p class="font-medium">{{ document.uploadedByName }}</p>
                <p class="text-sm text-muted-foreground">Document Owner</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-border">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="tag in document.tags"
                :key="tag"
                variant="secondary"
              >
                {{ tag }}
              </Badge>
              <Button variant="ghost" size="sm" class="h-7 px-2">
                + Add
              </Button>
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
            <Button variant="destructive" class="w-full" size="sm">
              Delete Document
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
