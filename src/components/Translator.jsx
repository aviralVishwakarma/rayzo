import { useState } from 'react'
import axios from 'axios'
import '../styles/Translator.css'

const API_KEY = 'YOUR_GOOGLE_CLOUD_API_KEY' // ← Replace with your actual key

const LANGUAGES = [
  { code: '',   label: 'Select Language' },
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ur', label: 'Urdu' },
  { code: 'mr', label: 'Marathi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'bn', label: 'Bengali' },
]

export default function Translator() {
  const [text, setText] = useState('')
  const [targetLang, setTargetLang] = useState('')
  const [translated, setTranslated] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLanguageChange = async (e) => {
    const lang = e.target.value
    setTargetLang(lang)
    setTranslated('')
    setError('')

    if (!lang || !text.trim()) return

    setLoading(true)
    try {
      const res = await axios.post(
        'https://translation.googleapis.com/language/translate/v2',
        null,
        {
          params: {
            q: text,
            target: lang,
            key: API_KEY,
          },
        }
      )
      const result = res.data?.data?.translations?.[0]?.translatedText || ''
      setTranslated(result)
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        'Translation failed. Please check your API key and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="translator-page">
      <div className="translator-card">
        <div className="translator-header">
          <h1>🌐 Text Translator</h1>
          <p>Type your text and choose a language to translate instantly</p>
        </div>

        <textarea
          className="translator-textarea"
          placeholder="Enter text to translate…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          className="translator-select"
          value={targetLang}
          onChange={handleLanguageChange}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>

        {loading && (
          <div className="translator-loading">
            <span className="translator-spinner" />
            Translating…
          </div>
        )}

        {error && <div className="translator-error">{error}</div>}

        {translated && !loading && (
          <div className="translator-result">
            <p className="translator-result-label">Translation</p>
            <p className="translator-result-text">{translated}</p>
          </div>
        )}
      </div>
    </div>
  )
}
