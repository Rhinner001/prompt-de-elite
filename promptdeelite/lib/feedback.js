import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Salva um feedback no Firestore para o prompt informado.
 * Pode ser tipo 'like', 'dislike' ou 'form'.
 * @param {Object} params - Parâmetros da função
 * @param {string} params.promptId - ID do prompt
 * @param {string|null} params.userId - ID do usuário (pode ser null)
 * @param {'like'|'dislike'|'form'} params.tipo - Tipo de feedback
 * @param {string} [params.motivo] - Motivo do feedback (opcional, para 'form')
 * @param {string} [params.texto] - Texto do feedback (opcional, para 'form')
 * @returns {Promise<string>} ID do documento salvo
 */
export async function enviarFeedback({ promptId, userId, tipo, motivo, texto }) {
  try {
    const docRef = await addDoc(collection(db, 'feedbacks'), {
      promptId,
      userId: userId || null,
      tipo, // 'like', 'dislike' ou 'form'
      motivo: motivo || null,
      texto: texto || null,
      criadoEm: serverTimestamp()
    });
    console.log('[enviarFeedback] Feedback registrado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[enviarFeedback] Erro ao registrar feedback:', error);
    throw error;
  }
}
