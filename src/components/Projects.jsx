import { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import ProjectCard from './ProjectCard'
import railwayImg from '../assets/railway.png'
import verletImg from '../assets/verlet.png'
import smianImg from '../assets/smainSwitch.png'
import mealImg from '../assets/mealPlanner.png'

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
    image: null
  },
  {
    name: "Railway Management",
    description: "Railway management system built with Java and JavaFX. Full GUI with route planning and scheduling.",
    link: "Not Open Source",
    tech: ["Java", "JavaFX"],
    image: railwayImg
  },
  {
    name: "Smian Switch",
    description: "A game built in collaboration with other developers.",
    link: "https://github.com/dinisjcorreia/SmianSwitch",
    tech: ["C#", "Game"],
    image: smianImg
  },
  {
    name: "Meal Planner",
    description: "A meal planning application to help organize weekly meals and nutrition.",
    link: "https://github.com/GonZiin/Meal-Planner",
    tech: ["Django", "Python"],
    image: mealImg
  },
]

function Projects() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const total = projects.length

  const prev = () => {
    setDirection(-1)
    setCurrent((c) => (c - 1 + total) % total)
  }

  const next = () => {
    setDirection(1)
    setCurrent((c) => (c + 1) % total)
  }

  const getVisible = (count) => {
    return Array.from({ length: count }).map((_, i) => ({
      project: projects[(current + i) % total],
      index: (current + i) % total
    }))
  }

  return (
    <section id="projects" className="bg-[#282828] py-20 overflow-hidden">

      {/* cabeçalho */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <Motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[#fe8019] font-mono text-sm mb-2 tracking-widest"
            >
              // selected works
            </Motion.p>
            <Motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[#ebdbb2] text-5xl font-bold font-mono"
            >
              Projects<span className="text-[#fe8019]">.</span>
            </Motion.h2>
          </div>
          <div className="flex gap-3">
            <Motion.button
              onClick={prev}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-[#504945] text-[#a89984] font-mono hover:border-[#fe8019] hover:text-[#fe8019] transition-colors rounded"
            >
              {'<'} prev
            </Motion.button>
            <Motion.button
              onClick={next}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-[#504945] text-[#a89984] font-mono hover:border-[#fe8019] hover:text-[#fe8019] transition-colors rounded"
            >
              next {'>'}
            </Motion.button>
          </div>
        </div>
        <Motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-px bg-[#504945] mt-6 origin-left"
        />
      </div>

      {/* carrossel — mobile: 1 card, tablet: 2, desktop: 3 */}
      <div className="max-w-6xl mx-auto px-8">

        {/* mobile: 1 card */}
        <div className="block md:hidden overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <Motion.div
              key={current}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="grid grid-cols-1 gap-6"
            >
              {getVisible(1).map(({ project, index }) => (
                <ProjectCard key={project.name} index={index} {...project} />
              ))}
            </Motion.div>
          </AnimatePresence>
        </div>

        {/* tablet: 2 cards */}
        <div className="hidden md:block lg:hidden overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <Motion.div
              key={current}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="grid grid-cols-2 gap-6"
            >
              {getVisible(2).map(({ project, index }) => (
                <ProjectCard key={project.name} index={index} {...project} />
              ))}
            </Motion.div>
          </AnimatePresence>
        </div>

        {/* desktop: 3 cards */}
        <div className="hidden lg:block overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <Motion.div
              key={current}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="grid grid-cols-3 gap-6"
            >
              {getVisible(3).map(({ project, index }) => (
                <ProjectCard key={project.name} index={index} {...project} />
              ))}
            </Motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* indicadores */}
      <div className="max-w-6xl mx-auto px-8 mt-8 flex items-center gap-4">
        <div className="flex gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === current ? 'bg-[#fe8019]' : 'bg-[#504945]'}`}
            />
          ))}
        </div>
        <span className="text-[#504945] font-mono text-sm ml-auto">
          {current + 1} — {total}
        </span>
      </div>

    </section>
  )
}

export default Projects
