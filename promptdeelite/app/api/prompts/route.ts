import { NextResponse } from 'next/server';
import firestoreAdmin from '../../../lib/firebase-admin';

export async function GET() {
  try {
    console.log('🔍 Executando GET /api/prompts...');
    
    const promptsSnapshot = await firestoreAdmin
      .collection('prompts')
      .orderBy('createdAt', 'desc')
      .get();
    
    const prompts = promptsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`✅ Encontrados ${prompts.length} prompts`);
    return NextResponse.json(prompts);
    
  } catch (error) {
    console.error("❌ ERRO NA API /prompts:", error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
}
