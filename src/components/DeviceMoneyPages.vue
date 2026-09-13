<script setup lang="ts">
const props = defineProps<{
  modelValue: Record<string, string>;
  platforms: string[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, string>): void;
}>();

function update(device: string, value: string) {
  emit("update:modelValue", { ...props.modelValue, [device]: value });
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="platforms.length === 0" class="text-sm text-gray-400">
      Please select at least one platform above to configure money pages.
    </div>
    <div v-for="device in platforms" :key="device" class="flex gap-3 items-center">
      <span class="w-24 text-sm text-gray-400 capitalize">
        {{ device }}
      </span>
      <input
        type="url"
        :value="modelValue[device] || ''"
        @input="update(device, ($event.target as HTMLInputElement).value)"
        :placeholder="`https://offer.example.com/${device}/`"
        class="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100"
      />
    </div>
  </div>
</template>
