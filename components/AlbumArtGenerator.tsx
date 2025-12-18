
import React, { useState } from 'react';
import { generateAlbumArt } from '../services/gemini';
import { Loader2, Download, Image as ImageIcon, Share2 } from 'lucide-react';
import { playSynthSound } from '../services/audio';

const AlbumArtGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title) return;
    setLoading(true);
    playSynthSound('generate');
    try {
      const url = await generateAlbumArt(title);
      setImageUrl(url);
      playSynthSound('success');
    } catch (err) {
      console.error(err);
      playSynthSound('incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    playSynthSound('click');

    try {
      if (navigator.share) {
        // Convert base64 to File object for sharing
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${title.replace(/\s+/g, '-').toLowerCase()}-album.png`, { type: 'image/png' });

        const shareData = {
          title: `Nestor Album: ${title}`,
          text: `Kolla in mitt nya Nestor-omslag för "${title}"! Skapat i Nestor Fan Portal. #Nestor #Rock #Falköping`,
          files: [file],
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          // Fallback share (text only)
          await navigator.share({
            title: `Nestor Album: ${title}`,
            text: `Kolla in mitt nya Nestor-omslag för "${title}"!`,
            url: window.location.href
          });
        }
      } else {
        // Fallback for browsers that don't support sharing
        alert("Delning stöds tyvärr inte i din webbläsare. Spara bilden och dela den manuellt!");
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-rock text-purple-500 italic">Album Cover Designer</h2>
        <p className="text-zinc-400 text-sm mt-1">Designa ditt nästa vinyl-omslag.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => playSynthSound('click')}
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
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-6">
              <a 
                href={imageUrl} 
                download={`${title}-album-art.png`}
                onClick={() => playSynthSound('click')}
                title="Ladda ner"
                className="bg-white text-black p-4 rounded-full hover:scale-110 transition-transform shadow-lg"
              >
                <Download size={28} />
              </a>
              <button 
                onClick={handleShare}
                title="Dela"
                className="bg-cyan-500 text-black p-4 rounded-full hover:scale-110 transition-transform shadow-lg"
              >
                <Share2 size={28} />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-xs text-zinc-500 font-retro italic uppercase">Generated using Gemini 2.5 Flash Image Model</p>
            <div className="flex gap-4 md:hidden">
               <button onClick={handleShare} className="flex items-center gap-2 text-cyan-500 font-bold text-sm uppercase">
                 <Share2 size={16} /> Dela bild
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumArtGenerator;
