import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <main className="pt-14 min-h-screen grid md:grid-cols-2">
      {/* Left — Image */}
      <div className="hidden md:block relative">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-12 left-12">
          <p className="font-playfair text-3xl font-bold text-white">Coordi Archive</p>
          <p className="font-inter text-xs text-white/60 tracking-widest uppercase mt-2">
            The Archive of Everyday Style
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex items-center justify-center px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary mb-2">Welcome back</p>
          <h1 className="font-playfair text-4xl font-bold text-primary mb-10">Sign In</h1>

          {error && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50">
              <p className="font-inter text-xs text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border-b border-border py-3 font-inter text-sm outline-none focus:border-primary transition-colors bg-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border-b border-border py-3 font-inter text-sm outline-none focus:border-primary transition-colors bg-transparent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-inter text-xs tracking-[0.3em] uppercase hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="font-inter text-xs text-secondary text-center mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-secondary underline">
              Join Archive
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
