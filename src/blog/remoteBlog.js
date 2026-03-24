import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const POSTS_TABLE = 'blog_posts'
const ATTACHMENTS_TABLE = 'blog_attachments'
const BUCKET = 'blog'

export { isSupabaseConfigured }

export async function getSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data?.session || null
}

export async function signInWithPassword({ email, password }) {
  if (!supabase) throw new Error('Supabase not configured.')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function fetchPublishedPosts() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from(POSTS_TABLE)
    .select('id, slug, title, excerpt, tags, date, published, published_at, created_at, updated_at')
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || '',
    tags: Array.isArray(p.tags) ? p.tags : [],
    date: p.date || (p.published_at ? String(p.published_at).slice(0, 10) : ''),
    content: null,
    attachments: [],
  }))
}

export async function fetchPostBySlug(slug) {
  if (!supabase) return null

  const { data: post, error } = await supabase
    .from(POSTS_TABLE)
    .select('id, slug, title, excerpt, tags, content_md, date, published, published_at, created_at')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!post) return null

  const { data: attachments, error: attErr } = await supabase
    .from(ATTACHMENTS_TABLE)
    .select('label, path, kind')
    .eq('post_id', post.id)
    .order('created_at', { ascending: true })

  if (attErr) throw attErr

  const mappedAttachments = (attachments || []).map((a) => {
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(a.path)
    return {
      label: a.label,
      url: urlData?.publicUrl || '',
      kind: a.kind || '',
    }
  })

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    tags: Array.isArray(post.tags) ? post.tags : [],
    date: post.date || (post.published_at ? String(post.published_at).slice(0, 10) : ''),
    content: post.content_md || '',
    attachments: mappedAttachments.filter((a) => a.url),
  }
}

export async function upsertPost({
  slug,
  title,
  excerpt,
  content_md,
  tags,
  date,
  published,
}) {
  if (!supabase) throw new Error('Supabase not configured.')

  const payload = {
    slug,
    title,
    excerpt,
    content_md,
    tags,
    date,
    published: Boolean(published),
    published_at: published ? new Date().toISOString() : null,
  }

  const { data, error } = await supabase
    .from(POSTS_TABLE)
    .upsert(payload, { onConflict: 'slug' })
    .select('id, slug')
    .single()

  if (error) throw error
  return data
}

export async function uploadAttachments({ postId, slug, files }) {
  if (!supabase) throw new Error('Supabase not configured.')
  if (!files?.length) return []

  const uploaded = []
  for (const f of files) {
    const safeName = String(f.name)
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '')

    const path = `${slug}/${safeName}`
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, f, { upsert: true, contentType: f.type || undefined })

    if (upErr) throw upErr

    const kind = safeName.includes('.') ? safeName.split('.').pop().toLowerCase() : ''
    const { error: rowErr } = await supabase.from(ATTACHMENTS_TABLE).upsert({
      post_id: postId,
      label: safeName,
      path,
      kind,
    }, { onConflict: 'post_id,path' })

    if (rowErr) throw rowErr
    uploaded.push({ label: safeName, path, kind })
  }

  return uploaded
}

export async function deletePostBySlug(slug) {
  if (!supabase) throw new Error('Supabase not configured.')

  const { data: post, error: postErr } = await supabase
    .from(POSTS_TABLE)
    .select('id, slug')
    .eq('slug', slug)
    .maybeSingle()

  if (postErr) throw postErr
  if (!post) return { deleted: false }

  const { data: attachments, error: attErr } = await supabase
    .from(ATTACHMENTS_TABLE)
    .select('path')
    .eq('post_id', post.id)

  if (attErr) throw attErr

  const paths = (attachments || [])
    .map((a) => (typeof a.path === 'string' ? a.path : null))
    .filter(Boolean)

  if (paths.length) {
    const { error: rmErr } = await supabase.storage.from(BUCKET).remove(paths)
    if (rmErr) throw rmErr
  }

  const { error: delErr } = await supabase.from(POSTS_TABLE).delete().eq('id', post.id)
  if (delErr) throw delErr

  return { deleted: true }
}
