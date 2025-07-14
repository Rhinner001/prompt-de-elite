'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

interface TestimonialType {
  name: string;
  role: string;
  image: string;
  text: string;
  result: string;
}

interface ProfileData {
  type: string;
  title: string;
  icon: string;
  description: string;
  problems: string[];
  cost: string;
  price: number;
  testimonials: TestimonialType[];
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'quiz' | 'analysis' | 'results'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [email, setEmail] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

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
      question: "Se você pudesse ter UMA COISA para resolver seus problemas com IA, seria:",
      subtitle: "Sua resposta vai determinar nossa recomendação específica",
      options: [
        { text: "Prompts prontos e testados que funcionam na primeira tentativa", value: "ready_prompts", need: "praticidade" },
        { text: "Estratégias secretas que os experts usam mas ninguém conta", value: "expert_secrets", need: "exclusividade" },
        { text: "Sistema completo que me transforme em expert rapidamente", value: "complete_system", need: "transformação" },
        { text: "Comunidade de pessoas que realmente sabem usar IA profissionalmente", value: "community", need: "pertencimento" }
      ]
    }
  ], []);

  // Componente Avatar otimizado
  const Avatar = ({ testimonial }: { testimonial: TestimonialType }) => {
    const [imageError, setImageError] = useState(false);
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
    const getGradientColor = (name: string) => {
      const colors = [
        'from-blue-500 to-purple-500', 
        'from-green-500 to-teal-500', 
        'from-purple-500 to-pink-500', 
        'from-orange-500 to-red-500'
      ];
      return colors[name.length % colors.length];
    };

    if (imageError) {
      return (
        <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${getGradientColor(testimonial.name)} rounded-full flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0 text-sm md:text-base`}>
          {getInitials(testimonial.name)}
        </div>
      );
    }

    return (
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 relative">
        <Image 
          src={testimonial.image} 
          alt={`Foto de ${testimonial.name}`} 
          width={48} 
          height={48} 
          className="w-full h-full object-cover rounded-full" 
          onError={() => setImageError(true)} 
          priority={false}
        />
      </div>
    );
  };

  const calculateProfile = useCallback((): ProfileData => {
    const painPoint = answers[0]?.answer?.pain || 'tempo';
    const timeWasted = answers[1]?.answer?.hours || 5;
    
    const profiles: Record<string, ProfileData> = {
      tempo: {
        type: 'time_saver',
        title: 'Economizador de Tempo',
        icon: '⏰',
        description: 'Você é inteligente e sabe que tempo é dinheiro. Seu maior problema não é falta de conhecimento, mas SIM a falta de ferramentas prontas e testadas que funcionem na primeira tentativa.',
        problems: [
          `Você perde em média ${timeWasted} horas por semana tentando criar prompts que funcionem`,
          `Isso representa mais de R$ ${timeWasted * 4 * 50} em tempo desperdiçado por mês`,
          'Você sabe que poderia estar gerando resultados ao invés de ficar testando prompts'
        ],
        cost: (timeWasted * 4 * 50).toString(),
        price: 105,
        testimonials: [
          { 
            name: 'Carlos Mendes', 
            role: 'Empresário', 
            image: '/images/testimonials/carlos-mendes.jpg', 
            text: 'Economizei 15 horas por semana. ROI foi imediato.', 
            result: '+400% produtividade' 
          },
          { 
            name: 'Ana Silva', 
            role: 'Consultora', 
            image: '/images/testimonials/ana-silva.jpg', 
            text: 'Em 3 dias já havia recuperado o investimento.', 
            result: 'R$ 15.000 economizados' 
          }
        ]
      },
      qualidade: {
        type: 'quality_seeker',
        title: 'Buscador de Qualidade',
        icon: '💎',
        description: 'Você não quer apenas prompts que funcionam - você quer prompts que entregem resultados PROFISSIONAIS.',
        problems: [
          'Você recebe respostas genéricas e superficiais que não atendem seu padrão',
          'Precisa de múltiplas tentativas para conseguir algo minimamente aceitável',
          'Sente que está subutilizando o potencial da IA por não ter as técnicas certas'
        ],
        cost: '5000',
        price: 105,
        testimonials: [
          { 
            name: 'Marina Lopes', 
            role: 'Designer', 
            image: '/images/testimonials/marina-lopes.jpg', 
            text: 'Meus clientes notaram a diferença imediatamente.', 
            result: '+150% qualidade' 
          },
          { 
            name: 'Roberto Ferreira', 
            role: 'Copywriter', 
            image: '/images/testimonials/roberto-ferreira.jpg', 
            text: 'Agora entrego trabalhos de nível internacional.', 
            result: '5x valor por projeto' 
          }
        ]
      },
      consistência: {
        type: 'consistency_focused',
        title: 'Focado em Consistência',
        icon: '🎯',
        description: 'Você já teve alguns sucessos com IA, mas não consegue replicar esses resultados de forma consistente.',
        problems: [
          'Resultados são imprevisíveis - às vezes funciona, às vezes não',
          'Não consegue replicar sucessos anteriores de forma sistemática',
          'Falta um método estruturado para garantir qualidade constante'
        ],
        cost: '3500',
        price: 105,
        testimonials: [
          { 
            name: 'Fernando Karlos', 
            role: 'Consultor', 
            image: '/images/testimonials/fernando-karlos.jpg', 
            text: 'Agora tenho 95% de assertividade nos prompts.', 
            result: '+250% eficiência' 
          },
          { 
            name: 'Carla Martins', 
            role: 'Gestora', 
            image: '/images/testimonials/carla-martins.jpg', 
            text: 'Resultados previsíveis mudaram meu workflow.', 
            result: 'Zero retrabalho' 
          }
        ]
      },
      inveja: {
        type: 'comparison_driven',
        title: 'Motivado por Resultados',
        icon: '🚀',
        description: 'Você vê outros tendo sucessos incríveis com IA e sabe que também pode chegar lá.',
        problems: [
          'Vê cases de sucesso impressionantes mas não sabe como replicar',
          'Sente que está ficando para trás enquanto outros evoluem rapidamente',
          'Falta acesso aos métodos e prompts que realmente funcionam'
        ],
        cost: '7500',
        price: 105,
        testimonials: [
          { 
            name: 'Lucas Pereira', 
            role: 'Empreendedor', 
            image: '/images/testimonials/lucas-pereira.jpg', 
            text: 'Em 30 dias estava no nível dos experts que admirava.', 
            result: 'Virou referência' 
          },
          { 
            name: 'Beatriz Silva', 
            role: 'Influencer', 
            image: '/images/testimonials/beatriz-silva.jpg', 
            text: 'Meu crescimento acelerou 10x depois do acesso.', 
            result: '1M seguidores' 
          }
        ]
      }
    };
    
    return profiles[painPoint] || profiles.tempo;
  }, [answers]);

  const saveResults = useCallback(async () => {
    try {
      const profile = calculateProfile();
      await addDoc(collection(db, 'quiz_results'), {
        email: email || 'anonimo',
        answers,
        profile: profile.type,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
    }
  }, [email, answers, calculateProfile]);

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

  const convertNow = useCallback(() => {
    router.push('/checkout');
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2b5c] to-[#0c1c3f] text-white">
      {/* Welcome Screen - RESPONSIVO */}
      {currentStep === 'welcome' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 md:px-6 py-2 animate-pulse">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
              <span className="text-red-400 font-bold text-xs md:text-sm">ATENÇÃO: Teste Revelador</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Por que você ainda</span><br />
                <span className="text-red-400">NÃO TRIPLICOU</span><br />
                <span className="bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">sua produtividade com IA?</span>
              </h1>
              <p className="text-base md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-4">
                <strong>Em 60 segundos</strong>, descubra o que está te impedindo de dominar a IA e 
                <span className="text-yellow-400 font-semibold"> como 3% dos usuários conseguem resultados 10x melhores</span>
              </p>
            </div>
            
            <button 
              onClick={startQuiz}
              className="bg-gradient-to-r from-[#2477e0] to-[#38bdf8] hover:from-[#1b5fc7] hover:to-[#2563eb] text-white font-bold px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🔍 Descobrir Meu Perfil Agora
            </button>
          </div>
        </div>
      )}

      {/* Quiz Questions - RESPONSIVO */}
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
              
              {/* Options Grid - RESPONSIVO */}
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

      {/* Analysis Screen - RESPONSIVO */}
      {currentStep === 'analysis' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
            <div className="text-4xl md:text-6xl mb-6">🧠</div>
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">
              Analisando Seu Perfil...
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
                 analysisProgress < 70 ? 'Identificando seu perfil...' :
                 'Preparando recomendação personalizada...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results - RESPONSIVO */}
      {currentStep === 'results' && (
        <div className="min-h-screen">
          <div className="max-w-6xl mx-auto p-4 py-8 md:py-12">
            {(() => {
              const profile = calculateProfile();
              return (
                <div className="space-y-8 md:space-y-12">
                  {/* Profile Header */}
                  <div className="text-center space-y-4 md:space-y-6">
                    <div className="text-6xl md:text-8xl">{profile.icon}</div>
                    <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white">
                      Seu Perfil: <span className="bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">{profile.title}</span>
                    </h1>
                    <p className="text-base md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                      {profile.description}
                    </p>
                  </div>

                  {/* Problems Section */}
                  <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-red-300 mb-4 md:mb-6">
                      ⚠️ Seus Problemas Identificados:
                    </h2>
                    <div className="space-y-3 md:space-y-4">
                      {profile.problems.map((problem: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="text-red-400 mt-1 text-lg md:text-xl">❌</span>
                          <p className="text-red-200 text-sm md:text-lg" dangerouslySetInnerHTML={{ __html: problem }}></p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonials Section */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-white/10">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">
                      💬 Pessoas com Perfil Similar
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {profile.testimonials.map((testimonial: TestimonialType, index: number) => (
                        <div key={index} className="bg-white/5 rounded-xl p-4 md:p-6 border border-white/10 hover:transform hover:scale-105 transition-all duration-300">
                          <div className="flex items-center mb-4">
                            <Avatar testimonial={testimonial} />
                            <div>
                              <h4 className="font-semibold text-sm md:text-base">{testimonial.name}</h4>
                              <p className="text-gray-400 text-xs md:text-sm">{testimonial.role}</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-xs md:text-sm mb-4">
                            &ldquo;{testimonial.text}&rdquo;
                          </p>
                          <div className="text-green-400 font-semibold text-xs md:text-sm">{testimonial.result}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Offer Section - OTIMIZADO PARA MOBILE */}
                  <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border border-purple-500/30 rounded-2xl p-4 md:p-8 text-center space-y-6 md:space-y-10">
                    <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-full px-3 md:px-4 py-2 mb-2 animate-pulse">
                      <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                      <span className="text-red-400 font-bold text-xs md:text-sm">APENAS 30 VAGAS DISPONÍVEIS</span>
                    </div>

                    <h3 className="text-xl md:text-3xl font-bold mb-2 text-white px-2">
                      Oferta Ultra Exclusiva para Quem Concluiu o Diagnóstico
                    </h3>

                    <p className="text-sm md:text-lg text-gray-200 max-w-2xl mx-auto mb-4 px-4">
                      <span className="text-yellow-400 font-bold">⚡ Só hoje:</span> Você tem acesso imediato à <span className="text-blue-300 font-bold">Biblioteca Prompts de Elite</span> com todos os prompts testados, modelos exclusivos e suporte VIP — 
                      <span className="text-green-400 font-bold"> GARANTIA incondicional de 30 dias</span>.
                    </p>

                    {/* Pricing Cards - MOBILE FIRST */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto mb-4">
                      <div className="bg-white/5 rounded-xl p-4 md:p-6 border-2 border-blue-500/30 flex flex-col justify-between">
                        <h4 className="font-bold text-base md:text-lg mb-2 text-blue-400">💎 Plano Mensal</h4>
                        <div className="text-2xl md:text-3xl font-bold text-blue-300 mb-2">R$ 27,99</div>
                        <p className="text-gray-300 text-xs md:text-sm mb-2">por mês</p>
                        <button 
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 md:py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 mt-auto text-sm md:text-base" 
                          onClick={convertNow}
                        >
                          Começar Agora
                        </button>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 md:p-6 border-2 border-green-500/50 flex flex-col justify-between relative">
                        <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold">
                          MAIS POPULAR
                        </div>
                        <h4 className="font-bold text-base md:text-lg mb-2 text-green-400">🚀 Plano Vitalício</h4>
                        <div className="text-sm md:text-lg text-gray-400 line-through mb-1">R$ 297,00</div>
                        <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">R$ 105,00</div>
                        <p className="text-gray-300 text-xs md:text-sm mb-2">pagamento único</p>
                        <button 
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2 md:py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 mt-auto text-sm md:text-base" 
                          onClick={convertNow}
                        >
                          Garantir Vitalício
                        </button>
                      </div>
                    </div>

                    {/* Urgency Counter */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 mb-6 max-w-xl mx-auto space-y-3">
                      <div className="flex items-center justify-center gap-1 md:gap-2 text-yellow-400 font-bold text-sm md:text-lg">
                        <span className="bg-red-500 text-white rounded-lg px-2 md:px-3 py-1 text-lg md:text-2xl animate-pulse">0</span>
                        <span className="bg-red-500 text-white rounded-lg px-2 md:px-3 py-1 text-lg md:text-2xl animate-pulse">0</span>
                        <span className="bg-red-500 text-white rounded-lg px-2 md:px-3 py-1 text-lg md:text-2xl animate-pulse">1</span>
                        <span className="bg-red-500 text-white rounded-lg px-2 md:px-3 py-1 text-lg md:text-2xl animate-pulse">7</span>
                        <span className="ml-2 text-yellow-400 text-xs md:text-base">vagas restantes</span>
                      </div>
                      <p className="text-red-200 font-semibold text-sm md:text-base">
                        ⏰ Oferta disponível somente por mais <span className="text-red-300 font-bold">3 dias</span>
                      </p>
                      <p className="text-red-300 text-xs md:text-sm">
                        Após esgotar as vagas, o preço volta para <span className="line-through">R$ 297,00</span>
                      </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm max-w-3xl mx-auto text-center">
                      <div className="bg-white/5 rounded-lg p-3 md:p-4 flex flex-col items-center">
                        <span className="text-lg md:text-2xl mb-2">📈</span>
                        <span className="text-gray-300">Cada dia usando prompts ineficazes = oportunidades perdidas</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 md:p-4 flex flex-col items-center">
                        <span className="text-lg md:text-2xl mb-2">⏱️</span>
                        <span className="text-gray-300">Tempo que você economiza se aplica desde o primeiro uso</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 md:p-4 flex flex-col items-center">
                        <span className="text-lg md:text-2xl mb-2">💡</span>
                        <span className="text-gray-300">Preço especial válido apenas para os primeiros 30 usuários</span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="mt-6 md:mt-10 flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
                      <button 
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base" 
                        onClick={convertNow}
                      >
                        🚀 Garantir Acesso Vitalício (R$ 105)
                      </button>
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base" 
                        onClick={convertNow}
                      >
                        💎 Começar Plano Mensal (R$ 27,99)
                      </button>
                    </div>

                    <p className="text-blue-200 text-xs md:text-sm mt-4">
                      🔒 Compra 100% segura • ✅ Garantia de 30 dias • 🎯 Suporte incluído
                    </p>
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
