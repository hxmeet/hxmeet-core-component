<template>
  <div class="flex items-center justify-between gap-x-3">
    <div v-if="limitReached" class="flex items-center gap-x-3 text-sm text-gray-500">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5"/>
      Participant limit reached
    </div>
    <UTooltip v-else text="Add test participant" :kbds="['+']" class="w-full" :popper="{ placement: 'top' }">
      <UButton icon="i-heroicons-user-plus" size="sm" color="neutral" variant="outline" class="flex-1" block @click="useAddTestParticipant()">
        Add test participant
      </UButton>
    </UTooltip>
    <UTooltip text="Remove test participant" :kbds="['-']" :popper="{ placement: 'top' }">
      <UButton icon="i-heroicons-user-minus" size="sm" color="neutral" variant="outline" @click="useRemoveTestParticipant()"/>
    </UTooltip>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import UIcon from "@nuxt/ui/components/Icon.vue";
import UTooltip from "@nuxt/ui/components/Tooltip.vue";
import UButton from "@nuxt/ui/components/Button.vue";

import {useConferenceState} from "../../composable/conferenceState.ts";
import {useAddTestParticipant, useRemoveTestParticipant} from "../../composable/conferenceActions.ts";

const { participants } = useConferenceState();

//TODO externalize the number of max participants
const limitReached = computed(() => participants.value.length >= 15);
</script>
