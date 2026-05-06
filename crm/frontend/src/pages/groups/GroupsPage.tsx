import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, Search, Users, BookOpen, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { groupsApi, teachersApi } from '../../services/api'
import { Group, Teacher } from '../../types'
import { PageLoader, EmptyState } from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const EMPTY = { name: '', teacherId: '', schedule: '' }

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Group | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const load = async () => {
    setLoading(true)
    try {
      const [gr, tr] = await Promise.all([groupsApi.findAll(), teachersApi.findAll()])
      setGroups(gr.data)
      setTeachers(tr.data)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (g: Group) => {
    setEditTarget(g)
    setForm({ name: g.name, teacherId: g.teacherId ? String(g.teacherId) : '', schedule: g.schedule || '' })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name) return toast.error('Group name is required')
    setSaving(true)
    try {
      const payload = { ...form, teacherId: form.teacherId ? Number(form.teacherId) : undefined }
      if (editTarget) {
        await groupsApi.update(editTarget.id, payload)
        toast.success('Group updated')
      } else {
        await groupsApi.create(payload)
        toast.success('Group created')
      }
      setModalOpen(false)
      load()
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await groupsApi.remove(deleteId)
    toast.success('Group removed')
    setDeleteId(null)
    load()
  }

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.teacher?.fullName || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Groups</h1>
          <p className="page-subtitle">{groups.length} groups</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Group</button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input pl-10" placeholder="Search groups..." value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="card"><EmptyState message="No groups found" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(g => (
            <div key={g.id} className="card p-5 hover:shadow-card-hover transition-shadow group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <BookOpen size={18} className="text-amber-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{g.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {g.teacher ? g.teacher.fullName : <span className="text-slate-400">No teacher</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(g)} className="btn-ghost p-1.5 text-slate-400 hover:text-primary-600">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteId(g.id)} className="btn-ghost p-1.5 text-slate-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users size={12} />
                  {g.students?.length || 0} student{(g.students?.length || 0) !== 1 ? 's' : ''}
                </span>
                {g.schedule && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {g.schedule}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Group' : 'Add Group'}>
        <div className="space-y-4">
          <div>
            <label className="label">Group Name</label>
            <input className="input" placeholder="Math Group A" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Teacher</label>
            <select className="input" value={form.teacherId}
              onChange={e => setForm(p => ({ ...p, teacherId: e.target.value }))}>
              <option value="">No teacher</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Schedule <span className="text-slate-400 normal-case font-normal">(optional)</span></label>
            <input className="input" placeholder="Mon/Wed/Fri 10:00–11:30" value={form.schedule}
              onChange={e => setForm(p => ({ ...p, schedule: e.target.value }))} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editTarget ? 'Update' : 'Create Group'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="This group will be removed. Students will be unassigned."
      />
    </div>
  )
}
