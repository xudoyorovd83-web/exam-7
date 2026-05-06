import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, Search, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { teachersApi } from '../../services/api'
import { Teacher } from '../../types'
import { PageLoader, EmptyState } from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const EMPTY = { fullName: '', phone: '', subject: '' }

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Teacher | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const load = () => {
    setLoading(true)
    teachersApi.findAll().then(r => setTeachers(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (t: Teacher) => {
    setEditTarget(t)
    setForm({ fullName: t.fullName, phone: t.phone, subject: t.subject || '' })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.fullName || !form.phone) return toast.error('Name and phone are required')
    setSaving(true)
    try {
      if (editTarget) {
        await teachersApi.update(editTarget.id, form)
        toast.success('Teacher updated')
      } else {
        await teachersApi.create(form)
        toast.success('Teacher added')
      }
      setModalOpen(false)
      load()
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await teachersApi.remove(deleteId)
    toast.success('Teacher removed')
    setDeleteId(null)
    load()
  }

  const filtered = teachers.filter(t =>
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search) ||
    (t.subject || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Teachers</h1>
          <p className="page-subtitle">{teachers.length} teachers</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Teacher</button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input pl-10" placeholder="Search teachers..." value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Card grid view */}
      {filtered.length === 0 ? (
        <div className="card"><EmptyState message="No teachers found" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="card p-5 hover:shadow-card-hover transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-700 font-bold text-base">
                    {t.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{t.fullName}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{t.phone}</div>
                  {t.subject && (
                    <span className="badge-amber mt-2 inline-block">{t.subject}</span>
                  )}
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                    <Users size={11} />
                    {t.groups?.length || 0} group{(t.groups?.length || 0) !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(t)} className="btn-ghost p-1.5 text-slate-400 hover:text-primary-600">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteId(t.id)} className="btn-ghost p-1.5 text-slate-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-50 flex items-center text-xs text-slate-400">
                Joined {new Date(t.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Teacher' : 'Add Teacher'}>
        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" placeholder="Jane Smith" value={form.fullName}
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" placeholder="+998901234567" value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="label">Subject <span className="text-slate-400 normal-case font-normal">(optional)</span></label>
            <input className="input" placeholder="Mathematics" value={form.subject}
              onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editTarget ? 'Update' : 'Add Teacher'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="This teacher will be removed. Their groups will have no assigned teacher."
      />
    </div>
  )
}
