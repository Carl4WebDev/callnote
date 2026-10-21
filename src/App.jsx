import { useState, useCallback } from 'react'
import AppHeader from './components/layout/AppHeader'
import CurrentCallPage from './components/call/CurrentCallPage'
import SavedCallsPage from './components/saved-calls/SavedCallsPage'
import ConfirmDialog from './components/common/ConfirmDialog'
import { useCallDraft } from './hooks/useCallDraft'
import { useCallRecords } from './hooks/useCallRecords'
import { clearAllData } from './infrastructure/storage/localStorageService'

export default function App() {
  const [currentPage, setCurrentPage] = useState('current')
  const [menuOpen, setMenuOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const { draft, updateField, updateChecklistItem, toggleYesNoItem, toggleCallType, resetDraft, loadRecord } = useCallDraft()
  const { records, addRecord, editRecord, removeRecord, refreshRecords } = useCallRecords()

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page)
    setMenuOpen(false)
  }, [])

  const handleEdit = useCallback((record) => {
    setEditingId(record.id)
    loadRecord(record)
    setCurrentPage('current')
  }, [loadRecord])

  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
  }, [])

  const handleClearData = useCallback(() => {
    setShowClearConfirm(true)
  }, [])

  const handleClearConfirm = useCallback(() => {
    clearAllData()
    resetDraft()
    refreshRecords()
    setEditingId(null)
    setShowClearConfirm(false)
  }, [resetDraft, refreshRecords])

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      <AppHeader
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        checklist={draft.checklist}
        onClearData={handleClearData}
      />

      {currentPage === 'current' && (
        <CurrentCallPage
          draft={draft}
          updateField={updateField}
          updateChecklistItem={updateChecklistItem}
          toggleYesNoItem={toggleYesNoItem}
          toggleCallType={toggleCallType}
          resetDraft={resetDraft}
          addRecord={addRecord}
          editingId={editingId}
          editRecord={editRecord}
          onCancelEdit={handleCancelEdit}
          records={records}
        />
      )}

      {currentPage === 'saved' && (
        <SavedCallsPage
          records={records}
          onEdit={handleEdit}
          onDelete={removeRecord}
        />
      )}

      {showClearConfirm && (
        <ConfirmDialog
          message="Clear all saved records and draft data? Downloaded export files must be deleted separately."
          confirmLabel="Clear All"
          onConfirm={handleClearConfirm}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  )
}