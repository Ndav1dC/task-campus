'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Check, CheckCircle2, Circle, ClipboardList, Plus, Trash2 } from 'lucide-react'

type Task = {
  id: number
  title: string
  completed: boolean
}

const STORAGE_KEY = 'taskcampus-tasks'

// Pantalla principal: mantiene las tareas y conecta la interfaz con localStorage.
export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [error, setError] = useState('')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    try {
      const savedTasks = window.localStorage.getItem(STORAGE_KEY)
      if (savedTasks) setTasks(JSON.parse(savedTasks))
    } catch {
      setTasks([])
    } finally {
      setIsReady(true)
    }
  }, [])

  useEffect(() => {
    if (isReady) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks, isReady])

  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks])
  const pendingCount = tasks.length - completedCount

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = newTask.trim()
    if (!title) {
      setError('Escribe una tarea antes de guardarla.')
      return
    }
    setTasks((current) => [...current, { id: Date.now(), title, completed: false }])
    setNewTask('')
    setError('')
  }

  function toggleTask(id: number) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  function removeTask(id: number) {
    if (window.confirm('¿Seguro que quieres eliminar esta tarea?')) {
      setTasks((current) => current.filter((task) => task.id !== id))
    }
  }

  return (
    <main className="app-shell">
      <div className="ambient-shape ambient-shape-one" aria-hidden="true" />
      <div className="ambient-shape ambient-shape-two" aria-hidden="true" />
      <section className="task-container" aria-labelledby="page-title">
        <header className="hero-header">
          <div className="brand-mark" aria-hidden="true"><ClipboardList size={26} strokeWidth={2.5} /></div>
          <div>
            <p className="eyebrow">Organiza tu semestre</p>
            <h1 id="page-title">Task<span>Campus</span></h1>
          </div>
        </header>

        <div className="intro-row">
          <div>
            <h2>Mis tareas</h2>
            <p className="subtitle">Un paso a la vez. Tú puedes.</p>
          </div>
          <div className="progress-summary" aria-label={`${completedCount} de ${tasks.length} tareas completadas`}>
            <strong>{completedCount}/{tasks.length}</strong>
            <span>completadas</span>
          </div>
        </div>

        <form className="task-form" onSubmit={addTask} noValidate>
          <label htmlFor="new-task" className="sr-only">Nueva tarea</label>
          <input id="new-task" value={newTask} onChange={(event) => { setNewTask(event.target.value); if (error) setError('') }} placeholder="¿Qué necesitas hacer?" aria-describedby={error ? 'task-error' : undefined} aria-invalid={Boolean(error)} />
          <button type="submit" className="add-button"><Plus size={20} aria-hidden="true" /> <span>Agregar tarea</span></button>
        </form>
        {error && <p id="task-error" className="form-error" role="alert">{error}</p>}

        <div className="list-heading">
          <span>{pendingCount === 1 ? '1 tarea pendiente' : `${pendingCount} tareas pendientes`}</span>
          {tasks.length > 0 && <span className="list-rule" />}
        </div>

        <div className="task-list" aria-live="polite">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><CheckCircle2 size={30} /></div>
              <h3>Aún no tienes tareas</h3>
              <p>Agrega tu primera tarea para comenzar a organizarte.</p>
            </div>
          ) : tasks.map((task) => (
            <article className={`task-card ${task.completed ? 'is-completed' : ''}`} key={task.id}>
              <button className="status-button" onClick={() => toggleTask(task.id)} aria-label={task.completed ? `Desmarcar ${task.title}` : `Completar ${task.title}`}>
                {task.completed ? <CheckCircle2 size={25} /> : <Circle size={25} />}
              </button>
              <p className="task-title">{task.title}</p>
              <div className="task-actions">
                <button className="complete-button" onClick={() => toggleTask(task.id)}>{task.completed ? <><Check size={16} /> Desmarcar</> : 'Completar'}</button>
                <button className="delete-button" onClick={() => removeTask(task.id)}><Trash2 size={17} aria-hidden="true" /> <span>Eliminar</span></button>
              </div>
            </article>
          ))}
        </div>

        <footer className="app-footer"><span>Hecho para estudiantes</span><span className="footer-dot" /> <span>Simple. Claro. Tuyo.</span></footer>
      </section>
    </main>
  )
}
