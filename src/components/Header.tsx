'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Heart, User, LogOut, CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">
              Maternidade
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {session ? (
              <>
                <Link 
                  href="/subscription" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Minha Assinatura</span>
                </Link>
                <Link 
                  href="/admin" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Entrar
                </Link>
                <Link 
                  href="/register"
                  className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
} 