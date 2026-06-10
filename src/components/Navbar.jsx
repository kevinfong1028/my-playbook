import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: '關於我', href: '#about' },
  { label: '作品集', href: '#projects' },
  { label: '聯絡',   href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = scrolled || open

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? 'border-b border-line bg-ink/90 backdrop-blur-md' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#" onClick={() => setOpen(false)} className="flex items-center font-mono text-sm font-medium">
          <span className="text-acc">kevin</span>
          <span className="text-mut">@portfolio</span>
          <span className="text-dim">:~$</span>
          <span className="cursor ml-1 h-4"></span>
        </a>

        {/* desktop */}
        <ul className="hidden items-center gap-7 md:flex">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className="group font-mono text-sm text-mut transition-colors hover:text-acc">
                <span className="text-dim transition-colors group-hover:text-acc">~/</span>{label}
              </a>
            </li>
          ))}
        </ul>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-mut transition-colors hover:border-acc hover:text-acc md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* mobile panel */}
      <div className={`overflow-hidden border-line bg-ink/95 backdrop-blur-md transition-all duration-300 md:hidden ${open ? 'max-h-64 border-b' : 'max-h-0'}`}>
        <ul className="mx-auto flex max-w-5xl flex-col gap-1 px-6 pb-4 pt-1">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-2 rounded-md px-3 py-3 font-mono text-sm text-mut transition-colors hover:bg-panel hover:text-acc"
              >
                <span className="text-dim transition-colors group-hover:text-acc">~/</span>{label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
