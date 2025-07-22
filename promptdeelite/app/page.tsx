// app/page.tsx - SUA LANDING PAGE COM REDIRECIONAMENTO
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/src/components/context/AuthContext'; // ADICIONADO

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const particles = [
  { left: 15, top: 20, delay: 0.5, duration: 2.5 },
  { left: 85, top: 15, delay: 1.2, duration: 3.1 },
  { left: 25, top: 75, delay: 0.8, duration: 2.8 },
  { left: 90, top: 50, delay: 1.5, duration: 2.2 },
  { left: 10, top: 85, delay: 0.3, duration: 3.5 },
  { left: 70, top: 25, delay: 1.8, duration: 2.6 },
  { left: 40, top: 90, delay: 0.7, duration: 3.2 },
  { left: 80, top: 10, delay: 1.3, duration: 2.9 }
];

const liveActivity = [
  "Marina acabou de descobrir que está no nível Expert! 🎯",
  "Carlos identificou 5 erros críticos nos seus prompts ⚠️",
  "Ana descobriu técnicas que aumentaram seus resultados em 340% 📈",
  "Pedro passou de Iniciante para Avançado em 1 semana 🚀",
  "Julia economizou 15 horas/semana com os novos prompts ⏰",
  "Ricardo conseguiu triplicar a qualidade das suas IAs 💎"
];

const testimonials = [
  {
    name: 'Beatriz Silva',
    role: '🎨 SEO',
    image: '/images/testimonials/beatriz-silva.jpg',
    text: 'Descobri que estava fazendo 3 erros básicos. Corrigi e agora crio artes incríveis em minutos.',
    improvement: '+340% mais rápida'
  },
  {
    name: 'Roberto Costa',
    role: '🚀 Empreendedor',
    image: '/images/testimonials/roberto-costa.jpg',
    text: 'O diagnóstico mostrou meus pontos cegos. Mudou meu jogo completamente.',
    improvement: 'Economiza 15h/semana'
  },
  {
    name: 'Ana Moreira',
    role: '✍️ Copywriter',
    image: '/images/testimonials/ana-moreira.jpg',
    text: 'Era frustrante receber sempre textos genéricos. Agora a IA escreve no meu tom.',
    improvement: 'Resultados 5x melhores'
  }
];

