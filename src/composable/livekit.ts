import {shallowRef, shallowReactive, ref} from "vue";
import {
  DisconnectReason,
  LocalParticipant, LocalTrackPublication, Participant,
  RemoteParticipant,
  Room,
  RoomEvent, Track, TrackPublication,
} from "livekit-client";
import type {HxParticipant, LayoutKey} from "../types/conference";
import {createLogger} from "../helper/logger";
import {useConferenceState} from "./conferenceState.ts";
import {
  useAddParticipantToast,
  useNoCameraToast,
  useNoMicrophoneToast,
  useRemoveParticipantToast
} from "./ui.ts";
import {useAddMessage, useAddReaction, useChangeLayout, useRemoteHxParticipant} from "./conferenceActions.ts";

const log = createLogger('HxMeet:Livekit')

let room: Room | undefined = undefined; // Livekit room object (not reactive)
const roomName = ref("");
const audioTracks = shallowReactive<Record<string, Track>>({}); // Mapping participant id to audio track
const videoTracks = shallowReactive<Record<string, Track>>({}); // Mapping participant id to video track
const screenshareVideoTrack = shallowRef<Track | undefined>(undefined);
const screenshareAudioTrack = shallowRef<Track | undefined>(undefined);

export const useTrackStore = () => {
  const resetTracks = () => {
    Object.keys(audioTracks).forEach(key => delete audioTracks[key]);
    Object.keys(videoTracks).forEach(key => delete videoTracks[key]);
    screenshareVideoTrack.value = undefined;
    screenshareAudioTrack.value = undefined;
  };

  return {
    audioTracks,
    videoTracks,
    screenshareVideoTrack,
    screenshareAudioTrack,
    resetTracks
  };
};

export const useRoomName = () => {
  return roomName;
};

let livekitUrl: string | undefined = undefined;
let livekitToken: string | undefined = undefined;
export function provideLivekitConfig(url: string, token: string) {
  livekitUrl = url;
  livekitToken = token;
}
export function getLivekitConfig(): { livekitUrl: string, livekitToken: string } {
  if (livekitUrl === undefined) {
    log.error("'livekitUrl' not set");
    throw new Error("Livekit URL not set");
  }
  if (livekitToken === undefined) {
    log.error("'livekitToken' not set");
    throw new Error("livekitToken not set");
  }
  return { livekitUrl, livekitToken };
}

export const usePrepareLivekit = async () => {
  if (room !== undefined) return;
  const { livekitUrl} = getLivekitConfig();

  room = new Room();
  try {
    log.info("Prepare connection:", livekitUrl);
    await room.prepareConnection(livekitUrl);
    log.info("Prepare connection finished");
  } catch (error) {
    log.error("Failed to prepare livekit", error);
  }
};

export const useConnectLivekit = async () => {
  const { livekitUrl, livekitToken } = getLivekitConfig();
  const {
    layout,
    roomConnectStatus,
    participants,
  } = useConferenceState();

  room ??= new Room();

  let retry = 10;
  roomConnectStatus.value = "connecting";
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  while (roomConnectStatus.value !== "connected") {
    try {
      log.info("Room connect", { livekitUrl });
      await room.connect(livekitUrl, livekitToken);
      roomName.value = room.name;
      roomConnectStatus.value = "connected";
    } catch (error) {
      log.error("Failed to connect to the room", error);
      retry--;
      await wait(500);
      if (retry === 0) {
        room = undefined;
        roomConnectStatus.value = "failed";
        return;
      }
    }
  }
  log.info(`Room "${room.name}" connect successfully`);

  participants.value = [];
  log.info("LocalParticipant", { localParticipant: room.localParticipant });
  await addParticipant(room.localParticipant, false);

  for (const participant of room.remoteParticipants.values()) {
    await addParticipant(participant, false);
    for (const publication of participant.getTrackPublications()) {
      if (publication.track) {
        await trackSubscribedListener(publication.track, publication, participant);
      }
    }
  }
  log.info("Metadata", room.metadata);
  // if (room.metadata) {
  //   const metadata = JSON.parse(room.metadata);
  //   layout.value = metadata.layout;
  //   useConferenceState().setTestParticipants(metadata.testParticipants);
  // }

  room.on(RoomEvent.TrackSubscribed, trackSubscribedListener);
  // room.on(RoomEvent.RoomMetadataChanged, metadataChangeListener);
  room.on(RoomEvent.TrackMuted, trackMutedListener);
  room.on(RoomEvent.TrackUnmuted, trackMutedListener);
  room.on(RoomEvent.AudioPlaybackStatusChanged, audioPlaybackStatusListener);
  room.on(RoomEvent.ParticipantNameChanged, participantNameListener);
  room.on(RoomEvent.ParticipantConnected, participantConnectedListener);
  room.on(RoomEvent.ParticipantDisconnected, participantDisconnectedListener);
  room.on(RoomEvent.ParticipantAttributesChanged, participantAttributeChangedListener);
  room.on(RoomEvent.Disconnected, disconnectedListener);
  room.on(RoomEvent.DataReceived, dataReceivedListener);
  room.on(RoomEvent.LocalTrackUnpublished, localTrackUnpublishListener);

  // room.on(RoomEvent.TranscriptionReceived, (segments, participant, publication) => {
  //   log.info('Transcription received', segments[0].text);
  // });

  if (!(await switchCameraLivekit(true)) || !(await switchMicrophoneLivekit(true))) {
    await useDisconnectLivekit();
    roomConnectStatus.value = "failed";
    return;
  }
};

