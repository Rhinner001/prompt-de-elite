import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { adminApp, adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const auth = getAuth(adminApp)
    const decodedToken = await auth.verifyIdToken(token)
    const userId = decodedToken.uid

    // Buscar dados do usuário
    const userDoc = await adminDb.collection('users').doc(userId).get()
    
    if (!userDoc.exists) {
      return NextResponse.json({ 
        hasActiveSubscription: false,
        plano: null 
      })
    }

    const userData = userDoc.data()
    const hasActiveSubscription = userData?.planoStatus === 'active'

    return NextResponse.json({
      hasActiveSubscription,
      plano: userData?.planoAtivo || null,
      status: userData?.planoStatus || 'inactive',
      dataAtivacao: userData?.dataAtivacao || null,
    })

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
