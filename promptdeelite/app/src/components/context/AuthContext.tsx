// app/src/components/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Tipos
type AppUser = {
  uid: string;
  displayName: string | null;
  email: string;
  plan: 'free' | 'elite';
  monthlyCredits: number;
  creditsUsed?: number;
  lastCreditReset?: string;
  stripeCustomerId?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'pending' | 'cancelled';
  subscriptionId?: string;
  createdAt: string;
  updatedAt?: string;
  unlockedPrompts?: string[]; // Adicionado para garantir tipo
};

type AuthContextType = {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  createUserWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserPlan: (planData: Partial<AppUser>) => Promise<void>;
  consumeCredit: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
};

// Criar contexto com valor padrão
const AuthContext = createContext<AuthContextType>({
  user: null,
  appUser: null,
  loading: true,
  createUserWithGoogle: async () => {},
  logout: async () => {},
  updateUserPlan: async () => {},
  consumeCredit: async () => false,
  refreshUserData: async () => {},
});

// Utilitários
const shouldResetCredits = (lastReset?: string): boolean => {
  if (!lastReset) return true;
  const lastResetDate = new Date(lastReset);
  const now = new Date();
  return lastResetDate.getMonth() !== now.getMonth() || lastResetDate.getFullYear() !== now.getFullYear();
};

const resetMonthlyCredits = async (userId: string, currentPlan: string): Promise<Partial<AppUser>> => {
  const creditsToReset = currentPlan === 'elite' ? 999 : 1;
  const updateData = {
    monthlyCredits: creditsToReset,
    creditsUsed: 0,
    lastCreditReset: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updateData);
    console.log('AuthContext: Créditos resetados para:', userId);
    return updateData;
  } catch (error) {
    console.error('Erro ao resetar créditos:', error);
    return {};
  }
};

const createUserProfileIfNeeded = async (userAuth: User): Promise<AppUser> => {
  const userRef = doc(db, 'users', userAuth.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email, uid } = userAuth;
    const newUser: AppUser = {
      uid,
      displayName: displayName || '',
      email: email || '',
      plan: 'free',
      monthlyCredits: 1,
      creditsUsed: 0,
      lastCreditReset: new Date().toISOString(),
      subscriptionStatus: 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unlockedPrompts: [],
    };
    await setDoc(userRef, newUser);
    console.log('AuthContext: Novo perfil criado');
    return newUser;
  } else {
    const userData = snapshot.data() as AppUser;
    if (shouldResetCredits(userData.lastCreditReset)) {
      const resetData = await resetMonthlyCredits(userAuth.uid, userData.plan);
      return { ...userData, ...resetData };
    }
    return userData;
  }
};

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para criar usuário com Google
  const createUserWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      const userProfile = await createUserProfileIfNeeded(loggedUser);
      setAppUser(userProfile);
      setUser(loggedUser);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('AuthContext: Erro no login:', error);
      toast.error('Erro ao entrar com o Google.');
      setLoading(false);
      throw error;
    }
  }, []);

  // Função para atualizar plano
  const updateUserPlan = useCallback(async (planData: Partial<AppUser>) => {
    if (!user) throw new Error('Usuário não encontrado');
    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        ...planData,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(userRef, updateData);
      setAppUser(prevUser => prevUser ? { ...prevUser, ...updateData } : null);
    } catch (error) {
      console.error('❌ Erro em updateUserPlan:', error);
      throw error;
    }
  }, [user]);

  // Função para consumir crédito
  const consumeCredit = useCallback(async (): Promise<boolean> => {
    if (!user || !appUser) {
      console.error('❌ consumeCredit: Usuário ou appUser não encontrado');
      return false;
    }
    // Usuários elite têm créditos ilimitados
    if (appUser.plan === 'elite' || appUser.subscriptionStatus === 'active') {
      return true;
    }
    const creditsUsed = appUser.creditsUsed || 0;
    const remainingCredits = appUser.monthlyCredits - creditsUsed;
    if (remainingCredits <= 0) {
      toast.error('Você não tem mais créditos disponíveis este mês.');
      return false;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      const newCreditsUsed = creditsUsed + 1;
      await updateDoc(userRef, {
        creditsUsed: newCreditsUsed,
        updatedAt: new Date().toISOString()
      });
      // ⚡️ Atualize o usuário no front após consumir crédito
      await refreshUserData();
      return true;
    } catch (error) {
      console.error('❌ Erro ao consumir crédito:', error);
      return false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, appUser]);

  // Função para atualizar dados do usuário (garante sincronismo)
  const refreshUserData = useCallback(async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.data() as AppUser;
        if (shouldResetCredits(userData.lastCreditReset)) {
          const resetData = await resetMonthlyCredits(user.uid, userData.plan);
          setAppUser({ ...userData, ...resetData });
        } else {
          setAppUser(userData);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar dados:', error);
    }
  }, [user]);

  // Função de logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAppUser(null);
      toast.success('Logout realizado com sucesso.');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      toast.error('Erro ao sair da conta.');
    }
  }, []);

  // Inicialização
  useEffect(() => {
    setLoading(true);
    setPersistence(auth, browserLocalPersistence).catch(() => {});
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userProfile = await createUserProfileIfNeeded(firebaseUser);
          setAppUser(userProfile);
        } catch {
          setAppUser(null);
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Valor do contexto
  const contextValue: AuthContextType = {
    user,
    appUser,
    loading,
    createUserWithGoogle,
    logout,
    updateUserPlan,
    consumeCredit,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
