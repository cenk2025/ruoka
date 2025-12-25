import React, { useRef, useState } from 'react';
import { UploadIcon, AnalyzeIcon, ResetIcon } from './Icons';
import { Strings } from '../localization/strings';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  onAnalyze: () => void;
  onReset: () => void;
  imageDataUrl: string | null;
  isLoading: boolean;
  strings: Strings;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, onAnalyze, onReset, imageDataUrl, isLoading, strings }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageChange(file);
      } else {
        alert(strings.alertOnlyImages);
      }
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };


  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-soft transition-all duration-300 transform hover:scale-[1.01]">
      {!imageDataUrl ? (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative overflow-hidden border-3 border-dashed rounded-2xl p-10 md:p-16 text-center cursor-pointer transition-all duration-300 group
            ${isDragging 
              ? 'border-app-primary bg-indigo-50/50 scale-[0.99]' 
              : 'border-slate-200 hover:border-app-primary hover:bg-slate-50'
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <div className="flex flex-col items-center text-gray-500 relative z-10">
            <div className={`
              p-4 rounded-full mb-4 transition-all duration-300
              ${isDragging ? 'bg-white shadow-md text-app-primary' : 'bg-indigo-50 text-indigo-300 group-hover:text-app-primary group-hover:scale-110 group-hover:shadow-glow'}
            `}>
              <UploadIcon />
            </div>
            <p className="mt-2 text-lg font-semibold text-gray-700">{strings.uploaderDragDrop}</p>
            <p className="text-sm text-gray-400 my-2 uppercase tracking-widest font-bold">{strings.uploaderOr}</p>
            <span className="inline-block bg-app-primary text-white font-bold py-2 px-6 rounded-full shadow-lg shadow-indigo-200 transform group-hover:-translate-y-1 transition-transform">
              {strings.uploaderClick}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="relative group rounded-2xl overflow-hidden shadow-md bg-slate-100">
            <img src={imageDataUrl} alt={strings.imagePreviewAlt} className="w-full max-h-[400px] object-contain mx-auto" />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-app-primary to-app-secondary text-white font-bold py-4 px-6 rounded-2xl hover:shadow-glow hover:shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
            >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {strings.buttonAnalyzing}
                  </>
                ) : (
                  <>
                    <AnalyzeIcon />
                    {strings.buttonAnalyze}
                  </>
                )}
            </button>
            
            <button
              onClick={onReset}
              disabled={isLoading}
              className="w-full bg-white border-2 border-slate-200 text-slate-600 font-bold py-4 px-6 rounded-2xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
                <ResetIcon />
                {strings.buttonSelectNew}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;