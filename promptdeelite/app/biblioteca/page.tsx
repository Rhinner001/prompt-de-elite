// app/biblioteca/[slug]/page.tsx (VERSÃO FINAL E CORRETA)

import type { Prompt } from '@/types';
import PromptDetailView from '@/app/components/PromptDetailView';

// Função para buscar os dados de um único prompt
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

// A função agora recebe 'slug' dos params, correspondendo ao nome da pasta [slug]
export default async function PromptDetailPage({ params }: { params: { slug: string } }) {
  const prompt = await getPrompt(params.slug);

  if (!prompt) {
    return (
      <div className="min-h-screen bg-[#0B0F1C] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Erro</h1>
          <p className="text-gray-400 mt-2">Ocorreu um erro ao buscar o prompt.</p>
          <a href="/dashboard" className="text-blue-500 hover:underline mt-4 inline-block">
            Voltar para a Biblioteca
          </a>
        </div>
      </div>
    );
  }

  return <PromptDetailView prompt={prompt} />;
}