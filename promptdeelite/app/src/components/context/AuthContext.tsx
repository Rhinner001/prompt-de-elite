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
  
  return lastResetDate.getMonth() !== now.getMonth() || 
         lastResetDate.getFullYear() !== now.getFullYear();
};

const resetMonthlyCredits = async (userId: string, currentPlan: string): Promise<Partial<AppUser>> => {
  const creditsToReset = currentPlan === 'elite' ? 999 : 1; // 999 para elite, 1 para free
  
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
    return {}; // Retorna um objeto vazio em caso de erro para evitar quebrar o merge
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
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(userRef, newUser);
    console.log('AuthContext: Novo perfil criado');
    return newUser;
  } else {
    const userData = snapshot.data() as AppUser;
    
    // Verificar se precisa resetar créditos
    if (shouldResetCredits(userData.lastCreditReset)) {
      const resetData = await resetMonthlyCredits(userAuth.uid, userData.plan);
      // Retorna os dados existentes mesclados com os dados de reset
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
      // setPersistence aqui para garantir que a sessão seja mantida
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
      // É importante garantir que o loading seja false mesmo em caso de erro
      setLoading(false); 
      throw error;
    }
  }, []);

  // Função para atualizar plano
  const updateUserPlan = useCallback(async (planData: Partial<AppUser>) => {
    console.log('🔄 updateUserPlan chamado com:', planData);
    
    if (!user) {
      console.error('❌ updateUserPlan: Usuário não encontrado');
      throw new Error('Usuário não encontrado');
    }
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        ...planData,
        updatedAt: new Date().toISOString()
      };
      
      console.log('📝 Atualizando no Firebase:', updateData);
      await updateDoc(userRef, updateData);
      
      // Atualizar estado local
      setAppUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, ...updateData };
        console.log('✅ Estado local atualizado:', updatedUser);
        return updatedUser;
      });
      
      console.log('✅ updateUserPlan concluído com sucesso');
    } catch (error) {
      console.error('❌ Erro em updateUserPlan:', error);
      throw error;
    }
  }, [user]);

  // Função para consumir crédito
  const consumeCredit = useCallback(async (): Promise<boolean> => {
    console.log('🔄 consumeCredit chamado');
    
    if (!user || !appUser) {
      console.error('❌ consumeCredit: Usuário ou appUser não encontrado');
      return false;
    }
    
    // Usuários elite têm créditos ilimitados
    if (appUser.plan === 'elite' || appUser.subscriptionStatus === 'active') {
      console.log('✅ Usuário elite - crédito ilimitado');
      return true;
    }
    
    // Verificar créditos disponíveis
    const creditsUsed = appUser.creditsUsed || 0;
    const remainingCredits = appUser.monthlyCredits - creditsUsed;
    
    console.log('📊 Créditos:', { total: appUser.monthlyCredits, usados: creditsUsed, restantes: remainingCredits });
    
    if (remainingCredits <= 0) {
      console.log('❌ Sem créditos disponíveis');
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
      
      // Atualizar estado local
      setAppUser(prev => prev ? { ...prev, creditsUsed: newCreditsUsed } : null);
      
      console.log('✅ Crédito consumido. Novos créditos usados:', newCreditsUsed);
      return true;
    } catch (error) {
      console.error('❌ Erro ao consumir crédito:', error);
      return false;
    }
  }, [user, appUser]);

  // Função para atualizar dados do usuário
  const refreshUserData = useCallback(async () => {
    console.log('🔄 refreshUserData chamado');
    
    if (!user) {
      console.error('❌ refreshUserData: Usuário não encontrado');
      return;
    }
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.data() as AppUser;
        
        // Verificar se precisa resetar créditos
        if (shouldResetCredits(userData.lastCreditReset)) {
          const resetData = await resetMonthlyCredits(user.uid, userData.plan);
          const updatedData = { ...userData, ...resetData };
          setAppUser(updatedData);
          console.log('✅ Dados atualizados com reset de créditos');
        } else {
          setAppUser(userData);
          console.log('✅ Dados atualizados');
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
    console.log('🚀 AuthContext: Inicializando');
    
    // Configura a persistência uma vez. setPersistence retorna uma Promise.
    // Não precisamos esperar por ela aqui, pois onAuthStateChanged será acionado
    // quando o estado de autenticação for resolvido (incluindo persistência).
    setPersistence(auth, browserLocalPersistence)
      .catch(error => {
        console.error('❌ Erro ao configurar persistência:', error);
        // Continua mesmo com erro na persistência para não bloquear o app
      });

    // onAuthStateChanged retorna a função de unsubscribe, que é o que useEffect espera
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('👤 Auth state changed:', firebaseUser?.uid || 'null');
      
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userProfile = await createUserProfileIfNeeded(firebaseUser);
          setAppUser(userProfile);
          console.log('✅ Perfil carregado');
        } catch (error) {
          console.error('❌ Erro ao carregar perfil:', error);
          setAppUser(null);
        }
      } else {
        setAppUser(null);
      }
      
      setLoading(false); // Define loading como false após a verificação inicial
    });
    
    // Retorna a função de unsubscribe para que o useEffect a use como limpeza
    return () => unsubscribe();
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

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
  
  // Debug das funções disponíveis
  console.log('🔍 useAuth functions check:', {
    updateUserPlan: typeof context.updateUserPlan,
    consumeCredit: typeof context.consumeCredit,
    refreshUserData: typeof context.refreshUserData,
  });
  
  return context;
};
