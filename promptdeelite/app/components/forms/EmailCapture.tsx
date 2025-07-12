'use client';

import { useState } from 'react';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(''); // ✅ ADICIONAR ESTA LINHA

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.includes('@')) {
      setError('Email inválido'); // ✅ AGORA FUNCIONA
      return;
    }
    
    // Lógica de envio...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="text-red-400">{error}</p>}
      <button type="submit">Enviar</button>
    </form>
  );
}
