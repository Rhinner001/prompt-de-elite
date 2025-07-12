'use client';
import { useState } from 'react';
import { useAuth } from '@/app/src/components/context/AuthContext';
import type { Prompt } from '@/types';

interface UnlockPromptModalProps {
  prompt: Prompt;
  onClose: () => void;
  onUnlockSuccess: (promptId: string) => void;
}

export default function UnlockPromptModal({ prompt, onClose, onUnlockSuccess }: UnlockPromptModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    if (!user) return;
    setIsLoading(true);
    setError('');

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/prompts/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ promptId: prompt.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Falha ao desbloquear o prompt.');
      }
      onUnlockSuccess(prompt.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#11182B] rounded-lg p-8 w-full max-w-md border border-white/10 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Desbloquear Prompt</h2>
        <p className="text-gray-300 mb-6">Você está prestes a usar seu crédito mensal para desbloquear: <strong className="text-white">{prompt.title}</strong></p>
        
        <div className="flex flex-col gap-3">
          <button onClick={handleUnlock} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Desbloqueando...' : 'Usar 1 Crédito e Desbloquear'}
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">Cancelar</button>
        </div>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}