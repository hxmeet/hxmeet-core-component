<template>
  <div class="w-full h-full absolute top-0 mt-2 flex justify-center" style="height: 79%">
    <video autoplay muted playsinline webkit-playsinline class="w-full h-full object-contain bg-transparent"
           draggable="false" ref="video"
    ></video>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, nextTick} from "vue";
import type { Track } from "livekit-client";
import { log } from "../../helper/logger";
import {useTrackStore} from "../../composable/livekit.ts";

const { screenshareAudioTrack, screenshareVideoTrack } = useTrackStore();
const video = ref();
let audioSID: string | undefined;
let videoSID: string | undefined;

onMounted(() => {
  log.info('Screenshare mounted')
  watch(screenshareAudioTrack, () => {
    if (screenshareAudioTrack.value?.sid !== audioSID) {
      audioSID = screenshareAudioTrack.value?.sid;
      attach(screenshareAudioTrack.value);
    }
  }, { immediate: true });
  watch(screenshareVideoTrack, () => {
    if (screenshareVideoTrack.value?.sid !== videoSID) {
      videoSID = screenshareVideoTrack.value?.sid;
      attach(screenshareVideoTrack.value);
    }
  }, { immediate: true });
});

const attach = (track: Track | undefined) => {
  log.info('Attach screenshare track', track)
  if (track === undefined) return;
  nextTick(() => {
    track.attach(video.value);
  });
}
</script>
