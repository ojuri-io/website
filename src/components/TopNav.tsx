import { Github } from 'lucide-react';
import { Container } from './ui/Container';
import { Wordmark } from './ui/Wordmark';
import { Monogram } from './ui/Monogram';

/** Top navigation. Static, non-sticky. */
export function TopNav() {
  return (
    <Container as="nav" className="!max-w-container border-b border-stone-300/70">
      <div className="h-16 flex items-center justify-between">
        <a
          href="#"
          className="inline-flex items-center gap-2.5 text-stone-900 no-underline"
          aria-label="Ojuri home"
        >
          <Monogram size={24} aria-hidden />
          <Wordmark className="text-[22px]" />
        </a>
        <div className="flex items-center gap-6 sm:gap-8 text-[14px] text-stone-700">
          <a href="#architecture" className="nav-link no-underline">Architecture</a>
          <a
            href="https://github.com/ojuri-io/ojuri#readme"
            className="nav-link no-underline hidden sm:inline-block"
            data-umami-event="nav-docs"
          >
            Docs
          </a>
          <a
            href="https://github.com/ojuri-io/ojuri/discussions"
            className="nav-link no-underline hidden sm:inline-block"
            data-umami-event="nav-discussions"
          >
            Discussions
          </a>
          <a
            href="https://github.com/ojuri-io/ojuri"
            className="nav-link inline-flex items-center gap-2 no-underline group"
            aria-label="View Ojuri on GitHub"
            data-umami-event="nav-github"
          >
            <Github
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-300 ease-out group-hover:rotate-[-6deg] group-hover:scale-110"
            />
            GitHub
          </a>
        </div>
      </div>
    </Container>
  );
}
