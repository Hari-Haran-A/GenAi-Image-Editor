import React, { useState, useRef, useEffect } from 'react';
import { Button } from './components/Button';
import { generateEditedImage } from './services/geminiService';
import { ImageFile, EditState, GeneratedImage } from './types';

// Icons
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 md:w-12 md:h-12 text-slate-400 group-hover:text-banana-400 transition-colors">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
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

const HeartIcon = ({ solid }: { solid?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={solid ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 md:w-5 md:h-5 ${solid ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function App() {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [editState, setEditState] = useState<EditState>({ status: 'idle' });
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

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
        isFavorite: false,
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

  // Auto-scroll to result on mobile when success
  useEffect(() => {
    if (editState.status === 'success' && resultRef.current) {
      if (window.innerWidth < 1024) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [editState.status]);

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
      link.download = `genai-edit-${generatedImage.label ? generatedImage.label.replace(/\s+/g, '-') : Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleHistoryRestore = (item: GeneratedImage) => {
    setGeneratedImage(item);
    setPrompt(item.prompt);
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const startEditingLabel = (e: React.MouseEvent, item: GeneratedImage) => {
    e.stopPropagation();
    setEditingLabelId(item.id);
    setTempLabel(item.label || '');
  };

  const saveLabel = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, label: tempLabel } : item
    ));
    setEditingLabelId(null);
  };

  const cancelEditingLabel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLabelId(null);
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
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Navbar / Header */}
      <div className="w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-banana-400 to-banana-600 rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-banana-500/20 shrink-0 transform hover:scale-105 transition-transform duration-200">
               <span className="font-bold text-xl">AI</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-none">GenAI Editor</h1>
              <p className="text-slate-400 text-xs md:text-sm font-medium">Powered by Gemini 2.5</p>
            </div>
          </div>
          {/* Optional: Add user/settings menu here in future */}
        </div>
      </div>

      {/* Main Content with Top Padding to account for fixed header */}
      <main className="flex-grow container mx-auto px-4 pt-28 pb-8">
        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Input Section */}
          <div className="flex flex-col gap-6 w-full">
            
            {/* Upload Area Container */}
            <div className="w-full bg-slate-800 rounded-2xl p-1 border border-slate-700/50 shadow-sm flex-shrink-0 relative z-0">
              {!selectedImage ? (
                <div 
                  className="w-full min-h-[300px] md:min-h-[400px] border-2 border-dashed border-slate-600 hover:border-banana-400/50 rounded-xl bg-slate-800 hover:bg-slate-750 transition-all duration-300 flex flex-col items-center justify-center p-6 cursor-pointer relative group"
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
                  <div className="flex flex-col items-center text-center max-w-sm z-10">
                    <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center mb-6 border border-slate-600 group-hover:scale-110 transition-transform duration-300 group-hover:border-banana-400/30 group-hover:bg-slate-700">
                      <UploadIcon />
                    </div>
                    <h3 className="font-semibold text-xl text-slate-200 mb-2">Upload Image</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      Drag & drop your photo here,<br/>or click to browse from your device
                    </p>
                    <Button variant="secondary" className="pointer-events-none group-hover:bg-banana-400 group-hover:text-slate-900 group-hover:border-banana-400 transition-colors">
                      Select From Device
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full relative min-h-[300px] md:min-h-[400px] rounded-xl overflow-hidden bg-black/40 border border-slate-700 flex items-center justify-center group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
                  <img 
                    src={selectedImage.previewUrl} 
                    alt="Original" 
                    className="max-h-[500px] w-auto max-w-full object-contain shadow-2xl"
                  />
                  <button 
                    onClick={handleClear}
                    className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-white/10"
                    title="Remove image"
                  >
                    <TrashIcon />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide text-white/90 border border-white/10">
                    ORIGINAL
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input Section */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
              <div className="p-4 md:p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="prompt" className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <MagicIcon /> Describe your edit
                  </label>
                  {prompt && (
                    <button onClick={() => setPrompt('')} className="text-xs text-slate-500 hover:text-slate-300">
                      Clear
                    </button>
                  )}
                </div>
                
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Change the background to a snowy mountain, add a neon glow effect..."
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-banana-500/50 focus:border-banana-500 transition-all resize-none text-base md:text-lg leading-relaxed"
                  disabled={editState.status === 'loading'}
                />
                
                {/* Suggestions */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Try these ideas</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((p, i) => (
                      <button 
                        key={i}
                        onClick={() => setPrompt(p)}
                        className="text-xs sm:text-sm bg-slate-700/40 hover:bg-slate-700 hover:text-white text-slate-400 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-slate-600"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={handleGenerate}
                    className="w-full py-4 text-lg shadow-lg shadow-banana-500/10"
                    disabled={!selectedImage || !prompt.trim()}
                    isLoading={editState.status === 'loading'}
                  >
                    <span className="flex items-center gap-2">
                      Generate
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </Button>
                  
                  {editState.status === 'error' && (
                    <div className="mt-4 p-4 bg-red-900/20 rounded-xl border border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                      <div className="text-red-400 mt-0.5"><XMarkIcon /></div>
                      <div>
                         <p className="text-red-200 font-medium text-sm">Generation Failed</p>
                         <p className="text-red-300/70 text-sm mt-1">{editState.errorMessage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results Section */}
          <div className="flex flex-col gap-6 w-full sticky top-24" ref={resultRef}>
            
            <div className="bg-slate-800 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden flex flex-col h-full min-h-[500px]">
               {/* Result Header */}
               <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                 <h2 className="text-base md:text-lg font-semibold text-slate-200 flex items-center gap-2">
                   <PhotoIcon /> Generated Result
                 </h2>
                 <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-700/50">
                    <button 
                       onClick={handleUndo} 
                       disabled={!canUndo} 
                       className="p-2 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                       title="Undo (Ctrl+Z)"
                     >
                       <UndoIcon />
                     </button>
                     <div className="w-px h-4 bg-slate-700"></div>
                     <button 
                       onClick={handleRedo} 
                       disabled={!canRedo}
                       className="p-2 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
                       title="Redo (Ctrl+Y)"
                     >
                       <RedoIcon />
                     </button>
                 </div>
               </div>
               
               {/* Result Canvas */}
               <div className="flex-1 bg-slate-900 relative flex items-center justify-center overflow-hidden group p-4">
                   {/* Background Grid Pattern */}
                   <div className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                   </div>

                  {generatedImage ? (
                    <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300">
                      <img 
                        src={generatedImage.imageUrl} 
                        alt="Generated Result" 
                        className="max-w-full max-h-[600px] object-contain shadow-2xl rounded-lg"
                      />
                      
                      {/* Floating Action Bar */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-full shadow-2xl translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <Button variant="ghost" onClick={downloadImage} className="text-slate-300 hover:text-white py-2 px-4 h-auto rounded-full hover:bg-white/10">
                          <DownloadIcon />
                        </Button>
                        <div className="w-px h-4 bg-slate-700"></div>
                        <button 
                           onClick={(e) => generatedImage && toggleFavorite(e, generatedImage.id)} 
                           className={`p-2 rounded-full hover:bg-white/10 transition-colors ${generatedImage.isFavorite ? 'text-red-500' : 'text-slate-300'}`}
                        >
                           <HeartIcon solid={generatedImage.isFavorite} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 max-w-sm z-10">
                      {editState.status === 'loading' ? (
                        <div className="flex flex-col items-center">
                          <div className="relative w-20 h-20 mb-8">
                            <div className="absolute inset-0 border-t-4 border-banana-400 border-r-4 border-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-t-4 border-banana-200 border-l-4 border-transparent rounded-full animate-spin direction-reverse opacity-70"></div>
                          </div>
                          <h3 className="text-xl font-medium text-white mb-2">Creating Magic</h3>
                          <p className="text-slate-400 text-sm">
                            Gemini is reimagining your pixels...
                          </p>
                        </div>
                      ) : (
                        <div className="opacity-50 flex flex-col items-center">
                          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 transform rotate-3">
                             <MagicIcon />
                          </div>
                          <p className="text-slate-400 text-lg">
                            Ready to create
                          </p>
                          <p className="text-slate-600 text-sm mt-1">
                            Results will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  )}
               </div>
            </div>

            {/* History Panel */}
            {history.length > 0 && (
              <div className="bg-slate-800 rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden flex flex-col max-h-[400px]">
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/80">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <HistoryIcon /> Recent Edits
                  </h3>
                  <span className="bg-slate-900 text-slate-500 text-xs px-2 py-1 rounded-full">{history.length}</span>
                </div>
                
                <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {history.map((item, index) => (
                    <div 
                      key={item.id}
                      onClick={() => handleHistoryRestore(item)}
                      className={`group flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer border ${
                        generatedImage?.id === item.id 
                          ? 'bg-slate-700/60 border-banana-500/40 shadow-inner' 
                          : 'bg-transparent border-transparent hover:bg-slate-700/40 hover:border-slate-700'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-600/50 shadow-sm relative group-hover:scale-105 transition-transform">
                        <img 
                          src={item.imageUrl} 
                          alt="Thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                         <div className="flex items-center justify-between gap-2 h-6">
                            {editingLabelId === item.id ? (
                               <div className="flex items-center gap-1 flex-1 bg-slate-900 rounded p-0.5 border border-banana-500/50" onClick={e => e.stopPropagation()}>
                                  <input 
                                    type="text" 
                                    value={tempLabel}
                                    onChange={(e) => setTempLabel(e.target.value)}
                                    className="bg-transparent border-none px-2 py-0 text-xs text-white w-full focus:ring-0 placeholder:text-slate-600"
                                    placeholder="Label..."
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if(e.key === 'Enter') saveLabel(e as any, item.id);
                                      if(e.key === 'Escape') cancelEditingLabel(e as any);
                                    }}
                                  />
                                  <button onClick={(e) => saveLabel(e, item.id)} className="p-1 hover:bg-slate-800 rounded text-green-400">
                                    <CheckIcon />
                                  </button>
                               </div>
                            ) : (
                               <>
                                 <div className="flex items-center gap-2 group/label max-w-[80%]">
                                    <span className={`text-sm font-medium truncate ${item.label ? 'text-banana-200' : 'text-slate-300'}`}>
                                      {item.label || `Version ${history.length - index}`}
                                    </span>
                                    <button 
                                      onClick={(e) => startEditingLabel(e, item)}
                                      className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="Rename"
                                    >
                                      <PencilIcon />
                                    </button>
                                 </div>
                                 <div className="flex items-center">
                                    <button 
                                        onClick={(e) => toggleFavorite(e, item.id)}
                                        className={`p-1 rounded-full hover:bg-slate-600/50 transition-colors opacity-0 group-hover:opacity-100 ${item.isFavorite ? 'opacity-100' : ''}`}
                                    >
                                        <HeartIcon solid={item.isFavorite} />
                                    </button>
                                 </div>
                               </>
                            )}
                         </div>
                        
                        <p className="text-xs text-slate-500 line-clamp-1 truncate w-full pr-4">
                          {item.prompt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="w-full border-t border-slate-800 mt-auto bg-slate-900/50 py-6 text-center text-slate-500 text-xs">
         <p>GenAI Image Editor • Powered by Google Gemini</p>
      </footer>
    </div>
  );
}