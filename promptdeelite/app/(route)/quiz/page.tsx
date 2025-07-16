'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// TIPOS DEFINIDOS
interface QuizAnswer {
  text: string;
  value: string;
  pain?: string;
  hours?: number;
  trigger?: string;
  need?: string;
}

interface QuizQuestion {
  id: number;
  icon: string;
  question: string;
  subtitle: string;
  options: QuizAnswer[];
}

interface UserAnswer {
  question: string;
  answer: QuizAnswer;
  questionData: QuizQuestion;
}

interface ProfileData {
  type: string;
  title: string;
  icon: string;
  description: string;
  problems: string[];
  mainPain: string;
  transformation: string;
  nextSteps: string[];
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'quiz' | 'analysis' | 'results'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<(UserAnswer | null)[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const router = useRouter();

  // CORREÇÃO: Inicializar answers como array fixo
  const questions = useMemo((): QuizQuestion[] => [
    {
      id: 1, 
      icon: "😤", 
      question: "Qual sua MAIOR frustração ao usar IA no trabalho?",
      subtitle: "Seja honesto - isso vai determinar sua recomendação personalizada",
      options: [
        { text: "Passo horas criando prompts que não funcionam direito", value: "time_waste", pain: "tempo" },
        { text: "Recebo sempre respostas genéricas e superficiais", value: "generic_results", pain: "qualidade" },
        { text: "Não consigo replicar bons resultados quando acontecem", value: "inconsistent", pain: "consistência" },
        { text: "Vejo outros tendo sucessos incríveis mas não consigo fazer igual", value: "comparison", pain: "inveja" }
      ]
    },
    {
      id: 2, 
      icon: "⏰", 
      question: "Quanto tempo você PERDE por semana tentando fazer a IA funcionar?",
      subtitle: "Tempo que poderia estar gerando resultados reais",
      options: [
        { text: "2-5 horas (quase um dia de trabalho perdido)", value: "2-5h", hours: 3.5 },
        { text: "5-10 horas (mais de um dia inteiro desperdiçado)", value: "5-10h", hours: 7.5 },
        { text: "10-15 horas (quase dois dias jogados fora)", value: "10-15h", hours: 12.5 },
        { text: "Mais de 15 horas (uma fortuna em tempo perdido)", value: "15h+", hours: 20 }
      ]
    },
    {
      id: 3, 
      icon: "😠", 
      question: "Qual dessas situações mais te IRRITA quando acontece?",
      subtitle: "Vamos identificar seu ponto de dor mais profundo",
      options: [
        { text: "ChatGPT me dá uma resposta inútil depois de eu explicar tudo detalhadamente", value: "detailed_useless", trigger: "frustração" },
        { text: "Vejo um prompt incrível funcionando para outros mas não funciona para mim", value: "others_success", trigger: "inveja" },
        { text: "Preciso refazer o mesmo prompt 5x até conseguir algo prestável", value: "multiple_attempts", trigger: "impaciência" },
        { text: "Perco um deadline importante porque a IA não entregou o que precisava", value: "deadline_missed", trigger: "urgência" }
      ]
    },
    {
      id: 4, 
      icon: "🎯", 
      question: "Qual recurso você mais valoriza em um prompt eficaz?",
      subtitle: "Sua resposta vai determinar nossa recomendação específica",
      options: [
        { text: "Prompts prontos e testados que funcionam na primeira tentativa", value: "ready_prompts", need: "praticidade" },
        { text: "Estratégias secretas que os experts usam mas ninguém conta", value: "expert_secrets", need: "exclusividade" },
        { text: "Sistema completo que me transforme em expert rapidamente", value: "complete_system", need: "transformação" },
        { text: "Comunidade de pessoas que realmente sabem usar IA profissionalmente", value: "community", need: "pertencimento" }
      ]
    }
  ], []);

  // CORREÇÃO: Inicializar com tamanho fixo
  useEffect(() => {
    setAnswers(Array(questions.length).fill(null));
  }, [questions.length]);

  const calculateProfile = useCallback((): ProfileData => {
    const validAnswers = answers.filter(Boolean) as UserAnswer[];
    const painPoint = validAnswers[0]?.answer?.pain || 'tempo';
    const timeWasted = validAnswers[1]?.answer?.hours || 5;
    
    const profiles: Record<string, ProfileData> = {
      tempo: {
        type: 'time_saver',
        title: 'Economizador de Tempo',
        icon: '⏰',
        description: 'Você é inteligente e sabe que tempo é dinheiro. Seu maior problema não é falta de conhecimento, mas SIM a falta de ferramentas prontas e testadas que funcionem na primeira tentativa.',
        problems: [
          `Você perde em média ${timeWasted} horas por semana tentando criar prompts que funcionem`,
          `Isso representa um custo enorme em oportunidades perdidas`,
          'Você sabe que poderia estar gerando resultados ao invés de ficar testando prompts'
        ],
        mainPain: `Perda de ${timeWasted} horas semanais em prompts ineficazes`,
        transformation: 'Com os prompts certos, você pode recuperar essas horas e focar no que realmente importa',
        nextSteps: [
          'Acesso aos prompts mais eficazes já testados',
          'Checklist personalizado para seu perfil',
          'Estratégias para economizar tempo máximo'
        ]
      },
      qualidade: {
        type: 'quality_seeker',
        title: 'Buscador de Qualidade',
        icon: '💎',
        description: 'Você não quer apenas prompts que funcionam - você quer prompts que entregem resultados PROFISSIONAIS. Seu padrão é alto e você sabe reconhecer qualidade.',
        problems: [
          'Você recebe respostas genéricas e superficiais que não atendem seu padrão',
          'Precisa de múltiplas tentativas para conseguir algo minimamente aceitável',
          'Sente que está subutilizando o potencial da IA por não ter as técnicas certas'
        ],
        mainPain: 'Resultados medíocres que não atendem seu padrão de qualidade',
        transformation: 'Com as técnicas certas, você pode obter resultados profissionais consistentemente',
        nextSteps: [
          'Técnicas avançadas de estruturação de prompts',
          'Métodos dos 3% que obtêm qualidade superior',
          'Checklist de qualidade profissional'
        ]
      },
      consistência: {
        type: 'consistency_focused',
        title: 'Focado em Consistência',
        icon: '🎯',
        description: 'Você já teve alguns sucessos com IA, mas não consegue replicar esses resultados de forma consistente. A imprevisibilidade te frustra.',
        problems: [
          'Resultados são imprevisíveis - às vezes funciona, às vezes não',
          'Não consegue replicar sucessos anteriores de forma sistemática',
          'Falta um método estruturado para garantir qualidade constante'
        ],
        mainPain: 'Inconsistência frustrante nos resultados da IA',
        transformation: 'Com metodologia estruturada, você pode ter resultados previsíveis sempre',
        nextSteps: [
          'Sistema estruturado de criação de prompts',
          'Metodologia para replicar sucessos',
          'Framework de consistência comprovado'
        ]
      },
      inveja: {
        type: 'comparison_driven',
        title: 'Motivado por Resultados',
        icon: '🚀',
        description: 'Você vê outros tendo sucessos incríveis com IA e sabe que também pode chegar lá. Tem ambição e quer estar no mesmo nível dos melhores.',
        problems: [
          'Vê cases de sucesso impressionantes mas não sabe como replicar',
          'Sente que está ficando para trás enquanto outros evoluem rapidamente',
          'Falta acesso aos métodos e prompts que realmente funcionam'
        ],
        mainPain: 'Frustração por ver outros conseguindo resultados que você também quer',
        transformation: 'Com acesso aos métodos certos, você pode alcançar o mesmo nível de excelência',
        nextSteps: [
          'Acesso aos prompts dos experts',
          'Estratégias dos 3% mais eficazes',
          'Roadmap para alcançar nível elite'
        ]
      }
    };
    
    return profiles[painPoint] || profiles.tempo;
  }, [answers]);

  const saveResults = useCallback(async () => {
    try {
      const profile = calculateProfile();
      await addDoc(collection(db, 'quiz_results'), {
        answers: answers.filter(Boolean),
        profile: profile.type,
        createdAt: Timestamp.now(),
        source: 'landing_quiz_flow'
      });

      // Salvar perfil no localStorage para usar na página /acesso
      if (typeof window !== 'undefined') {
        localStorage.setItem('userQuizProfile', JSON.stringify({
          profile,
          answers: answers.filter(Boolean),
          completedAt: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
    }
  }, [answers, calculateProfile]);

  const showAnalysis = useCallback(() => {
    setCurrentStep('analysis');
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;
      setAnalysisProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentStep('results');
          saveResults();
        }, 1000);
      }
    }, 800);
  }, [saveResults]);

