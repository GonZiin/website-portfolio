import { useRef } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'
import railwayImg from '../assets/railway.png'
import verletImg from '../assets/verlet.png'

const projects = [
  {
    name: "Verlet Simulation",
    description: "Physics simulation using the Verlet integration method, built with C++ and SDL2. Real-time particle interactions and constraints.",
    link: "https://github.com/GonZiin/PhysicsSimulator.git",
    tech: ["C++", "SDL2", "Physics"],
    image: verletImg
  },
  {
    name: "Agentic AI Research",
    description: "Research project on agentic AI systems. Published paper at WORLD CIST 25.",
    link: "Not Open Source",
    tech: ["Python", "AI", "Research"],
    {image ? (
  <img
    src={image}
    alt={name}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  />
) : (
  <div className="w-full h-full bg-[#1d2021] flex items-center justify-center relative overflow-hidden">
    {/* grid de caracteres aleatórios estilo matrix */}
    <div className="absolute inset-0 flex flex-wrap content-start p-2 opacity-20 select-none">
      {Array.from({ length: 80 }).map((_, i) => (
        <span key={i} className="text-[#fe8019] font-mono text-xs w-6 text-center">
          {['0', '1', '{', '}', '<', '>', '//', ';'][Math.floor(Math.random() * 8)]}
        </span>
      ))}
    </div>
    {/* número por cima */}
    <span className="relative text-[#504945] font-mono text-5xl font-bold z-10">
      {String(index + 1).padStart(2, '0')}
    </span>
  </div>
)}
  },
  {
    name: "Railway Management",
    description: "Railway management system built with Java and JavaFX. Full GUI with route planning and scheduling.",
    link: "Not Open Source",
    tech: ["Java", "JavaFX"],
    image: railwayImg
  },
]

function Projects() {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -420 : 420,
      behavior: 'smooth'
    })
  }

  return (
    <section id="projects" className="bg-[#282828] py-20 overflow-hidden">

      {/* cabeçalho criativo */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[#fe8019] font-mono text-sm mb-2 tracking-widest"
            >
              // selected works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[#ebdbb2] text-5xl font-bold font-mono"
            >
              Projects<span className="text-[#fe8019]">.</span>
            </motion.h2>
          </div>

          {/* botões de navegação */}
          <div className="flex gap-3">
            <motion.button
              onClick={() => scroll('left')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-[#504945] text-[#a89984] font-mono hover:border-[#fe8019] hover:text-[#fe8019] transition-colors rounded"
            >
              {'<'} prev
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-[#504945] text-[#a89984] font-mono hover:border-[#fe8019] hover:text-[#fe8019] transition-colors rounded"
            >
              next {'>'}
            </motion.button>
          </div>
        </div>

        {/* linha decorativa */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-px bg-[#504945] mt-6 origin-left"
        />
      </div>

      {}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 pl-[max(2rem,calc((100vw-72rem)/2))]"
          style={{ scrollbarWidth: 'none' }}
        >
        {projects.map((project, index) => (
          <ProjectCard key={project.name} index={index} {...project} />
        ))}
      </div>

      {/* contador */}
      <div className="max-w-6xl mx-auto px-8 mt-6">
        <span className="text-[#504945] font-mono text-sm">
          {projects.length} projects
        </span>
      </div>
    </section>
  )
}

export default Projects