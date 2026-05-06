import { useEffect, useState } from 'react'
import { Trash2, Search, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { requestsApi } from '../../services/api'
import { Request } from '../../types'
import { PageLoader, EmptyState } from '../../components/ui/Spinner'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

type Filter = 'all' | 'today' | 'yesterday'
type Status = Request['status']

const STATUS_LABELS: Record<Status, { label: string; cls: string; icon: any }> = {
  new:         { label: 'New',         cls: 'badge-blue',   icon: MessageSquare },
  in_progress: { label: 'In Progress', cls: 'badge-amber',  icon: RefreshCw },
  done:        { label: 'Done',        cls: 'badge-green',  icon: CheckCircle },
  rejected:    { label: 'Rejected',    cls: 'badge-red',    icon: XCircle },
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const load = async (f: Filter = filter) => {
    setLoading(true)
    try {
      const r = f === 'today'
        ? await requestsApi.findToday()
        : f === 'yesterday'
        ? await requestsApi.findYesterday()
        : await requestsApi.findAll()
      setRequests(r.data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load(filter) }, [filter])

  const handleStatusChange = async (id: number, status: Status) => {
    setUpdatingId(id)
    try {
      await requestsApi.update(id, { status })
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      toast.success('Status updated')
    } finally { setUpdatingId(null) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await requestsApi.remove(deleteId)
    toast.success('Request deleted')
    setDeleteId(null)
    load()
  }

  const filtered = requests.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.phone.includes(search) ||
    (r.message || '').toLowerCase().includes(search.toLowerCase())
  )

  const counts = {
    new:         requests.filter(r => r.status === 'new').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    done:        requests.filter(r => r.status === 'done').length,
    rejected:    requests.filter(r => r.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Requests / Leads</h1>
          <p className="page-subtitle">{requests.length} total · {counts.new} new</p>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(STATUS_LABELS) as [Status, typeof STATUS_LABELS[Status]][]).map(([k, v]) => {
          const Icon = v.icon
          return (
            <div key={k} className={`${v.cls} flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold`}>
              <Icon size={12} />
              {v.label}: {counts[k]}
            </div>
          )
        })}
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {(['all', 'today', 'yesterday'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
                ${filter === f ? 'bg-white text-slate-900 shadow-card' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f === 'all' ? 'All' : f === 'today' ? 'Today' : 'Yesterday'}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-10" placeholder="Search requests..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <EmptyState message="No requests found" />
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map(r => {
              const s = STATUS_LABELS[r.status]
              const SIcon = s.icon
              return (
                <div key={r.id} className="px-5 py-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-700 font-bold text-sm">
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 text-sm">{r.name}</span>
                      <span className="font-mono text-xs text-slate-500">{r.phone}</span>
                    </div>
                    {r.message && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{r.message}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Clock size={11} className="text-slate-400" />
                      <span className="text-xs text-slate-400">
                        {new Date(r.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Status selector */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                      value={r.status}
                      disabled={updatingId === r.id}
                      onChange={e => handleStatusChange(r.id, e.target.value as Status)}
                      className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border-0 cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all
                        ${r.status === 'new'         ? 'bg-blue-50  text-blue-700'
                        : r.status === 'in_progress' ? 'bg-amber-50 text-amber-700'
                        : r.status === 'done'        ? 'bg-emerald-50 text-emerald-700'
                        :                              'bg-red-50   text-red-700'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <button onClick={() => setDeleteId(r.id)}
                      className="btn-ghost p-2 text-slate-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="This lead/request will be permanently deleted."
      />
    </div>
  )
}
