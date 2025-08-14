<template>
  <div class="flex px-4 md:px-6">
    <span class="hidden md:flex w-1/3 items-center">
      {{ useRoomName() || 'HxMeet Conference' }}
    </span>
    <div class="w-full md:w-1/3 pb-1.5 flex gap-x-2 justify-center items-center">
      <HxRoundButton
          :icon="microphone ? 'i-fluent-mic-24-regular' : 'i-fluent-mic-off-24-regular'"
          tooltip="Switch microphone" :kbds="['M']"
          @click="useToggleMicrophone"
      />
      <HxRoundButton
          :icon="camera ? 'i-fluent-camera-24-regular' : 'i-fluent-camera-off-24-regular'"
          tooltip="Switch camera" :kbds="['C']"
          @click="useToggleCamera"
      />
      <HxReactionButton/>
      <HxModusButton/>
      <HxSettingsButton/>
      <HxRoundButton
          tooltip="Leave conference"
          label="Leave"
          icon="i-heroicons-phone-x-mark"
          @click="useOpenLeaveModal()"
      />
    </div>
    <HxSelectGroup class="hidden md:flex w-1/3 gap-x-0 lg:gap-x-2 items-center justify-end"/>
  </div>
</template>

<script setup lang="ts">
import HxRoundButton from "./HxRoundButton.vue";
import HxSettingsButton from "./HxSettingsButton.vue";
import HxModusButton from "./HxModusButton.vue";
import HxReactionButton from "./HxReactionButton.vue";
import {useOpenLeaveModal} from "../../composable/ui.ts";
import HxSelectGroup from "../../components/toolbar/HxSelectGroup.vue";
import {useConferenceState} from "../../composable/conferenceState.ts";
import {useToggleCamera, useToggleMicrophone} from "../../composable/conferenceActions.ts";
import {useRoomName} from "../../composable/livekit.ts";

const { microphone, camera } = useConferenceState();
</script>
