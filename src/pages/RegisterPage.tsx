import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('비밀번호는 최소 6자 이상이어야 합니다.'); return }
    if (username.length < 3) { setError('사용자명은 최소 3자 이상이어야 합니다.'); return }
    setLoading(true)
    const { error } = await signUp(email, password, username)
    if (error) {
      setError(error.message || '회원가입 중 오류가 발생했습니다.')
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <main className="pt-14 min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block relative">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-12 left-12">
          <p className="font-playfair text-3xl font-bold text-white">Join the Archive</p>
          <p className="font-inter text-xs text-white/60 tracking-widest uppercase mt-2">
            Document your everyday style
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <p className="font-inter text-[10px] tracking-[0.4em] uppercase text-secondary mb-2">Create account</p>
          <h1 className="font-playfair text-4xl font-bold text-primary mb-10">Join Archive</h1>

          {error && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50">
              <p className="font-inter text-xs text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary block mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                required
                className="w-full border-b border-border py-3 font-inter text-sm outline-none focus:border-primary transition-colors bg-transparent"
                placeholder="your_username"
              />
            </div>
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
                minLength={6}
                className="w-full border-b border-border py-3 font-inter text-sm outline-none focus:border-primary transition-colors bg-transparent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-inter text-xs tracking-[0.3em] uppercase hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Join Archive'}
            </button>
          </form>

          <p className="font-inter text-xs text-secondary text-center mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-secondary underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
