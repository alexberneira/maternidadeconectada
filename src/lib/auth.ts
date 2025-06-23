import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Extend the User type to include password
interface UserWithPassword {
  id: string
  email: string
  name: string | null
  password?: string
}

// Extend the Session type to include id
interface SessionWithId {
  user: {
    id: string
    email: string
    name: string | null
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('🔐 [AUTH] Credenciais ausentes');
          return null
        }

        try {
          console.log('🔐 [AUTH] Tentativa de login para:', credentials.email);
          
          // Test database connection first
          await prisma.$connect()
          
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            console.log('🔐 [AUTH] Usuário não encontrado:', credentials.email);
            return null
          }

          if (!(user as UserWithPassword).password) {
            console.log('🔐 [AUTH] Usuário sem senha:', credentials.email);
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            (user as UserWithPassword).password!
          )

          if (!isPasswordValid) {
            console.log('🔐 [AUTH] Senha inválida para:', credentials.email);
            return null
          }

          console.log('🔐 [AUTH] Login bem-sucedido para:', user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('🔐 [AUTH] Erro na autenticação:', error);
          return null;
        } finally {
          await prisma.$disconnect()
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as SessionWithId['user']).id = token.id as string
      }
      return session
    }
  },
  // Configurações para produção
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  // Configurações adicionais para produção
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
} 