'use client';

import { useState } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import ImageUpload from './components/ImageUpload';

export default function Home() {
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-black border-b border-slate-700 shadow-2xl">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between py-3 md:py-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-slate-600 bg-white">
                <img 
                  src="/platea-logo.webp" 
                  alt="Platea Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-white">El tatuaje de Badbo</h1>
                <p className="text-slate-400 text-xs md:text-sm">Presentado por Platea</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#upload" className="text-slate-300 hover:text-white transition-colors">Upload</a>
              <a href="#canvas" className="text-slate-300 hover:text-white transition-colors">Canvas</a>
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-200">
                Get Started
              </button>
            </nav>
            <div className="md:hidden">
              <button className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium text-sm">
                Start
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-6xl py-4 md:py-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2 md:mb-4 tracking-tight">
            Create Stunning Artwork
          </h2>
          <p className="text-slate-300 text-base md:text-lg font-medium px-4">Select a background image and start drawing with our professional tools</p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Image Upload Section */}
          <section id="upload" className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-8 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300">
            <h2 className="text-lg md:text-2xl font-bold text-slate-100 mb-4 md:mb-6 text-center flex items-center justify-center gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm md:text-base">Choose Background Image</span>
            </h2>
            <ImageUpload 
              onImageSelect={setBackgroundImage}
              currentImage={backgroundImage}
            />
          </section>

          {/* Drawing Canvas Section */}
          <section id="canvas" className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-8 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300">
            <h2 className="text-lg md:text-2xl font-bold text-slate-100 mb-4 md:mb-6 text-center flex items-center justify-center gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span className="text-sm md:text-base">Drawing Canvas</span>
            </h2>
            <DrawingCanvas backgroundImage={backgroundImage} />
          </section>
        </div>

        <footer className="text-center mt-8 md:mt-16">
          <p className="text-slate-400 text-xs md:text-sm px-4">
            Unleash your creativity • Made with passion for artists
          </p>
        </footer>
      </div>
    </div>
  );
}
