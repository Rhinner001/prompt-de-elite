'use client';

import React, { Suspense, useState, useEffect } from 'react'; // ← ADICIONAR React
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  GoogleAuthProvider 
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import toast from 'react-hot-toast';

// Componente interno que usa useSearchParams
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'free';
  const [loading, setLoading] = useState(false);

  // Verificar resultado do redirect quando a página carrega
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const auth = getAuth(app);
        const result = await getRedirectResult(auth);
        
        if (result) {
          const user = result.user;
          const db = getFirestore(app);
          
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
        }
      } catch (error) {
        const errorMsg = (error instanceof Error) ? error.message : String(error);
        console.error('Erro no redirect result:', errorMsg);
        toast.error('Erro ao processar login. Tente novamente.');
      }
    };

    checkRedirectResult();
  }, [plan, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      const auth = getAuth(app);
      const db = getFirestore(app);
      const provider = new GoogleAuthProvider();
      
      // Configurar provider para melhor experiência
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      try {
        // Tentar popup primeiro
        console.log('🔄 Tentando login com popup...');
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
        
      } catch (popupError: any) {
        console.log('❌ Popup falhou:', popupError.code);
        
        // Se popup for bloqueado, usar redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/cancelled-popup-request') {
          
          console.log('🔄 Usando redirect como fallback...');
          toast.loading('Redirecionando para o Google...'); // ← MUDANÇA: toast.loading em vez de toast.info
          
          // Usar redirect como fallback
          await signInWithRedirect(auth, provider);
          return; // Não continuar, pois vai redirecionar
        } else {
          throw popupError;
        }
      }
      
    } catch (error) {
      const errorMsg = (error instanceof Error) ? error.message : String(error);
      console.error('Erro geral no login:', errorMsg);
      
      // Mensagens específicas para diferentes erros
      if (errorMsg.includes('popup-blocked')) {
        toast.error('Popup foi bloqueado. Habilitando popups para este site pode melhorar a experiência.');
      } else if (errorMsg.includes('network-request-failed')) {
        toast.error('Erro de conexão. Verifique sua internet.');
      } else {
        toast.error('Erro ao entrar com o Google. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-white">🚀</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Prompt de Elite
          </h1>
          
          <p className="text-gray-600 mb-8">
            Entre com sua conta Google para começar sua jornada
          </p>
          
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 border border-gray-300 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continuar com Google</span>
              </>
            )}
          </button>
          
          <div className="mt-6 text-xs text-gray-500 text-center">
            <p>Ao continuar, você concorda com nossos</p>
            <p>
              <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a> e 
              <a href="#" className="text-blue-600 hover:underline ml-1">Política de Privacidade</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component
function RegisterLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
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
