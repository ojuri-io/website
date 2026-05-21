import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from './ui/Container';
import { Wordmark } from './ui/Wordmark';
import { Eyebrow } from './ui/Eyebrow';
import { LAUNCH_DATE } from '../config/launch';

// Google Form embed:
//   1. Create a Google Form with a single short-answer field titled "email"
//   2. In the form editor, click ⋮ → "Get pre-filled link"
//   3. Type any value into the email field, click "Get link"
//   4. The link looks like:
//        https://docs.google.com/forms/d/e/<FORM_ID>/viewform?entry.<FIELD_ID>=test%40example.com
//   5. Replace the constants below with FORM_ID and the entry.XXXX field ID.
const GOOGLE_FORM_ID = '1FAIpQLScELODEJk1-Ge9AH5kxwLHuVERBrkGPIMQM1yt9byGolE0blg';
const GOOGLE_FORM_EMAIL_FIELD = 'entry.655310729';

// Practical email regex: one or more non-whitespace/@ chars, then @,
// then one or more non-whitespace/@ chars, then a dot, then a TLD.
// Catches the common bad inputs (missing @, missing TLD, whitespace,
// multiple @s) without being so strict it rejects edge-case-but-valid
// addresses (RFC 5322 in full is not practical client-side).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface TimeLeft {
  launched: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) {
    return { launched: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    launched: false,
    days:    Math.floor(ms / 86_400_000),
    hours:   Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1_000),
  };
}

function useCountdown(target: Date): TimeLeft {
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(target));
  useEffect(() => {
    const tick = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(tick);
  }, [target]);
  return time;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function ComingSoon() {
  const { launched, days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email')?.toString().trim() ?? '';
    // Honeypot: visually hidden field named "website". Real users can't
    // see or tab to it, so any value means an autofilling bot. Show the
    // success state (so the bot doesn't retry) but skip the actual POST.
    const honeypot = data.get('website')?.toString() ?? '';
    if (honeypot) {
      setSubmitted(true);
      return;
    }
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("That doesn't look like a valid email.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      // Google Forms accepts cross-origin POSTs in no-cors mode. We can't
      // read the response, but the submission lands in the form's responses.
      const url = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
      const body = new FormData();
      body.append(GOOGLE_FORM_EMAIL_FIELD, email);
      await fetch(url, { method: 'POST', mode: 'no-cors', body });
    } catch {
      // no-cors swallows errors — show success either way.
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen flex flex-col font-sans">
      <Container as="header" className="pt-8 sm:pt-10">
        <Wordmark className="text-[22px] text-stone-900" />
      </Container>

      <Container className="flex-1 flex flex-col justify-center py-12 sm:py-16">
        <Eyebrow variant="mono" className="mb-6">
          Coming June 7 · 2026
        </Eyebrow>

        <h1 className="font-display font-semibold text-stone-900 max-w-[20ch] text-[40px] sm:text-[56px] leading-[1.08] tracking-tightest">
          Open source fraud detection that bears witness to every transaction.
        </h1>

        <p className="mt-8 max-w-measure text-[17px] sm:text-[18px] leading-[1.55] text-stone-700">
          Ojuri is a self-hosted, multi-agent fraud detection platform for fintech,
          payments, and e-commerce. MIT-licensed. Launching with the full agent
          stack, the operator dashboard, and the architecture docs that explain how
          it all fits.
        </p>

        {/* ─── Countdown ─────────────────────────────────────── */}
        <div className="mt-12 sm:mt-14">
          {launched ? (
            <div
              className="font-display text-[32px] sm:text-[44px] text-stone-900 tracking-tightest"
              aria-live="polite"
            >
              Live now.{' '}
              <a
                href="https://github.com/ojuri-io/ojuri"
                className="underline decoration-stone-300 hover:decoration-stone-900"
              >
                View on GitHub →
              </a>
            </div>
          ) : (
            <div className="flex items-baseline gap-3 sm:gap-6 flex-wrap">
              <CountdownCell value={days}    label="days" />
              <Sep />
              <CountdownCell value={hours}   label="hours" />
              <Sep />
              <CountdownCell value={minutes} label="minutes" />
              <Sep />
              <CountdownCell value={seconds} label="seconds" />
            </div>
          )}
        </div>

        {/* ─── Email form ────────────────────────────────────── */}
        {!launched && (
          <div className="mt-12 sm:mt-14 max-w-measure">
            <Eyebrow variant="mono" className="mb-3">
              Early access
            </Eyebrow>

            {submitted ? (
              <p
                className="text-[15px] leading-[24px] text-stone-700"
                aria-live="polite"
              >
                Got it. You&apos;ll get an email when v1.0 ships.
              </p>
            ) : (
              <>
                <form onSubmit={onSubmit} className="flex gap-2 flex-wrap" noValidate>
                  {/*
                    Honeypot — visually hidden, removed from the tab order
                    and from assistive tech. Bots that auto-fill every form
                    field will populate `website`; the submit handler treats
                    any value as a bot submission.
                  */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '-9999px',
                      width: '1px',
                      height: '1px',
                      overflow: 'hidden',
                    }}
                  >
                    <label htmlFor="early-access-website">
                      Leave this field blank
                    </label>
                    <input
                      id="early-access-website"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      defaultValue=""
                    />
                  </div>

                  <label htmlFor="early-access-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="early-access-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={error ? 'early-access-email-error' : undefined}
                    onInput={() => error && setError(null)}
                    className={`flex-1 min-w-[220px] h-11 px-4 bg-stone-50 border rounded-sm text-[14px] text-stone-900 placeholder-stone-500 focus:outline-none ${
                      error
                        ? 'border-red-600 focus:border-red-700'
                        : 'border-stone-300 focus:border-stone-900'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group h-11 px-5 bg-stone-900 text-stone-100 text-[14px] font-medium rounded-sm hover:bg-stone-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    Notify me
                    <ArrowRight
                      size={16}
                      strokeWidth={1.5}
                      className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                    />
                  </button>
                </form>
                {error && (
                  <p
                    id="early-access-email-error"
                    role="alert"
                    className="mt-2 text-[13px] leading-[20px] text-red-700"
                  >
                    {error}
                  </p>
                )}
              </>
            )}

            <ul className="mt-6 space-y-1.5 text-[13.5px] leading-[20px] text-stone-600">
              <li>— First look at the operator dashboard before public launch.</li>
              <li>— Architecture doc and load-test method when they&apos;re ready.</li>
              <li>— Security and responsible disclosure contact at launch.</li>
            </ul>
          </div>
        )}
      </Container>

      <Container as="footer" className="pb-8 sm:pb-10">
        <p className="font-mono text-[12px] text-stone-500">
          © 2026 Ojuri Contributors. MIT licensed.
        </p>
      </Container>
    </main>
  );
}

function CountdownCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-start">
      <div className="font-mono font-medium text-stone-900 text-[42px] sm:text-[64px] leading-none tabular-nums">
        {pad(value)}
      </div>
      <div className="mt-2 text-[10px] sm:text-[11px] uppercase tracking-label font-medium text-stone-500 font-mono">
        {label}
      </div>
    </div>
  );
}

function Sep() {
  return (
    <div
      className="font-mono font-medium text-stone-400 text-[42px] sm:text-[64px] leading-none"
      aria-hidden="true"
    >
      :
    </div>
  );
}
