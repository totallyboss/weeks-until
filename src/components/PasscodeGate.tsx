import { motion } from 'motion/react'
import { type FormEvent, useState } from 'react'
import { Lock } from 'lucide-react'
import { sha256Hex } from '../lib/crypto'
import { getPasscodeHash, markUnlockedThisSession, setPasscodeHash } from '../lib/storage'

interface PasscodeGateProps {
  onUnlock: () => void
}

export function PasscodeGate({ onUnlock }: PasscodeGateProps) {
  const existingHash = getPasscodeHash()
  const isSettingUp = !existingHash

  const [value, setValue] = useState('')
  const [confirmValue, setConfirmValue] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (isSettingUp) {
      if (value.length < 4) {
        setError('Use at least 4 characters.')
        return
      }
      if (value !== confirmValue) {
        setError("Passcodes don't match.")
        return
      }
      setPasscodeHash(await sha256Hex(value))
      markUnlockedThisSession()
      onUnlock()
      return
    }

    const enteredHash = await sha256Hex(value)
    if (enteredHash === existingHash) {
      markUnlockedThisSession()
      onUnlock()
    } else {
      setError('Wrong passcode.')
      setValue('')
    }
  }

  return (
    <div className="gate">
      <motion.form
        className="gate-card"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="gate-icon">
          <Lock size={28} strokeWidth={1.75} />
        </div>
        <h1>{isSettingUp ? 'Set a passcode' : 'Enter passcode'}</h1>
        <p className="gate-sub">
          {isSettingUp
            ? 'This locks the front door on this device. Anyone with dev tools can bypass it — fine for personal use.'
            : 'Welcome back.'}
        </p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Passcode"
        />
        {isSettingUp && (
          <input
            type="password"
            inputMode="numeric"
            value={confirmValue}
            onChange={(event) => setConfirmValue(event.target.value)}
            placeholder="Confirm passcode"
          />
        )}
        {error && <p className="gate-error">{error}</p>}
        <button type="submit">{isSettingUp ? 'Set passcode' : 'Unlock'}</button>
      </motion.form>
    </div>
  )
}
