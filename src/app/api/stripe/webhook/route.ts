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
  customer: string
  current_period_end?: number
  trial_end?: number
  status: string
  metadata: {
    userId: string
  }
}

interface InvoiceEvent {
  subscription: string
  period_end?: number
}

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')
  const body = await request.text()

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 })
  }

  console.log('Webhook event received:', event.type)

  // Lida com eventos relevantes
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as unknown as CheckoutSessionCompleted
      const subscriptionId = session.subscription
      const customerId = session.customer
      const userId = session.metadata?.userId
      
      console.log('Checkout completed:', { subscriptionId, customerId, userId })
      
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
          console.log('Subscription updated:', subscription.id)
        } else {
          // Criar nova subscription se não existir
          await prisma.subscription.create({
            data: {
              userId,
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: customerId,
              stripeCurrentPeriodEnd: session.current_period_end ? new Date(session.current_period_end * 1000) : undefined,
            },
          })
          console.log('New subscription created for user:', userId)
        }
      }
      break
    }
    
    case 'customer.subscription.updated': {
      const subscription = event.data.object as unknown as SubscriptionEvent
      const stripeSubscriptionId = subscription.id
      const currentPeriodEnd = subscription.current_period_end
      const trialEnd = subscription.trial_end
      const status = subscription.status
      
      console.log('Subscription updated:', { stripeSubscriptionId, status, currentPeriodEnd, trialEnd })
      
      // Atualiza status no banco
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId },
        data: {
          stripeCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
        },
      })
      break
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as unknown as SubscriptionEvent
      const stripeSubscriptionId = subscription.id
      
      console.log('Subscription deleted:', stripeSubscriptionId)
      
      // Marcar como inativa no banco
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId },
        data: {
          stripeCurrentPeriodEnd: new Date(), // Marca como expirada
        },
      })
      break
    }
    
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as unknown as InvoiceEvent
      const subscriptionId = invoice.subscription
      
      if (subscriptionId) {
        console.log('Payment succeeded for subscription:', subscriptionId)
        
        // Atualizar período da assinatura
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            stripeCurrentPeriodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : undefined,
          },
        })
      }
      break
    }
    
    case 'invoice.payment_failed': {
      const invoice = event.data.object as unknown as InvoiceEvent
      const subscriptionId = invoice.subscription
      
      if (subscriptionId) {
        console.log('Payment failed for subscription:', subscriptionId)
        
        // Marcar como inativa se o pagamento falhou
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            stripeCurrentPeriodEnd: new Date(), // Marca como expirada
          },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
} 