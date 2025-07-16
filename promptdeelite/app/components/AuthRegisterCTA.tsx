'use client';
import { useRouter } from 'next/navigation';

export default function AuthRegisterCTA() {
  const router = useRouter();

  const goToRegister = () => router.push('/auth/register');

  return (
    <div className="bg-gradient-to-r from-[#38bdf8]/80 to-[#2477e0]/80 border border-[#38bdf8]/30 rounded-2xl p-6 sm:p-10 text-center shadow-2xl mt-8 sm:mt-12 mb-8 sm:mb-12 max-w-xl mx-auto">
      <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1 mb-4 animate-pulse">
        <span className="text-green-400 font-bold text-xs sm:text-sm">Acesso 100% Gratuito</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3">
        🔐 Acesse todo o conteúdo premium
      </h2>
      <p className="text-base sm:text-lg text-blue-100 mb-6">
        Faça seu cadastro gratuito para desbloquear o quiz inteligente, checklist de elite e o eBook premium. Nenhum cartão é necessário.
      </p>
      <button
        onClick={goToRegister}
        className="w-full bg-gradient-to-r from-[#2477e0] to-[#38bdf8] hover:from-[#1b5fc7] hover:to-[#2563eb] text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg sm:text-xl mb-2"
      >
        🚀 Acessar Grátis Agora
      </button>
      <p className="text-xs text-gray-300 mt-2">Sem compromisso. Cancelar a qualquer momento.</p>
    </div>
  );
}
