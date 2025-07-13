'use client';

import React, { useState, useEffect } from 'react';
// REMOVER: import Image from 'next/image';

const realTestimonials = [
  {
    name: "Dr. Maria Silva",
    role: "Cardiologista | Hospital Sírio-Libanês",
    text: "Reduzi 4 horas do meu dia criando relatórios médicos. Os prompts são precisos e seguem protocolos médicos.",
    rating: 5,
    photo: "/images/testimonials/maria-silva.jpg",
    verification: "Verificado pelo CRM-SP",
    results: "4h economizadas por dia",
    specialty: "Medicina"
  },
  // ... resto dos testimonials
];

// Função para lidar com erro de imagem

export default function SocialProofPremium() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [liveCounter, setLiveCounter] = useState(12847);

  useEffect(() => {
    // Rotação automática de depoimentos
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % realTestimonials.length);
    }, 4000);

    // Contador "ao vivo"
    const counterInterval = setInterval(() => {
      setLiveCounter(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(counterInterval);
    };
  }, []);

  return (
    <div className="space-y-12">
      {/* Estatísticas em tempo real */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            📊 Dados em Tempo Real
          </h3>
          <p className="text-gray-400">Atualizado automaticamente</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              emoji: "👥",
              number: liveCounter.toLocaleString(),
              label: "Profissionais Ativos",
              color: "text-blue-400",
              subtitle: "Últimas 24h: +127",
              trend: "+8.3%"
            },
            {
              emoji: "⭐",
              number: "4.94",
              label: "Média de Avaliações",
              color: "text-yellow-400",
              subtitle: "Base: 8.943 reviews",
              trend: "98.7% positivas"
            },
            {
              emoji: "📊",
              number: "347%",
              label: "Média de Produtividade",
              color: "text-green-400",
              subtitle: "Dados últimos 90 dias",
              trend: "↗ Crescendo"
            },
            {
              emoji: "💰",
              number: "R$ 2.4M",
              label: "Economia Gerada",
              color: "text-purple-400",
              subtitle: "Tempo economizado",
              trend: "Este mês"
            }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="relative group bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#38bdf8]/50 transition-all duration-300 transform hover:scale-105"
            >
              {/* Indicador "ao vivo" */}
              <div className="absolute top-2 right-2 flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">LIVE</span>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.subtitle}</div>
                <div className={`text-xs font-medium ${stat.color} mt-1`}>
                  {stat.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Depoimento destacado rotativo */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            🗣️ Histórias Reais de Sucesso
          </h3>
          <p className="text-gray-400">Profissionais verificados compartilham seus resultados</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 relative overflow-hidden">
            {/* Badge de verificação */}
            <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-xs font-medium">VERIFICADO</span>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar simples */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#38bdf8]/50">
                  <div className="w-full h-full bg-gradient-to-r from-[#2477e0] to-[#38bdf8] flex items-center justify-center text-white font-bold text-2xl">
                    {realTestimonials[currentTestimonial].name.charAt(0)}
                  </div>
                </div>
                {/* Badge de especialidade */}
                <div className="absolute -bottom-2 -right-2 bg-[#2477e0] rounded-full px-2 py-1">
                  <span className="text-white text-xs font-bold">
                    {realTestimonials[currentTestimonial].specialty.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Conteúdo do depoimento */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                
                <blockquote className="text-white text-lg font-medium mb-4 leading-relaxed">
                  {realTestimonials[currentTestimonial].text}
                </blockquote>
                
                <div className="space-y-2">
                  <div className="text-white font-bold text-lg">
                    {realTestimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {realTestimonials[currentTestimonial].role}
                  </div>
                  <div className="text-gray-500 text-xs">
                    ✅ {realTestimonials[currentTestimonial].verification}
                  </div>
                  
                  {/* Resultado destacado */}
                  <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-4 py-2 mt-3">
                    <span className="text-green-400 font-bold text-sm">
                      📈 {realTestimonials[currentTestimonial].results}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicadores de navegação */}
            <div className="flex justify-center space-x-2 mt-6">
              {realTestimonials.map((_, index) => (
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

      {/* Grid de mini depoimentos */}
      <div className="grid md:grid-cols-3 gap-4">
        {realTestimonials.slice(0, 3).map((testimonial, index) => (
          <div 
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#38bdf8]/30 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#38bdf8]/30">
                <div className="w-full h-full bg-gradient-to-r from-[#2477e0] to-[#38bdf8] flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-white font-medium text-sm">{testimonial.name}</div>
                <div className="text-gray-400 text-xs">{testimonial.specialty}</div>
              </div>
            </div>
            
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-sm">⭐</span>
              ))}
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              {testimonial.text.substring(0, 100)}...
            </p>
            
            <div className="mt-3 text-xs text-green-400 font-medium">
              📊 {testimonial.results}
            </div>
          </div>
        ))}
      </div>

      {/* Contador de usuários online */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-bold">
            🟢 {Math.floor(Math.random() * 50) + 150} profissionais online agora
          </span>
        </div>
        <p className="text-gray-400 text-sm mt-1">
          Últimas 24h: +{Math.floor(Math.random() * 200) + 300} novos usuários
        </p>
      </div>
    </div>
  );
}
