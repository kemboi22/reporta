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
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' }
  }
  return colors[color] || colors.blue
}
</script>

<template>
  <Card class="border-slate-200 hover:shadow-lg transition-all">
    <CardContent class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-slate-600 mb-1">{{ title }}</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-bold text-slate-900">{{ value }}</h3>
            <span v-if="total" class="text-lg text-slate-400">/ {{ total }}</span>
          </div>
          <p :class="[
            'text-sm mt-2 flex items-center gap-1',
            alert ? 'text-red-600' : 'text-slate-600'
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
