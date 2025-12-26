<template>
  <div class="min-h-screen bg-background">
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <Sidebar
        :collapsed="sidebarCollapsed"
        @toggle="sidebarCollapsed = !sidebarCollapsed"
      />
 
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Navigation -->
        <TopNav @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
 
        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-6">
          <slot />
        </main>
      </div>
    </div>

    <!-- Floating Pending Items -->
    <PendingItems />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "~/components/Sidebar.vue";
import PendingItems from "~/components/PendingItems.vue";

const sidebarCollapsed = ref(false);
</script>
