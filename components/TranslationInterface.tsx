
import React, { useState, useEffect } from 'react';
import { TranslationState } from '../types';

interface Props {
  state: TranslationState;
  onTranslate: (text: string) => void;
  onClear: () => void;
}

const TranslationInterface: React.FC<Props> = ({ state, onTranslate, onClear }) => {
  const [inputText, setInputText] = useState(state.originalText);

  useEffect(() => {
    setInputText(state.originalText);
  }, [state.originalText]);

  const handleTranslateClick = () => {
    onTranslate(inputText);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch h-full">
      {/* Input Side */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Detecting Language...
          </label>
          {inputText && (
            <button 
              onClick={() => { setInputText(''); onClear(); }}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="relative group flex-grow">
          <textarea
            className="w-full h-[400px] p-6 text-lg bg-white border border-gray-200 rounded-3xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none placeholder-gray-300"
            placeholder="Paste text or type anything here to translate..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="absolute bottom-6 right-6 flex gap-2">
            <button
              onClick={handleTranslateClick}
              disabled={state.isLoading || !inputText.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                state.isLoading || !inputText.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95'
              }`}
            >
              {state.isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Translating...
                </>
              ) : (
                <>
                  Translate to English
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Output Side */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-2">
          <label className="text-sm font-semibold text-gray-700">English (Final)</label>
          {state.translatedText && (
            <button 
              onClick={() => handleCopy(state.translatedText)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Result
            </button>
          )}
        </div>
        <div className={`relative flex-grow ${state.isLoading ? 'opacity-50 blur-[2px]' : ''} transition-all`}>
          <div className="w-full h-[400px] p-6 text-lg bg-gray-50 border border-gray-200 rounded-3xl shadow-inner overflow-y-auto whitespace-pre-wrap text-gray-800">
            {state.translatedText || (
              <span className="text-gray-300 italic">Translation will appear here...</span>
            )}
          </div>
          {state.error && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium shadow-lg max-w-[80%] text-center">
              <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {state.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationInterface;
