<template>
  <UModal title="Leave conference?">
    <template #footer>
      <div class="w-full flex justify-end items-center gap-x-4">
        <UButton variant="ghost" color="neutral" @click="emit('close', false)">Cancel</UButton>
        <UButton @click="leaveClick">Leave</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import {useLeaveConference} from "../../composable/conferenceActions.ts";

const emit = defineEmits<{ close: [boolean] }>();

const leaveClick = async () => {
  await useLeaveConference("end")
  emit('close', true)
}
</script>
