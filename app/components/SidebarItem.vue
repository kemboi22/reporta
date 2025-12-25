<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CheckSquare, 
  FileText, 
  FolderOpen, 
  Bell, 
  Settings,
  ChevronDown 
} from 'lucide-vue-next'

const props = defineProps<{
  item: any
  collapsed: boolean
}>()

const expanded = ref(false)

const toggleExpanded = () => {
  expanded.value = !expanded.value
}

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    LayoutDashboard,
    Users,
    Clock,
    CheckSquare,
    FileText,
    FolderOpen,
    Bell,
    Settings
  }
  return icons[iconName]
}
</script>

<template>
  <div>
    <!-- Main Item -->
    <component
      :is="item.children ? 'button' : 'NuxtLink'"
      :to="item.href"
      @click="item.children && toggleExpanded()"
      class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      :class="collapsed && 'justify-center'"
    >
      <component :is="getIcon(item.icon)" class="h-5 w-5 flex-shrink-0" />
      
      <span v-if="!collapsed" class="flex-1 text-left">{{ item.name }}</span>
      
      <Badge v-if="!collapsed && item.badge" variant="secondary" class="ml-auto">
        {{ item.badge }}
      </Badge>
      
      <ChevronDown 
        v-if="!collapsed && item.children" 
        :class="['h-4 w-4 transition-transform', expanded && 'rotate-180']" 
      />
    </component>
    
    <!-- Children -->
    <div 
      v-if="item.children && expanded && !collapsed" 
      class="ml-8 mt-1 space-y-1"
    >
      <NuxtLink
        v-for="child in item.children"
        :key="child.name"
        :to="child.href"
        class="block px-3 py-2 rounded-lg text-sm transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      >
        {{ child.name }}
      </NuxtLink>
    </div>
  </div>
</template>
