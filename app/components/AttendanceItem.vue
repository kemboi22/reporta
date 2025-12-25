<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

defineProps<{
  attendance: {
    id: number
    name: string
    department: string
    time: string
    status: string
    photo: string
  }
}>()

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('')
}
</script>

<template>
  <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
    <Avatar class="h-10 w-10 ring-2 ring-white">
      <AvatarImage :src="attendance.photo" />
      <AvatarFallback class="bg-blue-100 text-blue-700">{{ getInitials(attendance.name) }}</AvatarFallback>
    </Avatar>
    
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-slate-900 truncate">{{ attendance.name }}</p>
      <p class="text-xs text-slate-500">{{ attendance.department }}</p>
    </div>
    
    <div class="flex items-center gap-2">
      <Badge 
        :class="attendance.status === 'in' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-100'" 
        class="text-xs"
      >
        {{ attendance.status === 'in' ? 'In' : 'Out' }}
      </Badge>
      <span class="text-xs text-slate-400 whitespace-nowrap">{{ attendance.time }}</span>
    </div>
  </div>
</template>
