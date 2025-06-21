import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { title, subtitle, content, imageUrl } = await request.json()
  if (!title || !content) {
    return NextResponse.json({ error: 'Título e texto são obrigatórios' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const post = await prisma.post.create({
    data: {
      title,
      subtitle,
      content,
      imageUrl,
      authorId: user.id,
      published: false,
    },
  })

  return NextResponse.json({ post }, { status: 201 })
} 