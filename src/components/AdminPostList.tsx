'use client'

import { useRouter } from 'next/navigation'

interface Post {
  id: string
  title: string
  subtitle?: string | null
  isPublished: boolean
  createdAt: string
}

interface AdminPostListProps {
  posts: Post[]
}

export default function AdminPostList({ posts }: AdminPostListProps) {
  const router = useRouter()

  const handlePublish = async (id: string, publish: boolean) => {
    await fetch(`/api/admin/posts/${id}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publish }),
    })
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/posts/${id}`, {
      method: 'DELETE',
    })
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Seus Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">Nenhum post cadastrado ainda.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Título</th>
              <th className="py-2">Publicado?</th>
              <th className="py-2">Criado em</th>
              <th className="py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="py-2 font-medium">{post.title}</td>
                <td className="py-2">{post.isPublished ? 'Sim' : 'Não'}</td>
                <td className="py-2">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="py-2 space-x-2">
                  <button
                    onClick={() => handlePublish(post.id, !post.isPublished)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${post.isPublished ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                  >
                    {post.isPublished ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
} 