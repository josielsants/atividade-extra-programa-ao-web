'use client'

import { useState, useEffect } from 'react'
import { Task } from './types'

/**
 * Componente Principal da Aplicação Todo
 */
export default function Home() {
  // Estados para gerenciar a lista de tarefas, entrada do usuário, carregamento e erros
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Buscar todas as tarefas através da API (/api/tasks)
   */
  async function loadTasks() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) throw new Error('Falha ao carregar tarefas')
      const data = await response.json()
      setTasks(data ?? [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }

  // Efeito para carregar as tarefas assim que o componente é montado
  useEffect(() => {
    loadTasks()
  }, [])

  /**
   * Adicionar uma nova tarefa usando o método POST da API
   */
  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!task.trim()) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task })
      })

      if (!response.ok) throw new Error('Erro ao adicionar tarefa')
      
      setTask('')
      loadTasks() // Recarrega a lista para mostrar a nova tarefa
    } catch (err: unknown) {
      alert('Erro ao adicionar tarefa: ' + (err instanceof Error ? err.message : 'Erro desconhecido'))
    }
  }

  /**
   * Alternar o status de conclusão da tarefa usando o método PATCH da API
   */
  async function toggleTask(id: string | number, currentStatus: boolean) {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_completed: !currentStatus })
      })

      if (!response.ok) throw new Error('Erro ao atualizar tarefa')
      
      loadTasks()
    } catch (err: unknown) {
      alert('Erro ao atualizar tarefa: ' + (err instanceof Error ? err.message : 'Erro desconhecido'))
    }
  }

  /**
   * Excluir uma tarefa usando o método DELETE da API
   */
  async function deleteTask(id: string | number) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return

    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao excluir tarefa')
      
      loadTasks()
    } catch (err: unknown) {
      alert('Erro ao excluir tarefa: ' + (err instanceof Error ? err.message : 'Erro desconhecido'))
    }
  }

  // Cálculos para o Dashboard
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.is_completed).length
  const pendingTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-12">
      <div className="max-w-2xl mx-auto">
        
        {/* Cabeçalho da Aplicação */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-emerald-400">
            Minhas Tarefas
          </h1>
          <p className="text-slate-400 mt-2">Organize seu dia com precisão</p>
        </header>

        {/* Dashboard de Estatísticas */}
        <section className="grid grid-cols-3 gap-4 mb-10">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
            <span className="text-blue-400 text-2xl font-bold block">{totalTasks}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total</span>
          </div>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
            <span className="text-emerald-400 text-2xl font-bold block">{completedTasks}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Concluídas</span>
          </div>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
            <span className="text-orange-400 text-2xl font-bold block">{pendingTasks}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Pendentes</span>
          </div>
          
          {/* Barra de Progresso do Dashboard */}
          <div className="col-span-3 mt-2">
            <div className="flex justify-between text-xs text-slate-400 mb-1 px-1">
              <span>Progresso Geral</span>
              <span>{completionRate}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-linear-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Card Principal de Interação */}
        <div className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
          
          {/* Formulário para Adicionar Tarefa */}
          <form onSubmit={addTask} className="flex gap-2 mb-8">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="O que precisa ser feito?"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500 text-white"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/30 active:scale-95"
            >
              Adicionar
            </button>
          </form>

          {/* Exibição de Erros */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Lista de Tarefas ou Loader */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ul className="space-y-3">
              {tasks.length === 0 ? (
                <li className="text-center py-12 text-slate-500 italic">
                  Nenhuma tarefa encontrada. Comece adicionando uma acima!
                </li>
              ) : (
                tasks.map((t) => (
                  <li
                    key={t.id}
                    className="group flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Checkbox Customizado */}
                      <button
                        onClick={() => toggleTask(t.id, t.is_completed)}
                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${t.is_completed
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-slate-500 hover:border-blue-400'
                          }`}
                      >
                        {t.is_completed && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span className={`text-lg transition-all ${t.is_completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {t.title}
                      </span>
                    </div>
                    {/* Botão de Excluir */}
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all"
                      title="Excluir tarefa"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}