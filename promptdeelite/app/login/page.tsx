'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { FaGoogle, FaDesktop, FaMobile, FaChrome, FaFirefox, FaSafari, FaEllipsisV, FaShareSquare } from 'react-icons/fa';
import { useAuth } from '@/app/src/components/context/AuthContext';

function isMobileBrowser() {
  if (typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function getBrowserInfo() {
  if (typeof navigator === 'undefined') return { name: 'Browser', icon: FaChrome };
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) return { name: 'Chrome', icon: FaChrome };
  if (userAgent.includes('firefox')) return { name: 'Firefox', icon: FaFirefox };
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) return { name: 'Safari', icon: FaSafari };
  
  return { name: 'Chrome', icon: FaChrome };
}


export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileGuide, setShowMobileGuide] = useState(false);
  const [browserInfo, setBrowserInfo] = useState({ name: 'Browser', icon: FaChrome });
  
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const mobile = isMobileBrowser();
    const browser = getBrowserInfo();
    
    setIsMobile(mobile);
    setBrowserInfo(browser);
    
    // Sempre mostrar guia se for mobile (independente do ambiente)
    if (mobile) {
      setShowMobileGuide(true);
    }
  }, []);

  // Redirecionamento quando usuário autenticado
  useEffect(() => {
    if (!authLoading && user) {
      console.log('✅ Usuário autenticado, redirecionando...');
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  // Processar redirect result (apenas se não for mobile)
  useEffect(() => {
    if (showMobileGuide) return;
    
    const handleRedirectResult = async () => {
      try {
        console.log('🔄 Verificando redirect result...');
        
        await setPersistence(auth, browserLocalPersistence);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const result = await getRedirectResult(auth);
        
        if (result && result.user) {
          console.log('✅ Redirect bem-sucedido:', result.user.email);
          await processUser(result.user);
          toast.success('Login realizado com sucesso!');
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('💥 Erro no redirect:', error);
        toast.error('Erro ao processar login. Tente novamente.');
      }
    };

    handleRedirectResult();
  }, [showMobileGuide, router]);

  const processUser = async (firebaseUser: any) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || '',
          photo: firebaseUser.photoURL || '',
          plan: 'free',
          monthlyCredits: 3,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Erro ao processar usuário:', error);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      await setPersistence(auth, browserLocalPersistence);
      
      if (!isMobile) {
        // Desktop - usar popup
        try {
          const result = await signInWithPopup(auth, provider);
          await processUser(result.user);
          toast.success('Login realizado com sucesso!');
          router.replace('/dashboard');
        } catch (popupError: any) {
          if (popupError.code === 'auth/popup-blocked') {
            await signInWithRedirect(auth, provider);
          } else {
            throw popupError;
          }
        }
      }
    } catch (error) {
      console.error('💥 Erro no login:', error);
      toast.error('Erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  // Tela premium com guia para modo desktop
  if (showMobileGuide) {
    const BrowserIcon = browserInfo.icon;
    
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2b5c] to-[#0c1c3f] text-white relative overflow-hidden">
        {/* Partículas de fundo (versão mobile otimizada) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40" style={{left: '15%', top: '20%', animationDelay: '0.5s'}}></div>
          <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40" style={{left: '85%', top: '15%', animationDelay: '1.2s'}}></div>
          <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40" style={{left: '25%', top: '75%', animationDelay: '0.8s'}}></div>
          <div className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40" style={{left: '90%', top: '50%', animationDelay: '1.5s'}}></div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes intense-glow {
              0%, 100% { box-shadow: 0 0 20px rgba(56,189,248,0.3), 0 0 40px rgba(56,189,248,0.1);}
              50% { box-shadow: 0 0 30px rgba(56,189,248,0.5), 0 0 60px rgba(56,189,248,0.2);}
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.3); }
              50% { box-shadow: 0 0 25px rgba(34, 197, 94, 0.6); }
            }
            .mega-glow { animation: intense-glow 3s ease-in-out infinite;}
            .float-animation { animation: float 3s ease-in-out infinite;}
            .premium-card { transition: all 0.3s ease;}
            .premium-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(56,189,248,0.2);}
            .step-card { transition: all 0.3s ease; border: 2px solid rgba(56,189,248,0.2);}
            .step-card:hover { border-color: rgba(56,189,248,0.5); transform: translateY(-2px);}
            .pulse-green { animation: pulse-glow 2s ease-in-out infinite;}
          `
        }} />

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-lg">
            
            {/* Header Premium */}
            <div className="text-center mb-8">
              <div className="text-4xl md:text-5xl mb-4 float-animation">🧠</div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent mb-2">
                Prompt de Elite
              </h1>
              <p className="text-gray-300 text-sm md:text-base">
                Acesso Otimizado via Modo Desktop
              </p>
            </div>

            {/* Card Principal */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 premium-card mega-glow">
              
              {/* Ícone e Título */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <FaMobile className="text-2xl text-blue-400" />
                  <span className="text-2xl">→</span>
                  <FaDesktop className="text-2xl text-green-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-yellow-400">
                  Login via Modo Desktop
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Para garantir a melhor experiência e compatibilidade, ative o modo desktop no seu navegador
                </p>
              </div>

              {/* Passo a Passo Específico por Navegador */}
              <div className="space-y-4 mb-6">
                
                {/* Instruções Específicas baseadas no navegador detectado */}
                <div className="step-card bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-xl p-4">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-300 mb-1 flex items-center gap-2">
                        <BrowserIcon className="text-lg" />
                        Acesse o Menu do {browserInfo.name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Instruções específicas por navegador */}
                  <div className="ml-12 text-sm text-gray-300">
                    {browserInfo.name === 'Chrome' && (
                      <div>
                        <p className="mb-2">• Toque nos <FaEllipsisV className="inline mx-1" /> (três pontos) no canto superior direito</p>
                        <p>• Procure por <strong className="text-blue-300">&quot;Versão para computador&quot;</strong> ou <strong className="text-blue-300">&quot;Site para computador&quot;</strong></p>
                      </div>
                    )}
                    {browserInfo.name === 'Safari' && (
                      <div>
                        <p className="mb-2">• Toque no ícone <FaShareSquare className="inline mx-1" /> (compartilhar) na barra de endereço</p>
                        <p>• Ou toque em <strong className="text-blue-300">&quot;aA&quot;</strong> e selecione <strong className="text-blue-300">&quot;Solicitar Site para Computador&quot;</strong></p>
                      </div>
                    )}
                    {browserInfo.name === 'Firefox' && (
                      <div>
                        <p className="mb-2">• Toque nos <FaEllipsisV className="inline mx-1" /> (três pontos) no menu</p>
                        <p>• Marque a opção <strong className="text-blue-300">&quot;Versão para computador&quot;</strong></p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Passo 2 */}
                <div className="step-card bg-gradient-to-r from-purple-900/20 to-purple-800/20 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-300 mb-1">Ative a Opção</h3>
                      <p className="text-gray-400 text-sm">A página será recarregada automaticamente no modo desktop</p>
                    </div>
                    <FaDesktop className="text-2xl text-purple-400" />
                  </div>
                </div>

                {/* Passo 3 */}
                <div className="step-card bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-xl p-4 pulse-green">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-300 mb-1">Faça Login Normalmente</h3>
                      <p className="text-gray-400 text-sm">Clique em &quot;Continuar com Google&quot; e complete o acesso</p>
                    </div>
                    <FaGoogle className="text-2xl text-green-400" />
                  </div>
                </div>
              </div>

              {/* Benefícios */}
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-yellow-400 mb-3 flex items-center">
                  <span className="text-lg mr-2">✨</span>
                  Vantagens do Modo Desktop
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✅</span>
                    <span className="text-gray-300">Experiência mais fluida e responsiva</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✅</span>
                    <span className="text-gray-300">Compatibilidade total com autenticação Google</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✅</span>
                    <span className="text-gray-300">Interface otimizada para produtividade</span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowMobileGuide(false);
                    toast.success('Modo desktop ativado! Você pode fazer login agora.');
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ✅ Já Ativei o Modo Desktop
                </button>
                
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                >
                  Voltar ao Início
                </button>
              </div>

              {/* Rodapé Informativo */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-gray-500">
                  💡 <strong>Dica:</strong> Após ativar o modo desktop, a página será recarregada automaticamente
                </p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center mt-6">
              <div className="flex justify-center items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>2.847 usuários conectados</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span>4.9/5 experiência</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c1c3f] via-[#1a2b5c] to-[#0c1c3f] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38bdf8] mx-auto mb-4"></div>
          <p className="text-lg">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  // Interface principal de login (Desktop ou Mobile em modo desktop)
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0c1c3f] via-[#1a2b5c] to-[#0c1c3f] text-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes intense-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(56,189,248,0.3), 0 0 40px rgba(56,189,248,0.1);}
            50% { box-shadow: 0 0 30px rgba(56,189,248,0.5), 0 0 60px rgba(56,189,248,0.2);}
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .mega-glow { animation: intense-glow 3s ease-in-out infinite;}
          .float-animation { animation: float 3s ease-in-out infinite;}
          .premium-card { transition: all 0.3s ease;}
          .premium-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(56,189,248,0.2);}
          .cta-button { position: relative; overflow: hidden;}
          .cta-button:before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); transition: left 0.5s;}
          .cta-button:hover:before { left: 100%;}
        `
      }} />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-8">
            <div className="text-4xl md:text-5xl mb-4 float-animation">🧠</div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#2477e0] bg-clip-text text-transparent mb-2">
              Prompt de Elite
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Sua Central de Inteligência Estratégica
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 premium-card mega-glow">
            
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Acesse sua conta
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Entre para continuar sua jornada de domínio da IA
              </p>
            </div>

            <button
              onClick={loginWithGoogle}
              disabled={loading}
              className="cta-button w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  <span>Conectando...</span>
                </>
              ) : (
                <>
                  <FaGoogle className="text-xl" />
                  <span>Continuar com Google</span>
                </>
              )}
            </button>

            {/* Indicador de modo desktop */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 text-xs text-green-500 bg-green-900/20 px-3 py-1 rounded-full">
                <FaDesktop />
                <span>Modo Desktop Ativo</span>
                <span className="text-green-400">✅</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Acesso instantâneo à biblioteca completa</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Prompts exclusivos e atualizados</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Diagnóstico personalizado de IA</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <span>🔒</span>
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>⚡</span>
                  <span>Acesso Imediato</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🎯</span>
                  <span>Sem Spam</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-xs text-gray-500">
              Ao continuar, você concorda com nossos{' '}
              <a href="#" className="text-[#38bdf8] hover:underline">Termos de Uso</a>
              {' '}e{' '}
              <a href="#" className="text-[#38bdf8] hover:underline">Política de Privacidade</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
