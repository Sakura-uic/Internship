import { UserPlus, ArrowRight } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { useLoading } from '@/context/LoadingContext'
import { ListSkeleton } from '@/components/shared/Shimmer'
import { cn } from '@/utils/cn'

const TODAY = '2026-02-21'

function enrolledToday(dateStr: string) {
  return dateStr.startsWith(TODAY)
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

const deptColors: Record<string, string> = {
  CSE: 'bg-[#004080]/10 text-[#004080]',
  EE:  'bg-purple-100 text-purple-700',
  ME:  'bg-amber-100 text-amber-700',
  CE:  'bg-emerald-100 text-emerald-700',
}

export function RecentEnrollments() {
  const { isLoading } = useLoading()
  const { students } = useAppContext()

  if (isLoading) return <ListSkeleton rows={5} />

  const todayStudents = students
    .filter((s) => enrolledToday(s.enrolledAt))
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())

  const total = students.length

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base text-gray-900 font-semibold">Today's Enrollments</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {todayStudents.length} new · {total} total enrolled
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#004080]/10 text-[#004080] rounded-lg text-xs font-semibold">
          <UserPlus className="w-3.5 h-3.5" />
          {todayStudents.length} today
        </span>
      </div>

      {/* Student grid */}
      {todayStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
            <UserPlus className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No enrollments today</p>
          <p className="text-xs text-gray-400 mt-1">New students will appear here when they enroll.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x-0">
          {todayStudents.map((student, idx) => {
            const initials = student.name.split(' ').map((n) => n[0]).join('')
            const deptColor = deptColors[student.department] ?? 'bg-gray-100 text-gray-600'

            return (
              <div
                key={student.id}
                className={cn(
                  'flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors',
                  idx !== 0 && idx % 2 !== 0 ? 'sm:border-l sm:border-gray-100' : '',
                  idx >= 2 ? 'border-t border-gray-50' : ''
                )}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-[#004080]/10 text-[#004080] flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">{student.name}</p>
                    {student.status === 'at-risk' && (
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" title="At risk" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-gray-400 font-mono">{student.rollNo}</span>
                    <span className="text-gray-200">·</span>
                    <span className="text-xs text-gray-400">Y{student.year}</span>
                  </div>
                </div>

                {/* Right: dept badge + time */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={cn('inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-semibold', deptColor)}>
                    {student.department}
                  </span>
                  <span className="text-[10px] text-gray-400">{formatTime(student.enrolledAt)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Enrolled courses summary row */}
      {todayStudents.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {Array.from(new Set(todayStudents.flatMap((s) => s.courses))).map((code) => (
              <span key={code} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 rounded-md text-xs font-medium">
                {code}
              </span>
            ))}
          </div>
          <button className="flex items-center gap-1 text-xs font-medium text-[#004080] hover:underline flex-shrink-0 ml-3">
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}