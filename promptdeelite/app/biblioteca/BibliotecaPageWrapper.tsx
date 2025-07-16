'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/src/components/context/AuthContext';

export default function BibliotecaPageWrapper({ children }: { children: React.ReactNode }) {
  const { user, appUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Não logado? Redireciona para login/home
    if (!user) {
      router.replace('/');
      return;
    }
    // Plano diferente de elite? Redireciona para dashboard
    if (appUser?.plan !== 'elite') {
      router.replace('/dashboard');
    }
  }, [user, appUser, router]);

  // Evita flash de conteúdo indevido
  if (!user || appUser?.plan !== 'elite') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1c3f] text-white">
        <div className="text-xl">Redirecionando…</div>
      </div>
    );
  }

  return <>{children}</>;
}
