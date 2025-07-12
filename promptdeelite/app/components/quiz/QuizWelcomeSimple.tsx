// app/components/quiz/QuizWelcomeSimple.tsx
'use client';

import React from 'react';

interface QuizWelcomeProps {
  onStart: () => void;
}

export default function QuizWelcomeSimple({ onStart }: QuizWelcomeProps) {
  return (
    <div className="text-center space-y-8">
      <h1 className="text-4xl md:text-6xl font-bold text-white">
        Multiplique sua produtividade com IA
      </h1>
      <p className="text-xl text-gray-300">
        Descubra qual biblioteca de prompts é perfeita para você
      </p>
      <button
        onClick={onStart}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300"
      >
        Descobrir Meu Perfil Agora
      </button>
    </div>
  );
}
