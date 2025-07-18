// authHandler.ts
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const isMobile =
    typeof window !== 'undefined' &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  try {
    if (isMobile) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
    }
  } catch (error) {
    console.error('Erro no login:', error);
  }
};
