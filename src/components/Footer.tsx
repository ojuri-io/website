import { Container } from './ui/Container';
import { Eyebrow } from './ui/Eyebrow';
import { Wordmark } from './ui/Wordmark';
import { Monogram } from './ui/Monogram';
import { LAUNCH_DATE_LABEL } from '../config/launch';

interface FooterColProps {
  title: string;
  links: Array<[string, string]>;
}

function FooterCol({ title, links }: FooterColProps) {
  return (
    <div className="col-span-6 md:col-span-2">
      <Eyebrow className="mb-4">{title}</Eyebrow>
      <ul className="flex flex-col gap-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-[14px] text-stone-700 hover:text-stone-900 no-underline">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer>
      <Container className="py-16 sm:py-20">
        <div className="grid grid-cols-12 gap-y-10 gap-x-8 sm:gap-x-12">
          <div className="col-span-12 md:col-span-5">
            <div className="inline-flex items-center gap-3">
              <Monogram size={32} className="text-stone-900" aria-hidden />
              <Wordmark className="text-[28px] text-stone-900" />
            </div>
            <p className="mt-3 font-mono text-[12px] text-stone-500">
              <em>Ojuri</em> (Yoruba: <em>ojúrí</em>) — &quot;the seeing eye.&quot;<br />
              A witness to every transaction.
            </p>
          </div>
          <FooterCol
            title="Project"
            links={[
              ['Docs',        'https://github.com/ojuri-io/ojuri#readme'],
              ['GitHub',      'https://github.com/ojuri-io/ojuri'],
              ['Discussions', 'https://github.com/ojuri-io/ojuri/discussions'],
              ['Roadmap',     'https://github.com/ojuri-io/ojuri/blob/main/ROADMAP.md'],
            ]}
          />
          <FooterCol
            title="Operate"
            links={[
              ['Security',     'https://github.com/ojuri-io/ojuri/blob/main/SECURITY.md'],
              ['Architecture', 'https://github.com/ojuri-io/ojuri/blob/main/ARCHITECTURE.md'],
              ['Performance',  'https://github.com/ojuri-io/ojuri/blob/main/PERFORMANCE.md'],
              ['Releases',     'https://github.com/ojuri-io/ojuri/releases'],
            ]}
          />
          <FooterCol
            title="Community"
            links={[
              ['Contributing',     'https://github.com/ojuri-io/ojuri/blob/main/CONTRIBUTING.md'],
              ['Code of conduct',  'https://github.com/ojuri-io/ojuri/blob/main/CODE_OF_CONDUCT.md'],
              ['License (MIT)',    'https://github.com/ojuri-io/ojuri/blob/main/LICENSE'],
              ['Acknowledgments',  'https://github.com/ojuri-io/ojuri/blob/main/ACKNOWLEDGMENTS.md'],
            ]}
          />
        </div>
        <div className="mt-16 sm:mt-20 pt-8 border-t border-stone-300/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="font-mono text-[12px] text-stone-500">
            © 2026 Ojuri Contributors. MIT licensed.
          </div>
          <div className="font-mono text-[12px] text-stone-500">
            v1.0 · released {LAUNCH_DATE_LABEL}
          </div>
        </div>
      </Container>
    </footer>
  );
}
