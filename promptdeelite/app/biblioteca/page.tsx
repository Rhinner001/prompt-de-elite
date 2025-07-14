import type { Prompt } from '@/types';
import Link from 'next/link';

// Força renderização dinâmica para evitar problemas de build
export const dynamic = 'force-dynamic';

async function getPrompts(): Promise<Prompt[]> {
  try {
    // Durante o build, não faz fetch
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_APP_URL) {
      return [];
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/prompts`, {
      cache: 'no-store', // Força dados frescos
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      console.error(`Erro HTTP: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar prompts:', error);
    return [];
  }
}

export default async function BibliotecaPage() {
  const prompts = await getPrompts();

  return (
    <div className="min-h-screen bg-[#0B0F1C] text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Voltar ao Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-6">Biblioteca de Prompts</h1>
          <p className="text-gray-400 mt-2">Explore nossa coleção completa de prompts profissionais</p>
        </div>
        
        {prompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-[#11182B] rounded-lg p-8 border border-white/10">
              <h2 className="text-xl font-semibold mb-2">Nenhum prompt encontrado</h2>
              <p className="text-gray-400">Os prompts serão carregados em breve.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="bg-[#11182B] p-6 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {prompt.category}
                  </span>
                  <span className={`ml-2 text-xs font-bold py-1 px-2 rounded-full ${
                    prompt.level === 'Iniciante' ? 'bg-green-800 text-green-200' : 
                    prompt.level === 'Intermediário' ? 'bg-yellow-800 text-yellow-200' : 
                    'bg-red-800 text-red-200'
                  }`}>
                    {prompt.level}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold mb-2">{prompt.title}</h2>
                <p className="text-gray-300 mb-4 line-clamp-3">{prompt.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags?.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                    {prompt.tags && prompt.tags.length > 2 && (
                      <span className="text-xs text-gray-400">+{prompt.tags.length - 2}</span>
                    )}
                  </div>
                  
                  <Link 
                    href={`/biblioteca/${prompt.id}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Ver detalhes →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Biblioteca de Prompts - Prompt de Elite',
  description: 'Explore nossa coleção completa de prompts profissionais para IA',
};
