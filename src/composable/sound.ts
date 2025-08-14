import notificationSound from '../assets/sounds/notification.mp3';
import messageReceivedSound from '../assets/sounds/receive.mp3';
import messageSentSound from '../assets/sounds/send.mp3';
import joinSound from '../assets/sounds/joined.mp3';

export type SoundKey = 'notification' | 'messageSent' | 'messageReceived' | 'join';

// All available sounds
const soundMap: Record<SoundKey, { path: string; audioInstance: HTMLAudioElement | null }> = {
  notification: { path: notificationSound, audioInstance: null },
  messageSent: { path: messageSentSound, audioInstance: null },
  messageReceived: { path: messageReceivedSound, audioInstance: null },
  join: { path: joinSound, audioInstance: null },
};

export const playSound = (soundName: SoundKey) => {
  const sound = soundMap[soundName];

  if (!sound.audioInstance) {
    sound.audioInstance = new Audio(sound.path);
    sound.audioInstance.volume = 0.25;
  }

  sound.audioInstance.play().catch(e => console.error(`Error playing ${soundName} sound:`, e));
};
