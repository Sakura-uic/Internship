import { useState } from 'react'
import { X, CheckCircle, Star } from 'lucide-react'
import { useAppContext, type GradingItem } from '@/context/AppContext'
import { cn } from '@/utils/cn'

interface GradeModalProps {
  item: GradingItem
  onClose: () => void
}

const typeLabels: Record<string, { label: string; color: string }> = {
  assignment: { label: 'Assignment', color: 'bg-blue-100 text-blue-600' },
  lab: { label: 'Lab', color: 'bg-purple-100 text-purple-600' },
  quiz: { label: 'Quiz', color: 'bg-sky-100 text-sky-600' },
  project: { label: 'Project', color: 'bg-rose-100 text-rose-600' },
}

export function GradeModal({ item, onClose }: GradeModalProps) {
  const { gradeSubmission, addToast } = useAppContext()
  const [score, setScore] = useState('')
  const [maxScore] = useState(100)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const scoreNum = Number(score)
  const isValid = score !== '' && scoreNum >= 0 && scoreNum <= maxScore

  const grade = !isValid ? null
    : scoreNum >= 90 ? 'A+'
    : scoreNum >= 80 ? 'A'
    : scoreNum >= 70 ? 'B+'
    : scoreNum >= 60 ? 'B'
    : scoreNum >= 50 ? 'C'
    : 'F'

  const gradeColor = !grade ? 'text-gray-400'
    : grade === 'F' ? 'text-red-500'
    : scoreNum >= 80 ? 'text-emerald-600'
    : 'text-amber-600'

  const handleSubmit = async () => {
    if (!isValid) return
    setSubmitting(true)
    // Simulate async save
    await new Promise((r) => setTimeout(r, 600))
    gradeSubmission(item.id, scoreNum, feedback)
    addToast(`Graded ${item.studentName} — ${scoreNum}/${maxScore} (${grade})`, 'success')
    setSubmitting(false)
    onClose()
  }

  const type = typeLabels[item.type]

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Grade Submission</h2>
            <p className="text-xs text-gray-400 mt-0.5">{item.courseCode}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Student info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-[#004080]/10 text-[#004080] flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {item.studentName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800">{item.studentName}</p>
              <p className="text-xs text-gray-400 truncate">{item.assignmentName}</p>
            </div>
            <span className={cn('inline-flex px-2 py-0.5 rounded-md text-xs font-medium ml-auto flex-shrink-0', type.color)}>
              {type.label}
            </span>
          </div>

          {/* Score input */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Score <span className="text-gray-300">/ {maxScore}</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  min={0}
                  max={maxScore}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Enter score"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all"
                  autoFocus
                />
              </div>
              {isValid && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className={cn('text-lg font-bold', gradeColor)}>{grade}</span>
                </div>
              )}
            </div>

            {/* Visual score bar */}
            {isValid && (
              <div className="mt-3">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      scoreNum >= 80 ? 'bg-emerald-500' : scoreNum >= 60 ? 'bg-amber-400' : 'bg-red-400'
                    )}
                    style={{ width: `${(scoreNum / maxScore) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>0</span>
                  <span className="text-gray-500 font-medium">{scoreNum} / {maxScore}</span>
                  <span>{maxScore}</span>
                </div>
              </div>
            )}
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Feedback <span className="text-gray-300 font-normal">(optional)</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add comments or feedback for the student…"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all resize-none"
            />
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
            disabled={!isValid || submitting}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all',
              isValid && !submitting
                ? 'bg-[#004080] hover:bg-[#005299] active:scale-[0.98]'
                : 'bg-gray-300 cursor-not-allowed'
            )}
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Submit Grade
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}