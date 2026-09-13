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
    show(`Loaded ${file.name} for ${device.toUpperCase()}`, "success");
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
  <title>Offer - ${device.toUpperCase()}</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .box { border: 1px solid #333; padding: 32px; border-radius: 8px; text-align: center; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Exclusive Offer for ${device.toUpperCase()}</h1>
    <p>Target landing page content.</p>
  </div>
</body>
</html>`;
  update(device, sample);
  show(`Inserted sample template for ${device}`, "success");
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
  <div class="space-y-3">
    <!-- Alert if no platforms selected -->
    <div
      v-if="platforms.length === 0"
      class="p-4 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 text-xs"
    >
      Please select at least one operating system above to configure device money pages.
    </div>

    <!-- Platform device tabs -->
    <div v-else class="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
      <!-- Device Selector Tab Header -->
      <div class="flex flex-wrap items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-3 py-2 gap-2">
        <div class="flex flex-wrap gap-1">
          <button
            v-for="device in platforms"
            :key="device"
            type="button"
            @click="activeDevice = device"
            :class="[
              'px-2.5 py-1 rounded text-xs capitalize transition-colors flex items-center gap-1.5',
              (currentDevice === device)
                ? 'bg-white text-black font-semibold'
                : 'text-zinc-400 hover:text-white'
            ]"
          >
            <span>{{ device }}</span>
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="modelValue[device] && modelValue[device].trim() ? 'bg-emerald-500' : 'bg-zinc-600'"
            ></span>
          </button>
        </div>

        <div class="text-[11px] text-zinc-500">
          Loaded: {{ Object.values(modelValue).filter((v) => v && v.trim()).length }} / {{ platforms.length }}
        </div>
      </div>

      <!-- Active Device Pane -->
      <div v-if="currentDevice" class="p-4 space-y-3">
        <!-- Subheader -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-zinc-800">
          <div class="flex items-center gap-2 text-xs">
            <span class="font-medium text-white capitalize">
              {{ currentDevice }} Page
            </span>
            <span
              v-if="modelValue[currentDevice]"
              class="text-[11px] font-mono text-zinc-400"
            >
              ({{ getContentSize(modelValue[currentDevice]) }})
            </span>
            <span v-else class="text-[11px] text-zinc-500">
              (Empty)
            </span>
          </div>

          <div class="flex items-center gap-1.5 text-xs">
            <!-- Mode switchers -->
            <div class="flex p-0.5 rounded bg-black border border-zinc-800 text-[11px]">
              <button
                type="button"
                @click="setActiveTab(currentDevice, 'paste')"
                :class="[
                  'px-2 py-0.5 rounded transition-colors',
                  (activeTab[currentDevice] || 'paste') === 'paste'
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-white'
                ]"
              >
                Code
              </button>
              <button
                type="button"
                @click="setActiveTab(currentDevice, 'upload')"
                :class="[
                  'px-2 py-0.5 rounded transition-colors',
                  activeTab[currentDevice] === 'upload'
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-white'
                ]"
              >
                Upload
              </button>
            </div>

            <!-- Preview -->
            <button
              v-if="modelValue[currentDevice]"
              type="button"
              @click="previewDevice = currentDevice"
              class="text-[11px] px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            >
              Preview
            </button>

            <!-- Sample -->
            <button
              type="button"
              @click="insertSample(currentDevice)"
              class="text-[11px] px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
            >
              Sample
            </button>

            <!-- Clear -->
            <button
              v-if="modelValue[currentDevice]"
              type="button"
              @click="clear(currentDevice)"
              class="text-[11px] px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Code Editor -->
        <div v-if="(activeTab[currentDevice] || 'paste') === 'paste'">
          <textarea
            :value="modelValue[currentDevice] || ''"
            @input="update(currentDevice, ($event.target as HTMLTextAreaElement).value)"
            placeholder="<!DOCTYPE html>&#10;<html>..."
            rows="8"
            class="w-full p-3 bg-black border border-zinc-800 rounded font-mono text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 leading-relaxed"
          ></textarea>
        </div>

        <!-- File Upload -->
        <div v-else>
          <div
            @dragover.prevent="isDragging[currentDevice] = true"
            @dragleave.prevent="isDragging[currentDevice] = false"
            @drop.prevent="onDrop(currentDevice, $event)"
            :class="[
              'border border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5',
              isDragging[currentDevice]
                ? 'border-white bg-zinc-900'
                : 'border-zinc-800 hover:border-zinc-600 bg-black'
            ]"
            @click="($refs[`fileInput_${currentDevice}`] as HTMLInputElement)?.click()"
          >
            <p class="text-xs text-zinc-300">
              Click or drag & drop HTML for <span class="capitalize font-semibold text-white">{{ currentDevice }}</span>
            </p>
            <p class="text-[11px] text-zinc-500">
              Max 5 MB (.html file)
            </p>
            <input
              :ref="`fileInput_${currentDevice}`"
              type="file"
              accept=".html,.htm,text/html"
              @change="onFileInputChange(currentDevice, $event)"
              class="hidden"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div
      v-if="previewDevice"
      class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
    >
      <div class="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div class="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between text-xs">
          <span class="font-medium text-white capitalize">
            Preview: {{ previewDevice }}
          </span>
          <button
            @click="previewDevice = null"
            class="text-zinc-400 hover:text-white"
          >
            Close
          </button>
        </div>
        <div class="flex-1 bg-white min-h-[400px]">
          <iframe
            :srcdoc="modelValue[previewDevice]"
            class="w-full h-full min-h-[400px] border-0"
            sandbox="allow-scripts"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>
