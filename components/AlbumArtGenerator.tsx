
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
      playSynthSound('powerchord');
    } catch (err) {
      console.error(err);
      setError("AI-studion är fullbokad! Vänta en minut och försök igen.");
      playSynthSound('incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-rock text-purple-500 italic uppercase tracking-tighter">Album Cover Designer</h2>
        <p className="text-zinc-400 text-sm mt-1">Designa ditt nästa vinyl-omslag med AI.</p>
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
          className="flex-1 bg-black border-2 border-zinc-800 p-4 rounded-xl focus:border-purple-500 outline-none text-white font-bold placeholder:text-zinc-700"
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !title}
          className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-xl font-bold uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><ImageIcon size={20} /> SKAPA OMSLAG</>}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-950/50 rounded-2xl border-2 border-dashed border-zinc-800 animate-pulse">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
          <p className="font-retro text-[10px] text-zinc-500 uppercase tracking-widest">MIXING RETRO TRACKS...</p>
        </div>
      )}

      {imageUrl && !loading && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="relative group max-w-md mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <img 
              src={imageUrl} 
              alt="Generated Album Art" 
              className="relative w-full aspect-square object-cover rounded-2xl border-2 border-zinc-800 shadow-2xl"
            />
          </div>
          <div className="flex justify-center">
            <a 
              href={imageUrl} 
              download={`nestor-${title.toLowerCase().replace(/\s+/g, '-')}.png`}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-xs font-retro uppercase transition-colors"
            >
              <Download size={16} /> Ladda ner
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumArtGenerator;
