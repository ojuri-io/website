import { useEffect, useState } from 'react';
import { LandingB } from './components/landing-b/LandingB';
import { ComingSoon } from './components/ComingSoon';
import { LAUNCH_DATE, isComingSoonMode } from './config/launch';

// Two gates control which page renders:
//   1. Manual toggle — `VITE_LAUNCH_MODE=coming-soon` at build time.
//      Set in .env locally or in the deploy workflow for production.
//   2. Auto cutover — once `LAUNCH_DATE` passes, the full landing takes
//      over even if (1) is still set. So an already-deployed coming-soon
//      build flips itself to the landing page at the launch moment, no
//      redeploy required.
function shouldShowComingSoon(): boolean {
  return isComingSoonMode && Date.now() < LAUNCH_DATE.getTime();
}

export function App() {
  const [showComingSoon, setShowComingSoon] = useState(shouldShowComingSoon);

  // If a visitor opens the coming-soon page before launch, swap to the
  // full landing exactly when the launch timestamp passes.
  useEffect(() => {
    if (!showComingSoon) return;
    const ms = LAUNCH_DATE.getTime() - Date.now();
    if (ms <= 0) {
      setShowComingSoon(false);
      return;
    }
    const t = setTimeout(() => setShowComingSoon(false), ms);
    return () => clearTimeout(t);
  }, [showComingSoon]);

  if (showComingSoon) return <ComingSoon />;

  return <LandingB />;
}