export const useDisconnectLivekit = async () => {
  if (room) {
    log.info("Disconnect livekit, room", room);
    room.removeAllListeners();
    await room.disconnect();
    room = undefined;
  }
};

export const useChangeNameLivekit = async (name: string) => {
  if (room) {
    log.info("Change local participant name", name);
    await room.localParticipant.setName(name);
  }
};

export const useLocalLivekitParticipant = () => {
  return {
    identity: room?.localParticipant.identity,
    name: room?.localParticipant.name,
  };
};

export const useSendMessageLivekit = async (message: string) => {
  await sendDataLivekit("message", {message});
};

export const useSendReactionLivekit = async (emoji: string) => {
  await sendDataLivekit("reaction", {emoji});
};

export const useSendLayoutLivekit = async (layout: LayoutKey) => {
  await sendDataLivekit("layout", {layout});
};

export const useSendTestParticipants = async (testParticipants: number) => {
  await sendDataLivekit("testParticipants", {testParticipants});
};

export const switchMicrophoneLivekit = async (enabled: boolean): Promise<boolean> => {
  const {setNoMicrophone} = useConferenceState();
  if (room?.localParticipant) {
    try {
      log.info("setMicrophoneEnabled", enabled);
      await room.localParticipant.setMicrophoneEnabled(enabled);
      setNoMicrophone(enabled);
    } catch (error) {
      log.error("Error enabling mic", error);
      const domException = error as DOMException;
      if (domException.message === "Requested device not found" || domException.message === "Permission denied" || domException.name === "NotAllowedError") {
        // Permission denied is for Chrome
        // NotAllowedError is for Safari
        setNoMicrophone();
        useNoMicrophoneToast();
      } else {
        return false;
      }
    }
    return true;
  }
  return false;
}

export const switchCameraLivekit = async (enabled: boolean): Promise<boolean> => {
  const {setNoCamera, loadingCamera} = useConferenceState();
  if (room?.localParticipant) {
    try {
      loadingCamera.value = true;
      await room.localParticipant.setCameraEnabled(enabled);
      loadingCamera.value = false;
      setNoCamera(enabled);
    } catch (error) {
      loadingCamera.value = false;
      const domException = error as DOMException;
      if (domException.message === "Requested device not found" || domException.message === "Permission denied" || domException.name === "NotAllowedError") {
        // Permission denied is for Chrome
        // NotAllowedError is for Safari
        setNoCamera();
        useNoCameraToast();
        log.warn("Warning enabling camera", error);
      } else {
        log.error("Error enabling camera", error);
        return false;
      }
    }
    const cameraPublication = room.localParticipant.getTrackPublication(Track.Source.Camera)

    if (cameraPublication && cameraPublication.track) {
      // const {setVideoTrack} = useConferenceState();
      // Show video preview
      // setVideoTrack(room.localParticipant.identity, cameraPublication.track);
      log.info("Add local video track", { localParticicpantId: room.localParticipant.identity, trackSID: cameraPublication.track.sid })
      videoTracks[room.localParticipant.identity] = cameraPublication.track;
    }
    return true;
  }
  return false;
}

