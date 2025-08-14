<template>
  <UTooltip :text="tooltip" :disabled="tooltip === '' && kbds !== undefined" :kbds="kbds">
    <UButton
        size="xl"
        :icon="icon"
        color="neutral"
        variant="outline"
        :ui="ui"
        :loading="loading"
        @click="emit('click', $event)"
        v-bind="moreAttrs"
    />
  </UTooltip>
</template>

<script setup lang="ts">
import {computed} from "vue";
import type {KbdProps} from "@nuxt/ui/components/Kbd.vue";

export interface HxRoundButtonProps {
  tooltip?: string,
  kbds?: (string | undefined)[] | KbdProps[] | undefined,
  icon?: string,
  label?: string,
  large?: boolean,
  loading?: boolean,
}

const props = defineProps<HxRoundButtonProps>()

const emit = defineEmits(['click'])

const ui = computed(() => {
  return {
    base: `${props.large ? 'px-4 py-4' : ''} rounded-full`,
    leadingIcon: props.large ? "size-9": ""
  }
})

const moreAttrs = computed(() => {
  const attrs: Record<string, string> = {}
  // with label = "" we get an extra space and the button ist not round
  if (props.label !== undefined && props.label !== "") attrs.label = props.label
  return attrs
})
</script>
