import { useEffect, useState } from 'react'
import {
  GraduationCap, Users, BookOpen, MessageSquare,
  TrendingDown, DollarSign, UserCheck, CalendarDays,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import { reportsApi } from '../../services/api'
import { DashboardSummary } from '../../types'
import { PageLoader } from '../../components/ui/Spinner'
import StatCard from '../../components/ui/StatCard'
import { useAuth } from '../../context/AuthContext'

const monthlyData = [
  { month: 'Aug', students: 38, revenue: 19000000 },
  { month: 'Sep', students: 42, revenue: 21000000 },
  { month: 'Oct', students: 45, revenue: 22500000 },
  { month: 'Nov', students: 48, revenue: 24000000 },
  { month: 'Dec', students: 44, revenue: 22000000 },
  { month: 'Jan', students: 52, revenue: 26000000 },
]

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n)

export default function DashboardPage() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportsApi.getSummary()
      .then(r => setSummary(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  const stats = summary ?? {
    totalStudents: 0, activeStudents: 0, studentsLeftThisMonth: 0,
    totalTeachers: 0, totalGroups: 0, todayRequests: 0,
    yesterdayRequests: 0, monthlyRevenue: 0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back, <span className="font-semibold text-primary-600">{user?.fullName}</span>
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          subtitle={`${stats.activeStudents} active`}
        />
        <StatCard
          label="Teachers"
          value={stats.totalTeachers}
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Groups"
          value={stats.totalGroups}
          icon={BookOpen}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          label="Monthly Revenue"
          value={`${fmt(stats.monthlyRevenue)} UZS`}
          icon={DollarSign}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Left This Month"
          value={stats.studentsLeftThisMonth}
          icon={TrendingDown}
          iconBg="bg-red-50"
          iconColor="text-red-500"
          subtitle="Inactive students"
        />
        <StatCard
          label="Today's Requests"
          value={stats.todayRequests}
          icon={MessageSquare}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
        />
        <StatCard
          label="Yesterday Requests"
          value={stats.yesterdayRequests}
          icon={CalendarDays}
          iconBg="bg-slate-100"
          iconColor="text-slate-500"
        />
        <StatCard
          label="Active Students"
          value={stats.activeStudents}
          icon={UserCheck}
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
          subtitle={`of ${stats.totalStudents} total`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="card p-5 xl:col-span-3">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Student Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6270f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6270f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                itemStyle={{ color: '#6270f1' }}
              />
              <Area
                type="monotone" dataKey="students" stroke="#6270f1"
                strokeWidth={2.5} fill="url(#grad)" dot={{ fill: '#6270f1', strokeWidth: 0, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5 xl:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1e6}M`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                formatter={(v: number) => [`${fmt(v)} UZS`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#6270f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
