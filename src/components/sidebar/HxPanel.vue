<template>
  <UCard
      class="absolute flex flex-col z-20 right-[10px] md:right-[24px]"
      variant="subtle"
      :ui="{ root: 'bg-default dark:bg-neutral-800 divide-none', body: 'grow overflow-auto overflow-x-clip' , header: 'py-2 md:py-4' }"
      style="height: calc(100% - 16px)"
      :style="{ width: sidebarWidth + 'px' }"
  >
    <template #header>
      <div class="flex justify-between items-center select-none">
        <span class="flex items-center gap-x-2">
          <span class="font-bold overflow-x-clip">{{ title }}</span>
          <UBadge v-if="badge" color="neutral" variant="outline">{{ badge }}</UBadge>
        </span>
        <UButton icon="i-heroicons-x-mark" size="sm" color="neutral" variant="ghost" @click="sidebar = ''" />
      </div>
    </template>
    <div ref="resizer" class="hover:bg-gray-300/50 absolute top-0 left-0 h-full w-1.5 cursor-col-resize"></div>
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import UCard from "@nuxt/ui/components/Card.vue";
import UBadge from "@nuxt/ui/components/Badge.vue";
import UButton from "@nuxt/ui/components/Button.vue";

import {useUIState} from "../../composable/conferenceState.ts";

defineProps({
  title: String,
  badge: String,
});

const { sidebar, sidebarWidth, sidebarResizing } = useUIState();
const resizer = ref()

onMounted(() => {
  dragElement(resizer.value);
});

const dragElement = (element: HTMLElement): void => {
  let startX: number;
  let startWidth: number;

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    startX = e.clientX;
    startWidth = sidebarWidth.value;
    sidebarResizing.value = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - startX;
    sidebarWidth.value = startWidth - dx;
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    sidebarResizing.value = false;
  };

  element.addEventListener('mousedown', onMouseDown);
}

</script>
