import { ArrowRight, Github } from 'lucide-react';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { Eyebrow } from './ui/Eyebrow';
import { LAUNCH_DATE_LABEL } from '../config/launch';

/** Hero — witness-framed headline, supporting paragraph, two CTAs. */
export function Hero() {
  return (
    <section className="border-b border-stone-300/70">
      <Container className="pt-20 pb-20 sm:pt-28 sm:pb-28">
        <Eyebrow className="fade-up mb-8">
          v1.0 · MIT licensed · {LAUNCH_DATE_LABEL}
        </Eyebrow>

        <h1 className="fade-up d1 font-display font-semibold text-stone-900 max-w-[20ch] text-[44px] sm:text-[60px] leading-[1.08] tracking-tightest">
          Open source fraud detection that bears witness to every transaction.
        </h1>

        <p className="fade-up d2 mt-10 sm:mt-14 max-w-measure text-[18px] sm:text-[20px] leading-[1.55] text-stone-700">
          Self-hosted, multi-agent, MIT licensed. ONNX-served XGBoost decisions at
          p99 ≈ 4ms server-side, drift-aware retraining, and investigation reports
          in plain language — all under your roof. No SaaS, no data egress, no
          per-call fees.
        </p>

        <div className="fade-up d3 mt-10 sm:mt-12 flex items-center gap-3 flex-wrap">
          <Button href="https://github.com/ojuri-io/ojuri" variant="primary">
            <Github
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-300 ease-out group-hover:rotate-[-8deg] group-hover:scale-110"
            />
            View on GitHub
          </Button>
          <Button href="https://github.com/ojuri-io/ojuri#readme" variant="ghost">
            Read the docs
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            />
          </Button>
        </div>
      </Container>
    </section>
  );
}
