import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

interface StripeSubscriptionWithPeriod {
  id: string
  status: string
  current_period_end: number
  trial_end?: number
  items: {
    data: Array<{
      price: {
        id: string
      }
    }>
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { sessionId } = await request.json()
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar a sessão do Stripe para obter informações da assinatura
    const stripe = getStripe()
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (!stripeSession.subscription) {
      return NextResponse.json(
        { error: 'Sessão não contém assinatura' },
        { status: 400 }
      )
    }

    // Buscar a assinatura no Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      stripeSession.subscription as string
    ) as unknown as StripeSubscriptionWithPeriod

    console.log('Stripe Subscription:', {
      id: stripeSubscription.id,
      status: stripeSubscription.status,
      current_period_end: stripeSubscription.current_period_end,
      trial_end: stripeSubscription.trial_end
    })

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já existe uma assinatura para este usuário
    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId: user.id }
    })

    // Converter timestamp do Stripe para Date (multiplicar por 1000 para converter de segundos para milissegundos)
    let currentPeriodEnd: Date
    
    if (stripeSubscription.current_period_end) {
      currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000)
    } else {
      // Se não há current_period_end, calcular baseado no período atual (30 dias)
      currentPeriodEnd = new Date()
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30)
    }
    
    // Validar se a data é válida
    if (isNaN(currentPeriodEnd.getTime())) {
      console.error('Data inválida do Stripe:', stripeSubscription.current_period_end)
      return NextResponse.json(
        { error: 'Data de período inválida' },
        { status: 400 }
      )
    }

    let subscription
    if (existingSubscription) {
      // Atualizar assinatura existente
      subscription = await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          stripeCustomerId: stripeSession.customer as string,
          stripeSubscriptionId: stripeSession.subscription as string,
          stripePriceId: stripeSubscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: currentPeriodEnd,
          updatedAt: new Date()
        }
      })
    } else {
      // Criar nova assinatura
      subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          stripeCustomerId: stripeSession.customer as string,
          stripeSubscriptionId: stripeSession.subscription as string,
          stripePriceId: stripeSubscription.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: currentPeriodEnd
        }
      })
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd,
        isActive: true
      }
    })

  } catch (error) {
    console.error('Erro ao ativar assinatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 