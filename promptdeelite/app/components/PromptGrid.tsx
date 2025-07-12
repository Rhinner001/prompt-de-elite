'use client';

import type { Prompt } from '@/types';
import PromptCard from './PromptCard';

interface PromptGridProps {
  prompts: Prompt[];
  unlockedPromptIds: Set<string>;
  isElite: boolean;
  onCardClick: (prompt: Prompt) => void;
  onOpenFeedback: (promptId: string) => void;
}
export default function PromptGrid({ prompts, unlockedPromptIds, isElite, onCardClick, onOpenFeedback }: PromptGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {prompts.map(prompt => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          isUnlocked={isElite || unlockedPromptIds.has(prompt.id)}
          onClick={() => onCardClick(prompt)}
          onOpenFeedback={() => onOpenFeedback(prompt.id)} // <-- PASSE A FUNÇÃO CERTA AQUI
        />
      ))}
    </div>
  );
}
