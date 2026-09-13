<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from "../composables/useToast";

const props = defineProps<{
  modelValue: Record<string, string>;
  platforms: string[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, string>): void;
}>();

const { show } = useToast();

const activeDevice = ref<string>("");
const activeTab = ref<Record<string, "paste" | "upload">>({});
const previewDevice = ref<string | null>(null);
const isDragging = ref<Record<string, boolean>>({});

// Keep active device in sync with platforms
const currentDevice = computed(() => {
  if (props.platforms.includes(activeDevice.value)) return activeDevice.value;
  return props.platforms[0] || "";
});

function setActiveTab(device: string, tab: "paste" | "upload") {
  activeTab.value = { ...activeTab.value, [device]: tab };
}

function update(device: string, value: string) {
  emit("update:modelValue", { ...props.modelValue, [device]: value });
}

async function handleFile(device: string, file: File) {
  if (!file.name.endsWith(".html") && !file.name.endsWith(".htm") && !file.type.includes("html")) {
    show("Please upload a valid .html file", "error");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    show("File exceeds maximum allowed size (5 MB)", "error");
    return;
  }

  try {
    const text = await file.text();
    update(device, text);
    show(`Loaded ${file.name} for ${device.toUpperCase()} (${(file.size / 1024).toFixed(1)} KB)`, "success");
  } catch {
    show("Failed to read file", "error");
  }
}

function onFileInputChange(device: string, event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    handleFile(device, file);
  }
}

function onDrop(device: string, event: DragEvent) {
  isDragging.value[device] = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    handleFile(device, file);
  }
}

function clear(device: string) {
  const next = { ...props.modelValue };
  delete next[device];
  emit("update:modelValue", next);
  show(`Cleared ${device} money page`, "info");
}

