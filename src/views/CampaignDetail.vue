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
    <div class="h-8 w-64 bg-zinc-900 rounded-md animate-pulse"></div>
    <div class="h-40 bg-zinc-950 border border-zinc-800 rounded-lg animate-pulse"></div>
  </div>

  <div v-else-if="campaign" class="space-y-6 animate-fade-in pb-16">
    <!-- Hero Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
      <div class="space-y-1.5">
        <div class="flex items-center gap-2.5 flex-wrap">
          <h1 class="text-2xl font-bold text-white tracking-tight">
            {{ campaign.name }}
          </h1>

          <span class="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            ID #{{ campaign.id }}
          </span>

          <span
            :class="[
              'inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded border',
              campaign.active
                ? 'bg-zinc-900 text-zinc-200 border-zinc-700'
                : 'bg-zinc-950 text-zinc-500 border-zinc-800'
            ]"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="campaign.active ? 'bg-emerald-400' : 'bg-zinc-600'"
            ></span>
            {{ campaign.active ? "Active" : "Inactive" }}
          </span>
        </div>

        <p class="text-xs text-zinc-400 flex items-center gap-1.5">
          <span class="text-zinc-500">Safe Target:</span>
          <a
            :href="campaign.safe_page_url"
            target="_blank"
            rel="noopener"
            class="text-zinc-300 hover:text-white underline underline-offset-2 inline-flex items-center gap-1 font-mono"
          >
            <span>{{ campaign.safe_page_url }}</span>
            <svg class="w-3 h-3 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
            </svg>
          </a>
        </p>
      </div>

      <!-- Action Toolbar -->
      <div class="flex flex-wrap items-center gap-2">
        <RouterLink
          :to="`/campaign/${campaign.id}/analytics`"
          class="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition-colors flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          <span>Traffic Analytics</span>
        </RouterLink>

        <RouterLink
          :to="`/campaign/${campaign.id}/setup`"
          class="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 transition-colors flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <span>Deployment Guide</span>
        </RouterLink>

        <a
          :href="downloadBundleUrl(campaign.id)"
          class="px-3 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Download Bundle (ZIP)</span>
        </a>
      </div>
    </div>

    <!-- Visual Architecture Flow Diagram -->
    <div class="bg-zinc-950 rounded-lg p-5 border border-zinc-800 space-y-4">
      <div class="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 20V10"/>
            <path d="M12 20V4"/>
            <path d="M6 20v-6"/>
          </svg>
          <span>Cloaking Routing Architecture</span>
        </h2>
        <span class="text-[11px] text-zinc-500 font-mono">Live Rule Pipeline</span>
      </div>

      <!-- Flow Blocks -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-left pt-1">
        <!-- Step 1: Inbound Visitor -->
        <div class="bg-zinc-900/60 border border-zinc-800/80 rounded-md p-3.5 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono text-zinc-500 uppercase">Step 01</span>
            <div class="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-zinc-300 text-xs">
              01
            </div>
          </div>
          <div>
            <div class="text-xs font-semibold text-zinc-200">Inbound Request</div>
            <p class="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              IP, Geo, Device UA, and Client Headers hit safe page <code class="text-zinc-200 font-mono">index.php</code>.
            </p>
          </div>
        </div>

        <!-- Step 2: Cloak Engine -->
        <div class="bg-zinc-900/60 border border-zinc-700/80 rounded-md p-3.5 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono text-zinc-400 uppercase">Step 02 &bull; Engine</span>
            <div class="w-6 h-6 rounded bg-zinc-200 text-black flex items-center justify-center text-xs font-bold">
              02
            </div>
          </div>
          <div>
            <div class="text-xs font-semibold text-white font-mono">{{ campaign.filter_filename }}</div>
            <p class="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              Validates <code class="text-zinc-200 font-mono">{{ campaign.cookie_days }}d</code> cookie, verifies platform in 
              <span class="text-zinc-200 font-mono uppercase">{{ campaign.platform.join(", ") }}</span>, and queries classifier API.
            </p>
          </div>
        </div>

        <!-- Step 3: Divergence Outcome -->
        <div class="flex flex-col gap-2">
          <!-- Human Branch -->
          <div class="bg-zinc-900/60 border border-zinc-800 rounded-md p-2.5 flex items-center gap-2.5 text-left">
            <div class="w-5 h-5 rounded bg-zinc-800 text-zinc-200 text-xs flex items-center justify-center shrink-0 font-bold">
              &check;
            </div>
            <div class="min-w-0">
              <div class="text-xs font-medium text-zinc-200">Human Traffic</div>
              <p class="text-[10px] text-zinc-500 truncate">Renders hidden device money page.</p>
            </div>
          </div>

          <!-- Bot / Blocked Branch -->
          <div class="bg-zinc-900/40 border border-zinc-800/60 rounded-md p-2.5 flex items-center gap-2.5 text-left">
            <div class="w-5 h-5 rounded bg-zinc-900 text-zinc-500 text-xs flex items-center justify-center shrink-0 font-bold">
              &times;
            </div>
            <div class="min-w-0">
              <div class="text-xs font-medium text-zinc-400">Bot / Crawler / Other</div>
              <p class="text-[10px] text-zinc-500 truncate">Passes through to safe <code class="text-zinc-400">index.php</code>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Integration Snippet Card -->
    <div class="bg-zinc-950 rounded-lg p-5 border border-zinc-800 space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-semibold text-white">Safe Page Require Snippet</h2>
          <p class="text-xs text-zinc-400 mt-0.5">
            Add this line as the <strong>very first line</strong> of your safe page <code class="text-zinc-300 font-mono">index.php</code>
          </p>
        </div>
        <button
          @click="downloadFilter"
          class="text-xs px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors flex items-center gap-1.5 font-medium"
        >
          <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left: Targeting & Engine Settings -->
      <div class="bg-zinc-950 rounded-lg p-5 border border-zinc-800 space-y-4">
        <h2 class="text-sm font-semibold text-white border-b border-zinc-800/80 pb-2.5">
          Routing & Targeting Specifications
        </h2>

        <div class="space-y-3 text-xs">
          <!-- Target Platforms -->
          <div class="flex justify-between items-center py-1.5 border-b border-zinc-900">
            <span class="text-zinc-500 uppercase font-medium">Target Platforms</span>
            <div class="flex items-center gap-1.5">
              <span
                v-for="p in campaign.platform"
                :key="p"
                class="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono font-medium uppercase text-zinc-200"
              >
                {{ p }}
              </span>
            </div>
          </div>

          <!-- Allowed Regions -->
          <div class="flex justify-between items-start py-1.5 border-b border-zinc-900">
            <span class="text-zinc-500 uppercase font-medium">Allowed Regions</span>
            <div class="flex flex-wrap gap-1 justify-end max-w-xs">
              <template v-if="campaign.allowed_regions && campaign.allowed_regions.length > 0">
                <span
                  v-for="r in campaign.allowed_regions"
                  :key="r"
                  class="px-2 py-0.5 rounded bg-zinc-900 text-zinc-200 border border-zinc-800 font-mono font-medium"
                >
                  {{ r }}
                </span>
              </template>
              <span v-else class="text-zinc-500 italic">
                All Regions Allowed
              </span>
            </div>
          </div>

          <!-- Cookie TTL -->
          <div class="flex justify-between items-center py-1.5 border-b border-zinc-900">
            <span class="text-zinc-500 uppercase font-medium">Cookie Lifetime</span>
            <span class="font-mono text-zinc-200 font-medium">
              {{ campaign.cookie_days }} days
            </span>
          </div>

          <!-- Fail Mode -->
          <div class="flex justify-between items-center py-1.5 border-b border-zinc-900">
            <span class="text-zinc-500 uppercase font-medium">Fail Mode</span>
            <span class="px-2 py-0.5 rounded font-mono font-medium uppercase text-[11px] bg-zinc-900 text-zinc-300 border border-zinc-800">
              {{ campaign.fail_mode }}
            </span>
          </div>

          <!-- Filter Filename -->
          <div class="flex justify-between items-center py-1.5">
            <span class="text-zinc-500 uppercase font-medium">Filter Engine File</span>
            <span class="font-mono text-zinc-200 font-semibold">
              {{ campaign.filter_filename }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right: Security & Credentials -->
      <div class="bg-zinc-950 rounded-lg p-5 border border-zinc-800 space-y-4">
        <h2 class="text-sm font-semibold text-white border-b border-zinc-800/80 pb-2.5">
          Security & Classifier Credentials
        </h2>

        <!-- API Secret -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            API Secret Token
          </label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <input
                :type="showSecret ? 'text' : 'password'"
                :value="campaign.api_secret"
                readonly
                class="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-200 select-all focus:outline-none"
              />
            </div>
            <button
              @click="showSecret = !showSecret"
              class="px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-colors"
            >
              {{ showSecret ? "Hide" : "Show" }}
            </button>
            <button
              @click="copySecret"
              class="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-xs font-medium transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <!-- API Endpoint -->
        <div class="space-y-1.5">
          <label class="block text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            API Verification Endpoint
          </label>
          <input
            :value="campaign.api_endpoint"
            readonly
            class="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-400 select-all focus:outline-none"
          />
        </div>

        <!-- Quick Terminal Test -->
        <div class="pt-1">
          <label class="block text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
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
