import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Testando conexão com banco em produção...');
    
    // Verificar variáveis de ambiente primeiro
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_ENV: process.env.VERCEL_ENV
    };
    
    console.log('📋 Variáveis de ambiente:', envCheck);
    
    // Se não tem DATABASE_URL, retornar erro
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL não configurada',
        env: envCheck,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    // Testar conexão
    console.log('🔌 Tentando conectar no banco...');
    await prisma.$connect();
    console.log('✅ Conexão estabelecida!');
    
    // Verificar se conseguimos fazer uma query simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query de teste:', result);
    
    // Contar usuários
    const userCount = await prisma.user.count();
    console.log('📊 Total de usuários:', userCount);
    
    return NextResponse.json({
      status: 'ok',
      message: 'Debug info - Banco funcionando',
      data: {
        ...envCheck,
        hasPrismaAdapter: true,
        userCount,
        connectionTest: 'SUCCESS'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro na conexão com banco:', error);
    
    // Capturar mais detalhes do erro
    const errorDetails = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
      code: (error as any)?.code,
      meta: (error as any)?.meta
    };
    
    return NextResponse.json({
      status: 'error',
      message: 'Erro na conexão com banco',
      error: errorDetails,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        VERCEL_URL: process.env.VERCEL_URL,
        VERCEL_ENV: process.env.VERCEL_ENV
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      console.log('Erro ao desconectar:', e);
    }
  }
} 