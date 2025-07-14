import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANOS } from '@/lib/stripe'
import { getAuth } from 'firebase-admin/auth'
import { adminApp } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Checkout API chamada')

    // Verificar autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Token não fornecido')
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    console.log('🔑 Token recebido:', token.substring(0, 20) + '...')

    const auth = getAuth(adminApp)
    const decodedToken = await auth.verifyIdToken(token)
    const userId = decodedToken.uid
    console.log('👤 Usuário autenticado:', userId)

    const body = await request.json()
    const { planoId } = body
    console.log('📦 Plano solicitado:', planoId)

    if (!planoId || !PLANOS[planoId as keyof typeof PLANOS]) {
      console.log('❌ Plano inválido:', planoId)
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    const plano = PLANOS[planoId as keyof typeof PLANOS]
    console.log('✅ Plano encontrado:', plano.name)

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer_email: decodedToken.email,
      client_reference_id: userId,
      metadata: {
        userId,
        planoId,
        planoName: plano.name,
      },
      line_items: [
        {
          price: plano.priceId,
          quantity: 1,
        },
      ],
      mode: plano.type === 'subscription' ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true&plano=${planoId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/planos?canceled=true`,
      automatic_tax: { enabled: false }, // Desabilitar por enquanto
      billing_address_collection: 'required',
      locale: 'pt-BR',
    })

    console.log('✅ Sessão criada:', session.id)

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    })

  } catch (error) {
    console.error('❌ Erro completo:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
