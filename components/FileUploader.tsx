
import React, { useState, useRef } from 'react';
import { TranslationState } from '../types';

interface Props {
  state: TranslationState;
  onTranslate: (text: string) => void;
  onClear: () => void;
}

const FileUploader: React.FC<Props> = ({ state, onTranslate, onClear }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    setIsExtracting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      // @ts-ignore
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      // Limit to first 10 pages for demo/safety
      const maxPages = Math.min(pdf.numPages, 10);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      if (pdf.numPages > 10) {
        fullText += `\n[Document truncated to first 10 pages]`;
      }
      
      return fullText.trim();
    } catch (error) {
      console.error("PDF Extraction error:", error);
      throw new Error("Could not extract text from this PDF. It might be scanned or protected.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      try {
        const text = await extractTextFromPDF(selectedFile);
        if (text) {
          onTranslate(text);
        } else {
          alert("No text found in this PDF.");
        }
      } catch (err: any) {
        alert(err.message);
      }
    } else if (selectedFile) {
      alert("Please upload a valid PDF file.");
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Upload Zone */}
      <div 
        onClick={triggerUpload}
        className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${
          file 
          ? 'bg-indigo-50 border-indigo-200 shadow-inner' 
          : 'bg-white border-gray-200 hover:border-indigo-400 hover:bg-gray-50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="application/pdf"
          className="hidden" 
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${file ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {file ? file.name : 'Click or Drag PDF to Translate'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Supports searchable PDF documents up to 10 pages
            </p>
          </div>
          {file && (
            <button 
              onClick={(e) => { e.stopPropagation(); setFile(null); onClear(); }}
              className="mt-4 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              Remove Document
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {(isExtracting || state.isLoading || state.translatedText) && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center px-4">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Translation Output</h4>
            {state.translatedText && (
              <div className="flex gap-4">
                <button 
                  className="text-xs text-indigo-600 hover:underline font-bold"
                  onClick={() => navigator.clipboard.writeText(state.translatedText)}
                >
                  Copy All
                </button>
              </div>
            )}
          </div>
          
          <div className="glass-panel rounded-3xl border border-gray-100 p-8 min-h-[300px] relative overflow-hidden shadow-xl">
            {(isExtracting || state.isLoading) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-10">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
                </div>
                <p className="text-indigo-900 font-bold">
                  {isExtracting ? 'Analyzing Document structure...' : 'Generating fluent English translation...'}
                </p>
              </div>
            ) : null}

            <div className="prose prose-indigo max-w-none">
              {state.translatedText ? (
                <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                  {state.translatedText}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-300 italic">
                  Waiting for document processing...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
