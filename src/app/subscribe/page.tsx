'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SubscribePage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Substitua pelo seu Price ID real do Stripe
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1OqXqX2eZvKYlo2C1QqXqX2e',
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

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
          <Link href="/" style={{ textDecoration: 'none' }}>
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
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '50px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px'
          }}>
            ✨ Assine Agora
          </h1>
          
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Desbloqueie todo o conteúdo exclusivo sobre maternidade com nossa assinatura premium
          </p>

          {/* Plano */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '40px',
            border: '2px solid #e2e8f0',
            position: 'relative'
          }}>
            {/* Badge de Trial */}
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              backgroundColor: '#fbbf24',
              color: '#92400e',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)'
            }}>
              🎁 7 DIAS GRÁTIS
            </div>

            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '10px'
            }}>
              Plano Premium
            </h2>
            
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#ec4899',
              marginBottom: '20px'
            }}>
              R$ 29,90
              <span style={{
                fontSize: '18px',
                color: '#6b7280',
                fontWeight: 'normal'
              }}>/mês</span>
            </div>

            {/* Informação do Trial */}
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <p style={{
                color: '#92400e',
                fontWeight: '600',
                margin: '0 0 5px 0',
                fontSize: '16px'
              }}>
                🎉 Comece com 7 dias grátis!
              </p>
              <p style={{
                color: '#92400e',
                margin: 0,
                fontSize: '14px',
                opacity: 0.8
              }}>
                Após o período de teste, será cobrado R$ 29,90/mês. Cancele quando quiser.
              </p>
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 30px 0',
              textAlign: 'left'
            }}>
              <li style={{
                padding: '8px 0',
                color: '#374151',
                fontSize: '16px'
              }}>
                ✅ Acesso ilimitado a todo conteúdo
              </li>
              <li style={{
                padding: '8px 0',
                color: '#374151',
                fontSize: '16px'
              }}>
                ✅ 7 dias grátis para testar
              </li>
              <li style={{
                padding: '8px 0',
                color: '#374151',
                fontSize: '16px'
              }}>
                ✅ Cancele quando quiser
              </li>
              <li style={{
                padding: '8px 0',
                color: '#374151',
                fontSize: '16px'
              }}>
                ✅ Suporte prioritário
              </li>
            </ul>
          </div>

          {/* Botão de Pagamento */}
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            style={{
              backgroundColor: '#ec4899',
              color: 'white',
              padding: '18px 40px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
              transition: 'all 0.2s ease',
              opacity: isLoading ? 0.7 : 1,
              width: '100%',
              maxWidth: '300px'
            }}
          >
            {isLoading ? 'Processando...' : '💳 Começar Teste Grátis'}
          </button>

          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginTop: '20px',
            lineHeight: '1.5'
          }}>
            Pagamento seguro via Stripe. Seus dados estão protegidos.
          </p>

          {/* Link de Volta */}
          <div style={{
            marginTop: '40px',
            paddingTop: '30px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <Link href="/" style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 