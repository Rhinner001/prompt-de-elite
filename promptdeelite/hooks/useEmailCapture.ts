'use client';

import { useState, useCallback } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useEmailCapture = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureEmail = useCallback(async (email: string, source: string = 'captacao-central') => {
    setLoading(true);
    setError(null);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('O formato do e-mail é inválido. Por favor, verifique.');
      }

      const docRef = await addDoc(collection(db, 'leads'), {
        email,
        source,
        timestamp: serverTimestamp(),
        status: 'new'
      });

      await triggerAutomation(email, source);

      setSuccess(true);
      return { success: true, id: docRef.id };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao capturar e-mail. Tente novamente.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array, as 'db' is constant and imported

  const triggerAutomation = async (email: string, source: string) => {
    console.log(`[Automação] E-mail capturado: ${email}, Fonte: ${source}. Disparando fluxo de boas-vindas...`);
  };

  const resetState = useCallback(() => {
    setSuccess(false);
    setError(null);
  }, []); // Empty dependency array for resetState

  return {
    captureEmail,
    loading,
    success,
    error,
    resetState
  };
};