// app/(protected)/dashboard/hooks/useSearchParamsWrapper.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SearchParamsComponent({ onParams }: { onParams: (params: URLSearchParams) => void }) {
  const searchParams = useSearchParams();
  onParams(searchParams);
  return null;
}

export function useSearchParamsWrapper() {
  let params: URLSearchParams | null = null;
  
  const SearchParamsWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<div>Carregando...</div>}>
      <SearchParamsComponent onParams={(p) => { params = p; }} />
      {children}
    </Suspense>
  );
  
  return { params, SearchParamsWrapper };
}
