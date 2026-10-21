import { useState } from 'react'
import { Save } from 'lucide-react'

export default function SaveCallButton({ onSave }) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleClick = () => {
    if (saving) return
    setSaving(true)
    const success = onSave()
    if (success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  return (
    <div className="flex items-center gap-2 pb-0.5">
      <button
        onClick={handleClick}
        disabled={saving}
        className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        <Save size={14} />
        Save Call
      </button>
      {saved && (
        <span className="text-xs text-green-600 font-medium">Saved</span>
      )}
    </div>
  )
}