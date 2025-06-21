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

let adapter: ReturnType<typeof PrismaAdapter> | undefined = undefined;
if (!prisma) {
  throw new Error('Prisma Client não foi inicializado. Verifique a variável de ambiente DATABASE_URL.');
} else {
  adapter = PrismaAdapter(prisma);
}

export const authOptions: NextAuthOptions = {
  adapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!prisma) {
          return null;
        }
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !(user as UserWithPassword).password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          (user as UserWithPassword).password!
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
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
  }
} 