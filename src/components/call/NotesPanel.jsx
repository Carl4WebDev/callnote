import { useState, useRef } from 'react'
import { Copy, Clock, ChevronDown, ChevronRight, X } from 'lucide-react'
import { CALL_TYPES } from '../../constants/callFlow'

const QUICK_INSERTS = ['Concern:', 'Action Taken:', 'Resolution:', 'Follow-up:', 'Reference:']

export default function NotesPanel({ callTypes, onToggleCallType, notesValue, onNotesChange }) {
  const [expanded, setExpanded] = useState(true)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef(null)

  const insertText = (text) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const before = notesValue.slice(0, start)
    const after = notesValue.slice(end)
    const needsNewline = before.length > 0 && !before.endsWith('\n') ? '\n' : ''
    const newValue = before + needsNewline + text + ' ' + after
    onNotesChange(newValue)
    requestAnimationFrame(() => {
      ta.focus()
      const pos = (before + needsNewline + text + ' ').length
      ta.setSelectionRange(pos, pos)
    })
  }

  const insertTimestamp = () => {
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    insertText(`[${ts}]`)
  }

  const copyNotes = async () => {
    try {
      await navigator.clipboard.writeText(notesValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable
    }
  }

  const selected = callTypes || []

  return (
    <div className="px-2 py-1">
      {/* Call Type multi-select */}
      <div className="mb-1">
        <label className="block text-xs font-medium text-slate-600 mb-0.5">Call Type</label>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {selected.map((ct) => (
              <span
                key={ct}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-700 rounded border border-blue-200"
              >
                {ct}
                <button
                  onClick={() => onToggleCallType(ct)}
                  className="hover:text-blue-900"
                  aria-label={`Remove ${ct}`}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) onToggleCallType(e.target.value)
          }}
          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
        >
          <option value="">
            {selected.length === 0 ? 'Select call type' : 'Add another...'}
          </option>
          {CALL_TYPES.filter((ct) => !selected.includes(ct)).map((ct) => (
            <option key={ct} value={ct}>{ct}</option>
          ))}
        </select>
      </div>

      {/* Notes header */}
      <div className="flex items-center gap-2 mb-1">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-medium text-slate-600 flex items-center gap-0.5 hover:text-slate-800"
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Notes
        </button>
        {expanded && (
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={copyNotes}
              className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              title="Copy notes"
            >
              <Copy size={12} />
            </button>
            <button
              onClick={insertTimestamp}
              className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              title="Insert timestamp"
            >
              <Clock size={12} />
            </button>
            {copied && <span className="text-[10px] text-green-600">Copied</span>}
            <span className="text-[10px] text-slate-400 tabular-nums">{notesValue.length}</span>
          </div>
        )}
      </div>

      {expanded && (
        <>
          <div className="flex flex-wrap gap-1 mb-1">
            {QUICK_INSERTS.map((q) => (
              <button
                key={q}
                onClick={() => insertText(q)}
                className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={notesValue}
            onChange={(e) => onNotesChange(e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded resize-y min-h-[200px] focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            placeholder="Type notes here..."
            rows={10}
          />
        </>
      )}
    </div>
  )
}