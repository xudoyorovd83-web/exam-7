import { useEffect, useState } from 'react'
import { Plus, Trash2, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { usersApi } from '../../services/api'
import { User } from '../../types'
import { PageLoader, EmptyState } from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function AdminsPage() {
  const { isSuperAdmin } = useAuth()
  const [admins, setAdmins] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ fullName: '', phone: '', password: '', role: 'ADMIN' })

  if (!isSuperAdmin) return <Navigate to="/dashboard" replace />

  const load = () => {
    usersApi.findAdmins().then(r => setAdmins(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleSave = async () => {
    if (!form.fullName || !form.phone || !form.password) return toast.error('All fields required')
    setSaving(true)
    try {
      await usersApi.create(form)
      toast.success('Admin created')
      setModalOpen(false)
      setForm({ fullName: '', phone: '', password: '', role: 'ADMIN' })
      load()
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await usersApi.remove(deleteId)
    toast.success('Admin deleted')
    setDeleteId(null)
    load()
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admins</h1>
          <p className="page-subtitle">{admins.length} admin accounts</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Add Admin
        </button>
      </div>

      <div className="card">
        {admins.length === 0 ? <EmptyState message="No admins yet" /> : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Full Name</th><th>Phone</th><th>Role</th><th>Created</th><th></th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a, i) => (
                  <tr key={a.id}>
                    <td className="text-slate-400 text-xs">{i + 1}</td>
                    <td className="font-medium text-slate-900">{a.fullName}</td>
                    <td className="font-mono text-xs">{a.phone}</td>
                    <td><span className="badge-blue">{a.role}</span></td>
                    <td className="text-slate-400 text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => setDeleteId(a.id)}
                        className="btn-ghost text-red-400 hover:text-red-600 hover:bg-red-50 p-2"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Admin">
        <div className="space-y-4">
          {[
            { label: 'Full Name', key: 'fullName', placeholder: 'John Doe' },
            { label: 'Phone', key: 'phone', placeholder: '+998901234567' },
            { label: 'Password', key: 'password', placeholder: 'Min. 6 characters', type: 'password' },
          ].map(f => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input
                type={f.type || 'text'}
                className="input"
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Create Admin'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="This admin will lose access to the system."
      />
    </div>
  )
}
