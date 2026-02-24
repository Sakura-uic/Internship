import { useState } from 'react'
import { Search, Bell, ChevronDown, X } from 'lucide-react'
import { recentNotifications } from '@/data/mockData'

type NotificationItem = typeof recentNotifications[number]

const notifIcon = (type: string) => {
  const base = 'w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0'
  switch (type) {
    case 'submission': return <span className={`${base} bg-blue-100 text-blue-600`}>📝</span>
    case 'query': return <span className={`${base} bg-amber-100 text-amber-600`}>❓</span>
    case 'enrollment': return <span className={`${base} bg-green-100 text-green-600`}>🎓</span>
    default: return <span className={`${base} bg-gray-100 text-gray-600`}>ℹ️</span>
  }
}

export function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(recentNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 gap-4 flex-shrink-0">
      {/* Left: search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses, students, assignments…"
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all"
        />
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications((v) => !v); setShowProfile(false) }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5 text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-11 z-20 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-[#004080] hover:underline font-medium">
                        Mark all read
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100">
                      <X className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>
                <ul className="max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <li
                      key={notif.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/40' : ''}`}
                    >
                      {notifIcon(notif.type)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm text-gray-800 leading-snug ${notif.read ? 'font-normal' : 'font-medium'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-[#004080] rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs text-[#004080] hover:underline font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile((v) => !v); setShowNotifications(false) }}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#004080] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">PS</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm text-gray-800 leading-tight font-semibold">Prof. Sharma</p>
              <p className="text-xs text-gray-400 leading-tight">CS Dept.</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-11 z-20 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm text-gray-900 font-semibold">Prof. R. Sharma</p>
                  <p className="text-xs text-gray-400">sharma@iitk.ac.in</p>
                </div>
                {['My Profile', 'Account Settings', 'Help & Support'].map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowProfile(false)}
                  >
                    {item}
                  </button>
                ))}
                <div className="border-t border-gray-100 mt-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}