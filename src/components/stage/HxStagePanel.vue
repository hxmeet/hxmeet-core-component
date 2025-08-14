<template>
  <div ref="conferenceCanvas" class="w-full h-full">
    <HxVideo
        v-for="(participant, idx) in participants"
        :idx="idx"
        :participant="participant"
        :key="participant.id"
        :fake="false"
        class="participant"
        :layoutStyles="getVideoPositionStyle(idx)"
    />
    <HxVideo
        v-if="roomConnectStatus === ''"
        :idx="0"
        :participant="fakeParticipant"
        :key="0"
        :fake="true"
        class="participant"
        :layoutStyles="getVideoPositionStyle(0)"
    />
    <transition name="material">
      <template v-if="layout === 'screenshare'">
        <HxScreenshare/>
      </template>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {ref, onUnmounted, watch} from "vue";
import HxVideo from "./HxVideo.vue";
import HxScreenshare from "./HxScreenshare.vue";
import { log } from "../../helper/logger";
import type { HxParticipant, LayoutStyleItem } from "../../types/conference";
import {useConferenceState} from "../../composable/conferenceState.ts";
import {calcCinemaLayout, calcCircleLayout, calcGridLayout} from "../../helper/layout.ts";

const { roomConnectStatus, participants, layout } = useConferenceState();

const fakeParticipant = {
  id: "fake",
  name: "...",
  test: false,
  host: false
} as HxParticipant

const conferenceCanvas = ref(null);
const canvasDim = ref({ width: 400, height: 400 });
let observer: ResizeObserver | undefined = undefined;

watch(conferenceCanvas, () => {
  if (conferenceCanvas.value) {
    observer = new ResizeObserver((entries) => {
      if (entries.length > 0 && entries[0]) {
        const entry = entries[0];
        const { width, height } = entry.contentRect;
        canvasDim.value.height = height;
        canvasDim.value.width = width;
      }
    });
    observer.observe(conferenceCanvas.value);
  } else {
    log.error("No canvas element found");
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

const getVideoPositionStyle = (index: number): LayoutStyleItem => {
  // This function calculates the position of each video in the conference canvas
  // Will be called everytime canvasDim or participants change, like a computed property

  const total = roomConnectStatus.value === '' ? 1 : participants.value.length;
  if (layout.value === 'grid') {
    return calcGridLayout(index, total, canvasDim.value.width, canvasDim.value.height);
  } else if (layout.value === 'screenshare') {
    return calcCinemaLayout(index, total, canvasDim.value.width, canvasDim.value.height);
  }
  return calcCircleLayout(index, total, canvasDim.value.width, canvasDim.value.height);
};

</script>

<style scoped>
.participant {
  transition: all 0.3s ease;
}

.material-enter-active,
.material-leave-active {
  transition: all 0.3s ease;
}

.material-enter-from,
.material-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.material-enter-to,
.material-leave-from {
  opacity: 1;
  transform: translateY(0);
}

</style>