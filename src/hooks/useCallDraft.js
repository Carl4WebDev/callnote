import { useState, useEffect, useCallback } from 'react'
import { CHECKLIST_ITEMS, CLASSIFICATIONS, YES_NO_ITEMS } from '../constants/callFlow'
import { buildEmptyChecklist } from '../utils/checklistUtils'
import { getCallDraft, saveCallDraft, clearCallDraft } from '../infrastructure/storage/localStorageService'
import { formatDurationOption } from '../utils/durationUtils'

const INITIAL_STATE = {
  memberName: '',
  classification: CLASSIFICATIONS[0],
  callTypes: [],
  checklist: buildEmptyChecklist(CHECKLIST_ITEMS),
  additionalCheckbox: false,
  grievance: 'No',
  durationMinutes: '',
  notes: '',
}

export function useCallDraft() {
  const [draft, setDraft] = useState(() => {
    const saved = getCallDraft()
    if (saved && saved.checklist) return { ...INITIAL_STATE, ...saved }
    return INITIAL_STATE
  })

  useEffect(() => {
    saveCallDraft(draft)
  }, [draft])

  const updateField = useCallback((field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }, [])

  const updateChecklistItem = useCallback((item, status) => {
    setDraft((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [item]: prev.checklist[item] === status ? '' : status,
      },
    }))
  }, [])

  const setChecklistItem = useCallback((item, value) => {
    setDraft((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [item]: value,
      },
    }))
  }, [])

  const toggleYesNoItem = useCallback((item) => {
    setDraft((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [item]: prev.checklist[item] === 'Yes' ? 'No' : 'Yes',
      },
    }))
  }, [])

  const toggleCallType = useCallback((type) => {
    setDraft((prev) => {
      const types = prev.callTypes || []
      const next = types.includes(type)
        ? types.filter((t) => t !== type)
        : [...types, type]
      return { ...prev, callTypes: next }
    })
  }, [])

  const resetDraft = useCallback(() => {
    setDraft(INITIAL_STATE)
    clearCallDraft()
  }, [])

  const loadRecord = useCallback((record) => {
    // Build checklist: Yes/No items stored as Yes/No, status items stored as Done/Not Available/Others
    const checklist = record.checklist || buildEmptyChecklist(CHECKLIST_ITEMS)
    setDraft({
      memberName: record.memberName || '',
      classification: record.classification || CLASSIFICATIONS[0],
      callTypes: Array.isArray(record.callTypes) ? record.callTypes : (record.callType ? [record.callType] : []),
      checklist,
      additionalCheckbox: record.additionalCheckbox === 'Yes',
      grievance: record.grievance === 'Yes' ? 'Yes' : 'No',
      durationMinutes: record.durationMinutes != null ? formatDurationOption(record.durationMinutes) : '',
      notes: record.notes || '',
    })
  }, [])

  return {
    draft,
    updateField,
    updateChecklistItem,
    setChecklistItem,
    toggleYesNoItem,
    toggleCallType,
    resetDraft,
    loadRecord,
  }
}