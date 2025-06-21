import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

interface CheckoutSessionCompleted {
  subscription: string
  customer: string
  metadata: {
    userId: string
  }
  current_period_end?: number
}

interface SubscriptionEvent {
  id: string
  current_period_end?: number
}

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')
  const body = await request.text()

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret)
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 })
  }

  // Lida com eventos relevantes
  if (!prisma) {
    return NextResponse.json({ error: 'Banco de dados não disponível' }, { status: 503 })
  }
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as unknown as CheckoutSessionCompleted
      const subscriptionId = session.subscription
      const customerId = session.customer
      const userId = session.metadata?.userId
      if (userId && subscriptionId && customerId) {
        // Buscar subscription existente
        const subscription = await prisma.subscription.findFirst({
          where: { userId }
        })
        
        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: customerId,
              stripeCurrentPeriodEnd: session.current_period_end ? new Date(session.current_period_end * 1000) : undefined,
            },
          })
        }
      }
      break
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as unknown as SubscriptionEvent
      const stripeSubscriptionId = subscription.id
      const currentPeriodEnd = subscription.current_period_end
      // Atualiza status no banco
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId },
        data: {
          stripeCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
        },
      })
      break
    }
    // Adicione outros eventos relevantes se necessário
  }

  return NextResponse.json({ received: true })
} 