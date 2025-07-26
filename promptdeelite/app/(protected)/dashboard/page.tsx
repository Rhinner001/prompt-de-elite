// app/(protected)/dashboard/page.tsx
import { Suspense } from 'react';
import DashboardContent from './DashboardContent';

// FORÇA RENDERIZAÇÃO DINÂMICA - RESOLVE O ERRO
export const dynamic = 'force-dynamic';

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 m-auto w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Carregando Dashboard</h2>
          <p className="text-slate-400">Preparando sua experiência...</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
