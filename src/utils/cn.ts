import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export function timeAgo(dateString: string): string {
  const now = new Date('2026-02-21T10:00:00')
  const submitted = new Date(dateString)
  const diffMs = now.getTime() - submitted.getTime()
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffH < 1) return '< 1 hour ago'
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.floor(diffH / 24)
  return `${diffD}d ago`
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function daysUntil(dateStr: string): number {
  const today = new Date('2026-02-21')
  const target = new Date(dateStr)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}