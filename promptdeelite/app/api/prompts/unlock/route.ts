// app/api/prompts/unlock/route.ts (VERSÃO FINAL E ROBUSTA)

import { NextResponse } from 'next/server';
import firestoreAdmin from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const headersList = headers();
  const authorization = (await headersList).get('authorization');

  // Validação inicial do header
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Acesso não autorizado. Token de autenticação ausente ou mal formatado.' }, { status: 401 });
  }

  const token = authorization.split('Bearer ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Token de autenticação inválido.' }, { status: 401 });
  }
  
  try {
    const { promptId } = await request.json();
    if (!promptId) {
      return NextResponse.json({ error: 'ID do prompt não fornecido.' }, { status: 400 });
    }
    
    // Verificamos o token e obtemos o usuário
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const userDocRef = firestoreAdmin.collection('users').doc(userId);
    const unlockedPromptRef = userDocRef.collection('unlockedPrompts').doc(promptId);

    // Executamos a transação segura no Firestore
    await firestoreAdmin.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userDocRef);

      if (!userDoc.exists) {
        throw new Error('Usuário não encontrado no Firestore.');
      }
      
      const unlockedDoc = await transaction.get(unlockedPromptRef);
      if(unlockedDoc.exists) {
          throw new Error('Este prompt já foi desbloqueado.');
      }

      const userData = userDoc.data();
      const currentCredits = userData?.monthlyCredits || 0;

      if (currentCredits < 1) {
        throw new Error('Créditos mensais insuficientes.');
      }

      // Se tudo estiver certo, realizamos as operações
      transaction.update(userDocRef, { monthlyCredits: currentCredits - 1 });
      transaction.set(unlockedPromptRef, { unlockedAt: new Date() });
    });

    // Se a transação foi concluída com sucesso
    return NextResponse.json({ success: true, message: 'Prompt desbloqueado com sucesso!' });

  } catch (error: any) {
    // Logamos o erro no servidor para depuração
    console.error("ERRO DETALHADO NA API DE DESBLOQUEIO:", error);

    // Verificamos se o erro é do Firebase ou um erro que nós criamos (com 'message')
    const errorMessage = error.message || 'Um erro inesperado ocorreu.';
    
    let statusCode = 500;
    if (errorMessage.includes('insuficientes') || errorMessage.includes('já foi desbloqueado')) {
        statusCode = 403; // Forbidden
    } else if (error.code === 'auth/id-token-expired') {
        statusCode = 401; // Unauthorized
    }
    
    // Garantimos que sempre retornamos um JSON válido
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}