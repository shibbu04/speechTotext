import { MAX_AUDIO_SIZE, AUDIO_MIME_TYPES } from './constants';

export const validateAudioFile = (file: File): string | null => {
  if (!file) {
    return 'No audio file provided';
  }

  if (file.size > MAX_AUDIO_SIZE) {
    return 'Audio file is too large (max 25MB)';
  }

  const validMimeTypes = Object.values(AUDIO_MIME_TYPES);
  if (!validMimeTypes.includes(file.type as any)) {
    return 'Invalid audio format. Please use WebM, MP3, or WAV';
  }

  return null;
};