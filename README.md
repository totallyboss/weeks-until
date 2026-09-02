# Weeks Until

A passcode-locked countdown app. Add dates with a title and an emoji, and see the days
(and weeks) remaining until each one, largest and boldest for the soonest date.

## Stack

- React + TypeScript + Vite
- [Motion](https://motion.dev) for card and modal transitions
- [Lucide](https://lucide.dev) for icons
- [date-fns](https://date-fns.org) for date math
- Data stored in the browser's `localStorage` — nothing leaves your device

## Passcode

On first visit you set a passcode. It is hashed (SHA-256) and stored in
`localStorage`; only the hash is stored, never the plain passcode. This is a
front-door lock, not real security — anyone with browser dev tools on your
device could bypass it. That's an acceptable trade-off for a single-user app
hosted as static files on GitHub Pages, which cannot run server-side auth.

Unlocking lasts for the browser tab session. Use "Lock" to lock again, or
"Reset passcode" if you forget it (this clears the stored hash, not your
countdowns).

## Development

```sh
npm install
npm run dev
```

## Deploy

Pushing to `main` builds the app and deploys it to GitHub Pages via the
workflow in `.github/workflows/deploy.yml`. Enable Pages for this repo under
**Settings → Pages → Source: GitHub Actions**.

The Vite `base` in `vite.config.ts` is set to `/weeks-until/` to match this
repo's name — update it if you rename or fork the repo.
