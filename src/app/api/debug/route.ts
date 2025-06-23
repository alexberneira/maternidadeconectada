import { NextResponse } from 'next/server';

export async function GET() {
  // Verificar se as variáveis críticas estão definidas
  const envCheck = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    // Não expor valores reais, apenas se estão definidos
  };

  return NextResponse.json({
    status: 'ok',
    environment: envCheck,
    message: 'Debug endpoint - verifique as variáveis de ambiente'
  });
} 