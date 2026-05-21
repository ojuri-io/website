import { ArrowRight, Github } from 'lucide-react';
import { Container } from './ui/Container';
import { Eyebrow } from './ui/Eyebrow';
import { Button } from './ui/Button';
import { Wordmark } from './ui/Wordmark';

/** Closing — giant Ojuri. wordmark moment + CTAs, cream surface. */
export function ClosingCTA() {
  return (
    <section className="border-b border-stone-300/70">
      <Container className="py-20 sm:py-28">
        <Eyebrow className="mb-10">Ojuri — the seeing eye</Eyebrow>

        <Wordmark
          as="div"
          className="closing-mark text-stone-900 leading-[0.95]"
        />
        {/* Wordmark gets its display size via this scoped style override. */}
        <style dangerouslySetInnerHTML={{ __html: `
          .closing-mark { font-size: clamp(72px, 11vw, 144px); }
        `}} />

        <p className="mt-8 max-w-measure font-display text-stone-900 text-[24px] sm:text-[28px] leading-[1.3] tracking-tightest">
          Bears witness to every transaction.
        </p>

        <p className="mt-5 max-w-measure text-[16px] leading-[26px] text-stone-600">
          Self-hosted, MIT-licensed, in your boundary. One repo, one{' '}
          <span className="font-mono text-[14px]">docker compose up</span>, one POST.
        </p>

        <div className="mt-10 flex items-center gap-3 flex-wrap">
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
