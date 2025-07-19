// app/components/PromptDetailView.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Prompt } from '@/types';
import PromptBuilderModal from './PromptBuilderModal';
import FavoriteButton from './FavoriteButton';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiCopy, 
  FiEdit3, 
  FiTag, 
  FiStar, 
  FiZap, 
  FiTarget,
  FiLayers,
  FiCheck,
  FiShare2
} from 'react-icons/fi';
import { FaGem, FaRocket, FaLightbulb, FaMagic } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface PromptDetailViewProps {
  prompt: Prompt;
}

export default function PromptDetailView({ prompt }: PromptDetailViewProps) {
  const [copyText, setCopyText] = useState('Copiar Prompt');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Copia o template bruto
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_template);
      setIsCopied(true);
      setCopyText('Copiado!');
      toast.success('Prompt copiado para a área de transferência!');
      
      setTimeout(() => { 
        setCopyText('Copiar Prompt');
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('Erro ao copiar prompt');
      console.error('Erro ao copiar:', error);
    }
  };

  // Compartilhar prompt
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt.title,
          text: prompt.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback: copiar URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copiado para compartilhar!');
      } catch  {
        toast.error('Erro ao copiar link');
      }
    }
  };

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'Iniciante':
        return { color: 'bg-green-500/20 text-green-300 border-green-500/50', icon: '🟢' };
      case 'Intermediário':
        return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50', icon: '🟡' };
      case 'Avançado':
        return { color: 'bg-red-500/20 text-red-300 border-red-500/50', icon: '🔴' };
      default:
        return { color: 'bg-gray-500/20 text-gray-300 border-gray-500/50', icon: '⚪' };
    }
  };

  const levelConfig = getLevelConfig(prompt.level);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-8">
          
          {/* BREADCRUMB E NAVEGAÇÃO */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
            className="flex items-center justify-between mb-8"
          >
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Voltar para a Biblioteca
            </Link>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                title="Compartilhar prompt"
              >
                <FiShare2 className="text-slate-400" />
              </button>
              <FavoriteButton 
                promptId={prompt.id} 
                size="lg"
                onFavoriteChange={(isFavorited) => {
                  console.log(`Prompt ${prompt.id} favorito alterado:`, isFavorited);
                }}
              />
            </div>
          </motion.div>

          {/* HEADER DO PROMPT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
                {prompt.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${levelConfig.color}`}>
                {levelConfig.icon} {prompt.level}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {prompt.title}
            </h1>
            
            <p className="text-xl text-slate-300 leading-relaxed max-w-4xl">
              {prompt.description}
            </p>
          </motion.div>

          {/* AÇÕES PRINCIPAIS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            {/* Botão Personalizar (se houver fields) */}
            {prompt.fields && prompt.fields.length > 0 && (
              <button
                onClick={() => setIsBuilderOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                <FiEdit3 />
                Personalizar Prompt
              </button>
            )}
            
            {/* Botão Copiar */}
            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg ${
                isCopied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isCopied ? <FiCheck /> : <FiCopy />}
              {copyText}
            </button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* COLUNA PRINCIPAL - TEMPLATE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-8"
            >
              
              {/* TEMPLATE DO PROMPT */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
                <div className="flex items-center gap-2 mb-4">
                  <FiZap className="text-blue-400" />
                  <h2 className="text-2xl font-bold text-white">Template do Prompt</h2>
                </div>
                
                <div className="relative">
                  <pre className="bg-slate-900/80 p-6 rounded-lg text-slate-200 whitespace-pre-wrap font-mono text-sm leading-relaxed overflow-x-auto border border-slate-700/50">
                    {prompt.prompt_template}
                  </pre>
                  
                  {/* Botão de cópia flutuante */}
                  <button
                    onClick={handleCopy}
                    className="absolute top-4 right-4 p-2 bg-slate-700/80 hover:bg-slate-600 rounded-lg transition-colors opacity-80 hover:opacity-100"
                    title="Copiar template"
                  >
                    {isCopied ? (
                      <FiCheck className="text-green-400" />
                    ) : (
                      <FiCopy className="text-slate-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* DICAS DE ELITE */}
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FaGem className="text-yellow-400" />
                  <h3 className="text-xl font-bold text-yellow-300">Dicas de Elite</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaLightbulb className="text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-200 mb-1">Modifique a Persona</h4>
                      <p className="text-yellow-100/80 text-sm">
                        A <strong>PERSONA</strong> é a alavanca mais poderosa. Mude de &quot;assistente&quot; para &quot;especialista em [sua área]&quot; e veja a diferença na qualidade das respostas.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaRocket className="text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-200 mb-1">Seja Específico no Contexto</h4>
                      <p className="text-yellow-100/80 text-sm">
                        Quanto mais detalhes você fornecer no <strong>CONTEXTO</strong>, mais personalizada e eficaz será a resposta da IA.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaMagic className="text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-200 mb-1">Combine Prompts</h4>
                      <p className="text-yellow-100/80 text-sm">
                        Use a saída de um prompt como entrada para outro. Exemplo: prompt de pesquisa → prompt de redação.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SIDEBAR - INFORMAÇÕES */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              
              {/* FICHA TÉCNICA */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
                <div className="flex items-center gap-2 mb-4">
                  <FiLayers className="text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Ficha Técnica</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Nível:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${levelConfig.color}`}>
                      {prompt.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Versão:</span>
                    <span className="text-white text-sm font-medium">{prompt.version}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-600/50">
                    <span className="text-slate-400 text-sm block mb-2">Caso de Uso:</span>
                    <p className="text-slate-200 text-sm leading-relaxed">{prompt.use_case}</p>
                  </div>
                </div>
              </div>

              {/* TAGS RELACIONADAS */}
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
                  <div className="flex items-center gap-2 mb-4">
                    <FiTag className="text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Tags Relacionadas</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/dashboard?q=${encodeURIComponent(tag)}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-full text-xs font-medium transition-colors border border-blue-500/30"
                      >
                        <FiTag className="text-xs" />
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* AÇÕES RÁPIDAS */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
                <div className="flex items-center gap-2 mb-4">
                  <FiTarget className="text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Ações Rápidas</h3>
                </div>
                
                <div className="space-y-3">
                  {prompt.fields && prompt.fields.length > 0 && (
                    <button
                      onClick={() => setIsBuilderOpen(true)}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded-lg transition-colors text-sm font-medium"
                    >
                      <FiEdit3 />
                      Personalizar
                    </button>
                  )}
                  
                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    <FiCopy />
                    Copiar Template
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    <FiShare2 />
                    Compartilhar
                  </button>
                </div>
              </div>

              {/* PROMPTS SIMILARES */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
                <div className="flex items-center gap-2 mb-4">
                  <FiStar className="text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Explore Mais</h3>
                </div>
                
                <div className="space-y-3">
                  <Link
                    href={`/dashboard?category=${encodeURIComponent(prompt.category)}`}
                    className="block p-3 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg transition-colors"
                  >
                    <div className="text-sm font-medium text-white mb-1">
                      Mais de {prompt.category}
                    </div>
                    <div className="text-xs text-slate-400">
                      Explore outros prompts desta categoria
                    </div>
                  </Link>
                  
                  <Link
                    href="/dashboard"
                    className="block p-3 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg transition-colors"
                  >
                    <div className="text-sm font-medium text-white mb-1">
                      Voltar à Biblioteca
                    </div>
                    <div className="text-xs text-slate-400">
                      Descubra mais prompts incríveis
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal Prompt Builder */}
      {isBuilderOpen && (
        <PromptBuilderModal
          prompt={prompt}
          onClose={() => setIsBuilderOpen(false)}
        />
      )}
    </>
  );
}
