import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('🔍 Testando conexão direta com Supabase...')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Variáveis do Supabase não configuradas',
        env: {
          SUPABASE_URL: supabaseUrl ? 'SET' : 'NOT_SET',
          SUPABASE_KEY: supabaseKey ? 'SET' : 'NOT_SET'
        }
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Testar conexão fazendo uma query simples
    const { data, error } = await supabase
      .from('User')
      .select('id, email, name')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro Supabase:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Erro ao conectar com Supabase',
        error: error.message,
        env: {
          SUPABASE_URL: supabaseUrl,
          SUPABASE_KEY: supabaseKey ? 'SET' : 'NOT_SET'
        }
      }, { status: 500 })
    }
    
    console.log('✅ Conexão Supabase estabelecida!')
    
    // Contar usuários
    const { count, error: countError } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Erro ao contar usuários:', countError)
    }
    
    return NextResponse.json({
      status: 'ok',
      message: 'Conexão Supabase funcionando',
      data: {
        users: data,
        userCount: count || 0,
        supabaseUrl: supabaseUrl,
        connectionTest: 'SUCCESS'
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Erro geral na conexão',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      env: {
        SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
        SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 