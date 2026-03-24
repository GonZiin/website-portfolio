import { motion as Motion } from 'framer-motion'
import useTypewriter from '../hooks/useTypewriter'

const roles = [
  'Software Engineer',
  'C Developer',
  'Java Developer',
  'Problem Solver',
]

function Hero() {
  const text = useTypewriter(roles, 80)

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 bg-[#282828] overflow-hidden">

      {/* fundo animado — grid de pontos */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #fe8019 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* brilho laranja ao centro */}
      <div className="absolute w-96 h-96 rounded-full bg-[#fe8019] opacity-5 blur-3xl" />

      {/* conteúdo */}
      <div className="relative z-10">
        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[#fe8019] font-mono mb-4 tracking-widest text-sm uppercase"
        >
          {'<'} hello world {'>'}
        </Motion.p>

        <Motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl font-bold text-[#ebdbb2] mb-4"
        >
          Gonçalo Gomes
        </Motion.h1>

        {/* typewriter */}
        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl text-[#a89984] mb-10 font-mono h-8"
        >
          <span className="text-[#fe8019]">{text}</span>
          <span className="animate-pulse">_</span>
        </Motion.p>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex gap-4 justify-center"
        >
          <Motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="px-6 py-3 bg-[#fe8019] text-[#282828] font-bold font-mono rounded hover:bg-[#fabd2f] transition-colors"
          >
            My Projects
          </Motion.a>
          <Motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="px-6 py-3 border-2 border-[#fe8019] text-[#fe8019] font-bold font-mono rounded hover:bg-[#fe8019] hover:text-[#282828] transition-colors"
          >
            Contact
          </Motion.a>
        </Motion.div>
      </div>

    </section>
  )
}

export default Hero
