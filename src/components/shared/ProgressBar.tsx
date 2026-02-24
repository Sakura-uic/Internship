import { cn } from '@/utils/cn'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
  color?: 'blue' | 'green' | 'amber' | 'red' | 'auto'
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = false,
  size = 'sm',
  color = 'auto',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const autoColor =
    percentage >= 85
      ? 'bg-emerald-500'
      : percentage >= 70
      ? 'bg-amber-400'
      : 'bg-red-400'

  const colorClass =
    color === 'auto'
      ? autoColor
      : color === 'blue'
      ? 'bg-[#004080]'
      : color === 'green'
      ? 'bg-emerald-500'
      : color === 'amber'
      ? 'bg-amber-400'
      : 'bg-red-400'

  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2.5'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 bg-gray-100 rounded-full overflow-hidden', heightClass)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 font-medium w-8 text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}