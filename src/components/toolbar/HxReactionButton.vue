<template>
  <UPopover v-model:open="reactionsOpen"
            :content="{ align: 'center', side: 'top', sideOffset: 12 }"
            :ui="{ content: 'bg-white dark:bg-zinc-800', arrow: 'fill-(--color-white) dark:fill-zinc-800' }"
            arrow>
    <HxRoundButton tooltip="Reaction" icon="i-heroicons-face-smile"/>
    <template #content>
      <div class="p-1 md:p-4" @mouseout="checkMouseOut" ref="reactionPopover">
        <UButton
            v-for="(r, idx) in reactions" :key="idx"
            size="xl"
            variant="ghost"
            class="text-2xl md:text-3xl lg:text-4xl"
            @click="sendReaction(r)"
            :label="r"
        />
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import {ref} from "vue";
import HxRoundButton from "./HxRoundButton.vue";
import {useThrottledSendReaction} from "../../composable/conferenceActions.ts";

const reactionsOpen = ref(false);
const reactions = ["👏", "😂", "👍", "👎", "🙏", "❤️️"]; // https://dreamyguy.github.io/react-emojis/
const reactionPopover = ref()
const checkMouseOut = (evt: MouseEvent) => {
  if (!reactionPopover.value?.contains(evt.relatedTarget as Node)) {
    reactionsOpen.value = false;
  }
}
const sendReaction = (emoji: string) => {
  useThrottledSendReaction(emoji);
}
</script>
