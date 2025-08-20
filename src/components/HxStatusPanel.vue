<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <HxExclamationIcon v-if="icon === 'exclamation'" class="text-red-500 w-24 h-24" />
    <HxPhoneXIcon v-else-if="icon === 'phone'" class="text-red-500 w-24 h-24" />
    <HxCameraOffIcon v-else-if="icon === 'cameraOff'" class="text-red-500 w-24 h-24" />
    <div class="font-bold text-4xl mt-4">{{ title }}</div>
    <div class="text-lg text-center text-gray-600 dark:text-gray-100 mt-4 w-96">{{ description }}</div>
<!--    <UButton to="/" size="xl" color="primary" class="mt-8 mb-24">Back to home</UButton>-->
  </div>
</template>

<script setup lang="ts">
import HxPhoneXIcon from "./icons/HxPhoneXIcon.vue";
import HxCameraOffIcon from "./icons/HxCameraOffIcon.vue";
import HxExclamationIcon from "./icons/HxExclamationIcon.vue";

defineProps({
  icon: String,
  title: String,
  description: String,
})
</script>
