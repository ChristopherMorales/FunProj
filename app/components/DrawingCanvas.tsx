'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface DrawingCanvasProps {
  backgroundImage?: string;
}

export default function DrawingCanvas({ backgroundImage }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  // Get coordinates from mouse or touch event
  const getEventCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX || 0;
      clientY = e.touches[0]?.clientY || e.changedTouches[0]?.clientY || 0;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Calculate the relative position within the canvas
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Scale coordinates to match the actual canvas dimensions
    // The canvas might be scaled via CSS, so we need to adjust
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: x * scaleX,
      y: y * scaleY
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling on touch
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventCoordinates(e);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [getEventCoordinates]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling on touch
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventCoordinates(e);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [isDrawing, brushSize, brushColor, tool, getEventCoordinates]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const downloadCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas to combine background and drawing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Draw background first
    if (backgroundCanvas) {
      tempCtx.drawImage(backgroundCanvas, 0, 0);
    }

    // Draw the drawing layer on top
    tempCtx.drawImage(canvas, 0, 0);

    // Download
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = tempCanvas.toDataURL();
    link.click();
  }, []);

  // Load background image or default
  useEffect(() => {
    const backgroundCanvas = backgroundCanvasRef.current;
    if (!backgroundCanvas) return;

    const ctx = backgroundCanvas.getContext('2d');
    if (!ctx) return;

    if (backgroundImage) {
      // Load user-selected image
      const img = new Image();
      img.onload = () => {
        // Clear the canvas
        ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
        
        // Calculate scaling to fit the image while maintaining aspect ratio
        const canvasAspect = backgroundCanvas.width / backgroundCanvas.height;
        const imgAspect = img.width / img.height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (imgAspect > canvasAspect) {
          // Image is wider than canvas aspect ratio
          drawWidth = backgroundCanvas.width;
          drawHeight = drawWidth / imgAspect;
          drawX = 0;
          drawY = (backgroundCanvas.height - drawHeight) / 2;
        } else {
          // Image is taller than canvas aspect ratio
          drawHeight = backgroundCanvas.height;
          drawWidth = drawHeight * imgAspect;
          drawX = (backgroundCanvas.width - drawWidth) / 2;
          drawY = 0;
        }
        
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      };
      img.src = backgroundImage;
    } else {
      // Load default Bad Bunny image
      const defaultImg = new Image();
      defaultImg.onload = () => {
        // Clear the canvas
        ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
        
        // Calculate scaling to fit the image while maintaining aspect ratio
        const canvasAspect = backgroundCanvas.width / backgroundCanvas.height;
        const imgAspect = defaultImg.width / defaultImg.height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (imgAspect > canvasAspect) {
          // Image is wider than canvas aspect ratio
          drawWidth = backgroundCanvas.width;
          drawHeight = drawWidth / imgAspect;
          drawX = 0;
          drawY = (backgroundCanvas.height - drawHeight) / 2;
        } else {
          // Image is taller than canvas aspect ratio
          drawHeight = backgroundCanvas.height;
          drawWidth = drawHeight * imgAspect;
          drawX = (backgroundCanvas.width - drawWidth) / 2;
          drawY = 0;
        }
        
        ctx.drawImage(defaultImg, drawX, drawY, drawWidth, drawHeight);
      };
      defaultImg.src = '/badbunny.jpg';
    }
  }, [backgroundImage]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-6 items-stretch md:items-center justify-center bg-slate-800/90 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-2xl border border-slate-600/50">
        {/* Size Control */}
        <div className="flex items-center gap-3 bg-slate-700/50 px-4 py-3 rounded-xl min-h-[60px]">
          <label htmlFor="brush-size" className="text-xs md:text-sm font-semibold text-slate-200 flex items-center gap-2 whitespace-nowrap">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Size:
          </label>
          <input
            id="brush-size"
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="flex-1 min-w-[80px] accent-emerald-500"
          />
          <span className="text-xs md:text-sm w-12 text-center font-bold text-emerald-400 bg-slate-900/50 px-2 py-1 rounded">{brushSize}px</span>
        </div>

        {/* Color Control */}
        <div className="flex items-center gap-3 bg-slate-700/50 px-4 py-3 rounded-xl min-h-[60px]">
          <label htmlFor="brush-color" className="text-xs md:text-sm font-semibold text-slate-200 flex items-center gap-2 whitespace-nowrap">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
            </svg>
            Color:
          </label>
          <div className="relative">
            <input
              id="brush-color"
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-12 h-12 md:w-12 md:h-10 rounded-lg cursor-pointer border-2 border-slate-600 shadow-lg"
            />
          </div>
        </div>

        {/* Tool Selection */}
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={() => setTool('pen')}
            className={`flex-1 md:flex-none px-4 md:px-6 py-3 md:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 min-h-[60px] ${
              tool === 'pen'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-sm md:text-base">Pen</span>
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`flex-1 md:flex-none px-4 md:px-6 py-3 md:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 min-h-[60px] ${
              tool === 'eraser'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-purple-500/25'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-sm md:text-base">Eraser</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={clearCanvas}
            className="flex-1 md:flex-none px-4 md:px-6 py-3 md:py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 min-h-[60px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-sm md:text-base">Clear</span>
          </button>
          <button
            onClick={downloadCanvas}
            className="flex-1 md:flex-none px-4 md:px-6 py-3 md:py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 min-h-[60px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm md:text-base">Download</span>
          </button>
        </div>
      </div>

              {/* Canvas Container */}
        <div className="relative border-2 border-slate-600/50 rounded-2xl overflow-hidden shadow-2xl bg-slate-900/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 w-full max-w-full">
          {/* Background Canvas */}
          <canvas
            ref={backgroundCanvasRef}
            width={800}
            height={600}
            className="absolute top-0 left-0 w-full h-auto max-w-full"
          />
          
          {/* Drawing Canvas */}
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="relative cursor-crosshair w-full h-auto max-w-full touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
          />
        </div>
    </div>
  );
} 