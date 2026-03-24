/**
 * Interface que representa uma tarefa no sistema
 */
export interface Task {
  id: string | number;      // ID único da tarefa
  title: string;          // O que deve ser feito
  is_completed: boolean;  // Se já foi concluída
  created_at?: string;    // Data/hora de criação
}
