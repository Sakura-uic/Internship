import { type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { KPICardSkeleton } from '@/components/shared/Shimmer'
import { ProgressBar } from '@/components/shared/ProgressBar'

interface KPICardProps {
  title: string
  value: string | number
  detail?: string
  icon: ReactNode
  variant?: 'default' | 'warning' | 'success' | 'info'
  loading?: boolean
  error?: boolean
  footer?: ReactNode
  trend?: {
    value: number
    label: string
  }
}

export function KPICard({
  title,
  value,
  detail,
  icon,
  variant = 'default',
  loading = false,
  error = false,
  footer,
  trend,
}: KPICardProps) {
  if (loading) return <KPICardSkeleton />

  if (error) {
    return (
      <div className="p-6 bg-white border border-red-100 rounded-xl shadow-card">
        <p className="text-sm text-red-500">Error loading data.</p>
      </div>
    )
  }

  const iconBg: Record<string, string> = {
    default: 'bg-[#004080]/10 text-[#004080]',
    warning: 'bg-amber-100 text-amber-600',
    success: 'bg-emerald-100 text-emerald-600',
    info: 'bg-sky-100 text-sky-600',
  }

  const cardBorder =
    variant === 'warning'
      ? 'border-amber-200 bg-amber-50/30'
      : 'border-gray-100 bg-white'

  const trendPositive = trend && trend.value >= 0

  return (
    <div
      className={cn(
        'p-6 border rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 animate-slide-up',
        cardBorder
      )}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1 leading-tight">
            {value}
          </h3>
          {detail && (
            <p className="text-xs text-gray-400 mt-2">{detail}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  'text-xs font-medium',
                  trendPositive ? 'text-emerald-600' : 'text-red-500'
                )}
              >
                {trendPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('p-2.5 rounded-xl flex-shrink-0', iconBg[variant])}>
          {icon}
        </div>
      </div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-100">{footer}</div>
      )}
    </div>
  )
}

interface CompletionKPICardProps {
  rate: number
  loading?: boolean
}

export function CompletionKPICard({ rate, loading = false }: CompletionKPICardProps) {
  if (loading) return <KPICardSkeleton />

  return (
    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 animate-slide-up">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium">Completion Rate</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1 leading-tight">{rate}%</h3>
          <p className="text-xs text-gray-400 mt-2">Across all published courses</p>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 flex-shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-[#004080]">{rate}%</span>
        </div>
        <ProgressBar value={rate} color="green" size="md" />
      </div>
    </div>
  )
}