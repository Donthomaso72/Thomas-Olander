
import React, { useState, useEffect } from 'react';
import { Trophy, HelpCircle, RefreshCcw } from 'lucide-react';
import { playSynthSound } from '../services/audio';

const TRIVIA_QUESTIONS = [
  {
    question: "Vilket år bildades Nestor ursprungligen (även om de tog en lång paus)?",
    options: ["1984", "1989", "1992", "2021"],
    answer: 1
  },
  {
    question: "Från vilken svensk stad kommer bandet?",
    options: ["Skövde", "Göteborg", "Falköping", "Trollhättan"],
    answer: 2
  },
  {
    question: "Vad heter deras genombrottsalbum från 2021?",
    options: ["The Golden Age", "Ghost Town Rockers", "Kids in a Ghost Town", "Falköping Nights"],
    answer: 2
  },
  {
    question: "Vilken 80-talsikon sjunger med i låten 'Tomorrow'?",
    options: ["Bonnie Tyler", "Samantha Fox", "Cyndi Lauper", "Lita Ford"],
    answer: 1
  },
  {
    question: "Vad heter singeln där de sjunger om ett specifikt år som definierar deras sound?",
    options: ["1984", "1987", "1989", "1991"],
    answer: 2
  },
  {
    question: "Vilken genre brukar Nestors musik främst beskrivas som?",
    options: ["Death Metal", "AOR / Melodic Rock", "Grunge", "Punk Rock"],
    answer: 1
  },
  {
    question: "Vem är bandets karismatiska huvudsångare?",
    options: ["Tobias Gustavsson", "Jonny Wemmenstedt", "Martin Frejinger", "Mattias Carlsson"],
    answer: 0
  },
  {
    question: "Vilket instrument spelar Martin Frejinger, som ger bandet dess autentiska 80-talssound?",
    options: ["Trummor", "Keyboards / Synth", "Sologitarr", "Saxofon"],
    answer: 1
  },
  {
    question: "Vilket ikoniskt svenskt band har Nestor turnerat med under 2024?",
    options: ["Europe", "The Hives", "Ghost", "Roxette"],
    answer: 0
  },
  {
    question: "I musikvideon till 'Kids in a Ghost Town', var befinner sig bandet främst?",
    options: ["På en rymdstation", "I en gammal gymnastiksal", "På en båt i skärgården", "I en övergiven gruva"],
    answer: 1
  }
];

const TriviaGame: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Play start sound when component mounts
  useEffect(() => {
    playSynthSound('start');
  }, []);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const isCorrect = index === TRIVIA_QUESTIONS[currentStep].answer;
    
    if (isCorrect) {
      setScore(s => s + 1);
      playSynthSound('correct');
    } else {
      playSynthSound('incorrect');
    }
    
    setTimeout(() => {
      if (currentStep < TRIVIA_QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        playSynthSound('end');
      }
    }, 1000);
  };

  const reset = () => {
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    playSynthSound('start');
  };

  if (showResult) {
    return (
      <div className="text-center space-y-6 py-8 animate-in zoom-in-95 duration-300">
        <Trophy className="w-20 h-20 text-yellow-500 mx-auto animate-bounce" />
        <h2 className="text-4xl font-rock text-white uppercase italic">Din Rock-Status</h2>
        <div className="text-6xl font-retro text-cyan-500">
          {score}/{TRIVIA_QUESTIONS.length}
        </div>
        <p className="text-zinc-400 font-bold uppercase tracking-widest px-4">
          {score === TRIVIA_QUESTIONS.length 
            ? "LEGENDARISK ROCKSTJÄRNA! Du är redo för 1989." 
            : score > TRIVIA_QUESTIONS.length / 2 
              ? "Roadie-status uppnådd. Fortsätt lyssna på vinylen!" 
              : "Kanske dags för en turné i Falköping för att lära dig mer?"}
        </p>
        <button 
          onClick={reset}
          className="flex items-center gap-2 mx-auto bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-full text-sm font-bold transition-all"
        >
          <RefreshCcw size={18} /> SPELA IGEN
        </button>
      </div>
    );
  }

  const q = TRIVIA_QUESTIONS[currentStep];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <span className="font-retro text-[10px] text-zinc-500">QUESTION {currentStep + 1} OF {TRIVIA_QUESTIONS.length}</span>
        <div className="flex gap-1 overflow-hidden max-w-[150px] md:max-w-none">
          {TRIVIA_QUESTIONS.map((_, idx) => (
            <div key={idx} className={`w-3 h-1 rounded-full shrink-0 ${idx <= currentStep ? 'bg-pink-500' : 'bg-zinc-800'}`} />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl md:text-2xl font-bold text-white flex items-start gap-3">
          <HelpCircle className="text-pink-500 mt-1 shrink-0" size={24} />
          {q.question}
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={selectedAnswer !== null}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all font-bold ${
                selectedAnswer === idx 
                  ? (idx === q.answer ? 'bg-green-600 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]')
                  : 'bg-zinc-900 border-zinc-800 hover:border-pink-500 text-zinc-300'
              }`}
            >
              <span className="mr-3 text-zinc-600 font-retro text-xs">{String.fromCharCode(65 + idx)}</span> {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TriviaGame;
