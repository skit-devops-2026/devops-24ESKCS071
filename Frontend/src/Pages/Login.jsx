import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { LuMail as Mail, LuLock as Lock, LuLoaderCircle as Loader2, LuCircleAlert as AlertCircle } from 'react-icons/lu'
import { authApi } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await authApi.login({ email, password })
      if (res.success && res.token) {
        localStorage.setItem('craftcv_token', res.token)
        localStorage.setItem('craftcv_user', JSON.stringify(res.user))
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo_user',
      name: 'Alex Chen',
      email: 'alex.chen@email.com',
      githubUsername: 'alexchen'
    }
    localStorage.setItem('craftcv_token', 'demo_token_12345')
    localStorage.setItem('craftcv_user', JSON.stringify(demoUser))
    navigate('/dashboard')
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center relative">
      <Link
        to="/"
        className="elsie-black text-2xl text-white absolute top-6 left-8 hover:text-white/80 transition-colors"
      >
        CraftCV
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-10 w-full max-w-md mx-4"
      >
        <h1 className="elsie-black text-4xl text-white leading-tight">Welcome back.</h1>
        <p className="text-white/50 text-sm mt-2">Sign in to continue building your career.</p>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs font-medium tracking-wide">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 w-full text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs font-medium tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={15} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 w-full text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-2xl font-medium hover:bg-white/90 transition-colors mt-2 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-white/5 border border-white/10 text-white/70 py-2.5 rounded-2xl text-xs font-medium hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            Continue as Guest (Preview)
          </button>
        </form>

        <p className="text-white/40 text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
