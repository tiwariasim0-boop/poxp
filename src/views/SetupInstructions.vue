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
  <div v-if="data" class="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-xs text-zinc-400">
          <RouterLink :to="`/campaign/${id}`" class="hover:text-white transition-colors">
            &larr; Back to {{ campaign?.name || 'Campaign #' + id }}
          </RouterLink>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <span>Production Deployment Guide</span>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
            Step-by-Step
          </span>
        </h1>
        <p class="text-xs text-zinc-500">
          Deploy randomized cloaking engines and device money pages to your web server.
        </p>
      </div>

      <!-- 1-Click ZIP Download CTA -->
      <a
        :href="downloadBundleUrl(data.campaign_id)"
        @click="success('Downloading production ZIP bundle')"
        class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white hover:bg-zinc-200 text-black font-semibold text-xs shadow-sm transition-colors"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>Download Complete Bundle (.ZIP)</span>
      </a>
    </div>

    <!-- Security Obfuscation Notice Banner -->
    <div class="p-3.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs flex items-start gap-3">
      <div class="w-5 h-5 rounded bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
        i
      </div>
      <div class="space-y-0.5">
        <span class="font-semibold text-white">Randomized Obfuscation Notice:</span>
        <p class="text-zinc-400 leading-relaxed text-xs">
          Filenames inside this campaign bundle are cryptographically randomized (<code class="font-mono text-zinc-200">{{ data.filter_filename }}</code>).
          Do not rename these files when uploading. The filter relies on internal hash matching for undetectable execution.
        </p>
      </div>
    </div>

    <!-- Server Directory Map -->
    <div class="bg-zinc-950 rounded-lg p-5 border border-zinc-800 space-y-3">
      <div class="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
          <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Server Directory Layout (public_html)</span>
        </h2>
        <span class="text-[11px] text-zinc-500 font-mono">Upload Destination</span>
      </div>

      <p class="text-xs text-zinc-400">
        Extract the ZIP bundle and place all generated files in the same directory alongside your safe page <code class="text-zinc-200 font-mono">index.php</code>:
      </p>

      <!-- Directory Tree Mockup -->
      <div class="p-4 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1.5">
        <div class="flex items-center gap-2 text-white font-semibold">
          <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
          <span>public_html/</span>
        </div>

        <div class="pl-6 space-y-1 border-l border-zinc-800 ml-1.5">
          <div class="flex items-center gap-2 text-zinc-300">
            <span class="text-zinc-600">├──</span>
            <span class="font-bold text-white">{{ data.filter_filename }}</span>
            <span class="text-[10px] text-zinc-500 font-sans">&larr; Main Cloaking Engine &amp; Classifier</span>
          </div>

          <div
            v-for="(filename, device) in data.page_filenames"
            :key="device"
            class="flex items-center gap-2 text-zinc-300"
          >
            <span class="text-zinc-600">├──</span>
            <span class="font-medium text-zinc-200">{{ filename }}</span>
            <span class="text-[10px] text-zinc-500 font-sans">&larr; Hidden Money Page ({{ device }})</span>
          </div>

          <div class="flex items-center gap-2 text-zinc-400">
            <span class="text-zinc-600">└──</span>
            <span class="font-medium text-zinc-300">index.php</span>
            <span class="text-[10px] text-zinc-500 font-sans">&larr; Safe Compliant Page (Injected at line 1)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 1: Safe Page Code Injection -->
    <div class="bg-zinc-950 rounded-lg p-5 border border-zinc-800 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-6 h-6 rounded bg-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center">
            1
          </div>
          <div>
            <h2 class="text-sm font-semibold text-white">Inject Require into Safe Page (index.php)</h2>
            <p class="text-xs text-zinc-400 mt-0.5">
              Open your server's <code class="text-zinc-300 font-mono">index.php</code> and paste this on the <strong>very first line</strong>:
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="toggleStep(1)"
          :class="[
            'text-xs px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 font-medium',
            completedSteps[1]
              ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
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
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
        <div class="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-start gap-2 text-[11px]">
          <span class="text-zinc-400 shrink-0">&bull;</span>
          <span>Zero whitespace, indentation, or newlines before the opening <code class="text-zinc-200">&lt;?php</code>.</span>
        </div>
        <div class="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-start gap-2 text-[11px]">
          <span class="text-zinc-400 shrink-0">&bull;</span>
          <span>Ensure the file is saved as <strong>UTF-8 without BOM</strong>.</span>
        </div>
      </div>

      <!-- Collapsible Full Template -->
      <div class="pt-1">
        <button
          type="button"
          @click="showFullTemplate = !showFullTemplate"
          class="text-xs text-zinc-400 hover:text-white font-medium flex items-center gap-1 transition-colors"
        >
          <span>{{ showFullTemplate ? "▼ Hide" : "▶ Show" }} Starter index.php Template</span>
        </button>

        <div v-if="showFullTemplate" class="mt-2.5 animate-slide-up">
          <CodeBlock
            :code="data.safe_page_template"
            language="php"
            label="Complete index.php Boilerplate"
          />
        </div>
      </div>
    </div>

    <!-- Step 2: Individual File Downloads Manifest -->
    <div class="bg-zinc-950 rounded-lg p-5 border border-zinc-800 space-y-3">
      <div class="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <div class="flex items-center gap-2.5">
          <div class="w-6 h-6 rounded bg-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center">
            2
          </div>
          <h2 class="text-sm font-semibold text-white">Download Production Files</h2>
        </div>

        <a
          :href="downloadBundleUrl(data.campaign_id)"
          class="text-xs text-zinc-400 hover:text-white font-medium transition-colors"
        >
          Download all in ZIP &rarr;
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <!-- Filter PHP Card -->
        <div class="p-3 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 shrink-0 font-bold text-[10px] font-mono">
              PHP
            </div>
            <div class="min-w-0">
              <p class="text-xs font-mono font-semibold text-white truncate">
                {{ data.filter_filename }}
              </p>
              <p class="text-[11px] text-zinc-500">Cloaking Router Core</p>
            </div>
          </div>

          <a
            :href="downloadFilterUrl(data.campaign_id)"
            class="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium shrink-0 border border-zinc-700 transition-colors"
          >
            Download
          </a>
        </div>

        <!-- Each Device Money Page Card -->
        <div
          v-for="(filename, device) in data.page_filenames"
          :key="device"
          class="p-3 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 font-bold text-[10px] font-mono">
              HTML
            </div>
            <div class="min-w-0">
              <p class="text-xs font-mono font-semibold text-zinc-200 truncate">
                {{ filename }}
              </p>
              <p class="text-[11px] text-zinc-500 capitalize">
                Money Page ({{ device }})
              </p>
            </div>
          </div>

          <a
            :href="downloadPageUrl(data.campaign_id, device as string)"
            class="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium shrink-0 border border-zinc-700 transition-colors"
          >
            Download
          </a>
        </div>
      </div>
    </div>

    <!-- Step 3: cURL Verification Lab -->
    <div class="bg-zinc-950 rounded-lg p-5 border border-zinc-800 space-y-3">
      <div class="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <div class="flex items-center gap-2.5">
          <div class="w-6 h-6 rounded bg-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center">
            3
          </div>
          <div>
            <h2 class="text-sm font-semibold text-white">Verification &amp; Health Check Lab</h2>
            <p class="text-xs text-zinc-500">Test bot interception vs human visitor delivery from your terminal</p>
          </div>
        </div>

        <!-- Bot vs Human Switcher -->
        <div class="flex p-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs">
          <button
            @click="activeCurlTab = 'bot'"
            :class="[
              'px-2.5 py-1 rounded transition-colors text-xs',
              activeCurlTab === 'bot'
                ? 'bg-zinc-100 text-black font-medium'
                : 'text-zinc-400 hover:text-white'
            ]"
          >
            Bot Test (Safe Page)
          </button>
          <button
            @click="activeCurlTab = 'human'"
            :class="[
              'px-2.5 py-1 rounded transition-colors text-xs',
              activeCurlTab === 'human'
                ? 'bg-zinc-100 text-black font-medium'
                : 'text-zinc-400 hover:text-white'
            ]"
          >
            Human Test (Money Page)
          </button>
        </div>
      </div>

      <!-- Bot Test Tab -->
      <div v-if="activeCurlTab === 'bot'" class="space-y-2.5">
        <p class="text-xs text-zinc-400">
          Simulate a crawler request. The response must return your safe page with status <strong>200 OK</strong> and <strong>no redirect (Location header)</strong>:
        </p>

        <CodeBlock
          :code="`curl -i -A 'Googlebot/2.1 (+http://www.google.com/bot.html)' ${campaign?.safe_page_url || 'https://your-domain.com/'}`"
          language="bash"
          label="Bot cURL Command"
        />

        <div class="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
          Expected outcome: Returns safe page HTML. No HTTP 301/302 redirects.
        </div>
      </div>

      <!-- Human Test Tab -->
      <div v-else class="space-y-2.5">
        <p class="text-xs text-zinc-400">
          Simulate an authentic Chrome/Safari human user from an allowed geo region:
        </p>

        <CodeBlock
          :code="`curl -i -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' ${campaign?.safe_page_url || 'https://your-domain.com/'}`"
          language="bash"
          label="Human cURL Command"
        />

        <div class="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
          Expected outcome: Serves device money page and sets the <code class="font-mono text-white">_event</code> persistent session cookie.
        </div>
      </div>
    </div>

    <!-- Step 4: Step-by-step instructions from server -->
    <div class="space-y-3">
      <h2 class="text-sm font-semibold text-white">Detailed Server Configuration</h2>
      <div class="grid gap-2.5">
        <div
          v-for="(step, i) in data.steps"
          :key="i"
          class="bg-zinc-950 rounded-lg p-4 border border-zinc-800 space-y-2"
        >
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-[10px] text-zinc-300">
              {{ i + 1 }}
            </span>
            <h3 class="font-medium text-xs text-zinc-200">{{ step.title }}</h3>
          </div>
          <div class="text-xs text-zinc-400 whitespace-pre-wrap font-mono leading-relaxed bg-zinc-900 p-3 rounded border border-zinc-800">
            {{ step.body }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
