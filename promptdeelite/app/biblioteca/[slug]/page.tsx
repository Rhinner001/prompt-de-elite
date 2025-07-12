// app/biblioteca/[slug]/page.tsx (VERSÃO FINAL E CORRETA)

import type { Prompt } from '@/types';
// Importamos nosso novo componente de cliente
import PromptDetailClient from '@/app/components/PromptDetailClient';

// A função de busca de dados permanece a mesma
async function getPrompt(slug: string): Promise<Prompt | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/prompts/${slug}`;
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Falha ao buscar prompt:", error);
    return null;
  }
}

// A página agora é um componente de servidor simples e assíncrono
export default async function PromptDetailPage({ params }: { params: { slug: string } }) {
  // 1. Busca os dados
  const prompt = await getPrompt(params.slug);

  // 2. Passa os dados para o componente de cliente renderizar
  return <PromptDetailClient prompt={prompt} />;
}