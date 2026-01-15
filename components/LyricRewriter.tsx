
import React, { useState } from 'react';
import { rewriteAsBallad } from '../services/gemini.ts';
import { Loader2, Music4 } from 'lucide-react';
import { playSynthSound } from '../services/audio.ts';

const LyricRewriter: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lyrics, setLyrics] = useState('');

  const handleRewrite = async () => {
    if (!input) return;
    setLoading(true);
    playSynthSound('generate');
    try {
      const res = await rewriteAsBallad(input);
      setLyrics(res);
      playSynthSound('success');
    } catch (err) {
      console.error(err);
      playSynthSound('incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-rock text-cyan-500">Power-Ballad Generator</h2>
        <p className="text-zinc-400 text-sm mt-1">Förvandla vardagen till en episk rockdänga.</p>
      </div>

      <div className="space-y-4">
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => playSynthSound('click')}
          placeholder="Skriv något tråkigt, t.ex: 'Jag glömde mina nycklar på bussen'..."
          className="w-full h-32 bg-black border-2 border-zinc-800 p-4 rounded-xl focus:border-pink-500 outline-none transition-all text-white resize-none"
        />
        <button 
          onClick={handleRewrite}
          disabled={loading || !input}
          className="w-full bg-cyan-600 hover:bg-cyan-500 p-4 rounded-xl font-bold uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Music4 size={20} /> GÖR DET EPISKT</>}
        </button>
      </div>

      {lyrics && (
        <div className="mt-8 bg-zinc-950 p-8 rounded-2xl border-l-4 border-cyan-500 shadow-xl font-serif animate-in slide-in-from-top-4 duration-500">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-zinc-200 italic">
              {lyrics}
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-end">
            <span className="text-[10px] font-retro text-zinc-600 uppercase">Written by Gemini 3 Flash / Inspired by Nestor</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LyricRewriter;
