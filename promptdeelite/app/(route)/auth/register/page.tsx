'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase'; // ajuste conforme seu caminho
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'free'; // padrão: plano gratuito

  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Novo usuário: criar registro no Firestore
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
  // Faz o type guard antes de acessar error.message
  const errorMsg = (error instanceof Error) ? error.message : String(error);
  console.error('Erro no login com Google:', errorMsg);
  toast.error('Erro ao entrar com o Google. Tente novamente.');
}
    };

    handleGoogleLogin();
  }, );

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <p className="text-lg text-gray-600">Autenticando com sua conta Google...</p>
    </div>
  );
}
