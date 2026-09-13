<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import PlatformPicker from "../components/PlatformPicker.vue";
import RegionPicker from "../components/RegionPicker.vue";
import DeviceMoneyHtml from "../components/DeviceMoneyHtml.vue";
import { createCampaign, type CampaignCreate } from "../api/campaigns";
import { useToast } from "../composables/useToast";

const router = useRouter();
const { success, error: toastError } = useToast();

const loading = ref(false);
const errorMessage = ref<string | null>(null);

const form = reactive<Omit<CampaignCreate, "money_html">>({
  name: "",
  platform: ["ios", "android"], // default smart preset
  allowed_regions: ["US", "CA", "GB", "AU"], // default Tier 1
  blocked_regions: [],
  safe_page_url: "",
  cookie_days: 30,
  fail_mode: "safe",
  api_endpoint: "https://api.poxp.shop/pcl.php",
  api_secret: "",
});

const moneyHtml = ref<Record<string, string>>({});
const showSecret = ref(false);

const COOKIE_PRESETS = [7, 14, 30, 60, 90, 365];

// Compute configured money pages
const configuredDevicesCount = computed(() => {
  return form.platform.filter(
    (p) => moneyHtml.value[p] && moneyHtml.value[p].trim() !== ""
  ).length;
});

const isReadyToSubmit = computed(() => {
  return (
    form.name.trim() !== "" &&
    form.safe_page_url.trim() !== "" &&
    form.platform.length > 0 &&
    configuredDevicesCount.value > 0
  );
});

function generateSecret() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  let s = "";
  for (let i = 0; i < 43; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  form.api_secret = s;
  success("Generated new cryptographically secure API secret");
}

