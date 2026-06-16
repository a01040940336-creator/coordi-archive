import { motion } from 'framer-motion'

const MOCK_LOOKS = [
  { num: '001', title: 'Autumn Reverie', season: 'Autumn', style: 'Classic', temp: 'Cool', shade: 'bg-stone-100' },
  { num: '002', title: 'Light Contrast', season: 'Summer', style: 'Minimal', temp: 'Warm', shade: 'bg-zinc-100' },
  { num: '003', title: 'Urban Noir', season: 'Winter', style: 'Avant-garde', temp: 'Cold', shade: 'bg-neutral-200' },
  { num: '004', title: 'Morning Bloom', season: 'Spring', style: 'Feminine', temp: 'Mild', shade: 'bg-gray-100' },
  { num: '005', title: 'Cobalt Dreams', season: 'Summer', style: 'Bold', temp: 'Hot', shade: 'bg-slate-100' },
  { num: '006', title: 'Quiet Hours', season: 'Autumn', style: 'Minimalist', temp: 'Cool', shade: 'bg-stone-200' },
  { num: '007', title: 'Ivory Edit', season: 'Spring', style: 'Clean', temp: 'Mild', shade: 'bg-gray-50' },
  { num: '008', title: 'Dark Chapter', season: 'Winter', style: 'Dramatic', temp: 'Cold', shade: 'bg-neutral-100' },
  { num: '009', title: 'Soft Volume', season: 'Spring', style: 'Romantic', temp: 'Warm', shade: 'bg-zinc-50' },
  { num: '010', title: 'Editorial No.10', season: 'Autumn', style: 'Editorial', temp: 'Cool', shade: 'bg-stone-100' },
  { num: '011', title: 'Archive Study', season: 'Winter', style: 'Classic', temp: 'Cold', shade: 'bg-gray-100' },
]

interface PlaceholderCardProps {
  index?: number
  variant?: 'default' | 'large'
}

export default function PlaceholderCard({ index = 0, variant = 'default' }: PlaceholderCardProps) {
  const look = MOCK_LOOKS[index % MOCK_LOOKS.length]

  if (variant === 'large') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <div className={`relative overflow-hidden aspect-[3/4] ${look.shade} flex items-center justify-center`}>
          <span className="font-playfair text-6xl text-gray-300 select-none">{look.num}</span>
        </div>
        <div className="mt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-secondary/40 mb-1">
                No.{look.num}
              </p>
              <h3 className="font-playfair text-xl font-medium text-primary/30 leading-tight">
                {look.title}
              </h3>
            </div>
            <span className="font-inter text-[10px] tracking-wider uppercase text-secondary/30 border border-border/30 px-2 py-1 shrink-0 mt-1">
              {look.style}
            </span>
          </div>
          <p className="font-inter text-xs text-secondary/20 mt-2">by —</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div className={`relative overflow-hidden aspect-[2/3] ${look.shade} flex items-center justify-center`}>
        <span className="font-playfair text-5xl text-gray-200 font-bold select-none">{look.num}</span>
      </div>
      <div className="mt-3">
        <p className="font-inter text-[10px] tracking-[0.25em] uppercase text-secondary/40">
          No.{look.num} · {look.temp}
        </p>
        <h3 className="font-playfair text-lg font-medium text-primary/30 mt-1 leading-tight">
          {look.title}
        </h3>
        <div className="flex gap-2 mt-2 flex-wrap">
          <span className="font-inter text-[10px] text-secondary/30 border border-border/30 px-2 py-0.5">
            {look.season}
          </span>
          <span className="font-inter text-[10px] text-secondary/30 border border-border/30 px-2 py-0.5">
            {look.style}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
