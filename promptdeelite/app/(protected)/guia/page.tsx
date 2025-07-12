// app/(protected)/guia/page.tsx (VERSÃO "TOUR GUIADO")

'use client';

import Link from 'next/link';
import { FiCompass, FiEdit, FiHeart, FiSearch, FiStar } from 'react-icons/fi';

export default function GuiaPage() {
  const tourSteps = [
    {
      icon: FiCompass,
      title: 'Explore as Categorias no Dashboard',
      description: 'Navegue pelas nossas prateleiras de prompts para descobrir ferramentas organizadas por grandes áreas de atuação. É o melhor ponto de partida.',
      cta: 'Ir para a Biblioteca',
      href: '/dashboard'
    },
    {
      icon: FiSearch,
      title: 'Use a Busca e as Tags Clicáveis',
      description: 'Encontrou um prompt útil? Clique em suas tags na página de detalhes para ver outros prompts relacionados. Use a busca no dashboard para encontrar soluções específicas.',
      cta: 'Testar a busca',
      href: '/dashboard?q=produtividade' // Exemplo de link com busca
    },
    {
      icon: FiHeart,
      title: 'Salve Seus Prompts Favoritos',
      description: 'Encontrou um prompt que usa com frequência? Clique no ícone de coração para salvá-lo em sua coleção pessoal de acesso rápido.',
      cta: 'Ver meus Favoritos',
      href: '/favoritos'
    },
    {
      icon: FiEdit,
      title: 'Personalize um Prompt com o Builder',
      description: 'Vá para a página de um prompt e clique em "Personalizar". O PromptBuilder permite que você insira suas informações e gere um prompt sob medida, pronto para copiar.',
      cta: 'Escolher um prompt para personalizar',
      href: '/dashboard' // Leva para a biblioteca para ele escolher um
    },
    {
      icon: FiStar,
      title: 'Domine a Arte da Modificação',
      description: 'O verdadeiro poder está em adaptar os prompts. Entenda a "Anatomia de um Prompt de Elite" e experimente mudar a PERSONA ou o CONTEXTO para obter resultados únicos.',
      cta: 'Ler sobre a Anatomia do Prompt',
      href: '#anatomia' // Link interno para uma seção na mesma página
    }
  ];

  const anatomiaSections = [
    { title: 'PERSONA', description: 'Define QUEM a IA deve ser. É a chave para alterar o tom e o estilo da resposta.' },
    { title: 'OBJETIVO', description: 'Diz à IA O QUE fazer. É a sua meta principal.' },
    { title: 'CONTEXTO', description: 'São OS DADOS que você fornece. Quanto melhor o contexto, mais rica a resposta.' },
    { title: 'DIRETRIZES', description: 'É o PASSO A PASSO que a IA deve seguir. Garante a estrutura.' },
    { title: 'FORMATO', description: 'Define COMO a resposta deve ser apresentada.' }
  ];

  return (
    <div className="text-white max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Seu Tour pela Biblioteca de Elite</h1>
      <p className="text-lg text-gray-400 mb-12">Siga estes passos para extrair o máximo valor da nossa plataforma e transformar a IA em sua maior aliada estratégica.</p>

      {/* Checklist Interativo */}
      <div className="space-y-4 mb-16">
        {tourSteps.map((step, index) => (
          <div key={index} className="bg-[#11182B] p-5 rounded-lg border border-white/10 flex items-start gap-4">
            <div className="text-blue-400 mt-1"><step.icon size={24} /></div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-400 mt-1 mb-3">{step.description}</p>
              <Link href={step.href}>
                <span className="text-blue-400 font-semibold hover:underline">
                  {step.cta} →
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Seção de Anatomia do Prompt */}
      <div id="anatomia" className="pt-8">
        <h2 className="text-3xl font-bold text-center mb-4">A Anatomia de um Prompt de Elite</h2>
        <p className="text-gray-400 text-center mb-8">Entenda os 5 blocos de construção que usamos em todos os nossos prompts.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {anatomiaSections.map((section) => (
            <div key={section.title} className="bg-[#11182B] p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold text-blue-400 mb-2">{section.title}</h3>
              <p className="text-gray-300">{section.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}