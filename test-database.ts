import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...');
    
    // Testar conexão
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Verificar se conseguimos fazer uma query simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query de teste executada:', result);
    
    // Contar usuários
    const userCount = await prisma.user.count();
    console.log('📊 Total de usuários:', userCount);
    
    // Listar usuários (apenas email e nome)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    });
    
    console.log('👥 Usuários no banco:');
    users.forEach((user: any) => {
      console.log(`  - ${user.email} (${user.name}) - ID: ${user.id}`);
    });
    
    // Verificar se o usuário específico existe
    const testUser = await prisma.user.findUnique({
      where: { email: 'alexberneira@gmail.com' },
      select: {
        id: true,
        email: true,
        name: true,
        password: true
      }
    });
    
    if (testUser) {
      console.log('✅ Usuário alexberneira@gmail.com encontrado!');
      console.log(`  ID: ${testUser.id}`);
      console.log(`  Nome: ${testUser.name}`);
      console.log(`  Tem senha: ${!!testUser.password}`);
    } else {
      console.log('❌ Usuário alexberneira@gmail.com NÃO encontrado!');
    }
    
    // Contar posts
    const postCount = await prisma.post.count();
    console.log('📝 Total de posts:', postCount);
    
    // Verificar estrutura das tabelas
    console.log('🏗️ Verificando estrutura das tabelas...');
    
    try {
      const userTable = await prisma.$queryRaw`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        ORDER BY ordinal_position
      `;
      console.log('📋 Estrutura da tabela User:', userTable);
    } catch (error) {
      console.log('⚠️ Não foi possível verificar estrutura da tabela User');
    }
    
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexão fechada.');
  }
}

testDatabase(); 