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
    console.log('🔍 Iniciando busca de posts...');
    console.log('📊 DATABASE_URL configurada:', !!process.env.DATABASE_URL);
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV);

    // Verificar se o Prisma está funcionando
    if (!prisma) {
      console.error('❌ Prisma client não está disponível');
      return NextResponse.json(
        { error: 'Prisma client não disponível' },
        { status: 500 }
      );
    }

    // Teste simples de conexão
    try {
      await prisma.$connect();
      console.log('✅ Conexão com banco estabelecida');
    } catch (dbError) {
      console.error('❌ Erro na conexão com banco:', dbError);
      return NextResponse.json(
        { error: 'Erro na conexão com banco de dados' },
        { status: 500 }
      );
    }

    // Buscar posts de forma mais simples
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
    });

    console.log(`📝 Encontrados ${posts.length} posts`);

    // Mapear posts de forma mais segura
    const mappedPosts = posts.map((post: PostWithAuthor) => ({
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
    }));

    return NextResponse.json({ posts: mappedPosts });

  } catch (error) {
    console.error('❌ Erro ao buscar posts:', error);
    
    // Log mais detalhado do erro
    if (error instanceof Error) {
      console.error('📋 Detalhes do erro:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Erro desconhecido' : undefined
      },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('❌ Erro ao desconectar Prisma:', disconnectError);
    }
  }
} 