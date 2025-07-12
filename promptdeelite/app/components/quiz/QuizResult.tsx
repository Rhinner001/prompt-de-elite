// app/components/quiz/QuizResult.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Star, Gift, ArrowRight, Users, Clock, Target, Zap, Crown, Sparkles, TrendingUp, Award, CheckCircle, Rocket } from 'lucide-react';

interface UserProfile {
  type: 'conquistador' | 'estrategista' | 'criativo' | 'acelerador';
  title: string;
  description: string;
  benefits: string[];
  challenge: string;
}

interface QuizResultProps {
  profile: UserProfile;
}

const profileConfig = {
  conquistador: {
    icon: Trophy,
    gradient: 'from-red-500 via-orange-500 to-yellow-500',
    emoji: '🏆',
    bgGlow: 'from-red-500/20 to-orange-500/20',
    borderColor: 'border-red-500/30'
  },
  estrategista: {
    icon: Target,
    gradient: 'from-blue-500 via-cyan-500 to-blue-600',
    emoji: '🎯',
    bgGlow: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30'
  },
  criativo: {
    icon: Sparkles,
    gradient: 'from-purple-500 via-pink-500 to-purple-600',
    emoji: '🎨',
    bgGlow: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30'
  },
  acelerador: {
    icon: Rocket,
    gradient: 'from-green-500 via-emerald-500 to-green-600',
    emoji: '⚡',
    bgGlow: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30'
  }
};

