import { useState, useEffect } from 'react'

export function useTypewriter(words, { type = 75, del = 38, hold = 1600 } = {}) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIndex % words.length]
    let t

    if (!deleting && text === word) {
      t = setTimeout(() => setDeleting(true), hold)
    } else if (deleting && text === '') {
      setDeleting(false)
      setWordIndex((v) => (v + 1) % words.length)
    } else {
      t = setTimeout(() => {
        setText((cur) =>
          deleting ? word.slice(0, cur.length - 1) : word.slice(0, cur.length + 1)
        )
      }, deleting ? del : type)
    }

    return () => clearTimeout(t)
  }, [text, deleting, wordIndex, words, type, del, hold])

  return text
}
