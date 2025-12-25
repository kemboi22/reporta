<template>
  <div 
    :class="[
      'flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors border-b last:border-0',
      notification.unread && 'bg-blue-50/50'
    ]"
  >
    <div :class="[
      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
      getNotificationColor(notification.type)
    ]">
      <component :is="getNotificationIcon(notification.type)" class="h-4 w-4" />
    </div>
    
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-slate-900 mb-1">{{ notification.title }}</p>
      <p class="text-sm text-slate-600 mb-1">{{ notification.description }}</p>
      <p class="text-xs text-slate-400">{{ notification.time }}</p>
    </div>
    
    <div v-if="notification.unread" class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
  </div>
</template>

<script setup lang="ts">
import { CheckSquare, FileText, Calendar } from 'lucide-vue-next'

defineProps<{
  notification: {
    id: number
    type: string
    title: string
    description: string
    time: string
    unread: boolean
  }
}>()

const getNotificationIcon = (type: string) => {
  const icons: Record<string, any> = {
    task: CheckSquare,
    report: FileText,
    leave: Calendar
  }
  return icons[type] || FileText
}

const getNotificationColor = (type: string) => {
  const colors: Record<string, string> = {
    task: 'bg-blue-100 text-blue-600',
    report: 'bg-amber-100 text-amber-600',
    leave: 'bg-emerald-100 text-emerald-600'
  }
  return colors[type] || 'bg-slate-100 text-slate-600'
}
</script>
