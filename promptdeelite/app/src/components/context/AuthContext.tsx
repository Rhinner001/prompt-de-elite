'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

// 1. Tipagem do perfil salvo no Firestore
type AppUser = {
  uid: string;
  displayName: string | null;
  email: string;
  plan: 'free' | 'elite';
  monthlyCredits: number;
  createdAt: string; // ISO string
};

// 2. Tipagem do contexto
type AuthContextType = {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  createUserWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Criação de perfil no Firestore
const createUserProfileIfNeeded = async (userAuth: User) => {
  const userRef = doc(db, 'users', userAuth.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email, uid } = userAuth;

    const newUser: AppUser = {
      uid,
      displayName: displayName || '',
      email: email || '',
      plan: 'free',
      monthlyCredits: 3,
      createdAt: new Date().toISOString(),
    };

    await setDoc(userRef, newUser);
    console.log('Perfil criado no Firestore para novo usuário:', email);
  }
};

// 4. Provider principal
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Login com Google
  const createUserWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      await createUserProfileIfNeeded(loggedUser);

      const userDoc = await getDoc(doc(db, 'users', loggedUser.uid));
      if (userDoc.exists()) {
        setAppUser(userDoc.data() as AppUser);
        setUser(loggedUser);
        toast.success('Login realizado com sucesso!');
      } else {
        toast.error('Erro ao recuperar dados do usuário.');
      }
    } catch (error) {
      const msg =
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
          ? (error as { message: string }).message
          : String(error);
      console.error('Erro no login com Google:', msg);
      toast.error('Erro ao entrar com o Google.');
      throw error;
    }
  };

  // Listener de login automático
  useEffect(() => {
    setLoading(true); // Garante loading ao iniciar listener!
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        await createUserProfileIfNeeded(firebaseUser);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setAppUser(userDoc.data() as AppUser);
        } else {
          setAppUser(null);
        }
      } else {
        setAppUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setAppUser(null);
    toast.success('Você saiu da sua conta.');
  };

  return (
    <AuthContext.Provider
      value={{ user, appUser, loading, createUserWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 5. Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
