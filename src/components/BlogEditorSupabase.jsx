import { useMemo, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { uploadAttachments, upsertPost } from '../blog/remoteBlog'

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function todayISO() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function BlogEditorSupabase({ open, onClose, onPublished }) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [date, setDate] = useState(todayISO())
  const [excerpt, setExcerpt] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(true)
  const [files, setFiles] = useState([])

  const [tab, setTab] = useState('write')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const tags = useMemo(() => {
    return tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  }, [tagsText])

  const cleanSlug = useMemo(() => slugify(slug || title), [slug, title])

  const onPickFiles = (fileList) => {
    const arr = Array.from(fileList || [])
    if (!arr.length) return
    setFiles((prev) => [...prev, ...arr])
  }

  const removeFile = (name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name))
  }

  const publish = async () => {
    setError('')
    const t = title.trim()
    const s = cleanSlug
    if (!t) return setError('Title is required.')
    if (!s) return setError('Slug is required.')
    if (!content.trim()) return setError('Content is required.')

    setBusy(true)
    try {
      const row = await upsertPost({
        slug: s,
        title: t,
        excerpt: excerpt.trim(),
        content_md: content,
        tags,
        date,
        published,
      })

      await uploadAttachments({ postId: row.id, slug: s, files })

      onPublished?.({ slug: s })

      setTitle('')
      setSlug('')
      setDate(todayISO())
      setExcerpt('')
      setTagsText('')
      setContent('')
      setPublished(true)
      setFiles([])
      onClose()
    } catch (e) {
      setError(e?.message || 'Publish failed.')
    } finally {
      setBusy(false)
    }
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[85] bg-black/70 backdrop-blur-sm px-4 py-10 overflow-y-auto"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <Motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="max-w-6xl mx-auto bg-[#1d2021] border border-[#504945] rounded-lg overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-[#32302f] border-b border-[#504945]">
            <span className="w-3 h-3 rounded-full bg-[#cc241d]" />
            <span className="w-3 h-3 rounded-full bg-[#fabd2f]" />
            <span className="w-3 h-3 rounded-full bg-[#b8bb26]" />
            <span className="text-[#a89984] font-mono text-xs ml-2 truncate">~/blog/admin/write</span>
            <button
              onClick={onClose}
              className="ml-auto text-[#a89984] font-mono text-sm hover:text-[#fe8019] transition-colors"
            >
              x
            </button>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-[46%]">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setTab('write')}
                    className={`px-3 py-2 font-mono text-xs rounded border transition-colors ${
                      tab === 'write'
                        ? 'border-[#fe8019] text-[#fe8019] bg-[#282828]'
                        : 'border-[#504945] text-[#a89984] hover:border-[#fe8019]/60'
                    }`}
                  >
                    write
                  </button>
                  <button
                    onClick={() => setTab('preview')}
                    className={`px-3 py-2 font-mono text-xs rounded border transition-colors ${
                      tab === 'preview'
                        ? 'border-[#fe8019] text-[#fe8019] bg-[#282828]'
                        : 'border-[#504945] text-[#a89984] hover:border-[#fe8019]/60'
                    }`}
                  >
                    preview
                  </button>
                  <span className="ml-auto text-[#504945] font-mono text-xs">slug: {cleanSlug || '...'}</span>
                </div>

                {error ? (
                  <div className="px-3 py-2 rounded border border-[#cc241d] bg-[#282828] text-[#ebdbb2] font-mono text-xs mb-4">
                    {error}
                  </div>
                ) : null}

                {tab === 'write' ? (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#fe8019] font-mono text-xs mb-1 block">$ title</label>
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-[#282828] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] font-mono text-sm focus:outline-none focus:border-[#fe8019] transition-colors"
                          placeholder="Post title"
                        />
                      </div>
                      <div>
                        <label className="text-[#fe8019] font-mono text-xs mb-1 block">$ date</label>
                        <input
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-[#282828] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] font-mono text-sm focus:outline-none focus:border-[#fe8019] transition-colors"
                          placeholder="YYYY-MM-DD"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#fe8019] font-mono text-xs mb-1 block">$ slug (optional)</label>
                        <input
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          className="w-full bg-[#282828] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] font-mono text-sm focus:outline-none focus:border-[#fe8019] transition-colors"
                          placeholder="my-post"
                        />
                      </div>
                      <div>
                        <label className="text-[#fe8019] font-mono text-xs mb-1 block">$ tags</label>
                        <input
                          value={tagsText}
                          onChange={(e) => setTagsText(e.target.value)}
                          className="w-full bg-[#282828] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] font-mono text-sm focus:outline-none focus:border-[#fe8019] transition-colors"
                          placeholder="c, notes, devlog"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[#fe8019] font-mono text-xs mb-1 block">$ excerpt</label>
                      <input
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="w-full bg-[#282828] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] font-mono text-sm focus:outline-none focus:border-[#fe8019] transition-colors"
                        placeholder="Short intro used on the list"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        id="published"
                        type="checkbox"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        className="accent-[#fe8019]"
                      />
                      <label htmlFor="published" className="text-[#a89984] font-mono text-sm">
                        published
                      </label>
                    </div>

                    <div>
                      <label className="text-[#fe8019] font-mono text-xs mb-1 block">$ content (markdown)</label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={14}
                        className="w-full bg-[#0f1110] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] font-mono text-sm focus:outline-none focus:border-[#fe8019] transition-colors resize-none"
                        placeholder="# Heading\n\nWrite your post..."
                      />
                    </div>

                    <div className="rounded border border-[#504945] bg-[#282828]">
                      <div className="px-4 py-3 border-b border-[#504945] flex items-center gap-2">
                        <span className="text-[#fe8019] font-mono text-xs">$ attachments</span>
                        <span className="ml-auto text-[#504945] font-mono text-xs">{files.length}</span>
                      </div>
                      <div className="p-4 flex flex-col gap-3">
                        <input
                          type="file"
                          multiple
                          onChange={(e) => onPickFiles(e.target.files)}
                          className="text-[#a89984] font-mono text-xs"
                        />

                        {files.length ? (
                          <div className="flex flex-col gap-2">
                            {files.map((f) => (
                              <div
                                key={f.name}
                                className="flex items-center gap-3 px-3 py-2 bg-[#1d2021] border border-[#504945] rounded"
                              >
                                <span className="text-[#fe8019] font-mono text-sm">{'>'}</span>
                                <span className="text-[#ebdbb2] font-mono text-sm truncate">{f.name}</span>
                                <button
                                  onClick={() => removeFile(f.name)}
                                  className="ml-auto text-[#a89984] font-mono text-xs hover:text-[#fe8019] transition-colors"
                                >
                                  remove
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[#504945] font-mono text-xs">
                            Uploads to storage bucket "blog" at {cleanSlug ? `${cleanSlug}/...` : '<slug>/...'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded border border-[#504945] bg-[#0f1110] p-5 text-[#a89984]">
                    <h3 className="text-[#ebdbb2] font-mono text-2xl font-bold mb-2">{title || 'Untitled'}</h3>
                    {excerpt ? <p className="font-mono text-sm text-[#a89984] mb-6">{excerpt}</p> : null}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content || 'Write something in the editor to preview it here.'}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              <div className="lg:flex-1">
                <div className="rounded border border-[#504945] bg-[#282828] overflow-hidden h-fit">
                  <div className="px-4 py-3 border-b border-[#504945] flex items-center gap-2">
                    <span className="text-[#fe8019] font-mono text-xs">$ publish</span>
                    <span className="ml-auto text-[#504945] font-mono text-xs">writes to supabase</span>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <Motion.button
                      onClick={publish}
                      disabled={busy}
                      whileHover={{ scale: busy ? 1 : 1.02 }}
                      whileTap={{ scale: busy ? 1 : 0.98 }}
                      className={`w-full py-3 rounded font-bold font-mono transition-colors ${
                        busy
                          ? 'bg-[#504945] text-[#282828]'
                          : 'bg-[#fe8019] text-[#282828] hover:bg-[#fabd2f]'
                      }`}
                    >
                      {'>'} publish
                    </Motion.button>

                    <p className="text-[#504945] font-mono text-xs leading-relaxed">
                      Publishing makes the post available immediately (no commit/deploy).
                      Security must be enforced by Supabase RLS.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  )
}
