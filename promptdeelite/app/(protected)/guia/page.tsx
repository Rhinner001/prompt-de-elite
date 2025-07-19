// app/(protected)/guia/page.tsx
'use client';

import Link from 'next/link';
import { FiCompass, FiEdit, FiHeart, FiSearch, FiStar, FiPlay } from 'react-icons/fi';
import { FaGem, FaRocket, FaMagic, FaCrown, FaLightbulb } from 'react-icons/fa';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function GuiaPage() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  const tourSteps = [
    {
      icon: FiCompass,
      title: 'Explore o Dashboard Inteligente',
      description: 'Comece navegando pelas categorias organizadas por especialidade. Cada seção foi cuidadosamente curada para diferentes necessidades profissionais.',
      cta: 'Explorar Biblioteca',
      href: '/dashboard',
      color: 'blue',
      time: '2 min'
    },
    {
      icon: FiSearch,
      title: 'Domine a Busca Avançada',
      description: 'Use filtros inteligentes, busque por palavras-chave e clique nas tags dos prompts para descobrir conteúdos relacionados. A busca é sua ferramenta mais poderosa.',
      cta: 'Testar Busca',
      href: '/dashboard',
      color: 'purple',
      time: '3 min'
    },
    {
      icon: FiHeart,
      title: 'Crie Sua Coleção Pessoal',
      description: 'Salve os prompts que mais usa clicando no coração. Construa sua biblioteca personalizada para acesso instantâneo aos seus favoritos.',
      cta: 'Ver Favoritos',
      href: '/favoritos',
      color: 'pink',
      time: '1 min'
    },
    {
      icon: FiEdit,
      title: 'Personalize com Maestria',
      description: 'Vá além do copiar e colar. Acesse qualquer prompt e use nosso sistema de personalização para adaptar cada detalhe às suas necessidades específicas.',
      cta: 'Personalizar Prompt',
      href: '/dashboard',
      color: 'green',
      time: '5 min'
    },
    {
      icon: FiStar,
      title: 'Torne-se um Mestre em Prompts',
      description: 'Entenda a anatomia dos prompts de elite e aprenda a modificar personas, contextos e objetivos para resultados extraordinários.',
      cta: 'Estudar Anatomia',
      href: '#anatomia',
      color: 'yellow',
      time: '10 min'
    }
  ];

  const anatomiaSections = [
    { 
      title: 'PERSONA', 
      description: 'Define QUEM a IA deve ser. Mude de "assistente" para "especialista em marketing" e veja a diferença na qualidade das respostas.',
      icon: '🎭',
      example: 'Você é um copywriter sênior com 15 anos de experiência...'
    },
    { 
      title: 'OBJETIVO', 
      description: 'Estabelece O QUE você quer alcançar. Seja específico: em vez de "escreva um texto", diga "crie um email de vendas que converta".',
      icon: '🎯',
      example: 'Crie uma sequência de 5 emails para nutrir leads...'
    },
    { 
      title: 'CONTEXTO', 
      description: 'Fornece OS DADOS essenciais. Quanto mais contexto relevante, mais personalizada e eficaz será a resposta da IA.',
      icon: '📋',
      example: 'Minha empresa vende software para dentistas, público-alvo tem 35-50 anos...'
    },
    { 
      title: 'DIRETRIZES', 
      description: 'Define O PROCESSO passo a passo. Guia a IA através da metodologia exata que você quer que ela siga.',
      icon: '📝',
      example: '1. Analise o público, 2. Defina a dor principal, 3. Crie a solução...'
    },
    { 
      title: 'FORMATO', 
      description: 'Especifica COMO apresentar o resultado. Tabela, lista, script, post do LinkedIn - o formato certo potencializa o impacto.',
      icon: '🎨',
      example: 'Apresente como um post do LinkedIn com 3 parágrafos e 5 hashtags...'
    }
  ];

  const tips = [
    {
      icon: FaLightbulb,
      title: 'Dica de Ouro',
      content: 'Sempre teste variações. Mude uma palavra na persona e compare os resultados. Pequenos ajustes podem gerar grandes melhorias.'
    },
    {
      icon: FaRocket,
      title: 'Produtividade Máxima',
      content: 'Crie templates dos seus prompts favoritos. Salve versões personalizadas para reutilizar em projetos similares.'
    },
    {
      icon: FaMagic,
      title: 'Segredo dos Experts',
      content: 'Combine prompts! Use a saída de um prompt como entrada para outro. Exemplo: prompt de pesquisa → prompt de redação.'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
      purple: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
      pink: 'border-pink-500/50 bg-pink-500/10 text-pink-400',
      green: 'border-green-500/50 bg-green-500/10 text-green-400',
      yellow: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const completionPercentage = Math.round((completedSteps.size / tourSteps.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        
        {/* HEADER HERO */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300 text-sm font-medium"
          >
            <FaGem className="text-lg" />
            Guia de Elite
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-white mb-4"
          >
            Domine a Arte dos
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Prompts de Elite</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            Transforme a IA em sua maior aliada estratégica. Siga este tour completo e descubra como extrair resultados extraordinários de cada prompt.
          </motion.p>

          {/* PROGRESS BAR */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Progresso do Tour</span>
              <span className="text-sm font-medium text-blue-400">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </motion.div>
        </div>

        {/* TOUR STEPS */}
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Seu Roteiro para o Sucesso</h2>
            <p className="text-slate-400">5 passos estratégicos para dominar nossa plataforma</p>
          </div>

          <div className="grid gap-6">
            {tourSteps.map((step, index) => {
              const isCompleted = completedSteps.has(index);
              const colorClasses = getColorClasses(step.color);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border transition-all duration-300 ${
                    isCompleted ? 'border-green-500/50 bg-green-500/5' : 'border-slate-600/50 hover:border-slate-500/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* CHECKBOX */}
                    <button
                      onClick={() => toggleStep(index)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {isCompleted && '✓'}
                    </button>

                    {/* ICON */}
                    <div className={`p-3 rounded-xl border ${colorClasses}`}>
                      <step.icon size={24} />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                        <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-slate-400 mb-4 leading-relaxed">{step.description}</p>
                      <Link href={step.href}>
                        <span className={`inline-flex items-center gap-2 font-semibold hover:underline transition-colors ${
                          step.color === 'blue' ? 'text-blue-400' :
                          step.color === 'purple' ? 'text-purple-400' :
                          step.color === 'pink' ? 'text-pink-400' :
                          step.color === 'green' ? 'text-green-400' :
                          'text-yellow-400'
                        }`}>
                          <FiPlay size={14} />
                          {step.cta}
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* DICAS RÁPIDAS */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-8 border border-slate-600/50">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">💡 Dicas dos Especialistas</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center space-y-3"
              >
                <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500/50 rounded-xl flex items-center justify-center mx-auto">
                  <tip.icon className="text-yellow-400 text-xl" />
                </div>
                <h4 className="font-semibold text-white">{tip.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{tip.content}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ANATOMIA DO PROMPT */}
        <div id="anatomia" className="space-y-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-sm font-medium mb-4"
            >
              <FaCrown />
              Conhecimento Avançado
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">A Anatomia de um Prompt de Elite</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Entenda os 5 pilares fundamentais que transformam prompts comuns em ferramentas extraordinárias
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {anatomiaSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{section.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{section.title}</h3>
                <p className="text-slate-400 mb-4 leading-relaxed">{section.description}</p>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-500 mb-1">Exemplo:</p>
                  <p className="text-sm text-slate-300 italic">&quot;{section.example}&quot;</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA FINAL */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/50 rounded-xl p-8"
        >
          <FaRocket className="text-4xl text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Pronto para Decolar?</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            Agora que você conhece os segredos, é hora de colocar em prática. Explore nossa biblioteca e comece a criar resultados extraordinários.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all transform hover:scale-105"
            >
              <FiCompass />
              Explorar Biblioteca
            </Link>
            <Link
              href="/favoritos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
            >
              <FiHeart />
              Meus Favoritos
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
