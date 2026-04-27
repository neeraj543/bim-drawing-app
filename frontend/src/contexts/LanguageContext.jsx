import { createContext, useContext, useState } from 'react'
import translations from '../translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('offerteLang') || 'nl')

  const toggle = () => setLang(l => {
    const next = l === 'nl' ? 'en' : 'nl'
    localStorage.setItem('offerteLang', next)
    return next
  })

  return (
    <LanguageContext.Provider value={{ lang, toggle, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)