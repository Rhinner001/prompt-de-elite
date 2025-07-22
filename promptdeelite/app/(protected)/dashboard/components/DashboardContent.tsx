// app/(protected)/dashboard/components/DashboardContent.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/app/src/components/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import type { Prompt } from '@/types';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CategoryRow from '@/app/components/CategoryRow';
import PromptGrid from '@/app/components/PromptGrid';
import UnlockPromptModal from '@/app/components/UnlockPromptModal';
import FeedbackModal from '@/app/components/FeedbackModal';
import { FiSliders, FiRefreshCw, FiSearch, FiGrid, FiList, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { FaCrown, FaCheckCircle, FaClock, FaExclamationTriangle, FaGem } from 'react-icons/fa';

interface UserPlan {
  hasActiveSubscription: boolean;
  plano: string | null;
  status: string;
  dataAtivacao: string | null;
}

export default function DashboardContent() {
  const { user, appUser } = useAuth();
  const searchParams = useSearchParams();

  // ESTADOS PRINCIPAIS
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlockedPromptIds, setUnlockedPromptIds] = useState<Set<string>>(new Set());
  const [accessedPromptIds, setAccessedPromptIds] = useState<Set<string>>(new Set());
  const [promptToUnlock, setPromptToUnlock] = useState<Prompt | null>(null);
  
  // ESTADOS STRIPE
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);

  // Parâmetros de sucesso do checkout
  const success = searchParams.get('success');

  // Feedback
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackPromptId, setFeedbackPromptId] = useState<string | null>(null);

  // Filtros/UI - MELHORADOS
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'categories'>('categories');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Registra que o usuário visitou o dashboard
    if (user) {
      localStorage.setItem('lastDashboardVisit', new Date().toISOString());
      console.log('📝 Visita ao dashboard registrada');
    }
  }, [user]);

  // DETECTAR MOBILE
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // FUNÇÃO PARA RECARREGAR ESTATÍSTICAS
  const reloadStats = useCallback(async () => {
    if (!user) return;

    try {
      const [unlockedSnapshot, accessedSnapshot, userDocSnapshot] = await Promise.all([
        getDocs(collection(db, 'users', user.uid, 'unlockedPrompts')),
        getDocs(collection(db, 'users', user.uid, 'accessedPrompts')),
        getDoc(doc(db, 'users', user.uid))
      ]);

      // Atualizar prompts desbloqueados
      const unlockedFromSubcollection: string[] = unlockedSnapshot.docs.map(d => d.id);
      const userData = userDocSnapshot.data();
      const unlockedFromArray: string[] = Array.isArray(userData?.unlockedPrompts) 
        ? userData.unlockedPrompts 
        : [];
      
      const allUnlockedIds = new Set<string>([
        ...unlockedFromSubcollection, 
        ...unlockedFromArray
      ]);

      // Atualizar prompts acessados
      const accessedIds = new Set<string>(accessedSnapshot.docs.map(d => d.id));
      
      setUnlockedPromptIds(allUnlockedIds);
      setAccessedPromptIds(accessedIds);

      console.log('🔄 Estatísticas atualizadas:', {
        desbloqueados: allUnlockedIds.size,
        acessados: accessedIds.size
      });

    } catch (error) {
      console.error('Erro ao recarregar estatísticas:', error);
    }
  }, [user]);

  // FUNÇÃO PARA LIDAR COM PROMPT ACESSADO - MELHORADA
  const handlePromptAccessed = useCallback(async (promptId: string) => {
    console.log(`🎯 Prompt ${promptId} foi acessado, atualizando estatísticas...`);
    
    // Atualizar estado local imediatamente
    setAccessedPromptIds(prev => {
      const newSet = new Set(prev);
      newSet.add(promptId);
      return newSet;
    });
    
    // Recarregar dados do servidor após um delay
    setTimeout(() => {
      reloadStats();
    }, 1000);
  }, [reloadStats]);

  // BUSCA DADOS DO FIREBASE E API
  useEffect(() => {
    if (!user) { 
      setIsLoading(false); 
      return; 
    }
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [promptsResponse, unlockedSnapshot, userDocSnapshot, accessedSnapshot] = await Promise.all([
          fetch('/api/prompts'),
          getDocs(collection(db, 'users', user.uid, 'unlockedPrompts')),
          getDoc(doc(db, 'users', user.uid)),
          getDocs(collection(db, 'users', user.uid, 'accessedPrompts'))
        ]);
        
        if (!promptsResponse.ok) throw new Error('Falha ao buscar os prompts da biblioteca.');
        
        const promptsData = await promptsResponse.json();
        
        // COMBINA AMBAS AS FONTES DE DADOS DESBLOQUEADOS
        const unlockedFromSubcollection: string[] = unlockedSnapshot.docs.map(d => d.id);
        const userData = userDocSnapshot.data();
        const unlockedFromArray: string[] = Array.isArray(userData?.unlockedPrompts) 
          ? userData.unlockedPrompts 
          : [];
        
        const allUnlockedIds = new Set<string>([
          ...unlockedFromSubcollection, 
          ...unlockedFromArray
        ]);

        // PROMPTS ACESSADOS (PARA ELITE)
        const accessedIds = new Set<string>(accessedSnapshot.docs.map(d => d.id));
        
        setAllPrompts(promptsData);
        setUnlockedPromptIds(allUnlockedIds);
        setAccessedPromptIds(accessedIds);
        
        console.log('🔍 Dashboard - Dados iniciais carregados:');
        console.log('Total prompts:', promptsData.length);
        console.log('Desbloqueados:', allUnlockedIds.size);
        console.log('Acessados:', accessedIds.size);
        
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
      const interval = setInterval(checkUserPlan, 5000);
      const timeout = setTimeout(() => clearInterval(interval), 60000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [success, user, checkUserPlan]);

  // DECLARAÇÕES MOVIDAS PARA ANTES DO useEffect QUE USA isElite
  const isElite: boolean = Boolean(userPlan?.hasActiveSubscription || appUser?.plan === 'elite');
  const credits = appUser?.monthlyCredits || 0;
  const creditsUsed = appUser?.creditsUsed || 0;
  const creditsRemaining = credits - creditsUsed;
  
  const getPlanStatus = () => {
    if (planLoading) return { type: 'loading', text: 'Verificando...', icon: FiRefreshCw, color: 'text-blue-400' };
    if (userPlan?.hasActiveSubscription) return { type: 'elite', text: 'Elite Ativo', icon: FaGem, color: 'text-yellow-400' };
    if (userPlan?.status === 'pending') return { type: 'pending', text: 'Aguardando Pagamento', icon: FaClock, color: 'text-yellow-400' };
    if (appUser?.plan === 'elite') return { type: 'elite', text: 'Elite Ativo', icon: FaGem, color: 'text-yellow-400' };
    return { type: 'free', text: 'Plano Gratuito', icon: FaExclamationTriangle, color: 'text-slate-400' };
  };

  const planStatus = getPlanStatus();

  // RECARREGAR ESTATÍSTICAS PERIODICAMENTE (para usuários Elite)
  useEffect(() => {
    if (!user || !isElite) return;

    const interval = setInterval(() => {
      reloadStats();
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, [user, isElite, reloadStats]);

  // FILTRAGEM OTIMIZADA
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

  // ESTATÍSTICAS ATUALIZADAS EM TEMPO REAL
  const stats = useMemo(() => {
    const total = allPrompts.length;
    const unlocked = unlockedPromptIds.size;
    const accessed = accessedPromptIds.size;
    const categoriesCount = categories.length;
    
    // Para Elite: usar prompts acessados
    if (isElite) {
      return {
        total,
        accessed,
        categories: categoriesCount,
        completion: total > 0 ? Math.round((accessed / total) * 100) : 0
      };
    }
    
    // Para Free: usar prompts desbloqueados
    return {
      total,
      unlocked,
      categories: categoriesCount,
      completion: total > 0 ? Math.round((unlocked / total) * 100) : 0
    };
  }, [allPrompts.length, unlockedPromptIds.size, accessedPromptIds.size, categories.length, isElite]);

  // FUNÇÕES DE CONTROLE
  const handleUnlockSuccess = useCallback((promptId: string) => {
    setUnlockedPromptIds(prev => new Set(prev).add(promptId));
    setPromptToUnlock(null);
    
    // Recarregar estatísticas após desbloqueio
    setTimeout(() => {
      reloadStats();
    }, 500);
  }, [reloadStats]);

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

  // Função para atualizar estatísticas manualmente
  const handleRefreshStats = useCallback(async () => {
    console.log('🔄 Atualizando estatísticas manualmente...');
    await reloadStats();
  }, [reloadStats]);

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
            <FaGem className="absolute inset-0 m-auto text-blue-500 text-xl animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Carregando Biblioteca</h2>
            <p className="text-slate-400">Preparando seus prompts...</p>
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-red-500 text-6xl">⚠️</div>
          <div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Oops! Algo deu errado</h2>
            <p className="text-red-300 mb-6">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className={`${isMobile ? 'px-4' : 'max-w-7xl mx-auto px-6'} py-6 space-y-6`}>
        
        {/* MENSAGEM DE SUCESSO DO CHECKOUT - COMPACTA */}
        {success && (
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/40 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-400 text-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-green-400 mb-1">Pedido Recebido!</h3>
                {planLoading ? (
                  <p className="text-green-300 text-sm">Verificando pagamento...</p>
                ) : userPlan?.hasActiveSubscription ? (
                  <p className="text-green-300 text-sm">✅ Plano ativo! Aproveite o acesso completo.</p>
                ) : (
                  <p className="text-yellow-300 text-sm">⏳ Processando seu pagamento...</p>
                )}
              </div>
              {!planLoading && (
                <button
                  onClick={checkUserPlan}
                  className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors"
                >
                  <FiRefreshCw className="text-green-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* HEADER COMPACTO */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold text-white mb-2`}>
              Olá, {user?.displayName?.split(' ')[0] || 'Explorador'}.
            </h1>
            <p className="text-slate-400">O que você quer criar hoje?</p>
          </div>
          
          {/* STATUS COMPACTO */}
          <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-600/30">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              planStatus.type === 'elite' ? 'bg-yellow-500/20' : 
              planStatus.type === 'pending' ? 'bg-yellow-500/20' : 
              planStatus.type === 'loading' ? 'bg-blue-500/20' : 'bg-slate-500/20'
            }`}>
              <planStatus.icon className={`text-sm ${planStatus.color} ${planStatus.type === 'loading' ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <p className={`font-medium text-sm ${planStatus.color}`}>{planStatus.text}</p>
              {!isElite && (
                <p className="text-xs text-slate-400">{creditsRemaining}/{credits} créditos</p>
              )}
            </div>
          </div>
        </div>

        {/* UPGRADE BANNER - COMPACTO */}
        {!isElite && (
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/40 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FaCrown className="text-yellow-400 text-lg flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-yellow-200 font-medium">Desbloqueie todo o potencial</p>
                  <p className="text-yellow-300/80 text-sm">Acesso ilimitado + novos lançamentos</p>
                </div>
              </div>
              <Link
                href="/planos"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-lg font-medium hover:from-yellow-400 hover:to-orange-400 transition-all text-sm whitespace-nowrap"
              >
                <FaCrown className="text-xs" />
                {isMobile ? 'Upgrade' : 'Fazer Upgrade'}
              </Link>
            </div>
          </div>
        )}

        {/* CRÉDITOS PARA FREE - COMPACTO */}
        {!isElite && (
          <div className={`bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border rounded-xl p-4 backdrop-blur-sm ${
            creditsRemaining <= 0 ? 'border-red-500/40' : 'border-blue-500/40'
          }`}>
            <div className="flex items-center justify-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                creditsRemaining <= 0 ? 'bg-red-500/20' : 'bg-blue-500/20'
              }`}>
                <span className={`font-bold ${creditsRemaining <= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                  {creditsRemaining}
                </span>
              </div>
              <div className="text-center">
                <p className={`font-medium ${creditsRemaining <= 0 ? 'text-red-300' : 'text-blue-200'}`}>
                  {creditsRemaining > 0 ? (
                    `${creditsRemaining} de ${credits} créditos disponíveis`
                  ) : (
                    'Créditos esgotados este mês'
                  )}
                </p>
                {creditsRemaining <= 0 && (
                  <p className="text-red-400 text-sm">⚠️ Faça upgrade para acesso ilimitado</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ELITE ATIVO - MELHORADO COM ESTATÍSTICAS E BOTÃO DE REFRESH */}
        {isElite && (
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/40 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <FaGem className="text-yellow-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-yellow-400 font-bold text-lg">Acesso Elite Ativo!</h3>
                  <p className="text-yellow-200 text-sm">
                    {stats.accessed} de {stats.total} prompts explorados • Biblioteca completa disponível
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Indicador de progresso visual */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400">{stats.completion}%</div>
                  <div className="text-xs text-yellow-300">Explorado</div>
                </div>
                
                {/* Botão de refresh */}
                <button
                  onClick={handleRefreshStats}
                  className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors"
                  title="Atualizar estatísticas"
                >
                  <FiRefreshCw className="text-yellow-400" />
                </button>
              </div>
            </div>
            
            {/* Barra de progresso */}
            <div className="mt-3 w-full bg-yellow-900/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.completion}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* ESTATÍSTICAS RÁPIDAS */}
        {!isMobile && (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{stats.total}</div>
              <div className="text-sm text-slate-400">Total de Prompts</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {isElite ? stats.accessed : stats.unlocked}
              </div>
              <div className="text-sm text-slate-400">
                {isElite ? 'Acessados' : 'Desbloqueados'}
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{stats.categories}</div>
              <div className="text-sm text-slate-400">Categorias</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.completion}%</div>
              <div className="text-sm text-slate-400">
                {isElite ? 'Explorado' : 'Progresso'}
              </div>
            </div>
          </div>
        )}

        {/* ESTATÍSTICAS MOBILE */}
        {isMobile && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-600/30 text-center">
              <div className="text-xl font-bold text-blue-400 mb-1">{stats.total}</div>
              <div className="text-xs text-slate-400">Total</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-600/30 text-center">
              <div className="text-xl font-bold text-green-400 mb-1">
                {isElite ? stats.accessed : stats.unlocked}
              </div>
              <div className="text-xs text-slate-400">
                {isElite ? 'Acessados' : 'Desbloqueados'}
              </div>
            </div>
          </div>
        )}

        {/* CONTROLES DE BUSCA E VISUALIZAÇÃO - MELHORADOS */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca principal */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <FiX />
              </button>
            )}
          </div>

          {/* Controles */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                showFilters 
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                  : 'bg-slate-800/80 border-slate-600/50 text-slate-400 hover:text-white'
              }`}
            >
              <FiSliders />
              {!isMobile && 'Filtros'}
            </button>
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'categories' : 'grid')}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-slate-400 hover:text-white transition-all"
            >
              {viewMode === 'grid' ? <FiList /> : <FiGrid />}
              {!isMobile && (viewMode === 'grid' ? 'Lista' : 'Grade')}
            </button>
          </div>
        </div>

        {/* FILTROS AVANÇADOS - MELHORADOS */}
        {showFilters && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nível</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="">Todos os níveis</option>
                  {levels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
              </div>
            </div>
            {isFiltering && (
              <div className="pt-4 border-t border-slate-600/50">
                <button 
                  onClick={handleClearFilters}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  ✕ Limpar filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL */}
        <div className="pb-8">
          {isFiltering ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Resultados da Busca
                </h2>
                <span className="text-slate-400 text-sm">
                  {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} encontrado{filteredPrompts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <PromptGrid
                prompts={filteredPrompts}
                unlockedPromptIds={unlockedPromptIds}
                isElite={isElite}
                onCardClick={handleCardClick}
                onOpenFeedback={handleOpenFeedback}
                onPromptAccessed={handlePromptAccessed}
              />
            </div>
          ) : viewMode === 'grid' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Todos os Prompts</h2>
              <PromptGrid
                prompts={allPrompts}
                unlockedPromptIds={unlockedPromptIds}
                isElite={isElite}
                onCardClick={handleCardClick}
                onOpenFeedback={handleOpenFeedback}
                onPromptAccessed={handlePromptAccessed}
              />
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map(category => (
                <CategoryRow
                  key={category}
                  category={category}
                  prompts={allPrompts.filter(p => p.category === category)}
                  unlockedPromptIds={unlockedPromptIds}
                  isElite={isElite}
                  onCardClick={handleCardClick}
                  onOpenFeedback={handleOpenFeedback}
                  onPromptAccessed={handlePromptAccessed}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {promptToUnlock && (
        <UnlockPromptModal
          prompt={promptToUnlock}
          onClose={() => setPromptToUnlock(null)}
          onUnlockSuccess={handleUnlockSuccess}
        />
      )}

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        promptId={feedbackPromptId || ''}
        userId={user?.uid || null}
      />
    </div>
  );
}
