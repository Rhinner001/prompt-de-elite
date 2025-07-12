// app/components/Sidebar.tsx (CÓDIGO COMPLETO)

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../src/components/context/AuthContext';
import { FiHome, FiHeart, FiUser, FiBookOpen, FiLogOut } from 'react-icons/fi'; // Adicionamos FiBookOpen

const navLinks = [
  { name: 'Biblioteca', href: '/dashboard', icon: FiHome },
  { name: 'Favoritos', href: '/favoritos', icon: FiHeart },
  { name: 'Guia de Elite', href: '/guia', icon: FiBookOpen }, // <<< NOSSO NOVO LINK
  { name: 'Minha Conta', href: '/conta', icon: FiUser },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname.startsWith('/biblioteca');
    }
    return pathname === href;
  };

  return (
    <aside className="w-64 bg-[#0F1423] p-6 flex flex-col border-r border-white/10">
      <div className="mb-8">
        <Link href="/dashboard">
          <h1 className="text-xl font-bold text-white">Prompt de Elite</h1>
        </Link>
      </div>
      <nav className="flex-1">
        <ul>
          {navLinks.map((link) => (
            <li key={link.name} className="mb-2">
              <Link
                href={link.href}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  isLinkActive(link.href)
                    ? 'bg-blue-600/30 text-white'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <link.icon className="mr-3" size={20} />
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <button
          onClick={logout}
          className="flex items-center w-full p-3 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-colors duration-200"
        >
          <FiLogOut className="mr-3" size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}