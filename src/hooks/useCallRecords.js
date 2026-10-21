import { useState, useCallback } from 'react'
import {
  getCallRecords,
  saveCallRecord,
  updateCallRecord,
  deleteCallRecord,
} from '../infrastructure/storage/localStorageService'
import { parseDurationMinutes } from '../utils/durationUtils'

export function useCallRecords() {
  const [records, setRecords] = useState(() => getCallRecords())

  const refreshRecords = useCallback(() => {
    setRecords(getCallRecords())
  }, [])

  const addRecord = useCallback((draft) => {
    const now = new Date().toISOString()
    const record = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      memberName: draft.memberName,
      classification: draft.classification,
      callTypes: [...(draft.callTypes || [])],
      checklist: { ...draft.checklist },
      additionalCheckbox: draft.additionalCheckbox ? 'Yes' : 'No',
      durationMinutes: parseDurationMinutes(draft.durationMinutes),
      notes: draft.notes,
    }
    const success = saveCallRecord(record)
    if (success) refreshRecords()
    return success
  }, [refreshRecords])

  const editRecord = useCallback((id, draft) => {
    const now = new Date().toISOString()
    const updates = {
      updatedAt: now,
      memberName: draft.memberName,
      classification: draft.classification,
      callTypes: [...(draft.callTypes || [])],
      checklist: { ...draft.checklist },
      additionalCheckbox: draft.additionalCheckbox ? 'Yes' : 'No',
      durationMinutes: parseDurationMinutes(draft.durationMinutes),
      notes: draft.notes,
    }
    const success = updateCallRecord(id, updates)
    if (success) refreshRecords()
    return success
  }, [refreshRecords])

  const removeRecord = useCallback((id) => {
    const success = deleteCallRecord(id)
    if (success) refreshRecords()
    return success
  }, [refreshRecords])

  return {
    records,
    addRecord,
    editRecord,
    removeRecord,
    refreshRecords,
  }
}