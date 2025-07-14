// app/components/PromptDetailView.tsx (CÓDIGO COMPLETO)

'use client';

import { useState } from 'react';
import type { Prompt } from '@/types';
import PromptBuilderModal from './PromptBuilderModal';
import Link from 'next/link';

interface PromptDetailViewProps {
  prompt: Prompt;
}

export default function PromptDetailView({ prompt }: PromptDetailViewProps) {
  const [copyText, setCopyText] = useState('Copiar Prompt');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt_template);
    setCopyText('✅ Copiado!');
    setTimeout(() => { setCopyText('Copiar Prompt'); }, 2000);
  };

  return (
    <>
      <main className="container mx-auto px-4 py-10 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Seção Superior */}
          <div>
           <Link href="/biblioteca" className="text-blue-400 hover:text-blue-300 transition-colors">
  ← Voltar para a Biblioteca
</Link>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">{prompt.category}</p>
            <h1 className="text-4xl font-bold text-white">{prompt.title}</h1>
            <p className="text-lg text-gray-300 mt-2">{prompt.description}</p>
          </div>

          <hr className="my-8 border-white/10" />

          {/* Seção do Template */}
          <div className="bg-[#11182B] rounded-lg p-6 border border-white/10">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h2 className="text-xl font-semibold">Template do Prompt</h2>
              <div className="flex items-center gap-3">
                {prompt.fields && prompt.fields.length > 0 && (
                  <button onClick={() => setIsBuilderOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all">
                    Personalizar
                  </button>
                )}
                <button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all">
                  {copyText}
                </button>
              </div>
            </div>
            <pre className="bg-black/20 p-4 rounded-md text-gray-200 whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {prompt.prompt_template}
            </pre>
          </div>

          {/* Seção Ficha Técnica */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Ficha Técnica</h3>
            <div className="bg-[#11182B] p-6 rounded-lg border border-white/10 space-y-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400">Nível:</span>
                  <span className={`text-xs font-bold py-1 px-3 rounded-full ${prompt.level === 'Iniciante' ? 'bg-green-800 text-green-200' : prompt.level === 'Intermediário' ? 'bg-yellow-800 text-yellow-200' : 'bg-red-800 text-red-200'}`}>{prompt.level}</span>
                </div>
                <div className="flex items-center gap-2"><span className="font-bold text-gray-400">Versão:</span><span className="text-gray-300">{prompt.version}</span></div>
              </div>
              <div><span className="font-bold text-gray-400 text-sm">Caso de Uso Principal:</span><p className="text-gray-300 text-sm mt-1">{prompt.use_case}</p></div>
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="pt-4 border-t border-white/20">
                  <span className="font-bold text-gray-400 text-sm">Tags Relacionadas:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {prompt.tags.map(tag => (
                      <Link key={tag} href={`/dashboard?q=${encodeURIComponent(tag)}`} className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-600/40 transition-colors">#{tag}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* <<< NOVA SEÇÃO DE DICAS DE ELITE >>> */}
          <div className="mt-8">
            <details className="bg-transparent rounded-lg border border-white/10 overflow-hidden group">
              <summary className="p-4 cursor-pointer text-lg font-semibold flex justify-between items-center list-none hover:bg-white/5 transition-colors">
                <span>💡 Dicas de Elite para este Prompt</span>
                <span className="text-xl transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <div className="p-4 border-t border-white/10 bg-[#11182B]">
                <p className="text-gray-300 leading-relaxed">
                  Para obter resultados ainda mais personalizados, tente modificar o campo <strong className="text-white">PERSONA</strong> no template. 
                  A mudança na persona é a alavanca mais poderosa para alterar o estilo e o foco da resposta da IA.
                  <br/><br/>
                  Outra dica é ser <strong className="text-white">extremamente específico</strong> nos campos de CONTEXTO. Quanto mais detalhes você fornecer, mais a IA terá material para criar uma resposta única para você.
                </p>
              </div>
            </details>
          </div>

        </div>
      </main>

      {isBuilderOpen && (
        <PromptBuilderModal prompt={prompt} onClose={() => setIsBuilderOpen(false)} />
      )}
    </>
  );
}