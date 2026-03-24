import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function toYamlValue(value, indent = 0) {
  const sp = ' '.repeat(indent)
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    return `\n${value.map((v) => `${sp}- ${toYamlValue(v, indent + 2).trimStart()}`).join('\n')}`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
    if (!entries.length) return '{}' 
    return `\n${entries
      .map(([k, v]) => {
        if (Array.isArray(v) || (v && typeof v === 'object')) {
          return `${sp}${k}:${toYamlValue(v, indent + 2)}`
        }
        return `${sp}${k}: ${toYamlValue(v, indent + 2).trimStart()}`
      })
      .join('\n')}`
  }

  if (typeof value === 'string') {
    const needsQuotes = /[:\n[\]{},#&*!|>'"%@`]/.test(value) || value.trim() !== value || value === ''
    if (!needsQuotes) return value
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value == null) return 'null'
  return String(value)
}

function buildMarkdown({ title, date, excerpt, tags, attachments, content }) {
  const fm = {
    title,
    date,
    excerpt,
    tags: tags.filter(Boolean),
    attachments: attachments.map((a) => ({
      label: a.label,
      url: a.url,
      kind: a.kind,
    })),
  }

  const lines = ['---']
  Object.entries(fm).forEach(([k, v]) => {
    if (v == null) return
    if (typeof v === 'string' && v === '') return
    if (Array.isArray(v) && v.length === 0) return
    lines.push(`${k}: ${toYamlValue(v)}`)
  })
  lines.push('---', '')
  return lines.join('\n') + (content || '') + (String(content || '').endsWith('\n') ? '' : '\n')
}

const DRAFT_KEY = 'blogEditorDraft_v1'

