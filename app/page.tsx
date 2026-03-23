'use client'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'

export default function Home() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState<any[]>([])

  // Buscar todas as tarefas
  async function loadTasks() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
    setTasks(data ?? [])
  }

  // Carregar ao abrir a página
  useEffect(() => {
    loadTasks()
  }, [])

  // Salvar nova tarefa
  async function addTask() {
    if (!task.trim()) return

    await supabase
      .from('tasks')
      .insert({ title: task })
    setTask('')
    loadTasks()
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Lista de Tarefas</h1>
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Digite uma tarefa"
      />
      <button onClick={addTask}>Adicionar</button>
      <ul>
        {tasks.map((t, i) => (
          <li key={t.id || i}>{t.title}</li>
        ))}
      </ul>
    </div>
  )
}