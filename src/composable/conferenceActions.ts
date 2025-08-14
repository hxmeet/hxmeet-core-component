import type {HxParticipant, LayoutKey, RoomConnectStatusKey} from "../types/conference";
import {useDebounceFn, useThrottleFn} from '@vueuse/core'
import {convertLinksToAnchorTags, escapeHtml} from "../helper/helper";
import {defaultLayoutOption, layoutOptions} from "../types/conference";
import {log} from "../helper/logger";
import {useConferenceState, useUIState} from "./conferenceState.ts";
import {useMessageReceivedToast} from "./ui.ts";
import {playSound} from "./sound.ts";
import {
  switchCameraLivekit,
  switchMicrophoneLivekit,
  switchScreenshareLivekit,
  useChangeNameLivekit,
  useConnectLivekit,
  useDisconnectLivekit,
  useLocalLivekitParticipant,
  useSendLayoutLivekit,
  useSendMessageLivekit,
  useSendReactionLivekit,
  useSendTestParticipants
} from "./livekit.ts";

export const useEnterConference = async () => {
  log.info("Enter conference");
  const { roomConnectStatus } = useConferenceState();
  roomConnectStatus.value = "";
  await useConnectLivekit();
};

export const useLeaveConference = async (status: RoomConnectStatusKey = "") => {
  log.info("Leave conference");
  await useDisconnectLivekit();
  const { resetState } = useConferenceState();
  resetState(status);
};

export const useToggleLayout = async () => {
  let layoutIndex = layoutOptions.indexOf(useConferenceState().layout.value);
  layoutIndex = (layoutIndex + 1) % layoutOptions.length;
  await useChangeLayout(layoutOptions[layoutIndex] ?? defaultLayoutOption);
}

export const useChangeLayout = async (layout: LayoutKey): Promise<boolean> => {
  const {layout: layoutState} = useConferenceState();

  log.info("change layout state", layout);
  if (layout === 'screenshare' && layoutState.value !== 'screenshare') {
    if (!(await switchScreenshareLivekit(true))) {
      return false;
    }
  } else if (layout !== 'screenshare' && layoutState.value === 'screenshare') {
    await switchScreenshareLivekit(false);
  }
  layoutState.value = layout;
  await useSendLayoutLivekit(layout);
  // await debouncedChangeRoomData(roomName.value, { layout });
  return true;
};

export const useThrottledSendReaction = useThrottleFn(async (emoji: string) => {
  await useSendReactionLivekit(emoji);
  const localParticipant = useLocalHxParticipant();
  if (localParticipant) useAddReaction(emoji, localParticipant);
}, 250);

// const debouncedChangeRoomData = useDebounceFn(async (roomName: string, data: any) => {
    // await $fetch("/api/ChangeRoomData", {
    //     method: "POST",
    //     body: { roomName, data },
    // });
// }, 1000);

export const useAddTestParticipant = async () => {
  const { participants, testParticipants, setTestParticipants } = useConferenceState();
  if (participants.value.length >= 15) return;
  await useSetTestParticipant(testParticipants.value.length + 1);
};

export const useRemoveTestParticipant = async () => {
  const { testParticipants, participants, findParticipant } = useConferenceState();
  if (testParticipants.value.length === 0) return;
  await useSetTestParticipant(testParticipants.value.length - 1);
};

export const useSetTestParticipant = async (count: number) => {
  const { setTestParticipants } = useConferenceState();
  await useSendTestParticipants(count);
  setTestParticipants(count);
  // return await debouncedChangeRoomData(roomName.value, { testParticipants: count });
};

export const useChangeName = async (name: string) => {
  await useChangeNameLivekit(name);
};

export const useSendMessage = async (message: string) => {
  const localParticipant = useLocalHxParticipant();
  if (localParticipant === undefined) throw new Error("Local participant not found");
  await useSendMessageLivekit(message);
  useAddMessage(message, localParticipant);
};

export const useLocalHxParticipant = (): HxParticipant | undefined => {
  const { identity, name } = useLocalLivekitParticipant();
  if (identity === undefined || name === undefined) return undefined;
  const { findParticipant } = useConferenceState();
  return findParticipant(identity);
};

export const useIsLocalHxParticipant = (hxParticipant: HxParticipant): boolean => {
  const { identity } = useLocalLivekitParticipant();
  return hxParticipant.id === identity;
};

export const useRemoteHxParticipant = (id: string): HxParticipant | undefined => {
  const { findParticipant } = useConferenceState();
  return findParticipant(id);
};

export const useAddMessage = (message: string, hxParticipant: HxParticipant) => {
  const { messages, increaseNewMessageCount } = useConferenceState();
  messages.value.push({
    sender: hxParticipant,
    message: convertLinksToAnchorTags(escapeHtml(message))
  });
  if (!useIsLocalHxParticipant(hxParticipant)) {
    const { sidebar } = useUIState();
    if (sidebar.value !== "chat") {
      useMessageReceivedToast(hxParticipant, message);
      increaseNewMessageCount();
    }
    playSound("messageReceived")
  } else {
    playSound("messageSent")
  }
};

export const useAddReaction = (emoji: string, hxParticipant: HxParticipant) => {
  hxParticipant.reactions.push({ id: Date.now(), emoji });
};

export const useToggleMicrophone = async () => {
  const { microphone } = useConferenceState();
  microphone.value = !microphone.value;
  await switchMicrophoneLivekit(microphone.value);
};

export const useToggleCamera = async () => {
  const { camera } = useConferenceState();
  camera.value = !camera.value;
  await switchCameraLivekit(camera.value);
};
