'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/app/src/components/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import type { Prompt } from '@/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CategoryRow from '@/app/components/CategoryRow';
import PromptGrid from '@/app/components/PromptGrid';
import UnlockPromptModal from '@/app/components/UnlockPromptModal';
import FeedbackModal from '@/app/components/FeedbackModal';
import { FiSliders } from 'react-icons/fi';
import Link from 'next/link';
import { FaCrown, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

interface UserPlan {
  hasActiveSubscription: boolean;
  plano: string | null;
  status: string;
  dataAtivacao: string | null;
}

export default function DashboardPage() {
  const { user, appUser } = useAuth();
  const searchParams = useSearchParams();

  // ESTADOS PRINCIPAIS
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlockedPromptIds, setUnlockedPromptIds] = useState<Set<string>>(new Set());
  const [promptToUnlock, setPromptToUnlock] = useState<Prompt | null>(null);
  
  // ESTADOS STRIPE
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);

  // Parâmetros de sucesso do checkout
  const success = searchParams.get('success');

  // Feedback
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackPromptId, setFeedbackPromptId] = useState<string | null>(null);

  // Filtros/UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // VERIFICAR PLANO STRIPE
  const checkUserPlan = useCallback(async () => {
    if (!user) return;
    
    try {
      setPlanLoading(true);
      const token = await user.getIdToken();
      
      const response = await fetch('/api/stripe/verify-payment', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserPlan(data);
      }
    } catch (error) {
      console.error('Erro ao verificar plano:', error);
    } finally {
      setPlanLoading(false);
    }
  }, [user]);

  // BUSCA DADOS DO FIREBASE E API
  useEffect(() => {
    if (!user) { 
      setIsLoading(false); 
      return; 
    }
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Buscar prompts e dados do usuário em paralelo
        const [promptsResponse, unlockedSnapshot] = await Promise.all([
          fetch('/api/prompts'),
          getDocs(collection(db, 'users', user.uid, 'unlockedPrompts')),
        ]);
        
        if (!promptsResponse.ok) throw new Error('Falha ao buscar os prompts da biblioteca.');
        
        const promptsData = await promptsResponse.json();
        const unlockedIds = new Set(unlockedSnapshot.docs.map(d => d.id));
        
        setAllPrompts(promptsData);
        setUnlockedPromptIds(unlockedIds);
        
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro desconhecido');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    checkUserPlan(); // Verificar plano Stripe
  }, [user, checkUserPlan]);

  // Status do plano (integra Stripe + AppUser) - CORRIGIDO: Garantir boolean
  const plan = userPlan?.hasActiveSubscription ? 'elite' : (appUser?.plan || 'free');
  const isElite: boolean = Boolean(plan === 'elite' || userPlan?.hasActiveSubscription);
  const credits = appUser?.monthlyCredits || 0;

  // FILTRAGEM
  const filteredPrompts = useMemo(() => {
    let results = allPrompts;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lower)))
      );
    }
    if (selectedCategory) results = results.filter(p => p.category === selectedCategory);
    if (selectedLevel) results = results.filter(p => p.level === selectedLevel);
    return results;
  }, [allPrompts, searchTerm, selectedCategory, selectedLevel]);

  const isFiltering = searchTerm || selectedCategory || selectedLevel;
  const categories = useMemo(() => [...new Set(allPrompts.map(p => p.category))].sort(), [allPrompts]);
  const levels = useMemo(() => ['Iniciante', 'Intermediário', 'Avançado'], []);

  // FUNÇÕES DE CONTROLE
  const handleUnlockSuccess = useCallback((promptId: string) => {
    setUnlockedPromptIds(prev => new Set(prev).add(promptId));
    setPromptToUnlock(null);
  }, []);

  const handleCardClick = useCallback((prompt: Prompt) => {
    if (!isElite && !unlockedPromptIds.has(prompt.id)) {
        setPromptToUnlock(prompt);
    }
  }, [isElite, unlockedPromptIds]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
  }, []);

  const handleOpenFeedback = useCallback((promptId: string) => {
    setFeedbackPromptId(promptId);
    setFeedbackOpen(true);
  }, []);

  // RENDERIZAÇÃO PRINCIPAL
  if (isLoading) return <div className="text-center p-10">Carregando biblioteca de prompts...</div>;
  if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

  return (
    <>
      {/* MENSAGEM DE SUCESSO DO CHECKOUT */}
      {success && (
        <div className="mb-8 p-6 bg-green-900/50 border border-green-500 rounded-lg">
          <h2 className="text-xl font-bold text-green-400 mb-2 flex items-center gap-2">
            <FaCheckCircle /> 🎉 Pedido Recebido com Sucesso!
          </h2>
          
          {planLoading ? (
            <p className="text-blue-300">🔄 Verificando status do pagamento...</p>
          ) : userPlan?.hasActiveSubscription ? (
            <p className="text-green-300">
              ✅ Seu plano está ativo! Aproveite o acesso completo à biblioteca.
            </p>
          ) : userPlan?.status === 'pending' ? (
            <div className="text-yellow-300">
              <p className="flex items-center gap-2">
                <FaClock /> ⏳ Aguardando confirmação do pagamento.
              </p>
              <p className="text-sm mt-1">
                Se você pagou com boleto, o acesso será liberado em até 3 dias úteis.
              </p>
            </div>
          ) : (
            <p className="text-blue-300">🔄 Processando seu pagamento...</p>
          )}
        </div>
      )}

      {/* STATUS DO PLANO */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Status do Seu Plano</h3>
        
        {planLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-400">Verificando...</span>
          </div>
        ) : userPlan?.hasActiveSubscription ? (
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-green-500" />
            <span className="text-green-400 font-medium">
              Plano {userPlan.plano} Elite Ativo ✅
            </span>
          </div>
        ) : userPlan?.status === 'pending' ? (
          <div className="flex items-center gap-3">
            <FaClock className="text-yellow-500" />
            <span className="text-yellow-400 font-medium">
              Aguardando Pagamento ⏳
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-red-500" />
            <span className="text-red-400 font-medium">
              Plano Gratuito 🆓
            </span>
          </div>
        )}
        
        {userPlan?.dataAtivacao && (
          <p className="text-sm text-slate-400 mt-2">
            Ativo desde: {new Date(userPlan.dataAtivacao).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>

      {/* Barra Upgrade (para não-elite) */}
      {!isElite && (
        <div className="flex justify-between items-center bg-yellow-900/10 border border-yellow-500 text-yellow-200 p-3 rounded-lg mb-5">
          <span>
            Você está usando o <b>Plano Gratuito</b>. <span className="hidden md:inline">Desbloqueie todos os prompts, acesse sem limites e receba novos lançamentos.</span>
          </span>
          <Link
            href="/planos"
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-400 transition-all shadow"
          >
            <FaCrown /> Fazer Upgrade
          </Link>
        </div>
      )}

      {/* Créditos mensais para não-elite */}
      {!isElite && (
        <div className="bg-blue-600/10 border border-blue-500 text-blue-200 p-4 rounded-lg mb-8 text-center text-sm">
          Você tem <strong>{credits} Crédito(s) de Desbloqueio</strong> para usar este mês.
        </div>
      )}

      {/* ACESSO ELITE ATIVO */}
      {isElite && (
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <FaCrown className="text-yellow-400 text-xl" />
            <div>
              <h3 className="text-yellow-400 font-bold">Acesso Elite Ativo!</h3>
              <p className="text-yellow-200 text-sm">
                Biblioteca completa desbloqueada • Todos os prompts disponíveis • Sem limitações
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Olá, {user?.displayName || 'Explorador'}.</h1>
          <p className="text-lg text-gray-400 mt-2">O que você quer criar hoje?</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-[#11182B] border border-white/10 rounded-lg text-white hover:bg-white/5 transition"
        >
          <FiSliders />
          <span>{showFilters ? 'Ocultar Filtros' : 'Busca Avançada'}</span>
        </button>
      </div>

      {/* Filtros avançados */}
      {showFilters && (
        <div className="bg-[#11182B] p-4 rounded-lg mb-12 border border-white/10 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">Buscar</label>
              <input
                type="text" id="search" placeholder="Ex: roteiro viral..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#0B0F1C] border border-white/20 text-white"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm text-gray-300 mb-1">Categoria</label>
              <select
                id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#0B0F1C] border border-white/20 text-white"
              >
                <option value="">Todas</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="level" className="block text-sm text-gray-300 mb-1">Nível</label>
              <select
                id="level" value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#0B0F1C] border border-white/20 text-white"
              >
                <option value="">Todos</option>
                {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>
          </div>
          {isFiltering && (
            <button onClick={handleClearFilters} className="text-xs text-blue-400 hover:underline mt-3">Limpar busca</button>
          )}
        </div>
      )}

      {/* Renderização dos prompts */}
      {isFiltering ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Resultados da Busca ({filteredPrompts.length})</h2>
          <PromptGrid
            prompts={filteredPrompts} 
            unlockedPromptIds={unlockedPromptIds} 
            isElite={isElite}
            onCardClick={handleCardClick} 
            onOpenFeedback={handleOpenFeedback}
          />
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map(category => (
            <CategoryRow
              key={category} 
              category={category}
              prompts={allPrompts.filter(p => p.category === category)}
              unlockedPromptIds={unlockedPromptIds} 
              isElite={isElite}
              onCardClick={handleCardClick} 
              onOpenFeedback={handleOpenFeedback}
            />
          ))}
        </div>
      )}

      {/* Modal de desbloqueio */}
      {promptToUnlock && (
        <UnlockPromptModal
          prompt={promptToUnlock} onClose={() => setPromptToUnlock(null)}
          onUnlockSuccess={handleUnlockSuccess}
        />
      )}

      {/* Modal de feedback */}
      <FeedbackModal
        open={feedbackOpen} onClose={() => setFeedbackOpen(false)}
        promptId={feedbackPromptId || ''} userId={user?.uid || null}
      />
    </>
  );
}
