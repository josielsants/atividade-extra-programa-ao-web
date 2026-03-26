import { createClient } from '@supabase/supabase-js'

/**
 * Configuração do Cliente Supabase
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Verificação robusta para evitar crash no build do Vercel
const isUrlValid = supabaseUrl.startsWith('http')
const isKeySuspicious = supabaseKey.startsWith('sb_publishable_')

if (!isUrlValid) {
  console.warn('⚠️ Atenção: NEXT_PUBLIC_SUPABASE_URL não configurada ou inválida.')
}

if (isKeySuspicious) {
  console.error('❌ ERRO CRÍTICO: A chave NEXT_PUBLIC_SUPABASE_ANON_KEY configurada parece ser uma chave do STRIPE (sb_publishable_...), não do SUPABASE. Verifique seu arquivo .env.local.')
}

// Inicializa o cliente. Se a URL for inválida, usa uma URL de fallback segura para o build não quebrar
export const supabase = createClient(
  isUrlValid ? supabaseUrl : 'https://placeholder-link.supabase.co',
  supabaseKey || 'placeholder-key'
)
