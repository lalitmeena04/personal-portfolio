// Dates are 'YYYY-MM' strings; parsing them by hand avoids timezone shifts from Date parsing.
function parse(ym) {
  const [year, month] = ym.split('-').map(Number)
  return { year, month }
}

/** Months from start to end counting both ends, the way LinkedIn shows tenure. */
export function monthsInclusive(start, end) {
  const s = parse(start)
  const now = new Date()
  const e = end ? parse(end) : { year: now.getFullYear(), month: now.getMonth() + 1 }
  return (e.year - s.year) * 12 + (e.month - s.month) + 1
}

export function formatDuration(months) {
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = []
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (rest) parts.push(`${rest} mo${rest > 1 ? 's' : ''}`)
  return parts.join(' ')
}
