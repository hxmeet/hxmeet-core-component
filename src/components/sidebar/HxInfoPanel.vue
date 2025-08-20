<template>
    <HxPanel title="Info">
      <div class="text-sm" :class="{ 'select-none': sidebarResizing }">
      </div>
      <template #footer>
        <div class="flex justify-between items-center">
          <div class="my-0 md:my-2 text-sm text-gray-500">
            Developed by <a href="https://hxcode.io" target="_blank" class="text-primary-600 hover:underline">HxCode</a>
          </div>
          <div>
            <UDropdownMenu :items="helpItems" :popper="{ placement: 'bottom-start' }">
              <UTooltip text="Help">
                <UButton
                    icon="i-fluent-question-32-filled"
                    size="sm"
                    color="neutral"
                    variant="outline"
                    :ui="{ base: 'rounded-full' }"
                />
              </UTooltip>
            </UDropdownMenu>
          </div>
        </div>
      </template>
    </HxPanel>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import type { DropdownMenuItem } from '@nuxt/ui'
import UDropdownMenu from "@nuxt/ui/components/DropdownMenu.vue";
import UTooltip from "@nuxt/ui/components/Tooltip.vue";
import UButton from "@nuxt/ui/components/Button.vue";

import {useUIState} from "../../composable/conferenceState.ts";
import HxPanel from "./HxPanel.vue";

const { sidebarResizing } = useUIState();

const helpItems = ref<DropdownMenuItem[][]>([]);

onMounted(async () => {
  helpItems.value.push([
    { label: "Follow us for more news", icon: "i-hugeicons-new-twitter-ellipse", to: "https://x.com/hxmeet", target: "_blank" }
  ])
});

</script>
