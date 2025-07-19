'use client';

import Link from 'next/link';
import type { Prompt } from '@/types';
import FavoriteButton from './FavoriteButton';
import { FaLock, FaThumbsUp, FaThumbsDown, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/src/components/context/AuthContext';
import { useState, useEffect } from 'react';
import { enviarFeedback } from '@/lib/feedback';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface PromptCardProps {
  prompt: Prompt;
  isUnlocked: boolean;
  onClick: () => void;
  onOpenFeedback: () => void;
  onPromptAccessed?: (promptId: string) => void; // Nova prop para callback
}

export default function PromptCard({ 
  prompt, 
  isUnlocked, 
  onClick, 
  onOpenFeedback,
  onPromptAccessed 
}: PromptCardProps) {
  const { user, appUser } = useAuth();
  const [feedbackGiven, setFeedbackGiven] = useState<null | 'like' | 'dislike'>(null);
  const [loading, setLoading] = useState(false);
  const [isAccessed, setIsAccessed] = useState(false);

  const isElite = Boolean(appUser?.plan === 'elite');

  // Verificar se o prompt já foi acessado
  useEffect(() => {
    const checkIfAccessed = async () => {
      if (!user || !isElite) return;

      try {
        const accessDoc = await getDoc(
          doc(db, 'users', user.uid, 'accessedPrompts', prompt.id)
        );
        setIsAccessed(accessDoc.exists());
      } catch (error) {
        console.error('Erro ao verificar acesso:', error);
      }
    };

    checkIfAccessed();
  }, [user, prompt.id, isElite]);

  // Função para marcar prompt como acessado
  const markAsAccessed = async () => {
    if (!user || !isElite || isAccessed) return;

    try {
      await setDoc(doc(db, 'users', user.uid, 'accessedPrompts', prompt.id), {
        promptId: prompt.id,
        accessedAt: new Date().toISOString(),
        title: prompt.title,
        category: prompt.category
      });
      
      setIsAccessed(true);
      
      // Callback para atualizar estatísticas no dashboard
      if (onPromptAccessed) {
        onPromptAccessed(prompt.id);
      }
      
      console.log(`✅ Prompt ${prompt.id} marcado como acessado`);
    } catch (error) {
      console.error('Erro ao marcar como acessado:', error);
    }
  };

  // Função para enviar feedback rápido
  const handleFeedback = async (tipo: 'like' | 'dislike', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading || feedbackGiven) return;
    setLoading(true);
    
    try {
      await enviarFeedback({
        promptId: prompt.id,
        userId: user?.uid || null,
        tipo,
      });
      setFeedbackGiven(tipo);
      toast.success(tipo === 'like' ? 'Obrigado pelo feedback positivo!' : 'Feedback registrado, vamos melhorar!');
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      toast.error('Erro ao enviar feedback. Tente novamente!');
    }
    setLoading(false);
  };

  // Função para lidar com clique no card
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    
    if (!isUnlocked) {
      onClick();
    }
  };

  // Função para lidar com clique no link (marcar como acessado)
  const handleLinkClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-interactive]')) {
      e.preventDefault();
      return;
    }
    
    // Marcar como acessado quando clica para ver o prompt
    markAsAccessed();
  };

  return (
    <motion.div
      className="h-full"
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative h-full flex flex-col">
        {/* Conteúdo principal do card */}
        <div className="flex-1 relative">
          <div 
            className="bg-[#111827] h-full p-6 rounded-lg border border-white/10 text-white flex flex-col cursor-pointer relative"
            onClick={handleCardClick}
          >
            {/* Header com categoria, indicador de acesso e botão de favorito */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 flex-1 pr-2">
                <p className="text-xs font-mono text-gray-400">
                  {prompt.category?.toUpperCase()}
                </p>
                {/* Indicador de prompt acessado (apenas para Elite) */}
                {isElite && isAccessed && (
                  <div className="flex items-center gap-1" title="Prompt já acessado">
                    <FaEye className="text-blue-400 text-xs" />
                    <span className="text-xs text-blue-400 font-medium">Visto</span>
                  </div>
                )}
              </div>
              
              {/* Botão de favorito */}
              <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
                <FavoriteButton 
                  promptId={prompt.id} 
                  size="md"
                  onFavoriteChange={(isFavorited: any) => {
                    console.log(`Prompt ${prompt.id} favorito alterado:`, isFavorited);
                  }}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2 text-white">{prompt.title}</h3>
            <p className="text-sm text-gray-300 flex-grow mb-4">{prompt.description}</p>
            
            <div className="mt-auto mb-3">
              <span className={`text-xs font-bold py-1 px-3 rounded-full ${
                prompt.level === 'Iniciante' ? 'bg-green-800 text-green-200' :
                prompt.level === 'Intermediário' ? 'bg-yellow-800 text-yellow-200' :
                'bg-red-800 text-red-200'
              }`}>
                {prompt.level}
              </span>
            </div>

            {/* Badge especial para prompts acessados (Elite) */}
            {isElite && isAccessed && (
              <div className="absolute top-2 right-14 bg-blue-500/20 border border-blue-500/50 rounded-full p-1">
                <FaEye className="text-blue-400 text-xs" />
              </div>
            )}
          </div>

          {/* Camada de bloqueio se NÃO desbloqueado */}
          {!isUnlocked && (
            <div 
              onClick={onClick} 
              className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg cursor-pointer group z-30"
            >
              <div className="text-center">
                <FaLock className="text-white text-3xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all mx-auto mb-2" />
                <p className="text-white/70 text-sm font-medium">Clique para desbloquear</p>
              </div>
            </div>
          )}

          {/* Link para usuários com acesso */}
          {isUnlocked && (
            <Link 
              href={`/biblioteca/${prompt.id}`} 
              className="absolute inset-0 z-20 rounded-lg" 
              aria-label={`Acessar prompt ${prompt.title}`}
              onClick={handleLinkClick}
            />
          )}
        </div>

        {/* BOTÕES DE FEEDBACK */}
        <div className="flex items-center gap-3 mt-4 relative z-40">
          {feedbackGiven ? (
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xs font-medium">
                {feedbackGiven === 'like' ? 'Obrigado pelo feedback! 🙌' : 'Vamos melhorar! 👀'}
              </span>
            </div>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 hover:bg-green-900/60 transition-colors cursor-pointer disabled:opacity-50"
                disabled={loading}
                title="Gostei"
                onClick={(e) => handleFeedback('like', e)}
                type="button"
              >
                <FaThumbsUp className={`text-green-300 ${loading ? 'animate-pulse' : ''}`} />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 hover:bg-red-900/60 transition-colors cursor-pointer disabled:opacity-50"
                disabled={loading}
                title="Não gostei"
                onClick={(e) => handleFeedback('dislike', e)}
                type="button"
              >
                <FaThumbsDown className={`text-red-400 ${loading ? 'animate-pulse' : ''}`} />
              </motion.button>
              
              <span className="text-xs text-gray-400 ml-2">Gostou do prompt?</span>
            </>
          )}
          
          {/* Botão para abrir o modal de feedback */}
          <button
            className="ml-auto text-xs bg-blue-800/70 hover:bg-blue-900 transition-colors text-blue-200 font-semibold px-4 py-2 rounded-xl shadow-sm border border-blue-900 disabled:opacity-50"
            onClick={(e) => { 
              e.stopPropagation(); 
              onOpenFeedback(); 
            }}
            disabled={loading}
            type="button"
          >
            Deixe seu feedback
          </button>
        </div>
      </div>
    </motion.div>
  );
}
