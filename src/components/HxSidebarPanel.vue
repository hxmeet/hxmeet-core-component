<template>
  <div class="flex items-start justify-between px-2 md:px-6 py-2">
    <transition name="tool">
      <HxInfoPanel v-if="sidebar === 'info'" />
      <HxParticipantsPanel v-else-if="sidebar === 'participants'" />
      <HxChatPanel v-else-if="sidebar === 'chat'" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import {useUIState} from "../composable/conferenceState.ts";
import HxInfoPanel from "./sidebar/HxInfoPanel.vue";
import HxParticipantsPanel from "./sidebar/HxParticipantsPanel.vue";
import HxChatPanel from "./sidebar/HxChatPanel.vue";

const { sidebar } = useUIState();
</script>

<style scoped>
.tool-enter-from {
  transform: translateX(100%);
}
.tool-leave-to {
  transform: translateX(100%);
}

.tool-enter-to {
  transform: translateX(0);
}
.tool-leave-from {
  transform: translateX(0);
}

.tool-enter-active {
  transition: all 0.3s ease;
}
.tool-leave-active {
  transition: all 0.3s ease;
}
.tool-move {
  transition: all 0.3s ease;
}
</style>