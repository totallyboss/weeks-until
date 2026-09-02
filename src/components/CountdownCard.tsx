import { motion } from 'motion/react'
import { Pencil, Trash2 } from 'lucide-react'
import type { Countdown } from '../lib/types'
import { getCountdownStats } from '../lib/countdown'

interface CountdownCardProps {
  countdown: Countdown
  onEdit: () => void
  onDelete: () => void
}

export function CountdownCard({ countdown, onEdit, onDelete }: CountdownCardProps) {
  const { days, weeks } = getCountdownStats(countdown.date)

  return (
    <motion.article
      className="card"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      <div className="card-days-col">
        <span className="card-days-number">{Math.abs(days)}</span>
        <span className="card-days-label">day{Math.abs(days) === 1 ? '' : 's'}</span>
      </div>

      <div className="card-details-col">
        <div className="card-top">
          <span className="card-emoji" aria-hidden="true">
            {countdown.emoji}
          </span>
          <div className="card-actions">
            <button type="button" aria-label="Edit" onClick={onEdit}>
              <Pencil size={16} strokeWidth={1.75} />
            </button>
            <button type="button" aria-label="Delete" onClick={onDelete}>
              <Trash2 size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <h2 className="card-title">{countdown.title}</h2>

        <p className="card-weeks">
          {Math.abs(weeks)} week{Math.abs(weeks) === 1 ? '' : 's'}
        </p>

        <p className="card-date">
          {new Date(countdown.date).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
          })}
        </p>
      </div>
    </motion.article>
  )
}
