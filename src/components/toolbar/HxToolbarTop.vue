<template>
  <div class="px-2 flex justify-between">
    <span class="flex items-center">
      {{ useRoomName() || 'HxMeet Conference' }}
    </span>
    <HxSelectGroup class="flex items-center"/>
  </div>
</template>

<script setup lang="ts">
import HxSelectGroup from "./HxSelectGroup.vue";
import {useRoomName} from "../../composable/livekit.ts";
</script>
