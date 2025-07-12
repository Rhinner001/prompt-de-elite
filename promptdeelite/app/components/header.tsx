'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-shadow ${scrolled ? 'shadow-lg bg-[#070D1C]/90 backdrop-blur' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Image
            src="/logo-footer.png"
            alt="Logo Prompt de Elite"
            width={120}
            height={40}
            priority
            className="cursor-pointer"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <Link href="/" className={pathname === '/' ? 'text-white font-semibold' : 'hover:text-white'}>Início</Link>
          <Link href="/quiz" className={pathname === '/quiz' ? 'text-white font-semibold' : 'hover:text-white'}>Quiz</Link>
          <Link href="/login" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition text-sm">
            Entrar
          </Link>
        </nav>  

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-white text-2xl focus:outline-none">
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#070D1C]/95 border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-sm text-gray-300">
          <Link href="/" onClick={toggleMenu} className={pathname === '/' ? 'text-white font-semibold' : 'hover:text-white'}>Início</Link>
          <Link href="/quiz" onClick={toggleMenu} className={pathname === '/quiz' ? 'text-white font-semibold' : 'hover:text-white'}>Quiz</Link>
          <Link href="/login" onClick={toggleMenu} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition text-sm">
            Entrar
          </Link>
        </div>
      )}
    </header>
  )
}
