
export interface HxParticipant {
  id: string,
  name: string,
  reactions: Array<{ id: number, emoji: string }>
  cameraMuted: boolean,
  microphoneMuted: boolean,
  noCamera: boolean, // no camera found, only for local participant
  noMicrophone: boolean, // no microphone found, only for local participant
  test: boolean
}

export interface ChatMessageUIItem {
  sender: HxParticipant,
  message: string
}

export interface LayoutStyleItem {
  container: any,
  videoElement: any,
}

export type HxMeetingStatus = "initialising" | "connecting" | "connected" | "failed" | "end" | "noDevices";
export type LayoutKey = "circle" | "grid" | "cinema" | "screenshare";
export const layoutOptions: LayoutKey[] = ['circle', 'grid', 'cinema'];
export const defaultLayoutOption: LayoutKey = 'circle';
