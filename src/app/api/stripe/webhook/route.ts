import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')
  const body = await request.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret)
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 })
  }

  // Lida com eventos relevantes
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const subscriptionId = session.subscription
      const customerId = session.customer
      const userId = session.metadata?.userId
      if (userId && subscriptionId && customerId) {
        await prisma.subscription.update({
          where: { userId },
          data: {
            status: 'active',
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: customerId,
            planType: 'monthly',
            trialEndsAt: session.trial_end ? new Date(session.trial_end * 1000) : undefined,
            currentPeriodEnd: session.current_period_end ? new Date(session.current_period_end * 1000) : undefined,
          },
        })
      }
      break
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any
      const stripeSubscriptionId = subscription.id
      const status = subscription.status
      const currentPeriodEnd = subscription.current_period_end
      // Atualiza status no banco
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId },
        data: {
          status,
          currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
        },
      })
      break
    }
    // Adicione outros eventos relevantes se necessário
  }

  return NextResponse.json({ received: true })
} 