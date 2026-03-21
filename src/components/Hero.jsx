import { motion } from 'framer-motion'

function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-[#282828]">
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-[#fe8019] font-mono mb-4 tracking-widest text-sm uppercase"
      >
        {'<'} hello world {'>'}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-6xl font-bold text-[#ebdbb2] mb-4"
      >
        Gonçalo Gomes
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-xl text-[#a89984] mb-10 font-mono"
      >
        Software Engineer | C & Java Developer
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex gap-4"
      >
        <motion.a
          href="#projects"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="px-6 py-3 bg-[#fe8019] text-[#282828] font-bold font-mono rounded hover:bg-[#fabd2f] transition-colors"
        >
          My Projects
        </motion.a>

        <motion.a
          href="#contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="px-6 py-3 border-2 border-[#fe8019] text-[#fe8019] font-bold font-mono rounded hover:bg-[#fe8019] hover:text-[#282828] transition-colors"
        >
          Contact
        </motion.a>
      </motion.div>

    </section>
  )
}

export default Hero