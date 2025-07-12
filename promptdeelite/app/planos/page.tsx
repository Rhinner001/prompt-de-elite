'use client';

import Link from 'next/link';
import { FaCrown, FaCheckCircle, FaLock, FaBolt } from 'react-icons/fa';
import { useAuth } from '@/app/src/components/context/AuthContext';

export default function PlanosPage() {
  const { appUser } = useAuth();

  // Se já for elite, pode exibir um aviso ou direcionar para dashboard
  const isElite = appUser?.plan === 'elite';

  return (
    <div className="min-h-screen bg-[#101629] py-10 px-4 flex flex-col items-center">
      <div className="max-w-3xl w-full text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Escolha seu Plano</h1>
        <p className="text-lg text-gray-300 mb-2">
          Experimente grátis, ou desbloqueie tudo no <span className="text-yellow-400 font-semibold">Plano Elite</span>.
        </p>
        <span className="inline-block bg-yellow-900/30 text-yellow-400 px-4 py-1 rounded-full font-medium text-xs">
          Oferta especial de lançamento — Vitalício disponível!
        </span>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 mb-8">
        {/* PLANO GRATUITO */}
        <div className="flex-1 bg-[#151C34] border border-white/10 rounded-2xl p-7 flex flex-col shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <FaLock className="text-gray-400 text-xl" />
            <span className="font-bold text-lg text-gray-100">Plano Gratuito</span>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">R$0 <span className="text-base font-medium text-gray-400">/mês</span></div>
          <ul className="text-sm text-gray-300 mt-4 space-y-2 flex-1">
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" /> Acesso limitado à biblioteca
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" /> Créditos mensais para desbloquear prompts
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" /> Teste os melhores prompts da atualidade
            </li>
          </ul>
          <button
            disabled
            className="mt-7 px-6 py-2 rounded-lg bg-gray-700/50 text-gray-400 font-bold cursor-not-allowed border border-gray-700 w-full"
          >
            Seu plano atual
          </button>
        </div>

        {/* PLANO ELITE */}
        <div className="flex-1 bg-gradient-to-tr from-yellow-400/20 via-blue-900/30 to-[#151C34] border-2 border-yellow-400 rounded-2xl p-7 flex flex-col shadow-2xl scale-105">
          <div className="flex items-center gap-2 mb-3">
            <FaCrown className="text-yellow-300 text-xl" />
            <span className="font-bold text-lg text-yellow-200">Plano Elite</span>
          </div>
          <div className="text-3xl font-extrabold text-yellow-400 mb-1">
            R$19,90 <span className="text-base font-medium text-yellow-200">/mês</span>
          </div>
          <div className="text-xs text-yellow-400 mb-3 font-semibold">ou Vitalício por R$97,00*</div>
          <ul className="text-sm text-yellow-100 mt-4 space-y-2 flex-1">
            <li className="flex items-center gap-2">
              <FaBolt className="text-yellow-300" /> Acesso ILIMITADO a todos os prompts
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-yellow-300" /> Novos prompts premium em primeira mão
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-yellow-300" /> Acesso vitalício à evolução da biblioteca
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-yellow-300" /> Suporte prioritário e vantagens de fundador
            </li>
          </ul>
          <Link
            href={isElite ? '/dashboard' : '/checkout'} // Troque para sua rota de checkout real!
            className={`mt-7 px-6 py-3 rounded-lg bg-yellow-400 text-black font-bold w-full text-lg shadow-lg border-2 border-yellow-500 hover:bg-yellow-300 transition 
              ${isElite ? 'pointer-events-none opacity-60' : ''}`}
          >
            {isElite ? 'Você já é Elite 🚀' : 'Quero ser Elite!'}
          </Link>
          <div className="mt-3 text-xs text-yellow-100 text-center">
            *Oferta vitalícia limitada para membros fundadores.
          </div>
        </div>
      </div>

      <div className="max-w-2xl w-full text-center mt-8 text-xs text-gray-400">
        O <span className="font-bold text-yellow-400">Plano Elite</span> é para quem quer <span className="font-semibold text-white">acesso total</span> e garantir participação no futuro da biblioteca.
        <br />
        Dúvidas? <a href="mailto:suporte@promptdeelite.com" className="underline hover:text-yellow-300">Fale com o suporte</a>
      </div>
    </div>
  );
}
