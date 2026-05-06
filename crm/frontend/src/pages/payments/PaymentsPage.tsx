import { useEffect, useState } from 'react'
import { Plus, Trash2, Search, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import { paymentsApi, studentsApi } from '../../services/api'
import { Payment, Student } from '../../types'
import { PageLoader, EmptyState } from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const today = () => new Date().toISOString().split('T')[0]
const EMPTY = { studentId: '', amount: '', date: today(), note: '' }

const fmt = (n: number) =>
  new Intl.NumberFormat('uz-UZ').format(n) + ' UZS'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const load = async () => {
    setLoading(true)
    try {
      const [pr, sr] = await Promise.all([paymentsApi.findAll(), studentsApi.findAll()])
      setPayments(pr.data)
      setStudents(sr.data)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!form.studentId || !form.amount || !form.date)
      return toast.error('Student, amount, and date are required')
    setSaving(true)
    try {
      await paymentsApi.create({
        studentId: Number(form.studentId),
        amount: Number(form.amount),
        date: form.date,
        note: form.note || undefined,
      })
      toast.success('Payment recorded')
      setModalOpen(false)
      setForm(EMPTY)
      load()
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await paymentsApi.remove(deleteId)
    toast.success('Payment deleted')
    setDeleteId(null)
    load()
  }

  const filtered = payments.filter(p =>
    (p.student?.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.note || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalMonth = payments
    .filter(p => p.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, p) => sum + Number(p.amount), 0)

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-subtitle">{payments.length} records</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setModalOpen(true) }} className="btn-primary">
          <Plus size={16} /> Add Payment
        </button>
      </div>

      {/* Summary card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="stat-icon bg-violet-50">
            <DollarSign size={20} className="text-violet-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">This Month</p>
            <p className="text-xl font-bold text-slate-900">{fmt(totalMonth)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-emerald-50">
            <DollarSign size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Records</p>
            <p className="text-xl font-bold text-slate-900">{payments.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-amber-50">
            <DollarSign size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">All Time Total</p>
            <p className="text-xl font-bold text-slate-900">
              {fmt(payments.reduce((s, p) => s + Number(p.amount), 0))}
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input pl-10" placeholder="Search by student or note..." value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        {filtered.length === 0 ? <EmptyState message="No payments found" /> : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Note</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id}>
                    <td className="text-slate-400 text-xs">{i + 1}</td>
                    <td className="font-medium text-slate-900">{p.student?.fullName || '—'}</td>
                    <td>
                      <span className="font-semibold text-emerald-700">{fmt(Number(p.amount))}</span>
                    </td>
                    <td className="text-slate-500 text-xs">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="text-slate-400 text-xs max-w-xs truncate">{p.note || '—'}</td>
                    <td>
                      <button onClick={() => setDeleteId(p.id)} className="btn-ghost p-2 text-slate-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record Payment">
        <div className="space-y-4">
          <div>
            <label className="label">Student</label>
            <select className="input" value={form.studentId}
              onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))}>
              <option value="">Select student...</option>
              {students.filter(s => s.status === 'active').map(s => (
                <option key={s.id} value={s.id}>{s.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Amount (UZS)</label>
            <input type="number" className="input" placeholder="500000" value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={form.date}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div>
            <label className="label">Note <span className="text-slate-400 normal-case font-normal">(optional)</span></label>
            <input className="input" placeholder="Monthly fee, etc." value={form.note}
              onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Record Payment'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="This payment record will be permanently deleted."
      />
    </div>
  )
}
