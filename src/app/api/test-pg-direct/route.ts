import { NextResponse } from 'next/server'
import { Client } from 'pg'

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
    
    // Criar cliente PostgreSQL
    const client = new Client({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false
      }
    })
    
    // Conectar
    await client.connect()
    console.log('✅ Conexão PostgreSQL estabelecida!')
    
    // Testar query simples
    const result = await client.query('SELECT 1 as test')
    
    // Testar acesso às tabelas
    const usersResult = await client.query(`
      SELECT id, email, name 
      FROM "User" 
      LIMIT 1
    `)
    
    const postsResult = await client.query(`
      SELECT id, title, published 
      FROM "Post" 
      LIMIT 1
    `)
    
    const subscriptionsResult = await client.query(`
      SELECT id, "userId" 
      FROM "Subscription" 
      LIMIT 1
    `)
    
    // Contar registros
    const userCountResult = await client.query('SELECT COUNT(*) FROM "User"')
    const postCountResult = await client.query('SELECT COUNT(*) FROM "Post"')
    const subscriptionCountResult = await client.query('SELECT COUNT(*) FROM "Subscription"')
    
    // Fechar conexão
    await client.end()
    
    return NextResponse.json({
      status: 'ok',
      message: 'Conexão PostgreSQL direta funcionando perfeitamente',
      data: {
        connectionTest: result.rows[0],
        users: usersResult.rows,
        posts: postsResult.rows,
        subscriptions: subscriptionsResult.rows,
        counts: {
          users: userCountResult.rows[0].count,
          posts: postCountResult.rows[0].count,
          subscriptions: subscriptionCountResult.rows[0].count
        },
        databaseUrl: databaseUrl ? 'SET' : 'NOT_SET'
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erro PostgreSQL direto:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Erro na conexão direta com PostgreSQL',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 