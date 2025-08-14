<template>
  <UDropdownMenu :items="settingsItems" size="lg" :content="{ align: 'start', side: 'top' }">
    <HxRoundButton tooltip="Settings" icon="i-heroicons-cog-8-tooth" />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type {DropdownMenuItem} from "@nuxt/ui";
import HxRoundButton from "./HxRoundButton.vue";
import {useOpenShortcutsModal} from "../../composable/ui.ts";
import {useColorMode, useThrottleFn} from "@vueuse/core";
import {useAddTestParticipant, useRemoveTestParticipant, useToggleLayout} from "../../composable/conferenceActions.ts";

const keyboardItem:DropdownMenuItem = {
  label: "Keyboard shortcuts",
  icon: "i-fluent-keyboard-24-regular",
  "class": "hidden lg:flex",
  onSelect: useOpenShortcutsModal
}

const addTestParticipantItem:DropdownMenuItem = {
  label: "Add test participant", icon: "i-heroicons-user-plus", kbds: ["+"],
  onSelect: (evt: Event) => {
    evt.preventDefault(); // do not close the dropdown menu
    useAddTestParticipant();
  }
}
const removeTestParticipantItem:DropdownMenuItem = {
  label: "Remove test participant", icon: "i-heroicons-user-minus", kbds: ["-"],
  onSelect: (evt: Event) => {
    evt.preventDefault(); // do not close the dropdown menu
    useRemoveTestParticipant();
  }
}

const throttledToggleLayout = useThrottleFn(() => {
  useToggleLayout();
}, 100);

const layoutItem:DropdownMenuItem = {
  label: "Toggle modes",
  icon: "i-heroicons-squares-2x2",
  kbds: ["L"],
  onSelect: throttledToggleLayout
}

const colorMode = useColorMode()
const colorItem:DropdownMenuItem = {
  label: "Switch color mode",
  icon: "i-heroicons-sun",
  onSelect: () => (colorMode.value = colorMode.value === "dark" ? "light" : "dark")
}

const settingsItems = [
  [colorItem, keyboardItem],
  [addTestParticipantItem, removeTestParticipantItem],
  [layoutItem]
];
</script>
