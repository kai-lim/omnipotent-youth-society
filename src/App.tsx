import { useState, useEffect, useCallback, useRef } from 'react'
import { songs, type Song } from './data/songs'

const FONT_SIZE_KEY = 'lyric-font-size'
const DEFAULT_FONT = 18
const MIN_FONT = 12
const MAX_FONT = 36

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i}>{part}</mark>
      : part
  )
}

// Group songs by album while preserving album order
function groupByAlbum(list: Song[]): Map<string, Song[]> {
  const map = new Map<string, Song[]>()
  for (const s of list) {
    const key = `${s.album} (${s.year})`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(s)
  }
  return map
}

export default function App() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [query, setQuery] = useState('')
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY)
    return saved ? parseInt(saved, 10) : DEFAULT_FONT
  })
  const searchRef = useRef<HTMLInputElement>(null)

  // Persist font size
  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize))
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`)
  }, [fontSize])

  // WakeLock: keep screen on while reading lyrics
  useEffect(() => {
    if (!currentSong) return
    if (!('wakeLock' in navigator)) return
    let lock: WakeLockSentinel | null = null
    ;(navigator as Navigator & { wakeLock: { request: (type: string) => Promise<WakeLockSentinel> } })
      .wakeLock.request('screen')
      .then(l => { lock = l })
      .catch(() => {/* silently ignore */})
    return () => { lock?.release() }
  }, [currentSong])

  // Scroll to top when opening a song
  const openSong = useCallback((song: Song) => {
    window.scrollTo(0, 0)
    setCurrentSong(song)
  }, [])

  const closeSong = useCallback(() => {
    window.scrollTo(0, 0)
    setCurrentSong(null)
  }, [])

  const changeFont = useCallback((delta: number) => {
    setFontSize(f => Math.min(MAX_FONT, Math.max(MIN_FONT, f + delta)))
  }, [])

  // ── Filtered song list ───────────────────────────────────
  const q = query.trim().toLowerCase()
  const filtered = q
    ? songs.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.lyrics.toLowerCase().includes(q)
      )
    : songs

  // ── Lyrics view ──────────────────────────────────────────
  if (currentSong) {
    return (
      <div>
        <header className="header">
          <div className="header-top">
            <button className="back-btn" onClick={closeSong} aria-label="返回">
              ←
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="header-title">{currentSong.title}</div>
              <div className="header-subtitle">{currentSong.album} · {currentSong.year}</div>
            </div>
            <div className="font-controls">
              <button className="font-btn" onClick={() => changeFont(-2)} aria-label="縮小字體">A−</button>
              <span className="font-size-label">{fontSize}</span>
              <button className="font-btn" onClick={() => changeFont(2)} aria-label="放大字體">A+</button>
            </div>
          </div>
        </header>

        <div className="lyrics-container">
          <p className="lyrics-text">
            {highlight(currentSong.lyrics, query)}
          </p>
        </div>
      </div>
    )
  }

  // ── Song list view ────────────────────────────────────────
  const grouped = groupByAlbum(filtered)

  return (
    <div>
      <header className="header">
        <div className="header-top">
          <div style={{ flex: 1 }}>
            <div className="header-title">萬能青年旅店</div>
            <div className="header-subtitle">歌詞本</div>
          </div>
        </div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            ref={searchRef}
            className="search-input"
            type="search"
            inputMode="search"
            placeholder="搜尋歌名或歌詞…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')} aria-label="清除">✕</button>
          )}
        </div>
      </header>

      <div className="song-list">
        {filtered.length === 0 && (
          <div className="no-results">找不到「{query}」相關的歌曲或歌詞</div>
        )}

        {[...grouped.entries()].map(([albumLabel, albumSongs]) => (
          <div key={albumLabel}>
            {!q && <div className="album-group-label">{albumLabel}</div>}
            {albumSongs.map(song => (
              <button
                key={song.id}
                className="song-item"
                onClick={() => openSong(song)}
              >
                <div className="song-info">
                  <div className="song-title">{highlight(song.title, query)}</div>
                  {q && (
                    <div className="song-album">{song.album} · {song.year}</div>
                  )}
                </div>
                <span className="song-chevron">›</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
