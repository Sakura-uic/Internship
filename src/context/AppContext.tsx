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

export type ActivityType = 'video' | 'assignment' | 'quiz' | 'document'
export type ActivityStatus = 'published' | 'draft' | 'scheduled'

export interface Activity {
  id: string
  courseId: string
  title: string
  description: string
  type: ActivityType
  youtubeUrl?: string
  youtubeId?: string
  duration?: string
  views: number
  endDate?: string
  status: ActivityStatus
  createdAt: string
}

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

  // Activities
  activities: Activity[]
  addActivity: (activity: Activity) => void
  removeActivity: (id: string) => void
  getActivitiesByCourseId: (courseId: string) => Activity[]

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

// ─── Seed activities ──────────────────────────────────────────────────────────
// courseId values must match your initialCourses ids from mockData
const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    courseId: 'course-1',
    title: 'Introduction to Algorithms',
    description: 'Overview of algorithm design principles and complexity analysis.',
    type: 'video',
    youtubeUrl: 'https://www.youtube.com/watch?v=rL8X2mlNHPM',
    youtubeId: 'rL8X2mlNHPM',
    duration: '45:20',
    views: 98,
    status: 'published',
    endDate: '2026-04-01',
    createdAt: '2026-03-01',
  },
  {
    id: 'act-2',
    courseId: 'course-1',
    title: 'Sorting Algorithms Deep Dive',
    description: 'Bubble sort, merge sort, quicksort — visual walkthroughs.',
    type: 'video',
    youtubeUrl: 'https://www.youtube.com/watch?v=kPRA0W1kECg',
    youtubeId: 'kPRA0W1kECg',
    duration: '38:05',
    views: 74,
    status: 'published',
    endDate: '2026-04-10',
    createdAt: '2026-03-05',
  },
]

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES)
  const [gradingQueue, setGradingQueue] = useState<GradingItem[]>(initialQueue)
  const [students] = useState<Student[]>(initialStudents)
  const [toasts, setToasts] = useState<Toast[]>([])

  // ─── Courses ────────────────────────────────────────────────────────────────
  const addCourse = useCallback((course: Omit<Course, 'id'>) => {
    const newCourse: Course = { ...course, id: `course-${Date.now()}` }
    setCourses((prev) => [...prev, newCourse])
  }, [])

  const updateCourseStatus = useCallback(
    (id: string, status: 'published' | 'draft') => {
      setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    },
    []
  )

  // ─── Activities ─────────────────────────────────────────────────────────────
  const addActivity = useCallback((activity: Activity) => {
    setActivities((prev) => [activity, ...prev])
  }, [])

  const removeActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const getActivitiesByCourseId = useCallback(
    (courseId: string) => activities.filter((a) => a.courseId === courseId),
    [activities]
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
        activities,
        addActivity,
        removeActivity,
        getActivitiesByCourseId,
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