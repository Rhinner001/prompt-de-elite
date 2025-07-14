'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import TestimonialCard from './components/ui/TestimonialCard';


// Partículas fixas (resolve hydration)
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

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [intencao, setIntencao] = useState('');
  const [step, setStep] = useState<'initial' | 'intencao' | 'success'>('initial');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep('intencao');
  };

const handleFinalSubmit = async () => {
  if (!intencao) return;
  setLoading(true);

  try {
    const leadData = {
      email,
      intencao,
      createdAt: Timestamp.now(),
      origem: 'landing_funil_premium'
    };

    await addDoc(collection(db, 'leads_segmentados'), leadData);

    // Nova lógica: determineDirection retorna a ROTA completa
    const direction = determineDirection(intencao);

    setStep('success');

    setTimeout(() => {
      router.push(direction);
    }, 2000);

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    setLoading(false);
  }
};

// Agora cada intenção já retorna a rota final (não só o nome)
const determineDirection = (userIntent: string) => {
  if (userIntent === 'comprar')       return '/auth/register?next=/quiz';
  if (userIntent === 'testar')        return '/auth/register?next=/checklist';
  if (userIntent === 'teste_gratis')  return '/auth/register?next=/dashboard';
  return '/auth/register?next=/ebook'; // fallback para "aprender" ou outros
};


  const scrollToForm = () => {
    const formElement = document.getElementById('form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2b5c] to-[#0c1c3f] text-white relative overflow-hidden">
      {/* Partículas */}
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

      {/* Estilos sutis e profissionais */}
      <style jsx>{`
        @keyframes subtle-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(56, 189, 248, 0.2); }
          50% { box-shadow: 0 0 30px rgba(56, 189, 248, 0.4); }
        }
        
        @keyframes gentle-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .professional-glow { animation: subtle-glow 4s ease-in-out infinite; }
        .gentle-pulse { animation: gentle-pulse 3s ease-in-out infinite; }
        
        .number-highlight {
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
        }
        
        .premium-card {
          transition: all 0.3s ease;
        }
        
        .premium-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(56, 189, 248, 0.2);
        }
        
        .star-rating {
          filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.5));
        }
      `}</style>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">
                🧠 Prompt de Elite
              </div>
            </div>
          </div>
        </header>

        {step === 'initial' && (
          <>
            {/* Hero Section */}
<section className="py-10 sm:py-16 px-4">
  <div className="container mx-auto text-center">
    <div className="max-w-3xl mx-auto">
      <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 gentle-pulse">
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full animate-pulse"></div>
        <span className="text-red-400 font-bold text-xs sm:text-sm">🔥 DESCOBERTA CRÍTICA</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
        Seus prompts estão <span className="text-red-400">falhando</span>?
      </h1>

      <p className="text-base sm:text-xl mb-6 sm:mb-8 text-gray-300">
        Descubra se você faz parte dos <span className="text-green-400 font-semibold">poucos que dominam</span>   a arte de criar prompts que realmente funcionam
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 premium-card">
          <div className="text-4xl sm:text-5xl font-bold text-[#38bdf8] mb-2 number-highlight">87%</div>
          <div className="flex justify-center mb-2">
            <div className="text-yellow-400 text-sm star-rating">⭐⭐⭐⭐⭐</div>
          </div>
          <p className="text-gray-300 text-sm sm:text-base">dos prompts falham por falta de estrutura</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 premium-card">
          <div className="text-4xl sm:text-5xl font-bold text-[#38bdf8] mb-2 number-highlight">94%</div>
          <div className="flex justify-center mb-2">
            <div className="text-yellow-400 text-sm star-rating">⭐⭐⭐⭐⭐</div>
          </div>
          <p className="text-gray-300 text-sm sm:text-base">recebem respostas genéricas e inúteis</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 premium-card">
          <div className="text-4xl sm:text-5xl font-bold text-green-400 mb-2 number-highlight">3%</div>
          <div className="flex justify-center mb-2">
            <div className="text-yellow-400 text-sm star-rating">⭐⭐⭐⭐⭐</div>
          </div>
          <p className="text-gray-300 text-sm sm:text-base">conseguem resultados consistentes</p>
        </div>
      </div>
    </div>
  </div>
</section>


            {/* Formulário Premium */}
 <section id="form-section" className="py-10 sm:py-16 px-4">
  <div className="container mx-auto">
    <div className="max-w-xl mx-auto">
      <div className="bg-gradient-to-br from-[#0c1c3f]/90 via-[#1a2b5c]/90 to-[#0c1c3f]/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-[#38bdf8]/30 shadow-2xl professional-glow">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1 sm:px-6 sm:py-2 mb-4">
            <span className="text-green-400 font-bold text-xs sm:text-sm">✨ O QUE VOCÊ RECEBE GRATUITAMENTE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            Acesso Completo ao Ecossistema <span className="bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">Prompt de Elite</span>
          </h2>
        </div>

        {/* Benefícios Premium */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center premium-card">
            <div className="text-2xl sm:text-3xl mb-2">📚</div>
            <h3 className="font-semibold text-yellow-400 mb-1 text-sm sm:text-base">EBOOK EXCLUSIVO</h3>
            <p className="text-xs text-gray-300">&quot;Anatomia dos Prompts de Elite&quot;</p>
            <div className="text-yellow-400 text-xs mt-2 star-rating">⭐⭐⭐⭐⭐</div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center premium-card">
            <div className="text-2xl sm:text-3xl mb-2">✅</div>
            <h3 className="font-semibold text-yellow-400 mb-1 text-sm sm:text-base">CHECKLIST PREMIUM</h3>
            <p className="text-xs text-gray-300">Avaliação completa dos seus prompts</p>
            <div className="text-yellow-400 text-xs mt-2 star-rating">⭐⭐⭐⭐⭐</div>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center premium-card">
            <div className="text-2xl sm:text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-yellow-400 mb-1 text-sm sm:text-base">QUIZ INTELIGENTE</h3>
            <p className="text-xs text-gray-300">Diagnóstico personalizado do seu nível</p>
            <div className="text-yellow-400 text-xs mt-2 star-rating">⭐⭐⭐⭐⭐</div>
          </div>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="text-white font-medium text-sm flex items-center">
              <span className="mr-2">📧</span>
              Seu email para receber acesso imediato:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={!email}
            className="w-full bg-gradient-to-r from-[#2477e0] to-[#38bdf8] hover:from-[#1b5fc7] hover:to-[#2563eb] disabled:opacity-50 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg professional-glow"
          >
            🚀 Quero Acesso Completo GRÁTIS
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs sm:text-sm text-gray-400 mb-2">
            🔒 Seus dados estão seguros. Não enviamos spam.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-4 space-y-2 sm:space-y-0 text-[10px] sm:text-xs text-gray-500">
            <span>✅ Sem compromisso</span>
            <span>✅ Cancelar a qualquer momento</span>
            <span>✅ 100% gratuito</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


            {/* Problems Section */}
 <section className="py-10 sm:py-16 px-4">
  <div className="container mx-auto">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
        Reconhece alguns <span className="text-red-400">desses problemas</span>?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {[
          {
            title: 'Respostas Genéricas',
            desc: 'A IA sempre responde a mesma coisa, não importa como você pergunta'
          },
          {
            title: 'Resultados Inconsistentes',
            desc: 'Às vezes funciona, às vezes não - você nunca sabe o que esperar'
          },
          {
            title: 'Tempo Perdido',
            desc: 'Horas tentando reformular o mesmo prompt sem sucesso'
          },
          {
            title: 'Falta de Contexto',
            desc: 'A IA não entende o que você realmente precisa'
          }
        ].map((problem, index) => (
          <div key={index} className="bg-red-500/10 border-l-4 border-red-500 p-5 sm:p-6 rounded-xl premium-card">
            <div className="flex items-start mb-3 sm:mb-4">
              <span className="text-red-400 text-xl sm:text-2xl mr-2 sm:mr-3 mt-1">❌</span>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1">{problem.title}</h3>
                <p className="text-gray-300 text-sm sm:text-base">{problem.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


           {/* Social Proof Premium */}
<section className="py-10 sm:py-16 px-4">
  <div className="container mx-auto">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
        <span className="sparkle">💬</span> O que as pessoas estão dizendo
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {[
          {
            name: 'Marina Costa',
            role: '🎨 Designer',
            image: '/images/testimonials/marina-costa.jpg',
            text: 'Finalmente entendi porque meus prompts não funcionavam. Agora consigo criar artes incríveis pro meu trabalho.',
            rating: 5
          },
          {
            name: 'Rafael Santos',
            role: '🚀 Empreendedor',
            image: '/images/testimonials/rafael-santos.jpg',
            text: 'Estava perdendo muito tempo com prompts ruins. Agora economizo horas e tenho resultados bem melhores.',
            rating: 5
          },
          {
            name: 'Ana Moreira',
            role: '✍️ Copywriter',
            image: '/images/testimonials/ana-moreira.jpg',
            text: 'Mudou completamente meu trabalho. Agora a IA realmente entende o que preciso e entrega textos perfeitos.',
            rating: 5
          }
        ].map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  </div>
</section>




            {/* CTA Final */}
            <section className="py-16 px-4">
              <div className="container mx-auto">
                <div className="max-w-2xl mx-auto text-center">
                  <div className="bg-gradient-to-r from-[#2477e0] to-[#38bdf8] p-8 rounded-2xl professional-glow">
                    <h2 className="text-3xl font-bold mb-6">
                      🎯 Comece Sua Transformação Agora
                    </h2>
                    <p className="text-lg text-blue-100 mb-8">
                      Junte-se aos <span className="font-bold text-yellow-300">3% que dominam</span> a IA de verdade
                    </p>
                    
                    <button 
                      onClick={scrollToForm}
                      className="bg-white text-[#2477e0] font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🚀 Quero Fazer Parte dos 3%
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {step === 'intencao' && (
          <section className="py-16 px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">🎯 Personalização Inteligente</h2>
                <p className="text-gray-300">
                  Para direcionar você à melhor experiência, preciso entender sua intenção:
                </p>
              </div>

              <h3 className="text-3xl font-bold text-white">
                Se houvesse uma biblioteca com prompts testados e validados disponível agora, você:
              </h3>

              <div className="space-y-4">
                {[
  {
    value: 'comprar',
    emoji: '🚀',
    title: 'Compraria imediatamente se o preço fosse justo',
    desc: 'Estou pronto para investir em qualidade',
    color: 'border-green-500/30 hover:bg-green-500/10',
    icon: '💎'
  },
  {
    value: 'testar',
    emoji: '🔍',
    title: 'Gostaria de avaliar antes de decidir',
    desc: 'Quero ver a qualidade primeiro',
    color: 'border-yellow-500/30 hover:bg-yellow-500/10',
    icon: '🧪'
  },
  {
    value: 'aprender',
    emoji: '📚',
    title: 'Preciso entender melhor o que são prompts de qualidade',
    desc: 'Quero dominar os fundamentos',
    color: 'border-blue-500/30 hover:bg-blue-500/10',
    icon: '🎓'
  },
  {
    value: 'teste_gratis',
    emoji: '🆓',
    title: 'Quero Testar Agora (Grátis!)',
    desc: 'Acesse imediatamente 1 prompt de elite sem compromisso. Veja na prática a qualidade que só 3% experimentam.',
    color: 'border-cyan-500/30 hover:bg-cyan-500/10',
    icon: '🔑'
  }


                ].map((option) => (
                  <label key={option.value} className={`flex items-start space-x-3 cursor-pointer group p-6 rounded-xl border ${option.color} transition-all duration-300 premium-card`}>
                    <input
                      type="radio"
                      name="intencao"
                      value={option.value}
                      checked={intencao === option.value}
                      onChange={(e) => setIntencao(e.target.value)}
                      className="mt-1 text-[#38bdf8] focus:ring-[#38bdf8]"
                    />
                    <div className="flex-1 text-left">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{option.icon}</span>
                        <div className="font-medium text-lg">{option.emoji} {option.title}</div>
                      </div>
                      <div className="text-sm text-gray-400">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleFinalSubmit}
                disabled={!intencao || loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 professional-glow"
              >
                {loading ? (
                  <span>⏳ Direcionando para sua jornada...</span>
                ) : (
                  <span>🌟 Descobrir Minha Jornada Ideal</span>
                )}
              </button>
            </div>
          </section>
        )}

        {step === 'success' && (
           <section className="py-16 px-4">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">✨</span>
              </div>
              <h2 className="text-3xl font-bold text-white">🎉 Jornada Personalizada Ativada!</h2>
              <p className="text-gray-300 text-lg">
                Baseado na sua intenção, você será direcionado para a experiência mais eficiente...
              </p>
              
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold">Analisando seu perfil...</span>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38bdf8]"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-[#38bdf8]/20"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-gray-300">Preparando conteúdo personalizado</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-gray-300">Configurando sua jornada ideal</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-2xl mb-2">🚀</div>
                  <p className="text-gray-300">Ativando recursos exclusivos</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer Premium */}
       <footer className="py-6 sm:py-8 px-4 border-t border-white/10">
  <div className="container mx-auto text-center">
    <div className="bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent text-lg sm:text-xl font-bold mb-4">
      🧠 Prompt de Elite
    </div>

    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mb-4">
      <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm">
        <span>🔒</span>
        <span>100% Seguro</span>
      </div>
      <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm">
        <span>⚡</span>
        <span>Acesso Imediato</span>
      </div>
      <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm">
        <span>🎯</span>
        <span>Sem Spam</span>
      </div>
    </div>

    <p className="text-gray-400 text-xs sm:text-sm">
      © 2024 Prompt de Elite. Todos os direitos reservados.
    </p>

    <div className="flex justify-center mt-3 sm:mt-4">
      <div className="text-yellow-400 text-base sm:text-lg star-rating">⭐⭐⭐⭐⭐</div>
    </div>
  </div>
</footer>

      </div>
    </main>
  );
}
