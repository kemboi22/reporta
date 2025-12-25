<template>
  <div class="group relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
    <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300" :class="color"></div>
    
    <div class="relative">
      <div class="text-4xl mb-4">{{ icon }}</div>
      <h3 class="text-xl font-semibold text-slate-900 mb-2">{{ title }}</h3>
      <p class="text-slate-600 leading-relaxed">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
  color: string
}>()
</script>
