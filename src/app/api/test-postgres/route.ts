import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    console.log('🔍 Testando conexão direta com PostgreSQL...')
    
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL não configurada',
        env: {
          DATABASE_URL: databaseUrl ? 'SET' : 'NOT_SET'
        }
      }, { status: 500 })
    }
    
    const prisma = new PrismaClient()
    
    // Testar conexão básica
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    console.log('✅ Conexão PostgreSQL estabelecida!')
    
    // Testar acesso às tabelas
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      },
      take: 1
    })
    
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        published: true
      },
      take: 1
    })
    
    const subscriptions = await prisma.subscription.findMany({
      select: {
        id: true,
        userId: true
      },
      take: 1
    })
    
    // Contar registros
    const userCount = await prisma.user.count()
    const postCount = await prisma.post.count()
    const subscriptionCount = await prisma.subscription.count()
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'ok',
      message: 'Conexão PostgreSQL funcionando perfeitamente',
      data: {
        connectionTest: result,
        users: users,
        posts: posts,
        subscriptions: subscriptions,
        counts: {
          users: userCount,
          posts: postCount,
          subscriptions: subscriptionCount
        },
        databaseUrl: databaseUrl ? 'SET' : 'NOT_SET'
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erro PostgreSQL:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Erro na conexão com PostgreSQL',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 