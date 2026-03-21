import { motion } from 'framer-motion'

const skills = [
  {
    category: "Languages",
    icon: "//",
    color: "#fe8019",
    items: ["C", "Java", "Python"]
  },
  {
    category: "Tools & Tech",
    icon: "$",
    color: "#b8bb26",
    items: ["Git", "Linux", "SDL2", "Docker", "Scrum"]
  },
  {
    category: "Concepts",
    icon: ">>",
    color: "#83a598",
    items: ["Algorithms", "Operating Systems", "Physics Simulations", "Agentic AI"]
  },
  {
    category: "Research",
    icon: "##",
    color: "#d3869b",
    items: ["WORLD CIST 25", "Agentic AI Papers", "Open Source"]
  },
  {
    category: "Homelab & Interests",
    icon: "~",
    color: "#fabd2f",
    items: ["Self-hosted Infrastructure", "Linux Enthusiast", "Game Enthusiast"]
  },
]

function Skills() {
  const featured = skills[0]
  const rest = skills.slice(1)

  return (
    <section id="skills" className="bg-[#282828] py-24">
      <div className="max-w-6xl mx-auto px-8">

        {/* cabeçalho */}
        <div className="flex items-end gap-6 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[#fe8019] font-mono text-sm mb-2 tracking-widest"
            >
              // what i know
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[#ebdbb2] text-5xl font-bold font-mono"
            >
              Skills<span className="text-[#fe8019]">.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 h-px bg-gradient-to-r from-[#504945] to-transparent origin-left mb-3"
          />
        </div>

        {/* layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* card destaque — Languages */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 lg:row-span-2 bg-[#282828] border border-[#504945] rounded-lg overflow-hidden hover:border-[#fe8019] transition-colors duration-300 group flex flex-col"
          >
            {/* terminal bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#32302f] border-b border-[#504945]">
              <span className="w-3 h-3 rounded-full bg-[#cc241d]" />
              <span className="w-3 h-3 rounded-full bg-[#fabd2f]" />
              <span className="w-3 h-3 rounded-full bg-[#b8bb26]" />
              <span className="text-[#a89984] font-mono text-xs ml-2">~/skills/languages</span>
            </div>

            <div className="p-8 flex flex-col flex-1">
              <span className="text-[#fe8019] font-mono text-4xl font-bold mb-2">{featured.icon}</span>
              <h3 className="text-[#ebdbb2] font-mono text-2xl font-bold mb-6">{featured.category}</h3>

              <div className="flex flex-col gap-4 flex-1">
                {featured.items.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                    className="flex items-center gap-3 p-3 bg-[#1d2021] rounded border border-[#504945] group-hover:border-[#fe8019]/30 transition-colors"
                  >
                    <span className="text-[#fe8019] font-mono text-lg font-bold">&gt;</span>
                    <span className="text-[#ebdbb2] font-mono text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* decoração em baixo */}
              <div className="mt-8 pt-6 border-t border-[#504945]">
                <span className="text-[#504945] font-mono text-xs">5+ years experience</span>
              </div>
            </div>
          </motion.div>

          {/* cards restantes */}
          {rest.map((skill, index) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#282828] border border-[#504945] rounded-lg overflow-hidden hover:border-[#fe8019] transition-colors duration-300 group"
            >
              {/* header colorido por categoria */}
              <div
                className="flex items-center gap-3 px-4 py-3 border-b border-[#504945]"
                style={{ backgroundColor: skill.color + '15' }}
              >
                <span className="font-mono font-bold" style={{ color: skill.color }}>{skill.icon}</span>
                <span className="text-[#ebdbb2] font-mono text-sm font-bold">{skill.category}</span>
                <span className="ml-auto text-[#504945] font-mono text-xs">{skill.items.length} items</span>
              </div>

              {/* items */}
              <div className="p-4 flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-xs px-3 py-1.5 rounded border transition-colors duration-200"
                    style={{
                      color: skill.color,
                      borderColor: skill.color + '40',
                      backgroundColor: skill.color + '10'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default Skills