'use client';

import { useEffect, useState } from 'react';
import { getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/authHandler';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log('Usuário logado via redirect:', result.user);
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Erro após redirect:', error);
      } finally {
        setLoading(false);
      }
    };

    checkRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c1c3f] to-[#0c1c3f]">
      <div className="text-white text-center">
        <h1 className="text-xl font-semibold mb-4">Entrar com Google</h1>
        {!loading && (
          <button
            onClick={signInWithGoogle}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Continuar com Google
          </button>
        )}
      </div>
    </div>
  );
}
