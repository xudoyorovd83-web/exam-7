import { ReactNode } from 'react'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconBg: string
  iconColor: string
  trend?: { value: number; label: string }
  subtitle?: string
}

export default function StatCard({ label, value, icon: Icon, iconBg, iconColor, trend, subtitle }: StatCardProps) {
  return (
    <div className="stat-card hover:shadow-card-hover transition-shadow duration-200">
      <div className={`stat-icon ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium
            ${trend.value > 0 ? 'text-emerald-600' : trend.value < 0 ? 'text-red-500' : 'text-slate-400'}`}>
            {trend.value > 0 ? <TrendingUp size={12} /> : trend.value < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
            {trend.label}
          </div>
        )}
      </div>
    </div>
  )
}
