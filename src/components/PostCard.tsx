'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Eye, Lock } from 'lucide-react'

interface Post {
  id: string
  title: string
  subtitle?: string | null
  content: string
  imageUrl?: string | null
  author: {
    name?: string | null
  }
  createdAt: Date
}

interface PostCardProps {
  post: Post
  hasSubscription: boolean
}

export default function PostCard({ post, hasSubscription }: PostCardProps) {
  const [showModal, setShowModal] = useState(false)

  const truncatedContent = post.content.length > 150 
    ? post.content.substring(0, 150) + '...' 
    : post.content

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        {/* Imagem */}
        {post.imageUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {post.title}
          </h3>
          
          {post.subtitle && (
            <p className="text-gray-600 mb-3 font-medium">
              {post.subtitle}
            </p>
          )}

          <p className="text-gray-700 mb-4">
            {hasSubscription ? truncatedContent : 'Conteúdo exclusivo para assinantes'}
          </p>

          {/* Botão de ação */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
            >
              {hasSubscription ? (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Ler mais</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Assinar para ler</span>
                </>
              )}
            </button>

            <div className="text-sm text-gray-500">
              {post.author.name}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {post.title}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {post.subtitle && (
                <p className="text-gray-600 mb-4 font-medium text-lg">
                  {post.subtitle}
                </p>
              )}

              {post.imageUrl && (
                <div className="relative h-64 w-full mb-4">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="prose max-w-none">
                {hasSubscription ? (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {post.content}
                  </p>
                ) : (
                  <div className="text-center text-pink-600 font-semibold text-lg py-8">
                    Conteúdo exclusivo para assinantes.<br />
                    <a href="/subscription" className="underline hover:text-pink-800">Assine agora para ler o conteúdo completo!</a>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Por {post.author.name} • {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 