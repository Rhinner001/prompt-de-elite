// app/biblioteca/[slug]/page.tsx
import type { Prompt } from '@/types';
import PromptDetailView from '@/app/components/PromptDetailView';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getPrompt(slug: string): Promise<Prompt | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/prompts/${slug}`;

    const res = await fetch(apiUrl, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      console.error(`Erro HTTP: ${res.status} - ${res.statusText}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Falha ao buscar prompt:", error);
    return null;
  }
}

async function PromptDetailPageContent({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const prompt = await getPrompt(slug);

  if (!prompt) {
    return (
      <div className="min-h-screen bg-[#0B0F1C] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Prompt não encontrado</h1>
          <p className="text-gray-400 mt-2">
            O prompt solicitado não existe ou ocorreu um erro.
          </p>
          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 mt-4 inline-block font-medium"
          >
            ← Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <PromptDetailView prompt={prompt} />;
}

export default function PromptDetailPage(props: any) {
  return (
 
      <PromptDetailPageContent {...props} />
  
  );
}
