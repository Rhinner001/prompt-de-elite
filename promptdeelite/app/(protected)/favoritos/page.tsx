'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../src/components/context/AuthContext';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Prompt } from '@/types';
import PromptGrid from '../../components/PromptGrid';
import UnlockPromptModal from '../../components/UnlockPromptModal';
import FeedbackModal from '../../components/FeedbackModal';

export default function FavoritosPage() {
  const { user } = useAuth();

  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [unlockedPromptIds, setUnlockedPromptIds] = useState<Set<string>>(new Set());
  const [promptToUnlock, setPromptToUnlock] = useState<Prompt | null>(null);

  // NOVO: para feedback global
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackPromptId, setFeedbackPromptId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchFavoritesData = async () => {
      try {
        const [favoritesSnapshot, unlockedSnapshot] = await Promise.all([
          getDocs(collection(db, 'users', user.uid, 'favorites')),
          getDocs(collection(db, 'users', user.uid, 'unlockedPrompts'))
        ]);
        
        const favoriteIds = favoritesSnapshot.docs.map(d => d.id);
        const unlockedIds = new Set(unlockedSnapshot.docs.map(doc => doc.id));
        setUnlockedPromptIds(unlockedIds);

        if (favoriteIds.length === 0) {
          setFavoritePrompts([]);
          setIsLoading(false);
          return;
        }

        const promptPromises = favoriteIds.map(id => getDoc(doc(db, 'prompts', id)));
        const promptDocs = await Promise.all(promptPromises);
        
        const promptsData = promptDocs
          .filter(docSnap => docSnap.exists())
          .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Prompt));

        setFavoritePrompts(promptsData);

      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoritesData();
  }, [user]);

  const handleUnlockSuccess = (promptId: string) => {
    setUnlockedPromptIds(prev => new Set(prev).add(promptId));
    setPromptToUnlock(null);
  };

  // FUNÇÃO PARA ABRIR FEEDBACK
  const handleOpenFeedback = (promptId: string) => {
    setFeedbackPromptId(promptId);
    setFeedbackOpen(true);
  };

  if (isLoading) {
    return <div className="text-center text-gray-300 p-10">Carregando seus favoritos...</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">⭐ Meus Favoritos</h1>
      
      <PromptGrid 
        prompts={favoritePrompts}
        unlockedPromptIds={unlockedPromptIds}
        onCardClick={(prompt) => setPromptToUnlock(prompt)}
        isElite={false}
        onOpenFeedback={handleOpenFeedback} // <-- AGORA FUNCIONA!
      />

      {promptToUnlock && (
        <UnlockPromptModal
          prompt={promptToUnlock}
          onClose={() => setPromptToUnlock(null)}
          onUnlockSuccess={handleUnlockSuccess}
        />
      )}

      {/* MODAL GLOBAL DE FEEDBACK */}
      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        promptId={feedbackPromptId || ''}
        userId={user?.uid || null}
      />
    </>
  );
}