export default function QuizResult({ profile }: QuizResultProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [counters, setCounters] = useState({ users: 0, satisfaction: 0, results: 0 });

  const config = profileConfig[profile.type];
  const ProfileIcon = config.icon;

  useEffect(() => {
    // Fase 1: Entrada dramática
    setTimeout(() => setAnimationPhase(1), 300);
    
    // Fase 2: Confetti
    setTimeout(() => {
      setShowConfetti(true);
      setAnimationPhase(2);
    }, 800);
    
    // Fase 3: Números animados
    setTimeout(() => setAnimationPhase(3), 1200);
    
    // Remover confetti
    setTimeout(() => setShowConfetti(false), 4000);

    // Animar contadores
    const animateCounters = () => {
      let frame = 0;
      const animate = () => {
        frame++;
        setCounters({
          users: Math.min(Math.floor((frame / 60) * 10000), 10000),
          satisfaction: Math.min(Math.floor((frame / 60) * 95), 95),
          results: Math.min(Math.floor((frame / 60) * 300), 300)
        });
        if (frame < 60) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };

    setTimeout(animateCounters, 1500);
  }, []);

  const handleUpgrade = () => {
    router.push('/planos?from=quiz&profile=' + profile.type);
  };

  const handleFreeAccess = () => {
    router.push('/auth/register?plan=free&from=quiz&profile=' + profile.type);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Partículas de celebração de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-gradient-to-r ${config.gradient} rounded-full animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Entrada dramática do resultado */}
      <div className={`text-center space-y-6 transition-all duration-1000 ${animationPhase >= 1 ? 'animate-in slide-in-from-bottom-10' : 'opacity-0'}`}>
        {/* Ícone principal com celebração */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className={`w-32 h-32 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-1000 ${animationPhase >= 2 ? 'scale-110 rotate-12' : 'scale-100'}`}>
              <div className="text-6xl animate-bounce">{config.emoji}</div>
            </div>
            
            {/* Anéis de celebração */}
            <div className={`absolute inset-0 w-32 h-32 bg-gradient-to-r ${config.gradient} rounded-full blur-2xl opacity-40 animate-pulse`}></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-white/30 rounded-full animate-ping"></div>
            
            {/* Estrelas orbitais */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 text-yellow-400"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-60px)`,
                  animation: `spin 3s linear infinite`
                }}
              >
                ⭐
              </div>
            ))}
          </div>
        </div>

        {/* Título com efeito épico */}
        <div className="space-y-4">
          <div className="text-2xl text-gray-300 font-medium">🎉 Parabéns! Seu perfil é:</div>
          <h1 className={`text-5xl md:text-7xl font-bold transition-all duration-1000 ${animationPhase >= 2 ? 'animate-in zoom-in-105' : ''}`}>
            <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
              {profile.title}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Baseado nas suas respostas, identificamos que seu maior desafio é{' '}
            <span className={`font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
              {profile.challenge}
            </span>
          </p>
        </div>
      </div>

      {/* Descrição do perfil com glassmorphism */}
      <div className={`transition-all duration-1000 delay-300 ${animationPhase >= 3 ? 'animate-in slide-in-from-left-10' : 'opacity-0'}`}>
        <div className={`bg-gradient-to-r ${config.bgGlow} backdrop-blur-sm border ${config.borderColor} rounded-2xl p-8 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <ProfileIcon className={`w-8 h-8 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`} />
              <h3 className="text-2xl font-bold text-white ml-3">Seu Perfil Detalhado</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed text-center">
              {profile.description}
            </p>
          </div>
        </div>
      </div>

      {/* Métricas sociais animadas */}
      <div className={`transition-all duration-1000 delay-500 ${animationPhase >= 3 ? 'animate-in slide-in-from-right-10' : 'opacity-0'}`}>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#38bdf8]/30 transition-all duration-300 transform hover:scale-105">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{counters.users.toLocaleString()}+</div>
            <div className="text-gray-400">Profissionais transformados</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 transform hover:scale-105">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{counters.satisfaction}%</div>
            <div className="text-gray-400">Taxa de satisfação</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-green-400/30 transition-all duration-300 transform hover:scale-105">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{counters.results}%</div>
            <div className="text-gray-400">Aumento de produtividade</div>
          </div>
        </div>
      </div>

      {/* Benefícios com animação escalonada */}
      <div className={`space-y-6 transition-all duration-1000 delay-700 ${animationPhase >= 3 ? 'animate-in slide-in-from-bottom-10' : 'opacity-0'}`}>
        <h2 className="text-3xl font-bold text-center">
          Com o <span className="bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">Prompt de Elite</span>, você vai conseguir:
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {profile.benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-start space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-green-400/30 transition-all duration-300 transform hover:scale-102"
              style={{ animationDelay: `${800 + (index * 100)}ms` }}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mt-1">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-300 font-medium text-lg leading-relaxed">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs épicos */}
      <div className={`space-y-8 transition-all duration-1000 delay-1000 ${animationPhase >= 3 ? 'animate-in slide-in-from-bottom-10' : 'opacity-0'}`}>
        {/* CTA Principal */}
        <div className="text-center space-y-4">
          <div className="relative group">
            <button
              onClick={handleUpgrade}
              className={`relative bg-gradient-to-r ${config.gradient} hover:scale-110 text-white font-bold px-12 py-6 text-xl rounded-2xl shadow-2xl transition-all duration-500 transform overflow-hidden`}
              style={{ zIndex: 50 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
              <span className="relative z-10 pointer-events-none">
                🚀 Quero Acessar a Biblioteca Elite Agora
              </span>
            </button>
            <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none`} style={{ zIndex: -1 }} />
          </div>
          <p className="text-gray-400 text-sm">
            🎯 Acesso completo • Prompts ilimitados • Suporte prioritário
          </p>
        </div>

        {/* Separador elegante */}
        <div className="flex items-center justify-center space-x-4">
          <div className="w-20 h-px bg-gradient-to-r from-transparent to-white/20"></div>
          <span className="text-gray-400 text-lg font-medium">ou</span>
          <div className="w-20 h-px bg-gradient-to-l from-transparent to-white/20"></div>
        </div>

        {/* Opção Free */}
        <div className="text-center space-y-4">
          <button
            onClick={handleFreeAccess}
            className="border-2 border-white/20 text-gray-300 hover:text-white hover:border-white/40 hover:bg-white/10 px-10 py-4 text-lg rounded-2xl transition-all duration-300 transform hover:scale-105"
            style={{ zIndex: 50 }}
          >
            🆓 Experimentar Plano Gratuito
          </button>
          <p className="text-gray-400 text-sm">
            3 prompts por mês • Acesso limitado • Sem compromisso
          </p>
        </div>
      </div>

      {/* Urgência com animação especial */}
      <div className={`transition-all duration-1000 delay-1200 ${animationPhase >= 3 ? 'animate-in slide-in-from-bottom-10' : 'opacity-0'}`}>
        <div className="relative">
          <div className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
                <Crown className="w-6 h-6 text-yellow-400 animate-bounce" />
                <span className="text-red-400 font-bold text-xl">🔥 Oferta Especial Exclusiva!</span>
                <Crown className="w-6 h-6 text-yellow-400 animate-bounce" />
                <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-white font-bold text-lg">
                Desconto de 50% válido apenas hoje para novos usuários
              </p>
              <p className="text-gray-300">
                Não perca essa oportunidade única de transformar sua produtividade com IA
              </p>
            </div>
          </div>
          {/* Efeito de pulso */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl animate-ping opacity-30"></div>
        </div>
      </div>
    </div>
  );
}
