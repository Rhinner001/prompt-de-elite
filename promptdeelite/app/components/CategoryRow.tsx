'use client';
import type { Prompt } from '@/types';
import PromptCard from './PromptCard';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Interface com todas as props necessárias (com adição de isElite e onOpenFeedback)
interface CategoryRowProps {
  category: string;
  prompts: Prompt[];
  unlockedPromptIds: Set<string>;
  onCardClick: (prompt: Prompt) => void;
  isElite: boolean;
  onOpenFeedback: (promptId: string) => void; // <-- CORRETO
}

export default function CategoryRow({
  category,
  prompts,
  unlockedPromptIds,
  onCardClick,
  isElite,
  onOpenFeedback, // <-- RECEBE VIA PROPS
}: CategoryRowProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true });

  // Funções de controle do carrossel
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{category}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            disabled={!emblaApi?.canScrollPrev()}
            className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            disabled={!emblaApi?.canScrollNext()}
            className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex space-x-6 pb-4 -mb-4 select-none cursor-grab active:cursor-grabbing">
          {prompts.map(prompt => (
            <div key={prompt.id} className="flex-[0_0_90%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_24%]">
              <PromptCard
                prompt={prompt}
                isUnlocked={isElite || unlockedPromptIds.has(prompt.id)}
                onClick={() => onCardClick(prompt)}
                onOpenFeedback={() => onOpenFeedback(prompt.id)} // <-- PASSA PARA O CARD!
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
