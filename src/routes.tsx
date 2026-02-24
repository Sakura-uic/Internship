import { createBrowserRouter } from 'react-router'
import { Layout } from './components/dashboard/Layout'
import { Dashboard } from './pages/Dashboard'
import { Courses } from './pages/Courses'
import { Students } from './pages/Students'
import { Gradebook } from './pages/Gradebook'
import { Schedule } from './pages/Schedule'
import { Settings } from './pages/Settings'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'courses', Component: Courses },
      { path: 'students', Component: Students },
      { path: 'gradebook', Component: Gradebook },
      { path: 'schedule', Component: Schedule },
      { path: 'settings', Component: Settings },
    ],
  },
])