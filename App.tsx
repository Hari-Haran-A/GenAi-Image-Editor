import React, { useState, useRef, useEffect } from 'react';
import { Button } from './components/Button';
import { generateEditedImage } from './services/geminiService';
import { ImageFile, EditState, GeneratedImage, AIProvider } from './types';

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

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

const EyeIcon = ({ off }: { off?: boolean }) => {
  if (off) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
};

// API Key Modal Component
const ApiKeyModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialGoogleKey,
  initialOpenAIKey,
  initialProvider
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (googleKey: string, openaiKey: string, provider: AIProvider) => void;
  initialGoogleKey: string;
  initialOpenAIKey: string;
  initialProvider: AIProvider;
}) => {
  const [googleKey, setGoogleKey] = useState(initialGoogleKey);
  const [openaiKey, setOpenaiKey] = useState(initialOpenAIKey);
  const [provider, setProvider] = useState<AIProvider>(initialProvider);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setGoogleKey(initialGoogleKey);
    setOpenaiKey(initialOpenAIKey);
    setProvider(initialProvider);
  }, [initialGoogleKey, initialOpenAIKey, initialProvider, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-700 bg-slate-800/50">
          <div className="w-12 h-12 bg-banana-500/10 rounded-xl flex items-center justify-center mb-4 text-banana-400">
            <KeyIcon />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Configure AI Provider</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Select your preferred AI provider and enter the corresponding API key.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Provider Selection */}
          <div className="flex bg-slate-900 p-1 rounded-xl">
             <button 
               onClick={() => setProvider('google')}
               className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${provider === 'google' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               Google Gemini
             </button>
             <button 
               onClick={() => setProvider('openai')}
               className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${provider === 'openai' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               OpenAI
             </button>
          </div>

          {provider === 'google' ? (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 bg-banana-500/10 hover:bg-banana-500/20 border border-banana-500/20 hover:border-banana-500/40 rounded-xl transition-all group"
                >
                    <div>
                    <p className="font-semibold text-banana-200 group-hover:text-banana-100">Get Gemini API Key</p>
                    <p className="text-xs text-banana-500/70 group-hover:text-banana-400">Google AI Studio</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-banana-400 transform group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </a>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                    Google API Key
                    </label>
                    <div className="relative">
                    <input
                        type={showKey ? "text" : "password"}
                        value={googleKey}
                        onChange={(e) => setGoogleKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-banana-500/50 focus:border-banana-500 outline-none transition-all font-mono text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                    >
                        <EyeIcon off={showKey} />
                    </button>
                    </div>
                </div>
             </div>
          ) : (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl transition-all group"
                >
                    <div>
                    <p className="font-semibold text-emerald-200 group-hover:text-emerald-100">Get OpenAI API Key</p>
                    <p className="text-xs text-emerald-500/70 group-hover:text-emerald-400">OpenAI Platform</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-400 transform group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </a>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                    OpenAI API Key
                    </label>
                    <div className="relative">
                    <input
                        type={showKey ? "text" : "password"}
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all font-mono text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                    >
                        <EyeIcon off={showKey} />
                    </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Note: OpenAI edits require square images. Images will be auto-cropped if necessary.
                    </p>
                </div>
             </div>
          )}

        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
           <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
             Cancel
           </Button>
          <Button 
            variant="primary" 
            onClick={() => onSave(googleKey.trim(), openaiKey.trim(), provider)}
            className="flex-1"
          >
            Save Configuration
          </Button>
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

  // API Key & Provider State
  const [googleApiKey, setGoogleApiKey] = useState<string>('');
  const [openaiApiKey, setOpenaiApiKey] = useState<string>('');
  const [provider, setProvider] = useState<AIProvider>('google');
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      // Load API Keys
      const storedGoogleKey = localStorage.getItem('gemini_api_key');
      const storedOpenaiKey = localStorage.getItem('openai_api_key');
      const storedProvider = localStorage.getItem('ai_provider') as AIProvider;
      
      if (storedGoogleKey) setGoogleApiKey(storedGoogleKey);
      if (storedOpenaiKey) setOpenaiApiKey(storedOpenaiKey);
      if (storedProvider) setProvider(storedProvider);

      // Load App State
      const savedState = localStorage.getItem('genai-editor-state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.prompt) setPrompt(parsed.prompt);
        if (parsed.history && Array.isArray(parsed.history)) setHistory(parsed.history);
        if (parsed.generatedImage) setGeneratedImage(parsed.generatedImage);
      }
    } catch (e) {
      console.warn("Failed to load state from local storage", e);
    }
  }, []);

  // Save state helper
  const saveToLocalStorage = (newState: Partial<{ prompt: string, history: GeneratedImage[], generatedImage: GeneratedImage | null }>) => {
    try {
      const currentStateString = localStorage.getItem('genai-editor-state');
      const currentState = currentStateString ? JSON.parse(currentStateString) : {};
      const mergedState = { ...currentState, ...newState };
      localStorage.setItem('genai-editor-state', JSON.stringify(mergedState));
    } catch (e) {
      try {
        localStorage.setItem('genai-editor-state', JSON.stringify({ prompt: newState.prompt }));
      } catch (e2) {}
    }
  };

  const handleSaveConfig = (gKey: string, oKey: string, prov: AIProvider) => {
    setGoogleApiKey(gKey);
    setOpenaiApiKey(oKey);
    setProvider(prov);
    
    localStorage.setItem('gemini_api_key', gKey);
    localStorage.setItem('openai_api_key', oKey);
    localStorage.setItem('ai_provider', prov);
    
    setShowApiKeyModal(false);
  };

  useEffect(() => { saveToLocalStorage({ prompt }); }, [prompt]);
  useEffect(() => { saveToLocalStorage({ history }); }, [history]);
  useEffect(() => { saveToLocalStorage({ generatedImage }); }, [generatedImage]);


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
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
          setHistory([]);
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
          setHistory([]);
          setEditState({ status: 'idle' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) return;

    // Check credentials based on provider
    let apiKeyToUse = '';
    if (provider === 'google') {
       apiKeyToUse = googleApiKey || (process.env.API_KEY || '');
       if (!apiKeyToUse) {
         setShowApiKeyModal(true);
         return;
       }
    } else if (provider === 'openai') {
       apiKeyToUse = openaiApiKey;
       if (!apiKeyToUse) {
         setShowApiKeyModal(true);
         return;
       }
    }

    setEditState({ status: 'loading' });

    try {
      const resultImageUrl = await generateEditedImage(
        selectedImage.base64,
        selectedImage.mimeType,
        prompt,
        apiKeyToUse,
        provider
      );
      
      const newGeneratedImage: GeneratedImage = {
        id: crypto.randomUUID(),
        imageUrl: resultImageUrl,
        prompt: prompt,
        timestamp: Date.now(),
        isFavorite: false,
        label: provider === 'openai' ? 'OpenAI Edit' : 'Gemini Edit'
      };

      setGeneratedImage(newGeneratedImage);
      setHistory(prev => [newGeneratedImage, ...prev]);
      setEditState({ status: 'success' });
    } catch (error: any) {
       console.error("Generation error:", error);
       let errorMessage = error.message || 'An unknown error occurred';
       
       if (errorMessage === 'API_KEY_MISSING') {
           setShowApiKeyModal(true);
           setEditState({ status: 'idle' });
           return;
       }
       
       if (errorMessage === 'INVALID_API_KEY') {
           setShowApiKeyModal(true);
           errorMessage = 'Invalid API Key provided. Please check your key.';
       }

       if (errorMessage === 'QUOTA_EXCEEDED') {
           errorMessage = 'Rate limit reached. Auto-retries exhausted. Please wait 1 minute.';
       }
       
       if (errorMessage === 'BILLING_LIMIT_REACHED') {
           errorMessage = 'Billing limit reached. Please check your OpenAI account credits.';
       }
       
       if (errorMessage === 'NETWORK_ERROR') {
           errorMessage = 'Connection failed. Please check your internet or disable ad-blockers.';
       }

       setEditState({ 
          status: 'error', 
          errorMessage 
        });
    }
  };

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
      
      <ApiKeyModal 
        isOpen={showApiKeyModal} 
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleSaveConfig}
        initialGoogleKey={googleApiKey}
        initialOpenAIKey={openaiApiKey}
        initialProvider={provider}
      />

      {/* Navbar */}
      <div className="w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-banana-400 to-banana-600 rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-banana-500/20 shrink-0 transform hover:scale-105 transition-transform duration-200">
               <span className="font-bold text-xl">AI</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-none">GenAI Editor</h1>
              <p className="text-slate-400 text-xs md:text-sm font-medium">
                  Powered by {provider === 'google' ? 'Gemini 2.5' : 'OpenAI DALL·E'}
              </p>
            </div>
          </div>
          
          <button 
             onClick={() => setShowApiKeyModal(true)}
             className={`p-2 rounded-lg transition-colors border flex items-center gap-2 ${
                 (provider === 'google' && googleApiKey) || (provider === 'openai' && openaiApiKey)
                 ? 'text-banana-400 border-banana-500/30 bg-banana-500/10' 
                 : 'text-slate-400 border-slate-700 hover:text-white'
             }`}
             title="Configure AI Provider"
          >
             <KeyIcon />
             <span className="text-xs font-semibold hidden md:inline uppercase">{provider}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 pt-28 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Input Section */}
          <div className="flex flex-col gap-6 w-full">
            <div className="w-full bg-slate-800 rounded-2xl p-1 border border-slate-700/50 shadow-sm flex-shrink-0 relative z-0">
              {!selectedImage ? (
                <div 
                  className="w-full min-h-[300px] md:min-h-[400px] border-2 border-dashed border-slate-600 hover:border-banana-400/50 rounded-xl bg-slate-800 hover:bg-slate-750 transition-all duration-300 flex flex-col items-center justify-center p-6 cursor-pointer relative group"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
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
                  <img src={selectedImage.previewUrl} alt="Original" className="max-h-[500px] w-auto max-w-full object-contain shadow-2xl" />
                  <button onClick={handleClear} className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-white/10" title="Remove image">
                    <TrashIcon />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide text-white/90 border border-white/10">ORIGINAL</div>
                </div>
              )}
            </div>

            {/* Prompt Section */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
              <div className="p-4 md:p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="prompt" className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <MagicIcon /> Describe your edit
                  </label>
                  {prompt && <button onClick={() => setPrompt('')} className="text-xs text-slate-500 hover:text-slate-300">Clear</button>}
                </div>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Change the background to a snowy mountain..."
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-banana-500/50 focus:border-banana-500 transition-all resize-none text-base md:text-lg leading-relaxed"
                  disabled={editState.status === 'loading'}
                />
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Try these ideas</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((p, i) => (
                      <button key={i} onClick={() => setPrompt(p.text)} className="text-xs sm:text-sm bg-slate-700/40 hover:bg-slate-700 hover:text-white text-slate-400 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-slate-600" title={p.text}>{p.label}</button>
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <Button onClick={handleGenerate} className="w-full py-4 text-lg shadow-lg shadow-banana-500/10" disabled={!selectedImage || !prompt.trim()} isLoading={editState.status === 'loading'}>
                    <span className="flex items-center gap-2">
                      Generate with {provider === 'google' ? 'Gemini' : 'OpenAI'}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </span>
                  </Button>
                  {editState.status === 'error' && (
                    <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${editState.errorMessage?.includes('Billing') ? 'bg-amber-900/20 border-amber-500/20' : 'bg-red-900/20 border-red-500/20'}`}>
                      <div className={`mt-0.5 ${editState.errorMessage?.includes('Billing') ? 'text-amber-500' : 'text-red-400'}`}>
                         {editState.errorMessage?.includes('Billing') || editState.errorMessage?.includes('Rate') ? <AlertIcon /> : <XMarkIcon />}
                      </div>
                      <div>
                         <p className={`font-medium text-sm ${editState.errorMessage?.includes('Billing') ? 'text-amber-200' : 'text-red-200'}`}>
                            {editState.errorMessage?.includes('Billing') ? 'Account Quota Issue' : (editState.errorMessage?.includes('Rate') ? 'Rate Limit Reached' : 'Generation Failed')}
                         </p>
                         <p className={`${editState.errorMessage?.includes('Billing') ? 'text-amber-300/70' : 'text-red-300/70'} text-sm mt-1`}>{editState.errorMessage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col gap-6 w-full sticky top-24" ref={resultRef}>
            <div className="bg-slate-800 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden flex flex-col h-full min-h-[500px]">
               <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                 <h2 className="text-base md:text-lg font-semibold text-slate-200 flex items-center gap-2"><PhotoIcon /> Generated Result</h2>
                 <div className="flex items-center gap-3">
                   {generatedImage && (
                     <button onClick={downloadImage} className="flex items-center gap-2 px-3 py-1.5 bg-banana-400 hover:bg-banana-500 text-slate-900 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-lg shadow-banana-500/20" title="Download Image">
                       <DownloadIcon /><span className="hidden sm:inline">Download</span>
                     </button>
                   )}
                   <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-700/50">
                      <button onClick={handleUndo} disabled={!canUndo} className="p-2 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors" title="Undo (Ctrl+Z)"><UndoIcon /></button>
                       <div className="w-px h-4 bg-slate-700"></div>
                       <button onClick={handleRedo} disabled={!canRedo} className="p-2 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors" title="Redo (Ctrl+Y)"><RedoIcon /></button>
                   </div>
                 </div>
               </div>
               <div className="flex-1 bg-slate-900 relative flex items-center justify-center overflow-hidden group p-4">
                   <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  {generatedImage ? (
                    <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300">
                      <img src={generatedImage.imageUrl} alt="Generated Result" className="max-w-full max-h-[600px] object-contain shadow-2xl rounded-lg" />
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-full shadow-2xl translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <Button variant="ghost" onClick={downloadImage} className="text-slate-300 hover:text-white py-2 px-4 h-auto rounded-full hover:bg-white/10"><DownloadIcon /></Button>
                        <div className="w-px h-4 bg-slate-700"></div>
                        <button onClick={(e) => generatedImage && toggleFavorite(e, generatedImage.id)} className={`p-2 rounded-full hover:bg-white/10 transition-colors ${generatedImage.isFavorite ? 'text-red-500' : 'text-slate-300'}`}><HeartIcon solid={generatedImage.isFavorite} /></button>
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
                          <p className="text-slate-400 text-sm">Gemini is reimagining your pixels...</p>
                        </div>
                      ) : (
                        <div className="opacity-50 flex flex-col items-center">
                          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 transform rotate-3"><MagicIcon /></div>
                          <p className="text-slate-400 text-lg">Ready to create</p>
                          <p className="text-slate-600 text-sm mt-1">Results will appear here</p>
                        </div>
                      )}
                    </div>
                  )}
               </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-slate-800 rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden flex flex-col max-h-[400px]">
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/80">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <HistoryIcon /> Recent Edits <span className="bg-slate-900 text-slate-500 text-xs px-2 py-1 rounded-full ml-1">{history.length}</span>
                  </h3>
                  <button onClick={handleClearHistory} className="text-xs text-slate-500 hover:text-red-400 hover:bg-red-400/10 px-2 py-1 rounded transition-colors">Clear All</button>
                </div>
                <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
                  {history.map((item, index) => (
                    <div key={item.id} onClick={() => handleHistoryRestore(item)} className={`group flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer border ${generatedImage?.id === item.id ? 'bg-slate-700/60 border-banana-500/40 shadow-inner' : 'bg-transparent border-transparent hover:bg-slate-700/40 hover:border-slate-700'}`}>
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-600/50 shadow-sm relative group-hover:scale-105 transition-transform">
                        <img src={item.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                         <div className="flex items-center justify-between gap-2 h-6">
                            {editingLabelId === item.id ? (
                               <div className="flex items-center gap-1 flex-1 bg-slate-900 rounded p-0.5 border border-banana-500/50" onClick={e => e.stopPropagation()}>
                                  <input type="text" value={tempLabel} onChange={(e) => setTempLabel(e.target.value)} className="bg-transparent border-none px-2 py-0 text-xs text-white w-full focus:ring-0 placeholder:text-slate-600" placeholder="Label..." autoFocus onKeyDown={(e) => {if(e.key === 'Enter') saveLabel(e as any, item.id); if(e.key === 'Escape') cancelEditingLabel(e as any);}} />
                                  <button onClick={(e) => saveLabel(e, item.id)} className="p-1 hover:bg-slate-800 rounded text-green-400"><CheckIcon /></button>
                               </div>
                            ) : (
                               <>
                                 <div className="flex items-center gap-2 group/label max-w-[80%]">
                                    <span className={`text-sm font-medium truncate ${item.label ? 'text-banana-200' : 'text-slate-300'}`}>{item.label || `Version ${history.length - index}`}</span>
                                    <button onClick={(e) => startEditingLabel(e, item)} className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="Rename"><PencilIcon /></button>
                                 </div>
                                 <div className="flex items-center">
                                    <button onClick={(e) => toggleFavorite(e, item.id)} className={`p-1 rounded-full hover:bg-slate-600/50 transition-colors opacity-0 group-hover:opacity-100 ${item.isFavorite ? 'opacity-100' : ''}`}><HeartIcon solid={item.isFavorite} /></button>
                                 </div>
                               </>
                            )}
                         </div>
                        <p className="text-xs text-slate-500 line-clamp-1 truncate w-full pr-4">{item.prompt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="w-full border-t border-slate-800 mt-auto bg-slate-900/50 py-6 text-center text-slate-500 text-xs"><p>GenAI Image Editor • Powered by Google Gemini & OpenAI</p></footer>
    </div>
  );
}