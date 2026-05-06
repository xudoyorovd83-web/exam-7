import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, Search, UserCheck, UserX } from 'lucide-react'
import toast from 'react-hot-toast'
import { studentsApi, groupsApi } from '../../services/api'
import { Student, Group } from '../../types'
import { PageLoader, EmptyState } from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const EMPTY = { fullName: '', phone: '', groupId: '', status: 'active' }

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Student | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const load = async () => {
    setLoading(true)
    try {
      const [sr, gr] = await Promise.all([studentsApi.findAll(), groupsApi.findAll()])
      setStudents(sr.data)
      setGroups(gr.data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit = (s: Student) => {
    setEditTarget(s)
    setForm({ fullName: s.fullName, phone: s.phone, groupId: s.groupId ? String(s.groupId) : '', status: s.status })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.fullName || !form.phone) return toast.error('Name and phone are required')
    setSaving(true)
    try {
      const payload = { ...form, groupId: form.groupId ? Number(form.groupId) : undefined }
      if (editTarget) {
        await studentsApi.update(editTarget.id, payload)
        toast.success('Student updated')
      } else {
        await studentsApi.create(payload)
        toast.success('Student added')
      }
      setModalOpen(false)
      load()
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await studentsApi.remove(deleteId)
    toast.success('Student removed')
    setDeleteId(null)
    load()
  }

  const filtered = students.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search)
  )

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{students.length} total · {students.filter(s => s.status === 'active').length} active</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Student</button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-10"
          placeholder="Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        {filtered.length === 0 ? <EmptyState message="No students found" /> : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Group</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id}>
                    <td className="text-slate-400 text-xs">{i + 1}</td>
                    <td className="font-medium text-slate-900">{s.fullName}</td>
                    <td className="font-mono text-xs text-slate-500">{s.phone}</td>
                    <td>
                      {s.group ? (
                        <span className="badge-blue">{s.group.name}</span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td>
                      {s.status === 'active' ? (
                        <span className="badge-green flex items-center gap-1 w-fit">
                          <UserCheck size={11} /> Active
                        </span>
                      ) : (
                        <span className="badge-red flex items-center gap-1 w-fit">
                          <UserX size={11} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="text-slate-400 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(s)} className="btn-ghost p-2 text-slate-400 hover:text-primary-600">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteId(s.id)} className="btn-ghost p-2 text-slate-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Student' : 'Add Student'}>
        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" placeholder="Alice Johnson" value={form.fullName}
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" placeholder="+998901234567" value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="label">Group</label>
            <select className="input" value={form.groupId}
              onChange={e => setForm(p => ({ ...p, groupId: e.target.value }))}>
              <option value="">No group</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editTarget ? 'Update' : 'Add Student'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="This student and all related data will be removed."
      />
    </div>
  )
}
