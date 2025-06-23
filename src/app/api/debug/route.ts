import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Testando conexão com banco em produção...');
    
    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão estabelecida!');
    
    // Verificar se conseguimos fazer uma query simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query de teste:', result);
    
    // Contar usuários
    const userCount = await prisma.user.count();
    console.log('📊 Total de usuários:', userCount);
    
    // Verificar variáveis de ambiente (sem expor dados sensíveis)
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      hasPrismaAdapter: true,
      userCount
    };
    
    return NextResponse.json({
      status: 'ok',
      message: 'Debug info - Banco funcionando',
      data: envCheck,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro na conexão com banco:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Erro na conexão com banco',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 