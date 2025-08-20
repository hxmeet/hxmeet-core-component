<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <UIcon v-if="icon === 'exclamation'" name="i-heroicons-exclamation-triangle" class="text-red-500 w-12 h-12" />
    <UIcon v-else-if="icon === 'phone'" name="i-heroicons-phone-x-mark" class="text-red-500 w-12 h-12" />
    <UIcon v-else-if="icon === 'cameraOff'" name="i-fluent-camera-off-24-regular" class="text-red-500 w-12 h-12" />
    <div class="font-bold text-4xl mt-4">{{ title }}</div>
    <div class="text-lg text-center text-gray-600 dark:text-gray-100 mt-4 w-96">{{ description }}</div>
<!--    <UButton to="/" size="xl" color="primary" class="mt-8 mb-24">Back to home</UButton>-->
  </div>
</template>

<script setup lang="ts">
import UIcon from "@nuxt/ui/components/Icon.vue";

defineProps({
  icon: String,
  title: String,
  description: String,
})
</script>
