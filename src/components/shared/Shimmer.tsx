import { cn } from '@/utils/cn'

interface ShimmerProps {
  className?: string
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      className={cn(
        'shimmer rounded bg-gray-200',
        className
      )}
    />
  )
}

export function KPICardSkeleton() {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-card animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-3">
          <Shimmer className="h-3.5 w-2/3" />
          <Shimmer className="h-8 w-1/2" />
          <Shimmer className="h-3 w-3/4" />
        </div>
        <Shimmer className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-t border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Shimmer className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Shimmer className="h-4 w-32" />
          <Shimmer className="h-3 w-48" />
        </div>
        <Shimmer className="h-8 w-48 rounded-lg" />
      </div>
      <Shimmer className="h-52 w-full rounded-lg" />
    </div>
  )
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <div className="space-y-2">
          <Shimmer className="h-4 w-36" />
          <Shimmer className="h-3 w-48" />
        </div>
        <Shimmer className="h-6 w-20 rounded-lg" />
      </div>
      <div className="divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 px-6 py-4">
            <Shimmer className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-3.5 w-40" />
              <Shimmer className="h-3 w-56" />
              <div className="flex gap-2 mt-2">
                <Shimmer className="h-5 w-16 rounded-md" />
                <Shimmer className="h-5 w-12 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}