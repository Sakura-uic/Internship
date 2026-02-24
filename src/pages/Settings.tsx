import { Bell, Lock, User } from 'lucide-react'
import { useState } from 'react'

interface ToggleProps {
  enabled: boolean
  onChange: (v: boolean) => void
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        enabled ? 'bg-[#004080]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export function Settings() {
  const [notifs, setNotifs] = useState({ submissions: true, queries: true, enrollments: false, reminders: true })
  const [profile, setProfile] = useState({ name: 'Prof. R. Sharma', email: 'sharma@iitk.ac.in', department: 'Computer Science & Engineering', designation: 'Associate Professor' })

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
          <User className="w-4 h-4 text-[#004080]" />
          <h2 className="text-sm font-semibold text-gray-900">Profile</h2>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#004080] flex items-center justify-center text-white text-xl font-bold">
            PS
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{profile.email}</p>
            <button className="text-xs text-[#004080] hover:underline mt-1">Change photo</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', key: 'name' as const },
            { label: 'Email Address', key: 'email' as const },
            { label: 'Department', key: 'department' as const },
            { label: 'Designation', key: 'designation' as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
              <input
                type="text"
                value={profile[key]}
                onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
          <button className="px-4 py-2 bg-[#004080] text-white text-sm font-medium rounded-lg hover:bg-[#005299] transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
          <Bell className="w-4 h-4 text-[#004080]" />
          <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: 'submissions' as const, label: 'New Submissions', desc: 'When students submit assignments or labs' },
            { key: 'queries' as const, label: 'Student Queries', desc: 'When students raise questions or doubts' },
            { key: 'enrollments' as const, label: 'Enrollments', desc: 'When new students enroll in your courses' },
            { key: 'reminders' as const, label: 'Deadline Reminders', desc: 'Reminders 24h before deadlines' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <Toggle enabled={notifs[key]} onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
          <Lock className="w-4 h-4 text-[#004080]" />
          <h2 className="text-sm font-semibold text-gray-900">Security</h2>
        </div>
        <button className="text-sm font-medium text-[#004080] hover:underline">
          Change password →
        </button>
        <p className="text-xs text-gray-400 mt-1">Last changed 3 months ago</p>
      </div>
    </div>
  )
}