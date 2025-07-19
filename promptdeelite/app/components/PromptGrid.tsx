// app/components/PromptGrid.tsx
'use client';

import type { Prompt } from '@/types';
import PromptCard from './PromptCard';

interface PromptGridProps {
  prompts: Prompt[];
  unlockedPromptIds: Set<string>;
  isElite: boolean;
  onCardClick: (prompt: Prompt) => void;
  onOpenFeedback: (promptId: string) => void;
  onPromptAccessed?: (promptId: string) => void; // NOVA PROP ADICIONADA
}

export default function PromptGrid({ 
  prompts, 
  unlockedPromptIds, 
  isElite, 
  onCardClick, 
  onOpenFeedback,
  onPromptAccessed 
}: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-500 text-lg mb-2">Nenhum prompt encontrado</div>
        <p className="text-slate-400 text-sm">Tente ajustar os filtros ou buscar por outros termos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          isUnlocked={isElite || unlockedPromptIds.has(prompt.id)}
          onClick={() => onCardClick(prompt)}
          onOpenFeedback={() => onOpenFeedback(prompt.id)}
          onPromptAccessed={onPromptAccessed} // REPASSAR A PROP
        />
      ))}
    </div>
  );
}
