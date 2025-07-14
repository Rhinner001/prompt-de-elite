import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { adminDb } from '@/lib/firebase-admin'
import { headers } from 'next/headers'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('❌ Stripe signature não encontrada')
      return NextResponse.json({ error: 'Signature não encontrada' }, { status: 400 })
    }

    // Verificar webhook
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('❌ Erro na verificação do webhook:', err)
      return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
    }

    console.log('✅ Webhook recebido:', event.type)

    // Processar eventos
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object)
        break

      default:
        console.log(`🔄 Evento não processado: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Erro no webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Processar checkout completado
async function handleCheckoutCompleted(session: any) {
  try {
    const userId = session.client_reference_id
    const planoId = session.metadata?.planoId
    const customerId = session.customer

    if (!userId || !planoId) {
      console.error('❌ Dados insuficientes no checkout:', { userId, planoId })
      return
    }

    // Salvar dados do usuário
    await adminDb.collection('users').doc(userId).set({
      stripeCustomerId: customerId,
      planoAtivo: planoId,
      planoStatus: 'active',
      dataAtivacao: new Date(),
      sessionId: session.id,
    }, { merge: true })

    // Salvar transação
    await adminDb.collection('transactions').add({
      userId,
      planoId,
      sessionId: session.id,
      customerId,
      amount: session.amount_total,
      currency: session.currency,
      status: 'completed',
      createdAt: new Date(),
    })

    console.log('✅ Checkout processado:', { userId, planoId })

  } catch (error) {
    console.error('❌ Erro ao processar checkout:', error)
  }
}

// Processar assinatura criada
async function handleSubscriptionCreated(subscription: any) {
  try {
    const customerId = subscription.customer

    // Buscar usuário pelo customerId
    const userQuery = await adminDb.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .get()

    if (userQuery.empty) {
      console.error('❌ Usuário não encontrado para customerId:', customerId)
      return
    }

    const userDoc = userQuery.docs[0]
    const userId = userDoc.id

    // Atualizar dados da assinatura
    await adminDb.collection('users').doc(userId).update({
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    })

    console.log('✅ Assinatura criada:', { userId, subscriptionId: subscription.id })

  } catch (error) {
    console.error('❌ Erro ao processar assinatura:', error)
  }
}

// Processar assinatura cancelada
async function handleSubscriptionDeleted(subscription: any) {
  try {
    const customerId = subscription.customer

    const userQuery = await adminDb.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .get()

    if (userQuery.empty) return

    const userDoc = userQuery.docs[0]
    const userId = userDoc.id

    await adminDb.collection('users').doc(userId).update({
      planoStatus: 'canceled',
      subscriptionStatus: 'canceled',
      dataCancelamento: new Date(),
    })

    console.log('✅ Assinatura cancelada:', { userId })

  } catch (error) {
    console.error('❌ Erro ao cancelar assinatura:', error)
  }
}

// Processar pagamento único
async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    console.log('✅ Pagamento único processado:', paymentIntent.id)
  } catch (error) {
    console.error('❌ Erro ao processar pagamento:', error)
  }
}
