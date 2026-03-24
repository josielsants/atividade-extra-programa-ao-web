import { createClient } from '@supabase/supabase-js'

/**
 * Configuração do Cliente Supabase
 * As variáveis de ambiente NEXT_PUBLIC_ são acessíveis tanto no cliente quanto no servidor.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verifica se as chaves existem para evitar erros silenciosos
if (!supabaseUrl || !supabaseKey) {
  console.warn('Configuração do Supabase incompleta. Verifique seu arquivo .env.local')
}

// Inicializa o cliente que será usado em toda a aplicação
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)