import { motion } from 'framer-motion'
import { useState } from 'react'

const links = [
  {
    label: "GitHub",
    value: "github.com/GonZiin",
    href: "https://github.com/GonZiin",
    icon: "//",
    color: "#ebdbb2"
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/gonçalo-gomes",
    href: "https://www.linkedin.com/in/gon%C3%A7alo-gomes-729aa330a/",
    icon: "in",
    color: "#83a598"
  },
  {
    label: "Email",
    value: "goncalogomespessoal@outlook.pt",
    href: "mailto:goncalogomespessoal@outlook.pt",
    icon: "@",
    color: "#fe8019"
  },
]

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    window.location.href = `mailto:goncalogomespessoal@outlook.pt?subject=Portfolio - ${form.name}&body=${form.message} (${form.email})`
    setSent(true)
  }

  return (
    <section id="contact" className="bg-[#282828] py-24">
      <div className="max-w-6xl mx-auto px-8">

        {/* header */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#fe8019] font-mono text-sm mb-2 tracking-widest"
        >
          // get in touch
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[#ebdbb2] text-5xl font-bold font-mono mb-2"
        >
          Contact<span className="text-[#fe8019]">.</span>
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="h-px bg-gradient-to-r from-[#504945] to-transparent origin-left mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* left side — links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <p className="text-[#a89984] font-mono text-sm mb-6 leading-relaxed">
              Got an interesting project, an opportunity, or just want to talk about C and physics?<br />
              <span className="text-[#fe8019]">I'm available.</span>
            </p>

            {links.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ x: 6 }}
                className="flex items-center gap-4 p-4 bg-[#1d2021] border border-[#504945] rounded-lg hover:border-[#fe8019] transition-colors duration-300 group"
              >
                <span
                  className="font-mono font-bold text-lg w-8 text-center"
                  style={{ color: link.color }}
                >
                  {link.icon}
                </span>
                <div>
                  <p className="text-[#ebdbb2] font-mono text-sm font-bold">{link.label}</p>
                  <p className="text-[#a89984] font-mono text-xs">{link.value}</p>
                </div>
                <span className="ml-auto text-[#504945] group-hover:text-[#fe8019] font-mono transition-colors">
                  {'>'}
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* right side — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#1d2021] border border-[#504945] rounded-lg overflow-hidden"
          >
            {/* terminal bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#32302f] border-b border-[#504945]">
              <span className="w-3 h-3 rounded-full bg-[#cc241d]" />
              <span className="w-3 h-3 rounded-full bg-[#fabd2f]" />
              <span className="w-3 h-3 rounded-full bg-[#b8bb26]" />
              <span className="text-[#a89984] font-mono text-xs ml-2">~/contact/new-message</span>
            </div>

            {sent ? (
              <div className="p-8 flex flex-col items-center justify-center h-64 gap-4">
                <span className="text-[#b8bb26] font-mono text-4xl">✓</span>
                <p className="text-[#ebdbb2] font-mono">message sent!</p>
                <p className="text-[#a89984] font-mono text-sm">talk soon :)</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="text-[#fe8019] font-mono text-xs mb-1 block">$ name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#282828] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] font-mono text-sm focus:outline-none focus:border-[#fe8019] transition-colors"
                    placeholder="your name"
                  />
                </div>
                <div>
                  <label className="text-[#fe8019] font-mono text-xs mb-1 block">$ email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#282828] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] font-mono text-sm focus:outline-none focus:border-[#fe8019] transition-colors"
                    placeholder="your email"
                  />
                </div>
                <div>
                  <label className="text-[#fe8019] font-mono text-xs mb-1 block">$ message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-[#282828] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] font-mono text-sm focus:outline-none focus:border-[#fe8019] transition-colors resize-none"
                    placeholder="how can I help you?"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-[#fe8019] text-[#282828] font-bold font-mono rounded hover:bg-[#fabd2f] transition-colors"
                >
                  {'>'} send message
                </motion.button>
              </form>
            )}
          </motion.div>

        </div>

        {/* footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 pt-8 border-t border-[#504945] flex justify-between items-center"
        >
          <span className="text-[#504945] font-mono text-xs">© 2025 Gonçalo Gomes</span>
          <span className="text-[#504945] font-mono text-xs">built with React + Tailwind</span>
        </motion.div>

      </div>
    </section>
  )
}

export default Contact