<template>
  <UModal v-model:open="shortcutsModal" title="Keyboard shortcuts">
    <template #body>
      <table class="border-collapse table-fixed text-sm">
        <tbody class="">
        <tr v-for="item in data" :key="item.name" :class="{ 'border-b': item.border }">
  <!--          <td>-->
  <!--            <span v-if="item.host" class="text-gray-400">Only for host</span>-->
  <!--          </td>-->
          <td class="p-2 text-gray-600 dark:text-gray-400" >{{ item.name }}</td>
          <td class="p-2 pr-8">
            <UKbd v-for="shortcut in item.shortcut" :key="shortcut" class="mx-1">{{ shortcut }}</UKbd>
          </td>
        </tr>
        </tbody>
      </table>
    </template>
    <template #footer>
      <div class="w-full flex justify-end items-center gap-x-4">
        <UButton @click="shortcutsModal = false">Close</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import UButton from "@nuxt/ui/components/Button.vue";
import UModal from "@nuxt/ui/components/Modal.vue";
import UKbd from "@nuxt/ui/components/Kbd.vue";
import {useModal} from "../../composable/ui.ts";

const { shortcutsModal } = useModal();

const data = [
  { name: 'Microphone: switch off', host: false, shortcut: ['M'], border: false },
  // { name: 'Microphone: settings', host: false, shortcut: ['Shift-M'], border: true },
  { name: 'Camera: switch off', host: false, shortcut: ['C'], border: true },
  // { name: 'Camera: settings', host: false, shortcut: ['Shift-C'], border: true },
  { name: 'Open info pane', host: false, shortcut: ['1'], border: false },
  { name: 'Open participant pane', host: false, shortcut: ['2'], border: false },
  { name: 'Open chat pane', host: false, shortcut: ['3'], border: true },
  // { name: 'Open material pane', host: true, shortcut: ['4'], border: true },
  // { name: 'Navigate slides', host: true, shortcut: ['↑', '↓', '←', '→'], border: false},
  { name: 'Test participant: add & remove', host: true, shortcut: ['+', '-'], border: true},
  { name: 'Modus: Video round table', host: true, shortcut: ['R'], border: false},
  { name: 'Modus: Video grid', host: true, shortcut: ['G'], border: false},
  // { name: 'Modus: Presentation (Slides)', host: true, shortcut: ['P'], border: false},
  { name: 'Modus: Screensharing', host: true, shortcut: ['S'], border: false},
  // { name: 'Modus: Voting', host: true, shortcut: ['V'], border: false},
  // { name: 'Modus: Opinion canvas', host: true, shortcut: ['O'], border: true},
  { name: 'Toggle modes', host: true, shortcut: ['L'], border: true},
  // { name: 'Change topic', host: true ,shortcut: ['T'], border: false },
]
</script>
