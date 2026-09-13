<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{ id: string }>();
</script>

<template>
  <div class="max-w-md mx-auto py-20 text-center space-y-5 animate-fade-in">
    <div class="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
      <svg class="w-5 h-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    </div>

    <div class="space-y-1.5">
      <h1 class="text-xl font-bold text-white">Traffic Analytics Disabled</h1>
      <p class="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
        Visitor telemetry tracking and database logging are currently turned off. All cloaking routing rules and device filtering continue running normally.
      </p>
    </div>

    <div class="pt-3">
      <RouterLink
        :to="`/campaign/${id}`"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-colors shadow-sm"
      >
        &larr; Return to Campaign Details
      </RouterLink>
    </div>
  </div>
</template>
