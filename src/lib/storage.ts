import type { Countdown } from './types'

const COUNTDOWNS_KEY = 'weeks-until:countdowns'
const PASSCODE_HASH_KEY = 'weeks-until:passcode-hash'
const UNLOCKED_KEY = 'weeks-until:unlocked'

export function loadCountdowns(): Countdown[] {
  const raw = localStorage.getItem(COUNTDOWNS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveCountdowns(countdowns: Countdown[]): void {
  localStorage.setItem(COUNTDOWNS_KEY, JSON.stringify(countdowns))
}

export function getPasscodeHash(): string | null {
  return localStorage.getItem(PASSCODE_HASH_KEY)
}

export function setPasscodeHash(hash: string): void {
  localStorage.setItem(PASSCODE_HASH_KEY, hash)
}

export function clearPasscodeHash(): void {
  localStorage.removeItem(PASSCODE_HASH_KEY)
}

export function isUnlockedThisSession(): boolean {
  return sessionStorage.getItem(UNLOCKED_KEY) === 'true'
}

export function markUnlockedThisSession(): void {
  sessionStorage.setItem(UNLOCKED_KEY, 'true')
}

export function clearUnlockedThisSession(): void {
  sessionStorage.removeItem(UNLOCKED_KEY)
}
