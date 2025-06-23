import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser() {
  try {
    console.log('🔍 Verificando usuário alexberneira@gmail.com...');
    
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'alexberneira@gmail.com' }
    });

    if (existingUser) {
      console.log('✅ Usuário já existe!');
      console.log('ID:', existingUser.id);
      console.log('Nome:', existingUser.name);
      console.log('Email:', existingUser.email);
      
      // Atualizar senha para 123456
      const hashedPassword = await bcrypt.hash('123456', 10);
      await prisma.user.update({
        where: { email: 'alexberneira@gmail.com' },
        data: { password: hashedPassword }
      });
      console.log('🔑 Senha atualizada para: 123456');
    } else {
      console.log('❌ Usuário não encontrado. Criando...');
      
      const hashedPassword = await bcrypt.hash('123456', 10);
      const newUser = await prisma.user.create({
        data: {
          email: 'alexberneira@gmail.com',
          name: 'Alex Berneira',
          password: hashedPassword
        }
      });
      
      console.log('✅ Usuário criado com sucesso!');
      console.log('ID:', newUser.id);
      console.log('Nome:', newUser.name);
      console.log('Email:', newUser.email);
      console.log('🔑 Senha: 123456');
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser(); 