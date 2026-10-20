import { useState } from 'react'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import CallRecordTable from './CallRecordTable'
import ConfirmDialog from '../common/ConfirmDialog'
import { exportTxt, exportExcel } from '../../utils/exportUtils'

export default function SavedCallsPage({ records, onEdit, onDelete }) {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [viewTarget, setViewTarget] = useState(null)

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  const releaseDoneCount = records.filter(
    (r) => r.checklist?.Release === 'Done'
  ).length
  const unlabeledYesCount = records.filter(
    (r) => r.additionalCheckbox === 'Yes'
  ).length
  const unlabeledNoCount = records.filter(
    (r) => r.additionalCheckbox === 'No'
  ).length

  return (
    <div className="flex flex-col overflow-auto">
      {/* Stats bar */}
      <div className="px-2 py-1.5 border-b border-slate-200 flex items-center gap-3 text-[10px] text-slate-500 flex-wrap">
        <span>
          Release Done: <strong className="text-slate-700">{releaseDoneCount}</strong>/{records.length}
        </span>
        <span className="text-slate-300">|</span>
        <span>
          Unlabeled Yes: <strong className="text-green-600">{unlabeledYesCount}</strong>
        </span>
        <span className="text-slate-300">|</span>
        <span>
          Unlabeled No: <strong className="text-red-500">{unlabeledNoCount}</strong>
        </span>
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
        <span className="text-[10px] text-slate-400 ml-auto">{records.length} record{records.length !== 1 ? 's' : ''}</span>
      </div>

      <CallRecordTable
        records={records}
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
                        <span className={val === 'Done' ? 'text-green-600' : val === 'Yes' ? 'text-green-600' : 'text-slate-500'}>
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