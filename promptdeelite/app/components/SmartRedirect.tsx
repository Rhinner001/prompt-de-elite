// app/components/SmartRedirect.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SmartRedirectProps {
  children: React.ReactNode;
}

export default function SmartRedirect({ children }: SmartRedirectProps) {
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já passou pelo fluxo recentemente
    const lastVisit = localStorage.getItem('lastDashboardVisit');
    const userToken = localStorage.getItem('userToken'); // Ou como você armazena
    
    if (userToken && lastVisit) {
      const lastVisitTime = new Date(lastVisit).getTime();
      const now = new Date().getTime();
      const hoursSinceLastVisit = (now - lastVisitTime) / (1000 * 60 * 60);
      
      // Se visitou o dashboard nas últimas 24 horas, redireciona
      if (hoursSinceLastVisit < 24) {
        console.log('🔄 Usuário ativo detectado, redirecionando...');
        router.replace('/dashboard');
        return;
      }
    }
    
    setShouldRender(true);
  }, [router]);

  if (!shouldRender) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
