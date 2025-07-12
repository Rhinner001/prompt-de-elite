// app/api/prompts/route.ts (RECONSTRUÍDO)
import { NextResponse } from 'next/server';
import firestoreAdmin from '../../../lib/firebase-admin';

export async function GET() {
  try {
    const promptsSnapshot = await firestoreAdmin.collection('prompts').orderBy('createdAt', 'desc').get();
    const prompts = promptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(prompts);
  } catch (error) {
    console.error("ERRO NA API /prompts:", error);
    return new NextResponse('Erro interno do servidor.', { status: 500 });
  }
}