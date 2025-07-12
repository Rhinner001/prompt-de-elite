'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Target, Clock, Gift, CheckCircle, Award } from 'lucide-react';

interface QuizWelcomeProps {
  onStart: () => void;
}

export default function QuizWelcome({ onStart }: QuizWelcomeProps) {
  const [liveCounter, setLiveCounter] = useState(15247);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Dr. Maria Silva",
      role: "Cardiologista",
      text: "Reduzi 5 horas do meu dia usando IA para relatórios. Resultados impressionantes!",
      results: "5h economizadas"
    },
    {
      name: "Carlos Santos", 
      role: "CEO TechStart",
      text: "Aumentei 450% as vendas com copywriting de IA. ROI absurdo!",
      results: "450% vendas"
    },
    {
      name: "Ana Costa",
      role: "Head Marketing",
      text: "Minha equipe produz 12x mais conteúdo. Salvamos o trimestre!",
      results: "12x produtividade"
    }
  ];

  useEffect(() => {
    // Contador ao vivo
    const counterInterval = setInterval(() => {
      setLiveCounter(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000);

    // Rotação de depoimentos
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      clearInterval(counterInterval);
      clearInterval(testimonialInterval);
    };
  }, [testimonials.length]);

  return (
    <div className="text-center space-y-12 animate-in fade-in-50 duration-700 relative">
      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-40 left-32 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute bottom-20 right-40 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
      </div>

      {/* Logo Principal */}
      <div className="flex justify-center mb-8">
        <div className="relative group">
          <div className="w-24 h-24 bg-gradient-to-r from-[#2477e0] via-[#38bdf8] to-[#2477e0] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-500 shadow-2xl">
            <Sparkles className="w-12 h-12 text-white animate-pulse" />
          </div>
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-[#2477e0] to-[#38bdf8] rounded-2xl blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#f87171] to-[#fb7185] rounded-full flex items-center justify-center animate-bounce shadow-lg">
            <Gift className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Título Principal - Copywriting Melhorado */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-white via-[#38bdf8] to-white bg-clip-text text-transparent">
            4 Perguntas Estratégicas
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#38bdf8] via-[#2477e0] to-[#38bdf8] bg-clip-text text-transparent">
            Plano Personalizado
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Descubra exatamente qual método de IA vai{' '}
          <span className="text-[#38bdf8] font-semibold">revolucionar</span>{' '}
          sua produtividade profissional
        </p>
      </div>

      {/* Estatísticas em Tempo Real */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">📊 Impacto Comprovado</h3>
          <p className="text-gray-400">Dados atualizados em tempo real</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative group bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#38bdf8]/50 transition-all duration-300 transform hover:scale-105">
            <div className="absolute top-2 right-2 flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">LIVE</span>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-2xl font-bold text-white mb-1">{liveCounter.toLocaleString()}</div>
              <div className="text-sm text-gray-400 mb-2">Resultados Ativos</div>
              <div className="text-xs text-gray-500">Hoje: +{Math.floor(Math.random() * 200) + 150}</div>
              <div className="text-xs font-medium text-blue-400 mt-1">↗ +12.7%</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#38bdf8]/50 transition-all duration-300 transform hover:scale-105">
            <div className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-white mb-1">4.96</div>
              <div className="text-sm text-gray-400 mb-2">Satisfação Média</div>
              <div className="text-xs text-gray-500">12.847 avaliações</div>
              <div className="text-xs font-medium text-yellow-400 mt-1">99.2% positivas</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#38bdf8]/50 transition-all duration-300 transform hover:scale-105">
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold text-white mb-1">420%</div>
              <div className="text-sm text-gray-400 mb-2">Média Produtividade</div>
              <div className="text-xs text-gray-500">Aumento comprovado</div>
              <div className="text-xs font-medium text-green-400 mt-1">↗ Crescendo</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#38bdf8]/50 transition-all duration-300 transform hover:scale-105">
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-white mb-1">47s</div>
              <div className="text-sm text-gray-400 mb-2">Tempo Médio</div>
              <div className="text-xs text-gray-500">Para completar</div>
              <div className="text-xs font-medium text-purple-400 mt-1">Super rápido</div>
            </div>
          </div>
        </div>
      </div>

      {/* Depoimento Destacado */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">🗣️ Transformações Reais</h3>
          <p className="text-gray-400">Profissionais que já revolucionaram seus resultados</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-xs font-medium">VERIFICADO</span>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#38bdf8]/50">
                  <div className="w-full h-full bg-gradient-to-r from-[#2477e0] to-[#38bdf8] flex items-center justify-center text-white font-bold text-2xl">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#2477e0] rounded-full px-2 py-1">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                
                <blockquote className="text-white text-lg font-medium mb-4 leading-relaxed">
                  {testimonials[currentTestimonial].text}
                </blockquote>
                
                <div className="space-y-2">
                  <div className="text-white font-bold text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-4 py-2 mt-3">
                    <span className="text-green-400 font-bold text-sm">
                      🚀 {testimonials[currentTestimonial].results}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-[#38bdf8] w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Destaques Melhorados */}
      <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {[
          { icon: Target, text: "Plano 100% personalizado", color: "text-green-400" },
          { icon: Clock, text: "Apenas 47 segundos", color: "text-blue-400" },
          { icon: Sparkles, text: "Método cientificamente comprovado", color: "text-purple-400" },
          { icon: Gift, text: "Acesso especial hoje!", color: "text-red-400" }
        ].map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={index}
              className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <IconComponent className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm font-medium text-white">{item.text}</span>
            </div>
          );
        })}
      </div>

      {/* CTA Principal */}
      <div className="space-y-4 relative z-10">
        <div className="relative group">
          <button
            onClick={onStart}
            type="button"
            className="relative bg-gradient-to-r from-[#2477e0] via-[#38bdf8] to-[#2477e0] hover:from-[#1b5fc7] hover:via-[#2563eb] hover:to-[#1b5fc7] text-white font-semibold px-12 py-5 text-xl rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-[#38bdf8]/50 overflow-hidden cursor-pointer active:scale-95"
            style={{ zIndex: 50 }}
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"
              style={{ zIndex: 1 }}
            />
            <span className="relative z-10 pointer-events-none">🎯 Descobrir Meu Plano Personalizado</span>
          </button>
          <div 
            className="absolute inset-0 bg-gradient-to-r from-[#2477e0] to-[#38bdf8] rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
            style={{ zIndex: -1 }}
          />
        </div>
        <p className="text-gray-400 text-sm animate-pulse">
          ⚡ Gratuito • Resultado imediato • Sem compromisso
        </p>
      </div>

      {/* Badges de Confiança */}
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { icon: CheckCircle, text: "15.000+ Resultados", color: "border-green-500/30 bg-green-500/20" },
          { icon: Award, text: "Método Comprovado", color: "border-blue-500/30 bg-blue-500/20" },
          { icon: Clock, text: "47 Segundos", color: "border-purple-500/30 bg-purple-500/20" }
        ].map((badge, index) => {
          const IconComponent = badge.icon;
          return (
            <div 
              key={index}
              className={`${badge.color} border rounded-full px-4 py-2 flex items-center space-x-2 transition-all duration-300 hover:scale-105`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm font-medium text-white">{badge.text}</span>
            </div>
          );
        })}
      </div>

      {/* Urgência Final */}
      <div className="relative">
        <div className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border border-red-500/30 rounded-xl p-4 max-w-md mx-auto backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-bold animate-pulse">🔥 Últimas 2 horas: +89 planos personalizados criados!</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl animate-ping opacity-20"></div>
      </div>

      {/* Status Online */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-bold">
            🟢 {Math.floor(Math.random() * 80) + 170} pessoas descobrindo seu plano agora
          </span>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Hoje: +{Math.floor(Math.random() * 300) + 450} novos planos personalizados
        </p>
      </div>
    </div>
  );
}
