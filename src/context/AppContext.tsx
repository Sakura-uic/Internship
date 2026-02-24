import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import {
  courses as initialCourses,
  gradingQueue as initialQueue,
  students as initialStudents,
} from '@/data/mockData'

// ─── Types ────────────────────────────────────────────────────────────────────
export type Course = typeof initialCourses[0]
export type GradingItem = typeof initialQueue[0]
export type Student = typeof initialStudents[0]

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface AppContextType {
  // Courses
  courses: Course[]
  addCourse: (course: Omit<Course, 'id'>) => void
  updateCourseStatus: (id: string, status: 'published' | 'draft') => void

  // Grading
  gradingQueue: GradingItem[]
  gradeSubmission: (id: string, score: number, feedback: string) => void

  // KPI (derived/live)
  pendingGradingCount: number

  // Students
  students: Student[]

  // Toasts
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [gradingQueue, setGradingQueue] = useState<GradingItem[]>(initialQueue)
  const [students] = useState<Student[]>(initialStudents)
  const [toasts, setToasts] = useState<Toast[]>([])

  // ─── Courses ────────────────────────────────────────────────────────────────
  const addCourse = useCallback((course: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...course,
      id: `course-${Date.now()}`,
    }
    setCourses((prev) => [...prev, newCourse])
  }, [])

  const updateCourseStatus = useCallback(
    (id: string, status: 'published' | 'draft') => {
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      )
    },
    []
  )

  // ─── Grading ────────────────────────────────────────────────────────────────
  const gradeSubmission = useCallback(
    (_id: string, _score: number, _feedback: string) => {
      setGradingQueue((prev) => prev.filter((item) => item.id !== _id))
    },
    []
  )

  // ─── Toasts ─────────────────────────────────────────────────────────────────
  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}`
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <AppContext.Provider
      value={{
        courses,
        addCourse,
        updateCourseStatus,
        gradingQueue,
        gradeSubmission,
        pendingGradingCount: gradingQueue.length,
        students,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider')
  return ctx
}