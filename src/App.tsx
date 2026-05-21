import { useEffect, useState } from 'react';
import { TopNav } from './components/TopNav';
import { Hero } from './components/Hero';
import { WhatItIs } from './components/WhatItIs';
import { Architecture } from './components/Architecture';
import { WhyThisExists } from './components/WhyThisExists';
import { Quickstart } from './components/Quickstart';
import { SeeItOperating } from './components/SeeItOperating';
import { PerformanceHonestly } from './components/PerformanceHonestly';
import { ClosingCTA } from './components/ClosingCTA';
import { Footer } from './components/Footer';
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

  return (
    <>
      <header>
        <TopNav />
      </header>
      <main id="main" className="font-sans">
        <Hero />
        <WhatItIs />
        <Architecture />
        <WhyThisExists />
        <Quickstart />
        <SeeItOperating />
        <PerformanceHonestly />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
