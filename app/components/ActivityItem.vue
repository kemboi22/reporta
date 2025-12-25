<script setup lang="ts">
import { CheckSquare, FileText, Calendar, Upload } from 'lucide-vue-next'

defineProps<{
  activity: {
    id: number
    type: string
    user: string
    action: string
    target: string
    time: string
  }
}>()

const getActivityIcon = (type: string) => {
  const icons: Record<string, any> = {
    task: CheckSquare,
    report: FileText,
    leave: Calendar,
    document: Upload
  }
  return icons[type] || FileText
}

const getActivityColor = (type: string) => {
  const colors: Record<string, string> = {
    task: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    report: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    leave: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    document: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
  }
  return colors[type] || 'bg-muted text-muted-foreground'
}
</script>

<template>
  <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
    <div :class="[
      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
      getActivityColor(activity.type)
    ]">
      <component :is="getActivityIcon(activity.type)" class="h-4 w-4" />
    </div>
    
    <div class="flex-1 min-w-0">
      <p class="text-sm text-foreground">
        <span class="font-medium">{{ activity.user }}</span>
        <span class="text-muted-foreground"> {{ activity.action }} </span>
        <span class="font-medium">{{ activity.target }}</span>
      </p>
      <p class="text-xs text-muted-foreground mt-1">{{ activity.time }}</p>
    </div>
  </div>
</template>
