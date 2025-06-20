'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPostForm() {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let imageUrl = ''
      if (image) {
        // Upload real para Vercel Blob
        const formData = new FormData()
        formData.append('file', image)
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) {
          setError(uploadData.error || 'Erro ao fazer upload da imagem')
          setLoading(false)
          return
        }
        imageUrl = uploadData.url
      }

      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          content,
          imageUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao criar post')
      } else {
        setTitle('')
        setSubtitle('')
        setContent('')
        setImage(null)
        router.refresh()
      }
    } catch (err) {
      setError('Erro ao criar post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="bg-white rounded-xl shadow-lg p-6 space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Novo Post</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
        <input
          type="text"
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Texto</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Imagem (opcional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="bg-pink-600 text-white px-6 py-2 rounded-md font-medium hover:bg-pink-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Post'}
        </button>
      </div>
    </form>
  )
} 