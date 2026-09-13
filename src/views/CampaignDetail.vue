<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import CodeBlock from "../components/CodeBlock.vue";
import {
  getCampaign,
  downloadFilterUrl,
  downloadBundleUrl,
  type Campaign,
} from "../api/campaigns";
import { useToast } from "../composables/useToast";

const props = defineProps<{ id: string }>();

const campaign = ref<Campaign | null>(null);
const loading = ref(true);
const showSecret = ref(false);
const { success } = useToast();

onMounted(async () => {
  try {
    campaign.value = await getCampaign(props.id);
  } catch (e) {
    console.error("Failed to load campaign", e);
  } finally {
    loading.value = false;
  }
});

function downloadFilter() {
  if (campaign.value) {
    window.location.href = downloadFilterUrl(campaign.value.id);
    success(`Downloading filter file: ${campaign.value.filter_filename}`);
  }
}

async function copySecret() {
  if (campaign.value?.api_secret) {
    await navigator.clipboard.writeText(campaign.value.api_secret);
    success("Copied API Secret to clipboard");
  }
}
</script>

<template>
  <div v-if="loading" class="space-y-6">
    <div class="h-10 w-64 bg-white/5 rounded-xl animate-pulse"></div>
    <div class="h-48 glass-card rounded-2xl animate-pulse"></div>
  </div>

  <div v-else-if="campaign" class="space-y-8 animate-fade-in pb-16">
    <!-- Hero Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
      <div class="space-y-2">
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            {{ campaign.name }}
          </h1>

          <span class="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-lg border border-white/10">
            ID #{{ campaign.id }}
          </span>

          <span
            :class="[
              'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border',
              campaign.active
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30 shadow-glow-emerald'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            ]"
          >
            <span class="relative flex h-2 w-2">
              <span v-if="campaign.active" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2" :class="campaign.active ? 'bg-emerald-500' : 'bg-slate-500'"></span>
            </span>
            {{ campaign.active ? "Active Cloaking Router" : "Inactive" }}
          </span>
        </div>

        <p class="text-sm text-slate-400 flex items-center gap-2">
          <span>Safe Destination:</span>
          <a
            :href="campaign.safe_page_url"
            target="_blank"
            rel="noopener"
            class="text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1"
          >
            <span>{{ campaign.safe_page_url }}</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
            </svg>
          </a>
        </p>
      </div>

      <!-- Action Toolbar -->
      <div class="flex flex-wrap items-center gap-3">
        <RouterLink
          :to="`/campaign/${campaign.id}/analytics`"
          class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-semibold border border-white/10 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          <span>Traffic Analytics</span>
        </RouterLink>

        <RouterLink
          :to="`/campaign/${campaign.id}/setup`"
          class="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-sm font-semibold border border-indigo-500/30 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <span>Deployment Guide</span>
        </RouterLink>

        <a
          :href="downloadBundleUrl(campaign.id)"
          class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Download Bundle (ZIP)</span>
        </a>
      </div>
    </div>

    <!-- Visual Cloaking Flow Diagram -->
    <div class="glass-panel rounded-2xl p-6 shadow-xl border border-white/10 space-y-4">
      <div class="flex items-center justify-between border-b border-white/5 pb-3">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <svg class="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 20V10"/>
            <path d="M12 20V4"/>
            <path d="M6 20v-6"/>
          </svg>
          <span>Cloaking Routing Architecture</span>
        </h2>
        <span class="text-xs text-slate-500 font-mono">Live Rule Pipeline</span>
      </div>

      <!-- Diagram Flow Blocks -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center items-stretch pt-2">
        <!-- Step 1: Inbound Visitor -->
        <div class="bg-slate-900/70 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <span class="text-xs font-bold text-white uppercase tracking-wider">1. Inbound Request</span>
            <p class="text-[11px] text-slate-400 mt-1">
              IP, Geo, Device UA, and Client Headers enter safe page <code class="text-slate-300 font-mono">index.php</code>
            </p>
          </div>
        </div>

        <!-- Step 2: Cloak Engine -->
        <div class="bg-slate-900/70 border border-indigo-500/40 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 shadow-glow">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
            </svg>
          </div>
          <div>
            <span class="text-xs font-bold text-white uppercase tracking-wider">2. {{ campaign.filter_filename }}</span>
            <p class="text-[11px] text-slate-400 mt-1">
              Checks <code class="text-indigo-300 font-mono">{{ campaign.cookie_days }}d</code> cookie, verifies platform in 
              <span class="text-slate-200 font-mono uppercase">{{ campaign.platform.join(", ") }}</span>, calls classifier API.
            </p>
          </div>
        </div>

        <!-- Step 3: Divergence Outcome -->
        <div class="grid grid-rows-2 gap-2">
          <!-- Human Branch -->
          <div class="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2.5 flex items-center gap-3 text-left">
            <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              ✓
            </div>
            <div>
              <span class="text-xs font-bold text-emerald-300">Human Traffic</span>
              <p class="text-[10px] text-slate-400">Renders device money page seamlessly.</p>
            </div>
          </div>

          <!-- Bot / Blocked Branch -->
          <div class="bg-rose-950/40 border border-rose-500/30 rounded-lg p-2.5 flex items-center gap-3 text-left">
            <div class="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              ✕
            </div>
            <div>
              <span class="text-xs font-bold text-rose-300">Bot / Crawler / Other</span>
              <p class="text-[10px] text-slate-400">Continues down safe <code class="text-slate-300">index.php</code>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Integration Snippet Card -->
    <div class="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-white">Safe Page Require Snippet</h2>
          <p class="text-xs text-slate-400 mt-0.5">
            Add this line as the <strong>very first line</strong> of your safe page <code class="text-indigo-400">index.php</code>
          </p>
        </div>
        <button
          @click="downloadFilter"
          class="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Download {{ campaign.filter_filename }}</span>
        </button>
      </div>

      <CodeBlock
        :code="`<?php require __DIR__ . '/${campaign.filter_filename}'; ?>`"
        language="php"
        label="Inject at index.php Line 1"
      />
    </div>

    <!-- 2-Column Detail Matrix -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left: Targeting & Engine Settings -->
      <div class="glass-panel rounded-2xl p-6 shadow-xl space-y-6">
        <h2 class="text-base font-bold text-white border-b border-white/5 pb-3">
          Routing & Targeting Specifications
        </h2>

        <div class="space-y-4 text-xs">
          <!-- Target Platforms -->
          <div class="flex justify-between items-center py-2 border-b border-white/5">
            <span class="text-slate-400 uppercase font-semibold">Target Platforms</span>
            <div class="flex items-center gap-1.5">
              <span
                v-for="p in campaign.platform"
                :key="p"
                class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-bold uppercase text-slate-200"
              >
                {{ p }}
              </span>
            </div>
          </div>

          <!-- Allowed Regions -->
          <div class="flex justify-between items-start py-2 border-b border-white/5">
            <span class="text-slate-400 uppercase font-semibold">Allowed Regions</span>
            <div class="flex flex-wrap gap-1 justify-end max-w-xs">
              <template v-if="campaign.allowed_regions && campaign.allowed_regions.length > 0">
                <span
                  v-for="r in campaign.allowed_regions"
                  :key="r"
                  class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono font-bold"
                >
                  {{ r }}
                </span>
              </template>
              <span v-else class="text-slate-400 italic">
                All Regions Allowed
              </span>
            </div>
          </div>

          <!-- Cookie TTL -->
          <div class="flex justify-between items-center py-2 border-b border-white/5">
            <span class="text-slate-400 uppercase font-semibold">Cookie Lifetime</span>
            <span class="font-mono text-slate-200 font-bold">
              {{ campaign.cookie_days }} days
            </span>
          </div>

          <!-- Fail Mode -->
          <div class="flex justify-between items-center py-2 border-b border-white/5">
            <span class="text-slate-400 uppercase font-semibold">Fail Mode</span>
            <span
              :class="[
                'px-2.5 py-0.5 rounded-full font-bold uppercase text-[11px] border',
                campaign.fail_mode === 'safe'
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
              ]"
            >
              {{ campaign.fail_mode }}
            </span>
          </div>

          <!-- Filter Filename -->
          <div class="flex justify-between items-center py-2">
            <span class="text-slate-400 uppercase font-semibold">Generated Filter Engine</span>
            <span class="font-mono text-indigo-300 font-bold">
              {{ campaign.filter_filename }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right: Security & Credentials -->
      <div class="glass-panel rounded-2xl p-6 shadow-xl space-y-6">
        <h2 class="text-base font-bold text-white border-b border-white/5 pb-3">
          Security & Classifier Credentials
        </h2>

        <!-- API Secret -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            API Secret Token
          </label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <input
                :type="showSecret ? 'text' : 'password'"
                :value="campaign.api_secret"
                readonly
                class="w-full px-4 py-2.5 rounded-xl bg-[#060912] border border-white/10 font-mono text-xs text-slate-200 select-all"
              />
            </div>
            <button
              @click="showSecret = !showSecret"
              class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-medium transition-colors"
            >
              {{ showSecret ? "Hide" : "Show" }}
            </button>
            <button
              @click="copySecret"
              class="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <!-- API Endpoint -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            API Verification Endpoint
          </label>
          <input
            :value="campaign.api_endpoint"
            readonly
            class="w-full px-4 py-2.5 rounded-xl bg-[#060912] border border-white/10 font-mono text-xs text-slate-300 select-all"
          />
        </div>

        <!-- Quick Curl Check Command -->
        <div class="pt-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Quick Terminal Test
          </label>
          <CodeBlock
            :code="`curl -i -A 'Googlebot/2.1' '${campaign.safe_page_url}'`"
            language="bash"
            label="Verify Bot Interception"
          />
        </div>
      </div>
    </div>
  </div>
</template>
