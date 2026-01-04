
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">LinguistDoc <span className="text-indigo-600">Pro</span></h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">AI Translation Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">Documentation</a>
          <div className="h-4 w-px bg-gray-200"></div>
          <button className="text-sm font-semibold bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors">
            Try Premium
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
