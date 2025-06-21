import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  if (!prisma) {
    return NextResponse.json({ error: 'Banco de dados não disponível' }, { status: 503 })
  }
  await prisma.post.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ message: 'Post deletado' })
} 