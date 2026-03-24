import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

/**
 * GET: Busca todas as tarefas da tabela 'tasks'
 */
export async function GET() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

/**
 * POST: Cria uma nova tarefa
 */
export async function POST(request: Request) {
  const { title } = await request.json()

  if (!title) {
    return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, is_completed: false })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

/**
 * PATCH: Atualiza o status de uma tarefa (concluída ou não)
 */
export async function PATCH(request: Request) {
  const { id, is_completed } = await request.json()

  if (id === undefined || is_completed === undefined) {
    return NextResponse.json({ error: 'Dados insuficientes para atualização' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({ is_completed })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

/**
 * DELETE: Remove uma tarefa pelo ID
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID da tarefa não fornecido' }, { status: 400 })
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
