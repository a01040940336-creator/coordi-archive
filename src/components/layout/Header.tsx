import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="font-playfair text-sm font-bold tracking-[0.2em] uppercase">
          Coordi Archive
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/explore"
            className={`font-inter text-xs tracking-widest uppercase transition-colors ${
              isActive('/explore') ? 'text-primary' : 'text-secondary hover:text-primary'
            }`}
          >
            Explore
          </Link>
          <Link
            to="/search"
            className={`font-inter text-xs tracking-widest uppercase transition-colors ${
              isActive('/search') ? 'text-primary' : 'text-secondary hover:text-primary'
            }`}
          >
            Search
          </Link>
          {user && (
            <Link
              to="/create"
              className={`font-inter text-xs tracking-widest uppercase transition-colors ${
                isActive('/create') ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Upload
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="font-inter text-xs tracking-widest uppercase text-secondary hover:text-primary transition-colors"
              >
                {profile?.display_name || profile?.username || 'Account'}
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-8 w-40 bg-white border border-border z-50"
                  >
                    <Link
                      to={`/profile/${profile?.username}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 font-inter text-xs text-primary hover:bg-gray-50 tracking-wider"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/bookmarks"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 font-inter text-xs text-primary hover:bg-gray-50 tracking-wider"
                    >
                      Bookmarks
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 font-inter text-xs text-secondary hover:bg-gray-50 tracking-wider"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="font-inter text-xs tracking-widest uppercase text-secondary hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="font-inter text-xs tracking-widest uppercase px-4 py-2 bg-primary text-white hover:bg-secondary transition-colors"
              >
                Join
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1 p-1"
            aria-label="Menu"
          >
            <span className={`block w-5 h-px bg-primary transition-all ${menuOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`block w-5 h-px bg-primary transition-all ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
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
            className="md:hidden overflow-hidden border-t border-border bg-white"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <Link to="/explore" onClick={() => setMenuOpen(false)} className="font-inter text-xs tracking-widest uppercase text-secondary">Explore</Link>
              <Link to="/search" onClick={() => setMenuOpen(false)} className="font-inter text-xs tracking-widest uppercase text-secondary">Search</Link>
              {user && <Link to="/create" onClick={() => setMenuOpen(false)} className="font-inter text-xs tracking-widest uppercase text-secondary">Upload</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
