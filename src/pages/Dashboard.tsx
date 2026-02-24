import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { KPICard, CompletionKPICard } from '@/components/ui/KPICard'
import { RecentEnrollments } from '@/components/charts/RecentEnrollments'
import { CourseTable } from '@/components/dashboard/CourseTable'
import { GradingQueue } from '@/components/dashboard/GradingQueue'
import { UpcomingExams } from '@/components/dashboard/UpcomingExams'
import { kpiData } from '@/data/mockData'
import { useLoading } from '@/context/LoadingContext'
import { useAppContext } from '@/context/AppContext'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function Dashboard() {
  const { isLoading } = useLoading()
  const { pendingGradingCount, courses } = useAppContext()

  const publishedCount = courses.filter((c) => c.status === 'published').length
  const draftCount = courses.filter((c) => c.status === 'draft').length

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, Prof. Sharma 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Spring 2026 · Here's what's happening across your courses today.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Students"
          value={kpiData.totalStudents}
          detail="Across all your courses"
          icon={<Users className="w-5 h-5" />}
          variant="default"
          loading={isLoading}
          trend={{ value: 12, label: 'vs last semester' }}
        />
        <KPICard
          title="Active Courses"
          value={courses.length}
          detail={`${publishedCount} published · ${draftCount} drafts`}
          icon={<BookOpen className="w-5 h-5" />}
          variant="info"
          loading={isLoading}
        />
        <KPICard
          title="Pending Grading"
          value={pendingGradingCount}
          detail="Submissions awaiting review"
          icon={<ClipboardList className="w-5 h-5" />}
          variant={pendingGradingCount > 0 ? 'warning' : 'success'}
          loading={isLoading}
          trend={{ value: -8, label: 'vs last week' }}
        />
        <CompletionKPICard rate={kpiData.completionRate} loading={isLoading} />
        <KPICard
          title="Avg. Attendance"
          value={`${kpiData.avgAttendance}%`}
          detail="This week across courses"
          icon={<TrendingUp className="w-5 h-5" />}
          variant="success"
          loading={isLoading}
          trend={{ value: 3, label: 'vs last week' }}
        />
        <KPICard
          title="Upcoming Deadlines"
          value={kpiData.upcomingDeadlines}
          detail="In the next 7 days"
          icon={<Calendar className="w-5 h-5" />}
          variant="warning"
          loading={isLoading}
        />
      </div>

      {/* Bottom Row: Course Table + Upcoming Exams */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CourseTable />
        </div>
        <div>
          <UpcomingExams />
        </div>
      </div>
      
      {/* Middle Row: Chart + Grading Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentEnrollments />
        </div>
        <div>
          <GradingQueue />
        </div>
      </div>

      
    </div>
  )
}