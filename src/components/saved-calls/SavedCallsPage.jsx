import { useState } from 'react'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import CallRecordTable from './CallRecordTable'
import ConfirmDialog from '../common/ConfirmDialog'
import { exportTxt, exportExcel } from '../../utils/exportUtils'

export default function SavedCallsPage({ records, onEdit, onDelete }) {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [exportOpen, setExportOpen] = useState(false)

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="flex flex-col overflow-auto">
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
      />

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete call record for "${deleteTarget.memberName || '(No name)'}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}