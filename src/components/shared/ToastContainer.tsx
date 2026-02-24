import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useAppContext, type Toast } from '@/context/AppContext'
import { cn } from '@/utils/cn'

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useAppContext()

  const config = {
    success: {
      icon: CheckCircle,
      classes: 'bg-white border-emerald-200 text-emerald-700',
      iconClass: 'text-emerald-500',
    },
    error: {
      icon: XCircle,
      classes: 'bg-white border-red-200 text-red-700',
      iconClass: 'text-red-500',
    },
    info: {
      icon: Info,
      classes: 'bg-white border-blue-200 text-blue-700',
      iconClass: 'text-blue-500',
    },
  }[toast.type]

  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium animate-slide-up max-w-sm',
        config.classes
      )}
    >
      <Icon className={cn('w-4 h-4 flex-shrink-0', config.iconClass)} />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useAppContext()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}