async function submit() {
  errorMessage.value = null;

  if (!form.name.trim()) {
    errorMessage.value = "Campaign name is required.";
    return;
  }
  if (!form.safe_page_url.trim()) {
    errorMessage.value = "Safe page URL is required.";
    return;
  }
  if (form.platform.length === 0) {
    errorMessage.value = "Select at least one operating system platform.";
    return;
  }

  // Strip empty devices
  const cleaned: Record<string, string> = {};
  for (const [device, html] of Object.entries(moneyHtml.value)) {
    if (html.trim() !== "") cleaned[device] = html;
  }

  if (Object.keys(cleaned).length === 0) {
    errorMessage.value = "Please add at least one device money page HTML.";
    return;
  }

  loading.value = true;

  try {
    const campaign = await createCampaign({
      ...form,
      money_html: cleaned,
    } as any);

    success(`Campaign "${campaign.name}" created successfully!`);
    router.push(`/campaign/${campaign.id}/setup`);
  } catch (e: any) {
    const msg = e.message || "Failed to create campaign.";
    errorMessage.value = msg;
    toastError(msg);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
      <div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>New Cloaked Campaign</span>
          <span class="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Builder
          </span>
        </h1>
        <p class="text-slate-400 text-sm mt-1">
          Configure multi-device cloaking routing, bot shield rules, and server filter bundles.
        </p>
      </div>

      <button
        type="button"
        @click="router.back()"
        class="text-xs px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors self-start sm:self-auto"
      >
        Cancel
      </button>
    </div>

    <!-- Error Banner -->
    <div
      v-if="errorMessage"
      class="p-4 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-sm flex items-center gap-3 shadow-lg shadow-rose-950/40 animate-slide-up"
    >
      <svg class="w-5 h-5 text-rose-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>{{ errorMessage }}</span>
    </div>

    <form @submit.prevent="submit" class="space-y-8">
      <!-- Section 1: Campaign Identity & Target Domain -->
      <div class="glass-panel rounded-2xl p-6 space-y-6 shadow-xl">
        <div class="flex items-center gap-3 border-b border-white/5 pb-4">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
            1
          </div>
          <div>
            <h2 class="text-lg font-bold text-white">Campaign Identity & Safe Domain</h2>
            <p class="text-xs text-slate-400">Core parameters and legitimate compliant destination</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Campaign Name -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Campaign Name <span class="text-rose-400">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. Dental Care - US Fall Push"
              class="w-full px-4 py-2.5 rounded-xl bg-[#060912] border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <p class="text-[11px] text-slate-500 mt-1.5">Internal identifier for this routing pipeline.</p>
          </div>

          <!-- Safe Page URL -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Safe Page URL <span class="text-rose-400">*</span>
            </label>
            <input
              v-model="form.safe_page_url"
              type="url"
              required
              placeholder="https://beatriceoralcare.shop/"
              class="w-full px-4 py-2.5 rounded-xl bg-[#060912] border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <p class="text-[11px] text-slate-500 mt-1.5">Where web spiders, bot auditors, and crawlers will land.</p>
          </div>
        </div>
      </div>

      <!-- Section 2: Targeting Rules (Platforms & Geos) -->
      <div class="glass-panel rounded-2xl p-6 space-y-6 shadow-xl">
        <div class="flex items-center gap-3 border-b border-white/5 pb-4">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
            2
          </div>
          <div>
            <h2 class="text-lg font-bold text-white">Targeting Matrix</h2>
            <p class="text-xs text-slate-400">Specify allowed device environments and geographic locations</p>
          </div>
        </div>

        <!-- Platform Picker -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Target Operating Systems <span class="text-rose-400">*</span>
          </label>
          <PlatformPicker v-model="form.platform" />
        </div>

        <!-- Geo Region Picker -->
        <div class="space-y-2 pt-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Allowed Geo Regions
          </label>
          <p class="text-[11px] text-slate-400 mb-2">
            Leave empty to allow all countries, or pick targeted regions. Traffic from other geos serves safe page.
          </p>
          <RegionPicker v-model="form.allowed_regions" variant="allow" />
        </div>
      </div>

      <!-- Section 3: Cloaking Engine & Fallback Rules -->
      <div class="glass-panel rounded-2xl p-6 space-y-6 shadow-xl">
        <div class="flex items-center gap-3 border-b border-white/5 pb-4">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
            3
          </div>
          <div>
            <h2 class="text-lg font-bold text-white">Cloaking Engine & Fallback Behavior</h2>
            <p class="text-xs text-slate-400">Cookie persistence duration and timeout safety defaults</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Fail Mode Selector with visual cards -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Fail Mode (On API Timeout / Error)
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label
                :class="[
                  'cursor-pointer p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between',
                  form.fail_mode === 'safe'
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-glow text-white'
                    : 'bg-[#060912] border-white/10 hover:border-white/20 text-slate-400'
                ]"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-bold text-sm">Safe Mode</span>
                  <input
                    type="radio"
                    value="safe"
                    v-model="form.fail_mode"
                    class="accent-indigo-500"
                  />
                </div>
                <p class="text-[11px] text-slate-400 leading-normal">
                  Serve safe page if the classifier fails. Maximum protection against audits.
                </p>
              </label>

              <label
                :class="[
                  'cursor-pointer p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between',
                  form.fail_mode === 'money'
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-glow text-white'
                    : 'bg-[#060912] border-white/10 hover:border-white/20 text-slate-400'
                ]"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-bold text-sm">Money Mode</span>
                  <input
                    type="radio"
                    value="money"
                    v-model="form.fail_mode"
                    class="accent-indigo-500"
                  />
                </div>
                <p class="text-[11px] text-slate-400 leading-normal">
                  Serve money page on error. Maximizes traffic conversion during downtime.
                </p>
              </label>
            </div>
          </div>

          <!-- Cookie Lifetime -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Visitor Cookie TTL
              </label>
              <span class="font-mono text-xs font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10">
                {{ form.cookie_days }} days
              </span>
            </div>

            <!-- Quick Preset Chips -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="d in COOKIE_PRESETS"
                :key="d"
                type="button"
                @click="form.cookie_days = d"
                :class="[
                  'px-3 py-1 rounded-lg text-xs font-mono transition-colors',
                  form.cookie_days === d
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200'
                ]"
              >
                {{ d }}d
              </button>
            </div>

            <p class="text-[11px] text-slate-500 leading-relaxed">
              Once verified as human, returning visitors bypass re-classification and instantly see their device offer page for {{ form.cookie_days }} days.
            </p>
          </div>
        </div>
      </div>

      <!-- Section 4: Device Money Pages HTML Studio -->
      <div class="glass-panel rounded-2xl p-6 space-y-6 shadow-xl">
        <div class="flex items-center gap-3 border-b border-white/5 pb-4">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
            4
          </div>
          <div>
            <h2 class="text-lg font-bold text-white">Device Money Pages Studio</h2>
            <p class="text-xs text-slate-400">
              Provide unique HTML or upload files for each targeted platform
            </p>
          </div>
        </div>

        <DeviceMoneyHtml v-model="moneyHtml" :platforms="form.platform" />
      </div>

      <!-- Section 5: API Endpoint & Secret -->
      <div class="glass-panel rounded-2xl p-6 space-y-6 shadow-xl">
        <div class="flex items-center gap-3 border-b border-white/5 pb-4">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
            5
          </div>
          <div>
            <h2 class="text-lg font-bold text-white">Classifier API & Secret Key</h2>
            <p class="text-xs text-slate-400">Endpoint authentication and communication token</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- API Endpoint -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Classifier API Endpoint
              </label>
              <button
                type="button"
                @click="form.api_endpoint = 'https://api.poxp.shop/pcl.php'"
                class="text-[11px] text-indigo-400 hover:text-indigo-300"
              >
                Reset Default
              </button>
            </div>
            <input
              v-model="form.api_endpoint"
              type="url"
              required
              class="w-full px-4 py-2.5 rounded-xl bg-[#060912] border border-white/10 text-sm font-mono text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <!-- API Secret Key -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-semibold uppercase tracking-wider text-slate-300">
                API Secret Key
              </label>
              <button
                type="button"
                @click="generateSecret"
                class="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                </svg>
                <span>Generate Random</span>
              </button>
            </div>

            <div class="relative flex items-center">
              <input
                v-model="form.api_secret"
                :type="showSecret ? 'text' : 'password'"
                placeholder="Leave blank to auto-generate upon creation"
                class="w-full pl-4 pr-12 py-2.5 rounded-xl bg-[#060912] border border-white/10 text-sm font-mono text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                @click="showSecret = !showSecret"
                class="absolute right-3 text-slate-400 hover:text-white p-1"
                :title="showSecret ? 'Hide Secret' : 'Show Secret'"
              >
                <svg v-if="!showSecret" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Submission Bar -->
      <div class="sticky bottom-4 z-30 p-4 rounded-2xl glass-panel border border-indigo-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-3 h-3 rounded-full shrink-0',
              isReadyToSubmit ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            ]"
          ></div>
          <div class="text-xs text-slate-300">
            <span v-if="isReadyToSubmit" class="font-medium text-emerald-300">
              Ready to deploy: {{ form.platform.length }} OS targets, {{ configuredDevicesCount }} money pages loaded.
            </span>
            <span v-else class="text-amber-300">
              Please enter campaign name, safe URL, and load at least 1 money page.
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="submit"
            :disabled="loading || !isReadyToSubmit"
            class="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? "Generating Cloak Engine..." : "Create Campaign & Get Setup Files" }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
