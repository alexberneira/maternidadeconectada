import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_xxx' // Defina no .env

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // Buscar ou criar Stripe Customer
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || !user.email) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  let stripeCustomerId = null
  const subscription = await prisma.subscription.findFirst({ where: { userId: user.id } })
  if (subscription?.stripeCustomerId) {
    stripeCustomerId = subscription.stripeCustomerId
  } else {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    })
    stripeCustomerId = customer.id
    await prisma.subscription.update({
      where: { id: subscription?.id },
      data: { stripeCustomerId },
    })
  }

  // Criar sessão de checkout
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: stripeCustomerId,
    line_items: [
      {
        price: STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 7,
      metadata: { userId: user.id },
    },
    success_url: `${process.env.NEXTAUTH_URL}/?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/subscription?canceled=1`,
    metadata: { userId: user.id },
  })

  return NextResponse.json({ url: checkoutSession.url })
} 