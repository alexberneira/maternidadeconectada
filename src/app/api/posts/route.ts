import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface PostWithAuthor {
  id: string | number
  title: string
  content: string
  excerpt: string | null
  imageUrl: string | null
  authorId: string
  createdAt: Date
  updatedAt: Date
  published: boolean
  category: string | null
  author: {
    name: string | null
  } | null
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      posts: posts.map((post: PostWithAuthor) => ({
        id: String(post.id),
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || post.content.substring(0, 150) + '...',
        imageUrl: post.imageUrl,
        author: {
          name: post.author?.name || 'Autor'
        },
        createdAt: post.createdAt.toISOString(),
        category: post.category || 'Geral'
      }))
    })
  } catch (error) {
    console.error('Erro ao buscar posts:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 