export default function BlogEditor({ open, onClose }) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [date, setDate] = useState(todayISO())
  const [excerpt, setExcerpt] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [content, setContent] = useState('')
  const [attachments, setAttachments] = useState([])
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('write')

  useEffect(() => {
    if (!open) return
    setError('')

    try {
      const raw = window.localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw)

      setTitle(typeof draft.title === 'string' ? draft.title : '')
      setSlug(typeof draft.slug === 'string' ? draft.slug : '')
      setDate(typeof draft.date === 'string' ? draft.date : todayISO())
      setExcerpt(typeof draft.excerpt === 'string' ? draft.excerpt : '')
      setTagsText(typeof draft.tagsText === 'string' ? draft.tagsText : '')
      setContent(typeof draft.content === 'string' ? draft.content : '')
      setAttachments(Array.isArray(draft.attachments) ? draft.attachments : [])
    } catch {
      // ignore
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const nextSlug = slugify(slug || title)
    setSlug(nextSlug)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  useEffect(() => {
    if (!open) return
    const cleanSlug = slugify(slug)
    if (!cleanSlug) return

    setAttachments((prev) =>
      prev.map((a) => ({
        ...a,
        url: a?.label ? `/blog/${cleanSlug}/${a.label}` : a.url,
      })),
    )
    setFiles((prev) => prev.map((f) => ({ ...f, url: `/blog/${cleanSlug}/${f.name}` })))
  }, [slug, open])

  const tags = useMemo(() => {
    return tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  }, [tagsText])

  const markdown = useMemo(() => {
    return buildMarkdown({ title: title.trim(), date, excerpt: excerpt.trim(), tags, attachments, content })
  }, [title, date, excerpt, tags, attachments, content])

  const saveDraft = () => {
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ title, slug, date, excerpt, tagsText, content, attachments }),
      )
    } catch {
      // ignore
    }
  }

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(DRAFT_KEY)
    } catch {
      // ignore
    }
  }

  const onPickFiles = (fileList) => {
    const arr = Array.from(fileList || [])
    if (!arr.length) return

    const cleanSlug = slugify(slug || title)
    if (!cleanSlug) {
      setError('Set a title (or slug) before adding attachments.')
      return
    }

    const picked = arr.map((f) => {
      const safeName = f.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '')
      const url = `/blog/${cleanSlug}/${safeName}`
      return {
        file: f,
        name: safeName,
        url,
      }
    })

    setFiles((prev) => [...prev, ...picked])
    setAttachments((prev) => [
      ...prev,
      ...picked.map((p) => ({
        label: p.name,
        url: p.url,
        kind: p.name.split('.').pop()?.toLowerCase() || '',
      })),
    ])
  }

  const removeAttachment = (url) => {
    setAttachments((prev) => prev.filter((a) => a.url !== url))
    setFiles((prev) => prev.filter((f) => f.url !== url))
  }

  const exportZip = async () => {
    setError('')
    const cleanTitle = title.trim()
    const cleanSlug = slugify(slug)
    if (!cleanTitle) return setError('Title is required.')
    if (!cleanSlug) return setError('Slug is required.')

    setBusy(true)
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      zip.file(`src/content/blog/${cleanSlug}.md`, buildMarkdown({
        title: cleanTitle,
        date,
        excerpt: excerpt.trim(),
        tags,
        attachments: attachments.map((a) => ({
          ...a,
          url: a.url || `/blog/${cleanSlug}/${a.label}`,
        })),
        content,
      }))

      const folder = zip.folder(`public/blog/${cleanSlug}`)
      for (const f of files) {
        const data = await f.file.arrayBuffer()
        folder.file(f.name, data)
      }

      const blob = await zip.generateAsync({ type: 'blob' })
      downloadBlob(blob, `blog-post-${cleanSlug}.zip`)
      saveDraft()
    } catch (e) {
      setError(e?.message || 'Failed to export zip.')
    } finally {
      setBusy(false)
    }
  }

  const exportMarkdownOnly = () => {
    setError('')
    const cleanSlug = slugify(slug)
    if (!title.trim()) return setError('Title is required.')
    if (!cleanSlug) return setError('Slug is required.')

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    downloadBlob(blob, `${cleanSlug}.md`)
    saveDraft()
  }

  if (!open) return null

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm px-4 py-10 overflow-y-auto"
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
          <span className="text-[#a89984] font-mono text-xs ml-2 truncate">~/blog/new-post</span>
          <button
            onClick={() => {
              saveDraft()
              onClose()
            }}
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
                <span className="ml-auto text-[#504945] font-mono text-xs">saved as draft on close</span>
              </div>

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
                      <label className="text-[#fe8019] font-mono text-xs mb-1 block">$ slug</label>
                      <input
                        value={slug}
                        onChange={(e) => setSlug(slugify(e.target.value))}
                        className="w-full bg-[#282828] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] font-mono text-sm focus:outline-none focus:border-[#fe8019] transition-colors"
                        placeholder="my-post"
                      />
                      <p className="text-[#504945] font-mono text-xs mt-1">opens as /?post={slug || '...'}</p>
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
                      <span className="ml-auto text-[#504945] font-mono text-xs">{attachments.length}</span>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => onPickFiles(e.target.files)}
                        className="text-[#a89984] font-mono text-xs"
                      />

                      {attachments.length ? (
                        <div className="flex flex-col gap-2">
                          {attachments.map((a) => (
                            <div
                              key={a.url}
                              className="flex items-center gap-3 px-3 py-2 bg-[#1d2021] border border-[#504945] rounded"
                            >
                              <span className="text-[#fe8019] font-mono text-sm">{'>'}</span>
                              <span className="text-[#ebdbb2] font-mono text-sm truncate">{a.label}</span>
                              <span className="ml-auto text-[#504945] font-mono text-xs truncate">{a.url}</span>
                              <button
                                onClick={() => removeAttachment(a.url)}
                                className="text-[#a89984] font-mono text-xs hover:text-[#fe8019] transition-colors"
                              >
                                remove
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#504945] font-mono text-xs">Files will be exported into public/blog/{slug || '<slug>'}/</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded border border-[#504945] bg-[#0f1110] p-5 text-[#a89984]">
                  <h3 className="text-[#ebdbb2] font-mono text-2xl font-bold mb-2">{title || 'Untitled'}</h3>
                  {excerpt ? <p className="font-mono text-sm text-[#a89984] mb-6">{excerpt}</p> : null}
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
                      code: ({ inline, children, ...rest }) => {
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
                        return <code {...rest}>{children}</code>
                      },
                      pre: (p) => (
                        <pre
                          {...p}
                          className="my-5 p-4 overflow-x-auto rounded border border-[#504945] bg-[#0b0d0c] text-[#ebdbb2] font-mono text-sm"
                        />
                      ),
                    }}
                  >
                    {content || 'Write something in the editor to preview it here.'}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            <div className="lg:flex-1">
              <div className="rounded border border-[#504945] bg-[#282828] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#504945] flex items-center gap-2">
                  <span className="text-[#fe8019] font-mono text-xs">$ export</span>
                  <span className="ml-auto text-[#504945] font-mono text-xs">zip includes md + attachments</span>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {error ? (
                    <div className="px-3 py-2 rounded border border-[#cc241d] bg-[#1d2021] text-[#ebdbb2] font-mono text-xs">
                      {error}
                    </div>
                  ) : null}

                  <div className="flex flex-col md:flex-row gap-3">
                    <Motion.button
                      onClick={exportZip}
                      disabled={busy}
                      whileHover={{ scale: busy ? 1 : 1.02 }}
                      whileTap={{ scale: busy ? 1 : 0.98 }}
                      className={`flex-1 py-3 rounded font-bold font-mono transition-colors ${
                        busy
                          ? 'bg-[#504945] text-[#282828]'
                          : 'bg-[#fe8019] text-[#282828] hover:bg-[#fabd2f]'
                      }`}
                    >
                      {'>'} export zip
                    </Motion.button>
                    <Motion.button
                      onClick={exportMarkdownOnly}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 rounded font-bold font-mono border-2 border-[#fe8019] text-[#fe8019] hover:bg-[#fe8019] hover:text-[#282828] transition-colors"
                    >
                      {'>'} download md
                    </Motion.button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3">
                    <button
                      onClick={() => {
                        saveDraft()
                      }}
                      className="flex-1 px-4 py-2 border border-[#504945] text-[#a89984] font-mono text-xs rounded hover:border-[#fe8019]/60 hover:text-[#fe8019] transition-colors"
                    >
                      save draft
                    </button>
                    <button
                      onClick={() => {
                        clearDraft()
                        setTitle('')
                        setSlug('')
                        setDate(todayISO())
                        setExcerpt('')
                        setTagsText('')
                        setContent('')
                        setAttachments([])
                        setFiles([])
                        setError('')
                      }}
                      className="flex-1 px-4 py-2 border border-[#504945] text-[#a89984] font-mono text-xs rounded hover:border-[#cc241d]/60 hover:text-[#cc241d] transition-colors"
                    >
                      clear draft
                    </button>
                  </div>

                  <div className="rounded border border-[#504945] bg-[#1d2021] overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#504945] flex items-center gap-2">
                      <span className="text-[#fe8019] font-mono text-xs">$ markdown output</span>
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(markdown)
                          } catch {
                            setError('Clipboard not available in this browser.')
                          }
                        }}
                        className="ml-auto text-[#a89984] font-mono text-xs hover:text-[#fe8019] transition-colors"
                      >
                        copy
                      </button>
                    </div>
                    <pre className="p-4 text-[#ebdbb2] font-mono text-xs overflow-x-auto whitespace-pre">
                      {markdown}
                    </pre>
                  </div>

                  <p className="text-[#504945] font-mono text-xs leading-relaxed">
                    After exporting: unzip into the project root. The files land in
                    src/content/blog/ and public/blog/. Then commit + deploy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  )
}
