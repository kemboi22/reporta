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
  <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
    <Avatar class="h-10 w-10 ring-2 ring-background">
      <AvatarImage :src="attendance.photo" />
      <AvatarFallback class="bg-primary/10 text-primary">{{ getInitials(attendance.name) }}</AvatarFallback>
    </Avatar>
    
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-foreground truncate">{{ attendance.name }}</p>
      <p class="text-xs text-muted-foreground">{{ attendance.department }}</p>
    </div>
    
    <div class="flex items-center gap-2">
      <Badge 
        :class="attendance.status === 'in' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100' : 'bg-muted text-muted-foreground hover:bg-muted'" 
        class="text-xs"
      >
        {{ attendance.status === 'in' ? 'In' : 'Out' }}
      </Badge>
      <span class="text-xs text-muted-foreground whitespace-nowrap">{{ attendance.time }}</span>
    </div>
  </div>
</template>
