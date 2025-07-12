'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import Image from 'next/image'; // ✅ ADICIONAR IMPORT

// Critérios de avaliação profissionais com exemplos
const criterios = [
  {
    id: 1,
    titulo: "Especificidade e Contexto",
    pergunta: "Seus prompts incluem contexto específico sobre o que você quer alcançar?",
    explicacao: "Prompts vagos geram respostas genéricas. Especificidade é fundamental.",
    exemplo: {
      ruim: "❌ Ruim: 'Escreva um texto sobre marketing'",
      bom: "✅ Bom: 'Escreva um texto de 300 palavras sobre marketing digital para pequenas empresas de beleza, focando em Instagram e resultados práticos'"
    },
    peso: 20
  },
  {
    id: 2,
    titulo: "Papel e Perspectiva",
    pergunta: "Você define claramente o papel que a IA deve assumir?",
    explicacao: "Definir um papel específico melhora drasticamente a qualidade da resposta.",
    exemplo: {
      ruim: "❌ Ruim: 'Me ajude com meu negócio'",
      bom: "✅ Bom: 'Atue como um consultor de marketing digital especializado em e-commerce. Analise minha estratégia atual e sugira melhorias'"
    },
    peso: 15
  },
  {
    id: 3,
    titulo: "Formato de Saída",
    pergunta: "Você especifica o formato desejado da resposta?",
    explicacao: "Estrutura clara evita respostas desorganizadas e facilita o uso.",
    exemplo: {
      ruim: "❌ Ruim: 'Explique como fazer um plano de marketing'",
      bom: "✅ Bom: 'Crie um plano de marketing em formato de lista com 5 etapas, cada uma com título, descrição e 3 ações práticas'"
    },
    peso: 15
  },
  {
    id: 4,
    titulo: "Exemplos e Referências",
    pergunta: "Você fornece exemplos ou referências do que espera?",
    explicacao: "Exemplos concretos guiam a IA para o resultado esperado.",
    exemplo: {
      ruim: "❌ Ruim: 'Escreva um email de vendas'",
      bom: "✅ Bom: 'Escreva um email de vendas no estilo da Apple - clean, direto, focado no benefício. Produto: curso online de design'"
    },
    peso: 15
  },
  {
    id: 5,
    titulo: "Limitações e Restrições",
    pergunta: "Você define limitações claras (tamanho, tom, estilo)?",
    explicacao: "Restrições evitam respostas que não servem para seu propósito.",
    exemplo: {
      ruim: "❌ Ruim: 'Crie um post para Instagram'",
      bom: "✅ Bom: 'Crie um post para Instagram com máximo 150 caracteres, tom descontraído, incluindo 3 hashtags populares, sem emojis em excesso'"
    },
    peso: 15
  },
  {
    id: 6,
    titulo: "Iteração e Refinamento",
    pergunta: "Você testa e refina seus prompts baseado nos resultados?",
    explicacao: "Prompts de elite são refinados através de testes constantes.",
    exemplo: {
      ruim: "❌ Ruim: Usar sempre o mesmo prompt e aceitar qualquer resultado",
      bom: "✅ Bom: 'Se a resposta não atender minhas expectativas, reformulo o prompt com mais detalhes e contexto até obter o resultado ideal'"
    },
    peso: 10
  },
  {
    id: 7,
    titulo: "Objetivo Final Claro",
    pergunta: "Você deixa claro qual é o objetivo final do prompt?",
    explicacao: "Sem objetivo claro, a IA não consegue otimizar a resposta.",
    exemplo: {
      ruim: "❌ Ruim: 'Fale sobre vendas'",
      bom: "✅ Bom: 'Meu objetivo é aumentar as vendas do meu e-commerce em 30%. Preciso de uma estratégia detalhada para os próximos 90 dias'"
    },
    peso: 10
  }
];

interface TestimonialType {
  name: string;
  role: string;
  image: string;
  text: string;
  score: string;
}

