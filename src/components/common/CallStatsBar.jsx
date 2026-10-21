import { averageDuration, formatDuration } from '../../utils/durationUtils'

export default function CallStatsBar({ records }) {
  const releaseDoneCount = records.filter(
    (r) => r.checklist?.Release === 'Done'
  ).length
  const releasePct = records.length > 0
    ? Math.round((releaseDoneCount / records.length) * 100)
    : 0
  const unlabeledYesCount = records.filter(
    (r) => r.additionalCheckbox === 'Yes'
  ).length
  const unlabeledNoCount = records.filter(
    (r) => r.additionalCheckbox === 'No'
  ).length
  const avgDuration = averageDuration(records)

  return (
    <div className="flex items-center gap-3 text-[10px] text-slate-500 flex-wrap">
      <span>
        Release Done: <strong className="text-slate-700">{releaseDoneCount}</strong>/{records.length}
        {' '}(<strong className="text-slate-700">{releasePct}</strong>%)
      </span>
      <span className="text-slate-300">|</span>
      <span>
        Avg Duration: <strong className="text-slate-700">{formatDuration(avgDuration)}</strong>
      </span>
      <span className="text-slate-300">|</span>
      <span>
        Unlabeled Yes: <strong className="text-green-600">{unlabeledYesCount}</strong>
      </span>
      <span className="text-slate-300">|</span>
      <span>
        Unlabeled No: <strong className="text-red-500">{unlabeledNoCount}</strong>
      </span>
    </div>
  )
}
