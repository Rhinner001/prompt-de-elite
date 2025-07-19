// app/components/PromptDetailClient.tsx
'use client';

import type { Prompt } from '@/types';
import PromptDetailView from './PromptDetailView';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiArrowLeft, FiHome } from 'react-icons/fi';

interface PromptDetailClientProps {
  prompt: Prompt | null;
}

export default function PromptDetailClient({ prompt }: PromptDetailClientProps) {
  if (!prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          {/* Ícone de erro */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-red-500/20 border-2 border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiAlertCircle className="text-red-400 text-3xl" />
          </motion.div>

          {/* Título e descrição */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-white mb-4">
              Prompt Não Encontrado
            </h1>
            <p className="text-slate-400 mb-8 leading-relaxed">
              O prompt que você está procurando não existe ou foi removido. 
              Verifique se o link está correto ou explore nossa biblioteca.
            </p>
          </motion.div>

          {/* Botões de ação */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all transform hover:scale-105"
            >
              <FiHome />
              Ir para a Biblioteca
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
            >
              <FiArrowLeft />
              Voltar
            </button>
          </motion.div>

          {/* Sugestões */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-600/50 backdrop-blur-sm"
          >
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Sugestões:</h3>
            <ul className="text-xs text-slate-400 space-y-1 text-left">
              <li>• Verifique se o link está correto</li>
              <li>• O prompt pode ter sido movido ou removido</li>
              <li>• Explore nossa biblioteca para encontrar prompts similares</li>
              <li>• Use a busca para encontrar o que precisa</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return <PromptDetailView prompt={prompt} />;
}
