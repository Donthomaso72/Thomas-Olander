
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Calendar, Trash2, Zap } from 'lucide-react';
import { playSynthSound } from '../services/audio.ts';

interface ShoutOut {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

const FanWall: React.FC = () => {
  const [messages, setMessages] = useState<ShoutOut[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('nestor_fan_wall');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse fan wall messages", e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    playSynthSound('generate');

    const newShoutOut: ShoutOut = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      timestamp: new Date().toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [newShoutOut, ...messages];
    setMessages(updated);
    localStorage.setItem('nestor_fan_wall', JSON.stringify(updated));
    
    setName('');
    setMessage('');
    
    setTimeout(() => playSynthSound('success'), 200);
  };

  const clearWall = () => {
    if (confirm("Vill du verkligen rensa hela väggen?")) {
      setMessages([]);
      localStorage.removeItem('nestor_fan_wall');
      playSynthSound('incorrect');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-rock text-yellow-500">Nestor Fan Wall</h2>
        <p className="text-zinc-400 text-sm mt-1">Lämna din shout-out till bandet och världen.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-950 p-6 rounded-2xl border-2 border-zinc-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-retro text-zinc-500 flex items-center gap-2 uppercase">
              <User size={12} /> Ditt Namn
            </label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => playSynthSound('click')}
              placeholder="The Ghost Town Rocker..."
              className="w-full bg-black border border-zinc-700 p-3 rounded-lg focus:border-yellow-500 outline-none transition-all text-white text-sm"
              maxLength={30}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-retro text-zinc-500 flex items-center gap-2 uppercase">
              <MessageSquare size={12} /> Meddelande
            </label>
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => playSynthSound('click')}
              placeholder="Rock on! Nestor 4-ever!"
              className="w-full bg-black border border-zinc-700 p-3 rounded-lg focus:border-yellow-500 outline-none transition-all text-white text-sm"
              maxLength={100}
            />
          </div>
        </div>
        <button 
          type="submit"
          disabled={!name || !message}
          className="w-full bg-yellow-600 hover:bg-yellow-500 p-3 rounded-xl font-bold uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg active:scale-95"
        >
          <Send size={18} /> POSTA SHOUT-OUT
        </button>
      </form>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-600">
            <p className="font-retro text-[10px] uppercase">Väggen är tom... Bli den första att rocka!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className="bg-black border-2 border-cyan-500/30 p-4 rounded-xl relative group hover:border-cyan-400 transition-colors animate-in slide-in-from-left-4"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-cyan-400 font-bold text-sm flex items-center gap-2 uppercase italic tracking-tighter">
                  <Zap size={14} className="fill-cyan-400" /> {msg.name}
                </span>
                <span className="text-[9px] font-retro text-zinc-600 flex items-center gap-1">
                  <Calendar size={10} /> {msg.timestamp}
                </span>
              </div>
              <p className="text-zinc-200 text-sm leading-relaxed border-l-2 border-yellow-500/50 pl-3 py-1 italic">
                "{msg.message}"
              </p>
              <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/5 blur-xl group-hover:bg-cyan-500/10 transition-colors" />
            </div>
          ))
        )}
      </div>

      {messages.length > 0 && (
        <div className="flex justify-center pt-4">
          <button 
            onClick={clearWall}
            className="text-[10px] font-retro text-zinc-600 hover:text-red-500 flex items-center gap-2 transition-colors uppercase"
          >
            <Trash2 size={12} /> Rensa väggen
          </button>
        </div>
      )}
    </div>
  );
};

export default FanWall;
