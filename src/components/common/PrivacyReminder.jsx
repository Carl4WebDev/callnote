import { useState } from 'react'
import { ShieldAlert, X } from 'lucide-react'

export default function PrivacyReminder() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="flex items-start gap-1.5 px-2 py-1.5 bg-amber-50 border-b border-amber-200 text-amber-800 shrink-0">
      <ShieldAlert size={13} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-[10px] leading-relaxed">
        Do not save important member details. Always use Incognito. When done: export to TXT/Excel first, then clear local storage to remove all saved calls.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="p-0.5 rounded hover:bg-amber-100 transition-colors"
        aria-label="Dismiss reminder"
      >
        <X size={12} />
      </button>
    </div>
  )
}
