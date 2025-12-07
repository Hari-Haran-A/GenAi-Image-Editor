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

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const EyeIcon = ({ visible }: { visible: boolean }) => (
  visible ? (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
);

const ApiKeyModal = ({ 
  onClose, 
  isVercelEnv,
  onSaveKey,
  currentKey,
  error
}: { 
  onClose: () => void;
  isVercelEnv: boolean;
  onSaveKey: (key: string) => void;
  currentKey: string;
  error?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [inputKey, setInputKey] = useState(currentKey || '');
  const [showKey, setShowKey] = useState(false);

  const handleConnect = async () => {
    if ((window as any).aistudio) {
      setLoading(true);
      try {
        await (window as any).aistudio.openSelectKey();
        // Wait a moment for the key to register
        setTimeout(() => {
          onClose();
          setLoading(false);
        }, 1000);
      } catch (e) {
        console.error("Failed to select key", e);
        setLoading(false);
      }
    }
  };

  const handleSaveManual = () => {
    if (inputKey.trim()) {
      onSaveKey(inputKey.trim());
      onClose();
    }
  };

  const handleClearKey = () => {
    onSaveKey('');
    setInputKey('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <XMarkIcon />
        </button>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-banana-400/10 rounded-full flex items-center justify-center text-banana-400 ring-1 ring-banana-400/20">
            <KeyIcon />
          </div>
          
          <h2 className="text-xl font-bold text-white">
            API Key Required
          </h2>
          <p className="text-sm text-slate-400">
            To generate images with Gemini 2.5, you need to provide a valid API key.
          </p>

          <a 
            href="https://ai.google.dev/gemini-api/docs/setup" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-xl transition-all border border-slate-600 group"
          >
            <BookIcon />
            <span>Read API Key Setup Guide</span>
            <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </a>

          {error && (
            <div className="w-full bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-left">
              <p className="text-red-300 text-xs flex gap-2 items-start">
                <span className="mt-0.5 shrink-0"><XMarkIcon /></span>
                {error}
              </p>
            </div>
          )}
          
          <div className="w-full text-left space-y-4 mt-2">
            
            {/* Manual Entry Section */}
             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 space-y-3">
               <label className="block text-sm font-semibold text-slate-300">Enter API Key Manually</label>
               <div className="relative">
                 <input 
                   type={showKey ? "text" : "password"}
                   value={inputKey}
                   onChange={(e) => setInputKey(e.target.value)}
                   placeholder="AIzaSy..."
                   className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-banana-500 focus:outline-none"
                 />
                 <button 
                   onClick={() => setShowKey(!showKey)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                   type="button"
                 >
                   <EyeIcon visible={showKey} />
                 </button>
               </div>
               
               <div className="flex gap-2">
                 <Button onClick={handleSaveManual} className="flex-1 py-2 text-sm" disabled={!inputKey.trim()}>
                   Save Key
                 </Button>
                 {currentKey && (
                   <Button onClick={handleClearKey} variant="secondary" className="px-3 py-2 text-sm text-red-400 hover:text-red-300 border-red-500/30 hover:bg-red-500/10">
                     Remove
                   </Button>
                 )}
               </div>
               <div className="flex justify-between items-center text-xs mt-2">
                  <span className="text-slate-500">Stored locally in browser.</span>
               </div>
             </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-800 px-2 text-slate-500">OR</span></div>
            </div>

            {isVercelEnv ? (
              <div className="text-slate-300 text-sm space-y-3">
                 <p>For permanent deployment, configure your environment variables:</p>
                 <div className="bg-slate-950 p-3 rounded-lg border border-slate-700 font-mono text-xs select-all text-slate-300">
                    API_KEY=your_key_here
                 </div>
                 <div className="text-xs text-slate-500 flex flex-col gap-1">
                   <span>Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-banana-400 hover:underline">Google AI Studio</a>.</span>
                 </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Button 
                  onClick={handleConnect} 
                  isLoading={loading}
                  variant="secondary"
                  className="w-full"
                >
                  Connect Google Account
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  Securely connects via AI Studio (Preview Only)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [editState, setEditState] = useState<EditState>({ status: 'idle' });
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState<string>('');
  
  // API Key State
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyError, setApiKeyError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load state and API key from localStorage on mount
  useEffect(() => {
    try {
      // Load API Key
      const storedKey = localStorage.getItem('gemini_api_key');
      if (storedKey) {
        setApiKey(storedKey);
      } else if (!process.env.API_KEY) {
        // If no stored key and no environment key, automatically open modal
        setShowApiKeyModal(true);
      }

      // Load App State
      const savedState = localStorage.getItem('genai-editor-state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.prompt) setPrompt(parsed.prompt);
        if (parsed.history && Array.isArray(parsed.history)) setHistory(parsed.history);
        
        // Only restore generated image if it wasn't cleared intentionally
        if (parsed.generatedImage) setGeneratedImage(parsed.generatedImage);
      }
    } catch (e) {
      console.warn("Failed to load state from local storage", e);
    }
  }, []);

  // Save state to localStorage helper
  const saveToLocalStorage = (newState: Partial<{ prompt: string, history: GeneratedImage[], generatedImage: GeneratedImage | null }>) => {
    try {
      const currentStateString = localStorage.getItem('genai-editor-state');
      const currentState = currentStateString ? JSON.parse(currentStateString) : {};
      
      const mergedState = { ...currentState, ...newState };
      
      // Simple quota management: Limit history length if needed, or remove heavy image data if we hit limits
      // For this demo, we'll try to save everything but handle the error if it's too big
      localStorage.setItem('genai-editor-state', JSON.stringify(mergedState));
    } catch (e) {
      console.warn("Storage quota exceeded or save failed. Clearing heavy image data.");
      // Fallback: Try saving only text data
      try {
        const { history, generatedImage, ...rest } = newState as any;
        // Strip base64 from history if needed, or just save current prompt
        localStorage.setItem('genai-editor-state', JSON.stringify({ 
           prompt: newState.prompt 
        }));
      } catch (e2) {
        console.error("Critical storage failure", e2);
      }
    }
  };

  // Auto-save effects
  useEffect(() => {
    saveToLocalStorage({ prompt });
  }, [prompt]);

  useEffect(() => {
    saveToLocalStorage({ history });
  }, [history]);

  useEffect(() => {
    saveToLocalStorage({ generatedImage });
  }, [generatedImage]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    // Clear error when new key is saved
    setApiKeyError('');
    if (key) {
      localStorage.setItem('gemini_api_key', key);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

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
    setApiKeyError(''); // Clear previous errors

    try {
      const resultImageUrl = await generateEditedImage(
        selectedImage.base64,
        selectedImage.mimeType,
        prompt,
        apiKey // Pass the manual API key if present
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
      if (error.message === 'API_KEY_MISSING') {
        setEditState({ status: 'idle' });
        setApiKeyError('');
        setShowApiKeyModal(true);
      } else if (error.message === 'INVALID_API_KEY') {
        setEditState({ status: 'idle' });
        setApiKeyError('The API key provided is invalid. Please check for extra spaces or characters and try again.');
        // Automatically open the modal to let them fix it
        setShowApiKeyModal(true);
        // We don't clear the input field in the modal (so they can edit), but we might want to flag the state
      } else {
        setEditState({ 
          status: 'error', 
          errorMessage: error.message || 'An unknown error occurred' 
        });
      }
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
    // Clear state from local storage too if needed, or just let auto-save handle it
    saveToLocalStorage({ generatedImage: null, history: [] });
  };

  const handleClearHistory = () => {
    if (history.length > 0 && window.confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
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

  const suggestedPrompts = [
    { label: "Add Retro Filter", text: "Add a retro filter" },
    { label: "Remove Person", text: "Remove the person in the background" },
    { label: "Watercolor", text: "Make it a watercolor painting" },
    { label: "Sci-Fi Background", text: "Add a sci-fi cyberpunk background" },
    { label: "Dreamy Scrapbook", text: "A dreamy scrapbook aesthetic collage of a cute young girl with short hair in a shiny pastel pink saree. Multiple angles and poses: sitting and smiling, holding a light, and a close up. White grid background, cut-out photo effect with white borders. Decorated with stickers: pastel bows, flowers, hearts, butterflies. Soft lighting, smooth skin, feminine aesthetic, Pinterest-style moodboard, ultra high quality." }
  ];

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* API Key Modal */}
      {showApiKeyModal && (
        <ApiKeyModal 
          onClose={() => setShowApiKeyModal(false)} 
          isVercelEnv={typeof (window as any).aistudio === 'undefined'}
          onSaveKey={handleSaveApiKey}
          currentKey={apiKey}
          error={apiKeyError}
        />
      )}

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
          <Button variant="ghost" onClick={() => setShowApiKeyModal(true)} className="text-xs text-slate-500 hover:text-banana-400 flex items-center gap-2">
             <KeyIcon /> {apiKey ? <span className="text-green-400 hidden sm:inline">• Key Set</span> : <span className="hidden sm:inline">Set Key</span>}
          </Button>
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
                        onClick={() => setPrompt(p.text)}
                        className="text-xs sm:text-sm bg-slate-700/40 hover:bg-slate-700 hover:text-white text-slate-400 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-slate-600"
                        title={p.text}
                      >
                        {p.label}
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
                 <div className="flex items-center gap-3">
                   {generatedImage && (
                     <button 
                       onClick={downloadImage}
                       className="flex items-center gap-2 px-3 py-1.5 bg-banana-400 hover:bg-banana-500 text-slate-900 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-lg shadow-banana-500/20"
                       title="Download Image"
                     >
                       <DownloadIcon />
                       <span className="hidden sm:inline">Download</span>
                     </button>
                   )}
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
                    <span className="bg-slate-900 text-slate-500 text-xs px-2 py-1 rounded-full ml-1">{history.length}</span>
                  </h3>
                  <button 
                    onClick={handleClearHistory}
                    className="text-xs text-slate-500 hover:text-red-400 hover:bg-red-400/10 px-2 py-1 rounded transition-colors"
                  >
                    Clear All
                  </button>
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