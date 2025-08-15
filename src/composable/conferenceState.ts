import {type Ref, ref, computed} from "vue"

import type {HxParticipant, ChatMessageUIItem, RoomConnectStatusKey, LayoutKey} from "../types/conference";
import {exampleNames} from "../helper/example";
import {defaultLayoutOption} from "../types/conference";
import {log} from "../helper/logger";
import {useTrackStore} from "./livekit.ts";
import {useLocalHxParticipant} from "./conferenceActions.ts";

// ---------------------------------------------------------------------
// Conference data
// ---------------------------------------------------------------------
const roomConnectStatus: Ref<RoomConnectStatusKey> = ref("");
const microphone: Ref<boolean> = ref(true);
const camera: Ref<boolean> = ref(true);
const loadingCamera: Ref<boolean> = ref(false);
const layout: Ref<LayoutKey> = ref(defaultLayoutOption);
const participants: Ref<HxParticipant[]> = ref([]);
const messages: Ref<ChatMessageUIItem[]> = ref([]);
const newMessageCount: Ref<number> = ref(0);

export const useConferenceState = () => {

  // ---------------------------------------------------------------------
  // Participants
  // ---------------------------------------------------------------------
  const testParticipants = computed(() => participants.value.filter((p) => p.test));
  const setTestParticipants = (count: number) => {
    participants.value = participants.value.filter(participant => !participant.test);
    for (let i = 0; i < count; i++) {
      participants.value.push({
        id: i + "",
        cameraMuted: false,
        microphoneMuted: false,
        noCamera: false,
        noMicrophone: false,
        reactions: [],
        name: exampleNames[i] ?? "",
        test: true
      });
    }
  }
  const setNoCamera = (enabled = false) => {
    const participant = useLocalHxParticipant()
    if (participant) {
      participant.noCamera = !enabled;
    }
    camera.value = enabled;
  }
  const setNoMicrophone = (enabled = false) => {
    const participant = useLocalHxParticipant()
    if (participant) {
      participant.noMicrophone = !enabled;
    }
    microphone.value = enabled;
  }
  const findParticipant = (id: string) => participants.value.find((p) => p.id === id);
  const localParticipantId = computed(() => useLocalHxParticipant()?.id);

  // ---------------------------------------------------------------------
  // Messages
  // ---------------------------------------------------------------------
  const increaseNewMessageCount = () => (newMessageCount.value += 1);
  const resetNewMessageCount = () => (newMessageCount.value = 0);

  const resetState = (status: RoomConnectStatusKey = "") => {
    const { resetTracks } = useTrackStore();
    log.info("resetState", status);
    resetTracks();
    participants.value = [];
    messages.value = [];
    resetNewMessageCount()
    roomConnectStatus.value = status;
    layout.value = defaultLayoutOption;
    microphone.value = true;
    camera.value = true;
    loadingCamera.value = false;
  }

  return {
    layout,
    microphone,
    camera, loadingCamera,
    participants,
    findParticipant,
    setNoCamera, setNoMicrophone,
    testParticipants,
    setTestParticipants,
    localParticipantId,
    messages,
    increaseNewMessageCount,
    resetNewMessageCount,
    newMessageCount,
    roomConnectStatus,
    resetState
  };
};

// ---------------------------------------------------------------------
// UI state data
// ---------------------------------------------------------------------
export type SidebarKey = "" | "chat" | "participants" | "downloads" | "info";

const sidebar: Ref<SidebarKey> = ref("");
const sidebarWidth = ref(336);
const sidebarResizing = ref(false);

export const useUIState = () => {
  const hideSidebar = () => (sidebar.value = "");
  const resetState = () => {
    hideSidebar();
  }
  return {
    sidebar, hideSidebar, sidebarWidth, sidebarResizing, resetState
  };
};
