import { CHECKLIST_ITEMS, YES_NO_ITEMS, STATUS_ITEMS, STATUS_DONE, STATUS_NOT_AVAILABLE, STATUS_OTHERS } from '../../constants/callFlow'
import { countDone, totalStatusItems } from '../../utils/checklistUtils'

const STATUSES = [STATUS_DONE, STATUS_NOT_AVAILABLE, STATUS_OTHERS]

export default function CallChecklist({ checklist, onToggle, onToggleYesNo }) {
  const done = countDone(checklist)
  const total = totalStatusItems()

  return (
    <div className="px-2 py-1">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-slate-600">Call Process</label>
        <span className="text-[10px] text-slate-400 tabular-nums">{done}/{total}</span>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-500">
            <th className="text-left py-0.5 px-1 font-medium"></th>
            <th className="py-0.5 px-1 font-medium w-8 text-center">D</th>
            <th className="py-0.5 px-1 font-medium w-8 text-center">NA</th>
            <th className="py-0.5 px-1 font-medium w-8 text-center">O</th>
          </tr>
        </thead>
        <tbody>
          {CHECKLIST_ITEMS.map((item) => {
            const isYesNo = YES_NO_ITEMS.includes(item)
            return (
              <tr key={item} className={`border-b border-slate-200 ${isYesNo ? 'bg-blue-50/40' : 'bg-green-50/30'}`}>
                <td className={`py-1.5 px-1 text-xs ${isYesNo ? 'text-blue-800' : 'text-green-800'}`}>{item}</td>
                {isYesNo ? (
                  <td className="py-1.5 text-center">
                    <input
                      type="checkbox"
                      checked={checklist[item] === 'Yes'}
                      onChange={() => onToggleYesNo(item)}
                      className="h-3.5 w-3.5 accent-blue-600 cursor-pointer"
                      aria-label={`${item}: Yes/No`}
                    />
                  </td>
                ) : (
                  STATUSES.map((s) => (
                    <td key={s} className="py-1.5 text-center">
                      <input
                        type="checkbox"
                        checked={checklist[item] === s}
                        onChange={() => onToggle(item, s)}
                        className="h-3.5 w-3.5 accent-green-600 cursor-pointer"
                        aria-label={`${item}: ${s}`}
                      />
                    </td>
                  ))
                )}
                {isYesNo && <td className="py-1.5"></td>}
                {isYesNo && <td className="py-1.5"></td>}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}