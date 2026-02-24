import { CalendarDays, MapPin, Users } from 'lucide-react'
import { upcomingExams } from '@/data/mockData'
import { formatDate, daysUntil } from '@/utils/cn'
import { useLoading } from '@/context/LoadingContext'
import { ListSkeleton } from '@/components/shared/Shimmer'
import { cn } from '@/utils/cn'

export function UpcomingExams() {
  const { isLoading } = useLoading()

  if (isLoading) return <ListSkeleton rows={3} />

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden animate-slide-up">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base text-gray-900 font-semibold">Upcoming Exams</h2>
          <p className="text-xs text-gray-400 mt-0.5">Next 14 days schedule</p>
        </div>
        <CalendarDays className="w-4 h-4 text-gray-400" />
      </div>

      <ul className="divide-y divide-gray-50">
        {upcomingExams.map((exam) => {
          const days = daysUntil(exam.date)
          const urgency =
            days <= 3 ? 'text-red-500 bg-red-50' :
            days <= 7 ? 'text-amber-600 bg-amber-50' :
            'text-emerald-600 bg-emerald-50'

          return (
            <li key={exam.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
              <div className={cn('flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center', urgency)}>
                <span className="text-lg leading-none font-bold">{days}</span>
                <span className="text-[10px] mt-0.5">days</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium">{exam.title}</p>
                <p className="text-xs text-[#004080] mt-0.5 font-medium">
                  {exam.course} • {exam.courseName}
                </p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <CalendarDays className="w-3 h-3" />
                    {formatDate(exam.date)} at {exam.time}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />
                    {exam.venue}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Users className="w-3 h-3" />
                    {exam.totalStudents}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}