import { motion as Motion } from 'framer-motion'
import { useMemo } from 'react'

const noiseChars = ['0', '1', '{', '}', '<', '>', '//', ';']

function pickChar(seedA, seedB) {
  const x = (seedA * 1103515245 + seedB * 12345) >>> 0
  return noiseChars[x % noiseChars.length]
}

function ProjectCard({ name, description, link, tech, index, image }) {
  const noise = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => pickChar(index + 1, i + 1))
  }, [index])

  return (
    <Motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full bg-[#1d2021] rounded-lg overflow-hidden border border-[#504945] hover:border-[#fe8019] transition-all duration-300 group"
    >
      {/* barra de terminal */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#32302f] border-b border-[#504945]">
        <span className="w-3 h-3 rounded-full bg-[#cc241d] flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#fabd2f] flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#b8bb26] flex-shrink-0" />
        <span className="text-[#a89984] font-mono text-xs ml-2 truncate">
          ~/projects/{name.toLowerCase().replace(/ /g, '-')}
        </span>
      </div>

      {/* imagem */}
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-[#1d2021] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex flex-wrap content-start p-2 opacity-20 select-none">
              {noise.map((ch, i) => (
                <span key={i} className="text-[#fe8019] font-mono text-xs w-6 text-center">
                  {ch}
                </span>
              ))}
            </div>
            <span className="relative text-[#504945] font-mono text-5xl font-bold z-10">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-[#fe8019] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </div>

      {/* conteúdo */}
      <div className="p-6">
        <h3 className="text-[#ebdbb2] text-lg font-bold font-mono mb-2 group-hover:text-[#fe8019] transition-colors">
          {name}
        </h3>
        <p className="text-[#a89984] text-sm leading-relaxed mb-4">{description}</p>

        <div className="flex gap-2 flex-wrap mb-6">
          {tech.map((t) => (
            <span key={t} className="text-xs bg-[#282828] text-[#fe8019] font-mono px-2 py-1 rounded border border-[#504945]">
              {t}
            </span>
          ))}
        </div>

        {link.startsWith('http') ? (
          <Motion.a
            href={link}
            target="_blank"
            rel="noreferrer"
            whileHover={{ x: 4 }}
            className="text-[#fe8019] font-mono text-sm hover:text-[#fabd2f] transition-colors"
          >
            {'>'} github
          </Motion.a>
        ) : (
          <span className="text-[#504945] font-mono text-sm">{'>'} not open source</span>
        )}
      </div>
    </Motion.div>
  )
}

export default ProjectCard
