<template>
  <UApp :tooltip="{ delayDuration: 0 }">
    <HxMeeting v-bind="meetingProps"/>
  </UApp>
</template>

<script setup lang="ts">
import type {HxMeetingProps} from "./components/HxMeeting.vue";
import type {HxMeetingStatus} from "@/types/conference.ts";
const params = new URLSearchParams(window.location.search)

const meetingProps: HxMeetingProps = {
  livekitUrl: params.get("livekitUrl") || import.meta.env.VITE_LIVEKIT_URL,
  livekitToken: params.get("livekitToken")  || import.meta.env.VITE_LIVEKIT_TOKEN,
  extensions: {
    'sidebar.info.body': "Hallo"
  },
  events: {
    'status': (status: HxMeetingStatus): void => {
      console.log('Listener status changed', status)
    }
  }
}

</script>