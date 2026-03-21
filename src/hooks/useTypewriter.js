import { useState, useEffect } from 'react'

function useTypewriter(words, speed = 100) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex % words.length]

    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1))
        if (text.length === current.length) {
          setTimeout(() => setDeleting(true), 1500)
        }
      } else {
        setText(current.slice(0, text.length - 1))
        if (text.length === 0) {
          setDeleting(false)
          setWordIndex((i) => i + 1)
        }
      }
    }, deleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [text, deleting, wordIndex, words, speed])

  return text
}

export default useTypewriter