// app/api/prompts/track-access/route.ts (NOVO ARQUIVO)
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import firestoreAdmin from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
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

    const { promptId } = await req.json();
    if (!promptId) {
      return NextResponse.json({ error: 'ID do prompt não fornecido.' }, { status: 400 });
    }

    // Registrar acesso na subcoleção
    const accessRef = firestoreAdmin
      .collection('users')
      .doc(userId)
      .collection('accessedPrompts')
      .doc(promptId);

    await accessRef.set({
      promptId,
      accessedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    }, { merge: true });

    // Também atualizar no documento principal do usuário
    const userRef = firestoreAdmin.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    
    const accessedPrompts = userData?.accessedPrompts || [];
    if (!accessedPrompts.includes(promptId)) {
      await userRef.update({
        accessedPrompts: [...accessedPrompts, promptId],
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Erro ao registrar acesso:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
