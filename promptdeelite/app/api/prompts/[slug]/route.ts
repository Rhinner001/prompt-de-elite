// app/api/prompts/[slug]/route.ts (VERSÃO FINAL E SIMPLIFICADA)

import { NextResponse } from 'next/server';
import firestoreAdmin from '@/lib/firebase-admin';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    // O slug agora É o ID do prompt, sem necessidade de manipulação.
    const promptId = params.slug;

    if (!promptId) {
      return NextResponse.json({ error: 'ID do prompt não fornecido.' }, { status: 400 });
    }
    
    const docRef = firestoreAdmin.collection('prompts').doc(promptId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: `Prompt com ID ${promptId} não encontrado.` }, { status: 404 });
    }

    const data = docSnap.data()!;
    const createdAt = data.createdAt?._seconds || null;
    const prompt = { id: docSnap.id, ...data, createdAt };
    
    return NextResponse.json(prompt);
  } catch (error) {
    console.error(`ERRO AO BUSCAR PROMPT ${params.slug}:`, error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}