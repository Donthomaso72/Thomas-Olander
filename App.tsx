import React, { useState, useEffect } from 'react';
import { Zap, Music, Disc, Flame, Users, Share2, X, AlertTriangle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import RockNameGenerator from './components/RockNameGenerator.tsx';
import LyricRewriter from './components/LyricRewriter.tsx';
import AlbumArtGenerator from './components/AlbumArtGenerator.tsx';
import TriviaGame from './components/TriviaGame.tsx';
import FanWall from './components/FanWall.tsx';
import { playSynthSound } from './services/audio.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'name' | 'lyrics' | 'art' | 'trivia' | 'wall'>('name');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    // Check for standard Netlify/Vite env var
    // @ts-ignore
    const viteKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : null;
    
    if (!viteKey) {
      setApiKeyMissing(true);
    } else {
      setApiKeyMissing(false);
    }
  }, []);

  const handleTabChange = (tab: any) => {
    playSynthSound('click');
    setActiveTab(tab);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    playSynthSound('success');
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {apiKeyMissing && (
        <div className="bg-red-600 text-white px-4 py-4 text-center font-bold text-[10px] md:text-xs uppercase flex flex-col md:flex-row items-center justify-center gap-2 z-[200] border-b-2 border-black">
          <div className="flex items-center gap-2 animate-pulse">
            <AlertTriangle size={20} /> 
            <span>STRÖMAVBROTT I FALKÖPING!</span>
          </div>
          <span className="opacity-90">Lägg till <code className="bg-black/20 px-1 rounded text-white font-mono">VITE_GEMINI_API_KEY</code> i Netlify Site Settings!</span>
        </div>
      )}
      
      <header className="relative py-10 px-4 border-b-4 border-cyan-500 bg-zinc-950">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-rock italic uppercase neon-text mb-2 tracking-tighter">
            NESTOR
          </h1>
          <p className="font-retro text-cyan-400 tracking-[0.3em] uppercase animate-pulse text-[10px] md:text-xs">
            Kids in a Ghost Town Experience
          </p>
          <button 
            onClick={() => setShowShareModal(true)}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-pink-600/20 border-2 border-pink-500 rounded-full text-pink-500 font-retro text-[9px] uppercase hover:bg-pink-500 hover:text-white transition-all shadow-lg"
          >
            <Share2 size={14} /> Dela Upplevelsen
          </button>
        </div>
      </header>

      <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-pink-500/30">
        <div className="max-w-4xl mx-auto px-2 flex justify-center gap-1 md:gap-4 py-3 overflow-x-auto no-scrollbar">
          <NavButton active={activeTab === 'name'} onClick={() => handleTabChange('name')} icon={<Zap size={18} />} label="Persona" />
          <NavButton active={activeTab === 'lyrics'} onClick={() => handleTabChange('lyrics')} icon={<Music size={18} />} label="Ballad" />
          <NavButton active={activeTab === 'art'} onClick={() => handleTabChange('art')} icon={<Disc size={18} />} label="Design" />
          <NavButton active={activeTab === 'trivia'} onClick={() => handleTabChange('trivia')} icon={<Flame size={18} />} label="Quiz" />
          <NavButton active={activeTab === 'wall'} onClick={() => handleTabChange('wall')} icon={<Users size={18} />} label="Fans" />
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 pb-20">
        <div className="bg-zinc-900/60 border-2 border-zinc-800 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-md">
          {activeTab === 'name' && <RockNameGenerator />}
          {activeTab === 'lyrics' && <LyricRewriter />}
          {activeTab === 'art' && <AlbumArtGenerator />}
          {activeTab === 'trivia' && <TriviaGame />}
          {activeTab === 'wall' && <FanWall />}
        </div>
      </main>

      {showShareModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border-2 border-pink-500 p-8 rounded-[2rem] max-w-sm w-full relative">
            <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
              <X size={24} />
            </button>
            <div className="text-center space-y-6">
              <h3 className="text-3xl font-rock text-white uppercase italic neon-text">Sprid Rocken!</h3>
              <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
                <QRCodeCanvas value={window.location.href} size={180} />
              </div>
              <button 
                onClick={() => copyToClipboard(window.location.href)}
                className={`w-full py-4 rounded-xl font-bold uppercase transition-all ${copySuccess ? 'bg-green-600' : 'bg-pink-600 hover:bg-pink-500'}`}
              >
                {copySuccess ? "KOPIERAD!" : "KOPIERA LÄNK"}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="py-4 bg-black border-t border-zinc-900 text-center font-retro text-[8px] text-zinc-600 uppercase tracking-widest">
        &copy; 1989-2024 FALKÖPING ROCK CITY - NESTOR FAN PORTAL
      </footer>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-xl transition-all ${
      active 
        ? 'bg-pink-600 text-white neon-border shadow-pink-500/50' 
        : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
    }`}
  >
    {icon}
    <span className="font-bold text-[10px] md:text-xs uppercase">{label}</span>
  </button>
);

export default App;