<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "../composables/useToast";

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
    label?: string;
  }>(),
  {
    language: "php",
    label: undefined,
  }
);

const copied = ref(false);
const { success } = useToast();

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    success("Copied to clipboard");
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    const el = document.getElementById("code-fallback");
    if (el) {
      const range = document.createRange();
      range.selectNodeContents(el);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  }
}
</script>

<template>
  <div class="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 font-mono text-xs">
    <!-- Header -->
    <div class="px-3.5 py-2 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-zinc-400 font-sans font-medium text-[11px]">
          {{ label || language }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[10px] text-zinc-500 uppercase tracking-wider">
          {{ language }}
        </span>
        <button
          type="button"
          @click="copy"
          class="text-[11px] font-sans font-medium px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
        >
          {{ copied ? "Copied" : "Copy" }}
        </button>
      </div>
    </div>

    <!-- Code Content -->
    <pre id="code-fallback" class="p-3.5 overflow-x-auto text-zinc-200 leading-relaxed"><code>{{ code }}</code></pre>
  </div>
</template>
