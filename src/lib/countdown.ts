import { differenceInCalendarDays, parseISO } from 'date-fns'

export interface CountdownStats {
  days: number
  weeks: number
  isPast: boolean
}

export function getCountdownStats(dateIso: string, now: Date = new Date()): CountdownStats {
  const target = parseISO(dateIso)
  const days = differenceInCalendarDays(target, now)
  const weeks = Math.trunc(days / 7)
  return { days, weeks, isPast: days < 0 }
}
