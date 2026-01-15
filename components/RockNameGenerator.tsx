
import React, { useState, useRef, useEffect } from 'react';
import { generateRockPersona } from '../services/gemini.ts';
import { Loader2, User, Utensils, Camera, X, Zap, Check, Share2, AlertTriangle } from 'lucide-react';
import { playSynthSound } from '../services/audio.ts';

const RockNameGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [food, setFood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    playSynthSound('click');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Kunde inte komma åt kameran.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      setIsFlashing(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
        setCapturedImage(canvas.toDataURL('image/png'));
        playSynthSound('success');
        setTimeout(() => {
          setIsFlashing(false);
          stopCamera();
        }, 150);
      }
    }
  };

  const handleShareResult = async () => {
    if (!result) return;
    playSynthSound('click');
    const text = `Mitt Nestor rock-namn är ${result.stageName}! #Nestor #Rock`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Min Nestor Persona', text, url: window.location.href }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(text);
      alert("Kopierat!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !food) return;
    setLoading(true);
    setError(null);
    playSynthSound('generate');
    try {
      const data = await generateRockPersona(name, food);
      setResult(data);
      playSynthSound('success');
    } catch (error) {
      console.error(error);
      setError("Strömavbrott i Falköping! AI:n kunde inte svara. Försök igen.");
      playSynthSound('incorrect');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { return () => { if (stream) stopCamera(); }; }, [stream]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-rock text-pink-500">Ditt Rock-Alter-Ego</h2>
        <p className="text-zinc-400 text-sm mt-1">Hitta din plats i Nestors värld från 1989.</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        {capturedImage ? (
          <div className="relative group">
            <img src={capturedImage} className="w-32 h-32 object-cover rounded-full border-4 border-pink-500 neon-border" />
            <button onClick={() => setCapturedImage(null)} className="absolute -top-1 -right-1 bg-red-600 p-1 rounded-full"><X size={16} /></button>
          </div>
        ) : (
          <button onClick={startCamera} className="w-32 h-32 flex flex-col items-center justify-center gap-2 bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-full text-zinc-500 hover:text-cyan-400 transition-all">
            <Camera size={32} />
            <span className="text-[10px] font-retro uppercase">TA FOTO</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 p-4 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-pulse">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2"><User size={14} /> Namn</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ditt namn..." className="w-full bg-black border-2 border-zinc-800 p-3 rounded-lg focus:border-cyan-500 outline-none transition-all text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2"><Utensils size={14} /> Favoritmat</label>
          <input value={food} onChange={(e) => setFood(e.target.value)} placeholder="Pizza, Tacos..." className="w-full bg-black border-2 border-zinc-800 p-3 rounded-lg focus:border-cyan-500 outline-none transition-all text-white" />
        </div>
        <button disabled={loading || !name || !food} className="md:col-span-2 bg-gradient-to-r from-pink-600 to-purple-600 p-4 rounded-xl font-bold uppercase text-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : 'GENERERA PERSONA'}
        </button>
      </form>

      {isCameraOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-sm aspect-square bg-zinc-900 rounded-3xl overflow-hidden border-4 border-cyan-500">
            <video ref={(el) => { if (el && stream) el.srcObject = stream; videoRef.current = el; }} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            <canvas ref={canvasRef} className="hidden" />
            <div className={`absolute inset-0 bg-white transition-opacity duration-150 pointer-events-none ${isFlashing ? 'opacity-100' : 'opacity-0'}`} />
            <button onClick={stopCamera} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full"><X size={24} /></button>
          </div>
          <button onClick={capturePhoto} className="mt-8 w-20 h-20 rounded-full bg-white border-8 border-cyan-500 flex items-center justify-center hover:scale-110 transition-all">
            <div className="w-full h-full rounded-full border-4 border-black" />
          </button>
        </div>
      )}

      {result && (
        <div className="mt-8 p-6 bg-zinc-950 border-2 border-pink-500 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.3)] animate-in zoom-in-95 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-6 border-b border-pink-500/30 pb-6 mb-6">
              {capturedImage && <img src={capturedImage} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl border-2 border-cyan-400 grayscale contrast-125" />}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-pink-400 font-retro uppercase">Stage Name</p>
                    <h3 className="text-4xl font-rock text-white italic neon-text uppercase tracking-wider">{result.stageName}</h3>
                  </div>
                  <button onClick={handleShareResult} className="p-2 bg-zinc-800 rounded-lg text-pink-500 hover:bg-pink-500 hover:text-white transition-colors"><Share2 size={18} /></button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div><p className="text-[10px] text-zinc-500 uppercase font-retro">Role</p><p className="text-sm font-bold text-white uppercase">{result.role}</p></div>
                  <div><p className="text-[10px] text-zinc-500 uppercase font-retro">Instrument</p><p className="text-sm font-bold text-white uppercase">{result.instrument}</p></div>
                </div>
              </div>
            </div>
            <p className="text-zinc-300 text-sm italic leading-relaxed">"{result.backstory}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RockNameGenerator;
