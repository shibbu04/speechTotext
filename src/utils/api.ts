import axios, { AxiosError } from 'axios';
import { AudioUploadResponse } from '@/types';

export const uploadAudio = async (formData: FormData): Promise<AudioUploadResponse> => {
  try {
    const response = await axios.post<AudioUploadResponse>('/api/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // Increased timeout to 120 seconds for large files
      maxContentLength: 25 * 1024 * 1024, // 25MB
    });
    
    if (!response.data || response.data.error) {
      throw new Error(response.data?.error || 'Invalid response from server');
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMessage = axiosError.response?.data?.error ||
                          axiosError.message ||
                          'Error uploading audio';
      
      console.error('API Error:', {
        status: axiosError.response?.status,
        message: errorMessage,
        details: axiosError.response?.data
      });
      
      throw new Error(errorMessage);
    }
    
    const genericError = error as Error;
    throw new Error(genericError.message || 'Error uploading audio');
  }
};