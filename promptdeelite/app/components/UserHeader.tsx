'use client';

import { useAuth } from '@/app/src/components/context/AuthContext';
import Link from 'next/link';
import { FaCrown, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { FaUserCircle } from 'react-icons/fa';

import { useRouter } from 'next/navigation';

// Mapeamento dos rótulos dos planos
const PLAN_LABELS: Record<string, string> = {
  elite: 'Plano Elite',
  free: 'Plano Gratuito',
  // Se quiser criar um PRO futuramente: pro: 'Plano Pro'
};

const PLAN_STYLES: Record<string, string> = {
  elite: 'bg-yellow-400/20 text-yellow-300 border-yellow-500/50',
  free: 'bg-gray-400/20 text-gray-300 border-gray-500/50',
};

export default function UserHeader() {
  const { user, appUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Usuário ainda não carregou
  if (!user) {
    return (
      <header className="flex justify-end items-center p-4 h-[73px] border-b border-white/10">
        <div className="h-8 w-48 bg-gray-700/50 rounded-lg animate-pulse"></div>
      </header>
    );
  }

  const plan = appUser?.plan ?? 'free';
  const planLabel = PLAN_LABELS[plan] || 'Plano Desconhecido';
  const planStyles = PLAN_STYLES[plan] || 'bg-gray-400/20 text-gray-300 border-gray-500/50';

  return (
    <header className="flex justify-end items-center p-4 border-b border-white/10">
      <div className="flex items-center gap-4">
        {/* BOTÃO DE UPGRADE - APENAS PARA FREE */}
        {plan === 'free' && (
          <Link 
            href="/planos"
            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-black rounded-lg text-sm font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 shadow"
            title="Conheça os planos Premium"
          >
            <FaCrown className="text-lg" />
            Fazer Upgrade
            <FaArrowUpRightFromSquare className="ml-1 text-xs" />
          </Link>
        )}

        {/* USER INFO */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-semibold text-white">{user.displayName || 'Usuário'}</div>
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${planStyles}`}>
              {planLabel}
            </span>
          </div>
          <FaUserCircle className="text-gray-400" size={36} />
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-red-600/20 text-red-300 hover:bg-red-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
