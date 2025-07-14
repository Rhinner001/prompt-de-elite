'use client';

import { Suspense, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import toast from 'react-hot-toast';

// Componente interno que usa useSearchParams
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'free';

  const handleGoogleLogin = useCallback(async () => {
    try {
      // Criar instâncias dentro da função para evitar dependências desnecessárias
      const auth = getAuth(app);
      const db = getFirestore(app);
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          photo: user.photoURL || '',
          plan: plan,
          createdAt: new Date().toISOString(),
        });
      }

      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      const errorMsg = (error instanceof Error) ? error.message : String(error);
      console.error('Erro no login com Google:', errorMsg);
      toast.error('Erro ao entrar com o Google. Tente novamente.');
    }
  }, [plan, router]);

  useEffect(() => {
    handleGoogleLogin();
  }, [handleGoogleLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Autenticando com sua conta Google...</p>
      </div>
    </div>
  );
}

// Loading component
function RegisterLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}

// Componente principal com Suspense
export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterContent />
    </Suspense>
  );
}
