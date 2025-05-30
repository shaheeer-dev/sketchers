import { useEffect, useState } from 'react'
import { getWord } from '@/utils/drawableWords'

const useWord = () => {
  const [wordToDraw, setWordToDraw] = useState<string>('')

  useEffect(() => {
    const word = getWord()
    setWordToDraw(word)
  }, [])

  return { wordToDraw }
}

export default useWord
