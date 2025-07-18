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
import { FiSliders, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import { FaCrown, FaCheckCircle, FaClock, FaExclamationTriangle, FaGem } from 'react-icons/fa';

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

  // VERIFICAR PLANO STRIPE - CORRIGIDO
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
        
        // Força re-renderização quando o plano é atualizado
        if (data.hasActiveSubscription !== userPlan?.hasActiveSubscription) {
          console.log('Status do plano atualizado:', data);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar plano:', error);
    } finally {
      setPlanLoading(false);
    }
  }, [user, userPlan?.hasActiveSubscription]);

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
    checkUserPlan();
  }, [user, checkUserPlan]);

  // Verificação periódica do plano quando há sucesso no checkout
  useEffect(() => {
    if (success && user) {
      const interval = setInterval(checkUserPlan, 5000); // Verifica a cada 5 segundos
      const timeout = setTimeout(() => clearInterval(interval), 60000); // Para após 1 minuto
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [success, user, checkUserPlan]);

  // Status do plano (integra Stripe + AppUser) - CORRIGIDO
  const isElite: boolean = Boolean(userPlan?.hasActiveSubscription || appUser?.plan === 'elite');
  const credits = appUser?.monthlyCredits || 0;
  
  // Determinar status do plano para exibição
  const getPlanStatus = () => {
    if (planLoading) return { type: 'loading', text: 'Verificando...', icon: FiRefreshCw, color: 'text-blue-400' };
    if (userPlan?.hasActiveSubscription) return { type: 'elite', text: 'Plano Elite Ativo ✨', icon: FaGem, color: 'text-yellow-400' };
    if (userPlan?.status === 'pending') return { type: 'pending', text: 'Aguardando Pagamento ⏳', icon: FaClock, color: 'text-yellow-400' };
    if (appUser?.plan === 'elite') return { type: 'elite', text: 'Plano Elite Ativo ✨', icon: FaGem, color: 'text-yellow-400' };
    return { type: 'free', text: 'Plano Gratuito 🆓', icon: FaExclamationTriangle, color: 'text-slate-400' };
  };

  const planStatus = getPlanStatus();

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
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-slate-400 text-lg">Carregando biblioteca de prompts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <p className="text-red-400 text-lg text-center max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* MENSAGEM DE SUCESSO DO CHECKOUT - MELHORADA */}
      {success && (
        <div className="mb-8 p-6 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/50 rounded-xl backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-green-400 text-xl" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-green-400 mb-2">
                🎉 Pedido Recebido com Sucesso!
              </h2>
              
              {planLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  <p className="text-blue-300">Verificando status do pagamento...</p>
                </div>
              ) : userPlan?.hasActiveSubscription ? (
                <div className="space-y-2">
                  <p className="text-green-300 font-medium">
                    ✅ Seu plano está ativo! Aproveite o acesso completo à biblioteca.
                  </p>
                  <button 
                    onClick={checkUserPlan}
                    className="text-sm text-green-400 hover:text-green-300 underline"
                  >
                    Atualizar Status
                  </button>
                </div>
              ) : userPlan?.status === 'pending' ? (
                <div className="text-yellow-300 space-y-2">
                  <p className="flex items-center gap-2">
                    <FaClock /> ⏳ Aguardando confirmação do pagamento.
                  </p>
                  <p className="text-sm">
                    Se você pagou com boleto, o acesso será liberado em até 3 dias úteis.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="animate-pulse w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-blue-300">Processando seu pagamento...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STATUS DO PLANO - REDESENHADO */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-600/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              planStatus.type === 'elite' ? 'bg-yellow-500/20' : 
              planStatus.type === 'pending' ? 'bg-yellow-500/20' : 
              planStatus.type === 'loading' ? 'bg-blue-500/20' : 'bg-slate-500/20'
            }`}>
              <planStatus.icon className={`text-xl ${planStatus.color} ${planStatus.type === 'loading' ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Status do Seu Plano</h3>
              <p className={`font-medium ${planStatus.color}`}>
                {planStatus.text}
              </p>
              {userPlan?.dataAtivacao && (
                <p className="text-sm text-slate-400 mt-1">
                  Ativo desde: {new Date(userPlan.dataAtivacao).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          </div>
          
          {!planLoading && (
            <button
              onClick={checkUserPlan}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600/50 hover:bg-slate-600/70 rounded-lg transition-colors text-sm text-slate-300"
            >
              <FiRefreshCw className="text-sm" />
              Atualizar
            </button>
          )}
        </div>
      </div>

      {/* Barra Upgrade (para não-elite) - MELHORADA */}
      {!isElite && (
        <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/50 rounded-xl p-4 mb-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <FaCrown className="text-yellow-400" />
              </div>
              <div>
                <p className="text-yellow-200 font-medium">
                  Você está usando o <strong>Plano Gratuito</strong>
                </p>
                <p className="text-yellow-300/80 text-sm">
                  Desbloqueie todos os prompts, acesse sem limites e receba novos lançamentos
                </p>
              </div>
            </div>
            <Link
              href="/planos"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-lg font-bold hover:from-yellow-400 hover:to-orange-400 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaCrown />
              Fazer Upgrade
            </Link>
          </div>
        </div>
      )}

      {/* Créditos mensais para não-elite - MELHORADO */}
      {!isElite && (
        <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/50 rounded-xl p-4 mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 font-bold text-sm">{credits}</span>
            </div>
            <p className="text-blue-200 text-center">
              Você tem <strong className="text-blue-300">{credits} Crédito{credits !== 1 ? 's' : ''} de Desbloqueio</strong> para usar este mês
            </p>
          </div>
        </div>
      )}

      {/* ACESSO ELITE ATIVO - MELHORADO */}
      {isElite && (
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <FaGem className="text-yellow-400 text-2xl" />
            </div>
            <div>
              <h3 className="text-yellow-400 font-bold text-xl mb-1">Acesso Elite Ativo!</h3>
              <p className="text-yellow-200">
                Biblioteca completa desbloqueada • Todos os prompts disponíveis • Sem limitações
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho - MELHORADO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Olá, {user?.displayName || 'Explorador'}.
          </h1>
          <p className="text-xl text-slate-400">O que você quer criar hoje?</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white hover:bg-slate-700/80 transition-all backdrop-blur-sm"
        >
          <FiSliders />
          <span>{showFilters ? 'Ocultar Filtros' : 'Busca Avançada'}</span>
        </button>
      </div>

      {/* Filtros avançados - MELHORADOS */}
      {showFilters && (
        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl mb-12 border border-slate-600/50 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-slate-300 mb-2">
                Buscar Prompts
              </label>
              <input
                type="text" 
                id="search" 
                placeholder="Ex: roteiro viral, copy para vendas..."
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/80 border border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
                Categoria
              </label>
              <select
                id="category" 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/80 border border-slate-600/50 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="">Todas as categorias</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-slate-300 mb-2">
                Nível de Dificuldade
              </label>
              <select
                id="level" 
                value={selectedLevel} 
                onChange={e => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/80 border border-slate-600/50 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="">Todos os níveis</option>
                {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>
          </div>
          {isFiltering && (
            <div className="mt-4 pt-4 border-t border-slate-600/50">
              <button 
                onClick={handleClearFilters} 
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                ✕ Limpar todos os filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* Renderização dos prompts */}
      <div className="pb-12">
        {isFiltering ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Resultados da Busca
              </h2>
              <p className="text-slate-400">
                {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} encontrado{filteredPrompts.length !== 1 ? 's' : ''}
              </p>
            </div>
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
      </div>

      {/* Modal de desbloqueio */}
      {promptToUnlock && (
        <UnlockPromptModal
          prompt={promptToUnlock} 
          onClose={() => setPromptToUnlock(null)}
          onUnlockSuccess={handleUnlockSuccess}
        />
      )}

      {/* Modal de feedback */}
      <FeedbackModal
        open={feedbackOpen} 
        onClose={() => setFeedbackOpen(false)}
        promptId={feedbackPromptId || ''} 
        userId={user?.uid || null}
      />
    </div>
  );
}
