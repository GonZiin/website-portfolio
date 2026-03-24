import YAML from 'yaml'

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) {
    return { data: {}, content: raw }
  }

  const end = raw.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {}, content: raw }
  }

  const fm = raw.slice(3, end).replace(/^\s*\n/, '')
  const rest = raw.slice(end + '\n---'.length)
  const content = rest.replace(/^\s*\n/, '')

  try {
    const data = YAML.parse(fm) || {}
    return { data, content }
  } catch {
    return { data: {}, content: raw }
  }
}

function asString(value) {
  return typeof value === 'string' ? value : ''
}

function asStringArray(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string')
  if (typeof value === 'string') return [value]
  return []
}

function asAttachments(value) {
  if (!Array.isArray(value)) return []

  return value
    .map((a) => {
      if (!a || typeof a !== 'object') return null
      const label = typeof a.label === 'string' ? a.label : null
      const url = typeof a.url === 'string' ? a.url : null
      const kind = typeof a.kind === 'string' ? a.kind : null
      if (!label || !url) return null
      return { label, url, kind }
    })
    .filter(Boolean)
}

const modules = import.meta.glob('../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { data, content } = parseFrontmatter(raw)

    const date = asString(data.date)
    const time = date ? Date.parse(date) : NaN

    return {
      slug,
      title: asString(data.title) || slug,
      date,
      time: Number.isFinite(time) ? time : 0,
      excerpt: asString(data.excerpt),
      tags: asStringArray(data.tags),
      attachments: asAttachments(data.attachments),
      content,
    }
  })
  .sort((a, b) => b.time - a.time)

export default posts
