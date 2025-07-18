'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/src/components/context/AuthContext';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface FavoriteButtonProps { 
  promptId: string;
  size?: 'sm' | 'md' | 'lg';
  onFavoriteChange?: (isFavorited: boolean) => void;
}

export default function FavoriteButton({ 
  promptId, 
  size = 'md',
  onFavoriteChange
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Tamanhos responsivos
  const sizeClasses = {
    sm: 'text-lg w-5 h-5',
    md: 'text-xl w-6 h-6',
    lg: 'text-2xl w-8 h-8'
  };

  // Mostrar feedback temporário
  const showTemporaryFeedback = useCallback((message: string) => {
    setFeedbackMessage(message);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  }, []);

  // Verificar status de favorito
  const checkFavoriteStatus = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const favoriteRef = doc(db, 'users', user.uid, 'favorites', promptId);
      const docSnap = await getDoc(favoriteRef);
      const favorited = docSnap.exists();
      setIsFavorited(favorited);
      onFavoriteChange?.(favorited);
    } catch (error) {
      console.error('Erro ao verificar status de favorito:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, promptId, onFavoriteChange]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  // Toggle favorito com tratamento robusto de erros
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Clique no botão de favorito detectado'); // Debug

    if (!user) {
      showTemporaryFeedback('Faça login para favoritar');
      return;
    }

    if (isToggling) return; // Previne cliques múltiplos

    setIsToggling(true);

    try {
      const favoriteRef = doc(db, 'users', user.uid, 'favorites', promptId);
      
      if (isFavorited) {
        await deleteDoc(favoriteRef);
        setIsFavorited(false);
        onFavoriteChange?.(false);
        showTemporaryFeedback('Removido dos favoritos');
        console.log('Removido dos favoritos'); // Debug
      } else {
        await setDoc(favoriteRef, { 
          favoritedAt: new Date(),
          promptId: promptId,
          userId: user.uid
        });
        setIsFavorited(true);
        onFavoriteChange?.(true);
        showTemporaryFeedback('Adicionado aos favoritos');
        console.log('Adicionado aos favoritos'); // Debug
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      showTemporaryFeedback('Erro ao alterar favorito');
    } finally {
      setIsToggling(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`${sizeClasses[size]} bg-slate-700/50 rounded-full animate-pulse`} />
    );
  }

  return (
    <div className="relative" data-interactive="true">
      <button
        onClick={toggleFavorite}
        disabled={isToggling}
        className={`
          ${sizeClasses[size]} 
          ${isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
          transition-all duration-200 relative
          ${isFavorited ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}
          p-1 rounded-full
        `}
        aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        type="button"
      >
        {isToggling ? (
          <div className="animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : isFavorited ? (
          <FaHeart className="drop-shadow-sm" />
        ) : (
          <FaRegHeart className="drop-shadow-sm" />
        )}
      </button>

      {/* Feedback tooltip */}
      {showFeedback && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 animate-fade-in">
          {feedbackMessage}
        </div>
      )}
    </div>
  );
}