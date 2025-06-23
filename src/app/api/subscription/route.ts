import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id }
    })

    if (!subscription) {
      return NextResponse.json({ subscription: null })
    }

    // Verificar se a assinatura está ativa
    const now = new Date()
    const isActive = subscription.stripeCurrentPeriodEnd 
      ? new Date(subscription.stripeCurrentPeriodEnd) > now
      : false

    // Verificar se está em período de teste
    const isTrialing = subscription.stripeCurrentPeriodEnd 
      ? new Date(subscription.stripeCurrentPeriodEnd) > now && 
        new Date(subscription.createdAt).getTime() + (7 * 24 * 60 * 60 * 1000) > now.getTime()
      : false

    const trialEnd = isTrialing 
      ? new Date(new Date(subscription.createdAt).getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString()
      : null

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd?.toISOString(),
        stripePriceId: subscription.stripePriceId,
        createdAt: subscription.createdAt.toISOString(),
        isActive,
        isTrialing,
        trialEnd
      }
    })
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 