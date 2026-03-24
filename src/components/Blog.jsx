import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import localPosts from '../blog/posts'
import AdminAuthModal from './AdminAuthModal'
import BlogEditorSupabase from './BlogEditorSupabase'
import {
  fetchPostBySlug,
  fetchPublishedPosts,
  deletePostBySlug,
  getSession,
  isSupabaseConfigured,
  signInWithPassword,
  signOut,
} from '../blog/remoteBlog'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

function getSelectedSlug() {
  const url = new URL(window.location.href)
  return url.searchParams.get('post')
}

function setSelectedSlug(slug) {
  const url = new URL(window.location.href)
  if (slug) url.searchParams.set('post', slug)
  else url.searchParams.delete('post')
  window.history.pushState({}, '', url)
}

function BlogPostModal({ post, onClose, canDelete, onDeleted }) {
  if (!post) return null

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm px-4 py-10 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <Motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-3xl mx-auto bg-[#1d2021] border border-[#504945] rounded-lg overflow-hidden"
      >
          {/* terminal bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#32302f] border-b border-[#504945]">
            <span className="w-3 h-3 rounded-full bg-[#cc241d]" />
            <span className="w-3 h-3 rounded-full bg-[#fabd2f]" />
            <span className="w-3 h-3 rounded-full bg-[#b8bb26]" />
            <span className="text-[#a89984] font-mono text-xs ml-2 truncate">
              ~/blog/{post.slug}
            </span>
            {canDelete ? (
              <button
                onClick={async () => {
                  const ok = window.confirm(`Delete post "${post.title}"? This cannot be undone.`)
                  if (!ok) return
                  await onDeleted?.(post.slug)
                }}
                className="ml-auto text-[#a89984] font-mono text-sm hover:text-[#cc241d] transition-colors"
              >
                delete
              </button>
            ) : null}
            <button
              onClick={onClose}
              className={`${canDelete ? '' : 'ml-auto '}text-[#a89984] font-mono text-sm hover:text-[#fe8019] transition-colors`}
            >
              x
            </button>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-2 mb-6">
              <h3 className="text-[#ebdbb2] text-3xl font-bold font-mono">{post.title}</h3>
              <div className="flex flex-wrap items-center gap-3">
                {post.date ? (
                  <span className="text-[#504945] font-mono text-xs">{formatDate(post.date)}</span>
                ) : null}
                {post.tags?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-[#282828] text-[#fe8019] font-mono px-2 py-1 rounded border border-[#504945]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {post.attachments?.length ? (
              <div className="mb-8 rounded border border-[#504945] bg-[#282828]">
                <div className="px-4 py-3 border-b border-[#504945] flex items-center gap-2">
                  <span className="text-[#fe8019] font-mono text-xs">$ attachments</span>
                  <span className="ml-auto text-[#504945] font-mono text-xs">{post.attachments.length}</span>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {post.attachments.map((a) => (
                    <a
                      key={a.url}
                      href={a.url}
                      className="flex items-center gap-3 px-3 py-2 bg-[#1d2021] border border-[#504945] rounded hover:border-[#fe8019] transition-colors"
                    >
                      <span className="text-[#fe8019] font-mono text-sm">{'>'}</span>
                      <span className="text-[#ebdbb2] font-mono text-sm">{a.label}</span>
                      {a.kind ? (
                        <span className="ml-auto text-[#504945] font-mono text-xs">{a.kind}</span>
                      ) : (
                        <span className="ml-auto text-[#504945] font-mono text-xs">download</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="text-[#a89984]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: (p) => <h1 {...p} className="text-[#ebdbb2] font-mono text-2xl font-bold mt-8 mb-3" />,
                  h2: (p) => <h2 {...p} className="text-[#ebdbb2] font-mono text-xl font-bold mt-7 mb-3" />,
                  h3: (p) => <h3 {...p} className="text-[#ebdbb2] font-mono text-lg font-bold mt-6 mb-2" />,
                  p: (p) => <p {...p} className="leading-relaxed my-4" />,
                  a: (p) => (
                    <a
                      {...p}
                      className="text-[#fe8019] hover:text-[#fabd2f] underline underline-offset-4"
                      target={p.href?.startsWith('http') ? '_blank' : undefined}
                      rel={p.href?.startsWith('http') ? 'noreferrer' : undefined}
                    />
                  ),
                  ul: (p) => <ul {...p} className="list-disc pl-6 my-4 space-y-2" />,
                  ol: (p) => <ol {...p} className="list-decimal pl-6 my-4 space-y-2" />,
                  li: (p) => <li {...p} className="leading-relaxed" />,
                  blockquote: (p) => (
                    <blockquote
                      {...p}
                      className="my-5 pl-4 border-l-2 border-[#504945] text-[#a89984] italic"
                    />
                  ),
                  hr: (p) => <hr {...p} className="my-8 border-[#504945]" />,
                  code: ({ inline, className, children, ...rest }) => {
                    if (inline) {
                      return (
                        <code
                          {...rest}
                          className="font-mono text-sm px-1.5 py-0.5 rounded border border-[#504945] bg-[#282828] text-[#ebdbb2]"
                        >
                          {children}
                        </code>
                      )
                    }
                    return (
                      <code {...rest} className={className}>
                        {children}
                      </code>
                    )
                  },
                  pre: (p) => (
                    <pre
                      {...p}
                      className="my-5 p-4 overflow-x-auto rounded border border-[#504945] bg-[#0f1110] text-[#ebdbb2] font-mono text-sm"
                    />
                  ),
                  table: (p) => (
                    <div className="my-6 overflow-x-auto">
                      <table {...p} className="w-full border border-[#504945] text-sm" />
                    </div>
                  ),
                  th: (p) => <th {...p} className="border border-[#504945] px-3 py-2 text-left text-[#ebdbb2]" />,
                  td: (p) => <td {...p} className="border border-[#504945] px-3 py-2" />,
                }}
              >
                {typeof post.content === 'string' ? post.content : 'Loading...'}
              </ReactMarkdown>
            </div>
          </div>
      </Motion.div>
    </Motion.div>
  )
}

function Blog() {
  const [selected, setSelected] = useState(null)
  const [posts, setPosts] = useState(localPosts)
  const [source, setSource] = useState('local')
  const [loading, setLoading] = useState(false)

  const [authOpen, setAuthOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [authBusy, setAuthBusy] = useState(false)
  const [session, setSession] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const bySlugLive = useMemo(() => {
    const map = new Map()
    posts.forEach((p) => map.set(p.slug, p))
    return map
  }, [posts])

  useEffect(() => {
    const sync = () => {
      const slug = getSelectedSlug()
      setSelected(slug && bySlugLive.has(slug) ? slug : null)
    }

    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [bySlugLive])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      setLoading(true)
      try {
        if (isSupabaseConfigured()) {
          const list = await fetchPublishedPosts()
          if (!cancelled && list?.length) {
            setPosts(list)
            setSource('remote')
          }
        }
      } catch {
        // fallback to local
      } finally {
        if (!cancelled) setLoading(false)
      }

      try {
        const s = await getSession()
        if (!cancelled) setSession(s)
      } catch {
        // ignore
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  const openPost = (slug) => {
    setSelectedSlug(slug)
    setSelected(slug)
  }

  const close = () => {
    setSelectedSlug(null)
    setSelected(null)
  }

  const selectedPost = selected ? bySlugLive.get(selected) : null

  useEffect(() => {
    if (!selected || source !== 'remote') return
    const current = bySlugLive.get(selected)
    if (!current || (typeof current.content === 'string' && current.content.length)) return

    let cancelled = false
    const load = async () => {
      try {
        const full = await fetchPostBySlug(selected)
        if (!cancelled && full) {
          setPosts((prev) => prev.map((p) => (p.slug === selected ? { ...p, ...full } : p)))
        }
      } catch {
        // ignore
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [selected, source, bySlugLive])

  const isAuthed = Boolean(session?.user)
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  const isAdmin = isAuthed && (!adminEmail || session.user.email === adminEmail)

  const handleDeleted = async (slug) => {
    setDeleteBusy(true)
    try {
      await deletePostBySlug(slug)
      close()
      if (isSupabaseConfigured()) {
        const list = await fetchPublishedPosts()
        setPosts(list)
        setSource('remote')
      } else {
        setPosts((prev) => prev.filter((p) => p.slug !== slug))
      }
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <section id="blog" className="bg-[#282828] py-24">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-end justify-between gap-6 mb-16">
          <div>
            <Motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[#fe8019] font-mono text-sm mb-2 tracking-widest"
            >
              // notes & writeups
            </Motion.p>
            <Motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[#ebdbb2] text-5xl font-bold font-mono"
            >
              Blog<span className="text-[#fe8019]">.</span>
            </Motion.h2>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <Motion.button
                onClick={() => setEditorOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-[#fe8019] text-[#282828] font-bold font-mono rounded hover:bg-[#fabd2f] transition-colors"
              >
                {'>'} escrever
              </Motion.button>
            ) : (
              <button
                onClick={() => {
                  if (!isSupabaseConfigured()) return
                  setAuthOpen(true)
                }}
                disabled={!isSupabaseConfigured()}
                className={`px-3 py-2 border font-mono text-xs rounded transition-colors ${
                  !isSupabaseConfigured()
                    ? 'border-[#3c3836] text-[#504945] cursor-not-allowed'
                    : 'border-[#504945] text-[#a89984] hover:border-[#fe8019]/60 hover:text-[#fe8019]'
                }`}
              >
                admin login
              </button>
            )}
            {isAuthed ? (
              <button
                onClick={async () => {
                  await signOut()
                  setSession(null)
                }}
                className="hidden md:block px-3 py-2 border border-[#504945] text-[#a89984] font-mono text-xs rounded hover:border-[#fe8019]/60 hover:text-[#fe8019] transition-colors"
              >
                logout
              </button>
            ) : null}
          </div>
          <Motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 h-px bg-gradient-to-r from-[#504945] to-transparent origin-left mb-3 hidden md:block"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {posts.map((post, index) => (
              <Motion.button
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                onClick={() => openPost(post.slug)}
                className="text-left bg-[#1d2021] border border-[#504945] rounded-lg overflow-hidden hover:border-[#fe8019] transition-colors"
              >
                <div className="flex items-center gap-2 px-4 py-3 bg-[#32302f] border-b border-[#504945]">
                  <span className="w-3 h-3 rounded-full bg-[#cc241d]" />
                  <span className="w-3 h-3 rounded-full bg-[#fabd2f]" />
                  <span className="w-3 h-3 rounded-full bg-[#b8bb26]" />
                  <span className="text-[#a89984] font-mono text-xs ml-2 truncate">~/blog/{post.slug}</span>
                  <span className="ml-auto text-[#504945] font-mono text-xs">{formatDate(post.date)}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#ebdbb2] font-mono text-xl font-bold truncate">
                        {post.title}
                      </h3>
                      {post.excerpt ? (
                        <p className="text-[#a89984] text-sm leading-relaxed mt-2">
                          {post.excerpt}
                        </p>
                      ) : null}
                      {post.tags?.length ? (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className="text-xs bg-[#282828] text-[#fe8019] font-mono px-2 py-1 rounded border border-[#504945]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <span className="text-[#fe8019] font-mono text-sm flex-shrink-0">{'>'} read</span>
                  </div>
                </div>
              </Motion.button>
            ))}
          </div>

          <Motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#1d2021] border border-[#504945] rounded-lg overflow-hidden h-fit"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-[#32302f] border-b border-[#504945]">
              <span className="w-3 h-3 rounded-full bg-[#cc241d]" />
              <span className="w-3 h-3 rounded-full bg-[#fabd2f]" />
              <span className="w-3 h-3 rounded-full bg-[#b8bb26]" />
              <span className="text-[#a89984] font-mono text-xs ml-2">~/blog/how-to-post</span>
            </div>
            <div className="p-6">
              <p className="text-[#a89984] font-mono text-sm leading-relaxed">
                {source === 'remote' ? (
                  <>
                    Posts are loaded from Supabase.
                    Admin can publish instantly (no deploy).
                  </>
                ) : (
                  <>
                    Add a new markdown file in <span className="text-[#ebdbb2]">src/content/blog/</span>.
                    For attachments, drop files in <span className="text-[#ebdbb2]">public/blog/&lt;slug&gt;/</span>
                    and reference them in the post frontmatter.
                  </>
                )}
              </p>

              {loading ? (
                <p className="text-[#504945] font-mono text-xs leading-relaxed mt-4">Loading posts...</p>
              ) : null}

              {!isSupabaseConfigured() ? (
                <p className="text-[#504945] font-mono text-xs leading-relaxed mt-4">
                  To enable instant publishing, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
                </p>
              ) : null}

              <div className="mt-5 rounded border border-[#504945] bg-[#282828] p-4">
                <p className="text-[#fe8019] font-mono text-xs mb-2">frontmatter example</p>
                <pre className="text-[#ebdbb2] font-mono text-xs overflow-x-auto">
{`---
title: "My post"
date: "2026-03-24"
excerpt: "Short intro here"
tags: ["c", "notes"]
attachments:
  - label: "PDF"
    url: "/blog/my-post/file.pdf"
    kind: "pdf"
---`}
                </pre>
              </div>
            </div>
          </Motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedPost ? (
          <BlogPostModal
            post={selectedPost}
            onClose={close}
            canDelete={isAdmin && source === 'remote' && !deleteBusy}
            onDeleted={handleDeleted}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {authOpen ? (
          <AdminAuthModal
            open={authOpen}
            onClose={() => setAuthOpen(false)}
            busy={authBusy}
            onLogin={async ({ email, password }) => {
              setAuthBusy(true)
              try {
                await signInWithPassword({ email, password })
                const s = await getSession()
                setSession(s)
              } finally {
                setAuthBusy(false)
              }
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {editorOpen ? (
          <BlogEditorSupabase
            open={editorOpen}
            onClose={() => setEditorOpen(false)}
            onPublished={async ({ slug }) => {
              try {
                if (isSupabaseConfigured()) {
                  const list = await fetchPublishedPosts()
                  setPosts(list)
                  setSource('remote')
                }
              } catch {
                // ignore
              }
              openPost(slug)
            }}
          />
        ) : null}
      </AnimatePresence>
    </section>
  )
}

export default Blog
