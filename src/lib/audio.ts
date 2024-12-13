import { OpenAI } from 'openai';
import { MAX_RETRIES, RETRY_DELAY } from './constants';

export async function processAudioFile(audioFile: File, openai: OpenAI): Promise<string> {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      // Convert File to Blob and then to ArrayBuffer
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const transcription = await openai.audio.transcriptions.create({
        file: new File([buffer], audioFile.name, { type: audioFile.type }),
        model: 'whisper-1',
        language: 'en',
        response_format: 'text'
      });

      if (!transcription) {
        throw new Error('No transcription received from OpenAI');
      }

      return transcription;
    } catch (error: any) {
      console.error(`Attempt ${retries + 1} failed:`, error);
      
      if (retries === MAX_RETRIES - 1) {
        throw new Error(error.message || 'Failed to process audio after multiple attempts');
      }
      
      retries++;
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
    }
  }

  throw new Error('Max retries exceeded');
}