import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { publish } = await request.json()
    const { id } = await params

    if (!prisma) {
      return NextResponse.json({ error: 'Banco de dados não disponível' }, { status: 503 })
    }

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { published: !!publish },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Erro ao atualizar post:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 