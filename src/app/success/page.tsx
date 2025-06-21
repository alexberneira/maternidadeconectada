'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sessionIdParam = urlParams.get('session_id')
    setSessionId(sessionIdParam)
  }, [])

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
        maxWidth: '600px',
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
          <div style={{
            fontSize: '64px',
            marginBottom: '20px'
          }}>
            🎉
          </div>
          
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px'
          }}>
            Parabéns!
          </h1>
          
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            Sua assinatura foi ativada com sucesso! Agora você tem acesso completo a todo o conteúdo exclusivo sobre maternidade.
          </p>

          {sessionId && (
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '30px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <strong>ID da Sessão:</strong> {sessionId}
            </div>
          )}

          <div style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#065f46',
              marginBottom: '10px'
            }}>
              ✅ O que você ganhou:
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              textAlign: 'left'
            }}>
              <li style={{
                padding: '5px 0',
                color: '#065f46',
                fontSize: '16px'
              }}>
                • Acesso ilimitado a todos os posts
              </li>
              <li style={{
                padding: '5px 0',
                color: '#065f46',
                fontSize: '16px'
              }}>
                • Conteúdo exclusivo sobre maternidade
              </li>
              <li style={{
                padding: '5px 0',
                color: '#065f46',
                fontSize: '16px'
              }}>
                • 7 dias grátis incluídos
              </li>
            </ul>
          </div>

          <Link href="/" style={{
            backgroundColor: '#ec4899',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
            transition: 'all 0.2s ease'
          }}>
            🏠 Ir para a Página Inicial
          </Link>

          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginTop: '30px',
            lineHeight: '1.5'
          }}>
            Você receberá um email de confirmação em breve. 
            Em caso de dúvidas, entre em contato conosco.
          </p>
        </div>
      </main>
    </div>
  )
} 