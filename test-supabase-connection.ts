import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSupabaseConnection() {
  try {
    console.log('🔍 Testando conectividade com Supabase...');
    console.log('📋 DATABASE_URL configurada:', process.env.DATABASE_URL ? 'SIM' : 'NÃO');
    
    if (process.env.DATABASE_URL) {
      console.log('🔗 URL do banco:', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));
    }
    
    // Testar conexão
    console.log('🔌 Tentando conectar...');
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar query simples
    const result = await prisma.$queryRaw`SELECT current_database() as db_name, current_user as user`;
    console.log('📊 Query de teste:', result);
    
    // Contar usuários
    const userCount = await prisma.user.count();
    console.log('👥 Total de usuários:', userCount);
    
    return { success: true, userCount };
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
    
    if (error instanceof Error) {
      console.error('📝 Detalhes do erro:');
      console.error('  - Nome:', error.name);
      console.error('  - Mensagem:', error.message);
      
      if (error.message.includes("Can't reach database server")) {
        console.error('🔧 Possíveis soluções:');
        console.error('  1. Verifique se o banco Supabase está ativo (não pausado)');
        console.error('  2. Verifique as configurações de rede no Supabase');
        console.error('  3. Verifique se a URL do banco está correta');
      }
    }
    
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  } finally {
    await prisma.$disconnect();
  }
}

testSupabaseConnection()
  .then(result => {
    console.log('🏁 Resultado final:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  }); 