<template>
  <UDropdownMenu :items="modusItems" size="lg" >
    <HxRoundButton
        tooltip="Presentation modus"
        icon="i-heroicons-presentation-chart-bar"
        :loading="roomConnectStatus === 'connecting'"
        large
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import {computed} from "vue";
import type {DropdownMenuItem} from "@nuxt/ui/components/DropdownMenu.vue";
import HxRoundButton from "./HxRoundButton.vue";
import {useConferenceState} from "../../composable/conferenceState.ts";
import {useChangeLayout} from "../../composable/conferenceActions.ts";

const { roomConnectStatus, layout } = useConferenceState();

const modusItems = computed(() => [
  {
    type: 'checkbox',
    label: "Video round table",
    icon: "i-fluent-grid-circles-24-regular",
    kbds: ["R"],
    ui: { itemLabel: layout.value === "circle" ? 'font-bold' : '' },
    onSelect: () => useChangeLayout("circle")
  },
  {
    type: 'checkbox',
    label: "Video grid",
    icon: "i-fluent-grid-28-regular",
    kbds: ["G"],
    ui: { itemLabel: layout.value === "grid" ? 'font-bold' : '' },
    onSelect: () => useChangeLayout("grid")
  },
  {
    type: 'checkbox',
    label: "Screensharing",
    icon: "i-heroicons-computer-desktop",
    kbds: ["S"],
    ui: { itemLabel: layout.value === "screenshare" ? 'font-bold' : '' },
    onSelect: () => useChangeLayout("screenshare")
  }
] as DropdownMenuItem[]);
</script>

<style scoped>
</style>