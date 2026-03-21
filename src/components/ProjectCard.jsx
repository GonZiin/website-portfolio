import { motion } from 'framer-motion'

function ProjectCard({ name, description, link, tech, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="flex-shrink-0 w-80 border border-[#504945] bg-[#32302f] rounded p-6 hover:border-[#fe8019] transition-colors cursor-pointer"
    >
      <span className="text-[#504945] font-mono text-5xl font-bold">
        {String(index + 1).padStart(2, '0')}
      </span>
      
      <h3 className="text-[#ebdbb2] text-xl font-bold font-mono mt-2 mb-3">{name}</h3>
      
      <p className="text-[#a89984] mb-6 text-sm leading-relaxed">{description}</p>
      
      <div className="flex gap-2 flex-wrap mb-6">
        {tech.map((t) => (
          <span key={t} className="text-xs bg-[#282828] text-[#fe8019] font-mono px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>
      
      {}
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="text-[#fe8019] font-mono text-sm hover:text-[#fabd2f] transition-colors"
      >
        ver projeto {'>'}
      </a>
    </motion.div>
  )
}

export default ProjectCard