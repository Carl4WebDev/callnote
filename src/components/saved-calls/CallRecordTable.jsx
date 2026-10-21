import { Edit, Trash2, Eye } from 'lucide-react'
import { countDone, totalStatusItems } from '../../utils/checklistUtils'
import { formatDuration } from '../../utils/durationUtils'

const CLASSIFICATION_COLORS = {
  Promoter: 'bg-green-100 text-green-700',
  Passive: 'bg-slate-200 text-slate-600',
  Detractor: 'bg-red-100 text-red-700',
}

export default function CallRecordTable({ records, onEdit, onDelete, onView }) {
  if (records.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-slate-400">
        No saved calls yet.
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {records.map((r) => {
        const done = countDone(r.checklist || {})
        const total = totalStatusItems()
        const callTypes = Array.isArray(r.callTypes) ? r.callTypes : (r.callType ? [r.callType] : [])
        const clsColor = CLASSIFICATION_COLORS[r.classification] || 'bg-slate-100 text-slate-500'
        return (
          <div key={r.id} className="px-3 py-2 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-800 truncate">
                    {r.memberName || '(No name)'}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${clsColor}`}>
                    {r.classification}
                  </span>
                  {callTypes.map((ct) => (
                    <span key={ct} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                      {ct}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {new Date(r.createdAt).toLocaleString()}
                  {r.durationMinutes != null && (
                    <span className="ml-1.5 text-slate-500">{formatDuration(r.durationMinutes)}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-slate-400 tabular-nums">{done}/{total}</span>
                <span className="text-[10px] text-slate-400">{r.additionalCheckbox}</span>
                <button
                  onClick={() => onView(r)}
                  className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600"
                  title="View"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => onEdit(r)}
                  className="p-1 rounded hover:bg-blue-100 text-slate-400 hover:text-blue-600"
                  title="Edit"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => onDelete(r)}
                  className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {r.notes && (
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 whitespace-pre-wrap">{r.notes}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}