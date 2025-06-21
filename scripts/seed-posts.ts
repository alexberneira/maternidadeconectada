import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const posts = [
  {
    title: "10 Dicas Essenciais para o Primeiro Mês do Bebê",
    content: "O primeiro mês com seu bebê pode ser desafiador, mas também é uma experiência incrível. Aqui estão 10 dicas essenciais que vão te ajudar a navegar por esse período especial. Desde a amamentação até o sono do bebê, passando pela adaptação da rotina familiar, essas dicas foram testadas e aprovadas por milhares de mães. Descubra como criar um ambiente tranquilo para seu pequeno e como cuidar de si mesma durante esse período de adaptação. A maternidade é uma jornada única e cada bebê é diferente, mas essas orientações vão te dar uma base sólida para começar.",
    imageUrl: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop",
    authorId: 1,
    published: true
  },
  {
    title: "Como Organizar a Rotina do Bebê: Guia Completo",
    content: "Criar uma rotina para o bebê é fundamental para o desenvolvimento saudável e para a tranquilidade da família. Neste guia completo, você vai aprender como estabelecer horários para alimentação, sono, banho e brincadeiras. Vamos abordar desde recém-nascidos até bebês de 1 ano, com dicas específicas para cada fase do desenvolvimento. A rotina traz segurança para o bebê e organização para os pais, facilitando o dia a dia e reduzindo o estresse. Descubra como adaptar a rotina conforme seu bebê cresce e como lidar com as mudanças que acontecem naturalmente.",
    imageUrl: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&h=600&fit=crop",
    authorId: 1,
    published: true
  },
  {
    title: "Alimentação Saudável na Gravidez: O que Comer e Evitar",
    content: "A alimentação durante a gravidez é crucial para a saúde da mãe e do bebê. Neste artigo, você vai descobrir quais alimentos são essenciais para uma gravidez saudável e quais devem ser evitados. Vamos falar sobre nutrientes importantes como ácido fólico, ferro, cálcio e ômega-3, e como incluí-los na sua dieta diária. Também abordaremos os mitos e verdades sobre alimentação na gravidez, dicas para lidar com enjoos e como manter uma alimentação equilibrada mesmo com as mudanças hormonais. Sua saúde e a do seu bebê começam na mesa!",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop",
    authorId: 1,
    published: true
  },
  {
    title: "Exercícios Seguros Durante a Gravidez: Guia da Primeira à 40ª Semana",
    content: "Manter-se ativa durante a gravidez traz inúmeros benefícios para a mãe e o bebê. Neste guia completo, você vai descobrir quais exercícios são seguros para cada trimestre da gravidez, como adaptar sua rotina de treinos e quais atividades devem ser evitadas. Vamos abordar desde caminhadas leves até yoga pré-natal, pilates e hidroginástica. Os exercícios ajudam a controlar o peso, melhoram o humor, preparam o corpo para o parto e facilitam a recuperação pós-parto. Descubra como se exercitar de forma segura e prazerosa durante essa fase especial.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    authorId: 1,
    published: true
  },
  {
    title: "Preparando o Quarto do Bebê: Checklist Completo",
    content: "Preparar o quarto do bebê é um momento especial e emocionante para os pais. Neste checklist completo, você vai descobrir tudo que precisa para criar um ambiente seguro, confortável e funcional para seu pequeno. Desde o berço e trocador até a decoração e organização, vamos cobrir todos os detalhes importantes. Aprenda como escolher móveis seguros, como organizar o espaço de forma prática e como criar um ambiente que favoreça o sono e o desenvolvimento do bebê. O quarto do bebê deve ser um refúgio de paz e amor para toda a família.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    authorId: 1,
    published: true
  }
];

async function main() {
  console.log('🌱 Iniciando seed dos posts...');

  try {
    // Verificar se já existe um usuário admin
    let adminUser = await prisma.user.findFirst({
      where: { email: 'admin@maternidade.com' }
    });

    // Se não existir, criar o usuário admin
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          name: 'Admin Maternidade',
          email: 'admin@maternidade.com'
        }
      });
      console.log('✅ Usuário admin criado:', adminUser.email);
    }

    // Limpar posts existentes
    await prisma.post.deleteMany({});
    console.log('🗑️ Posts existentes removidos');

    // Criar novos posts
    for (const post of posts) {
      await prisma.post.create({
        data: {
          ...post,
          authorId: adminUser.id
        }
      });
    }

    console.log(`✅ ${posts.length} posts criados com sucesso!`);
    console.log('🎉 Seed concluído!');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 