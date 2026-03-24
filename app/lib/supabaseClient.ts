import { createClient } from '@supabase/supabase-js'

/**
 * Configuração do Cliente Supabase
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Verificação robusta para evitar crash no build do Vercel
const isUrlValid = supabaseUrl.startsWith('http')

if (!isUrlValid) {
  console.warn('⚠️ Atenção: NEXT_PUBLIC_SUPABASE_URL não configurada ou inválida.')
}

// Inicializa o cliente. Se a URL for inválida, usa uma URL de fallback segura para o build não quebrar
export const supabase = createClient(
  isUrlValid ? supabaseUrl : 'https://placeholder-link.supabase.co',
  supabaseKey || 'placeholder-key'
)
