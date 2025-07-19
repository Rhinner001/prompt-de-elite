// app/api/prompts/unlock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import firestoreAdmin from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticação
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    let decoded;
    try {
      decoded = await getAuth().verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Token inválido.' }, { status: 401 });
    }
    const userId = decoded.uid;

    // 2. Pega o promptId do body
    const { promptId } = await req.json();
    if (!promptId) {
      return NextResponse.json({ error: 'ID do prompt não fornecido.' }, { status: 400 });
    }

    // 3. Busca dados atuais do usuário COM TRANSAÇÃO
    const userRef = firestoreAdmin.collection('users').doc(userId);
    
    // USAR TRANSAÇÃO PARA EVITAR CONDIÇÕES DE CORRIDA
    const result = await firestoreAdmin.runTransaction(async (transaction) => {
      const userSnap = await transaction.get(userRef);
      const userData = userSnap.data();
      
      if (!userData) {
        throw new Error('Usuário não encontrado.');
      }

      // 4. Verificar dados atuais
      const unlocked: string[] = Array.isArray(userData.unlockedPrompts)
        ? userData.unlockedPrompts
        : [];

      const plan = userData.plan || 'free';
      const monthlyCredits = typeof userData.monthlyCredits === 'number' ? userData.monthlyCredits : 1;
      const creditsUsed = typeof userData.creditsUsed === 'number' ? userData.creditsUsed : 0;

      // Verificar se já foi desbloqueado
      if (unlocked.includes(promptId)) {
        return { success: true, unlocked: true, alreadyUnlocked: true };
      }

      // Elite: ilimitado
      if (plan === 'elite' || userData.subscriptionStatus === 'active') {
        // Atualizar documento principal
        transaction.update(userRef, {
          unlockedPrompts: [...unlocked, promptId],
          updatedAt: new Date().toISOString(),
        });
        
        // Atualizar subcoleção
        const subCollectionRef = userRef.collection('unlockedPrompts').doc(promptId);
        transaction.set(subCollectionRef, {
          unlockedAt: new Date().toISOString(),
          promptId: promptId
        });
        
        return { success: true, unlocked: true, elite: true };
      }

      // Free: verificar créditos RIGOROSAMENTE
      const creditsRemaining = monthlyCredits - creditsUsed;
      console.log(`🔍 Verificação de créditos para ${userId}:`, {
        monthlyCredits,
        creditsUsed,
        creditsRemaining,
        promptId
      });

      if (creditsRemaining <= 0) {
        throw new Error('Sem créditos disponíveis para este mês.');
      }

      // Atualizar com novo crédito usado
      const newCreditsUsed = creditsUsed + 1;
      
      transaction.update(userRef, {
        unlockedPrompts: [...unlocked, promptId],
        creditsUsed: newCreditsUsed,
        updatedAt: new Date().toISOString(),
      });

      // Atualizar subcoleção
      const subCollectionRef = userRef.collection('unlockedPrompts').doc(promptId);
      transaction.set(subCollectionRef, {
        unlockedAt: new Date().toISOString(),
        promptId: promptId,
        creditsUsed: true
      });

      return { 
        success: true, 
        unlocked: true, 
        elite: false, 
        newCreditsUsed,
        creditsRemaining: monthlyCredits - newCreditsUsed 
      };
    });

    return NextResponse.json(result);
    
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ Erro ao desbloquear prompt:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
