<template>
  <div class="h-full overflow-hidden">
    <transition name="page">
      <HxStatusPanel
          v-if="roomConnectStatus === 'failed'"
          icon="exclamation"
          title="Can't connect to conference"
          description="The conference room was not found or there are network problems."
      />
      <HxStatusPanel
          v-else-if="roomConnectStatus === 'noDevices'"
          icon="cameraOff"
          title="No devices found"
          description="Hey, this is a video conference! Connect a camera."
      />
      <HxStatusPanel
          v-else-if="roomConnectStatus === 'end'"
          icon="phone"
          title="Conference ended"
          description="The conference has been ended by the host. Thank you for your participation."
      />
    </transition>
    <template v-if="roomConnectStatus === 'connecting' || roomConnectStatus === 'connected'">
      <div class="md:hidden absolute z-10 w-full h-[var(--top-bar-height)]">
        <HxToolbarTop class="w-full h-full"/>
      </div>
      <div class="relative mt-[var(--top-bar-height)] md:mt-0 w-full h-[calc(100%-var(--bottom-bar-height)-var(--top-bar-height))] md:h-[calc(100%-var(--bottom-bar-height))]">
        <HxSidebarPanel class="absolute w-full h-full"/>
        <HxStagePanel class="absolute w-full h-full"/>
      </div>
      <HxToolbar class="w-full h-[var(--bottom-bar-height)]"/>
    </template>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted} from "vue";
import HxToolbarTop from "./toolbar/HxToolbarTop.vue";
import HxToolbar from "./toolbar/HxToolbar.vue";
import HxSidebarPanel from "./HxSidebarPanel.vue";
import {onBeforeMount} from "vue";
import {provideLivekitConfig} from "../composable/livekit.ts";
import {useConferenceState, useUIState} from "../composable/conferenceState.ts";
import {
  useAddTestParticipant, useChangeLayout,
  useEnterConference,
  useLeaveConference, useRemoveTestParticipant,
  useToggleCamera, useToggleLayout, useToggleMicrophone
} from "../composable/conferenceActions.ts";
import HxStatusPanel from "../components/HxStatusPanel.vue";
import {useClickSidebarButton} from "../composable/ui.ts";
import {useThrottleFn} from "@vueuse/core";
import HxStagePanel from "./stage/HxStagePanel.vue";

const { hideSidebar } = useUIState();
const overlay = useOverlay()

export interface HxMeetingProps {
  livekitUrl: string,
  livekitToken: string,
}

const props = defineProps<HxMeetingProps>()

onBeforeMount(() => {
  provideLivekitConfig(
      props.livekitUrl,
      props.livekitToken
  )
})

/**
 * --------------------------------------
 * This is the central conference layout:
 * --------------------------------------
 * - top bar:          visible only on smaller screens
 * - central canvas:   area for the main content, sidebars and content (participant videos)
 * - bottom toolbar:   conferencing tools
 *
 * the page takes the full browser dimension
 * top and bottom bars using CSS variables for its heights
 */

const { roomConnectStatus } = useConferenceState();

onMounted(async () => {
  // if (!localStorage.getItem("name")) {
  //   await useOpenNameModal()
  // } else {
    await useEnterConference();
  // }
});

onUnmounted(() => {
  useLeaveConference();
});

const throttledToggleLayout = useThrottleFn(() => {
  useToggleLayout();
}, 100);

defineShortcuts({
  escape: () => {
    hideSidebar();
    overlay.closeAll();
  },
  "1": () => useClickSidebarButton("info"),
  "2": () => useClickSidebarButton("participants"),
  "3": () => useClickSidebarButton("chat"),
  "+": () => useAddTestParticipant(),
  "-": () => useRemoveTestParticipant(),
  C: () => useToggleCamera(),
  M: () => useToggleMicrophone(),
  L: () => throttledToggleLayout(),
  R: () => useChangeLayout('circle'),
  G: () => useChangeLayout('grid'),
  S: () => useChangeLayout('screenshare')
});
</script>

<style>
html,
body,
body {
  @apply h-full;
}

#app, #__nuxt {
  @apply h-full;
}

</style>