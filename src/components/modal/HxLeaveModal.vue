<template>
  <UModal v-model:open="leaveModal" title="Leave conference?">
    <template #footer>
      <div class="w-full flex justify-end items-center gap-x-4">
        <UButton variant="ghost" color="neutral" @click="leaveModal = false">Cancel</UButton>
        <UButton @click="leaveClick">Leave</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import UButton from "@nuxt/ui/components/Button.vue";
import UModal from "@nuxt/ui/components/Modal.vue";
import {useLeaveConference} from "../../composable/conferenceActions.ts";
import {useModal} from "../../composable/ui.ts";

const { leaveModal } = useModal();

const leaveClick = async () => {
  await useLeaveConference("end")
  leaveModal.value = false
}
</script>
