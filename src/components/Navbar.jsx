import { motion } from 'framer-motion'

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 bg-[#1d2021]/90 backdrop-blur-sm border-b border-[#504945]"
    >
      <motion.span 
        whileHover={{ scale: 1.05 }}
        className="text-[#fe8019] font-mono font-bold text-lg cursor-pointer"
      >
        gomes<span className="text-[#ebdbb2]">.dev</span>
      </motion.span>

      <div className="flex gap-8">
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
    </motion.nav>
  )
}

export default Navbar