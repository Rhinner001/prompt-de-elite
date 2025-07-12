'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { FaGoogle } from 'react-icons/fa';

export default function AccessPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Se quiser usar AuthContext, basta trocar as duas linhas abaixo
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Escuta o usuário autenticado
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        router.push('/dashboard');
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (activeTab === 'login') {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // O redirecionamento é automático via useEffect
      } catch {
        setError("E-mail ou senha inválidos. Tente novamente.");
      }
    } else {
      if (!name.trim()) {
        setError("Por favor, insira seu nome completo.");
        setLoading(false);
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        // O redirecionamento é automático via useEffect
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          setError('Este e-mail já está cadastrado. Tente fazer login.');
        } else if (err.code === 'auth/weak-password') {
          setError('A senha deve ter no mínimo 6 caracteres.');
        } else {
          setError('Falha ao criar a conta. Tente novamente.');
        }
      }
    }
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // O redirecionamento é automático via useEffect
    } catch {
      setError("Não foi possível entrar com o Google. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0B0F1C] text-white p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Prompt de Elite</h1>
        <p className="text-lg text-gray-400 mt-2">Sua Central de Inteligência Estratégica</p>
      </div>

      <div className="bg-[#11182B] p-2 rounded-lg w-full max-w-md border border-white/10 shadow-lg">
        {/* Abas */}
        <div className="flex mb-4 bg-black/20 rounded-md">
          <button
            type="button"
            className={`flex-1 p-3 font-semibold transition ${
              activeTab === 'login' ? 'bg-blue-600 text-white rounded-md' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`flex-1 p-3 font-semibold transition ${
              activeTab === 'register' ? 'bg-blue-600 text-white rounded-md' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-2">
          {activeTab === 'register' && (
            <input
              type="text"
              placeholder="Nome completo"
              className="w-full p-3 rounded bg-white/5 mb-3"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              required
            />
          )}
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            className="w-full p-3 rounded bg-white/5 mb-3"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            className="w-full p-3 rounded bg-white/5 mb-3"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded p-3 font-semibold"
            type="submit"
            disabled={loading}
          >
            {loading
              ? (activeTab === 'login' ? 'Entrando...' : 'Cadastrando...')
              : (activeTab === 'login' ? 'Entrar' : 'Criar minha conta')}
          </button>
        </form>

        <div className="relative text-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative px-2 bg-[#11182B] text-sm text-gray-400">ou</span>
        </div>

        <div className="p-6 pt-0">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="flex items-center justify-center gap-3 w-full bg-white/10 p-3 rounded hover:bg-white/20 transition-all"
            disabled={loading}
          >
            <FaGoogle />
            Continuar com Google
          </button>
        </div>
      </div>
    </div>
  );
}
