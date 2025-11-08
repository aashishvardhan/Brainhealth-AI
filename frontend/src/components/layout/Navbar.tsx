'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Detection', href: '/detection' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'AI Helpdesk', href: '/helpdesk' },
  { name: 'Learn', href: '/learn' },
  { name: 'About', href: '/about' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass shadow-lg border-b border-gray-200/50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Brain className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold gradient-text">BrainHealth AI</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Stroke Detection Platform</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2.5 rounded-xl text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-semibold"
                >
                  {link.name}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}>
                    <div className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all font-semibold">
                      {link.name}
                    </div>
                  </Link>
                ))}
                <Link href="/detection" onClick={() => setIsOpen(false)}>
                  <div className="block mx-4 my-2">
                    <button className="btn-primary w-full">
                      Start Detection
                    </button>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
