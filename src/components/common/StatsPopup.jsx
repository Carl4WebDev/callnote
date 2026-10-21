import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import CallStatsBar from './CallStatsBar'

const THIRTY_MIN_MS = 30 * 60 * 1000
const AUTO_HIDE_MS = 10 * 1000

export default function StatsPopup({ records }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let hideTimer
    const interval = setInterval(() => {
      setVisible(true)
      clearTimeout(hideTimer)
      hideTimer = setTimeout(() => setVisible(false), AUTO_HIDE_MS)
    }, THIRTY_MIN_MS)
    return () => {
      clearInterval(interval)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="fixed top-1 right-1 z-40 bg-white border border-slate-200 shadow-md rounded px-2 py-1 max-w-[min(20rem,calc(100vw-0.5rem))]">
      <div className="flex items-start gap-1">
        <CallStatsBar records={records} />
        <button
          onClick={() => setVisible(false)}
          className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 shrink-0"
          aria-label="Dismiss stats popup"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
