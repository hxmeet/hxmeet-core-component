<template>
  <HxPanel title="Chat">
    <div ref="scrollContainer" :class="{ 'select-none': sidebarResizing }">
      <transition-group name="list">
        <HxChatItem v-for="(m, idx) in messages" :key="idx" :sender="m.sender" :hide-sender="hideSenderForIdx(idx)">
          <div class="whitespace-pre-wrap text-ellipsis break-words overflow-hidden" v-html="m.message"></div>
        </HxChatItem>
      </transition-group>
    </div>
    <template #footer>
      <HxChatInput ref="chatInput" @sendMessage="sendMessage" @escape="hideSidebar" :loading="loading" />
    </template>
  </HxPanel>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, nextTick} from "vue";
import {log} from "../../helper/logger";
import HxChatItem from "./HxChatItem.vue";
import HxChatInput from "./HxChatInput.vue";
import HxPanel from "./HxPanel.vue";
import {useConferenceState, useUIState} from "../../composable/conferenceState.ts";
import {useSendMessage} from "../../composable/conferenceActions.ts";

const chatInput = ref();
const loading = ref(false);
const scrollContainer = ref();
const { hideSidebar } = useUIState();

const { messages, resetNewMessageCount } = useConferenceState();
const { sidebarResizing } = useUIState();

onMounted(() => {
  log.info("Chat mounted");
  resetNewMessageCount();
  scrollBottom();
});

const hideSenderForIdx = (idx: number) => {
  if (idx === 0) return false;
  const prevMessage = messages.value[idx - 1];
  return prevMessage.sender === messages.value[idx].sender;
}

const sendMessage = async (message: string) => {
  loading.value = true;
  await useSendMessage(message);
  chatInput.value.clearInput();
  loading.value = false;
};

watch(messages.value, () => {
  nextTick(scrollBottom);
});

const scrollBottom = () => {
  scrollContainer.value.parentNode.scrollTop = scrollContainer.value.parentNode.scrollHeight;
};
</script>

<style scoped>
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