export default function ChecklistPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, boolean>>({});
  const [email, setEmail] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [, setProfile] = useState('');
  const [showExample, setShowExample] = useState(false);
  const [showOffer, setShowOffer] = useState(false);

  // Recuperar email do localStorage se disponível
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleResponse = (criterioId: number, resposta: boolean) => {
    setRespostas(prev => ({
      ...prev,
      [criterioId]: resposta
    }));
  };

  const nextStep = () => {
    if (currentStep < criterios.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowExample(false);
    } else {
      calculateResults();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowExample(false);
    }
  };

  const calculateResults = async () => {
    setLoading(true);
    
    // Calcular pontuação
    let totalScore = 0;
    criterios.forEach(criterio => {
      if (respostas[criterio.id]) {
        totalScore += criterio.peso;
      }
    });
    
    setScore(totalScore);
    
    // Determinar perfil
    let userProfile = '';
    if (totalScore >= 80) {
      userProfile = 'expert';
    } else if (totalScore >= 50) {
      userProfile = 'intermediario';
    } else {
      userProfile = 'iniciante';
    }
    
    setProfile(userProfile);
    
    // Salvar resultados
    try {
      await addDoc(collection(db, 'checklist_results'), {
        email: email || 'anonimo',
        responses: respostas,
        score: totalScore,
        percentage: totalScore,
        profile: userProfile,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
    
    setLoading(false);
    setShowResults(true);
  };

  const getProfileMessage = () => {
    if (score >= 80) {
      return {
        title: "🚀 Parabéns! Você é um Expert",
        message: "Você domina os fundamentos dos prompts de elite. Está no caminho certo para resultados excepcionais!",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/30"
      };
    } else if (score >= 50) {
      return {
        title: "⚡ Você está no Caminho Certo",
        message: "Você tem uma base sólida, mas há potencial para melhorias significativas que podem transformar seus resultados.",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10 border-yellow-500/30"
      };
    } else {
      return {
        title: "🎯 Grande Potencial de Transformação",
        message: "Você está no início da jornada, mas com as técnicas certas pode evoluir rapidamente e obter resultados impressionantes.",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/30"
      };
    }
  };

  const getGapsIdentified = () => {
    return criterios.filter(criterio => !respostas[criterio.id]);
  };

  const getPersonalizedCopy = () => {
    const gaps = getGapsIdentified();
    const gapCount = gaps.length;
    
    if (score >= 80) {
      return {
        headline: "Você está quase lá! Vamos aperfeiçoar os últimos detalhes",
        subheadline: `Identificamos ${gapCount} área${gapCount > 1 ? 's' : ''} que podem levar seus prompts de 'muito bons' para 'excepcionais'`,
        urgency: "Experts como você sabem que os detalhes fazem toda a diferença",
        value: "Acesso a prompts testados que incorporam todas as técnicas que você domina, mais as que faltam para a perfeição"
      };
    } else if (score >= 50) {
      return {
        headline: "Sua base é sólida! Hora de eliminar as lacunas",
        subheadline: `Descobrimos ${gapCount} pontos críticos que estão impedindo você de ter resultados consistentes`,
        urgency: "Você está a poucos passos de dominar completamente a arte dos prompts",
        value: "Biblioteca completa para transformar seus prompts intermitentes em resultados previsíveis"
      };
    } else {
      return {
        headline: "Descobrimos exatamente onde você pode melhorar",
        subheadline: `Identificamos ${gapCount} áreas fundamentais que, uma vez dominadas, vão transformar completamente seus resultados`,
        urgency: "Cada dia usando prompts ineficazes é tempo e oportunidade perdidos",
        value: "Acesso imediato a prompts testados que já incorporam todas as técnicas que você precisa aprender"
      };
    }
  };

  const getPersonalizedTestimonials = (): TestimonialType[] => {
    if (score >= 80) {
      return [
        {
          name: 'Carlos Mendes',
          role: 'Consultor Senior',
          image: '/images/testimonials/carlos-mendes.jpg',
          text: 'Eu já tinha conhecimento técnico, mas os prompts de elite me mostraram nuances que eu não conhecia. Agora meus resultados são 300% mais precisos.',
          score: '92%'
        },
        {
          name: 'Ana Silva',
          role: 'Especialista em IA',
          image: '/images/testimonials/ana-silva.jpg',
          text: 'Pensei que já dominava prompts, mas descobri técnicas avançadas que revolucionaram meu trabalho. Valeu cada centavo.',
          score: '88%'
        }
      ];
    } else if (score >= 50) {
      return [
        {
          name: 'Roberto Costa',
          role: 'Empreendedor Digital',
          image: '/images/testimonials/roberto-costa.jpg',
          text: 'Tinha resultados inconsistentes. Agora, com os prompts de elite, sei exatamente o que esperar a cada uso.',
          score: '65%'
        },
        {
          name: 'Marina Santos',
          role: 'Freelancer',
          image: '/images/testimonials/marina-santos.jpg',
          text: 'Sabia o básico, mas os gaps que identifiquei aqui eram exatamente o que me faltava. Produtividade triplicou.',
          score: '58%'
        }
      ];
    } else {
      return [
        {
          name: 'João Pereira',
          role: 'Iniciante em IA',
          image: '/images/testimonials/joao-pereira.jpg',
          text: 'Começei do zero e em 30 dias já estava criando prompts que impressionam meus clientes. Mudou minha vida profissional.',
          score: '32%'
        },
        {
          name: 'Luciana Oliveira',
          role: 'Designer',
          image: '/images/testimonials/luciana-oliveira.jpg',
          text: 'Não entendia nada de prompts. Agora crío artes incríveis com comandos precisos. Economizo 5 horas por dia.',
          score: '28%'
        }
      ];
    }
  };

  // Componente de Avatar com fallback
// Componente Avatar Final - Para usar no checklist
const Avatar = ({ testimonial }: { testimonial: TestimonialType }) => {
  const [imageError, setImageError] = useState(false);
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getGradientColor = (name: string) => {
    const colors = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-teal-500', 
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-cyan-500 to-blue-500',
      'from-pink-500 to-rose-500'
    ];
    return colors[name.length % colors.length];
  };

  if (imageError) {
    return (
      <div className={`w-12 h-12 bg-gradient-to-r ${getGradientColor(testimonial.name)} rounded-full flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0`}>
        {getInitials(testimonial.name)}
      </div>
    );
  }

  return (
    <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
      <Image
        src={testimonial.image}
        alt={`Foto de ${testimonial.name}`}
        width={48}
        height={48}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
        priority={false}
        sizes="48px" // ✅ IMPORTANTE: Define o tamanho real usado
        quality={85} // ✅ Qualidade otimizada (padrão é 75)
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAVAQEBAQEAAAAAAAAAAAAAAAAAAQIF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AvgAJdH7/AL8GfwK0Cw4oBzq3/9k="
      />
    </div>
  );
};


  const showOfferSection = () => {
    setShowOffer(true);
    
    // Scroll suave para a seção de oferta
    setTimeout(() => {
      const offerElement = document.getElementById('offer-section');
      if (offerElement) {
        offerElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2b5c] to-[#0c1c3f] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent mb-4">
            🧠 Prompt de Elite
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Checklist de Avaliação de Prompts
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Descubra exatamente onde seus prompts podem melhorar com nossa avaliação profissional
          </p>
        </header>

        {!showResults ? (
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Progresso</span>
                <span className="text-sm text-gray-400">
                  {currentStep + 1} de {criterios.length}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#2477e0] to-[#38bdf8] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / criterios.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Critério Atual */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-4">
                  <span className="text-blue-400 font-semibold text-sm">
                    CRITÉRIO {currentStep + 1}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  {criterios[currentStep].titulo}
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                  {criterios[currentStep].pergunta}
                </p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-yellow-200">
                    💡 {criterios[currentStep].explicacao}
                  </p>
                </div>

                {/* Botão Ver Exemplo */}
                <button
                  onClick={() => setShowExample(!showExample)}
                  className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 text-purple-300 hover:bg-purple-500/30 transition-all duration-300"
                >
                  <span className="text-sm">
                    {showExample ? '👁️ Ocultar Exemplo' : '👁️ Ver Exemplo'}
                  </span>
                </button>

                {/* Exemplo */}
                {showExample && (
                  <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-6">
                    <h4 className="font-bold text-lg mb-4 text-purple-300">📝 Exemplo Prático</h4>
                    <div className="space-y-4">
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-sm text-red-200">
                          {criterios[currentStep].exemplo.ruim}
                        </p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <p className="text-sm text-green-200">
                          {criterios[currentStep].exemplo.bom}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Opções de Resposta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => handleResponse(criterios[currentStep].id, true)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    respostas[criterios[currentStep].id] === true
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-white/20 hover:border-green-500/50'
                  }`}
                >
                  <div className="text-3xl mb-2">✅</div>
                  <h3 className="text-lg font-semibold mb-2">Sim, sempre faço isso</h3>
                  <p className="text-gray-400 text-sm">
                    Já aplico essa técnica regularmente nos meus prompts
                  </p>
                </button>

                <button
                  onClick={() => handleResponse(criterios[currentStep].id, false)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    respostas[criterios[currentStep].id] === false
                      ? 'border-red-500 bg-red-500/20'
                      : 'border-white/20 hover:border-red-500/50'
                  }`}
                >
                  <div className="text-3xl mb-2">❌</div>
                  <h3 className="text-lg font-semibold mb-2">Não, preciso melhorar</h3>
                  <p className="text-gray-400 text-sm">
                    Raramente ou nunca aplico essa técnica
                  </p>
                </button>
              </div>

              {/* Navegação */}
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300"
                >
                  <span>← Anterior</span>
                </button>

                <button
                  onClick={nextStep}
                  disabled={respostas[criterios[currentStep].id] === undefined}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#2477e0] to-[#38bdf8] hover:from-[#1b5fc7] hover:to-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300"
                >
                  <span>
                    {currentStep === criterios.length - 1 ? 'Ver Resultados' : 'Próximo →'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Resultados + Oferta Integrada */
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38bdf8] mx-auto mb-4"></div>
                <p className="text-gray-300">Analisando seus resultados...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Resultado Principal */}
                <div className={`${getProfileMessage().bgColor} border rounded-2xl p-8 text-center`}>
                  <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">
                    {score}%
                  </div>
                  <h2 className={`text-2xl font-bold mb-4 ${getProfileMessage().color}`}>
                    {getProfileMessage().title}
                  </h2>
                  <p className="text-gray-300 text-lg">
                    {getProfileMessage().message}
                  </p>
                </div>

                {/* Análise Detalhada */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold mb-6">📊 Análise Detalhada</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {criterios.map((criterio) => (
                      <div 
                        key={criterio.id}
                        className={`p-4 rounded-xl border ${
                          respostas[criterio.id] 
                            ? 'border-green-500/30 bg-green-500/10' 
                            : 'border-red-500/30 bg-red-500/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">{criterio.titulo}</h4>
                          <span className="text-2xl">
                            {respostas[criterio.id] ? '✅' : '❌'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">
                          {criterio.explicacao}
                        </p>
                        {!respostas[criterio.id] && (
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <p className="text-xs text-yellow-300 mb-2">💡 Dica:</p>
                            <p className="text-xs text-gray-300">
                              {criterio.exemplo.bom}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transição para Oferta */}
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4 text-orange-300">
                    🎯 Sua Situação Atual
                  </h3>
                  <p className="text-gray-300 text-lg mb-6">
                    {getPersonalizedCopy().subheadline}
                  </p>
                  <div className="bg-white/5 rounded-xl p-6">
                    <p className="text-yellow-300 text-sm mb-4">
                      {getPersonalizedCopy().urgency}
                    </p>
                    <button
                      onClick={showOfferSection}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                    >
                      Ver Minha Solução Personalizada
                    </button>
                  </div>
                </div>

                {/* Oferta Integrada */}
                {showOffer && (
                  <div id="offer-section" className="space-y-8">
                    {/* Headline Personalizada */}
                    <div className="bg-gradient-to-r from-[#2477e0] to-[#38bdf8] rounded-2xl p-8 text-center">
                      <h2 className="text-3xl font-bold mb-4">
                        {getPersonalizedCopy().headline}
                      </h2>
                      <p className="text-blue-100 text-lg">
                        {getPersonalizedCopy().value}
                      </p>
                    </div>

                    {/* Gaps Específicos */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                      <h3 className="text-2xl font-bold mb-6">🔧 Como Vamos Resolver Seus Gaps</h3>
                      <div className="space-y-4">
                        {getGapsIdentified().map((gap, index) => (
                          <div key={gap.id} className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                            <div className="flex items-start space-x-4">
                              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-lg mb-2 text-red-300">
                                  Problema: {gap.titulo}
                                </h4>
                                <p className="text-gray-400 text-sm mb-3">
                                  {gap.explicacao}
                                </p>
                                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                  <p className="text-green-300 text-sm font-semibold mb-1">
                                    ✅ Solução na Biblioteca de Elite:
                                  </p>
                                  <p className="text-green-200 text-sm">
                                    Prompts específicos que já aplicam esta técnica de forma otimizada
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Social Proof Personalizado - CORRIGIDO */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                      <h3 className="text-2xl font-bold mb-6 text-center">
                        💬 Pessoas com Perfil Similar ao Seu
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {getPersonalizedTestimonials().map((testimonial, index) => (
                          <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center mb-4">
                              <Avatar testimonial={testimonial} />
                              <div>
                                <h4 className="font-semibold">{testimonial.name}</h4>
                                <p className="text-gray-400 text-sm">{testimonial.role}</p>
                                <p className="text-blue-400 text-xs">Score inicial: {testimonial.score}</p>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm mb-4">
                              &ldquo;{testimonial.text}&rdquo;
                            </p>
                            <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                          </div>
                        ))}
                      </div>
                    </div>

                                       {/* Oferta Principal */}
                    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-8">
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-4">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          <span className="text-red-400 font-bold text-sm">🔥 OFERTA LIMITADA</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-4">
                          Biblioteca Prompts de Elite
                        </h3>
                        <p className="text-gray-300 text-lg">
                          Acesso completo aos prompts testados que resolvem exatamente os gaps que identificamos
                        </p>
                      </div>

                      {/* Benefícios */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/5 rounded-xl p-6">
                          <h4 className="font-bold text-lg mb-3 text-green-400">✅ O que você recebe:</h4>
                          <ul className="space-y-2 text-gray-300 text-sm">
                            <li>• Prompts testados para cada gap identificado</li>
                            <li>• Exemplos práticos de aplicação</li>
                            <li>• Técnicas avançadas de otimização</li>
                            <li>• Resultados consistentes e previsíveis</li>
                          </ul>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6">
                          <h4 className="font-bold text-lg mb-3 text-blue-400">🎯 Garantia Total:</h4>
                          <ul className="space-y-2 text-gray-300 text-sm">
                            <li>• 30 dias para testar sem riscos</li>
                            <li>• Se não melhorar seus prompts, devolvemos 100%</li>
                            <li>• Suporte para dúvidas e implementação</li>
                            <li>• Acesso vitalício aos prompts</li>
                          </ul>
                        </div>
                      </div>

                      {/* Preços */}
                      <div className="bg-white/5 rounded-xl p-6 mb-8">
                        <div className="text-center mb-6">
                          <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-4">
                            <span className="text-red-400 font-bold text-sm">
                              🔥 APENAS 30 VAGAS DISPONÍVEIS
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm">
                            Oferta especial para quem completou nosso diagnóstico
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 text-center">
                            <h4 className="font-bold text-lg mb-2">💎 Plano Mensal</h4>
                            <div className="text-3xl font-bold text-blue-400 mb-2">R$ 27,99</div>
                            <p className="text-gray-400 text-sm mb-4">por mês</p>
                            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                              Começar Agora
                            </button>
                          </div>
                          
                          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl p-6 text-center relative">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                              MAIS POPULAR
                            </div>
                            <h4 className="font-bold text-lg mb-2">🚀 Plano Vitalício</h4>
                            <div className="text-lg text-gray-400 line-through mb-1">R$ 297,00</div>
                            <div className="text-3xl font-bold text-green-400 mb-2">R$ 105,00</div>
                            <p className="text-gray-400 text-sm mb-4">pagamento único</p>
                            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
                              Garantir Vitalício
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Urgência Específica */}
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                        <h4 className="font-bold text-lg mb-3 text-red-300">⏰ Por que decidir agora?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-2xl mb-2">📈</div>
                            <p className="text-gray-300">
                              Cada dia usando prompts ineficazes = oportunidades perdidas
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-2xl mb-2">⏱️</div>
                            <p className="text-gray-300">
                              Tempo que você economiza se aplica desde o primeiro uso
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-2xl mb-2">💡</div>
                            <p className="text-gray-300">
                              Preço especial válido apenas para os primeiros 30 usuários
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contador de Vagas */}
                      <div className="bg-white/5 rounded-xl p-6 text-center">
                        <h4 className="font-bold text-lg mb-3 text-yellow-400">
                          🎯 Vagas Restantes para Oferta Especial
                        </h4>
                        <div className="flex justify-center space-x-4 text-2xl font-bold mb-4">
                          <div className="bg-red-500 text-white rounded-lg px-4 py-2">0</div>
                          <div className="bg-red-500 text-white rounded-lg px-4 py-2">0</div>
                          <div className="bg-red-500 text-white rounded-lg px-4 py-2">1</div>
                          <div className="bg-red-500 text-white rounded-lg px-4 py-2">7</div>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Após esgotar as vagas, preço volta para R$ 297,00
                        </p>
                      </div>

                      {/* FAQs Específicas */}
                      <div className="bg-white/5 rounded-xl p-6">
                        <h4 className="font-bold text-lg mb-4 text-center">❓ Dúvidas Frequentes</h4>
                        <div className="space-y-4">
                          <div className="bg-white/5 rounded-lg p-4">
                            <h5 className="font-semibold mb-2 text-yellow-300">
                              &ldquo;Os prompts vão funcionar para minha área específica?&rdquo;
                            </h5>
                            <p className="text-gray-300 text-sm">
                              Sim! Nossa biblioteca tem prompts testados para marketing, vendas, criação de conteúdo, 
                              análise de dados, atendimento ao cliente e muito mais. Todos seguem os mesmos princípios 
                              fundamentais que identificamos nos seus gaps.
                            </p>
                          </div>
                          
                          <div className="bg-white/5 rounded-lg p-4">
                            <h5 className="font-semibold mb-2 text-yellow-300">
                              &ldquo;E se eu não conseguir implementar as técnicas?&rdquo;
                            </h5>
                            <p className="text-gray-300 text-sm">
                              Cada prompt vem com explicação detalhada e exemplos práticos. Além disso, 
                              você tem 30 dias para testar. Se não conseguir aplicar, devolvemos seu dinheiro.
                            </p>
                          </div>
                          
                          <div className="bg-white/5 rounded-lg p-4">
                            <h5 className="font-semibold mb-2 text-yellow-300">
                              &ldquo;Posso cancelar a qualquer momento?&rdquo;
                            </h5>
                            <p className="text-gray-300 text-sm">
                              No plano mensal, sim. No plano vitalício, você paga uma vez e tem acesso para sempre. 
                              Ambos têm garantia de 30 dias.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Final */}
                    <div className="bg-gradient-to-r from-[#2477e0] to-[#38bdf8] rounded-2xl p-8 text-center">
                      <h3 className="text-2xl font-bold mb-4">
                        🎯 Sua Jornada de Transformação Começa Agora
                      </h3>
                      <p className="text-blue-100 text-lg mb-6">
                        Você já deu o primeiro passo identificando seus gaps. 
                        Agora é hora de resolvê-los definitivamente.
                      </p>
                      
                      <div className="bg-white/10 rounded-xl p-6 mb-6">
                        <h4 className="font-bold text-lg mb-3">📋 Resumo da Sua Situação:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="bg-red-500/20 rounded-lg p-3">
                            <h5 className="font-semibold mb-1 text-red-300">
                              ❌ Gaps Identificados: {getGapsIdentified().length}
                            </h5>
                            <p className="text-red-200">
                              Áreas que estão limitando seus resultados
                            </p>
                          </div>
                          <div className="bg-green-500/20 rounded-lg p-3">
                            <h5 className="font-semibold mb-1 text-green-300">
                              ✅ Solução Disponível: Imediata
                            </h5>
                            <p className="text-green-200">
                              Prompts testados para cada gap identificado
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
                          🚀 Garantir Acesso Vitalício (R$ 105)
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
                          💎 Começar Plano Mensal (R$ 27,99)
                        </button>
                      </div>
                      
                      <p className="text-blue-200 text-sm mt-4">
                        🔒 Compra 100% segura • ✅ Garantia de 30 dias • 🎯 Suporte incluído
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
