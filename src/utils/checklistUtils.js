import { STATUS_DONE, STATUS_ITEMS, YES_NO_ITEMS } from '../constants/callFlow'

export function countDone(checklist) {
  let count = 0
  for (const item of STATUS_ITEMS) {
    if (checklist[item] === STATUS_DONE) count++
  }
  return count
}

export function totalStatusItems() {
  return STATUS_ITEMS.length
}

export function buildEmptyChecklist(items) {
  const checklist = {}
  for (const item of items) {
    checklist[item] = YES_NO_ITEMS.includes(item) ? 'No' : ''
  }
  return checklist
}