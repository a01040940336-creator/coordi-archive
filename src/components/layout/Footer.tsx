import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-playfair text-2xl font-bold mb-4">Coordi Archive</h3>
            <p className="font-inter text-xs text-secondary leading-relaxed tracking-wide max-w-xs">
              The Archive of Everyday Style.<br />
              Fashion Editorial meets Digital Service.
            </p>
          </div>
          <div>
            <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-4">Navigate</p>
            <div className="flex flex-col gap-2">
              <Link to="/explore" className="font-inter text-xs text-secondary hover:text-primary transition-colors tracking-wider">Explore</Link>
              <Link to="/search" className="font-inter text-xs text-secondary hover:text-primary transition-colors tracking-wider">Search Archive</Link>
              <Link to="/create" className="font-inter text-xs text-secondary hover:text-primary transition-colors tracking-wider">Upload Look</Link>
            </div>
          </div>
          <div>
            <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary mb-4">Issue</p>
            <p className="font-inter text-xs text-secondary">Summer Issue 2026</p>
            <p className="font-inter text-xs text-secondary mt-1">28~31℃ · Rainy Season</p>
          </div>
        </div>
        <div className="mt-16 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-start gap-4">
          <p className="font-inter text-[10px] text-secondary tracking-widest uppercase">
            © 2026 Coordi Archive. All Rights Reserved.
          </p>
          <p className="font-inter text-[10px] text-secondary tracking-widest uppercase">
            Fashion Editorial Archive
          </p>
        </div>
      </div>
    </footer>
  )
}
