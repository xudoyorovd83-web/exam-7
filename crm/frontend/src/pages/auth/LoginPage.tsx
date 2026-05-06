import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { AuthResponse } from '../../types'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!phone || !password) return toast.error('Please fill all fields')
    setLoading(true)
    try {
      const { data } = await authApi.login({ phone, password })
      const res = data as AuthResponse
      login(res.access_token, res.user)
      toast.success(`Welcome back, ${res.user.fullName}!`)
      navigate('/dashboard')
    } catch {
      // error handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-900 to-primary-950
                    flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-surface-800/80 backdrop-blur-xl rounded-2xl border border-surface-700/50
                        shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-3 shadow-glow">
              <Shield size={22} className="text-white" />
            </div>
            <h1 className="text-white text-xl font-bold tracking-tight">EduCRM</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+998901234567"
                className="w-full px-4 py-3 rounded-xl bg-surface-900/80 border border-surface-700
                           text-white placeholder-slate-600 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                           transition-all duration-150"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-surface-900/80 border border-surface-700
                             text-white placeholder-slate-600 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                             transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold
                         text-sm rounded-xl transition-all duration-150 mt-2
                         focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
                         focus:ring-offset-surface-800 disabled:opacity-60 disabled:cursor-not-allowed
                         active:scale-[0.98]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-xl bg-surface-900/50 border border-surface-700/50">
            <p className="text-xs text-slate-500 text-center font-medium mb-1">Default credentials</p>
            <p className="text-xs text-slate-400 text-center font-mono">
              +998900000000 / superadmin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
