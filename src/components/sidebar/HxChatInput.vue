<template>
  <div class="relative">
    <div
        class="textarea overflow-hidden border border-gray-300 rounded text-sm p-2 pr-10"
        ref="messageInput"
        role="textbox"
        @input="refreshSendEnabled"
        @keydown.enter="enterListener"
        @keydown.escape="escapeListener"
        contenteditable="true"
    ></div>
    <UButton
        icon="i-heroicons-paper-airplane"
        size="xs"
        class="absolute right-2 bottom-[7px]"
        :ui="{ base: 'rounded-full' }"
        :color="sendEnabled ? 'primary' : 'neutral'"
        :variant="sendEnabled ? 'solid' : 'ghost'"
        @click="sendMessage"
        :loading="loading"
        :disabled="!sendEnabled"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import UButton from "@nuxt/ui/components/Button.vue";

const emit = defineEmits(['sendMessage', 'escape'])
defineProps<{
  loading: boolean
}>();

const messageInput = ref();
const sendEnabled = ref(false);

onMounted(() => {
  // do it here, Firefox does not support contentEditable="plaintext-only" in template
  messageInput.value.contentEditable = "plaintext-only";
});

const refreshSendEnabled = () => sendEnabled.value = messageInput.value?.innerText.trim() !== ""

const enterListener = (e: KeyboardEvent) => {
  if (e.shiftKey) return; // Shift is used for new line
  e.preventDefault(); // Prevent new line
  sendMessage();
};

const escapeListener = (e: KeyboardEvent) => {
  if (messageInput.value.innerText === "") {
    emit('escape')
  }
};

const sendMessage = async () => {
  if (sendEnabled.value) {
    emit('sendMessage', messageInput.value.innerText.trim())
  }
};

const clearInput = () => {
  messageInput.value.innerText = "";
  refreshSendEnabled()
}

defineExpose({
  clearInput
})
</script>

<style scoped>
.textarea[contenteditable]:empty::before {
  content: "Your message";
  color: #9ca3af;
}
</style>
