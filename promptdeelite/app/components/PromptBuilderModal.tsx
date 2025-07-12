// app/components/PromptBuilderModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Prompt, PromptField } from '@/types';

interface PromptBuilderModalProps {
  prompt: Prompt;
  onClose: () => void;
}

export default function PromptBuilderModal({ prompt, onClose }: PromptBuilderModalProps) {
  const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Gerar e Copiar');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setGeneratedPrompt(prompt.prompt_template);
  }, [prompt.prompt_template]);

  useEffect(() => {
    if (!prompt.fields || prompt.fields.length === 0) {
      return;
    }

    let newPrompt = prompt.prompt_template;

    prompt.fields.forEach(field => {
      if (field && field.name) {
        const userValue = fieldValues[field.name];
        const placeholder = `[${field.name.toUpperCase()}]`;
        
        if (userValue) {
          const regex = new RegExp(placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
          newPrompt = newPrompt.replace(regex, userValue);
        }
      }
    });

    setGeneratedPrompt(newPrompt);
  }, [fieldValues, prompt]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleGenerateAndCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopyButtonText('✅ Copiado!');
    setTimeout(() => {
      setCopyButtonText('Gerar e Copiar');
    }, 2000);
  };

  if (!isMounted) {
    return null;
  }
  
  const modalContent = (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#11182B] rounded-lg p-8 w-full max-w-2xl border border-white/10 flex flex-col max-h-[90vh]">
        <h2 className="text-2xl font-bold text-white mb-4">PromptBuilder</h2>
        <p className="text-gray-300 mb-6">Preencha os campos abaixo para personalizar seu prompt.</p>
        
        <div className="space-y-4 mb-6 overflow-y-auto pr-2">
          {prompt.fields && prompt.fields.map((field: PromptField) => {
            if (!field || !field.name) return null;
            
            return (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-300 mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.name}
                  value={fieldValues[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full px-4 py-2 rounded bg-[#0B0F1C] border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            );
          })}
        </div>

        <div className="space-y-2 mb-6">
            <h3 className="text-lg font-semibold">Seu Prompt Personalizado:</h3>
            <pre className="bg-black/20 p-4 rounded-md text-gray-200 whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-48 overflow-y-auto">
              {generatedPrompt}
            </pre>
        </div>
        
        <div className="flex justify-end gap-4 mt-auto pt-4 border-t border-white/10">
          <button onClick={onClose} className="text-gray-300 hover:text-white transition">Cancelar</button>
          <button 
            onClick={handleGenerateAndCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition-all"
          >
            {copyButtonText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(
    modalContent,
    document.getElementById('modal-root') as HTMLElement
  );
}