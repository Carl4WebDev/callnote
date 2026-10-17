import { Menu, X, Phone, Archive, Trash2 } from 'lucide-react'

export default function HamburgerMenu({ isOpen, onToggle, onNavigate, currentPage, onClearData }) {
  return (
    <>
      <button
        onClick={onToggle}
        className="p-1.5 rounded hover:bg-slate-200 transition-colors"
        aria-label="Menu"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={onToggle}>
          <nav
            className="absolute top-10 left-0 bg-white border border-slate-200 rounded-br-lg shadow-lg z-50 min-w-[160px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onNavigate('current')}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-slate-100 transition-colors ${
                currentPage === 'current' ? 'bg-blue-50 text-blue-700 font-medium' : ''
              }`}
            >
              <Phone size={14} />
              Current Call
            </button>
            <button
              onClick={() => onNavigate('saved')}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-slate-100 transition-colors ${
                currentPage === 'saved' ? 'bg-blue-50 text-blue-700 font-medium' : ''
              }`}
            >
              <Archive size={14} />
              Saved Calls
            </button>
            <div className="border-t border-slate-200" />
            <button
              onClick={() => { onToggle(); onClearData() }}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-red-50 text-red-600 transition-colors"
            >
              <Trash2 size={14} />
              Clear All Local Data
            </button>
          </nav>
        </div>
      )}
    </>
  )
}