function TestimonialCard({ name, role, image, text, improvement }: any) {
  return (
    <div className="relative overflow-hidden group bg-gradient-to-br from-[#192343]/70 to-[#2477e0]/10 border border-[#38bdf8]/30 rounded-2xl p-4 sm:p-6 shadow-xl transition-transform duration-300 hover:scale-105">
      <div className="absolute -top-1/3 -left-1/3 w-[200%] h-[200%] pointer-events-none opacity-30 group-hover:opacity-60 transition">
        <div className="animate-spin-slow w-full h-full rounded-full bg-gradient-to-r from-[#38bdf8] via-white/20 to-[#2477e0] blur-2xl"></div>
      </div>
      <div className="relative z-10 flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-[#38bdf8]/50 shadow-lg overflow-hidden flex-shrink-0 bg-white">
          <Image src={image} alt={`Foto de ${name}`} width={56} height={56} className="object-cover w-full h-full" />
        </div>
        <div>
          <div className="font-bold text-white text-base sm:text-lg">{name}</div>
          <div className="text-blue-300 text-xs sm:text-sm">{role}</div>
        </div>
      </div>
      <div className="text-gray-200 text-sm sm:text-base mb-2 sm:mb-3">{text}</div>
      {improvement && (
        <div className="text-green-400 text-xs font-semibold mt-2">{improvement}</div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#38bdf8] via-[#2477e0] to-transparent blur-sm opacity-60"></div>
    </div>
  );
}

export default function LandingPageHighConversion() {
  const router = useRouter();
  
  // ADICIONADO - Sistema de redirecionamento
  const { user, loading } = useAuth();
  const [shouldRenderLanding, setShouldRenderLanding] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Estados originais da landing
  const [timeLeft, setTimeLeft] = useState(300);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [usersToday, setUsersToday] = useState(2500);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ADICIONADO - Lógica de redirecionamento
  useEffect(() => {
    // Se ainda está carregando auth, espera
    if (loading) return;

    // Se usuário está logado, verifica se deve redirecionar
    if (user) {
      const lastVisit = localStorage.getItem('lastDashboardVisit');
      
      if (lastVisit) {
        const lastVisitTime = new Date(lastVisit).getTime();
        const now = new Date().getTime();
        const hoursSinceLastVisit = (now - lastVisitTime) / (1000 * 60 * 60);
        
        // Se visitou o dashboard nas últimas 24 horas, redireciona
        if (hoursSinceLastVisit < 24) {
          console.log('🔄 Usuário ativo detectado, redirecionando para dashboard...');
          setIsRedirecting(true);
          router.replace('/dashboard');
          return;
        }
      }
      
      // Se usuário logado mas não visitou recentemente, ainda redireciona
      console.log('👤 Usuário logado detectado, redirecionando...');
      setIsRedirecting(true);
      router.replace('/dashboard');
      return;
    }
    
    // Se não está logado, renderiza a landing
    setShouldRenderLanding(true);
  }, [user, loading, router]);

  // Estados originais da landing
  useEffect(() => {
    setIsClient(true);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    setUsersToday(Math.floor(Math.random() * 500) + 2500);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    const activityTimer = setInterval(() => {
      setCurrentActivity(prev => (prev + 1) % liveActivity.length);
    }, 4000);
    return () => clearInterval(activityTimer);
  }, [isClient]);

  const handleStartQuiz = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'CTA',
        event_label: 'Start Quiz Direct'
      });
    }
    router.push('/quiz');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  // ADICIONADO - Loading state enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2b5c] to-[#0c1c3f] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full"></div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Carregando</h2>
            <p className="text-slate-400">Verificando seu acesso...</p>
          </div>
        </div>
      </div>
    );
  }

  // ADICIONADO - Redirecting state quando está redirecionando usuário logado
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2b5c] to-[#0c1c3f] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-600 border-t-green-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500/20 rounded-full"></div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-green-400 mb-2">Bem-vindo de volta!</h2>
            <p className="text-slate-400">Redirecionando para seu dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // ADICIONADO - Se não deve renderizar a landing ainda, retorna null
  if (!shouldRenderLanding) {
    return null;
  }

  // RESTO DO SEU CÓDIGO DA LANDING PERMANECE EXATAMENTE IGUAL
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2b5c] to-[#0c1c3f] text-white relative overflow-hidden">
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-60"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`
              }}
            />
          ))}
        </div>
      )}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes intense-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(56,189,248,0.3), 0 0 40px rgba(56,189,248,0.1);}
            50% { box-shadow: 0 0 30px rgba(56,189,248,0.5), 0 0 60px rgba(56,189,248,0.2);}
          }
          @keyframes urgent-pulse {
            0%, 100% { opacity: 1; transform: scale(1);}
            50% { opacity: 0.9; transform: scale(1.02);}
          }
          .mega-glow { animation: intense-glow 3s ease-in-out infinite;}
          .urgent-pulse { animation: urgent-pulse 2s ease-in-out infinite;}
          .number-highlight { text-shadow: 0 0 15px rgba(56,189,248,0.4);}
          .premium-card { transition: all 0.3s ease;}
          .premium-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(56,189,248,0.2);}
          .star-rating { filter: drop-shadow(0 0 3px rgba(251,191,36,0.6));}
          .cta-button { position: relative; overflow: hidden;}
          .cta-button:before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); transition: left 0.5s;}
          .cta-button:hover:before { left: 100%;}
          .animate-spin-slow { animation: spin 8s linear infinite;}
        `
      }} />

      <div className="relative z-10">
        {/* Header */}
        <header className="py-2 px-2 sm:py-4 sm:px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">
                🧠 Prompt de Elite
              </div>
              {isClient && timeLeft > 0 && (
                <div className="bg-red-500/20 border border-red-500/40 rounded-full px-2 py-1 sm:px-4 sm:py-2 urgent-pulse">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" aria-hidden="true"></span>
                    <span className="text-red-400 font-bold text-xs sm:text-sm" aria-live="polite">
                      ⏰ Acesso liberado: {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Atividade ao vivo */}
        {isClient && (
          <div className="py-1 px-2 sm:py-2 sm:px-4">
            <div className="container mx-auto">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-2 sm:p-3 max-w-md mx-auto">
                <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></div>
                  <span className="text-green-400 text-xs font-medium">🔴 AO VIVO:</span>
                </div>
                <p className="text-gray-300 text-sm sm:text-base">
                  {liveActivity[currentActivity]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="py-6 sm:py-12 px-2 sm:px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-1 sm:space-x-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 sm:px-6 sm:py-3 mb-5 sm:mb-8 urgent-pulse">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" aria-hidden="true"></div>
                <span className="text-red-400 font-bold text-xs sm:text-sm">🔥 DESCOBERTA CRÍTICA</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-6 leading-normal sm:leading-tight">
                <span className="text-red-400">Por que</span> seus prompts falham<br />
                <span className="bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">
                  enquanto outros dominam a IA?
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-2xl mb-4 sm:mb-8 text-gray-200 leading-relaxed">
                <strong className="text-green-400">Em 2 minutos</strong> descubra exatamente o que está te impedindo de dominar a IA e
                <span className="text-yellow-400 font-semibold"> receba um plano personalizado para evoluir</span>
              </p>

              {/* CTA Principal */}
              <div className="mb-6 sm:mb-12">
                <button
                  onClick={handleStartQuiz}
                  className="cta-button relative group bg-gradient-to-r from-[#2477e0] via-[#38bdf8] to-[#2477e0] hover:from-[#1b5fc7] hover:via-[#2563eb] hover:to-[#1b5fc7] text-white font-bold py-4 px-6 sm:py-6 sm:px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl mega-glow text-base sm:text-xl"
                  aria-label="Fazer diagnóstico de inteligência artificial em 2 minutos"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3">
                    <span>🧠</span>
                    <span>Fazer Diagnóstico em 2 min</span>
                    <span>⚡</span>
                  </span>
                </button>
                <div className="mt-3 sm:mt-6 space-y-1 sm:space-y-3">
                  <p className="text-xs sm:text-sm text-gray-400">
                    ⚡ Sem cadastro • Resultado imediato • 100% gratuito
                  </p>
                  <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-6 text-xs text-gray-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" aria-hidden="true"></span>
                      {usersToday} pessoas testaram hoje
                    </span>
                    <span className="hidden sm:inline" aria-hidden="true">•</span>
                    <span className="flex items-center">
                      <span className="text-yellow-400 text-sm mr-1" aria-hidden="true">⭐</span>
                      4.9/5 em satisfação
                    </span>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
                <div className="bg-white/5 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/10 premium-card">
                  <div className="text-3xl sm:text-5xl font-bold text-red-400 mb-2 sm:mb-3 number-highlight">87%</div>
                  <div className="flex justify-center mb-2 sm:mb-3">
                    <div className="text-yellow-400 text-base sm:text-lg star-rating" aria-hidden="true">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-gray-300 text-base sm:text-lg">dos prompts <strong>falham miseravelmente</strong></p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/10 premium-card">
                  <div className="text-3xl sm:text-5xl font-bold text-red-400 mb-2 sm:mb-3 number-highlight">94%</div>
                  <div className="flex justify-center mb-2 sm:mb-3">
                    <div className="text-yellow-400 text-base sm:text-lg star-rating" aria-hidden="true">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-gray-300 text-base sm:text-lg">recebem respostas <strong>genéricas e inúteis</strong></p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/10 premium-card relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
                  <div className="relative z-10">
                    <div className="text-3xl sm:text-5xl font-bold text-green-400 mb-2 sm:mb-3 number-highlight">3%</div>
                    <div className="flex justify-center mb-2 sm:mb-3">
                      <div className="text-yellow-400 text-base sm:text-lg star-rating" aria-hidden="true">⭐⭐⭐⭐⭐</div>
                    </div>
                    <p className="text-gray-300 text-base sm:text-lg"><strong className="text-green-400">DOMINAM</strong> completamente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-10 sm:py-16 px-2 sm:px-4">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-4">
                <span>💬</span> Veja o que acontece quando você <span className="text-green-400">acerta</span>
              </h2>
              <p className="text-base sm:text-xl text-center text-gray-300 mb-6 sm:mb-12">
                Resultados reais de pessoas que descobriram seus pontos fracos:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
                {testimonials.map((t, i) => (
                  <TestimonialCard key={i} {...t} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final ÚNICO */}
        <section className="py-10 sm:py-20 px-2 sm:px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-[#2477e0]/20 via-[#38bdf8]/20 to-[#2477e0]/20 border border-[#38bdf8]/30 p-6 sm:p-12 rounded-3xl mega-glow">
                <div className="text-4xl sm:text-6xl mb-4 sm:mb-6" aria-hidden="true">🎯</div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  Sua Jornada de <span className="bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">Domínio da IA</span><br />
                  Começa <span className="text-green-400">Agora</span>
                </h2>
                <p className="text-base sm:text-xl text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Em apenas <strong className="text-yellow-400">2 minutos</strong> você vai descobrir exatamente o que está travando seus resultados
                </p>

                <button
                  onClick={handleStartQuiz}
                  className="cta-button relative group bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white font-bold py-4 px-8 sm:py-6 sm:px-16 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg sm:text-2xl"
                  aria-label="Fazer diagnóstico de inteligência artificial em 2 minutos"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-4">
                    <span>🧠</span>
                    <span>Fazer Diagnóstico em 2 min</span>
                    <span>⚡</span>
                  </span>
                </button>

                <div className="text-center space-y-1 sm:space-y-2 mt-4 sm:mt-6">
                  <p className="text-xs sm:text-sm text-gray-400">
                    ⚡ Sem cadastro • Sem compromisso • Resultado na hora
                  </p>
                  <div className="flex justify-center items-center space-x-3 sm:space-x-6 text-xs text-gray-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" aria-hidden="true"></span>
                      {usersToday} pessoas descobriram hoje
                    </span>
                    <span className="hidden sm:inline" aria-hidden="true">•</span>
                    <span className="flex items-center">
                      <span className="text-yellow-400 mr-1" aria-hidden="true">⭐</span>
                      4.9/5 satisfação
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Premium */}
        <footer className="py-6 sm:py-8 px-2 sm:px-4 border-t border-white/10">
          <div className="container mx-auto text-center">
            <div className="bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              🧠 Prompt de Elite
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 text-gray-400">
                <span aria-hidden="true">🔒</span>
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <span aria-hidden="true">⚡</span>
                <span>Resultado Imediato</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <span aria-hidden="true">🎯</span>
                <span>Sem Spam</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <span aria-hidden="true">🆓</span>
                <span>Sempre Gratuito</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2024 Prompt de Elite. Todos os direitos reservados.
            </p>
            <div className="flex justify-center mt-2 sm:mt-4">
              <div className="text-yellow-400 text-lg sm:text-xl star-rating" aria-hidden="true">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}