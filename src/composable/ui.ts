import ModalLeave from "../components/modal/Leave.vue";
import ModalShortcuts from "../components/modal/Shortcuts.vue";

import type { HxParticipant } from "../types/conference";
import {type SidebarKey, useUIState} from "./conferenceState.ts";
import {limitString} from "../helper/helper";
// import {createLogger} from "../helper/logger";
import {playSound} from "./sound.ts";

// const log = createLogger('HxMeet:UI')

// ------------------------
// Modals
// ------------------------
const openModal = async (modalComponent: any) => {
  const overlay = useOverlay()
  const modal = overlay.create(modalComponent)
  await modal.open()
}

export const useOpenLeaveModal = async () => {
  await openModal(ModalLeave)
};

export const useOpenShortcutsModal = async () => {
  await openModal(ModalShortcuts)
};

// ------------------------
// Sidebars
// ------------------------
export const useClickSidebarButton = (name: SidebarKey) => {
  const { sidebar, hideSidebar } = useUIState();
  if (sidebar.value === name) {
    hideSidebar();
  } else {
    sidebar.value = name;
  }
};

// ------------------------
// Toasts
// ------------------------
export const useAddParticipantToast = (hxParticipant: HxParticipant) => {
  const toast = useToast();
  const typeOfParticipant = hxParticipant.host ? "Host" : hxParticipant.test ? "Testparticipant" : "Participant";
  toast.add({ description: hxParticipant.name, title: typeOfParticipant + " joined", icon: "i-heroicons-user-plus" });
  playSound("join")
};

export const useRemoveParticipantToast = (hxParticipant: HxParticipant) => {
  const toast = useToast();
  const typeOfParticipant = hxParticipant.host ? "Host" : hxParticipant.test ? "Testparticipant" : "Participant";
  toast.add({ description: hxParticipant.name, title: typeOfParticipant + " left", icon: "i-heroicons-user-minus" });
  playSound("notification")
};

export const useMessageReceivedToast = (hxParticipant: HxParticipant, message: string) => {
  const toast = useToast();
  toast.add({
    description: limitString(message, 30),
    title: `Message from ${hxParticipant.name}`,
    icon: "i-heroicons-chat-bubble-bottom-center-text",
  });
};

export const useNoCameraToast = () => {
  const toast = useToast();
  toast.add({
    description: "Please connect a camera.",
    title: "No camera found",
    icon: "i-fluent-camera-off-24-regular",
  });
};

export const useNoMicrophoneToast = () => {
  const toast = useToast();
  toast.add({
    description: "Please connect a microphone.",
    title: "No microphone found",
    icon: "i-fluent-mic-off-24-regular",
  });
};
