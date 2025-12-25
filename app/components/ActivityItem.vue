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
    task: 'bg-blue-100 text-blue-600',
    report: 'bg-amber-100 text-amber-600',
    leave: 'bg-emerald-100 text-emerald-600',
    document: 'bg-purple-100 text-purple-600'
  }
  return colors[type] || 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
    <div :class="[
      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
      getActivityColor(activity.type)
    ]">
      <component :is="getActivityIcon(activity.type)" class="h-4 w-4" />
    </div>
    
    <div class="flex-1 min-w-0">
      <p class="text-sm text-slate-900">
        <span class="font-medium">{{ activity.user }}</span>
        <span class="text-slate-600"> {{ activity.action }} </span>
        <span class="font-medium">{{ activity.target }}</span>
      </p>
      <p class="text-xs text-slate-400 mt-1">{{ activity.time }}</p>
    </div>
  </div>
</template>
