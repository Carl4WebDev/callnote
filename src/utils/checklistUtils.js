import { STATUS_DONE, STATUS_ITEMS, YES_NO_ITEMS, DROPDOWN_ITEMS, RELEASE_DONE } from '../constants/callFlow'

export function countDone(checklist) {
  let count = 0
  for (const item of STATUS_ITEMS) {
    if (checklist[item] === STATUS_DONE) count++
  }
  for (const item of DROPDOWN_ITEMS) {
    // Released = Done (legacy records stored 'Done')
    if (checklist[item] === RELEASE_DONE || checklist[item] === STATUS_DONE) count++
  }
  return count
}

export function totalStatusItems() {
  return STATUS_ITEMS.length + DROPDOWN_ITEMS.length
}

export function buildEmptyChecklist(items) {
  const checklist = {}
  for (const item of items) {
    checklist[item] = YES_NO_ITEMS.includes(item) ? 'No' : ''
  }
  return checklist
}