  const selectAnswer = useCallback((questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = {
      question: questions[questionIndex].question,
      answer: questions[questionIndex].options[optionIndex],
      questionData: questions[questionIndex]
    };
    setAnswers(newAnswers);

    if (questionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      showAnalysis();
    }
  }, [answers, questions, showAnalysis]);

  const startQuiz = useCallback(() => {
    setCurrentStep('quiz');
    setCurrentQuestionIndex(0);
  }, []);

  const getAccess = useCallback(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'quiz_completed', {
        event_category: 'Quiz',
        event_label: calculateProfile().type
      });
    }
    
    router.push('/acesso');
  }, [router, calculateProfile]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2b5c] to-[#0c1c3f] text-white">
      {/* Welcome Screen */}
      {currentStep === 'welcome' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 md:px-6 py-2 animate-pulse">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
              <span className="text-red-400 font-bold text-xs md:text-sm">🔥 DIAGNÓSTICO REVELADOR</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Descubra por que seus prompts</span><br />
                <span className="text-red-400">NÃO FUNCIONAM</span><br />
                <span className="bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">como deveriam</span>
              </h1>
              <p className="text-base md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-4">
                <strong className="text-green-400">Em 2 minutos</strong>, descubra exatamente o que está te impedindo de dominar a IA e 
                <span className="text-yellow-400 font-semibold"> receba um plano personalizado para evoluir</span>
              </p>
            </div>
            
            <button 
              onClick={startQuiz}
              className="bg-gradient-to-r from-[#2477e0] to-[#38bdf8] hover:from-[#1b5fc7] hover:to-[#2563eb] text-white font-bold px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🧠 Fazer Diagnóstico em 2 min
            </button>
            
            <p className="text-sm text-gray-400">
              ⚡ Sem cadastro • Resultado na hora • 100% gratuito
            </p>
          </div>
        </div>
      )}

      {/* Quiz Questions */}
      {currentStep === 'quiz' && (
        <div className="min-h-screen">
          <div className="max-w-4xl mx-auto p-4 py-8 md:py-12">
            {/* Progress Bar */}
            <div className="mb-6 md:mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300 font-medium text-sm md:text-base">
                  Pergunta {currentQuestionIndex + 1} de {questions.length}
                </span>
                <span className="text-blue-400 font-bold text-sm md:text-base">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% completo
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 md:h-3">
                <div 
                  className="bg-gradient-to-r from-[#2477e0] to-[#38bdf8] h-2 md:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Content */}
            <div className="text-center space-y-6 md:space-y-8">
              <div className="text-4xl md:text-6xl mb-4">{questions[currentQuestionIndex].icon}</div>
              
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white leading-tight px-2">
                {questions[currentQuestionIndex].question}
              </h2>
              
              <p className="text-base md:text-lg text-gray-300 px-4">
                {questions[currentQuestionIndex].subtitle}
              </p>
              
              {/* Options Grid */}
              <div className="grid gap-3 md:gap-4 max-w-3xl mx-auto">
                {questions[currentQuestionIndex].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => selectAnswer(currentQuestionIndex, i)}
                    className="group bg-white/5 hover:bg-white/15 border border-white/20 hover:border-[#38bdf8] rounded-xl p-4 md:p-6 text-left transition-all duration-300 transform hover:scale-102"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium text-sm md:text-lg group-hover:text-[#38bdf8] pr-2">
                        {option.text}
                      </span>
                      <span className="text-gray-400 group-hover:text-[#38bdf8] transition-colors text-lg md:text-xl flex-shrink-0">
                        →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Screen */}
      {currentStep === 'analysis' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
            <div className="text-4xl md:text-6xl mb-6">🧠</div>
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">
              Preparando Seu Plano de Ação...
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#2477e0] to-[#38bdf8] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-300 mt-4 text-sm md:text-base">
                {analysisProgress < 30 ? 'Processando suas respostas...' :
                 analysisProgress < 70 ? 'Identificando pontos fracos...' :
                 'Preparando plano personalizado...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {currentStep === 'results' && (
        <div className="min-h-screen">
          <div className="max-w-6xl mx-auto p-4 py-8 md:py-12">
            {(() => {
              const profile = calculateProfile();
              return (
                <div className="space-y-8 md:space-y-12">
                  {/* Profile Header */}
                  <div className="text-center space-y-4 md:space-y-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl md:text-6xl">{profile.icon}</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">
                      <span className="text-green-400">Diagnóstico Completo!</span><br />
                      Seu Perfil: <span className="bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">{profile.title}</span>
                    </h1>
                    <p className="text-base md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                      {profile.description}
                    </p>
                  </div>

                  {/* Problems Identified */}
                  <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-red-300 mb-4 md:mb-6 text-center">
                      🎯 Problemas Identificados no Seu Perfil:
                    </h2>
                    <div className="space-y-3 md:space-y-4">
                      {profile.problems.map((problem: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="text-red-400 mt-1 text-lg md:text-xl">❌</span>
                          <p className="text-red-200 text-sm md:text-lg" dangerouslySetInnerHTML={{ __html: problem }}></p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-red-500/30 rounded-xl border border-red-500/50">
                      <h3 className="text-lg md:text-xl font-bold text-red-200 mb-2">
                        🚨 Sua Dor Principal:
                      </h3>
                      <p className="text-red-100 text-base md:text-lg">{profile.mainPain}</p>
                    </div>
                  </div>

                  {/* Transformation Promise */}
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-4 md:p-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-green-300 mb-4 md:mb-6">
                      ✨ A Boa Notícia:
                    </h2>
                    <p className="text-base md:text-xl text-green-200 leading-relaxed">
                      {profile.transformation}
                    </p>
                  </div>

                  {/* Main CTA */}
                  <div className="bg-gradient-to-r from-[#2477e0]/20 via-[#38bdf8]/20 to-[#2477e0]/20 border border-[#38bdf8]/30 p-8 md:p-12 rounded-3xl text-center space-y-6 md:space-y-8">
                    <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-4">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-green-400 font-bold text-sm">🎁 ACESSO LIBERADO</span>
                    </div>

                    <h3 className="text-2xl md:text-4xl font-bold mb-4 text-white">
                      Parabéns! Você está a <span className="text-green-400">1 passo</span><br />
                      de resolver seus problemas com IA
                    </h3>

                    <p className="text-base md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                      Baseado no seu perfil, preparamos um <strong className="text-[#38bdf8]">kit completo e personalizado</strong> para você sair do seu nível atual e dominar prompts como os <strong className="text-green-400">3% de elite</strong>
                    </p>

                    {/* What You Get */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-8">
                      <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <div className="text-4xl mb-3">📚</div>
                        <h3 className="font-bold text-[#38bdf8] mb-2">eBook Exclusivo</h3>
                        <p className="text-sm text-gray-300">&quot;Anatomia dos Prompts de Elite&quot;</p>
                      </div>
                      
                      <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <div className="text-4xl mb-3">✅</div>
                        <h3 className="font-bold text-[#38bdf8] mb-2">Checklist Personalizado</h3>
                        <p className="text-sm text-gray-300">Baseado no seu perfil específico</p>
                      </div>
                      
                      <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <div className="text-4xl mb-3">🎯</div>
                        <h3 className="font-bold text-[#38bdf8] mb-2">Acesso à Plataforma</h3>
                        <p className="text-sm text-gray-300">Área exclusiva com recursos</p>
                      </div>
                    </div>

                    {/* Main CTA Button - UNIFICADO */}
                    <button
                      onClick={getAccess}
                      className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white font-bold py-6 px-8 md:px-16 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl text-xl md:text-2xl"
                    >
                      <span className="flex items-center justify-center space-x-3">
                        <span>🎁</span>
                        <span>Liberar Meu Acesso Gratuito + Checklist</span>
                        <span>⚡</span>
                      </span>
                    </button>

                    <p className="text-sm text-gray-400 mt-4">
                      ⚡ Acesso imediato • Sem compromisso • 100% gratuito
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500 mt-6">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        2.847 pessoas acessaram hoje
                      </span>
                      <span>•</span>
                      <span>⭐ 4.9/5 satisfação</span>
                      <span>•</span>
                      <span>🔒 100% seguro</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </main>
  );
}