export const switchScreenshareLivekit = async (enabled: boolean): Promise<boolean> => {
  // const {setScreenshareVideoTrack} = useConferenceState();
  if (room?.localParticipant) {
    try {
      log.info("switchScreenshareLivekit", enabled);
      const localTrackPublication = await room.localParticipant.setScreenShareEnabled(enabled, {audio: true});
      log.info("localTrackPublication", localTrackPublication);
      if (localTrackPublication === undefined) return false;
      if (localTrackPublication.videoTrack) {
        // setScreenshareVideoTrack(localTrackPublication.videoTrack); // Show local video preview
        screenshareVideoTrack.value = localTrackPublication.videoTrack;
      }
    } catch (error) {
      log.error("Error enabling screensharing", error);
      const domException = error as DOMException;
      if (domException.message === "Requested device not found" || domException.message === "Permission denied" || domException.name === "NotAllowedError") {
        // Permission denied is for Chrome
        // NotAllowedError is for Safari
        //TODO: show toast?
        return false;
      } else {
        return false;
      }
    }
    return true;
  }
  return false;
}

const sendDataLivekit = async (command: string, sendData: { [key: string]: any }) => {
  log.info("sendDataLivekit", {command, data: sendData});
  if (room) {
    const strData = JSON.stringify({command, data: sendData});
    const encoder = new TextEncoder();
    const data = encoder.encode(strData);
    await room.localParticipant.publishData(data, {reliable: true});
  }
};

const trackSubscribedListener = async (track: Track, publication: TrackPublication, participant: RemoteParticipant) => {
  log.info("Track subscribed", {track, publication, participant});
  if (track.kind === "video") {
    if (track.source === "camera") {
      videoTracks[participant.identity] = track;
    } else if (track.source === "screen_share") {
      screenshareVideoTrack.value = track;
    }
  } else if (track.kind === "audio") {
    if (track.source === "microphone") {
      audioTracks[participant.identity] = track;
    } else if (track.source === "screen_share_audio") {
      screenshareAudioTrack.value = track;
    }
  }
};

const localTrackUnpublishListener = async (publication: LocalTrackPublication) => {
  log.info('LocalTrack unpublished', { kind: publication.kind });
  if (publication.source === "screen_share" && publication.kind === "video") {
    await useChangeLayout('circle');
  }
}

// const metadataChangeListener = (metadataString: string | undefined) => {
//   const metadata = JSON.parse(metadataString ?? "{}");
//   log.info("Metadata changed", metadata);
//   const { topic } = useConferenceState();
//   topic.value = metadata.topic ?? "HxChat Conference";
//   useAddTopicToast();
// };

const participantConnectedListener = async (remoteParticipant: RemoteParticipant) => {
  log.info("participant connected", remoteParticipant);
  await addParticipant(remoteParticipant);
};

const participantNameListener = async (name: string | undefined, participant: LocalParticipant | RemoteParticipant) => {
  const {participants} = useConferenceState();
  const hxParticipant = participants.value.find((hxParticipant) => hxParticipant.id === participant.identity);
  if (hxParticipant !== undefined) {
    hxParticipant.name = name ?? "-";
  }
};

const trackMutedListener = async (publication: TrackPublication, participant: Participant) => {
  log.info("track muted", publication, participant);
  const {participants} = useConferenceState();
  const hxParticipant = participants.value.find((hxParticipant) => hxParticipant.id === participant.identity);
  if (hxParticipant !== undefined) {
    if (publication.kind === "audio") {
      hxParticipant.microphoneMuted = publication.isMuted;
    } else if (publication.kind === "video") {
      hxParticipant.cameraMuted = publication.isMuted;
    }
  }
};

const audioPlaybackStatusListener = (playing: boolean) => {
  log.info("audioPlaybackStatusListener", playing);
  if (room) {
    log.info("audioPlaybackStatusListener canPlaybackAudio", room.canPlaybackAudio);
  }
};

