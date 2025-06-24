import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('🔍 Testando conexão com Supabase usando service_role...')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Variáveis do Supabase service_role não configuradas',
        env: {
          SUPABASE_URL: supabaseUrl ? 'SET' : 'NOT_SET',
          SUPABASE_SERVICE_KEY: supabaseServiceKey ? 'SET' : 'NOT_SET'
        }
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Testar conexão com service_role
    const { data, error } = await supabase
      .from('User')
      .select('id, email, name')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro Supabase service_role:', error)
      
      return NextResponse.json({
        status: 'error',
        message: 'Erro ao conectar com Supabase usando service_role',
        error: error.message,
        env: {
          SUPABASE_URL: supabaseUrl,
          SUPABASE_SERVICE_KEY: supabaseServiceKey ? 'SET' : 'NOT_SET'
        }
      }, { status: 500 })
    }
    
    console.log('✅ Conexão Supabase service_role estabelecida!')
    
    // Contar usuários
    const { count, error: countError } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Erro ao contar usuários:', countError)
    }
    
    return NextResponse.json({
      status: 'ok',
      message: 'Conexão Supabase service_role funcionando',
      data: {
        users: data,
        userCount: count || 0,
        supabaseUrl: supabaseUrl,
        connectionTest: 'SUCCESS_WITH_SERVICE_ROLE'
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Erro geral na conexão com service_role',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      env: {
        SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
        SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT_SET'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 