import type { Prompt } from '@/types';
import PromptDetailView from '@/app/components/PromptDetailView';
import Link from 'next/link'; // ← CORRIGIDO: era lucide-react

// FORÇAR RENDERIZAÇÃO DINÂMICA
export const dynamic = 'force-dynamic'

async function getPrompt(slug: string): Promise<Prompt | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/prompts/${slug}`;
    
    const res = await fetch(apiUrl, { 
      cache: 'no-store', // ← MUDANÇA: cache dinâmico
      headers: {
        'Content-Type': 'application/json',
      }
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

// GERAÇÃO ESTÁTICA MELHORADA
export async function generateStaticParams() {
  // Durante build local, retorna vazio
  if (process.env.NODE_ENV !== 'production') {
    return [];
  }

  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/api/prompts`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return [];
    
    const prompts: Prompt[] = await res.json();
    
    return prompts.slice(0, 10).map((prompt) => ({ // ← LIMITE: primeiros 10
      slug: prompt.id,
    }));
  } catch (error) {
    console.error('Erro ao gerar parâmetros estáticos:', error);
    return [];
  }
}

// COMPONENTE PRINCIPAL - AWAIT PARAMS
export default async function PromptDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> // ← MUDANÇA: Promise
}) {
  const { slug } = await params; // ← AWAIT OBRIGATÓRIO
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
            href="/biblioteca" 
            className="text-blue-400 hover:text-blue-300 mt-4 inline-block font-medium"
          >
            ← Voltar para a Biblioteca
          </Link>
        </div>
      </div>
    );
  }

  return <PromptDetailView prompt={prompt} />;
}

// METADATA - AWAIT PARAMS
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> // ← MUDANÇA: Promise
}) {
  const { slug } = await params; // ← AWAIT OBRIGATÓRIO
  const prompt = await getPrompt(slug);
  
  if (!prompt) {
    return {
      title: 'Prompt não encontrado - Prompt de Elite',
    };
  }
  
  return {
    title: `${prompt.title} - Prompt de Elite`,
    description: prompt.description,
    keywords: prompt.tags?.join(', ') || '',
  };
}
