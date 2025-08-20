<template>
  <div class="w-full h-full relative group" :style="layoutStyles.container" ref="container">
    <video v-if="participant.test" :src="'https://hxmeet.io/videos/' + ((idx % 11) + 1) + '.mp4'" autoplay loop muted playsinline webkit-playsinline
         class="w-full h-full object-cover rounded-full hover:shadow-[0_0px_20px_0px_rgba(144,137,252,1)] shadow-[0_0px_10px_0px_rgba(144,137,252,0.5)]"
         :style="layoutStyles.videoElement"
         draggable="false"
    ></video>
    <video v-else autoplay muted playsinline webkit-playsinline :class="{ 'visible': !participant.cameraMuted, 'invisible': participant.cameraMuted }"
         class="w-full h-full object-cover rounded-full bg-white hover:shadow-[0_0px_20px_0px_rgba(144,137,252,1)] shadow-[0_0px_10px_0px_rgba(144,137,252,0.5)]"
         :style="layoutStyles.videoElement"
         draggable="false" ref="video"
    ></video>
    <div v-if="participant.cameraMuted"
         class="flex justify-center items-center absolute top-0 w-full h-full object-cover bg-white rounded-full hover:shadow-[0_0px_20px_0px_rgba(144,137,252,1)] shadow-[0_0px_10px_0px_rgba(144,137,252,0.5)]"
         :style="layoutStyles.videoElement"
    >
      <HxCameraOffIcon class="text-gray-300 w-12 h-12"/>
    </div>
    <TransitionGroup name="fly" @after-enter="endReaction" @enter-cancelled="endReaction">
      <template v-for="reaction in participant.reactions" :key="reaction.id">
        <div class="absolute bottom-[8%] -translate-x-1/2 text-2xl md:text-3xl lg:text-5xl" style="text-shadow: 0 0 10px white;" :data-id="reaction.id" :style="{ left: 40 + (reaction.id % 10 * 2) + '%' }">
          {{ reaction.emoji }}
        </div>
      </template>
    </TransitionGroup>
    <div :class="{ hidden: !showName }"
         class="group-hover:inline-block absolute bottom-[2%] -translate-x-1/2 left-[50%] text-sm text-center bg-gray-700/50 text-white rounded-xl py-1 px-2">
      <div v-if="loading" class="dotContainer">
        <span class="dot" v-for="n in 3" :key="n">.</span>
      </div>
      <span v-else class="flex items-center gap-x-1" :class="{ 'cursor-pointer': isLocalParticipant }">
        <span>
          {{ participant.name }}
        </span>
        <HxMicMutedIcon v-if="participant.microphoneMuted" class="h-5 w-5 inline-block" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch, nextTick} from "vue";
import type { HxParticipant, LayoutStyleItem } from "../../types/conference";
import type { Track } from "livekit-client";
import { log } from "../../helper/logger";
import HxMicMutedIcon from "../icons/HxMicMutedIcon.vue"
import HxCameraOffIcon from "../icons/HxCameraOffIcon.vue"
import {useConferenceState} from "../../composable/conferenceState.ts";
import {useTrackStore} from "../../composable/livekit.ts";

const props = defineProps<{
  participant: HxParticipant,
  idx: number,
  layoutStyles: LayoutStyleItem,
}>();

const { localParticipantId } = useConferenceState();
const { audioTracks, videoTracks } = useTrackStore();

const video = ref();
const loading = ref(!props.participant.test);

const endReaction = (el: Element) => {
  props.participant.reactions = props.participant.reactions.filter(r => r.id.toString() !== (el as HTMLElement).dataset.id);
}
const showName = computed(() => props.participant.cameraMuted || props.participant.noCamera || props.participant.microphoneMuted);
const isLocalParticipant = computed(() => props.participant.id === localParticipantId.value);

watch(() => props.participant.noCamera, () => {
  if (props.participant.noCamera) {
    loading.value = false;
  }
});
watch(() => props.participant.noMicrophone, () => {
  if (props.participant.noMicrophone) {
    loading.value = false;
  }
});

let audioSID: string | undefined;
let videoSID: string | undefined;

onMounted(() => {
  log.info('Mounted participant', { participantId: props.participant.id });
  watch(audioTracks, () => {
    const audioTrack = audioTracks[props.participant.id];
    if (audioTrack && audioTrack.sid !== audioSID) {
      audioSID = audioTrack.sid;
      attach(audioTrack);
    }
  }, { immediate: true });
  watch(videoTracks, () => {
    log.info('Watch videoTracks', videoTracks.value)
    const videoTrack = videoTracks[props.participant.id];
    if (videoTrack && videoTrack.sid !== videoSID) {
      videoSID = videoTrack.sid;
      attach(videoTrack);
    }
  }, { immediate: true });
});

const attach = (track: Track) => {
  log.info('Attach a new track', { type: track.kind, sid: track.sid });
  loading.value = false;
  track.detach();
  nextTick(() => {
    track.attach(video.value);
  });
}

</script>

<style>
@keyframes bounce {
  0% { opacity: 1; transform: translateX(-50%) translateY(0); }
  5% { opacity: 1; transform: translateX(-50%) translateY(-30%); }
  10% { opacity: 1; transform: translateX(-50%) translateY(0); }
  15% { opacity: 1; transform: translateX(-50%) translateY(-30%); }
  20% { opacity: 1; transform: translateX(-50%) translateY(0); }
  25% { opacity: 1; transform: translateX(-50%) translateY(-30%); }
  30% { opacity: 1; transform: translateX(-50%) translateY(0); }
  35% { opacity: 1; transform: translateX(-50%) translateY(-30%); }
  40% { opacity: 1; transform: translateX(-50%) translateY(0); }
  45% { opacity: 1; transform: translateX(-50%) translateY(-30%); }
  50% { opacity: 1; transform: translateX(-50%) translateY(0); }
  55% { opacity: 1; transform: translateX(-50%) translateY(-30%); }
  60% { opacity: 1; transform: translateX(-50%) translateY(0); }
  65% { opacity: 1; transform: translateX(-50%) translateY(-30%); }
  70% { opacity: 1; transform: translateX(-50%) translateY(0); }
  75% { opacity: 1; transform: translateX(-50%) translateY(-30%); }
  80% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0;transform: translateX(-50%) translateY(-200%); }
}
.bounce-enter-active {
  animation: bounce 10s;
}
.bounce-leave-active {
  opacity: 0
}

@keyframes fly {
  0% { opacity: 1; transform: translateX(-50%) translateY(0); }
  75% { opacity: 1; transform: translateX(-50%) translateY(-375%); }
  100% { opacity: 0;transform: translateX(-50%) translateY(-500%); }
}
.fly-enter-active {
  animation: fly 5s linear;
}
.fly-leave-active {
  opacity: 0
}

.dotContainer {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.dot {
  animation: moveUp 0.3s infinite alternate;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.1s;
}

.dot:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes moveUp {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-4px);
  }
}
</style>