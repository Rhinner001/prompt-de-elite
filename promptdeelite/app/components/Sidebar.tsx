// app/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../src/components/context/AuthContext';
import { FiHome, FiHeart, FiUser, FiBookOpen, FiLogOut, FiX } from 'react-icons/fi';
import { FaGem, FaCrown } from 'react-icons/fa';

const navLinks = [
  { name: 'Biblioteca', href: '/dashboard', icon: FiHome, description: 'Explore todos os prompts' },
  { name: 'Favoritos', href: '/favoritos', icon: FiHeart, description: 'Seus prompts salvos' },
  { name: 'Guia de Elite', href: '/guia', icon: FiBookOpen, description: 'Aprenda a usar IA' },
  { name: 'Minha Conta', href: '/conta', icon: FiUser, description: 'Configurações e perfil' },
];

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const { logout, appUser } = useAuth();
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname.startsWith('/biblioteca');
    }
    return pathname === href;
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    if (isMobile && onClose) {
      onClose();
    }
  };

  const plan = appUser?.plan ?? 'free';
  const credits = appUser?.monthlyCredits || 0;
  const creditsUsed = appUser?.creditsUsed || 0;
  const creditsRemaining = credits - creditsUsed;

  // SEMPRE RENDERIZAR AMBAS AS VERSÕES, CONTROLAR COM CSS
  return (
    <>
      {/* VERSÃO MOBILE */}
      <div className="lg:hidden">
        {/* Overlay backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
        
        {/* Sidebar móvel */}
        <aside className={`
          fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-slate-900 border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Header com logo e botão fechar */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link href="/dashboard" onClick={handleLinkClick}>
              <div className="flex items-center gap-2">
                <FaGem className="text-blue-400 text-xl" />
                <h1 className="text-lg font-bold text-white">Prompt de Elite</h1>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <FiX className="text-white text-lg" />
            </button>
          </div>

          {/* Status do plano (mobile) */}
          <div className="p-4 border-b border-white/10">
            {plan === 'elite' ? (
              <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <FaGem className="text-yellow-400" />
                  <span className="text-yellow-300 font-medium text-sm">Plano Elite Ativo</span>
                </div>
                <p className="text-yellow-400/80 text-xs">Acesso completo desbloqueado</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-blue-400 mb-1">{creditsRemaining}</div>
                  <div className="text-xs text-slate-400">de {credits} créditos restantes</div>
                </div>
                <Link 
                  href="/planos"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-lg text-sm font-bold hover:from-yellow-400 hover:to-orange-400 transition-all"
                >
                  <FaCrown className="text-xs" />
                  Fazer Upgrade
                </Link>
              </div>
            )}
          </div>

          {/* Navegação */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                      isLinkActive(link.href)
                        ? 'bg-blue-600/20 text-white border border-blue-500/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      isLinkActive(link.href) ? 'bg-blue-500/20' : 'bg-slate-700/50'
                    }`}>
                      <link.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{link.name}</div>
                      <div className="text-xs opacity-70 truncate">{link.description}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Botão sair */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-xl text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg mr-3 bg-slate-700/50 group-hover:bg-red-600/20">
                <FiLogOut size={18} />
              </div>
              <span className="font-medium">Sair da Conta</span>
            </button>
          </div>
        </aside>
      </div>

      {/* VERSÃO DESKTOP */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-sm p-6 flex-col border-r border-white/10 hidden lg:flex">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/dashboard">
            <div className="flex items-center gap-3 group">
              <div className="p-2 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                <FaGem className="text-blue-400 text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  Prompt de Elite
                </h1>
                <p className="text-xs text-slate-400">Biblioteca de Prompts IA</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Status do plano (desktop) */}
        <div className="mb-6">
          {plan === 'elite' ? (
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaGem className="text-yellow-400" />
                <span className="text-yellow-300 font-semibold">Elite Ativo</span>
              </div>
              <p className="text-yellow-400/80 text-sm">Biblioteca completa desbloqueada</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-600/30">
                <div className="text-2xl font-bold text-blue-400 mb-1">{creditsRemaining}</div>
                <div className="text-sm text-slate-400">de {credits} créditos restantes</div>
                {creditsRemaining <= 0 && (
                  <div className="mt-2 text-xs text-red-400">⚠️ Créditos esgotados</div>
                )}
              </div>
              <Link 
                href="/planos"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105 shadow-lg"
              >
                <FaCrown />
                Fazer Upgrade
              </Link>
            </div>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center p-4 rounded-xl transition-all duration-200 group ${
                    isLinkActive(link.href)
                      ? 'bg-blue-600/20 text-white border border-blue-500/30 shadow-lg'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-4 transition-colors ${
                    isLinkActive(link.href) 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                  }`}>
                    <link.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{link.name}</div>
                    <div className="text-sm opacity-70">{link.description}</div>
                  </div>
                  {isLinkActive(link.href) && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botão sair */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center w-full p-4 rounded-xl text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group"
          >
            <div className="p-2 rounded-lg mr-4 bg-slate-700/50 group-hover:bg-red-600/20 transition-colors">
              <FiLogOut size={20} />
            </div>
            <span className="font-medium">Sair da Conta</span>
          </button>
        </div>
      </aside>
    </>
  );
}
