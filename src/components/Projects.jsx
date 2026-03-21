import { useRef } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'

const projects = [
  {
    name: "Shell em C",
    description: "Uma shell Unix básica com suporte a pipes e redirecionamento.",
    link: "https://github.com/GonZiin/shell",
    tech: ["C", "Linux", "Unix"]
  },
  {
    name: "Gestor de tarefas",
    description: "Aplicação de linha de comandos para gerir tarefas em Java.",
    link: "https://github.com/GonZiin/task-manager",
    tech: ["Java", "CLI"]
  },
  {
    name: "Projeto 3",
    description: "Descrição do projeto.",
    link: "https://github.com/GonZiin/",
    tech: ["C", "Java"]
  },
]

function Projects() {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -400 : 400,
      behavior: 'smooth'
    })
  }

  return (
    <section id="projects" className="bg-[#282828] py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[#ebdbb2] text-4xl font-bold font-mono mb-12"
        >
          My <span className="text-[#fe8019]">Projects</span>
          <span className="text-[#a89984] text-lg ml-4">({projects.length})</span>
        </motion.h2>

        {/* botões de navegação */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => scroll('left')}
            className="px-4 py-2 border border-[#504945] text-[#a89984] font-mono hover:border-[#fe8019] hover:text-[#fe8019] transition-colors rounded"
          >
            ← prev
          </button>
          <button
            onClick={() => scroll('right')}
            className="px-4 py-2 border border-[#504945] text-[#a89984] font-mono hover:border-[#fe8019] hover:text-[#fe8019] transition-colors rounded"
          >
            next →
          </button>
        </div>

        {/* carrossel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.name} index={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects