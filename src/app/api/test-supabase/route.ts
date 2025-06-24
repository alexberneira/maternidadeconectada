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
    
    // Testar conexão básica sem acessar tabelas
    const { data, error } = await supabase
      .rpc('version')
    
    if (error) {
      console.error('❌ Erro Supabase:', error)
      
      // Se der erro de RPC, vamos tentar uma query SQL direta
      const { data: sqlData, error: sqlError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(1)
      
      if (sqlError) {
        console.error('❌ Erro SQL:', sqlError)
        
        return NextResponse.json({
          status: 'error',
          message: 'Problemas de conectividade com Supabase',
          error: sqlError.message,
          recommendation: 'Verificar configurações do projeto Supabase',
          env: {
            SUPABASE_URL: supabaseUrl,
            SUPABASE_KEY: supabaseKey ? 'SET' : 'NOT_SET'
          },
          nextSteps: [
            'Verificar se o projeto Supabase está ativo',
            'Verificar configurações de API',
            'Verificar se as tabelas foram criadas corretamente'
          ]
        }, { status: 500 })
      }
      
      return NextResponse.json({
        status: 'partial_success',
        message: 'Conexão estabelecida, mas problemas de acesso',
        data: sqlData,
        env: {
          SUPABASE_URL: supabaseUrl,
          SUPABASE_KEY: supabaseKey ? 'SET' : 'NOT_SET'
        }
      }, { status: 200 })
    }
    
    console.log('✅ Conexão Supabase estabelecida!')
    
    return NextResponse.json({
      status: 'ok',
      message: 'Conexão Supabase funcionando perfeitamente',
      data: {
        version: data,
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