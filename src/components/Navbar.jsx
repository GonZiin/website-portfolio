import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#1d2021]/90 backdrop-blur-sm border-b border-[#504945]"
    >
      <div className="flex justify-between items-center px-8 py-4">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="text-[#fe8019] font-mono font-bold text-lg cursor-pointer"
        >
          gg<span className="text-[#ebdbb2]">.dev</span>
        </motion.span>

        {/* desktop */}
        <div className="hidden md:flex gap-8">
          {['projects', 'skills', 'contact'].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="text-[#a89984] font-mono text-sm hover:text-[#fe8019] transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#a89984] font-mono text-xl hover:text-[#fe8019] transition-colors"
        >
          {open ? 'x' : '≡'}
        </button>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#504945] overflow-hidden"
          >
            {['projects', 'skills', 'contact'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setOpen(false)}
                className="block px-8 py-4 text-[#a89984] font-mono text-sm hover:text-[#fe8019] hover:bg-[#282828] transition-colors"
              >
                {'>'} {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar