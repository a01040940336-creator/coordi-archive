import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  const isActive = (p: string) => location.pathname === p

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-canvas border-b border-border">
      <div className="px-6 md:px-10 h-12 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="font-inter text-[10px] font-semibold tracking-[0.55em] uppercase text-primary"
        >
          C.A.
        </Link>

        {/* Center nav — desktop */}
        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {[
            { to: '/explore', label: 'Archive' },
            { to: '/search',  label: 'Search'  },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`font-inter text-[10px] tracking-[0.38em] uppercase transition-colors ${
                isActive(to) ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              {label}
            </Link>
          ))}
          {user && (
            <Link
              to="/create"
              className={`font-inter text-[10px] tracking-[0.38em] uppercase transition-colors ${
                isActive('/create') ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Upload
            </Link>
          )}
        </nav>

        {/* Right — account */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="font-inter text-[10px] tracking-[0.38em] uppercase text-secondary hover:text-primary transition-colors"
              >
                {profile?.display_name || profile?.username || 'Account'}
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-7 w-36 bg-canvas border border-border z-50"
                  >
                    {[
                      { to: `/profile/${profile?.username}`, label: 'Profile' },
                      { to: '/bookmarks', label: 'Bookmarks' },
                    ].map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 font-inter text-[10px] tracking-[0.2em] uppercase text-secondary hover:text-primary transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 font-inter text-[10px] tracking-[0.2em] uppercase text-secondary hover:text-primary transition-colors border-t border-border"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:block font-inter text-[10px] tracking-[0.38em] uppercase text-secondary hover:text-primary transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-[5px]"
            aria-label="Menu"
          >
            <span className={`block w-5 h-px bg-primary transition-all ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block w-3 h-px bg-primary transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-primary transition-all ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-canvas"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {[
                { to: '/explore', label: 'Archive' },
                { to: '/search', label: 'Search' },
                ...(user ? [{ to: '/create', label: 'Upload' }] : []),
                ...(user
                  ? [{ to: `/profile/${profile?.username}`, label: 'Profile' }, { to: '/bookmarks', label: 'Saved' }]
                  : [{ to: '/login', label: 'Sign In' }]),
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="font-inter text-[10px] tracking-[0.38em] uppercase text-secondary hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="text-left font-inter text-[10px] tracking-[0.38em] uppercase text-secondary border-t border-border pt-5"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
