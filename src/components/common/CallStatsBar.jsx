import { averageDuration, formatDuration } from '../../utils/durationUtils'
import { RELEASE_DONE, RELEASE_TRANSFER, STATUS_DONE, STATUS_OTHERS } from '../../constants/callFlow'

export default function CallStatsBar({ records, showExtended = false }) {
  const isReleased = (r) =>
    r.checklist?.Release === RELEASE_DONE || r.checklist?.Release === STATUS_DONE
  const isTransferred = (r) =>
    r.checklist?.Release === RELEASE_TRANSFER || r.checklist?.Release === STATUS_OTHERS
  const releaseDoneCount = records.filter(isReleased).length
  const releasePct = records.length > 0
    ? Math.round((releaseDoneCount / records.length) * 100)
    : 0
  const transferCount = records.filter(isTransferred).length
  const transferPct = records.length > 0
    ? Math.round((transferCount / records.length) * 100)
    : 0
  const expectedPromoterCount = records.filter(
    (r) => r.classification === 'Promoter' && isReleased(r)
  ).length
  const grievanceCount = records.filter((r) => r.grievance === 'Yes').length
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
      {showExtended && (
        <>
          <span className="text-slate-300">|</span>
          <span>
            Transfer Rate: <strong className="text-slate-700">{transferCount}</strong>/{records.length}
            {' '}(<strong className="text-slate-700">{transferPct}</strong>%)
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Expected Promoter Calls (Released): <strong className="text-green-600">{expectedPromoterCount}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Grievance: <strong className="text-red-500">{grievanceCount}</strong>
          </span>
        </>
      )}
    </div>
  )
}
