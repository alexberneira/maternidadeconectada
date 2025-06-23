'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import PostCard from '@/components/PostCard'
import SubscriptionBanner from '@/components/SubscriptionBanner'
import { useState, useEffect } from 'react'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  imageUrl: string
  author: {
    name: string
  }
  createdAt: string
  category: string
}

interface Subscription {
  id: string
  stripeSubscriptionId: string | null
  stripeCurrentPeriodEnd: string | null
  stripePriceId: string | null
  createdAt: string
  isActive: boolean
  isTrialing: boolean
  trialEnd: string | null
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)

  // Buscar status da assinatura
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!session) {
        setSubscriptionLoading(false)
        return
      }

      try {
        const response = await fetch('/api/subscription')
        if (response.ok) {
          const data = await response.json()
          setSubscription(data.subscription)
        }
      } catch (error) {
        console.error('Erro ao carregar assinatura:', error)
      } finally {
        setSubscriptionLoading(false)
      }
    }

    fetchSubscription()
  }, [session])

  // Buscar posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts)
        }
      } catch (error) {
        console.error('Erro ao carregar posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (status === 'loading' || subscriptionLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#6b7280', margin: 0 }}>Carregando...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  const hasActiveSubscription = subscription?.isActive || false

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Banner de Assinatura */}
        {session && !hasActiveSubscription && (
          <SubscriptionBanner />
        )}

        {/* Banner para Assinantes Ativos */}
        {session && hasActiveSubscription && (
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '30px',
            color: 'white',
            boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              animation: 'float 6s ease-in-out infinite'
            }}></div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '14px' }}>✓</span>
                  </div>
                  <h2 style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    Assinatura Ativa
                  </h2>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '16px',
                  opacity: 0.9,
                  maxWidth: '500px'
                }}>
                  Você tem acesso completo a todo o conteúdo exclusivo para mães. Aproveite os artigos, dicas e experiências compartilhadas pela nossa comunidade!
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{ fontSize: '18px' }}>👑</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {subscription?.isTrialing ? 'Teste Gratuito' : 'Premium'}
                </span>
              </div>
            </div>
            
            <style jsx>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
              }
            `}</style>
          </div>
        )}

        {/* Lista de Posts */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {hasActiveSubscription ? 'Conteúdo Exclusivo' : 'Conteúdo para Mães'}
          </h1>
          
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '40px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : posts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={{
                    ...post,
                    createdAt: new Date(post.createdAt)
                  }}
                  hasSubscription={hasActiveSubscription}
                />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <p>Nenhum post encontrado.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
