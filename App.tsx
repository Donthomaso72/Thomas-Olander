
import React, { useState, useEffect } from 'react';
import { Music, Camera, Mic, Disc, Zap, Flame, Users, Share2, X, Copy, Link as LinkIcon, AlertCircle, HelpCircle, Rocket, Globe, ShieldAlert, FileCode, FolderOpen, CheckCircle2 } from 'lucide-react';
import RockNameGenerator from './components/RockNameGenerator';
import LyricRewriter from './components/LyricRewriter';
import AlbumArtGenerator from './components/AlbumArtGenerator';
import TriviaGame from './components/TriviaGame';
import FanWall from './components/FanWall';
import { playSynthSound } from './services/audio';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'name' | 'lyrics' | 'art' | 'trivia' | 'wall'>('name');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDevEnv, setIsDevEnv] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    if (host.includes('localhost') || host.includes('stackblitz') || host.includes('googleusercontent') || host.includes('webcontainer')) {
      setIsDevEnv(true);
    }
  }, []);

  const handleShare = async () => {
    playSynthSound('click');
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    playSynthSound('success');
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-pink-500 vhs-effect">
      {/* Header */}
      <header className="relative py-12 px-4 overflow-hidden border-b-4 border-cyan-500">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-blue-900/50 animate-pulse"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="absolute right-4 top-2 flex gap-2">
            <button 
              onClick={() => { playSynthSound('click'); setShowHelpModal(true); }}
              className="p-2 bg-zinc-900/90 border-2 border-cyan-500 rounded-full text-cyan-500 hover:scale-110 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center gap-2"
              title="Hur gör jag?"
            >
              <HelpCircle size={20} />
              <span className="hidden sm:inline font-retro text-[10px] uppercase">Hjälp</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900/90 border-2 border-pink-500 rounded-full hover:scale-105 transition-all text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]"
            >
              <Share2 size={16} />
              <span className="font-retro text-[10px] hidden sm:inline uppercase">Dela</span>
            </button>
          </div>
          <h1 className="text-6xl md:text-8xl font-rock italic uppercase tracking-tighter neon-text mb-2">
            NESTOR
          </h1>
          <p className="font-retro text-xs md:text-sm text-cyan-400 tracking-widest animate-bounce uppercase">
            Kids in a Ghost Town Experience
          </p>
          
          {isDevEnv && (
            <div className="inline-block mt-4 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
              <span className="text-[10px] font-retro text-yellow-500 uppercase flex items-center gap-2">
                <ShieldAlert size={12} /> Utvecklingsläge
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-pink-500/30 py-4">
        <div className="max-w-4xl mx-auto px-4 flex justify-between overflow-x-auto gap-4 scrollbar-hide">
          <NavButton active={activeTab === 'name'} onClick={() => setActiveTab('name')} icon={<Zap size={20} />} label="Persona" />
          <NavButton active={activeTab === 'lyrics'} onClick={() => setActiveTab('lyrics')} icon={<Music size={20} />} label="Ballad" />
          <NavButton active={activeTab === 'art'} onClick={() => setActiveTab('art'} icon={<Disc size={20} />} label="Album Art" />
          <NavButton active={activeTab === 'trivia'} onClick={() => setActiveTab('trivia')} icon={<Flame size={20} />} label="Trivia" />
          <NavButton active={activeTab === 'wall'} onClick={() => setActiveTab('wall')} icon={<Users size={20} />} label="Fan Wall" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <div className="bg-zinc-900/50 border-2 border-zinc-800 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
          {activeTab === 'name' && <RockNameGenerator />}
          {activeTab === 'lyrics' && <LyricRewriter />}
          {activeTab === 'art' && <AlbumArtGenerator />}
          {activeTab === 'trivia' && <TriviaGame />}
          {activeTab === 'wall' && <FanWall />}
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-pink-500 p-8 rounded-[2rem] max-w-sm w-full relative animate-in zoom-in-95">
            <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
              <X size={28} />
            </button>
            <div className="text-center space-y-6">
              <h3 className="text-3xl font-rock text-white italic uppercase tracking-wider">Sprid Rocken!</h3>
              {!isDevEnv ? (
                <div className="bg-white p-3 rounded-2xl inline-block">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(window.location.href)}&ecc=L&margin=1`}
                    alt="QR Kod"
                    className="w-56 h-56"
                  />
                </div>
              ) : (
                <div className="bg-amber-900/20 border border-amber-600/50 p-4 rounded-xl text-left space-y-3">
                  <p className="text-[11px] text-amber-200 leading-relaxed italic">
                    <ShieldAlert size={14} className="inline mr-1" />
                    <strong>OBS:</strong> Du delar din "bygg-länk". Dina vänner kommer se AI Studio istället för appen.
                  </p>
                  <button 
                    onClick={() => { setShowShareModal(false); setShowHelpModal(true); }}
                    className="text-[10px] text-cyan-400 underline uppercase font-bold"
                  >
                    Läs hur du publicerar appen
                  </button>
                </div>
              )}
              <div className="space-y-2">
                <button onClick={copyToClipboard} className={`w-full py-4 rounded-xl font-bold uppercase flex items-center justify-center gap-2 transition-all ${copySuccess ? 'bg-green-600' : 'bg-pink-600 hover:bg-pink-500'}`}>
                  {copySuccess ? "KOPIERAD!" : "KOPIERA LÄNK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-cyan-500 p-8 rounded-[2rem] max-w-lg w-full relative animate-in slide-in-from-bottom-8 h-[85vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setShowHelpModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white sticky">
              <X size={28} />
            </button>
            
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4">
                <Rocket className="text-cyan-500" size={32} />
                <h3 className="text-3xl font-rock text-white italic uppercase tracking-wider">Guide: Flytta din app</h3>
              </div>

              <div className="space-y-6">
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-pink-500 font-bold uppercase text-xs">
                    <FolderOpen size={16} /> Steg 1: Skapa din mapp
                  </div>
                  <p className="text-xs text-zinc-400">Skapa en ny mapp på din dator som heter <strong>nestor-app</strong>.</p>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-pink-500 font-bold uppercase text-xs">
                    <FileCode size={16} /> Steg 2: Kopiera dessa filer
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase font-retro italic">Viktigt: Kopiera texten från AI Studio och spara dem lokalt.</p>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <FileCheckItem label="index.html" />
                    <FileCheckItem label="index.tsx" />
                    <FileCheckItem label="App.tsx" />
                    <div className="pl-4 border-l-2 border-zinc-800 space-y-2">
                       <p className="text-[9px] text-zinc-600 uppercase font-bold">Mappen components/</p>
                       <FileCheckItem label="RockNameGenerator.tsx" />
                       <FileCheckItem label="LyricRewriter.tsx" />
                       <FileCheckItem label="AlbumArtGenerator.tsx" />
                       <FileCheckItem label="TriviaGame.tsx" />
                       <FileCheckItem label="FanWall.tsx" />
                    </div>
                    <div className="pl-4 border-l-2 border-zinc-800 space-y-2">
                       <p className="text-[9px] text-zinc-600 uppercase font-bold">Mappen services/</p>
                       <FileCheckItem label="gemini.ts" />
                       <FileCheckItem label="audio.ts" />
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-pink-500 font-bold uppercase text-xs">
                    <Globe size={16} /> Steg 3: Dra mappen till Netlify
                  </div>
                  <p className="text-xs text-zinc-400">Gå till <a href="https://app.netlify.com/drop" target="_blank" className="text-cyan-400 underline">Netlify Drop</a> och dra in hela din <strong>nestor-app</strong> mapp dit. Du får en länk som du kan dela på riktigt!</p>
                </section>
              </div>

              <button onClick={() => setShowHelpModal(false)} className="w-full py-4 bg-cyan-600 rounded-xl font-bold uppercase hover:bg-cyan-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">Okej, jag sätter igång!</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 bg-zinc-950 border-t border-cyan-500/50 text-center text-[10px] font-retro text-zinc-500 z-50">
        &copy; 1989-2024 FALKÖPING ROCK CITY - NESTOR FAN PORTAL
      </footer>
    </div>
  );
};

const FileCheckItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center justify-between bg-black/40 p-2 rounded border border-zinc-800/50">
    <span className="text-[11px] font-mono text-zinc-300">{label}</span>
    <CheckCircle2 size={14} className="text-zinc-700" />
  </div>
);

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${active ? 'bg-pink-600 text-white neon-border scale-105 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </button>
);

export default App;
