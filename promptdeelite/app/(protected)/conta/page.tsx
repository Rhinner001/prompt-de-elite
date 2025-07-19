// app/(protected)/conta/page.tsx - COM ESTATÍSTICAS REAIS
'use client';

import { updateProfile } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useAuth } from '../../src/components/context/AuthContext';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiUser, FiMail, FiCalendar, FiShield, FiEdit3, FiCheck, FiX, FiActivity } from 'react-icons/fi';
import { FaGem, FaCrown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ContaPage() {
  const { user, appUser, refreshUserData } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    favoritos: 0,
    desbloqueados: 0,
    acessados: 0
  });

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user?.displayName]);

  // CARREGAR ESTATÍSTICAS REAIS DO FIRESTORE
  useEffect(() => {
    const loadStats = async () => {
      if (!user) {
        setStatsLoading(false);
        return;
      }
      
      try {
        setStatsLoading(true);
        
        // Buscar dados em paralelo
        const [favoritesSnapshot, unlockedSnapshot, accessedSnapshot, userDocSnapshot] = await Promise.all([
          getDocs(collection(db, 'users', user.uid, 'favorites')),
          getDocs(collection(db, 'users', user.uid, 'unlockedPrompts')),
          getDocs(collection(db, 'users', user.uid, 'accessedPrompts')),
          getDoc(doc(db, 'users', user.uid))
        ]);

        // Contar favoritos
        const favoritosCount = favoritesSnapshot.size;

        // Contar desbloqueados (combinar subcoleção + array do documento)
        const unlockedFromSubcollection = unlockedSnapshot.size;
        const userData = userDocSnapshot.data();
        const unlockedFromArray = Array.isArray(userData?.unlockedPrompts) 
          ? userData.unlockedPrompts.length 
          : 0;
        const desbloqueadosCount = Math.max(unlockedFromSubcollection, unlockedFromArray);

        // Contar acessados (para Elite)
        const acessadosCount = accessedSnapshot.size;

        setStats({
          favoritos: favoritosCount,
          desbloqueados: desbloqueadosCount,
          acessados: acessadosCount
        });

        console.log('📊 Estatísticas carregadas:', {
          favoritos: favoritosCount,
          desbloqueados: desbloqueadosCount,
          acessados: acessadosCount
        });

      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        toast.error('Erro ao carregar estatísticas');
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [user]);

  const handleSaveName = async () => {
    if (!user || !displayName.trim()) return;
    
    setIsLoading(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      await refreshUserData?.();
      setIsEditing(false);
      toast.success('Nome atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
      toast.error('Não foi possível atualizar o nome.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user?.displayName || '');
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getPlanInfo = () => {
    const plan = appUser?.plan || 'free';
    if (plan === 'elite') {
      return {
        name: 'Plano Elite',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/50',
        icon: FaGem,
        description: 'Acesso completo à biblioteca'
      };
    }
    return {
      name: 'Plano Gratuito',
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/20',
      borderColor: 'border-slate-500/50',
      icon: FiUser,
      description: 'Acesso limitado com créditos mensais'
    };
  };

  const planInfo = getPlanInfo();
  const credits = appUser?.monthlyCredits || 0;
  const creditsUsed = appUser?.creditsUsed || 0;
  const creditsRemaining = credits - creditsUsed;
  const isElite = appUser?.plan === 'elite';

  // Calcular progresso baseado no plano
  const getProgressPercentage = () => {
    if (isElite) {
      // Para Elite: progresso baseado em prompts acessados (assumindo 100 prompts total)
      const totalPrompts = 100; // Você pode buscar o total real da API
      return Math.round((stats.acessados / totalPrompts) * 100);
    } else {
      // Para Free: progresso baseado em créditos usados
      return credits > 0 ? Math.round((stats.desbloqueados / credits) * 100) : 0;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 bg-blue-500/20 border-2 border-blue-500/50 rounded-full flex items-center justify-center mx-auto">
            <FiUser className="text-3xl text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Minha Conta</h1>
            <p className="text-slate-400">Gerencie suas informações pessoais e preferências</p>
          </div>
        </motion.div>

        {/* INFORMAÇÕES PESSOAIS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FiUser className="text-blue-400" />
            Informações Pessoais
          </h2>

          <div className="space-y-6">
            {/* NOME */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome de Exibição
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Digite seu nome"
                  />
                ) : (
                  <p className="text-lg text-white px-4 py-3 bg-slate-900/30 rounded-lg">
                    {displayName || 'Nome não definido'}
                  </p>
                )}
              </div>
              
              <div className="ml-4 flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveName}
                      disabled={isLoading || !displayName.trim()}
                      className="p-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg transition-colors"
                      title="Salvar"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FiCheck size={20} />
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="p-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                      title="Cancelar"
                    >
                      <FiX size={20} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    title="Editar nome"
                  >
                    <FiEdit3 size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/30 rounded-lg">
                <FiMail className="text-slate-400" />
                <span className="text-white">{user.email}</span>
                <span className="ml-auto px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  Verificado
                </span>
              </div>
            </div>

            {/* DATA DE CRIAÇÃO */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Membro desde
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/30 rounded-lg">
                <FiCalendar className="text-slate-400" />
                <span className="text-white">
                  {formatDate(user.metadata.creationTime)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* STATUS DO PLANO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border ${planInfo.borderColor}`}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FiShield className="text-blue-400" />
            Plano e Assinatura
          </h2>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 ${planInfo.bgColor} border ${planInfo.borderColor} rounded-xl`}>
                <planInfo.icon className={`text-2xl ${planInfo.color}`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${planInfo.color}`}>{planInfo.name}</h3>
                <p className="text-slate-400">{planInfo.description}</p>
              </div>
            </div>

            {appUser?.plan === 'free' && (
              <a
                href="/planos"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-lg font-bold hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105"
              >
                <FaCrown />
                Fazer Upgrade
              </a>
            )}
          </div>

          {/* CRÉDITOS (APENAS PARA FREE) */}
          {appUser?.plan === 'free' && (
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">Créditos Mensais</span>
                <span className="text-white font-bold">{creditsRemaining} / {credits}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${credits > 0 ? (creditsRemaining / credits) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {creditsRemaining > 0 
                  ? `${creditsRemaining} crédito${creditsRemaining !== 1 ? 's' : ''} restante${creditsRemaining !== 1 ? 's' : ''} este mês`
                  : 'Créditos esgotados este mês'
                }
              </p>
            </div>
          )}
        </motion.div>

        {/* ESTATÍSTICAS - CORRIGIDAS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FiActivity className="text-blue-400" />
            Suas Estatísticas
            {statsLoading && (
              <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin ml-2" />
            )}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FAVORITOS */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-pink-500/20 border border-pink-500/50 rounded-xl flex items-center justify-center mx-auto">
                <span className="text-2xl">❤️</span>
              </div>
              <div className="text-2xl font-bold text-pink-400">
                {statsLoading ? '...' : stats.favoritos}
              </div>
              <div className="text-sm text-slate-400">Prompts Favoritos</div>
            </div>

            {/* DESBLOQUEADOS/ACESSADOS */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center justify-center mx-auto">
                <span className="text-2xl">{isElite ? '👁️' : '🔓'}</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {statsLoading ? '...' : (isElite ? stats.acessados : stats.desbloqueados)}
              </div>
              <div className="text-sm text-slate-400">
                {isElite ? 'Prompts Acessados' : 'Prompts Desbloqueados'}
              </div>
            </div>

            {/* PROGRESSO */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/50 rounded-xl flex items-center justify-center mx-auto">
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {statsLoading ? '...' : `${getProgressPercentage()}%`}
              </div>
              <div className="text-sm text-slate-400">
                {isElite ? 'Biblioteca Explorada' : 'Créditos Utilizados'}
              </div>
            </div>
          </div>

          {/* DETALHES ADICIONAIS */}
          {!statsLoading && (
            <div className="mt-6 pt-6 border-t border-slate-600/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
                <div>
                  <strong className="text-slate-300">Total de interações:</strong> {stats.favoritos + (isElite ? stats.acessados : stats.desbloqueados)}
                </div>
                <div>
                  <strong className="text-slate-300">Última atualização:</strong> {new Date().toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* AÇÕES RÁPIDAS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Ações Rápidas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/favoritos"
              className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/30 transition-colors">
                <span className="text-lg">❤️</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">Ver Favoritos</div>
                <div className="text-sm text-slate-400">
                  {stats.favoritos > 0 ? `${stats.favoritos} prompt${stats.favoritos !== 1 ? 's' : ''} salvo${stats.favoritos !== 1 ? 's' : ''}` : 'Acesse seus prompts salvos'}
                </div>
              </div>
            </a>

            <a
              href="/dashboard"
              className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <span className="text-lg">📚</span>
              </div>
              <div>
                <div className="font-medium text-white">Explorar Biblioteca</div>
                <div className="text-sm text-slate-400">Descubra novos prompts</div>
              </div>
            </a>

            <a
              href="/guia"
              className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700/70 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <span className="text-lg">🎓</span>
              </div>
              <div>
                <div className="font-medium text-white">Guia de Elite</div>
                <div className="text-sm text-slate-400">Aprenda a usar a plataforma</div>
              </div>
            </a>

            {appUser?.plan === 'free' && (
              <a
                href="/planos"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 hover:from-yellow-900/70 hover:to-orange-900/70 border border-yellow-500/50 rounded-lg transition-colors group"
              >
                <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                  <FaCrown className="text-yellow-400" />
                </div>
                <div>
                  <div className="font-medium text-yellow-300">Upgrade para Elite</div>
                  <div className="text-sm text-yellow-400/80">Acesso ilimitado à biblioteca</div>
                </div>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
