export interface EditState {
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}

export interface ImageFile {
  file: File;
  previewUrl: string;
  base64: string; // Raw base64 without data URI prefix
  mimeType: string;
}

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}