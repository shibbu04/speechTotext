import { NextRequest } from 'next/server';
import { openai } from '@/lib/openai';
import { processAudioFile } from '@/lib/audio';
import { createErrorResponse, createSuccessResponse } from '@/lib/api-responses';
import { validateAudioFile } from '@/lib/validators';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    // Validate the audio file
    const validationError = validateAudioFile(audioFile);
    if (validationError) {
      return createErrorResponse(validationError, 400);
    }

    // Process the audio file
    try {
      const transcription = await processAudioFile(audioFile, openai);
      return createSuccessResponse({ text: transcription });
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      return createErrorResponse(
        'Error processing audio with OpenAI: ' + (error.message || 'Unknown error'),
        error.status || 500
      );
    }
  } catch (error: any) {
    console.error('Request processing error:', error);
    return createErrorResponse(
      'Error processing request: ' + (error.message || 'Unknown error'),
      500
    );
  }
}