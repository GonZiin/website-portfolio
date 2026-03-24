import { motion as Motion } from 'framer-motion'
import { useState } from 'react'

export default function AdminAuthModal({ open, onClose, onLogin, busy }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!open) return null

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm px-4 py-10 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <Motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-lg mx-auto bg-[#1d2021] border border-[#504945] rounded-lg overflow-hidden"
      >
          <div className="flex items-center gap-2 px-4 py-3 bg-[#32302f] border-b border-[#504945]">
            <span className="w-3 h-3 rounded-full bg-[#cc241d]" />
            <span className="w-3 h-3 rounded-full bg-[#fabd2f]" />
            <span className="w-3 h-3 rounded-full bg-[#b8bb26]" />
            <span className="text-[#a89984] font-mono text-xs ml-2 truncate">~/admin/login</span>
            <button
              onClick={onClose}
              className="ml-auto text-[#a89984] font-mono text-sm hover:text-[#fe8019] transition-colors"
            >
              x
            </button>
          </div>

          <div className="p-6">
            <p className="text-[#a89984] font-mono text-sm leading-relaxed mb-5">
              Login as admin to write and publish posts.
            </p>

            {error ? (
              <div className="px-3 py-2 rounded border border-[#cc241d] bg-[#282828] text-[#ebdbb2] font-mono text-xs mb-4">
                {error}
              </div>
            ) : null}

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setError('')
                try {
                  await onLogin({ email, password })
                  onClose()
                } catch (err) {
                  const msg =
                    (typeof err?.message === 'string' && err.message) ||
                    (typeof err === 'string' && err) ||
                    (typeof err?.error_description === 'string' && err.error_description) ||
                    null
                  const code = typeof err?.code === 'string' ? err.code : null
                  const status = typeof err?.status === 'number' ? String(err.status) : null

                  setError(
                    [msg || 'Login failed.', code ? `code=${code}` : null, status ? `status=${status}` : null]
                      .filter(Boolean)
                      .join(' '),
                  )
                }
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="text-[#fe8019] font-mono text-xs mb-1 block">$ email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#282828] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] font-mono text-sm focus:outline-none focus:border-[#fe8019] transition-colors"
                  placeholder="admin@email.com"
                />
              </div>
              <div>
                <label className="text-[#fe8019] font-mono text-xs mb-1 block">$ password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#282828] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] font-mono text-sm focus:outline-none focus:border-[#fe8019] transition-colors"
                />
              </div>
              <Motion.button
                type="submit"
                disabled={busy}
                whileHover={{ scale: busy ? 1 : 1.02 }}
                whileTap={{ scale: busy ? 1 : 0.98 }}
                className={`w-full py-3 rounded font-bold font-mono transition-colors ${
                  busy
                    ? 'bg-[#504945] text-[#282828]'
                    : 'bg-[#fe8019] text-[#282828] hover:bg-[#fabd2f]'
                }`}
              >
                {'>'} login
              </Motion.button>
            </form>
          </div>
      </Motion.div>
    </Motion.div>
  )
}
