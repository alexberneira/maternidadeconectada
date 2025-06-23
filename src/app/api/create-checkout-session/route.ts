import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar ou criar usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Buscar ou criar subscription
    let subscription = await prisma.subscription.findFirst({
      where: { userId: user.id }
    })

    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          stripePriceId: priceId
        }
      })
    }

    const stripe = getStripe()

    // Criar ou buscar customer no Stripe
    let stripeCustomerId = subscription.stripeCustomerId
    if (!stripeCustomerId) {
      const customerData: {
        email: string
        metadata: { userId: string }
        name?: string
      } = {
        email: user.email!,
        metadata: {
          userId: user.id
        }
      }
      
      if (user.name) {
        customerData.name = user.name
      }
      
      const customer = await stripe.customers.create(customerData)
      stripeCustomerId = customer.id

      // Atualizar subscription com customer ID
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { stripeCustomerId }
      })
    }

    // Criar sessão de checkout com trial de 7 dias
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 7, // 7 dias de teste gratuito
        metadata: {
          userId: user.id
        }
      },
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/subscribe`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      metadata: {
        userId: user.id
      }
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 