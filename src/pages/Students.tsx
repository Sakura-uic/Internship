import { useState } from 'react'
import { Search, UserCheck, AlertTriangle, ChevronDown, ChevronUp, Mail, BookOpen } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { cn } from '@/utils/cn'

type Student = ReturnType<typeof useAppContext>['students'][0]

function StudentDetailPanel({ student }: { student: Student }) {
  const scoreColor =
    student.avgScore >= 85 ? 'text-emerald-600 bg-emerald-50' :
    student.avgScore >= 70 ? 'text-amber-700 bg-amber-50' :
    'text-red-600 bg-red-50'

  const grade =
    student.avgScore >= 90 ? 'A+' :
    student.avgScore >= 80 ? 'A' :
    student.avgScore >= 70 ? 'B+' :
    student.avgScore >= 60 ? 'B' : 'C'

  return (
    <tr className="animate-fade-in">
      <td colSpan={7} className="px-6 pb-4 pt-0">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Contact</p>
              <a href={`mailto:${student.email}`} className="flex items-center gap-1.5 text-xs text-[#004080] hover:underline">
                <Mail className="w-3 h-3" />
                {student.email}
              </a>
              <p className="text-xs text-gray-500 mt-1">Roll No: <span className="font-mono font-medium">{student.rollNo}</span></p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Performance</p>
              <div className="flex items-center gap-2">
                <span className={cn('px-2 py-0.5 rounded-md text-sm font-bold', scoreColor)}>{grade}</span>
                <span className="text-sm font-semibold text-gray-700">{student.avgScore}%</span>
              </div>
              <div className="mt-2">
                <p className="text-[10px] text-gray-400 mb-1">Attendance</p>
                <ProgressBar value={student.attendance} showLabel size="sm" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Enrolled Courses</p>
              <div className="flex flex-wrap gap-1">
                {student.courses.map((c) => (
                  <span key={c} className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 font-medium">
                    <BookOpen className="w-2.5 h-2.5 text-[#004080]" />
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Actions</p>
              <div className="flex flex-col gap-1.5">
                <button className="text-left text-xs font-medium text-[#004080] hover:underline">View full profile →</button>
                <button className="text-left text-xs font-medium text-[#004080] hover:underline">Send message →</button>
                {student.status === 'at-risk' && (
                  <button className="text-left text-xs font-medium text-amber-600 hover:underline">Flag for counseling →</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}

export function Students() {
  const { students } = useAppContext()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'at-risk'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.includes(search) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || s.status === filterStatus
    return matchSearch && matchStatus
  })

  const atRisk = students.filter((s) => s.status === 'at-risk').length

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-1">{students.length} total · {atRisk} at-risk</p>
        </div>
        {atRisk > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-700 font-medium">{atRisk} students need attention</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, roll number, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {(['all', 'active', 'at-risk'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                'px-3 py-1 rounded-md text-xs transition-colors capitalize',
                filterStatus === s ? 'bg-white text-[#004080] shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 -mt-3">Click a row to see student details</p>

      <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold">Student</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Roll No.</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Dept / Year</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Courses</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Avg Score</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Attendance</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, idx) => {
                const isExpanded = expandedId === student.id
                return (
                  <>
                    <tr
                      key={student.id}
                      onClick={() => setExpandedId(isExpanded ? null : student.id)}
                      className={cn(
                        'border-t border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer select-none',
                        idx % 2 !== 0 && !isExpanded ? 'bg-gray-50/40' : '',
                        isExpanded ? 'bg-blue-50/40' : ''
                      )}
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#004080]/10 text-[#004080] flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {student.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm text-gray-800 font-medium">{student.name}</p>
                            <p className="text-xs text-gray-400">{student.email}</p>
                          </div>
                          <span className="ml-auto">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-300" />}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><span className="text-sm text-gray-600 font-mono">{student.rollNo}</span></td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-gray-600">{student.department}</span>
                        <span className="text-xs text-gray-400 ml-1">· Y{student.year}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {student.courses.map((c) => (
                            <span key={c} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{c}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn('text-sm font-semibold',
                          student.avgScore >= 85 ? 'text-emerald-600' : student.avgScore >= 70 ? 'text-gray-700' : 'text-red-500'
                        )}>
                          {student.avgScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2 min-w-[80px]">
                          <ProgressBar value={student.attendance} size="sm" className="flex-1" />
                          <span className="text-xs text-gray-500 w-7 text-right">{student.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {student.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                            <UserCheck className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-md text-xs font-medium">
                            <AlertTriangle className="w-3 h-3" /> At Risk
                          </span>
                        )}
                      </td>
                    </tr>
                    {isExpanded && <StudentDetailPanel key={`detail-${student.id}`} student={student} />}
                  </>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400">No students match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}