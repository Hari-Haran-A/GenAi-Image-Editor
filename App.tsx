import React, { useState, useRef } from 'react';
import { Button } from './components/Button';
import { generateEditedImage } from './services/geminiService';
import { ImageFile, EditState, GeneratedImage } from './types';

// Icons
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-3 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const MagicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UndoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
);

const RedoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
  </svg>
);

export default function App() {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [editState, setEditState] = useState<EditState>({ status: 'idle' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          const result = e.target.result as string;
          // Extract base64 part
          const base64 = result.split(',')[1];
          setSelectedImage({
            file,
            previewUrl: result,
            base64,
            mimeType: file.type,
          });
          setGeneratedImage(null);
          setHistory([]); // Clear history on new file
          setEditState({ status: 'idle' });
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const result = e.target.result as string;
          const base64 = result.split(',')[1];
          setSelectedImage({
            file,
            previewUrl: result,
            base64,
            mimeType: file.type,
          });
          setGeneratedImage(null);
          setHistory([]); // Clear history on new file
          setEditState({ status: 'idle' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) return;

    setEditState({ status: 'loading' });
    try {
      const resultImageUrl = await generateEditedImage(
        selectedImage.base64,
        selectedImage.mimeType,
        prompt
      );
      
      const newGeneratedImage: GeneratedImage = {
        id: crypto.randomUUID(),
        imageUrl: resultImageUrl,
        prompt: prompt,
        timestamp: Date.now(),
      };

      setGeneratedImage(newGeneratedImage);
      setHistory(prev => [newGeneratedImage, ...prev]);
      setEditState({ status: 'success' });
    } catch (error: any) {
      setEditState({ 
        status: 'error', 
        errorMessage: error.message || 'An unknown error occurred' 
      });
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setGeneratedImage(null);
    setHistory([]);
    setPrompt('');
    setEditState({ status: 'idle' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage.imageUrl;
      link.download = `genai-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleHistoryRestore = (item: GeneratedImage) => {
    setGeneratedImage(item);
    setPrompt(item.prompt);
  };

  // History Navigation Logic
  const currentIndex = generatedImage ? history.findIndex(img => img.id === generatedImage.id) : -1;
  const canUndo = currentIndex !== -1 && currentIndex < history.length - 1;
  const canRedo = currentIndex !== -1 && currentIndex > 0;

  const handleUndo = () => {
    if (canUndo) {
      const targetImage = history[currentIndex + 1];
      setGeneratedImage(targetImage);
      setPrompt(targetImage.prompt);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      const targetImage = history[currentIndex - 1];
      setGeneratedImage(targetImage);
      setPrompt(targetImage.prompt);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedPrompts = [
    "Make it a watercolor painting",
    "Add a sci-fi cyberpunk background",
    "Turn this into a pencil sketch",
    "Add a cute cat next to the person",
    "Change the lighting to sunset golden hour"
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 px-4">
      {/* Header */}
      <header className="w-full max-w-5xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-banana-400 rounded-lg flex items-center justify-center text-slate-900 shadow-lg shadow-banana-400/20">
             <span className="font-bold text-xl">AI</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">GenAI Image Editor</h1>
            <p className="text-slate-400 text-sm">Powered by Gemini 2.5 Flash Image</p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl">
        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Upload & Controls */}
          <div className="space-y-6">
            
            {/* Upload Area */}
            {!selectedImage ? (
              <div 
                className="w-full aspect-[4/3] border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors flex flex-col items-center justify-center cursor-pointer relative group"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="group-hover:scale-105 transition-transform duration-300 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 border border-slate-700 shadow-xl">
                    <UploadIcon />
                  </div>
                  <p className="font-medium text-slate-300">Click or Drop Image</p>
                  <p className="text-sm text-slate-500 mt-1">Supports JPG, PNG, WEBP</p>
                </div>
              </div>
            ) : (
              <div className="w-full relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-2xl group">
                <img 
                  src={selectedImage.previewUrl} 
                  alt="Original" 
                  className="w-full h-full object-contain"
                />
                <button 
                  onClick={handleClear}
                  className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                  title="Remove image"
                >
                  <TrashIcon />
                </button>
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-md text-xs font-mono text-white/80 border border-white/10">
                  Original
                </div>
              </div>
            )}

            {/* Prompt Input */}
            <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-xl">
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
                What would you like to change?
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your edit... e.g., 'Make it look like a cyberpunk city'"
                className="w-full h-32 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-banana-500/50 focus:border-banana-500 transition-all resize-none"
                disabled={editState.status === 'loading'}
              />
              
              {/* Prompt Suggestions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestedPrompts.map((p, i) => (
                  <button 
                    key={i}
                    onClick={() => setPrompt(p)}
                    className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-slate-600/50"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <Button 
                  onClick={handleGenerate}
                  className="w-full"
                  disabled={!selectedImage || !prompt.trim()}
                  isLoading={editState.status === 'loading'}
                >
                  <span className="flex items-center gap-2">
                    <MagicIcon />
                    Generate Edit
                  </span>
                </Button>
                {editState.status === 'error' && (
                  <p className="mt-3 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                    {editState.errorMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Result Display & History */}
          <div className="flex flex-col gap-6">
            <div className="relative h-full min-h-[500px] flex flex-col">
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                   <PhotoIcon /> Result
                 </h2>
                 {history.length > 0 && (
                   <div className="flex items-center gap-2">
                     <button 
                       onClick={handleUndo} 
                       disabled={!canUndo} 
                       className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700"
                       title="Undo (Previous Version)"
                     >
                       <UndoIcon />
                     </button>
                     <button 
                       onClick={handleRedo} 
                       disabled={!canRedo}
                       className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors border border-slate-700"
                       title="Redo (Next Version)"
                     >
                       <RedoIcon />
                     </button>
                   </div>
                 )}
               </div>
               
               <div className="flex-1 rounded-2xl bg-slate-900 border-2 border-slate-800 border-dashed flex items-center justify-center relative overflow-hidden group">
                  {generatedImage ? (
                    <>
                      <img 
                        src={generatedImage.imageUrl} 
                        alt="Generated Result" 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                        <Button variant="secondary" onClick={downloadImage} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/20 text-white">
                          <span className="flex items-center gap-2">
                            <DownloadIcon /> Download Image
                          </span>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8 max-w-sm">
                      {editState.status === 'loading' ? (
                        <div className="flex flex-col items-center">
                          <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 border-t-4 border-banana-400 rounded-full animate-spin"></div>
                            <div className="absolute inset-4 border-t-4 border-banana-200 rounded-full animate-spin direction-reverse opacity-50"></div>
                          </div>
                          <p className="text-banana-400 font-medium animate-pulse">
                            Dreaming up new pixels...
                          </p>
                          <p className="text-slate-500 text-sm mt-2">
                            This usually takes about 5-10 seconds
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="w-20 h-20 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-600">
                             <MagicIcon />
                          </div>
                          <p className="text-slate-500">
                            Your edited masterpiece will appear here. <br/>
                            <span className="text-slate-600 text-sm">Upload an image and enter a prompt to start.</span>
                          </p>
                        </>
                      )}
                    </div>
                  )}
               </div>
            </div>

            {/* History Panel */}
            {history.length > 0 && (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <HistoryIcon /> History
                  </h3>
                  <span className="text-xs text-slate-500">{history.length} items</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {history.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleHistoryRestore(item)}
                      className={`group flex items-center gap-4 p-2 rounded-lg transition-all cursor-pointer border ${
                        generatedImage?.id === item.id 
                          ? 'bg-slate-700/80 border-banana-500/50 ring-1 ring-banana-500/20' 
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-black shrink-0 border border-slate-600">
                        <img 
                          src={item.imageUrl} 
                          alt="Thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 line-clamp-2 leading-snug mb-1">
                          {item.prompt}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">
                          {formatTime(item.timestamp)}
                        </p>
                      </div>
                      {generatedImage?.id !== item.id && (
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2">
                            <span className="text-xs text-banana-400 font-medium">View</span>
                         </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
      
      {/* Sample Credit */}
      <footer className="mt-20 text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} GenAI Image Editor. Built with Google Gemini API.</p>
      </footer>
    </div>
  );
}