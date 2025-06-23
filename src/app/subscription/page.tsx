"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SubscriptionData {
  id: string
  stripeSubscriptionId: string | null
  stripeCurrentPeriodEnd: string | null
  stripePriceId: string | null
  createdAt: string
  isActive: boolean
  isTrialing: boolean
  trialEnd: string | null
}

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [error, setError] = useState("")
  const [canceling, setCanceling] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchSubscription()
    }
  }, [status, session, router])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription)
      } else {
        setError("Erro ao carregar dados da assinatura")
      }
    } catch (err) {
      console.error('Erro ao carregar assinatura:', err)
      setError("Erro ao carregar dados da assinatura")
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/create-checkout-session", { 
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1RbWH0B4EKN98BCovABOyfwr',
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError("Erro ao redirecionar para o pagamento.")
      }
    } catch (_err) {
      console.error('Erro ao carregar assinatura:', _err)
      setError("Erro ao iniciar assinatura.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription?.stripeSubscriptionId) return

    setCanceling(true)
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.stripeSubscriptionId
        })
      })

      if (response.ok) {
        await fetchSubscription() // Recarregar dados
      } else {
        setError("Erro ao cancelar assinatura")
      }
    } catch (err) {
      console.error('Erro ao cancelar assinatura:', err)
      setError("Erro ao cancelar assinatura")
    } finally {
      setCanceling(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{
          fontSize: '18px',
          color: '#6b7280'
        }}>
          Carregando...
        </div>
      </div>
    )
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
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px'
          }}>
            📋 Minha Assinatura
          </h1>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '20px',
              color: '#dc2626',
              fontSize: '16px'
            }}>
              ❌ {error}
            </div>
          )}

          {subscription ? (
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '30px',
              border: '2px solid #e2e8f0'
            }}>
              {/* Status da Assinatura */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: subscription.isActive ? '#10b981' : '#ef4444'
                }}></div>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: subscription.isActive ? '#10b981' : '#ef4444'
                }}>
                  {subscription.isActive ? 'Ativa' : 'Inativa'}
                </span>
              </div>

              {/* Informações da Assinatura */}
              <div style={{
                textAlign: 'left',
                marginBottom: '20px'
              }}>
                <div style={{
                  padding: '10px 0',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <strong>ID da Assinatura:</strong> {subscription.stripeSubscriptionId || 'N/A'}
                </div>
                
                {subscription.isTrialing && subscription.trialEnd && (
                  <div style={{
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    padding: '15px',
                    margin: '10px 0'
                  }}>
                    <strong>🎉 Período de Teste:</strong> Até {new Date(subscription.trialEnd).toLocaleDateString('pt-BR')}
                  </div>
                )}

                {subscription.stripeCurrentPeriodEnd && (
                  <div style={{
                    padding: '10px 0',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <strong>Próxima Cobrança:</strong> {new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString('pt-BR')}
                  </div>
                )}

                <div style={{
                  padding: '10px 0'
                }}>
                  <strong>Membro desde:</strong> {new Date(subscription.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>

              {/* Botões de Ação */}
              {subscription.isActive && subscription.stripeSubscriptionId && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={canceling}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: canceling ? 'not-allowed' : 'pointer',
                    opacity: canceling ? 0.7 : 1,
                    marginRight: '10px'
                  }}
                >
                  {canceling ? 'Cancelando...' : '❌ Cancelar Assinatura'}
                </button>
              )}

              {!subscription.isActive && (
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  style={{
                    backgroundColor: '#ec4899',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Processando...' : '💳 Reativar Assinatura'}
                </button>
              )}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '30px',
              border: '2px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '15px'
              }}>
                Nenhuma Assinatura Encontrada
              </h2>
              
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                marginBottom: '20px'
              }}>
                Você ainda não possui uma assinatura ativa. Assine agora e tenha acesso a todo o conteúdo exclusivo!
              </p>

              <button
                onClick={handleSubscribe}
                disabled={loading}
                style={{
                  backgroundColor: '#ec4899',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                  transition: 'all 0.2s ease',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Processando...' : '💳 Assinar Agora'}
              </button>
            </div>
          )}

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