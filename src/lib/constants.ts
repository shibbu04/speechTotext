export const AUDIO_MIME_TYPES = {
  WEBM: 'audio/webm',
  MP3: 'audio/mpeg',
  WAV: 'audio/wav',
  OGG: 'audio/ogg'
} as const;

export const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25MB
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 2000; // 2 seconds

export const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 48000,
  channelCount: 1
} as const;