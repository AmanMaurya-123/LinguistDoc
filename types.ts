
export interface TranslationState {
  originalText: string;
  translatedText: string;
  isLoading: boolean;
  error: string | null;
  sourceLanguage: string;
}

export enum TranslationMode {
  TEXT = 'TEXT',
  DOCUMENT = 'DOCUMENT'
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
}
