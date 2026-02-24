import { NavLink } from 'react-router'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/gradebook', label: 'Gradebook', icon: ClipboardList },
  { to: '/schedule', label: 'Schedule', icon: Calendar },
  { to: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'relative flex flex-col h-full bg-[#004080] transition-all duration-300 ease-in-out flex-shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo / Brand */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-5 border-b border-white/10',
          collapsed && 'justify-center'
        )}
      >
        <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-[#004080]" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white text-sm font-bold leading-tight whitespace-nowrap">
              IIT Kanpur
            </p>
            <p className="text-white/60 text-xs whitespace-nowrap">
              Learning Management
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                    isActive
                      ? 'bg-white text-[#004080]'
                      : 'text-white/75 hover:bg-white/10 hover:text-white',
                    collapsed && 'justify-center'
                  )
                }
                title={collapsed ? label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'flex-shrink-0 w-5 h-5',
                        isActive ? 'text-[#004080]' : 'text-white/75 group-hover:text-white'
                      )}
                    />
                    {!collapsed && (
                      <span
                        className={cn(
                          'text-sm whitespace-nowrap',
                          isActive ? 'font-semibold' : 'font-normal'
                        )}
                      >
                        {label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Semester info */}
      {!collapsed && (
        <div className="mx-3 mb-4 px-3 py-3 bg-white/10 rounded-lg">
          <p className="text-white/50 text-xs font-medium">Current Semester</p>
          <p className="text-white text-sm font-semibold mt-0.5">Spring 2026</p>
          <p className="text-white/50 text-xs mt-0.5">Jan – May 2026</p>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
        )}
      </button>
    </aside>
  )
}