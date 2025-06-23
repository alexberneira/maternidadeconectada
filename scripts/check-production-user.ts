import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkProductionUser() {
  try {
    console.log('🔍 Verificando usuário no banco de produção...');
    
    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'alexberneira@gmail.com' }
    });

    if (existingUser) {
      console.log('✅ Usuário encontrado!');
      console.log('ID:', existingUser.id);
      console.log('Nome:', existingUser.name);
      console.log('Email:', existingUser.email);
      console.log('Tem senha:', !!(existingUser as any).password);
      
      // Verificar se a senha atual é 123456
      const isCurrentPassword = await bcrypt.compare('123456', (existingUser as any).password || '');
      console.log('Senha atual é 123456:', isCurrentPassword);
      
      if (!isCurrentPassword) {
        console.log('🔄 Atualizando senha para 123456...');
        const hashedPassword = await bcrypt.hash('123456', 10);
        await prisma.user.update({
          where: { email: 'alexberneira@gmail.com' },
          data: { password: hashedPassword }
        });
        console.log('✅ Senha atualizada!');
      }
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
    
    // Contar total de usuários
    const totalUsers = await prisma.user.count();
    console.log('📊 Total de usuários no banco:', totalUsers);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductionUser(); 