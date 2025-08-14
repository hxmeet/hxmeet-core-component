<template>
  <div class="mb-3 text-sm">
    <div class="flex items-center justify-between">
      <div class="flex items-start">
        <div class="h-6 mr-2 flex items-center" :class="{ invisible: hideSender }">
          <UAvatar
              icon="i-heroicons-user-solid"
              size="sm"
              loading="lazy"
          />
        </div>
        <div>
          <div v-if="!hideSender" class="h-6 flex items-center">
            <span class="font-bold">{{ sender.name }}</span>
          </div>
          <div class="text-gray-600 dark:text-gray-300 chat">
            <slot/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {HxParticipant} from "../../types/conference";

defineProps<{
  sender: HxParticipant
  hideSender: boolean
}>();
</script>
