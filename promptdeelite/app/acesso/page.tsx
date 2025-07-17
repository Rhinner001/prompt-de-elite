'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // <-- Importe useRouter aqui também!

interface UserProfile {
  type: string;
  title: string;
  icon: string;
  description: string;
  mainPain: string;
  transformation: string;
}

// Dados de depoimentos
const testimonials = [
  {
    name: 'Marina Costa',
    role: 'Designer',
    image: '/images/testimonials/marina-costa.jpg',
    text: 'Em 3 dias já estava criando prompts que me davam exatamente o que eu precisava. Nunca mais perdi tempo.',
    improvement: '+340% mais produtiva'
  },
  {
    name: 'João Pereira',
    role: 'Empreendedor',
    image: '/images/testimonials/joao-pereira.jpg',
    text: 'Descobri porque a IA não me obedecia antes. Agora ela trabalha para mim como um funcionário especialista.',
    improvement: 'Economiza 15h/semana'
  },
  {
    name: 'Ana Moreira',
    role: 'Copywriter',
    image: '/images/testimonials/ana-moreira.jpg',
    text: 'Antes era loteria. Agora a IA escreve no meu tom, com minha personalidade. É como ter um clone.',
    improvement: 'Resultados 5x melhores'
  }
];

// Card de depoimento
function TestimonialCard({ name, role, image, text, improvement }: any) {
  const [imgError, setImgError] = useState(false);
  const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase();

  return (
    <div className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-blue-300/30 hover:shadow-xl hover:shadow-blue-300/10">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-300/0 via-blue-300/5 to-blue-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      <div className="relative z-10">
        <div className="flex items-center mb-4 space-x-4">
          {imgError ? (
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {initials}
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-300/30 flex-shrink-0">
              <Image
                src={image}
                alt={name}
                width={48}
                height={48}
                className="object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          )}
          <div>
            <div className="font-bold text-white">{name}</div>
            <div className="text-blue-300 text-sm">{role}</div>
          </div>
        </div>
        <div className="flex mb-3">
          <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
        </div>
        <p className="text-gray-300 italic mb-4">&quot;{text}&quot;</p>
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2">
          <div className="text-green-400 font-semibold text-xs">📈 {improvement}</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

// Card do kit
function KitCard({ icon, title, description, color, bgColor }: any) {
  return (
    <div className="group relative overflow-hidden bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 hover:border-blue-300/30 hover:shadow-lg hover:shadow-blue-300/10">
      <div className={`w-16 h-16 bg-gradient-to-r ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className={`text-lg font-bold ${color} mb-2`}>{title}</h3>
      <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
}

// Card de sucesso
function SuccessCard({ icon, title, description, color, bgColor }: any) {
  return (
    <div className={`group relative overflow-hidden bg-gradient-to-br ${bgColor} border border-blue-300/30 rounded-xl p-6 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-300/20`}>
      <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">{icon}</div>
      <h3 className={`text-lg font-bold ${color} mb-2`}>{title}</h3>
      <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
}

// ===== CHECKLIST INTERATIVO =====

const criterios = [
  {
    id: 1,
    titulo: "Contexto Laser",
    pergunta: "Você dá detalhes específicos ao invés de pedir coisas genéricas?",
    explicacao: "A IA só é boa quando você é específico. Vago gera resultado vago.",
    exemploRuim: "❌ 'Escreva um texto sobre marketing'",
    exemploBom: "✅ 'Escreva um email de vendas para empreendedores que faturam 50-200k/mês, focando em automação, destacando economia de 15h/semana...'"
  },
  {
    id: 2,
    titulo: "Papel Definido",
    pergunta: "Você diz exatamente quem a IA deve ser antes de pedir algo?",
    explicacao: "Sem papel definido, a IA vira um estagiário confuso. Com papel, vira especialista.",
    exemploRuim: "❌ 'Me ajude com copy'",
    exemploBom: "✅ 'Atue como copywriter sênior especializado em direct response para infoprodutos, com 10 anos criando emails que vendem...'"
  },
  {
    id: 3,
    titulo: "Formato Exato",
    pergunta: "Você especifica exatamente como quer receber a resposta?",
    explicacao: "Sem formato, você recebe uma bagunça. Com formato, recebe algo usável na hora.",
    exemploRuim: "❌ 'Faça uma lista'",
    exemploBom: "✅ 'Organize em 5 tópicos numerados, cada um com subtítulo em negrito + 2 frases + 1 exemplo prático...'"
  },
  {
    id: 4,
    titulo: "Limites Claros",
    pergunta: "Você diz o que NÃO quer e estabelece limites?",
    explicacao: "Limites evitam que a IA viaje na maionese e entregue algo inútil.",
    exemploRuim: "❌ 'Escreva um artigo'",
    exemploBom: "✅ 'Artigo de 800 palavras, sem jargão técnico, linguagem simples, evite clichês como \"revolucionário\"...'"
  },
  {
    id: 5,
    titulo: "Exemplos na Veia",
    pergunta: "Você mostra exemplos do que quer (e do que não quer)?",
    explicacao: "Exemplo vale mais que mil explicações. A IA aprende vendo, não só ouvindo.",
    exemploRuim: "❌ 'Crie um título chamativo'",
    exemploBom: "✅ 'Título como \"Como Triplicar Vendas em 30 Dias\" mas evite \"segredo\", \"fórmula mágica\" ou \"milagroso\"...'"
  },
  {
    id: 6,
    titulo: "Tom Preciso",
    pergunta: "Você define o tom e personalidade da resposta?",
    explicacao: "Sem tom definido, a IA fala como robô. Com tom, ela fala como você quer.",
    exemploRuim: "❌ 'Escreva um post'",
    exemploBom: "✅ 'Tom conversacional e direto, como mentor experiente falando com aprendiz, sem formalidade excessiva...'"
  },
  {
    id: 7,
    titulo: "Refinamento Constante",
    pergunta: "Você pega a resposta e melhora até ficar perfeita?",
    explicacao: "Quem aceita a primeira resposta fica na mediocridade. Quem refina, domina.",
    exemploRuim: "❌ Aceitar qualquer coisa que a IA devolve",
    exemploBom: "✅ 'Agora refaça com mais exemplos práticos, menos teoria, e adicione números específicos...'"
  }
];

function ChecklistInteractive() {
  const router = useRouter(); // <-- AQUI! useRouter precisa ser inicializado dentro do componente.
  const [step, setStep] = useState<number>(0);
  const [respostas, setRespostas] = useState<Record<number, boolean>>({});
  const [finalizado, setFinalizado] = useState<boolean>(false);

  const responder = (simOuNao: boolean) => {
    setRespostas((prev) => ({ ...prev, [step]: simOuNao }));
    if (step < criterios.length - 1) {
      setStep(step + 1);
    } else {
      setFinalizado(true);
    }
  };

  const pontuacao = Object.values(respostas).filter(Boolean).length;

  if (finalizado) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">⚡ Resultado do Seu Diagnóstico</h2>
        <div className="text-3xl font-bold text-green-400 mb-6">
          Você domina {pontuacao} de 7 critérios profissionais
        </div>
        <div className="mb-8">
          {pontuacao === 7 && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
              <p className="text-green-300 text-lg font-semibold">🎯 Elite Total!</p>
              <p className="text-green-200">Você está no topo dos 3%. Use nossa biblioteca para turbinar ainda mais seus resultados.</p>
            </div>
          )}
          {pontuacao >= 5 && pontuacao < 7 && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <p className="text-yellow-300 text-lg font-semibold">🔥 Quase Lá!</p>
              <p className="text-yellow-200">Faltam só {7 - pontuacao} critérios para você virar um ninja dos prompts. Veja os gaps abaixo.</p>
            </div>
          )}
          {pontuacao < 5 && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-6">
              <p className="text-blue-300 text-lg font-semibold">💡 Potencial Gigante!</p>
              <p className="text-blue-200">Você tem muito espaço para crescer. Corrija os pontos abaixo e veja sua produtividade explodir.</p>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {criterios.map((c, idx) =>
            !respostas[idx] && (
              <div key={c.id} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-left">
                <h4 className="font-bold text-red-300 mb-2">🎯 {c.titulo}</h4>
                <p className="text-gray-300 text-sm mb-3">{c.explicacao}</p>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                  <p className="text-green-200 text-xs">{c.exemploBom}</p>
                </div>
              </div>
            )
          )}
        </div>
        <button
          onClick={() => {
            // Removendo o try/catch e setTimeout desnecessários.
            // Com useRouter inicializado, router.push é o método ideal.
            router.push('dashboard');
          }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🚀 Acessar Biblioteca Completa de Prompts Elite
        </button>
      </div>
    );
  }

  const c = criterios[step];
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-2xl mx-auto text-center">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <span className="text-2xl">🎯</span>
        <h2 className="text-2xl font-bold text-white">Diagnóstico Rápido</h2>
      </div>
      <div className="text-blue-300 mb-4">Critério {step + 1} de {criterios.length}</div>

      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl p-6 mb-6">
        <h3 className="text-blue-200 text-lg font-bold mb-2">{c.titulo}</h3>
        <p className="text-blue-100 text-lg">{c.pergunta}</p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-2">
          <span className="text-yellow-400 text-lg">💡</span>
          <p className="text-yellow-200 text-sm">{c.explicacao}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-red-400">❌</span>
            <span className="font-semibold text-red-300">Assim não funciona</span>
          </div>
          <p className="text-red-200 text-sm">{c.exemploRuim}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-400">✅</span>
            <span className="font-semibold text-green-300">Assim é profissional</span>
          </div>
          <p className="text-green-200 text-sm">{c.exemploBom}</p>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => responder(false)}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          ❌ Preciso melhorar isso
        </button>
        <button
          onClick={() => responder(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          ✅ Já faço isso bem
        </button>
      </div>

      <div className="flex justify-center items-center space-x-2 text-gray-400 text-sm mt-6">
        <div className="flex space-x-1">
          {Array.from({ length: criterios.length }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i <= step ? 'bg-blue-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        <span>• {step + 1} / {criterios.length}</span>
      </div>
    </div>
  );
}

// ========== COMPONENTE PRINCIPAL ==========
export default function AccessPage() {
  const [email, setEmail] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('userEmail') || '' : ''
  );
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);

  // Recupera perfil
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('userQuizProfile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved).profile);
      } catch {
        setUserProfile({
          type: 'default',
          title: 'Profissional Visionário',
          icon: '🎯',
          description: 'Você chegou até aqui porque sabe que dominar a IA é questão de sobrevivência profissional.',
          mainPain: 'Prompts que não entregam os resultados esperados',
          transformation: 'Com as técnicas certas, você pode 10x sua produtividade'
        });
      }
    }
  }, []);

  // Submit do form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'leads'), {
        email,
        profile: userProfile?.type || 'default',
        source: 'pagina_acesso',
        createdAt: Timestamp.now()
      });
      localStorage.setItem('userEmail', email);
      setStep('success');
      setTimeout(() => {
        setShowChecklist(true);
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2b5c] to-[#0c1c3f] text-white">
      <div className="max-w-4xl mx-auto p-4 py-8 md:py-12">
        {step === 'form' ? (
          <div className="space-y-8">
            {/* Cabeçalho */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3 mb-4 transition-all duration-300 hover:scale-105">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-400 font-bold text-sm">✅ PERFIL IDENTIFICADO</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                <span className="text-white">Parabéns!</span><br />
                <span className="text-green-400">Você está entre os 3%</span><br />
                <span className="bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent">
                  que realmente querem dominar a IA
                </span>
              </h1>
              {userProfile && (
                <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <span className="text-4xl hover:scale-110 transition-transform duration-300">{userProfile.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">Perfil: {userProfile.title}</h3>
                      <p className="text-blue-300 text-sm">Identificado pelo diagnóstico</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-center leading-relaxed">{userProfile.description}</p>
                </div>
              )}
            </div>

            {/* Kit */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-8 transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  🎁 Seu Kit Completo Personalizado
                </h2>
                <p className="text-blue-200">Tudo que você precisa para dominar prompts como os top 3%</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KitCard
                  icon="📚"
                  title="eBook Exclusivo"
                  description="Anatomia dos Prompts de Elite - 47 páginas com os segredos que só os profissionais sabem"
                  color="text-blue-300"
                  bgColor="from-blue-500 to-blue-600"
                />
                <KitCard
                  icon="⚡"
                  title="Diagnóstico Interativo"
                  description="Descubra exatamente onde você está errando e como corrigir em minutos"
                  color="text-green-300"
                  bgColor="from-green-500 to-green-600"
                />
                <KitCard
                  icon="🚀"
                  title="Acesso Liberado"
                  description="Acesse a plataforma e desbloqueie o prompts que quiser, baseado no seu perfil"
                  color="text-purple-300"
                  bgColor="from-purple-500 to-purple-600"
                />
              </div>
              <div className="text-center mt-8">
                <div className="inline-block bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl px-8 py-4">
                  <p className="text-yellow-300 font-bold text-lg">
                    🎯 Valor Real: <span className="line-through text-gray-400">R$ 297,00</span>
                  </p>
                  <p className="text-green-400 font-bold text-2xl mt-1">
                    Hoje para você: R$ 0,00
                  </p>
                  <p className="text-green-300 text-sm mt-1">100% gratuito por tempo limitado</p>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  🔓 Libere Seu Acesso Completo
                </h2>
                <p className="text-gray-300">Receba tudo em menos de 2 minutos no seu email</p>
              </div>
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block text-white font-medium mb-3 text-left">
                    📧 Seu melhor email (onde você realmente olha):
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all duration-300 text-center text-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                >
                  {loading
                    ? <span className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Liberando seu acesso...</span>
                    : '⚡ Quero Meu Kit Completo Agora (GRÁTIS)'
                  }
                </button>
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">🔒 100% seguro • Sem spam • Sem pegadinhas</p>
                  <p className="text-xs text-green-400">✅ Mais de 2.847 profissionais já acessaram</p>
                </div>
              </form>
            </div>

            {/* Prova Social */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/30 transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-6">💬 Resultados reais de quem aplicou:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
                </div>
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <span className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</span>
                  <div className="text-gray-300">
                    <span className="font-bold text-white">4.9/5</span> •
                    <span className="text-green-400 ml-1">2.847+ acessos</span> •
                    <span className="text-blue-400 ml-1">94% aprovação</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // === Tela de sucesso ===
          <div className="space-y-8">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto transition-transform duration-300 hover:scale-110 animate-pulse">
                <span className="text-4xl">🎉</span>
              </div>
              <h1 className="text-4xl font-bold text-green-400">✅ Acesso Liberado!</h1>
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 max-w-2xl mx-auto">
                <p className="text-xl text-gray-300 mb-2">
                  📧 Enviamos tudo para: <strong className="text-green-400">{email}</strong>
                </p>
                <p className="text-green-200">Confira sua caixa de entrada (e spam) nos próximos 2 minutos</p>
              </div>
              {/* Nota de suporte adicionada aqui */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-400">
                  ⚠️ Se você tiver qualquer dificuldade com o acesso, envie um e-mail para: <a href="mailto:contato@promptdelite.com" className="text-blue-300 hover:underline">contato@promptdelite.com</a>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SuccessCard
                icon="📧"
                title="Email Enviado"
                description="Kit completo chegando na sua caixa de entrada"
                color="text-blue-300"
                bgColor="from-blue-500/20 to-blue-600/10"
              />
              <SuccessCard
                icon="⚡"
                title="Diagnóstico Ativo"
                description={showChecklist ? 'Disponível logo abaixo' : 'Carregando em instantes...'}
                color="text-green-300"
                bgColor="from-green-500/20 to-green-600/10"
              />
              <SuccessCard
                icon="🚀"
                title="Acesso Liberado"
                description="Escolha 1 prompt para desbloquear de sua preferência e teste a plataforma."
                color="text-purple-300"
                bgColor="from-purple-500/20 to-purple-600/10"
              />
            </div>
            {/* Checklist Interativo */}
            {showChecklist && (
              <div className="mt-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">🎯 Diagnóstico Personalizado</h2>
                  <p className="text-gray-300">Descubra exatamente onde você precisa melhorar</p>
                </div>
                <ChecklistInteractive />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}