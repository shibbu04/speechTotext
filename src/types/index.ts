export interface TranscriptionResponse {
  text: string;
  error?: string;
}

export interface AudioUploadResponse {
  text: string;
  error?: string;
}

export interface ApiError {
  error: string;
  status?: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}