'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface UserProfile {
  type: string;
  title: string;
  icon: string;
  description: string;
  mainPain: string;
  transformation: string;
}

// Testimonials data
const testimonials = [
  {
    name: 'Marina Costa',
    role: 'Designer',
    image: '/images/testimonials/marina-costa.jpg',
    text: 'O checklist mudou minha forma de criar prompts. Resultados imediatos!',
    improvement: '+340% mais rápida'
  },
  {
    name: 'João Pereira',
    role: 'Empreendedor',
    image: '/images/testimonials/joao-pereira.jpg',
    text: 'Finalmente entendi porque meus prompts não funcionavam. Agora é outro nível.',
    improvement: 'Economiza 15h/semana'
  },
  {
    name: 'Ana Moreira',
    role: 'Copywriter',
    image: '/images/testimonials/ana-moreira.jpg',
    text: 'Era frustrante receber sempre textos genéricos. Agora a IA escreve exatamente no meu tom.',
    improvement: 'Resultados 5x melhores'
  }
];

// Testimonial Card with optimized animation
function TestimonialCard({ name, role, image, text, improvement }: any) {
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

  return (
    <div className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-[#38bdf8]/30 hover:shadow-xl hover:shadow-[#38bdf8]/10">
      {/* Glow effect otimizado para mobile */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#38bdf8]/0 via-[#38bdf8]/5 to-[#2477e0]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-4 mb-4">
          {imageError ? (
            <div className={`w-12 h-12 bg-gradient-to-r ${getGradientColor(name)} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
              {getInitials(name)}
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#38bdf8]/30 flex-shrink-0">
              <Image 
                src={image} 
                alt={name} 
                width={48} 
                height={48} 
                className="w-full h-full object-cover" 
                onError={() => setImageError(true)}
                priority={false}
              />
            </div>
          )}
          <div>
            <div className="font-bold text-white text-base">{name}</div>
            <div className="text-blue-300 text-sm">{role}</div>
          </div>
        </div>
        
        <div className="flex justify-start mb-3">
          <div className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 italic">"{text}"</p>
        
        {improvement && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2">
            <div className="text-green-400 font-semibold text-xs">📈 {improvement}</div>
          </div>
        )}
      </div>
      
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#38bdf8]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}

// Kit Card Component
function KitCard({ icon, title, description, color, bgColor }: any) {
  return (
    <div className={`group relative overflow-hidden bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 hover:border-${color}/30 hover:shadow-lg hover:shadow-${color}/10`}>
      {/* Animated icon container */}
      <div className={`w-16 h-16 bg-gradient-to-r ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{icon}</span>
      </div>
      
      <h3 className={`text-lg font-bold ${color} mb-2 transition-colors duration-300`}>{title}</h3>
      <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">
        {description}
      </p>
      
      {/* Hover effect border */}
      <div className={`absolute inset-0 border-2 border-${color}/0 group-hover:border-${color}/20 rounded-xl transition-colors duration-300`}></div>
    </div>
  );
}

// Success Card Component
function SuccessCard({ icon, title, description, color, bgColor }: any) {
  return (
    <div className={`group relative overflow-hidden bg-gradient-to-br ${bgColor} border border-${color}/30 rounded-xl p-6 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-${color}/20`}>
      <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">{icon}</div>
      <h3 className={`text-lg font-bold ${color} mb-2`}>{title}</h3>
      <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">
        {description}
      </p>
      
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-t from-${color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`}></div>
    </div>
  );
}

// Checklist Item Component
function ChecklistItem({ item, index }: any) {
  return (
    <div className="group bg-white/5 rounded-xl p-6 border border-white/10 transition-all duration-300 hover:bg-white/8 hover:border-white/20 hover:shadow-lg">
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
          <span className="text-white font-bold text-sm">{index + 1}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">{item.title}</h3>
          <p className="text-gray-300 mb-3 group-hover:text-gray-200 transition-colors duration-300">{item.description}</p>
          <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-500 group-hover:border-blue-400 group-hover:bg-gray-800/70 transition-all duration-300">
            <p className="text-sm text-gray-200" dangerouslySetInnerHTML={{ __html: item.tip }}></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccessPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistProgress, setChecklistProgress] = useState(0);
  const [checklistScore, setChecklistScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Detect mobile for performance optimization
    setIsMobile(window.innerWidth < 768);
    
    const savedProfile = localStorage.getItem('userQuizProfile');
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile);
        setUserProfile(profileData.profile);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setUserProfile({
          type: 'default',
          title: 'Usuário Motivado',
          icon: '🎯',
          description: 'Você chegou até aqui porque quer realmente dominar prompts de IA.',
          mainPain: 'Prompts que não entregam os resultados esperados',
          transformation: 'Com as técnicas certas, você pode transformar completamente seus resultados'
        });
      }
    } else {
      setUserProfile({
        type: 'default',
        title: 'Usuário Motivado',
        icon: '🎯',
        description: 'Você chegou até aqui porque quer realmente dominar prompts de IA.',
        mainPain: 'Prompts que não entregam os resultados esperados',
        transformation: 'Com as técnicas certas, você pode transformar completamente seus resultados'
      });
    }

    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'leads_acesso'), {
        email,
        profile: userProfile?.type || 'default',
        source: 'pagina_acesso',
        createdAt: Timestamp.now()
      });

      localStorage.setItem('userEmail', email);
      setStep('success');
      setTimeout(() => {
        setShowChecklist(true);
        animateChecklistProgress();
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateChecklistProgress = () => {
    let progress = 0;
    let score = 0;
    const interval = setInterval(() => {
      progress += 14.28;
      score += 1;
      setChecklistProgress(progress);
      setChecklistScore(score);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 300);
  };

  const checklistItems = [
    { title: "Contexto Específico", description: "Você fornece contexto detalhado ao invés de perguntas genéricas?", tip: "❌ Ruim: 'Escreva um texto sobre marketing' | ✅ Bom: 'Escreva um email de vendas para empreendedores que faturam entre 50-200k/mês, focando em automação...'" },
    { title: "Papel Definido", description: "Você define um papel específico para a IA assumir?", tip: "❌ Ruim: 'Me ajude com copy' | ✅ Bom: 'Atue como um copywriter experiente em direct response com 10 anos de experiência...'" },
    { title: "Formato de Saída", description: "Você especifica exatamente como quer receber a resposta?", tip: "❌ Ruim: 'Faça uma lista' | ✅ Bom: 'Organize em tópicos numerados, com subtítulos em negrito e exemplos práticos para cada item...'" },
    { title: "Restrições e Limites", description: "Você estabelece limitações claras para a resposta?", tip: "❌ Ruim: 'Escreva um artigo' | ✅ Bom: 'Escreva um artigo de 800-1000 palavras, sem usar jargões técnicos, focado em iniciantes...'" },
    { title: "Exemplos Práticos", description: "Você fornece exemplos do que quer ou não quer?", tip: "❌ Ruim: 'Crie um título chamativo' | ✅ Bom: 'Crie um título como \"Como Triplicar Vendas em 30 Dias\" mas evite palavras como \"segredo\" ou \"milagroso\"...'" },
    { title: "Tom e Estilo", description: "Você define o tom de voz e estilo da comunicação?", tip: "❌ Ruim: 'Escreva um post' | ✅ Bom: 'Escreva um post no tom conversacional, como se fosse um mentor experiente falando com um aprendiz...'" },
    { title: "Iteração e Refinamento", description: "Você usa as respostas para refinar e melhorar o prompt?", tip: "❌ Ruim: Aceitar a primeira resposta | ✅ Bom: 'Agora refaça focando mais no aspecto prático e menos na teoria...'" }
  ];

  // Estilos CSS otimizados
  const styles = `
    @keyframes subtle-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    
    @keyframes gentle-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(56, 189, 248, 0.1); }
      50% { box-shadow: 0 0 30px rgba(56, 189, 248, 0.2); }
    }
    
    .premium-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .premium-card:hover {
      transform: translateY(-2px) scale(1.01);
    }
    
    ${isMobile ? '' : `
      .desktop-glow {
        animation: gentle-glow 4s ease-in-out infinite;
      }
    `}
    
    .star-rating {
      filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.5));
    }
  `;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2b5c] to-[#0c1c3f] text-white">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="max-w-4xl mx-auto p-4 py-8 md:py-12">
        {step === 'form' && (
          <div className="space-y-8 md:space-y-12">
            {/* Header Animado */}
            <div className="text-center space-y-4 md:space-y-6">
              <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3 mb-4 transition-all duration-300 hover:bg-green-500/30 hover:scale-105">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-400 font-bold text-sm">🎉 DIAGNÓSTICO CONFIRMADO</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                <span className="text-white">Parabéns!</span><br />
                <span className="text-green-400">Você está entre os 3%</span><br />
                <span className="bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">
                  que realmente querem dominar a IA
                </span>
              </h1>
              
              {userProfile && (
                <div className="premium-card bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto hover:bg-white/8 hover:border-white/20">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <span className="text-4xl transition-transform duration-300 hover:scale-110">{userProfile.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">Perfil: {userProfile.title}</h3>
                      <p className="text-gray-300 text-sm">
                        {userProfile.type === 'default' ? 'Perfil identificado' : 'Identificado pelo diagnóstico'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-center">{userProfile.description}</p>
                </div>
              )}
            </div>

            {/* Kit Animado */}
            <div className="premium-card bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-8 hover:from-blue-500/25 hover:to-purple-500/25">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">
                🎁 Seu Kit Completo Personalizado
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KitCard 
                  icon="📚"
                  title="eBook Exclusivo"
                  description="Anatomia dos Prompts de Elite - 47 páginas com os segredos dos 3% mais eficazes"
                  color="text-blue-300"
                  bgColor="from-blue-500 to-blue-600"
                />
                
                <KitCard 
                  icon="✅"
                  title="Checklist Interativo"
                  description="7 critérios profissionais personalizado para seu perfil específico"
                  color="text-green-300"
                  bgColor="from-green-500 to-green-600"
                />
                
                <KitCard 
                  icon="🚀"
                  title="Acesso à Plataforma"
                  description="Conta gratuita com 1 prompt premium liberado baseado no seu perfil"
                  color="text-purple-300"
                  bgColor="from-purple-500 to-purple-600"
                />
              </div>
              
              <div className="text-center mt-8">
                <div className="inline-block premium-card bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl px-6 py-3 hover:from-yellow-500/30 hover:to-orange-500/30">
                  <p className="text-yellow-300 font-bold">
                    🎯 Kit Completo: <span className="line-through text-gray-400">R$ 297,00</span>
                  </p>
                  <p className="text-green-400 font-bold text-xl">
                    Seu Preço Hoje: R$ 0,00 (100% GRATUITO)
                  </p>
                </div>
              </div>
            </div>

            {/* Formulário Animado */}
            <div className="premium-card bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/8 hover:border-white/20">
              <h2 className="text-2xl font-bold text-center mb-6 text-white">
                🔓 Libere Seu Acesso em 1 Clique
              </h2>
              
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    📧 Seu melhor email para receber o acesso:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all duration-300 hover:bg-white/15"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!email || loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg premium-card"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Liberando acesso...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>🎁</span>
                      <span>Liberar Meu Kit Completo Agora</span>
                      <span>⚡</span>
                    </span>
                  )}
                </button>
              </form>
              
              <div className="text-center mt-6">
                <p className="text-xs text-gray-400 mb-2">
                  🔒 Seus dados estão seguros. Não enviamos spam.
                </p>
                <div className="flex flex-wrap justify-center items-center space-x-6 text-xs text-gray-500">
                  <span>✅ Sem compromisso</span>
                  <span>✅ Cancelar a qualquer momento</span>
                  <span>✅ 100% gratuito</span>
                </div>
              </div>
            </div>

            {/* Prova Social Animada */}
            <div className="premium-card bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30 hover:from-gray-800/60 hover:to-gray-900/60">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-4">
                  💬 O que estão dizendo sobre o conteúdo:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                  {testimonials.map((t, i) => (
                    <TestimonialCard key={i} {...t} />
                  ))}
                </div>
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <span className="text-yellow-400 star-rating">⭐⭐⭐⭐⭐</span>
                  <span className="text-gray-300 text-sm">4.9/5 • Mais de 2.847 acessos</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-8">
            {/* Success Message Animado */}
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto transition-transform duration-300 hover:scale-110">
                <span className="text-4xl">✨</span>
              </div>
              <h1 className="text-4xl font-bold text-green-400">
                🎉 Acesso Liberado com Sucesso!
              </h1>
              <p className="text-xl text-gray-300">
                Verifique seu email - enviamos todos os materiais para <strong className="text-blue-400">{email}</strong>
              </p>
            </div>

            {/* Success Cards Animados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SuccessCard 
                icon="📧"
                title="Email Enviado"
                description="Confira sua caixa de entrada (e spam) para acessar o eBook"
                color="text-blue-300"
                bgColor="from-blue-500/20 to-blue-600/10"
              />
              
              <SuccessCard 
                icon="✅"
                title="Checklist Ativo"
                description={showChecklist ? 'Disponível abaixo' : 'Carregando em alguns instantes...'}
                color="text-green-300"
                bgColor="from-green-500/20 to-green-600/10"
              />
              
              <SuccessCard 
                icon="🚀"
                title="Conta Criada"
                description="Acesso liberado à plataforma com seu primeiro prompt premium"
                color="text-purple-300"
                bgColor="from-purple-500/20 to-purple-600/10"
              />
            </div>

            {/* Interactive Checklist Animado */}
            {showChecklist && (
              <div className="premium-card bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    ✅ Seu Checklist Personalizado Interativo
                  </h2>
                  <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${checklistProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-300">
                    Avalie seus prompts atuais com base nos 7 critérios profissionais:
                  </p>
                </div>

                <div className="space-y-6">
                  {checklistItems.map((item, index) => (
                    <ChecklistItem key={index} item={item} index={index} />
                  ))}
                </div>

                {/* Upsell Animado */}
                <div className="text-center mt-12">
                  <div className="premium-card bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-8 hover:from-green-500/25 hover:to-emerald-500/25">
                    <div className="text-4xl mb-4 transition-transform duration-300 hover:scale-110">🎉</div>
                    <h3 className="text-2xl font-bold text-green-400 mb-4">
                      Parabéns! Você domina {Math.min(checklistScore, 7)} de 7 critérios
                    </h3>
                    
                    {checklistScore >= 5 ? (
                      <div>
                        <p className="text-green-200 mb-6">
                          Excelente! Você já tem uma base sólida. Para acelerar ainda mais seus resultados, 
                          conheça nossa biblioteca completa com 25+ prompts testados e validados pelos experts.
                        </p>
                        <button
                          onClick={() => router.push('/biblioteca')}
                          className="premium-card bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                        >
                          🎯 Acelerar com Biblioteca Completa
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-yellow-200 mb-6">
                          Você tem potencial, mas ainda há espaço para crescer! Nossa biblioteca completa 
                          pode te ajudar a dominar todos os 7 critérios rapidamente.
                        </p>
                        <button
                          onClick={() => router.push('/biblioteca')}
                          className="premium-card bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                        >
                          📈 Melhorar Meus Resultados
                        </button>
                      </div>
                    )}
                    
                    <p className="text-gray-400 text-sm mt-4">
                      Sem pressão - apenas se fizer sentido para você
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
