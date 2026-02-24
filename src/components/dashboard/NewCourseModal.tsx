import { useState } from 'react'
import { X, BookOpen } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { cn } from '@/utils/cn'

interface NewCourseModalProps {
  onClose: () => void
}

export function NewCourseModal({ onClose }: NewCourseModalProps) {
  const { addCourse, addToast } = useAppContext()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    code: '',
    status: 'draft' as 'published' | 'draft',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Course name is required'
    if (!form.code.trim()) e.code = 'Course code is required'
    else if (!/^[A-Z]{2,4}\d{3}$/i.test(form.code.trim()))
      e.code = 'Format: CS101'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))
    addCourse({
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      status: form.status,
      students: 0,
      completionRate: 0,
      pendingSubmissions: 0,
      lastActivity: 'Just now',
    })
    addToast(`"${form.name}" created as ${form.status}`, 'success')
    setSubmitting(false)
    onClose()
  }

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#004080]/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#004080]" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">New Course</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Course Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Course Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Introduction to Algorithms"
              className={cn(
                'w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all',
                errors.name
                  ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10'
              )}
              autoFocus
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Course Code */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Course Code <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => set('code', e.target.value.toUpperCase())}
              placeholder="e.g. CS402"
              maxLength={7}
              className={cn(
                'w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all font-mono',
                errors.code
                  ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10'
              )}
            />
            {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Initial Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['draft', 'published'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => set('status', s)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                    form.status === s
                      ? s === 'published'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-[#004080]/30 bg-[#004080]/5 text-[#004080]'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  )}
                >
                  <span className={cn('w-2 h-2 rounded-full flex-shrink-0',
                    form.status === s
                      ? s === 'published' ? 'bg-emerald-500' : 'bg-[#004080]'
                      : 'bg-gray-300'
                  )} />
                  {s === 'draft' ? 'Save as Draft' : 'Publish Now'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {form.status === 'draft'
                ? 'Draft courses are not visible to students.'
                : 'Published courses are immediately visible to students.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all',
              !submitting
                ? 'bg-[#004080] hover:bg-[#005299] active:scale-[0.98]'
                : 'bg-gray-300 cursor-not-allowed'
            )}
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating…
              </>
            ) : (
              'Create Course'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}