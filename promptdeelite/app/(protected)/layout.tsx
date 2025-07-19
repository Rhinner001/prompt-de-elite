// app/(protected)/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar';
import UserHeader from '@/app/components/UserHeader';
import { FiMenu } from 'react-icons/fi';
import { FaGem } from 'react-icons/fa';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-900">
      {/* SIDEBAR */}
      <Sidebar 
        isMobile={isMobile}
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
      />

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER COM BOTÃO MENU MOBILE */}
        <div className="flex items-center justify-between lg:justify-end">
          {/* BOTÃO MENU MOBILE */}
          {isMobile && (
            <div className="flex items-center gap-3 p-4">
              <button
                onClick={openSidebar}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <FiMenu className="text-white text-xl" />
              </button>
              <div className="flex items-center gap-2">
                <FaGem className="text-blue-400 text-lg" />
                <span className="font-bold text-white text-sm">Prompt de Elite</span>
              </div>
            </div>
          )}
          
          {/* USER HEADER */}
          <UserHeader />
        </div>

        {/* CONTEÚDO DA PÁGINA */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
