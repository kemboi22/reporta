<script setup lang="ts">
import { ref } from "vue";
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  UserCheck,
  FileText,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

const open = ref(false);

const pendingItems = ref([
  {
    id: 1,
    type: "task",
    title: "Complete medication inventory",
    description: "Due today",
    urgency: "urgent",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "approval",
    title: "Leave request from Mike",
    description: "3 days from Dec 28-30",
    urgency: "high",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "review",
    title: "Safety protocol update",
    description: "Waiting for your approval",
    urgency: "medium",
    time: "3 hours ago",
  },
  {
    id: 4,
    type: "document",
    title: "Monthly report signature",
    description: "Requires your signature",
    urgency: "low",
    time: "5 hours ago",
  },
  {
    id: 5,
    type: "meeting",
    title: "Team standup in 30 min",
    description: "Daily sync meeting",
    urgency: "medium",
    time: "Just now",
  },
]);

const urgentCount = computed(() => pendingItems.value.filter(i => i.urgency === 'urgent').length);
const totalCount = computed(() => pendingItems.value.length);

const getUrgencyColor = (urgency: string) => {
  const colors: Record<string, string> = {
    urgent: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-blue-100 text-blue-700",
    low: "bg-slate-100 text-slate-700",
  };
  return colors[urgency] || colors.medium;
};

const getIcon = (type: string) => {
  const icons: Record<string, any> = {
    task: CheckCircle2,
    approval: UserCheck,
    review: FileText,
    document: FileText,
    meeting: Calendar,
  };
  return icons[type] || Bell;
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    task: "Task",
    approval: "Approval",
    review: "Review",
    document: "Document",
    meeting: "Meeting",
  };
  return labels[type] || "Notification";
};

const markAsDone = (id: number) => {
  const index = pendingItems.value.findIndex(i => i.id === id);
  if (index > -1) {
    pendingItems.value.splice(index, 1);
  }
};

const dismissAll = () => {
  pendingItems.value = [];
  open.value = false;
};
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          size="lg"
          class="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all relative"
          :class="urgentCount > 0 && 'animate-bounce'"
        >
          <Bell class="h-6 w-6" />
          <Badge
            v-if="urgentCount > 0"
            variant="destructive"
            class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold"
          >
            {{ urgentCount }}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-[400px] p-0" align="end">
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-semibold text-foreground">Pending Items</h3>
              <p class="text-sm text-muted-foreground">{{ totalCount }} items require attention</p>
            </div>
            <Button variant="ghost" size="icon" class="h-8 w-8" @click="dismissAll">
              <X class="h-4 w-4" />
            </Button>
          </div>
          
          <Separator class="mb-4" />

          <div class="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            <div
              v-for="item in pendingItems"
              :key="item.id"
              class="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group relative"
            >
              <div :class="['h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0', getUrgencyColor(item.urgency)]">
                <component :is="getIcon(item.type)" class="h-5 w-5" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-1">
                  <h4 class="font-medium text-foreground text-sm line-clamp-1">{{ item.title }}</h4>
                  <Badge :class="getUrgencyColor(item.urgency)" class="text-[10px] font-normal">
                    {{ item.urgency }}
                  </Badge>
                </div>
                <p class="text-sm text-muted-foreground line-clamp-1">{{ item.description }}</p>
                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Badge variant="secondary" class="text-[10px]">
                      {{ getTypeLabel(item.type) }}
                    </Badge>
                    <Clock class="h-3 w-3" />
                    <span>{{ item.time }}</span>
                  </div>
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-6 w-6"
                      @click="markAsDone(item.id)"
                    >
                      <CheckCircle2 class="h-3.5 w-3.5 text-emerald-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t">
            <Button variant="outline" class="w-full justify-start gap-2" size="sm">
              <X class="h-4 w-4" />
              Dismiss All Notifications
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}
</style>
