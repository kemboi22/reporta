<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Users, CheckSquare, FileText, Shield, TrendingUp, AlertCircle } from 'lucide-vue-next'

defineProps<{
  title: string
  value: string | number
  total?: number
  icon: string
  color: string
  trend?: string
  alert?: boolean
}>()

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    Users,
    CheckSquare,
    FileText,
    Shield
  }
  return icons[iconName]
}

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-500/10 dark:bg-emerald-400/10', text: 'text-emerald-600 dark:text-emerald-400' },
    blue: { bg: 'bg-blue-500/10 dark:bg-blue-400/10', text: 'text-blue-600 dark:text-blue-400' },
    amber: { bg: 'bg-amber-500/10 dark:bg-amber-400/10', text: 'text-amber-600 dark:text-amber-400' },
    purple: { bg: 'bg-purple-500/10 dark:bg-purple-400/10', text: 'text-purple-600 dark:text-purple-400' }
  }
  return colors[color] || colors.blue
}
</script>

<template>
  <Card class="border-border hover:shadow-lg transition-all">
    <CardContent class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-muted-foreground mb-1">{{ title }}</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-bold text-foreground">{{ value }}</h3>
            <span v-if="total" class="text-lg text-muted-foreground">/ {{ total }}</span>
          </div>
          <p :class="[
            'text-sm mt-2 flex items-center gap-1',
            alert ? 'text-destructive' : 'text-muted-foreground'
          ]">
            <TrendingUp v-if="!alert" class="h-3 w-3" />
            <AlertCircle v-else class="h-3 w-3" />
            {{ trend }}
          </p>
        </div>
        
        <!-- Using computed color classes instead of dynamic class strings -->
        <div :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center',
          getColorClasses(color).bg
        ]">
          <component :is="getIcon(icon)" :class="[getColorClasses(color).text, 'h-6 w-6']" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
