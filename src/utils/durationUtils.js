export const DURATION_OPTIONS = [
  ...Array.from({ length: 60 }, (_, i) => i + 1),
  75,
  90,
  120,
]

export function parseDurationMinutes(value) {
  if (value === '' || value === null || value === undefined) return null
  const s = String(value).toLowerCase().trim()
  if (/^-?[\d.]+$/.test(s)) {
    const n = Number.parseFloat(s)
    return Number.isFinite(n) && n >= 0 ? n : null
  }
  let total = 0
  let matched = false
  const hourMatch = s.match(/([\d.]+)\s*(?:hours?|hrs?|h)(?![a-z])/)
  const minMatch = s.match(/([\d.]+)\s*(?:minutes?|mins?|m)(?![a-z])/)
  const secMatch = s.match(/([\d.]+)\s*(?:seconds?|secs?|s)(?![a-z])/)
  if (hourMatch) {
    total += Number.parseFloat(hourMatch[1]) * 60
    matched = true
  }
  if (minMatch) {
    total += Number.parseFloat(minMatch[1])
    matched = true
  }
  if (secMatch) {
    total += Number.parseFloat(secMatch[1]) / 60
    matched = true
  }
  return matched ? total : null
}

export function formatDuration(minutes) {
  if (minutes == null) return '\u2014'
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = Math.round(minutes % 60)
    const hoursPart = h === 1 ? '1 hour' : `${h} hours`
    return m === 0 ? hoursPart : `${hoursPart} ${m} min`
  }
  const totalSeconds = Math.round(minutes * 60)
  const mm = Math.floor(totalSeconds / 60)
  const ss = totalSeconds % 60
  if (mm > 0) return ss > 0 ? `${mm}m ${ss}s` : `${mm}m`
  return `${ss}s`
}

export function formatDurationOption(minutes) {
  return minutes < 60 ? `${minutes} min` : formatDuration(minutes)
}

export function averageDuration(records) {
  const durations = records
    .map((r) => r.durationMinutes)
    .filter((d) => typeof d === 'number' && Number.isFinite(d))
  if (durations.length === 0) return null
  return durations.reduce((a, b) => a + b, 0) / durations.length
}
