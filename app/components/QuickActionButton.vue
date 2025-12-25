<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Clock, CheckSquare, FileText, Upload } from 'lucide-vue-next'

const props = defineProps<{
  label: string
  icon: string
  color: string
}>()

defineEmits(['click'])

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    Clock,
    CheckSquare,
    FileText,
    Upload
  }
  return icons[iconName]
}

const getColorClasses = (color: string) => {
  const colors: Record<string, { border: string; bg: string; text: string; hover: string }> = {
    blue: { 
      border: 'border-blue-200 hover:border-blue-400 dark:border-blue-800 dark:hover:border-blue-600', 
      bg: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20', 
      text: 'text-blue-600 dark:text-blue-400',
      hover: 'hover:shadow-blue-200/50 dark:hover:shadow-blue-400/20'
    },
    emerald: { 
      border: 'border-emerald-200 hover:border-emerald-400 dark:border-emerald-800 dark:hover:border-emerald-600', 
      bg: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20', 
      text: 'text-emerald-600 dark:text-emerald-400',
      hover: 'hover:shadow-emerald-200/50 dark:hover:shadow-emerald-400/20'
    },
    amber: { 
      border: 'border-amber-200 hover:border-amber-400 dark:border-amber-800 dark:hover:border-amber-600', 
      bg: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20', 
      text: 'text-amber-600 dark:text-amber-400',
      hover: 'hover:shadow-amber-200/50 dark:hover:shadow-amber-400/20'
    },
    purple: { 
      border: 'border-purple-200 hover:border-purple-400 dark:border-purple-800 dark:hover:border-purple-600', 
      bg: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20', 
      text: 'text-purple-600 dark:text-purple-400',
      hover: 'hover:shadow-purple-200/50 dark:hover:shadow-purple-400/20'
    }
  }
  return colors[color] || colors.blue
}
</script>

<template>
  <button
    @click="$emit('click')"
    :class="[
      'flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all duration-200',
      'hover:border-solid hover:shadow-md hover:-translate-y-1',
      getColorClasses(color).border,
      getColorClasses(color).hover
    ]"
  >
    <div :class="[
      'w-12 h-12 rounded-full flex items-center justify-center',
      getColorClasses(color).bg
    ]">
      <component :is="getIcon(icon)" :class="[getColorClasses(color).text, 'h-6 w-6']" />
    </div>
    <span :class="['text-sm font-medium', getColorClasses(color).text]">{{ label }}</span>
  </button>
</template>
