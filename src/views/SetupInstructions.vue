<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import CodeBlock from "../components/CodeBlock.vue";
import {
  getSetupInstructions,
  downloadFilterUrl,
  downloadPageUrl,
  downloadBundleUrl,
  getCampaign,
  type SetupInstructions,
  type Campaign,
} from "../api/campaigns";
import { useToast } from "../composables/useToast";

const props = defineProps<{ id: string }>();

const data = ref<SetupInstructions | null>(null);
const campaign = ref<Campaign | null>(null);
const showFullTemplate = ref(false);
const activeCurlTab = ref<"bot" | "human">("bot");
const completedSteps = ref<Record<number, boolean>>({});

const { success } = useToast();

onMounted(async () => {
  try {
    const [setupData, camp] = await Promise.all([
      getSetupInstructions(props.id),
      getCampaign(props.id).catch(() => null),
    ]);
    data.value = setupData;
    campaign.value = camp;
  } catch (err) {
    console.error("Failed to load setup instructions", err);
  }
});

function toggleStep(idx: number) {
  completedSteps.value[idx] = !completedSteps.value[idx];
}
</script>

<template>
  <div v-if="data" class="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-xs text-slate-400">
          <RouterLink :to="`/campaign/${id}`" class="hover:text-indigo-400 transition-colors">
            ← Back to {{ campaign?.name || 'Campaign #' + id }}
          </RouterLink>
        </div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>Production Deployment Guide</span>
          <span class="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Step-by-Step
          </span>
        </h1>
        <p class="text-xs sm:text-sm text-slate-400">
          Deploy randomized cloaking engines and device money pages to your web server.
        </p>
      </div>

      <!-- Prominent 1-Click ZIP Download CTA -->
      <a
        :href="downloadBundleUrl(data.campaign_id)"
        @click="success('Downloading production ZIP bundle')"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-0.5 transition-all duration-200"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>Download Complete Bundle (.ZIP)</span>
      </a>
    </div>

    <!-- Security Obfuscation Notice Banner -->
    <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg shadow-amber-950/20">
      <svg class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <div class="space-y-1">
        <span class="font-bold text-amber-300">Randomized Obfuscation Architecture:</span>
        <p class="text-amber-200/90 leading-relaxed text-xs">
          Filenames inside this campaign bundle are cryptographically randomized (<code class="font-mono text-amber-300">{{ data.filter_filename }}</code>).
          Do not rename these files upon uploading—the filter relies on exact internal hashes for undetectable delivery.
        </p>
      </div>
    </div>

    <!-- Visual Server Directory Map -->
    <div class="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
      <div class="flex items-center justify-between border-b border-white/5 pb-3">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <svg class="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Server Directory Structure (public_html)</span>
        </h2>
        <span class="text-xs text-slate-500 font-mono">Upload Destination</span>
      </div>

      <p class="text-xs text-slate-400">
        Extract the ZIP bundle and place all generated files in the same directory alongside your safe page <code class="text-slate-200">index.php</code>:
      </p>

      <!-- Directory Tree Mockup -->
      <div class="p-4 rounded-xl bg-[#070b16] border border-white/10 font-mono text-xs text-slate-300 space-y-2">
        <div class="flex items-center gap-2 text-indigo-400 font-bold">
          <svg class="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
          <span>public_html/</span>
        </div>

        <div class="pl-6 space-y-1.5 border-l border-white/10 ml-2">
          <div class="flex items-center gap-2 text-indigo-300">
            <span>├──</span>
            <span class="font-bold text-white">{{ data.filter_filename }}</span>
            <span class="text-[10px] text-slate-500 font-sans">← Main Cloaking Engine & Classifier</span>
          </div>

          <div
            v-for="(filename, device) in data.page_filenames"
            :key="device"
            class="flex items-center gap-2 text-emerald-300"
          >
            <span>├──</span>
            <span class="font-bold text-emerald-300">{{ filename }}</span>
            <span class="text-[10px] text-slate-500 font-sans">← Hidden Money Page ({{ device }})</span>
          </div>

          <div class="flex items-center gap-2 text-slate-400">
            <span>└──</span>
            <span class="font-bold text-amber-300">index.php</span>
            <span class="text-[10px] text-slate-500 font-sans">← Safe Compliant Page (Injected at line 1)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 1: Safe Page Code Injection -->
    <div class="glass-panel rounded-2xl p-6 shadow-xl space-y-4 border-2 border-indigo-500/40">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
            1
          </div>
          <div>
            <h2 class="text-base font-bold text-white">Inject Require into Safe Page (index.php)</h2>
            <p class="text-xs text-slate-400 mt-0.5">
              Open your server's <code class="text-indigo-400 font-mono">index.php</code> and paste this on the <strong>very first line</strong>:
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="toggleStep(1)"
          :class="[
            'text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5',
            completedSteps[1]
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          ]"
        >
          <span>{{ completedSteps[1] ? '✓ Done' : 'Mark Done' }}</span>
        </button>
      </div>

      <CodeBlock
        :code="data.safe_page_snippet"
        language="php"
        label="Inject on Line 1 of index.php"
      />

      <!-- Encoding Callouts -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        <div class="p-3 rounded-lg bg-slate-900/60 border border-white/5 text-slate-400 flex items-start gap-2">
          <span class="text-amber-400 shrink-0">⚠️</span>
          <span>Zero whitespace, indentation, or newlines before the opening <code class="text-slate-200">&lt;?php</code>.</span>
        </div>
        <div class="p-3 rounded-lg bg-slate-900/60 border border-white/5 text-slate-400 flex items-start gap-2">
          <span class="text-amber-400 shrink-0">⚠️</span>
          <span>Ensure the file is saved as <strong>UTF-8 without BOM</strong> (Byte Order Mark).</span>
        </div>
      </div>

      <!-- Collapsible Full Template -->
      <div class="pt-2">
        <button
          type="button"
          @click="showFullTemplate = !showFullTemplate"
          class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
        >
          <span>{{ showFullTemplate ? "▼ Hide" : "▶ Show" }} Starter index.php Template</span>
        </button>

        <div v-if="showFullTemplate" class="mt-3 animate-slide-up">
          <CodeBlock
            :code="data.safe_page_template"
            language="php"
            label="Complete index.php Boilerplate"
          />
        </div>
      </div>
    </div>

    <!-- Step 2: Individual File Downloads Manifest -->
    <div class="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
      <div class="flex items-center justify-between border-b border-white/5 pb-3">
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
            2
          </div>
          <h2 class="text-base font-bold text-white">Download Production Files</h2>
        </div>

        <a
          :href="downloadBundleUrl(data.campaign_id)"
          class="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
        >
          Download all in ZIP &rarr;
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <!-- Filter PHP Card -->
        <div class="p-4 rounded-xl bg-[#070b16] border border-white/10 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 font-bold text-xs font-mono">
              PHP
            </div>
            <div class="min-w-0">
              <p class="text-xs font-mono font-bold text-white truncate">
                {{ data.filter_filename }}
              </p>
              <p class="text-[11px] text-slate-400">Cloaking Router Core</p>
            </div>
          </div>

          <a
            :href="downloadFilterUrl(data.campaign_id)"
            class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 transition-colors"
          >
            Download
          </a>
        </div>

        <!-- Each Device Money Page Card -->
        <div
          v-for="(filename, device) in data.page_filenames"
          :key="device"
          class="p-4 rounded-xl bg-[#070b16] border border-white/10 flex items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold text-xs font-mono">
              HTML
            </div>
            <div class="min-w-0">
              <p class="text-xs font-mono font-bold text-white truncate">
                {{ filename }}
              </p>
              <p class="text-[11px] text-slate-400 capitalize">
                Money Page for {{ device }}
              </p>
            </div>
          </div>

          <a
            :href="downloadPageUrl(data.campaign_id, device as string)"
            class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 transition-colors"
          >
            Download
          </a>
        </div>
      </div>
    </div>

    <!-- Step 3: Interactive cURL Verification Lab -->
    <div class="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
      <div class="flex items-center justify-between border-b border-white/5 pb-3">
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
            3
          </div>
          <div>
            <h2 class="text-base font-bold text-white">Verification & Health Check Lab</h2>
            <p class="text-xs text-slate-400">Test bot interception vs human visitor delivery from your terminal</p>
          </div>
        </div>

        <!-- Bot vs Human Switcher -->
        <div class="flex p-0.5 rounded-lg bg-black/40 border border-white/10 text-xs">
          <button
            @click="activeCurlTab = 'bot'"
            :class="[
              'px-3 py-1 rounded-md transition-colors font-medium',
              activeCurlTab === 'bot'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            ]"
          >
            Bot Test (Safe Page)
          </button>
          <button
            @click="activeCurlTab = 'human'"
            :class="[
              'px-3 py-1 rounded-md transition-colors font-medium',
              activeCurlTab === 'human'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            ]"
          >
            Human Test (Money Page)
          </button>
        </div>
      </div>

      <!-- Bot Test Tab -->
      <div v-if="activeCurlTab === 'bot'" class="space-y-3">
        <p class="text-xs text-slate-300">
          Simulate a Googlebot crawler. The response must return your safe page with status <strong>200 OK</strong> and <strong>no redirect (Location header)</strong>:
        </p>

        <CodeBlock
          :code="`curl -i -A 'Googlebot/2.1 (+http://www.google.com/bot.html)' ${campaign?.safe_page_url || 'https://your-domain.com/'}`"
          language="bash"
          label="Bot cURL Command"
        />

        <div class="p-3 rounded-lg bg-slate-900/60 border border-white/5 text-xs text-slate-400">
          Expected outcome: Contains safe page content. No 301/302 redirects.
        </div>
      </div>

      <!-- Human Test Tab -->
      <div v-else class="space-y-3">
        <p class="text-xs text-slate-300">
          Simulate an authentic Chrome/Safari human user from an allowed geo region:
        </p>

        <CodeBlock
          :code="`curl -i -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' ${campaign?.safe_page_url || 'https://your-domain.com/'}`"
          language="bash"
          label="Human cURL Command"
        />

        <div class="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
          Expected outcome: Serves device-specific money page and sets the <code class="font-mono text-white">_event</code> persistent session cookie.
        </div>
      </div>
    </div>

    <!-- Step 4: Step-by-step instructions from server -->
    <div class="space-y-4">
      <h2 class="text-base font-bold text-white">Detailed Server Configuration</h2>
      <div class="grid gap-3">
        <div
          v-for="(step, i) in data.steps"
          :key="i"
          class="glass-panel rounded-xl p-5 shadow-lg space-y-2 border border-white/5"
        >
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-slate-300">
              {{ i + 1 }}
            </span>
            <h3 class="font-semibold text-sm text-slate-200">{{ step.title }}</h3>
          </div>
          <div class="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed bg-[#060912] p-3 rounded-lg border border-white/5">
            {{ step.body }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
