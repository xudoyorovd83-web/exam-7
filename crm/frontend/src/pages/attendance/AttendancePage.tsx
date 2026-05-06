import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Save, ChevronDown, CalendarDays } from 'lucide-react'
import toast from 'react-hot-toast'
import { attendanceApi, groupsApi, studentsApi } from '../../services/api'
import { Group, Student, Attendance } from '../../types'
import { PageLoader, EmptyState } from '../../components/ui/Spinner'

const today = () => new Date().toISOString().split('T')[0]

export default function AttendancePage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState(today())
  const [students, setStudents] = useState<Student[]>([])
  const [existing, setExisting] = useState<Attendance[]>([])
  const [statuses, setStatuses] = useState<Record<number, 'present' | 'absent'>>({})
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  // History tab
  const [tab, setTab] = useState<'mark' | 'history'>('mark')
  const [history, setHistory] = useState<Attendance[]>([])
  const [historyDate, setHistoryDate] = useState(today())
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    groupsApi.findAll().then(r => setGroups(r.data)).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedGroup || !selectedDate) return
    setLoadingStudents(true)
    const gid = Number(selectedGroup)
    Promise.all([
      studentsApi.findAll(),
      attendanceApi.findByGroupDate(gid, selectedDate),
    ]).then(([sr, ar]) => {
      const groupStudents = (sr.data as Student[]).filter(s => s.groupId === gid && s.status === 'active')
      setStudents(groupStudents)
      const existingRecs: Attendance[] = ar.data
      setExisting(existingRecs)
      const init: Record<number, 'present' | 'absent'> = {}
      groupStudents.forEach(s => {
        const rec = existingRecs.find(e => e.studentId === s.id)
        init[s.id] = rec ? rec.status : 'present'
      })
      setStatuses(init)
    }).finally(() => setLoadingStudents(false))
  }, [selectedGroup, selectedDate])

  const toggle = (sid: number) => {
    setStatuses(p => ({ ...p, [sid]: p[sid] === 'present' ? 'absent' : 'present' }))
  }

  const handleSave = async () => {
    if (!selectedGroup || students.length === 0) return toast.error('Select a group first')
    setSaving(true)
    try {
      const records = students.map(s => ({
        studentId: s.id,
        groupId: Number(selectedGroup),
        status: statuses[s.id] || 'present',
        date: selectedDate,
      }))
      await attendanceApi.bulkCreate(records)
      toast.success(`Attendance saved for ${students.length} students`)
    } finally { setSaving(false) }
  }

  const loadHistory = () => {
    setLoadingHistory(true)
    attendanceApi.findByDate(historyDate)
      .then(r => setHistory(r.data))
      .finally(() => setLoadingHistory(false))
  }
  useEffect(() => { if (tab === 'history') loadHistory() }, [tab, historyDate])

  if (loading) return <PageLoader />

  const present = Object.values(statuses).filter(s => s === 'present').length
  const absent  = Object.values(statuses).filter(s => s === 'absent').length

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Mark and review daily attendance</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['mark', 'history'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === t ? 'bg-white text-slate-900 shadow-card' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t === 'mark' ? 'Mark Attendance' : 'Daily History'}
          </button>
        ))}
      </div>

      {tab === 'mark' && (
        <>
          {/* Controls */}
          <div className="card p-5">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-48">
                <label className="label">Select Group</label>
                <div className="relative">
                  <select className="input appearance-none pr-9" value={selectedGroup}
                    onChange={e => setSelectedGroup(e.target.value)}>
                    <option value="">Choose a group...</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="label">Date</label>
                <input type="date" className="input" value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)} />
              </div>
            </div>
          </div>

          {selectedGroup && (
            <>
              {loadingStudents ? <PageLoader /> : students.length === 0 ? (
                <div className="card"><EmptyState message="No active students in this group" /></div>
              ) : (
                <>
                  {/* Stats bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-emerald-500" />
                      <span className="font-semibold text-emerald-700">{present} present</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <XCircle size={16} className="text-red-400" />
                      <span className="font-semibold text-red-600">{absent} absent</span>
                    </div>
                    <div className="text-sm text-slate-400">{students.length} total</div>
                    <div className="flex-1" />
                    <button
                      onClick={() => setStatuses(p => Object.fromEntries(Object.keys(p).map(k => [k, 'present'])) as any)}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      All Present
                    </button>
                    <button
                      onClick={() => setStatuses(p => Object.fromEntries(Object.keys(p).map(k => [k, 'absent'])) as any)}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      All Absent
                    </button>
                  </div>

                  <div className="card">
                    <div className="divide-y divide-slate-50">
                      {students.map((s, i) => {
                        const isPresent = statuses[s.id] === 'present'
                        return (
                          <div
                            key={s.id}
                            onClick={() => toggle(s.id)}
                            className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors
                              ${isPresent ? 'hover:bg-emerald-50/50' : 'hover:bg-red-50/50 bg-red-50/30'}`}
                          >
                            <span className="text-xs text-slate-400 w-6">{i + 1}</span>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0
                              ${isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                              {s.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-900 text-sm">{s.fullName}</div>
                              <div className="text-xs text-slate-400 font-mono">{s.phone}</div>
                            </div>
                            <div className={`flex items-center gap-1.5 text-sm font-semibold
                              ${isPresent ? 'text-emerald-600' : 'text-red-500'}`}>
                              {isPresent
                                ? <><CheckCircle size={17} /> Present</>
                                : <><XCircle size={17} /> Absent</>
                              }
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={handleSave} disabled={saving} className="btn-primary px-6">
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save Attendance'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {tab === 'history' && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-end gap-4">
              <div>
                <label className="label">Date</label>
                <input type="date" className="input" value={historyDate}
                  onChange={e => setHistoryDate(e.target.value)} />
              </div>
            </div>
          </div>

          {loadingHistory ? <PageLoader /> : history.length === 0 ? (
            <div className="card"><EmptyState message="No attendance records for this date" /></div>
          ) : (
            <div className="card">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <CalendarDays size={15} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-600">
                  {new Date(historyDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="ml-auto text-xs text-slate-400">{history.length} records</span>
              </div>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr><th>Student</th><th>Group</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {history.map(a => (
                      <tr key={a.id}>
                        <td className="font-medium text-slate-900">{a.student?.fullName || '—'}</td>
                        <td><span className="badge-blue">{a.group?.name || '—'}</span></td>
                        <td>
                          {a.status === 'present'
                            ? <span className="badge-green flex items-center gap-1 w-fit"><CheckCircle size={11} /> Present</span>
                            : <span className="badge-red flex items-center gap-1 w-fit"><XCircle size={11} /> Absent</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