function insertSample(device: string) {
  const sample = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Special Offer - ${device.toUpperCase()}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: #1e293b; border-radius: 16px; padding: 32px; max-width: 480px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); border: 1px solid #334155; }
    .badge { background: #6366f1; color: white; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 16px; }
    h1 { font-size: 24px; margin: 0 0 12px; color: #ffffff; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
    .btn { background: #10b981; color: white; border: none; padding: 12px 28px; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; transition: background 0.2s; }
    .btn:hover { background: #059669; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Exclusive for ${device.toUpperCase()}</span>
    <h1>Claim Your VIP Reward</h1>
    <p>You have been verified as an authentic ${device} user. Click below to redeem your promotional reward.</p>
    <a href="#" class="btn">Proceed to Offer &rarr;</a>
  </div>
</body>
</html>`;
  update(device, sample);
  show(`Inserted sample offer template for ${device}`, "success");
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getContentSize(content?: string): string {
  if (!content) return "0 B";
  const bytes = new Blob([content]).size;
  return formatBytes(bytes);
}
</script>

<template>
  <div class="space-y-4">
    <!-- Alert if no platforms selected -->
    <div
      v-if="platforms.length === 0"
      class="p-6 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 text-amber-300 flex items-center gap-3 text-sm"
    >
      <svg class="w-5 h-5 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span>Please select at least one target operating system above to configure device money pages.</span>
    </div>

    <!-- Platform device tabs -->
    <div v-else class="rounded-xl border border-white/10 bg-[#090d18] overflow-hidden shadow-xl">
      <!-- Device Selector Tab Header -->
      <div class="flex flex-wrap items-center justify-between border-b border-white/10 bg-[#0c1222] px-4 py-2 gap-2">
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="device in platforms"
            :key="device"
            type="button"
            @click="activeDevice = device"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150 flex items-center gap-2',
              (currentDevice === device)
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200'
            ]"
          >
            <span>{{ device }}</span>
            <span
              v-if="modelValue[device] && modelValue[device].trim()"
              class="w-2 h-2 rounded-full bg-emerald-400"
              title="HTML Loaded"
            ></span>
            <span
              v-else
              class="w-2 h-2 rounded-full bg-amber-400/80"
              title="HTML Missing"
            ></span>
          </button>
        </div>

        <!-- Global Status info -->
        <div class="text-[11px] text-slate-400 flex items-center gap-2">
          <span>Configured:</span>
          <span class="font-mono font-bold text-slate-200">
            {{ Object.values(modelValue).filter((v) => v && v.trim()).length }} / {{ platforms.length }}
          </span>
        </div>
      </div>

      <!-- Active Device Pane -->
      <div v-if="currentDevice" class="p-5 space-y-4">
        <!-- Subheader with status & mode switchers -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div class="flex items-center gap-2">
            <span class="font-bold text-sm text-slate-200 capitalize flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full" :class="modelValue[currentDevice] ? 'bg-emerald-500' : 'bg-amber-500'"></span>
              {{ currentDevice }} Money Landing Page
            </span>
            <span
              v-if="modelValue[currentDevice]"
              class="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
            >
              {{ getContentSize(modelValue[currentDevice]) }}
            </span>
            <span
              v-else
              class="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20"
            >
              Pending Upload
            </span>
          </div>

          <div class="flex items-center gap-2">
            <!-- Paste vs Upload tab switcher -->
            <div class="flex p-0.5 rounded-lg bg-black/40 border border-white/10 text-xs">
              <button
                type="button"
                @click="setActiveTab(currentDevice, 'paste')"
                :class="[
                  'px-2.5 py-1 rounded-md transition-colors',
                  (activeTab[currentDevice] || 'paste') === 'paste'
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                ]"
              >
                Code Editor
              </button>
              <button
                type="button"
                @click="setActiveTab(currentDevice, 'upload')"
                :class="[
                  'px-2.5 py-1 rounded-md transition-colors',
                  activeTab[currentDevice] === 'upload'
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                ]"
              >
                File Upload
              </button>
            </div>

            <!-- Preview Button -->
            <button
              v-if="modelValue[currentDevice]"
              type="button"
              @click="previewDevice = currentDevice"
              class="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <span>Preview</span>
            </button>

            <!-- Sample Boilerplate Inserter -->
            <button
              type="button"
              @click="insertSample(currentDevice)"
              class="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-colors"
            >
              + Sample Template
            </button>

            <!-- Clear button -->
            <button
              v-if="modelValue[currentDevice]"
              type="button"
              @click="clear(currentDevice)"
              class="text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Tab 1: Paste Code Editor -->
        <div v-if="(activeTab[currentDevice] || 'paste') === 'paste'" class="space-y-2">
          <div class="relative">
            <textarea
              :value="modelValue[currentDevice] || ''"
              @input="update(currentDevice, ($event.target as HTMLTextAreaElement).value)"
              placeholder="<!DOCTYPE html>&#10;<html>&#10;<head>&#10;  <title>Money Page</title>&#10;..."
              rows="12"
              class="w-full p-4 bg-[#050811] border border-white/10 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-y leading-relaxed"
            ></textarea>
          </div>
          <div class="flex justify-between text-[11px] text-slate-500">
            <span>Serves strictly to qualified <strong>{{ currentDevice }}</strong> human visitors.</span>
            <span>Lines: {{ (modelValue[currentDevice] || '').split('\n').length }}</span>
          </div>
        </div>

        <!-- Tab 2: Drag and Drop File Upload -->
        <div v-else class="space-y-3">
          <div
            @dragover.prevent="isDragging[currentDevice] = true"
            @dragleave.prevent="isDragging[currentDevice] = false"
            @drop.prevent="onDrop(currentDevice, $event)"
            :class="[
              'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3',
              isDragging[currentDevice]
                ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
                : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.02] bg-[#050811]'
            ]"
            @click="($refs[`fileInput_${currentDevice}`] as HTMLInputElement)?.click()"
          >
            <div class="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>

            <div>
              <p class="text-sm font-semibold text-slate-200">
                Click or drag & drop money page HTML for <span class="capitalize text-indigo-400">{{ currentDevice }}</span>
              </p>
              <p class="text-xs text-slate-400 mt-1">
                Supports standalone .html or .htm files up to 5 MB
              </p>
            </div>

            <input
              :ref="`fileInput_${currentDevice}`"
              type="file"
              accept=".html,.htm,text/html"
              @change="onFileInputChange(currentDevice, $event)"
              class="hidden"
            />
          </div>

          <!-- Existing Loaded Confirmation -->
          <div v-if="modelValue[currentDevice]" class="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>File currently loaded ({{ getContentSize(modelValue[currentDevice]) }}). Uploading a new file will overwrite it.</span>
            </div>
            <button
              type="button"
              @click="previewDevice = currentDevice"
              class="underline hover:text-white"
            >
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Preview Modal -->
    <div
      v-if="previewDevice"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div class="bg-[#0b101d] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        <div class="px-5 py-3.5 bg-[#0e1628] border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-indigo-500"></span>
            <h3 class="font-bold text-sm text-white capitalize">
              Live Preview: {{ previewDevice }} Offer Page
            </h3>
          </div>
          <button
            @click="previewDevice = null"
            class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="flex-1 bg-white overflow-auto p-0 min-h-[500px]">
          <iframe
            :srcdoc="modelValue[previewDevice]"
            class="w-full h-full min-h-[500px] border-0"
            sandbox="allow-scripts"
          ></iframe>
        </div>

        <div class="px-5 py-2.5 bg-[#0e1628] border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
          <span>Sandbox Mode Enabled (Isolated iFrame)</span>
          <button
            @click="previewDevice = null"
            class="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
