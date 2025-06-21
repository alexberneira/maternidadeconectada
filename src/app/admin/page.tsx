import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminPostForm from '@/components/AdminPostForm'
import AdminPostList from '@/components/AdminPostList'
import { redirect } from 'next/navigation'
import { Post } from '@prisma/client'

interface SessionUser {
  id: string
  email: string
  name: string | null
}

export default async function AdminPage() {
  let session = null;
  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    redirect('/login')
  }

  if (!session || !session.user) {
    redirect('/login')
  }

  // Buscar posts do usuário logado
  let posts: Post[] = [];
  try {
    if (prisma) {
      posts = await prisma.post.findMany({
        where: { authorId: (session.user as SessionUser).id },
        orderBy: { createdAt: 'desc' },
      })
    }
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    // Em caso de erro, continuar com array vazio
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel de Administração</h1>
        <AdminPostForm />
        <div className="mt-12">
          <AdminPostList posts={posts} />
        </div>
      </div>
    </div>
  )
} 