// app/(protected)/favoritos/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../src/components/context/AuthContext';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Prompt } from '@/types';
import PromptGrid from '../../components/PromptGrid';
import UnlockPromptModal from '../../components/UnlockPromptModal';
import FeedbackModal from '../../components/FeedbackModal';
import { FaHeart, FaSearch } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

export default function FavoritosPage() {
  const { user, appUser } = useAuth();

  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [unlockedPromptIds, setUnlockedPromptIds] = useState<Set<string>>(new Set());
  const [accessedPromptIds, setAccessedPromptIds] = useState<Set<string>>(new Set());
  const [promptToUnlock, setPromptToUnlock] = useState<Prompt | null>(null);

  // Feedback
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackPromptId, setFeedbackPromptId] = useState<string | null>(null);

  const isElite = Boolean(appUser?.plan === 'elite');

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchFavoritesData = async () => {
      try {
        const [favoritesSnapshot, unlockedSnapshot, accessedSnapshot] = await Promise.all([
          getDocs(collection(db, 'users', user.uid, 'favorites')),
          getDocs(collection(db, 'users', user.uid, 'unlockedPrompts')),
          getDocs(collection(db, 'users', user.uid, 'accessedPrompts'))
        ]);
        
        const favoriteIds = favoritesSnapshot.docs.map(d => d.id);
        const unlockedIds = new Set(unlockedSnapshot.docs.map(doc => doc.id));
        const accessedIds = new Set(accessedSnapshot.docs.map(doc => doc.id));
        
        setUnlockedPromptIds(unlockedIds);
        setAccessedPromptIds(accessedIds);

        if (favoriteIds.length === 0) {
          setFavoritePrompts([]);
          setIsLoading(false);
          return;
        }

        // Buscar detalhes dos prompts favoritos
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

  // Filtrar prompts por busca
  const filteredPrompts = favoritePrompts.filter(prompt => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      prompt.title.toLowerCase().includes(lower) ||
      prompt.description.toLowerCase().includes(lower) ||
      prompt.category.toLowerCase().includes(lower)
    );
  });

  const handleUnlockSuccess = useCallback((promptId: string) => {
    setUnlockedPromptIds(prev => new Set(prev).add(promptId));
    setPromptToUnlock(null);
  }, []);

  const handleCardClick = useCallback((prompt: Prompt) => {
    if (!isElite && !unlockedPromptIds.has(prompt.id)) {
      setPromptToUnlock(prompt);
    }
  }, [isElite, unlockedPromptIds]);

  const handleOpenFeedback = useCallback((promptId: string) => {
    setFeedbackPromptId(promptId);
    setFeedbackOpen(true);
  }, []);

  const handlePromptAccessed = useCallback((promptId: string) => {
    setAccessedPromptIds(prev => new Set(prev).add(promptId));
    console.log(`✅ Prompt favorito ${promptId} marcado como acessado`);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-600 border-t-pink-500 rounded-full animate-spin"></div>
            <FaHeart className="absolute inset-0 m-auto text-pink-500 text-xl animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Carregando Favoritos</h2>
            <p className="text-slate-400">Buscando seus prompts salvos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <FaHeart className="text-pink-500" />
              Meus Favoritos
            </h1>
            <p className="text-slate-400">
              {favoritePrompts.length} prompt{favoritePrompts.length !== 1 ? 's' : ''} salvo{favoritePrompts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* BUSCA */}
          {favoritePrompts.length > 0 && (
            <div className="relative w-full lg:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar nos favoritos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <FiX />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ESTATÍSTICAS RÁPIDAS */}
        {favoritePrompts.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 text-center">
              <div className="text-2xl font-bold text-pink-400 mb-1">{favoritePrompts.length}</div>
              <div className="text-sm text-slate-400">Total Favoritos</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {favoritePrompts.filter(p => isElite || unlockedPromptIds.has(p.id)).length}
              </div>
              <div className="text-sm text-slate-400">Disponíveis</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {new Set(favoritePrompts.map(p => p.category)).size}
              </div>
              <div className="text-sm text-slate-400">Categorias</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {isElite ? accessedPromptIds.size : unlockedPromptIds.size}
              </div>
              <div className="text-sm text-slate-400">
                {isElite ? 'Acessados' : 'Desbloqueados'}
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO */}
        {favoritePrompts.length === 0 ? (
          <div className="text-center py-20">
            <FaHeart className="text-6xl text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-400 mb-4">Nenhum favorito ainda</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Explore a biblioteca e favorite os prompts que mais gosta para acessá-los rapidamente aqui.
            </p>
            <a 
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              Explorar Biblioteca
            </a>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-20">
            <FaSearch className="text-6xl text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-400 mb-4">Nenhum resultado encontrado</h2>
            <p className="text-slate-500 mb-8">
              Não encontramos favoritos com o termo &quot;{searchTerm}&quot;.
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
            >
              Limpar Busca
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {searchTerm && (
              <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
                <p className="text-slate-300">
                  {filteredPrompts.length} resultado{filteredPrompts.length !== 1 ? 's' : ''} para &quot;{searchTerm}&quot;
                </p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  Limpar busca
                </button>
              </div>
            )}
            
            <PromptGrid 
              prompts={filteredPrompts}
              unlockedPromptIds={unlockedPromptIds}
              onCardClick={handleCardClick}
              isElite={isElite}
              onOpenFeedback={handleOpenFeedback}
              onPromptAccessed={handlePromptAccessed}
            />
          </div>
        )}
      </div>

      {/* MODALS */}
      {promptToUnlock && (
        <UnlockPromptModal
          prompt={promptToUnlock}
          onClose={() => setPromptToUnlock(null)}
          onUnlockSuccess={handleUnlockSuccess}
        />
      )}

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        promptId={feedbackPromptId || ''}
        userId={user?.uid || null}
      />
    </div>
  );
}
