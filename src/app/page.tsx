import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return posts;
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return [];
  }
}

export default async function HomePage() {
  const posts = await getPosts();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #f3e4f7',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Maternidade
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/login" style={{
              backgroundColor: '#ec4899',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}>
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* Banner de Assinatura */}
      <div style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            ✨ Acesso Completo por Apenas R$ 29,90/mês
          </h2>
          <p style={{
            fontSize: '20px',
            marginBottom: '40px',
            opacity: 0.9
          }}>
            Desbloqueie todo o conteúdo exclusivo sobre maternidade
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            marginBottom: '40px'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              minWidth: '200px'
            }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>🎁 7 dias grátis</p>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Teste sem compromisso</p>
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              minWidth: '200px'
            }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>📱 Acesso ilimitado</p>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Em qualquer dispositivo</p>
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              minWidth: '200px'
            }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>💝 Cancele quando quiser</p>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Sem multas ou taxas</p>
            </div>
          </div>
          <Link href="/subscribe" style={{
            backgroundColor: 'white',
            color: '#ec4899',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            Começar Agora
          </Link>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '15px'
          }}>
            Conteúdo Exclusivo para Mães
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Dicas, experiências e informações valiosas para sua jornada na maternidade
          </p>
        </div>

        {posts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px',
            marginBottom: '60px'
          }}>
            {posts.map((post) => (
              <article
                key={post.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  border: '1px solid #f3f4f6'
                }}
              >
                {/* Imagem do post */}
                {post.imageUrl && (
                  <div style={{
                    height: '200px',
                    backgroundImage: `url(${post.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)'
                    }}></div>
                  </div>
                )}
                
                <div style={{ padding: '25px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '12px',
                    lineHeight: '1.4'
                  }}>
                    {post.title}
                  </h3>
                  
                  <p style={{
                    color: '#6b7280',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    fontSize: '15px'
                  }}>
                    {truncateContent(post.content)}
                  </p>
                  
                  {/* Caixa de conteúdo exclusivo */}
                  <div style={{
                    backgroundColor: '#fef3f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '20px'
                  }}>
                    <p style={{
                      color: '#dc2626',
                      fontWeight: '600',
                      margin: '0 0 5px 0',
                      fontSize: '14px'
                    }}>
                      🔒 Conteúdo Exclusivo
                    </p>
                    <p style={{
                      color: '#dc2626',
                      margin: 0,
                      fontSize: '13px',
                      opacity: 0.8
                    }}>
                      Assine para ler o conteúdo completo e muito mais!
                    </p>
                  </div>
                  
                  {/* Meta informações */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                    color: '#9ca3af'
                  }}>
                    <span>Por: {post.author.name}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#6b7280',
            fontSize: '18px'
          }}>
            Nenhum post disponível no momento.
          </div>
        )}

        {/* Call to Action Final */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '50px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #f3f4f6'
        }}>
          <h3 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '15px'
          }}>
            Quer ver mais conteúdo exclusivo?
          </h3>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '30px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Junte-se a milhares de mães que já descobriram nossos segredos para uma maternidade mais tranquila e feliz.
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
            transition: 'all 0.2s ease'
          }}>
            Assinar Agora - R$ 29,90/mês
          </button>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginTop: '15px'
          }}>
            ✓ 7 dias grátis • ✓ Cancele quando quiser • ✓ Acesso ilimitado
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center',
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ margin: 0, opacity: 0.8 }}>
            © 2024 Maternidade. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
