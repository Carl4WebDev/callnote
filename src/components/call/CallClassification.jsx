import { CLASSIFICATIONS } from '../../constants/callFlow'

export default function CallClassification({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-0.5">Classification</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
      >
        {CLASSIFICATIONS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  )
}