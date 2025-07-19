'use client';

import { useAuth } from '@/app/src/components/context/AuthContext';
import Link from 'next/link';
import { FaCrown, FaSignOutAlt, FaUserCircle, FaGem, FaExternalLinkAlt } from 'react-icons/fa';
import { FiMenu, FiX, FiLogOut, FiExternalLink } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Mapeamento dos rótulos dos planos
const PLAN_LABELS: Record<string, string> = {
  elite: 'Elite',
  free: 'Gratuito',
};

const PLAN_STYLES: Record<string, string> = {
  elite: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/50',
  free: 'bg-gray-500/20 text-gray-300 border-gray-500/50',
};

const PLAN_ICONS: Record<string, any> = {
  elite: FaGem,
  free: FaUserCircle,
};

export default function UserHeader() {
  const { user, appUser, logout } = useAuth();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    setShowMobileMenu(false);
  };

  // Loading state
  if (!user) {
    return (
      <header className="flex justify-end items-center p-4 h-[73px] border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-6 w-24 bg-gray-700/50 rounded-lg animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-700/50 rounded-full animate-pulse"></div>
        </div>
      </header>
    );
  }

  const plan = appUser?.plan ?? 'free';
  const planLabel = PLAN_LABELS[plan] || 'Desconhecido';
  const planStyles = PLAN_STYLES[plan] || 'bg-gray-500/20 text-gray-300 border-gray-500/50';
  const PlanIcon = PLAN_ICONS[plan] || FaUserCircle;
  const credits = appUser?.monthlyCredits || 0;
  const creditsUsed = appUser?.creditsUsed || 0;
  const creditsRemaining = credits - creditsUsed;

  // VERSÃO MOBILE
  if (isMobile) {
    return (
      <>
        <header className="flex justify-between items-center p-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-sm">
          {/* Logo/Title compacto */}
          <div className="flex items-center gap-2">
            <FaGem className="text-blue-400 text-lg" />
            <span className="font-bold text-white text-sm">Prompt de Elite</span>
          </div>

          {/* User info compacto + Menu */}
          <div className="flex items-center gap-3">
            {/* Créditos para free (mobile compacto) */}
            {plan === 'free' && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-lg">
                <span className="text-blue-400 text-xs font-bold">{creditsRemaining}</span>
                <span className="text-blue-300 text-xs">créditos</span>
              </div>
            )}

            {/* Avatar + Plan badge */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <PlanIcon className={`text-2xl ${plan === 'elite' ? 'text-yellow-400' : 'text-gray-400'}`} />
                {plan === 'elite' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                )}
              </div>
              <button
                onClick={() => setShowMobileMenu(true)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <FiMenu className="text-white text-lg" />
              </button>
            </div>
          </div>
        </header>

        {/* MENU MOBILE OVERLAY */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
            <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-slate-900 border-l border-white/10 shadow-2xl">
              {/* Header do menu */}
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Menu</h3>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <FiX className="text-white" />
                </button>
              </div>

              {/* Conteúdo do menu */}
              <div className="p-4 space-y-6">
                {/* User Info */}
                <div className="text-center space-y-3">
                  <div className="relative inline-block">
                    <PlanIcon className={`text-4xl ${plan === 'elite' ? 'text-yellow-400' : 'text-gray-400'}`} />
                    {plan === 'elite' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <FaGem className="text-black text-xs" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">
                      {user.displayName || 'Usuário'}
                    </h4>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${planStyles}`}>
                      <PlanIcon className="text-xs" />
                      Plano {planLabel}
                    </span>
                  </div>
                </div>

                {/* Créditos (se free) */}
                {plan === 'free' && (
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{creditsRemaining}</div>
                    <div className="text-sm text-slate-400">de {credits} créditos restantes</div>
                    {creditsRemaining <= 0 && (
                      <div className="mt-2 text-xs text-red-400">
                        ⚠️ Créditos esgotados
                      </div>
                    )}
                  </div>
                )}

                {/* Upgrade Button (se free) */}
                {plan === 'free' && (
                  <Link 
                    href="/planos"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <FaCrown />
                    Fazer Upgrade
                    <FiExternalLink className="text-sm" />
                  </Link>
                )}

                {/* Elite Badge (se elite) */}
                {plan === 'elite' && (
                  <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-xl p-4 text-center">
                    <FaGem className="text-yellow-400 text-2xl mx-auto mb-2" />
                    <p className="text-yellow-300 font-medium">Acesso Elite Ativo</p>
                    <p className="text-yellow-400/80 text-sm">Biblioteca completa desbloqueada</p>
                  </div>
                )}

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600/20 text-red-300 hover:bg-red-500/30 rounded-xl font-medium transition-all"
                >
                  <FiLogOut />
                  Sair da Conta
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // VERSÃO DESKTOP
  return (
    <header className="flex justify-end items-center p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        
        {/* Créditos para free (desktop) */}
        {plan === 'free' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-600/30">
            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 text-xs font-bold">{creditsRemaining}</span>
            </div>
            <span className="text-slate-300 text-sm">
              {creditsRemaining} de {credits} créditos
            </span>
          </div>
        )}

        {/* Upgrade Button (desktop - se free) */}
        {plan === 'free' && (
          <Link 
            href="/planos"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl text-sm font-bold hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg"
            title="Conheça os planos Premium"
          >
            <FaCrown />
            Fazer Upgrade
            <FaExternalLinkAlt className="text-xs" />
          </Link>
        )}

        {/* User Info (desktop) */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-semibold text-white text-sm">
              {user.displayName || 'Usuário'}
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${planStyles}`}>
              <PlanIcon className="text-xs" />
              {planLabel}
            </span>
          </div>
          
          <div className="relative">
            <PlanIcon className={`text-3xl ${plan === 'elite' ? 'text-yellow-400' : 'text-gray-400'}`} />
            {plan === 'elite' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                <FaGem className="text-black text-xs" />
              </div>
            )}
          </div>
        </div>

        {/* Logout Button (desktop) */}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 bg-red-600/20 text-red-300 hover:bg-red-500/30 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          title="Sair da conta"
        >
          <FaSignOutAlt />
          Sair
        </button>
      </div>
    </header>
  );
}
