// app/components/PromptDetailClient.tsx
'use client';
import type { Prompt } from '@/types';
import PromptDetailView from './PromptDetailView';

interface PromptDetailClientProps {
  prompt: Prompt | null;
}

export default function PromptDetailClient({ prompt }: PromptDetailClientProps) {
  // AQUI está a lógica de erro
  if (!prompt) {
    return (
      <div className="min-h-screen bg-[#0B0F1C] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Erro</h1>
          <p className="text-gray-400 mt-2">Ocorreu um erro ao buscar o prompt ou ele não foi encontrado.</p>
          <a href="/dashboard" className="text-blue-500 hover:underline mt-4 inline-block">
            Voltar para a Biblioteca
          </a>
        </div>
      </div>
    );
  }

  // Se tudo estiver OK, ele apenas renderiza o View
  return <PromptDetailView prompt={prompt} />;
}