  'use client';

  import Link from 'next/link';
  import type { Prompt } from '@/types';
  import FavoriteButton from './FavoriteButton';
  import { FaLock, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
  import { motion } from 'framer-motion';
  import { useAuth } from '@/app/src/components/context/AuthContext';
  import { useState } from 'react';
  import { enviarFeedback } from '@/lib/feedback';

  interface PromptCardProps {
    prompt: Prompt;
    isUnlocked: boolean;
    onClick: () => void;
    onOpenFeedback: () => void; // Recebido via props!
  }

  export default function PromptCard({ prompt, isUnlocked, onClick, onOpenFeedback }: PromptCardProps) {
    const { user } = useAuth();
    const [feedbackGiven, setFeedbackGiven] = useState<null | 'like' | 'dislike'>(null);
    const [loading, setLoading] = useState(false);

    // Função para enviar feedback rápido
    const handleFeedback = async (tipo: 'like' | 'dislike') => {
      if (loading || feedbackGiven) return;
      setLoading(true);
      try {
        await enviarFeedback({
          promptId: prompt.id,
          userId: user?.uid || null,
          tipo,
        });
        setFeedbackGiven(tipo);
      } catch (err) {
        alert('Erro ao enviar feedback. Tente novamente!');
      }
      setLoading(false);
    };

    // CardContent só com o conteúdo principal
    const CardContent = () => (
      <div className="bg-[#111827] h-full p-6 rounded-lg border border-white/10 text-white flex flex-col">
        <div className="flex justify-between items-start">
          <p className="text-xs font-mono text-gray-400 mb-2 pr-2 flex-1">{prompt.category?.toUpperCase()}</p>
          <FavoriteButton promptId={prompt.id} />
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
      </div>
    );

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
            <CardContent />
            {/* Camada de bloqueio se NÃO desbloqueado */}
            {!isUnlocked && (
              <div 
                onClick={onClick} 
                className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg cursor-pointer group z-20"
              >
                <FaLock className="text-white text-3xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              </div>
            )}
            {/* Link cobre só o conteúdo principal, não os botões de feedback */}
            {isUnlocked && (
              <Link 
                href={`/biblioteca/${prompt.id}`} 
                className="absolute inset-0 z-10" 
                aria-label={`Acessar prompt ${prompt.title}`}
                tabIndex={-1}
              />
            )}
          </div>
          {/* BOTÕES DE FEEDBACK E BOTÃO DEIXE SEU FEEDBACK */}
          <div className="flex items-center gap-3 mt-2 relative z-30">
            {feedbackGiven ? (
              <span className="text-green-400 text-xs font-medium">
                {feedbackGiven === 'like' ? 'Obrigado pelo feedback! 🙌' : 'Vamos melhorar! 👀'}
              </span>
            ) : (
              <>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white/10 hover:bg-green-900/60 transition-colors cursor-pointer relative z-30"
                  disabled={loading}
                  title="Gostei"
                  onClick={e => { e.stopPropagation(); handleFeedback('like'); }}
                  tabIndex={0}
                >
                  <FaThumbsUp className="text-green-300" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white/10 hover:bg-red-900/60 transition-colors cursor-pointer relative z-30"
                  disabled={loading}
                  title="Não gostei"
                  onClick={e => { e.stopPropagation(); handleFeedback('dislike'); }}
                  tabIndex={0}
                >
                  <FaThumbsDown className="text-red-400" />
                </motion.button>
                <span className="text-xs text-gray-400 ml-2">Gostou do prompt?</span>
              </>
            )}
            {/* Botão para abrir o modal de feedback */}
            <button
              className="ml-4 text-xs bg-blue-800/70 hover:bg-blue-900 transition-colors text-blue-200 font-semibold px-4 py-2 rounded-xl shadow-sm border border-blue-900"
              onClick={e => { e.stopPropagation(); onOpenFeedback(); }}
              type="button"
            >
              Deixe seu feedback
            </button>
          </div>
          {/* NÃO RENDERIZE MAIS FeedbackModal AQUI */}
        </div>
      </motion.div>
    );
  }
