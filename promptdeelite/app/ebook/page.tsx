'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Download, CheckCircle, Star, Users, ArrowRight, Sparkles, Layers, GraduationCap } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function EbookPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAccess = () => {
      const email = localStorage.getItem('userEmail');
      const segment = localStorage.getItem('userSegment');

      if (!email || segment !== 'iniciante') {
        router.push('/comece');
        return;
      }

      setUserEmail(email);
      setIsValidating(false);
    };

    validateAccess();
  }, [router]);

  const handleDownload = useCallback(async () => {
    if (!userEmail) return;

    setIsDownloading(true);

    try {
      await addDoc(collection(db, 'ebook-downloads'), {
        email: userEmail,
        timestamp: serverTimestamp(),
        source: 'ebook-iniciante'
      });

      setTimeout(() => {
        setIsDownloading(false);
        setHasDownloaded(true);
      }, 2000);

    } catch (error) {
      console.error('Erro ao registrar download:', error);
      setIsDownloading(false);
    }
  }, [userEmail]);

  const handleUpgrade = useCallback(() => {
    router.push('/auth/register?plan=elite&from=ebook&profile=iniciante');
  }, [router]);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2847] to-[#0c1c3f] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-r from-[#2477e0] to-[#38bdf8] rounded-full flex items-center justify-center mx-auto animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Carregando seu material...</h3>
            <p className="text-gray-300">Preparando o acesso exclusivo ao e-book</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2847] to-[#0c1c3f] py-8 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center space-y-6 mb-12">
          <div className="inline-block bg-gradient-to-r from-[#f87171] to-[#fb7185] rounded-full px-4 py-2">
            <span className="text-white font-bold text-sm">🔥 EBOOK GRATUITO POR TEMPO LIMITADO</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-[#38bdf8] to-white bg-clip-text text-transparent">
              Anatomia dos Prompts de Elite
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
            O segredo dos 3% que dominam a IA e geram resultados extraordinários.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-8">

            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#2477e0] to-[#38bdf8] rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Anatomia dos Prompts de Elite</h3>
                  <p className="text-gray-400">O Guia Definitivo para Iniciantes</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-4 text-gray-300 mb-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-[#38bdf8]" />
                  <span>92 páginas de ouro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#38bdf8]" />
                  <span>7 capítulos essenciais</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-5 h-5 text-[#38bdf8]" />
                  <span>Aplicação imediata e prática</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-green-400 font-bold">100%</div>
                  <div className="text-gray-400 text-sm">Gratuito</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-blue-400 font-bold">0</div>
                  <div className="text-gray-400 text-sm">Spam</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-purple-400 font-bold">Imediato</div>
                  <div className="text-gray-400 text-sm">Download</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {!hasDownloaded ? (
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    isDownloading
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#2477e0] to-[#38bdf8] hover:from-[#1b5fc7] hover:to-[#2563eb] text-white transform hover:scale-105 shadow-lg hover:shadow-[#38bdf8]/30'
                  }`}
                  aria-label="Baixar Ebook Gratuito Agora"
                >
                  {isDownloading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Preparando Download...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Download className="w-5 h-5" />
                      <span>📚 Baixar Ebook Gratuito Agora</span>
                    </div>
                  )}
                </button>
              ) : (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center animate-in fade-in-50 duration-500">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-green-400 font-bold">Download Concluído!</span>
                  </div>
                  <p className="text-gray-300">Verifique sua pasta de downloads e comece a transformar sua produtividade!</p>
                </div>
              )}

              <p className="text-center text-gray-400 text-sm">
                ✨ Sem pegadinhas • Download direto • Conteúdo premium.
              </p>
            </div>
          </div>

          {/* Lado Direito - Visão Geral dos Capítulos */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              📖 Os 7 Segredos que Você Vai Descobrir:
            </h2>

            <div className="space-y-4">
              {[
                {
                  icon: "❌",
                  title: "Capítulo 1",
                  subtitle: "Por que 97% dos Prompts Falham?",
                  description: "Descubra os erros fatais que a maioria comete e como evitá-los para sempre."
                },
                {
                  icon: "🧬",
                  title: "Capítulo 2",
                  subtitle: "A Anatomia de um Prompt de Elite",
                  description: "Os 5 elementos chave que separam amadores de experts em IA."
                },
                {
                  icon: "🧠",
                  title: "Capítulo 3",
                  subtitle: "Psicologia da IA: Como Fazer a Máquina Pensar",
                  description: "Entenda como a IA realmente processa informações para gerar resultados superiores."
                },
                {
                  icon: "📊",
                  title: "Capítulo 4",
                  subtitle: "Case Study: Transformação na Prática",
                  description: "Veja exemplos práticos e inspiradores de como empresas e profissionais usam IA para resultados extraordinários."
                },
                {
                  icon: "🎯",
                  title: "Capítulo 5",
                  subtitle: "Método P.R.O.M.P.T de Criação",
                  description: "Um framework científico passo a passo para construir prompts perfeitos do zero."
                },
                {
                  icon: "💎",
                  title: "Capítulo 6",
                  subtitle: "O que os Experts Sabem (e Você Não)",
                  description: "Revele os segredos e truques dos 3% que dominam verdadeiramente a IA."
                },
                {
                  icon: "🚀",
                  title: "Capítulo 7",
                  subtitle: "Próximos Passos para a Maestria em IA",
                  description: "Seu roadmap completo para se tornar um mestre em inteligência artificial e superar a concorrência."
                }
              ].map((chapter, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#38bdf8]/30 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl flex-shrink-0">{chapter.icon}</div>
                    <div>
                      <h4 className="text-[#38bdf8] font-semibold">{chapter.title}</h4>
                      <h5 className="text-white font-medium">{chapter.subtitle}</h5>
                      <p className="text-gray-400 text-sm mt-1">{chapter.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seção de Upgrade */}
        <div className="mt-16 bg-gradient-to-r from-[#2477e0]/20 to-[#38bdf8]/20 backdrop-blur-sm rounded-2xl p-8 border border-[#38bdf8]/30 text-center animate-in fade-in-50 duration-700">
          <h3 className="text-3xl font-bold text-white mb-4">
            🎯 Quer Ir Além da Teoria e Atingir o Próximo Nível?
          </h3>
          <p className="text-xl text-gray-300 mb-6">
            Acesse nossa biblioteca com <span className="text-[#38bdf8] font-bold">500+ prompts prontos</span> para usar e aplique tudo na prática.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-xl p-4">
              <Layers className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-white font-medium">500+ Prompts Validados</div>
              <div className="text-gray-400 text-sm">Para todas as situações, testados e aprovados</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-white font-medium">Atualizações Exclusivas</div>
              <div className="text-gray-400 text-sm">Sempre os prompts mais recentes e eficazes</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-white font-medium">Comunidade VIP</div>
              <div className="text-gray-400 text-sm">Networking com experts e suporte prioritário</div>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-[#2477e0] to-[#38bdf8] hover:from-[#1b5fc7] hover:to-[#2563eb] text-white font-bold px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#38bdf8]/30"
            aria-label="Quero Acesso à Biblioteca Completa"
          >
            <GraduationCap className="inline-block w-6 h-6 mr-3 -mt-1" />
            <span>🚀 Quero Acesso à Biblioteca Completa</span>
          </button>
        </div>
      </div>
    </div>
  );
}