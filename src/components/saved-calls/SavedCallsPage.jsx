import { useState } from 'react'
import { Download, FileText, FileSpreadsheet, ChevronDown, ChevronRight } from 'lucide-react'
import CallRecordTable from './CallRecordTable'
import ConfirmDialog from '../common/ConfirmDialog'
import CallStatsBar from '../common/CallStatsBar'
import { exportTxt, exportExcel } from '../../utils/exportUtils'
import { formatDuration } from '../../utils/durationUtils'
import { RELEASE_DONE, STATUS_DONE, STATUS_NOT_AVAILABLE } from '../../constants/callFlow'

export default function SavedCallsPage({ records, onEdit, onDelete }) {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [viewTarget, setViewTarget] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [clsFilters, setClsFilters] = useState([])
  const [statusFilters, setStatusFilters] = useState([])
  const [grievanceOnly, setGrievanceOnly] = useState(false)

  const releaseMatches = (val, filter) =>
    filter === 'Released'
      ? val === RELEASE_DONE || val === STATUS_DONE
      : val === 'Member Released' || val === STATUS_NOT_AVAILABLE

  const filtered = records.filter((r) => {
    if (searchText && !(r.memberName || '').toLowerCase().includes(searchText.toLowerCase())) return false
    if (clsFilters.length > 0 && !clsFilters.includes(r.classification)) return false
    if (grievanceOnly && r.grievance !== 'Yes') return false
    if (statusFilters.length > 0 && !statusFilters.some((f) => releaseMatches(r.checklist?.Release, f))) return false
    return true
  })

  const activeFilterCount =
    (searchText ? 1 : 0) + clsFilters.length + (grievanceOnly ? 1 : 0) + statusFilters.length

  const toggleInList = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const chipClass = (active) =>
    `px-1.5 py-0.5 text-[10px] rounded border transition-colors cursor-pointer ${
      active ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'
    }`

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="flex flex-col overflow-auto">
      {/* Stats bar */}
      <div className="px-2 py-1.5 border-b border-slate-200">
        <CallStatsBar records={records} showExtended />
      </div>

      {/* Search & filter bar (collapsible) */}
      <div className="border-b border-slate-200">
        <button
          onClick={() => setSearchOpen((v) => !v)}
          className="w-full px-2 py-1.5 text-xs text-slate-600 flex items-center gap-1 hover:bg-slate-50 transition-colors"
        >
          {searchOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          Search & Filter
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
        {searchOpen && (
          <div className="px-2 pb-2 space-y-1.5">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search member name..."
              className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <div className="flex flex-wrap gap-1">
              {['Promoter', 'Passive', 'Detractor'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => toggleInList(clsFilters, setClsFilters, cls)}
                  className={chipClass(clsFilters.includes(cls))}
                >
                  {cls}
                </button>
              ))}
              <button
                onClick={() => setGrievanceOnly((v) => !v)}
                className={chipClass(grievanceOnly)}
              >
                Grievance Call
              </button>
              {['Released', 'Member Released'].map((s) => (
                <button
                  key={s}
                  onClick={() => toggleInList(statusFilters, setStatusFilters, s)}
                  className={chipClass(statusFilters.includes(s))}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export bar */}
      <div className="px-2 py-1.5 border-b border-slate-200 flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setExportOpen((v) => !v)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            <Download size={12} />
            Export
          </button>
          {exportOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded shadow-lg z-20 min-w-[120px]">
              <button
                onClick={() => { exportTxt(records); setExportOpen(false) }}
                className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-100"
              >
                <FileText size={12} />
                Export TXT
              </button>
              <button
                onClick={() => { exportExcel(records); setExportOpen(false) }}
                className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-100"
              >
                <FileSpreadsheet size={12} />
                Export Excel
              </button>
            </div>
          )}
        </div>
        <span className="text-[10px] text-slate-400 ml-auto">
          {filtered.length === records.length
            ? `${records.length} record${records.length !== 1 ? 's' : ''}`
            : `${filtered.length} of ${records.length} records`}
        </span>
      </div>

      <CallRecordTable
        records={filtered}
        onEdit={onEdit}
        onDelete={(r) => setDeleteTarget(r)}
        onView={setViewTarget}
      />

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete call record for "${deleteTarget.memberName || '(No name)'}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* View modal */}
      {viewTarget && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setViewTarget(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">
                {viewTarget.memberName || '(No name)'}
              </h3>
              <button
                onClick={() => setViewTarget(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400">Classification:</span>{' '}
                <span className="text-slate-700">{viewTarget.classification}</span>
              </div>
              <div>
                <span className="text-slate-400">Call Types:</span>{' '}
                <span className="text-slate-700">
                  {(Array.isArray(viewTarget.callTypes) ? viewTarget.callTypes : []).join(', ') || '—'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Unlabeled:</span>{' '}
                <span className="text-slate-700">{viewTarget.additionalCheckbox}</span>
              </div>
              <div>
                <span className="text-slate-400">Duration:</span>{' '}
                <span className="text-slate-700">{formatDuration(viewTarget.durationMinutes)}</span>
              </div>
              <div>
                <span className="text-slate-400">Created:</span>{' '}
                <span className="text-slate-700">{new Date(viewTarget.createdAt).toLocaleString()}</span>
              </div>

              {viewTarget.checklist && (
                <div>
                  <span className="text-slate-400 block mb-1">Checklist:</span>
                  <div className="pl-2 space-y-0.5">
                    {Object.entries(viewTarget.checklist).map(([item, val]) => (
                      <div key={item} className="flex justify-between">
                        <span className="text-slate-600">{item}</span>
                        <span className={val === 'Done' || val === RELEASE_DONE ? 'text-green-600' : val === 'Yes' ? 'text-green-600' : 'text-slate-500'}>
                          {val || '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewTarget.notes && (
                <div>
                  <span className="text-slate-400 block mb-1">Notes:</span>
                  <p className="text-slate-700 whitespace-pre-wrap">{viewTarget.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}