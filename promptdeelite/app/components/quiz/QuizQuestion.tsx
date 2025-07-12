// app/components/quiz/QuizQuestion.tsx
'use client';

import React, { useState } from 'react';
import { ChevronRight, Sparkles, Zap, Target, Brain } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  category: string;
}

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answerIndex: number) => void;
  progress: number;
}

export default function QuizQuestion({ question, onAnswer, progress }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswerClick = (index: number) => {
    if (isAnimating) return;
    
    setSelectedAnswer(index);
    setIsAnimating(true);
    
    // Animação de seleção + feedback visual
    setTimeout(() => {
      onAnswer(index);
      setIsAnimating(false);
      setSelectedAnswer(null);
    }, 600);
  };

  // Ícones por categoria
  const categoryIcons = {
    objetivo: Target,
    frustração: Zap,
    experiência: Brain,
    tempo: Sparkles
  };

  const CategoryIcon = categoryIcons[question.category as keyof typeof categoryIcons] || Sparkles;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-10 duration-700 relative">
      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce opacity-50"></div>
      </div>

      {/* Progress Bar Premium */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300 font-medium">
            Pergunta <span className="text-[#38bdf8] font-bold">{question.id}</span> de 4
          </span>
          <span className="text-gray-300">
            <span className="text-[#38bdf8] font-bold">{Math.round(progress)}%</span> completo
          </span>
        </div>
        
        {/* Progress bar com efeitos */}
        <div className="relative">
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-[#2477e0] via-[#38bdf8] to-[#2477e0] transition-all duration-1000 ease-out relative rounded-full"
              style={{ width: `${progress}%` }}
            >
              {/* Efeito de brilho na barra */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 h-3 bg-gradient-to-r from-[#2477e0] to-[#38bdf8] rounded-full blur-md opacity-30"></div>
        </div>

        {/* Indicadores de etapa */}
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                step <= question.id 
                  ? 'bg-[#38bdf8] shadow-lg shadow-[#38bdf8]/50' 
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Pergunta com animações */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative group">
            <div className="w-20 h-20 bg-gradient-to-r from-[#2477e0] to-[#38bdf8] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-500 shadow-2xl">
              <CategoryIcon className="w-10 h-10 text-white" />
            </div>
            {/* Efeito de pulso */}
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-[#2477e0] to-[#38bdf8] rounded-2xl animate-ping opacity-20"></div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-[#38bdf8] to-white bg-clip-text text-transparent">
              {question.question}
            </span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Escolha a opção que <span className="text-[#38bdf8] font-semibold">mais se identifica</span> com você
          </p>
        </div>
      </div>

      {/* Opções Premium */}
      <div className="grid gap-4 max-w-3xl mx-auto">
        {question.options.map((option, index) => (
          <div key={index} className="relative group">
            <button
              onClick={() => handleAnswerClick(index)}
              disabled={isAnimating}
              className={`
                w-full p-6 rounded-2xl border-2 text-left transition-all duration-500 transform relative overflow-hidden
                ${selectedAnswer === index 
                  ? 'border-[#2477e0] bg-gradient-to-r from-[#2477e0]/20 to-[#38bdf8]/20 scale-105 shadow-2xl shadow-[#38bdf8]/30' 
                  : 'border-white/20 bg-white/5 hover:border-[#38bdf8]/60 hover:bg-white/10 hover:scale-102 hover:shadow-xl hover:shadow-[#38bdf8]/20'
                }
                ${isAnimating ? 'pointer-events-none' : ''}
                backdrop-blur-sm group
              `}
            >
              {/* Efeito de brilho animado no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-start space-x-4">
                  {/* Indicador de opção */}
                  <div className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${selectedAnswer === index 
                      ? 'border-[#38bdf8] bg-[#38bdf8] text-white' 
                      : 'border-white/30 group-hover:border-[#38bdf8]'
                    }
                  `}>
                    <span className="font-bold text-sm">
                      {selectedAnswer === index ? '✓' : String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  
                  <span className="text-white font-medium text-lg leading-relaxed pr-4">
                    {option}
                  </span>
                </div>
                
                <ChevronRight className={`
                  w-6 h-6 transition-all duration-300
                  ${selectedAnswer === index 
                    ? 'text-[#38bdf8] transform translate-x-2 scale-110' 
                    : 'text-gray-400 group-hover:text-[#38bdf8] group-hover:transform group-hover:translate-x-1'
                  }
                `} />
              </div>
              
              {/* Efeito de seleção */}
              {selectedAnswer === index && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#2477e0]/30 to-[#38bdf8]/30 rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2477e0]/20 to-[#38bdf8]/20 rounded-2xl animate-pulse"></div>
                </div>
              )}
            </button>

            {/* Glow effect no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2477e0]/20 to-[#38bdf8]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
          </div>
        ))}
      </div>

      {/* Dica com animação */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <p className="text-gray-400 text-sm">
            💡 <span className="font-medium">Dica:</span> Seja honesto para ter o resultado mais preciso
          </p>
        </div>
      </div>

      {/* Efeito de loading quando selecionado */}
      {isAnimating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white font-medium">Processando resposta...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
