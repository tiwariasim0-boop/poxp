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
  platform: ["ios", "android"],
  allowed_regions: ["US", "CA", "GB", "AU"],
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
  success("Generated API secret");
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
    errorMessage.value = "Select at least one platform.";
    return;
  }

  const cleaned: Record<string, string> = {};
  for (const [device, html] of Object.entries(moneyHtml.value)) {
    if (html.trim() !== "") cleaned[device] = html;
  }

  if (Object.keys(cleaned).length === 0) {
    errorMessage.value = "Add at least one device money page HTML.";
    return;
  }

  loading.value = true;

  try {
    const campaign = await createCampaign({
      ...form,
      money_html: cleaned,
    } as any);

    success(`Campaign "${campaign.name}" created`);
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
  <div class="max-w-4xl mx-auto space-y-6 pb-16">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-zinc-800 pb-4">
      <div>
        <h1 class="text-xl font-bold text-white tracking-tight">
          Create Campaign
        </h1>
        <p class="text-zinc-400 text-xs mt-0.5">
          Configure cloaking rules, platform filters, and money destinations.
        </p>
      </div>

      <button
        type="button"
        @click="router.back()"
        class="text-xs px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
      >
        Cancel
      </button>
    </div>

    <!-- Error Banner -->
    <div
      v-if="errorMessage"
      class="p-3 rounded-lg bg-zinc-900 border border-red-500/50 text-red-300 text-xs flex items-center gap-2"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
      <span>{{ errorMessage }}</span>
    </div>

    <form @submit.prevent="submit" class="space-y-6">
      <!-- Section 1: Campaign Identity -->
      <div class="p-5 rounded-lg border border-zinc-800 bg-zinc-950 space-y-4">
        <div class="border-b border-zinc-800/80 pb-2">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            1. General Information
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1.5">
              Campaign Name <span class="text-red-400">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. US Campaign Fall"
              class="w-full px-3 py-2 rounded bg-black border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1.5">
              Safe Page URL <span class="text-red-400">*</span>
            </label>
            <input
              v-model="form.safe_page_url"
              type="url"
              required
              placeholder="https://beatriceoralcare.shop/"
              class="w-full px-3 py-2 rounded bg-black border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>
      </div>

      <!-- Section 2: Targeting Matrix -->
      <div class="p-5 rounded-lg border border-zinc-800 bg-zinc-950 space-y-4">
        <div class="border-b border-zinc-800/80 pb-2">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            2. Targeting Matrix
          </h2>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-medium text-zinc-300">
            Target Operating Systems <span class="text-red-400">*</span>
          </label>
          <PlatformPicker v-model="form.platform" />
        </div>

        <div class="space-y-2 pt-2">
          <label class="block text-xs font-medium text-zinc-300">
            Allowed Geo Regions
          </label>
          <RegionPicker v-model="form.allowed_regions" variant="allow" />
        </div>
      </div>

      <!-- Section 3: Engine Settings -->
      <div class="p-5 rounded-lg border border-zinc-800 bg-zinc-950 space-y-4">
        <div class="border-b border-zinc-800/80 pb-2">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            3. Fallback & Cookie Settings
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-zinc-300 mb-1.5">
              Fail Mode (On API Timeout)
            </label>
            <div class="grid grid-cols-2 gap-2">
              <label
                :class="[
                  'cursor-pointer p-3 rounded border text-xs flex flex-col justify-between transition-colors',
                  form.fail_mode === 'safe'
                    ? 'bg-zinc-900 border-zinc-300 text-white'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                ]"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-medium">Safe Mode</span>
                  <input
                    type="radio"
                    value="safe"
                    v-model="form.fail_mode"
                    class="accent-white"
                  />
                </div>
                <p class="text-[11px] text-zinc-500">
                  Serve safe page on timeout.
                </p>
              </label>

              <label
                :class="[
                  'cursor-pointer p-3 rounded border text-xs flex flex-col justify-between transition-colors',
                  form.fail_mode === 'money'
                    ? 'bg-zinc-900 border-zinc-300 text-white'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                ]"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-medium">Money Mode</span>
                  <input
                    type="radio"
                    value="money"
                    v-model="form.fail_mode"
                    class="accent-white"
                  />
                </div>
                <p class="text-[11px] text-zinc-500">
                  Serve money page on timeout.
                </p>
              </label>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="text-xs font-medium text-zinc-300">
                Visitor Cookie Duration
              </label>
              <span class="font-mono text-xs font-bold text-white">
                {{ form.cookie_days }} days
              </span>
            </div>

            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="d in COOKIE_PRESETS"
                :key="d"
                type="button"
                @click="form.cookie_days = d"
                :class="[
                  'px-2.5 py-1 rounded text-xs font-mono transition-colors',
                  form.cookie_days === d
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'bg-black hover:bg-zinc-900 text-zinc-400 border border-zinc-800'
                ]"
              >
                {{ d }}d
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4: Device Money Pages Studio -->
      <div class="p-5 rounded-lg border border-zinc-800 bg-zinc-950 space-y-4">
        <div class="border-b border-zinc-800/80 pb-2">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            4. Device Money Pages
          </h2>
        </div>

        <DeviceMoneyHtml v-model="moneyHtml" :platforms="form.platform" />
      </div>

      <!-- Section 5: API Endpoint & Secret -->
      <div class="p-5 rounded-lg border border-zinc-800 bg-zinc-950 space-y-4">
        <div class="border-b border-zinc-800/80 pb-2">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            5. API Endpoint & Secret Key
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="text-xs font-medium text-zinc-300">
                Classifier API Endpoint
              </label>
              <button
                type="button"
                @click="form.api_endpoint = 'https://api.poxp.shop/pcl.php'"
                class="text-[11px] text-zinc-400 hover:text-white"
              >
                Reset Default
              </button>
            </div>
            <input
              v-model="form.api_endpoint"
              type="url"
              required
              class="w-full px-3 py-2 rounded bg-black border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="text-xs font-medium text-zinc-300">
                API Secret
              </label>
              <button
                type="button"
                @click="generateSecret"
                class="text-[11px] text-zinc-400 hover:text-white"
              >
                Generate Random
              </button>
            </div>

            <div class="relative flex items-center">
              <input
                v-model="form.api_secret"
                :type="showSecret ? 'text' : 'password'"
                placeholder="Auto-generated if empty"
                class="w-full pl-3 pr-10 py-2 rounded bg-black border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
              />
              <button
                type="button"
                @click="showSecret = !showSecret"
                class="absolute right-2.5 text-zinc-500 hover:text-zinc-300 text-[11px]"
              >
                {{ showSecret ? "Hide" : "Show" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Footer -->
      <div class="sticky bottom-4 z-30 p-3.5 rounded-lg border border-zinc-800 bg-zinc-950/95 backdrop-blur flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div class="flex items-center gap-2 text-xs text-zinc-400">
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="isReadyToSubmit ? 'bg-emerald-500' : 'bg-zinc-600'"
          ></span>
          <span>
            {{ isReadyToSubmit ? 'Ready to create' : 'Complete required fields' }}
          </span>
        </div>

        <button
          type="submit"
          :disabled="loading || !isReadyToSubmit"
          class="w-full sm:w-auto px-5 py-2 rounded bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors disabled:opacity-40"
        >
          {{ loading ? "Creating..." : "Create Campaign" }}
        </button>
      </div>
    </form>
  </div>
</template>
