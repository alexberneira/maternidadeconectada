import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser() {
  try {
    console.log('🔧 Criando usuário...');

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findFirst({
      where: { email: 'alexberneira@gmail.com' }
    });

    if (existingUser) {
      console.log('✅ Usuário já existe:', existingUser.email);
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash('123456', 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: 'Alex Berneira',
        email: 'alexberneira@gmail.com',
        password: hashedPassword
      }
    });

    console.log('✅ Usuário criado com sucesso!');
    console.log('📧 Email:', user.email);
    console.log('🔑 Senha: 123456');
    console.log('');
    console.log('🎉 Agora você pode fazer login com:');
    console.log('   Email: alexberneira@gmail.com');
    console.log('   Senha: 123456');

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser(); 