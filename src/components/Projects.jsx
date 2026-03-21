import { useRef } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'

const projects = [
  {
    name: "Shell em C",
    description: "Uma shell Unix básica com suporte a pipes e redirecionamento.",
    link: "https://github.com/GonZiin/shell",
    tech: ["C", "Linux", "Unix"],
    image: null // coloca o caminho da imagem aqui depois
  },
  {
    name: "Gestor de tarefas",
    description: "Aplicação de linha de comandos para gerir tarefas em Java.",
    link: "https://github.com/GonZiin/task-manager",
    tech: ["Java", "CLI"],
    image: null
  },
  {
    name: "Projeto 3",
    description: "Descrição do projeto.",
    link: "https://github.com/GonZiin/",
    tech: ["C", "Java"],
    image: null
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