const participantDisconnectedListener = (remoteParticipant: RemoteParticipant) => {
  log.info("participant disconnected", remoteParticipant);
  const {participants} = useConferenceState();
  const idx = participants.value.findIndex((hxParticipant) => hxParticipant.id === remoteParticipant.identity);
  if (idx !== -1) {
    const hxParticipant = participants.value[idx];
    if (hxParticipant) {
      participants.value.splice(idx, 1);
      useRemoveParticipantToast(hxParticipant);
    }
  }
};

const participantAttributeChangedListener = (changed: Record<string, string>, participant: Participant) => {
  log.info("participant attribute changed", participant);
  let hxParticipant = useRemoteHxParticipant(participant.identity);
  if (hxParticipant === undefined) {
    log.info("Participant not found", participant.identity);
    return;
  }
};

const dataReceivedListener = async (payload: Uint8Array, participant: RemoteParticipant | undefined) => {
  if (participant === undefined) {
    log.error("Data received from undefined participant");
    return;
  }
  const hxParticipant = useRemoteHxParticipant(participant.identity);
  if (hxParticipant === undefined) {
    log.error("Data received from unknown participant");
    return;
  }
  const decoder = new TextDecoder();
  const strData = decoder.decode(payload);
  const data = JSON.parse(strData ?? "{}");
  log.info("Data received", strData);
  if (data.command === "message") {
    useAddMessage(data.data.message, hxParticipant);
  } else if (data.command === "reaction") {
    useAddReaction(data.data.emoji, hxParticipant);
  } else {
    if (data.command === "layout") {
      // Check if another participant disables my screensharing
      if (data.data.layout !== "screenshare" && room?.localParticipant.isScreenShareEnabled) {
        await switchScreenshareLivekit(false);
      }
      useConferenceState().layout.value = data.data.layout;
    } else if (data.command === "testParticipants") {
      useConferenceState().setTestParticipants(data.data.testParticipants);
    }
  }
};

const disconnectedListener = async (disconnectedReason?: DisconnectReason) => {
  log.info("Disconnected from room");
  roomName.value = "";
  let endConference = false;
  if (disconnectedReason === undefined) {
    log.info("No DisconnectReason given");
    endConference = true;
  } else if (disconnectedReason === DisconnectReason.UNKNOWN_REASON) {
    log.info("UNKNOWN_REASON");
  } else if (disconnectedReason === DisconnectReason.CLIENT_INITIATED) {
    log.info("CLIENT_INITIATED");
  } else if (disconnectedReason === DisconnectReason.DUPLICATE_IDENTITY) {
    log.info("DUPLICATE_IDENTITY");
  } else if (disconnectedReason === DisconnectReason.SERVER_SHUTDOWN) {
    log.info("SERVER_SHUTDOWN");
    endConference = true;
  } else if (disconnectedReason === DisconnectReason.PARTICIPANT_REMOVED) {
    log.info("PARTICIPANT_REMOVED");
  } else if (disconnectedReason === DisconnectReason.ROOM_DELETED) {
    log.info("ROOM_DELETED");
    endConference = true;
  } else if (disconnectedReason === DisconnectReason.STATE_MISMATCH) {
    log.info("STATE_MISMATCH");
  } else if (disconnectedReason === DisconnectReason.JOIN_FAILURE) {
    log.info("JOIN_FAILURE");
  } else if (disconnectedReason === DisconnectReason.MIGRATION) {
    log.info("MIGRATION");
  } else if (disconnectedReason === DisconnectReason.SIGNAL_CLOSE) {
    log.info("SIGNAL_CLOSE");
  } else {
    log.info("Unknown DisconnectReason");
  }

  if (endConference) {
    await useDisconnectLivekit();
    const {resetState} = useConferenceState();
    resetState("failed");
  }
};

const addParticipant = async (participant: LocalParticipant | RemoteParticipant, withToast = true): Promise<HxParticipant> => {
  log.info("addParticipant", participant);

  const {participants} = useConferenceState();
  let hxParticipant = participants.value.find((hxParticipant) => hxParticipant.id === participant.identity);
  if (!hxParticipant) {
    hxParticipant = {
      id: participant.identity,
      cameraMuted: false,
      microphoneMuted: false,
      noCamera: false,
      noMicrophone: false,
      reactions: [],
      name: participant.name || participant.identity,
      test: false
    };
    participants.value.push(hxParticipant);
    if (withToast) useAddParticipantToast(hxParticipant);
  }
  return hxParticipant;
};
