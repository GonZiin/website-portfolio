export function isEditorEnabled() {
  if (typeof window === 'undefined') return false

  try {
    const url = new URL(window.location.href)
    const qp = url.searchParams.get('editor')
    if (qp === '1') {
      window.localStorage.setItem('blogEditor', '1')
      return true
    }
    return window.localStorage.getItem('blogEditor') === '1'
  } catch {
    return false
  }
}

export function disableEditor() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem('blogEditor')
  } catch {
    // ignore
  }
}
