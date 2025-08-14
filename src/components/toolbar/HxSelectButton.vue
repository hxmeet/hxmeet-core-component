<template>
  <UTooltip :text="text" :kbds="kbds">
    <UChip size="2xl" inset :show="chip">
      <UButton
          size="xl"
          :icon="icon"
          :color="selected ? 'primary' : 'neutral'"
          :ui="{ base: 'rounded-full' }"
          :variant="selected ? 'solid' : 'ghost'"
          @click="useClickSidebarButton(id)"
      />
    </UChip>
  </UTooltip>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {type SidebarKey, useUIState} from "../../composable/conferenceState.ts";
import {useClickSidebarButton} from "../../composable/ui.ts";

const props = defineProps<{
  id: SidebarKey,
  text: string,
  kbds: Array<any>,
  icon: string,
  chip?: boolean
}>()
const {sidebar} = useUIState();
const selected = computed(() => sidebar.value === props.id)
</script>
