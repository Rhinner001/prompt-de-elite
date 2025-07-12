'use client';

import { useState } from 'react';
import { enviarFeedback } from '@/lib/feedback';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  promptId: string;
  userId: string | null;
}

export default function FeedbackModal({ open, onClose, promptId, userId }: FeedbackModalProps) {
  const [motivo, setMotivo] = useState('sugestao');
  const [texto, setTexto] = useState('');
  const [nome, setNome] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      await enviarFeedback({
        promptId,
        userId,
        tipo: 'form',
        motivo,
        texto: texto.trim() + (nome.trim() ? `\n\nNome/Email: ${nome}` : ''),
      });
      setEnviado(true);
      setTexto('');
      setNome('');
    } catch (err) {
      alert('Erro ao enviar feedback.');
    }
    setEnviando(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#171e2e] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-blue-900 relative animate-in fade-in zoom-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
          onClick={onClose}
          title="Fechar"
          type="button"
        >×</button>
        {enviado ? (
          <div className="text-center flex flex-col items-center justify-center min-h-[200px]">
            <span className="text-green-400 text-2xl mb-2">🎉</span>
            <div className="text-lg font-semibold mb-1">Feedback enviado!</div>
            <p className="text-gray-300 text-sm">Obrigado por ajudar a melhorar o Prompt de Elite!</p>
            <button className="mt-6 px-5 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800" onClick={onClose}>Fechar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-blue-200 mb-2">Deixe seu feedback</h2>
            <label className="flex flex-col gap-1 text-sm text-blue-100 font-medium">
              Motivo
              <select
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                className="rounded-lg px-3 py-2 bg-[#222940] text-white border border-blue-800 outline-none"
                required
              >
                <option value="sugestao">Sugestão de novo prompt</option>
                <option value="relato">Relato de resultado</option>
                <option value="bug">Bug ou problema</option>
                <option value="outro">Outro</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-blue-100 font-medium">
              Detalhe sua sugestão, resultado ou problema
              <textarea
                className="rounded-lg px-3 py-2 bg-[#222940] text-white border border-blue-800 outline-none min-h-[80px]"
                value={texto}
                onChange={e => setTexto(e.target.value)}
                required
                placeholder="Descreva aqui sua sugestão, resultado ou dificuldade..."
                maxLength={800}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-gray-400">
              Nome ou email (opcional)
              <input
                className="rounded-lg px-3 py-2 bg-[#222940] text-white border border-blue-800 outline-none"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="(opcional)"
                maxLength={60}
              />
            </label>
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-5 py-2 font-bold disabled:opacity-50 mt-2"
              disabled={enviando || !texto.trim()}
            >
              {enviando ? "Enviando..." : "Enviar feedback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
