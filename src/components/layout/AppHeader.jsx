import HamburgerMenu from './HamburgerMenu'
import { countDone, totalStatusItems } from '../../utils/checklistUtils'

export default function AppHeader({ menuOpen, onToggleMenu, onNavigate, currentPage, checklist, onClearData }) {
  const done = countDone(checklist)
  const total = totalStatusItems()

  return (
    <header className="flex items-center gap-1.5 px-2 py-1 border-b border-slate-200 bg-white shrink-0">
      <HamburgerMenu
        isOpen={menuOpen}
        onToggle={onToggleMenu}
        onNavigate={onNavigate}
        currentPage={currentPage}
        onClearData={onClearData}
      />
      <h1 className="text-xs font-semibold text-slate-800 truncate">carl4optum</h1>
      {currentPage === 'current' && (
        <span className="ml-auto text-[10px] text-slate-500 tabular-nums whitespace-nowrap">
          {done}/{total}
        </span>
      )}
    </header>
  )
}