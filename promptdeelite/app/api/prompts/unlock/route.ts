import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { adminDb, adminApp } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    // Obter o token do header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]

    // Verificar o token com Firebase Auth
    const auth = getAuth(adminApp)
    const decodedToken = await auth.verifyIdToken(token)
    const userId = decodedToken.uid

    // Seu código de unlock aqui
    const body = await request.json()
    const { promptId } = body

    if (!promptId) {
      return NextResponse.json({ error: 'ID do prompt não fornecido' }, { status: 400 })
    }

    // Atualizar no banco
    await adminDb.collection('user_prompts').doc(`${userId}_${promptId}`).set({
      userId,
      promptId,
      unlockedAt: new Date(),
      isUnlocked: true
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Prompt desbloqueado com sucesso' 
    })

  } catch (error) {
    console.error('Erro ao desbloquear prompt:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
