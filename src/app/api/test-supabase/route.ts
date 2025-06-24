import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('🔍 Testando conexão básica com Supabase...')
    
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
    
    // Testar conexão básica sem acessar tabelas específicas
    const { data, error } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro Supabase:', error)
      
      // Se der erro de schema, vamos tentar uma query mais simples
      if (error.message.includes('pg_pgrst_no_exposed_schemas')) {
        return NextResponse.json({
          status: 'partial_success',
          message: 'Conexão estabelecida, mas problemas de schema/permissões',
          error: error.message,
          recommendation: 'Verificar configurações de RLS e permissões no Supabase',
          env: {
            SUPABASE_URL: supabaseUrl,
            SUPABASE_KEY: supabaseKey ? 'SET' : 'NOT_SET'
          },
          nextSteps: [
            'Verificar se tabelas existem no Supabase',
            'Configurar políticas RLS',
            'Verificar permissões da chave anônima'
          ]
        }, { status: 200 })
      }
      
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
    
    return NextResponse.json({
      status: 'ok',
      message: 'Conexão Supabase funcionando perfeitamente',
      data: {
        migrations: data,
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