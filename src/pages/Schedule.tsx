import { weeklySchedule } from '@/data/mockData'
import { cn } from '@/utils/cn'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const typeStyles: Record<string, string> = {
  lecture: 'bg-[#004080]/10 text-[#004080] border-l-2 border-[#004080]',
  lab: 'bg-purple-50 text-purple-700 border-l-2 border-purple-500',
  tutorial: 'bg-amber-50 text-amber-700 border-l-2 border-amber-500',
}

export function Schedule() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">Spring 2026 · Weekly teaching schedule</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        {Object.entries({ lecture: 'Lecture', lab: 'Lab', tutorial: 'Tutorial' }).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-sm', typeStyles[key].split(' ')[0])} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {days.map((day) => {
          const dayClasses = weeklySchedule.filter((s) => s.day === day)
          return (
            <div key={day} className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-sm font-semibold text-gray-700">{day}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{dayClasses.length} session{dayClasses.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="p-3 space-y-2">
                {dayClasses.length === 0 ? (
                  <p className="text-xs text-gray-300 text-center py-6">No classes</p>
                ) : (
                  dayClasses.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((session) => (
                    <div
                      key={session.id}
                      className={cn('p-3 rounded-lg text-xs', typeStyles[session.type])}
                    >
                      <div className="font-semibold">{session.course}</div>
                      <div className="mt-1 opacity-75 capitalize">{session.type}</div>
                      <div className="mt-1 font-medium">{session.startTime} – {session.endTime}</div>
                      <div className="mt-1 opacity-75">{session.venue}</div>
                      <div className="mt-1 opacity-75">{session.students} students</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* List View */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">All Sessions</h2>
          <p className="text-xs text-gray-400 mt-0.5">{weeklySchedule.length} sessions this week</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold">Course</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Type</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Day</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Time</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Venue</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">Students</th>
            </tr>
          </thead>
          <tbody>
            {weeklySchedule.map((session, idx) => (
              <tr key={session.id} className={cn('border-t border-gray-50 hover:bg-blue-50/30 transition-colors', idx % 2 !== 0 && 'bg-gray-50/40')}>
                <td className="px-6 py-3.5">
                  <span className="text-sm font-semibold text-gray-800">{session.course}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={cn('inline-flex px-2 py-0.5 rounded-md text-xs font-medium capitalize',
                    session.type === 'lecture' ? 'bg-[#004080]/10 text-[#004080]' :
                    session.type === 'lab' ? 'bg-purple-100 text-purple-700' :
                    'bg-amber-100 text-amber-700'
                  )}>
                    {session.type}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{session.day}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{session.startTime} – {session.endTime}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{session.venue}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{session.students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}