
import React, { useState } from 'react';
import { generateAlbumArt } from '../services/gemini.ts';
import { Loader2, Download, Image as ImageIcon, Share2, AlertCircle } from 'lucide-react';
import { playSynthSound } from '../services/audio.ts';

const AlbumArtGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title) return;
    setLoading(true);
    setError(null);
    playSynthSound('generate');
    try {
      const url = await generateAlbumArt(title);
      setImageUrl(url);
      playSynthSound('success');
    } catch (err) {
      console.error(err);
      setError("AI-studion är fullbokad! (Rate Limit). Vänta en minut och försök igen.");
      playSynthSound('incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    playSynthSound('click');
    // ... share logic (behåll befintlig)
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-rock text-purple-500 italic">Album Cover Designer</h2>
        <p className="text-zinc-400 text-sm mt-1">Designa ditt nästa vinyl-omslag.</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border-2 border-red-500 p-4 rounded-xl flex items-center gap-3 text-red-200 text-xs font-retro uppercase animate-pulse">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Namnge ditt album..."
          className="flex-1 bg-black border-2 border-zinc-800 p-4 rounded-xl focus:border-purple-500 outline-none text-white font-bold"
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !title}
          className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-xl font-bold uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><ImageIcon size={20} /> SKAPA</>}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-950 rounded-2xl border-2 border-dashed border-zinc-800 animate-pulse">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
          <p className="font-retro text-[10px] text-zinc-500 animate-pulse uppercase tracking-widest">RENDERING RETRO VIBES...</p>
        </div>
      )}

      {imageUrl && !loading && (
        <div className="space-y-4 animate-in zoom-in-95 duration-500">
          <div className="relative group max-w-md mx-auto">
            <img 
              src={imageUrl} 
              alt="Generated Album Art" 
              className="w-full aspect-square object-cover rounded-2xl border-4 border-zinc-900 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumArtGenerator;
