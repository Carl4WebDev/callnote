export default function MemberNameInput({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-0.5">Member Name</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
        placeholder="Enter name"
      />
    </div>
  )
}