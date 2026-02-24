import { useState } from 'react'
import { ExternalLink, Clock, Users } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { useLoading } from '@/context/LoadingContext'
import { TableRowSkeleton } from '@/components/shared/Shimmer'

type SortField = 'name' | 'students' | 'completionRate'

function StatusBadge({ status }: { status: 'published' | 'draft' }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
        status === 'published'
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-gray-100 text-gray-500'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'published' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  )
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: 'asc' | 'desc' }) {
  return (
    <span className="ml-1 text-gray-300">
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )
}

export function CourseTable() {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const { isLoading } = useLoading()
  const { courses } = useAppContext()

  const sorted = [...courses].sort((a, b) => {
    let valA: string | number = a[sortField]
    let valB: string | number = b[sortField]
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('asc') }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden animate-slide-up">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base text-gray-900 font-semibold">Course Activity</h2>
          <p className="text-xs text-gray-400 mt-0.5">All courses for Spring 2026</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-[#004080] hover:underline font-medium">
          View all <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th
                className="text-left px-6 py-3 text-xs text-gray-500 font-semibold cursor-pointer select-none hover:text-gray-700 transition-colors"
                onClick={() => handleSort('name')}
              >
                Course <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
              </th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Status</th>
              <th
                className="text-left px-4 py-3 text-xs text-gray-500 font-semibold cursor-pointer select-none hover:text-gray-700 transition-colors"
                onClick={() => handleSort('students')}
              >
                Students <SortIcon field="students" sortField={sortField} sortDir={sortDir} />
              </th>
              <th
                className="text-left px-4 py-3 text-xs text-gray-500 font-semibold cursor-pointer select-none hover:text-gray-700 transition-colors"
                onClick={() => handleSort('completionRate')}
              >
                Completion <SortIcon field="completionRate" sortField={sortField} sortDir={sortDir} />
              </th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Pending</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              : sorted.map((course, idx) => (
                <tr
                  key={course.id}
                  className={`group border-t border-gray-50 hover:bg-blue-50/30 transition-colors ${idx % 2 !== 0 ? 'bg-gray-50/40' : ''}`}
                >
                  <td className="px-6 py-3.5">
                    <div>
                      <p className="text-sm text-gray-800 font-medium">{course.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{course.code}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={course.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      {course.students}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {course.status === 'published' ? (
                      <ProgressBar value={course.completionRate} showLabel className="min-w-[100px]" />
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {course.pendingSubmissions > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                        {course.pendingSubmissions} pending
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {course.lastActivity}
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}