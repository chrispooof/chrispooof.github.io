import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const mainLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/photos', label: 'Photos' },
  { to: '/contact', label: 'Contact' },
]

const moreLinks = [
  { to: '/blog', label: 'Blog' },
  { to: '/animelist', label: 'Anime List' },
  { to: '/mangalist', label: 'Manga List' },
  { to: '/booklist', label: 'Book List' },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-mono text-[3vh] px-[2vw] py-2 no-underline transition-colors ${
    isActive ? 'text-cyan-600' : 'text-black hover:text-cyan-600'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="flex justify-center flex-wrap relative">
      {mainLinks.map(({ to, label }) => (
        <NavLink key={to} to={to} end={to === '/'} className={navLinkClass}>
          {label}
        </NavLink>
      ))}

      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button className="font-mono text-[3vh] px-[2vw] py-2 text-black hover:text-cyan-600 transition-colors bg-transparent border-none cursor-pointer">
          More
        </button>
        {open && (
          <div className="absolute top-full left-0 bg-white shadow-md z-10 min-w-[140px]">
            {moreLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block px-4 py-3 font-mono text-sm no-underline transition-colors ${
                    isActive ? 'text-cyan-600' : 'text-black hover:text-cyan-600'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
