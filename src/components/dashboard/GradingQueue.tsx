import { useState } from 'react'
import { Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { useAppContext, type GradingItem } from '@/context/AppContext'
import { timeAgo } from '@/utils/cn'
import { useLoading } from '@/context/LoadingContext'
import { ListSkeleton } from '@/components/shared/Shimmer'
import { GradeModal } from './GradeModal'
import { cn } from '@/utils/cn'

const typeLabels: Record<string, { label: string; color: string }> = {
  assignment: { label: 'Assignment', color: 'bg-blue-100 text-blue-600' },
  lab: { label: 'Lab', color: 'bg-purple-100 text-purple-600' },
  quiz: { label: 'Quiz', color: 'bg-sky-100 text-sky-600' },
  project: { label: 'Project', color: 'bg-rose-100 text-rose-600' },
}

const priorityConfig: Record<string, { dot: string; label: string }> = {
  high: { dot: 'bg-red-500', label: 'High' },
  medium: { dot: 'bg-amber-400', label: 'Medium' },
  low: { dot: 'bg-emerald-400', label: 'Low' },
}

export function GradingQueue() {
  const { isLoading } = useLoading()
  const { gradingQueue, pendingGradingCount } = useAppContext()
  const [activeItem, setActiveItem] = useState<GradingItem | null>(null)

  if (isLoading) return <ListSkeleton rows={5} />

  const isEmpty = gradingQueue.length === 0

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base text-gray-900 font-semibold">Grading Queue</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {pendingGradingCount} submission{pendingGradingCount !== 1 ? 's' : ''} pending review
            </p>
          </div>
          {pendingGradingCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              Priority
            </span>
          )}
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700">All caught up!</p>
            <p className="text-xs text-gray-400 mt-1">No pending submissions to grade.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {gradingQueue.map((item) => {
              const type = typeLabels[item.type]
              const priority = priorityConfig[item.priority]
              return (
                <li key={item.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-[#004080]/10 text-[#004080] flex items-center justify-center flex-shrink-0 text-xs font-semibold mt-0.5">
                    {item.studentName.split(' ').map((n) => n[0]).join('')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 truncate font-medium">{item.studentName}</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{item.assignmentName}</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0 mt-0.5" title={`${priority.label} priority`}>
                        <span className={cn('w-2 h-2 rounded-full', priority.dot)} />
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={cn('inline-flex px-2 py-0.5 rounded-md text-xs font-medium', type.color)}>
                        {type.label}
                      </span>
                      <span className="text-xs text-gray-400">{item.courseCode}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {timeAgo(item.submittedAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveItem(item)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-[#004080] hover:underline mt-1 cursor-pointer font-medium"
                  >
                    Grade
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {!isEmpty && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <button className="flex items-center gap-1.5 text-xs text-[#004080] hover:underline font-medium">
              View all {pendingGradingCount} submissions <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {activeItem && (
        <GradeModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </>
  )
}