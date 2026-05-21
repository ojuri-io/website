// Launch configuration shared between App.tsx (which gate-keeps the
// coming-soon page) and ComingSoon.tsx (which counts down to it).
//
// LAUNCH_DATE must include a UTC offset so the cutover happens at the
// intended local moment regardless of where the visitor's browser is.
// Examples:
//   '2026-06-07T09:00:00+01:00'  Lagos / WAT (UTC+1) — current default
//   '2026-06-07T09:00:00+00:00'  London winter (GMT)
//   '2026-06-07T09:00:00-04:00'  New York summer (EDT)
export const LAUNCH_DATE = new Date('2026-06-07T09:00:00+01:00');

// Manual toggle: set VITE_LAUNCH_MODE=coming-soon in .env (local) or in
// the GitHub Actions workflow (production) to deploy the holding page.
// Unset or any other value ships the full landing.
export const isComingSoonMode =
  import.meta.env.VITE_LAUNCH_MODE === 'coming-soon';
