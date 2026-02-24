import { gradeDistribution, courses, students } from '@/data/mockData'
import { cn } from '@/utils/cn'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function Gradebook() {
  const published = courses.filter((c) => c.status === 'published')

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gradebook</h1>
        <p className="text-sm text-gray-500 mt-1">Grade distribution and performance overview</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Grade Distribution Chart */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-card p-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">Grade Distribution</h2>
            <p className="text-xs text-gray-400 mt-0.5">CS301 — Data Structures & Algorithms</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="grade" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #f3f4f6', fontSize: 12 }}
                  formatter={(value: number) => [`${value} students`, 'Count']}
                />
                <Bar dataKey="count" fill="#004080" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Grade legend */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
            {gradeDistribution.map((g) => (
              <div key={g.grade} className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">{g.grade}</span>
                <span className="text-gray-700 font-semibold">{g.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Performance Overview */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-card p-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">Course Performance</h2>
            <p className="text-xs text-gray-400 mt-0.5">Completion rates for published courses</p>
          </div>
          <div className="space-y-4">
            {published.map((course) => (
              <div key={course.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-sm text-gray-700 font-medium">{course.code}</span>
                    <span className="text-xs text-gray-400 ml-2">{course.students} students</span>
                  </div>
                  <span className={cn(
                    'text-xs font-semibold',
                    course.completionRate >= 85 ? 'text-emerald-600' :
                    course.completionRate >= 70 ? 'text-amber-600' : 'text-red-500'
                  )}>
                    {course.completionRate}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      course.completionRate >= 85 ? 'bg-emerald-500' :
                      course.completionRate >= 70 ? 'bg-amber-400' : 'bg-red-400'
                    )}
                    style={{ width: `${course.completionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Student Performance Overview</h2>
          <p className="text-xs text-gray-400 mt-0.5">Sorted by average score</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold">Student</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Courses</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Avg Score</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Attendance</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Grade</th>
              </tr>
            </thead>
            <tbody>
              {[...students].sort((a, b) => b.avgScore - a.avgScore).map((student, idx) => {
                const grade =
                  student.avgScore >= 90 ? 'A+' :
                  student.avgScore >= 80 ? 'A' :
                  student.avgScore >= 70 ? 'B+' :
                  student.avgScore >= 60 ? 'B' : 'C'
                return (
                  <tr key={student.id} className={cn('border-t border-gray-50 hover:bg-blue-50/30 transition-colors', idx % 2 !== 0 && 'bg-gray-50/40')}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#004080]/10 text-[#004080] flex items-center justify-center text-xs font-semibold">
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-800 font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1">
                        {student.courses.map((c) => (
                          <span key={c} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('text-sm font-semibold',
                        student.avgScore >= 85 ? 'text-emerald-600' :
                        student.avgScore >= 70 ? 'text-gray-700' : 'text-red-500'
                      )}>
                        {student.avgScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-gray-600">{student.attendance}%</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex px-2 py-0.5 bg-[#004080]/10 text-[#004080] rounded-md text-xs font-semibold">
                        {grade}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}