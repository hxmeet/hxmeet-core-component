<template>
  <HxPanel title="Participants" :badge="badge">
    <div class="-mt-4 -mx-4" :class="{ 'select-none': sidebarResizing }">
      <transition-group name="list">
        <HxParticipantItem v-for="p in listParticipant" :key="p.id" :participant="p" />
        <hr v-if="listParticipant.length > 0 && listTest.length > 0" class="mx-4" />
        <HxParticipantItem v-for="p in listTest" :key="p.id" :participant="p" />
      </transition-group>
    </div>
    <template #footer>
      <HxTestParticipants/>
    </template>
  </HxPanel>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useConferenceState, useUIState} from "../../composable/conferenceState.ts";
import HxPanel from "./HxPanel.vue";
import HxParticipantItem from "./HxParticipantItem.vue";
import HxTestParticipants from "./HxTestParticipants.vue";
const { participants } = useConferenceState();
const { sidebarResizing } = useUIState();

const badge = computed(() => {
  return participants.value.length > 1 ? participants.value.length + '' : '';
});

const listParticipant = computed(() => participants.value.filter((p) => !p.test));
const listTest = computed(() => participants.value.filter((p) => p.test));
</script>

<style scoped>
  /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
