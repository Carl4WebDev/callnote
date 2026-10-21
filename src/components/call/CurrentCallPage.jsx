import MemberNameInput from './MemberNameInput'
import CallClassification from './CallClassification'
import CallChecklist from './CallChecklist'
import NotesPanel from './NotesPanel'
import SaveCallButton from './SaveCallButton'
import { DURATION_OPTIONS, formatDurationOption } from '../../utils/durationUtils'

export default function CurrentCallPage({ draft, updateField, updateChecklistItem, toggleYesNoItem, toggleCallType, resetDraft, addRecord, editingId, editRecord, onCancelEdit }) {
  const handleSave = () => {
    let success
    if (editingId) {
      success = editRecord(editingId, draft)
    } else {
      success = addRecord(draft)
    }
    if (success) {
      resetDraft()
      if (onCancelEdit) onCancelEdit()
    }
    return success
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {editingId && (
        <div className="px-2 py-1 bg-amber-50 border-b border-amber-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-amber-700 font-medium">Editing record</span>
          <button
            onClick={() => { resetDraft(); onCancelEdit?.() }}
            className="text-xs text-amber-600 underline hover:text-amber-800"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Top row: name + unlabeled checkbox */}
      <div className="flex gap-2 px-2 py-1 items-center">
        <div className="flex-1 min-w-0">
          <MemberNameInput value={draft.memberName} onChange={(v) => updateField('memberName', v)} />
        </div>
        <div className="pt-4">
          <input
            type="checkbox"
            checked={draft.additionalCheckbox}
            onChange={(e) => updateField('additionalCheckbox', e.target.checked)}
            className="h-3.5 w-3.5 accent-blue-600 cursor-pointer"
            aria-label="Additional checkbox"
          />
        </div>
      </div>

      {/* Checklist */}
      <CallChecklist checklist={draft.checklist} onToggle={updateChecklistItem} onToggleYesNo={toggleYesNoItem} />

      {/* Classification below checklist */}
      <div className="px-2 py-1">
        <CallClassification value={draft.classification} onChange={(v) => updateField('classification', v)} />
      </div>

      {/* Notes section */}
      <NotesPanel
        callTypes={draft.callTypes}
        onToggleCallType={toggleCallType}
        notesValue={draft.notes}
        onNotesChange={(v) => updateField('notes', v)}
      />

      {/* Save button + Duration on right */}
      <div className="flex items-end gap-2 px-2 py-2">
        <SaveCallButton onSave={handleSave} />
        <div className="w-28">
          <label className="block text-xs font-medium text-slate-600 mb-0.5">Duration</label>
          <input
            type="text"
            list="call-duration-options"
            value={draft.durationMinutes}
            onChange={(e) => updateField('durationMinutes', e.target.value)}
            className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            placeholder="min"
            aria-label="Call duration"
          />
          <datalist id="call-duration-options">
            {DURATION_OPTIONS.map((m) => (
              <option key={m} value={formatDurationOption(m)} />
            ))}
          </datalist>
        </div>
      </div>
    </div>
  )
}