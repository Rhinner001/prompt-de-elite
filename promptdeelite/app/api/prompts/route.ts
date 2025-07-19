import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import firestoreAdmin from '@/lib/firebase-admin';

// Libera um prompt para o usuário, consumindo 1 crédito
export async function POST(req: NextRequest) {
  try {
    // 1. Validar autenticação via token JWT do Firebase
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

    // 2. Obter ID do prompt do body
    const { promptId } = await req.json();
    if (!promptId) {
      return NextResponse.json({ error: 'ID do prompt não fornecido.' }, { status: 400 });
    }

    // 3. Buscar dados do usuário
    const userRef = firestoreAdmin.collection('users').doc(userId);
    const userSnap = await userRef.get();
    const userData = userSnap.data();
    if (!userData) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    // 4. Validar créditos
    const plan = userData.plan || 'free';
    const monthlyCredits = typeof userData.monthlyCredits === 'number' ? userData.monthlyCredits : 1;
    const creditsUsed = typeof userData.creditsUsed === 'number' ? userData.creditsUsed : 0;
    const alreadyUnlocked: string[] = Array.isArray(userData.unlockedPrompts) ? userData.unlockedPrompts : [];

    // Elite tem créditos ilimitados
    if (plan === 'elite' || userData.subscriptionStatus === 'active') {
      // Salva prompt desbloqueado se ainda não tiver
      if (!alreadyUnlocked.includes(promptId)) {
        await userRef.update({
          unlockedPrompts: [...alreadyUnlocked, promptId],
          updatedAt: new Date().toISOString()
        });
      }
      return NextResponse.json({ success: true, unlocked: true, elite: true });
    }

    // Checar se já desbloqueou esse prompt
    if (alreadyUnlocked.includes(promptId)) {
      return NextResponse.json({ success: true, unlocked: true, elite: false });
    }

    // Checar créditos restantes
    if ((monthlyCredits - creditsUsed) <= 0) {
      return NextResponse.json({ error: 'Sem créditos disponíveis.' }, { status: 402 });
    }

    // 5. Atualizar usuário: consumir 1 crédito e salvar prompt desbloqueado
    await userRef.update({
      creditsUsed: creditsUsed + 1,
      unlockedPrompts: [...alreadyUnlocked, promptId],
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, unlocked: true, elite: false });

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ Erro ao desbloquear prompt:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
