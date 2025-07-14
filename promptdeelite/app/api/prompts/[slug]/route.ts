import { NextResponse } from 'next/server';
import firestoreAdmin from '@/lib/firebase-admin';

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params no Next.js 15
    const { slug } = await params;
    const promptId = slug;

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
    const { slug } = await params;
    console.error(`ERRO AO BUSCAR PROMPT ${slug}:`, error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
