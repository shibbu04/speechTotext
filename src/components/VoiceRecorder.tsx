'use client';

import { FaMicrophone, FaStop } from 'react-icons/fa';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { Button } from '@/components/ui/Button';

export default function VoiceRecorder() {
  const {
    isRecording,
    isProcessing,
    transcript,
    startRecording,
    stopRecording
  } = useVoiceRecorder();

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Voice Transcription
      </h1>
      
      <div className="flex flex-col items-center gap-6">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? 'danger' : 'primary'}
          disabled={isProcessing}
        >
          {isRecording ? (
            <FaStop className="text-white text-xl" />
          ) : (
            <FaMicrophone className="text-white text-xl" />
          )}
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            {isRecording ? 'Recording in progress...' : 'Click to start recording'}
          </p>
          {isProcessing && (
            <p className="text-sm text-blue-600">Processing audio...</p>
          )}
        </div>

        {transcript && (
          <div className="w-full mt-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Transcript</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}