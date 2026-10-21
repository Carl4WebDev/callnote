import { CHECKLIST_ITEMS } from '../constants/callFlow'
import { formatDuration } from './durationUtils'

function formatDate(date) {
  return new Date(date).toLocaleString()
}

function filenameDate() {
  return new Date().toISOString().slice(0, 10)
}

export function exportTxt(records) {
  const lines = []
  for (const r of records) {
    lines.push('='.repeat(50))
    lines.push(`Record ID: ${r.id}`)
    lines.push(`Saved: ${formatDate(r.createdAt)}`)
    lines.push(`Modified: ${formatDate(r.updatedAt)}`)
    lines.push(`Member Name: ${r.memberName || '(none)'}`)
    lines.push(`Classification: ${r.classification}`)
    const callTypes = Array.isArray(r.callTypes) ? r.callTypes : (r.callType ? [r.callType] : [])
    lines.push(`Call Types: ${callTypes.length > 0 ? callTypes.join(', ') : '(none)'}`)
    lines.push(`Duration: ${formatDuration(r.durationMinutes)}`)
    lines.push('')
    lines.push('Checklist:')
    for (const item of CHECKLIST_ITEMS) {
      const val = r.checklist?.[item] || '-'
      lines.push(`  ${item}: ${val}`)
    }
    lines.push(`Unlabeled Checkbox: ${r.additionalCheckbox}`)
    lines.push('')
    lines.push('Notes:')
    lines.push(r.notes || '(none)')
    lines.push('')
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  downloadBlob(blob, `call-records-${filenameDate()}.txt`)
}

export function exportExcel(records) {
  import('xlsx').then((XLSX) => {
    const rows = records.map((r) => {
      const callTypes = Array.isArray(r.callTypes) ? r.callTypes : (r.callType ? [r.callType] : [])
      const row = {
        'Record ID': r.id,
        'Saved Date/Time': formatDate(r.createdAt),
        'Last Modified': formatDate(r.updatedAt),
        'Member Name': r.memberName || '',
        'Classification': r.classification,
        'Call Types': callTypes.join(', '),
        'Duration (min)': r.durationMinutes ?? '',
        'Unlabeled Checkbox': r.additionalCheckbox,
        'Notes': r.notes || '',
      }
      for (const item of CHECKLIST_ITEMS) {
        row[item] = r.checklist?.[item] || ''
      }
      return row
    })
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Call Records')
    const xlsxData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([xlsxData], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    downloadBlob(blob, `call-records-${filenameDate()}.xlsx`)
  })
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}