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

export function App() {
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
