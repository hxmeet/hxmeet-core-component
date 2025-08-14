<template>
  <span>
    <HxSelectButton
        id="info"
        text="Info"
        :kbds="['1']"
        icon="i-heroicons-information-circle"
    />
    <HxSelectButton
        id="participants"
        text="Participants"
        :kbds="['2']"
        icon="i-heroicons-users"
    />
    <HxSelectButton
        id="chat"
        text="Chat"
        :kbds="['3']"
        icon="i-heroicons-chat-bubble-bottom-center-text"
        :chip="newMessageCount > 0"
    />
  </span>
</template>

<script setup lang="ts">
import HxSelectButton from "./HxSelectButton.vue";
import {useConferenceState} from "../../composable/conferenceState.ts";

const { newMessageCount} = useConferenceState();
</script>
