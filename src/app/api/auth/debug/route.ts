import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Check if we can query users
    const userCount = await prisma.user.count()
    
    // Check environment variables (without exposing sensitive data)
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      hasPrismaAdapter: true,
      userCount
    }
    
    return NextResponse.json({
      status: 'ok',
      message: 'Auth debug info',
      data: envCheck
    })
  } catch (error) {
    console.error('Auth debug error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 