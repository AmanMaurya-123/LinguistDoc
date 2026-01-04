
import React, { useState, useCallback } from 'react';
import { TranslationMode, TranslationState, FileMetadata } from './types';
import { translateToEnglish } from './services/geminiService';
import Header from './components/Header';
import TranslationInterface from './components/TranslationInterface';
import FileUploader from './components/FileUploader';

const App: React.FC = () => {
  const [mode, setMode] = useState<TranslationMode>(TranslationMode.TEXT);
  const [state, setState] = useState<TranslationState>({
    originalText: '',
    translatedText: '',
    isLoading: false,
    error: null,
    sourceLanguage: 'auto-detect'
  });

  const handleTranslate = async (textToTranslate: string) => {
    if (!textToTranslate.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, originalText: textToTranslate }));

    try {
      const result = await translateToEnglish(textToTranslate, state.sourceLanguage);
      setState(prev => ({ 
        ...prev, 
        translatedText: result, 
        isLoading: false 
      }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        error: err.message || 'An error occurred during translation', 
        isLoading: false 
      }));
    }
  };

  const clearTranslation = () => {
    setState({
      originalText: '',
      translatedText: '',
      isLoading: false,
      error: null,
      sourceLanguage: 'auto-detect'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex p-1 bg-gray-100 rounded-xl shadow-inner">
            <button
              onClick={() => { setMode(TranslationMode.TEXT); clearTranslation(); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === TranslationMode.TEXT 
                ? 'bg-white text-indigo-600 shadow-md transform scale-105' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802M14 10a11.959 11.959 0 01-2.683 5.66m.005 1.293A11.952 11.952 0 018.962 16m-5.023 2a19.099 19.099 0 011.837-5.602m3.181 3.182L5 20M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Text Translate
              </div>
            </button>
            <button
              onClick={() => { setMode(TranslationMode.DOCUMENT); clearTranslation(); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === TranslationMode.DOCUMENT 
                ? 'bg-white text-indigo-600 shadow-md transform scale-105' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF Translate
              </div>
            </button>
          </div>
        </div>

        {mode === TranslationMode.TEXT ? (
          <TranslationInterface 
            state={state} 
            onTranslate={handleTranslate} 
            onClear={clearTranslation}
          />
        ) : (
          <FileUploader 
            state={state} 
            onTranslate={handleTranslate}
            onClear={clearTranslation}
          />
        )}
      </main>

      <footer className="py-6 border-t bg-white text-center text-gray-400 text-sm">
        <p>&copy; 2024 LinguistDoc Pro • Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
