const RECORDS_KEY = 'callCompanion_records'
const DRAFT_KEY = 'callCompanion_draft'

function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback
  } catch {
    return fallback
  }
}

export function getCallRecords() {
  try {
    return safeParse(localStorage.getItem(RECORDS_KEY), [])
  } catch {
    return []
  }
}

export function saveCallRecord(record) {
  try {
    const records = getCallRecords()
    records.push(record)
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
    return true
  } catch {
    return false
  }
}

export function updateCallRecord(id, updates) {
  try {
    const records = getCallRecords()
    const index = records.findIndex((r) => r.id === id)
    if (index === -1) return false
    records[index] = { ...records[index], ...updates }
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
    return true
  } catch {
    return false
  }
}

export function deleteCallRecord(id) {
  try {
    const records = getCallRecords().filter((r) => r.id !== id)
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
    return true
  } catch {
    return false
  }
}

export function getCallDraft() {
  try {
    return safeParse(localStorage.getItem(DRAFT_KEY), null)
  } catch {
    return null
  }
}

export function saveCallDraft(draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

export function clearCallDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
    return true
  } catch {
    return false
  }
}

export function clearAllData() {
  try {
    localStorage.removeItem(RECORDS_KEY)
    localStorage.removeItem(DRAFT_KEY)
    return true
  } catch {
    return false
  }
}