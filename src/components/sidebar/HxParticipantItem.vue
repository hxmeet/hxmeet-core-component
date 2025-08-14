<template>
  <div
    class="participant flex items-center justify-between text-gray-700 dark:text-gray-200 py-1 px-4 my-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 group"
  >
    <div class="flex items-center">
      <UAvatar
          icon="i-heroicons-user-solid"
          size="sm"
          loading="lazy"
          class="mr-3"
      />
      <div>
        <Transition name="fade">
          <div v-if="nameVisible" class="text-sm font-bold text-gray-800 dark:text-gray-100">
            <span v-if="participant.id === localParticipantId" class="text-primary">You: </span>
            {{ participant.name }}
          </div>
        </Transition>
        <div class="text-sm text-gray-600 dark:text-gray-300">
          <span v-if="participant.test">Testparticipant</span>
          <span v-else>Participant</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import type { HxParticipant } from "../../types/conference";
import {useConferenceState} from "../../composable/conferenceState.ts";

const props = defineProps<{
  participant: HxParticipant;
}>();

const {localParticipantId} = useConferenceState();

const nameVisible = ref(true)
watch(() => props.participant, (newParticipant, oldParticipant) => {
  if (newParticipant.name === oldParticipant.name) return;
  nameVisible.value = false;
  setTimeout(() => {
    nameVisible.value = true;
  }, 10);
});

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>