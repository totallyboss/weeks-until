import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Plus } from 'lucide-react'
import './App.css'
import { PasscodeGate } from './components/PasscodeGate'
import { CountdownCard } from './components/CountdownCard'
import { AddEditModal } from './components/AddEditModal'
import type { Countdown } from './lib/types'
import { getCountdownStats } from './lib/countdown'
import {
  clearPasscodeHash,
  clearUnlockedThisSession,
  isUnlockedThisSession,
  loadCountdowns,
  saveCountdowns,
} from './lib/storage'

function App() {
  const [unlocked, setUnlocked] = useState(isUnlockedThisSession())
  const [countdowns, setCountdowns] = useState<Countdown[]>(loadCountdowns)
  const [editing, setEditing] = useState<Countdown | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showPast, setShowPast] = useState(false)

  const sorted = useMemo(() => {
    return [...countdowns]
      .map((countdown) => ({ countdown, stats: getCountdownStats(countdown.date) }))
      .filter(({ stats }) => showPast || !stats.isPast)
      .sort((a, b) => a.stats.days - b.stats.days)
  }, [countdowns, showPast])

  function persist(next: Countdown[]) {
    setCountdowns(next)
    saveCountdowns(next)
  }

  function handleSave(countdown: Countdown) {
    const exists = countdowns.some((c) => c.id === countdown.id)
    const next = exists
      ? countdowns.map((c) => (c.id === countdown.id ? countdown : c))
      : [...countdowns, countdown]
    persist(next)
    setShowModal(false)
    setEditing(null)
  }

  function handleDelete(id: string) {
    persist(countdowns.filter((c) => c.id !== id))
  }

  function handleLock() {
    clearUnlockedThisSession()
    setUnlocked(false)
  }

  function handleResetPasscode() {
    if (!confirm('Reset your passcode? You will be asked to set a new one.')) return
    clearPasscodeHash()
    handleLock()
  }

  if (!unlocked) {
    return <PasscodeGate onUnlock={() => setUnlocked(true)} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weeks Until</h1>
        <div className="header-actions">
          <button
            type="button"
            className="ghost"
            onClick={() => setShowPast((v) => !v)}
            title={showPast ? 'Hide past dates' : 'Show past dates'}
          >
            {showPast ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
            {showPast ? 'Hide past' : 'Show past'}
          </button>
          <button type="button" className="ghost" onClick={handleLock} title="Lock">
            <LockKeyhole size={16} strokeWidth={1.75} />
            Lock
          </button>
        </div>
      </header>

      {sorted.length === 0 ? (
        <div className="empty">
          <p>No countdowns yet.</p>
          <button
            type="button"
            className="primary"
            onClick={() => {
              setEditing(null)
              setShowModal(true)
            }}
          >
            <Plus size={16} strokeWidth={1.75} /> Add your first
          </button>
        </div>
      ) : (
        <motion.div className="grid" layout>
          <AnimatePresence>
            {sorted.map(({ countdown }) => (
              <CountdownCard
                key={countdown.id}
                countdown={countdown}
                onEdit={() => {
                  setEditing(countdown)
                  setShowModal(true)
                }}
                onDelete={() => handleDelete(countdown.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {sorted.length > 0 && (
        <button
          type="button"
          className="fab"
          aria-label="Add countdown"
          onClick={() => {
            setEditing(null)
            setShowModal(true)
          }}
        >
          <Plus size={24} strokeWidth={2} />
        </button>
      )}

      <button type="button" className="reset-passcode" onClick={handleResetPasscode}>
        Reset passcode
      </button>

      {showModal && (
        <AddEditModal
          countdown={editing}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

export default App
