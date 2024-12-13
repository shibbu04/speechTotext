'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { uploadAudio } from '@/utils/api';
import { validateAudioFile } from '@/lib/validators';
import { AUDIO_MIME_TYPES, AUDIO_CONSTRAINTS } from '@/lib/constants';
import { useToast } from '@/hooks/useToast';

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { showSuccess, showError } = useToast();

  // Cleanup function to stop recording when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        try {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      }
    };
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: AUDIO_CONSTRAINTS
      });
      
      const options = {
        mimeType: AUDIO_MIME_TYPES.WEBM
      };

      // Check if the browser supports the MIME type
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        throw new Error('WebM recording is not supported in this browser');
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (chunksRef.current.length > 0) {
          const audioBlob = new Blob(chunksRef.current, { type: AUDIO_MIME_TYPES.WEBM });
          await handleUpload(audioBlob);
        }
      };

      mediaRecorderRef.current.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      showSuccess('Recording started');
    } catch (error: any) {
      console.error('Error accessing microphone:', error);
      showError(error.message || 'Error accessing microphone');
    }
  }, [showSuccess, showError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Error stopping recording:', error);
        showError('Error stopping recording');
      }
    }
  }, [isRecording, showError]);

  const handleUpload = async (audioBlob: Blob) => {
    const audioFile = new File([audioBlob], 'recording.webm', { 
      type: AUDIO_MIME_TYPES.WEBM 
    });
    
    const validationError = validateAudioFile(audioFile);
    if (validationError) {
      showError(validationError);
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      
      const response = await uploadAudio(formData);
      if (response.text) {
        setTranscript(response.text);
        showSuccess('Transcription complete!');
      } else {
        throw new Error('No transcription received');
      }
    } catch (error: any) {
      console.error('Error uploading audio:', error);
      showError(error.message || 'Error processing audio');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isRecording,
    isProcessing,
    transcript,
    startRecording,
    stopRecording
  };
};