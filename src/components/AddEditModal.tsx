import { AnimatePresence, motion } from 'motion/react'
import { type FormEvent, useState } from 'react'
import { X } from 'lucide-react'
import type { Countdown } from '../lib/types'

interface AddEditModalProps {
  countdown: Countdown | null
  onSave: (countdown: Countdown) => void
  onClose: () => void
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function AddEditModal({ countdown, onSave, onClose }: AddEditModalProps) {
  const [title, setTitle] = useState(countdown?.title ?? '')
  const [emoji, setEmoji] = useState(countdown?.emoji ?? '🎯')
  const [date, setDate] = useState(countdown?.date ?? todayIso())

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!title.trim() || !date) return

    onSave({
      id: countdown?.id ?? crypto.randomUUID(),
      title: title.trim(),
      emoji: emoji.trim() || '🎯',
      date,
      createdAt: countdown?.createdAt ?? new Date().toISOString(),
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.form
          className="modal"
          onClick={(event) => event.stopPropagation()}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18 }}
        >
          <div className="modal-header">
            <h2>{countdown ? 'Edit countdown' : 'New countdown'}</h2>
            <button type="button" aria-label="Close" onClick={onClose}>
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>

          <label>
            Emoji
            <input
              type="text"
              value={emoji}
              onChange={(event) => setEmoji(event.target.value)}
              maxLength={4}
              placeholder="🎯"
            />
          </label>

          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Trip to Japan"
              autoFocus
              required
            />
          </label>

          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </label>

          <button type="submit" className="primary">
            {countdown ? 'Save changes' : 'Add countdown'}
          </button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  )
}
