import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, Copy, Github } from 'lucide-react';
import { Wordmark } from '../ui/Wordmark';
import { EMAIL_RE, submitEmailSignup } from '../../utils/emailSignup';
import { ArchitectureSection } from './ArchitectureSection';
import { Marker, SECTIONS, Shell } from './primitives';

// Ojuri landing — Direction B: an ink-first operations console. Fixed section
// rail, a live decision stream in the hero, and two cream inversions (Sentinel,
// Architecture) that read as lit panels. Latency claims are qualified in the
// "Performance, honestly" section: p99 ≈ 6ms server-side, ≈49µs at the model.

const ICON = { strokeWidth: 1.5 } as const;

// ── Fixed index rail ──────────────────────────────────────────────
function Rail({ active }: { active: string }) {
  return (
    <aside className="hidden xl:flex fixed left-0 top-0 h-screen w-[228px] flex-col justify-between px-8 py-8 border-r border-stone-800 z-20">
      <a href="#top" className="text-[24px] text-stone-100 no-underline"><Wordmark /></a>
      <nav className="flex flex-col gap-3">
        {SECTIONS.map(([n, label, id]) => {
          const on = active === id;
          return (
            <a key={id} href={`#${id}`} className="group flex items-center gap-3 no-underline">
              <span className={`font-mono text-[10.5px] tabular-nums transition-colors ${on ? 'text-[#C4694F]' : 'text-stone-600'}`}>{n}</span>
              <span className={`h-px transition-all duration-300 ${on ? 'w-5 bg-[#C4694F]' : 'w-2.5 bg-stone-700 group-hover:w-4 group-hover:bg-stone-500'}`} />
              <span className={`text-[12.5px] transition-colors ${on ? 'text-stone-100' : 'text-stone-500 group-hover:text-stone-300'}`}>{label}</span>
            </a>
          );
        })}
      </nav>
      <div className="flex flex-col gap-2.5">
        <a href="https://github.com/ojuri-io/ojuri" className="group inline-flex items-center gap-2 text-[12.5px] text-stone-400 hover:text-stone-100 no-underline transition-colors">
          <Github size={14} {...ICON} className="transition-transform duration-300 group-hover:rotate-[-8deg]" /> GitHub
        </a>
        <a href="https://github.com/ojuri-io/ojuri#readme" className="text-[12.5px] text-stone-400 hover:text-stone-100 no-underline transition-colors">Docs</a>
        <div className="mt-2 font-mono text-[10.5px] text-stone-600">MIT · v1.3.0</div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <div className="xl:hidden sticky top-0 z-30 bg-stone-900/95 backdrop-blur border-b border-stone-800">
      <div className="px-6 sm:px-10 h-14 flex items-center justify-between">
        <a href="#top" className="text-[20px] text-stone-100 no-underline"><Wordmark /></a>
        <div className="flex items-center gap-5 text-[13px] text-stone-400">
          <a href="#how" className="no-underline hover:text-stone-100 transition-colors">How</a>
          <a href="#quickstart" className="no-underline hover:text-stone-100 transition-colors">Quickstart</a>
          <a href="https://github.com/ojuri-io/ojuri" className="no-underline hover:text-stone-100 transition-colors inline-flex items-center gap-1.5"><Github size={14} {...ICON} /> GitHub</a>
        </div>
      </div>
    </div>
  );
}

// ── 01 · Hero + live decision stream ──────────────────────────────
type Verdict = 'ACCEPT' | 'REVIEW' | 'DECLINE';
type Sample = [Verdict, string, string, string, number, number];

const SAMPLES: Sample[] = [
  ['ACCEPT', 'TRANSFER', '₦412,000', 'ML', 0.0721, 3],
  ['ACCEPT', 'PAYMENT', '₦8,450', 'ML', 0.0113, 2],
  ['REVIEW', 'TRANSFER', '₦2,900,000', 'ML', 0.6612, 4],
  ['ACCEPT', 'CASH_OUT', '₦96,300', 'ML', 0.1904, 3],
  ['DECLINE', 'TRANSFER', '₦1,750,000', 'PRE_RULE', 0.9418, 2],
  ['ACCEPT', 'PAYMENT', '₦23,900', 'ML', 0.0447, 3],
  ['ACCEPT', 'DEBIT', '₦150,000', 'ML', 0.2231, 4],
  ['REVIEW', 'CASH_OUT', '₦880,000', 'ML', 0.6903, 5],
];

const verdictTone: Record<Verdict, string> = {
  ACCEPT: 'text-[#7E9C7E]',
  REVIEW: 'text-[#B49A5E]',
  DECLINE: 'text-[#C4694F]',
};

function DecisionStream() {
  const [rows, setRows] = useState(() => SAMPLES.slice(0, 5).map((s, i) => ({ s, k: i })));
  const next = useRef(5);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => {
      setRows((r) => {
        const s = SAMPLES[next.current % SAMPLES.length];
        next.current += 1;
        return [...r.slice(1), { s, k: next.current }];
      });
    }, 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="border border-stone-800 rounded-md overflow-hidden bg-[#15120F]">
      <div className="flex items-center justify-between h-9 px-4 border-b border-stone-800">
        <span className="font-mono text-[10.5px] uppercase tracking-label text-stone-500">Live decision stream</span>
        <span className="flex items-center gap-2 font-mono text-[10.5px] text-stone-500">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7E9C7E] pulse-dot" /> RDA
        </span>
      </div>
      <div className="divide-y divide-stone-800/70">
        {rows.map(({ s, k }) => {
          const [verdict, type, amount, source, prob, ms] = s;
          return (
            <div key={k} className="stream-row grid grid-cols-[86px_1fr_auto] sm:grid-cols-[86px_110px_1fr_64px_58px_44px] items-center gap-x-4 px-4 h-11 font-mono text-[12px]">
              <span className={`font-medium ${verdictTone[verdict]}`}>{verdict}</span>
              <span className="hidden sm:block text-stone-500">{type}</span>
              <span className="text-stone-300 tabular-nums">{amount}</span>
              <span className="hidden sm:block text-stone-600">{source}</span>
              <span className="hidden sm:block text-stone-500 tabular-nums">{prob.toFixed(4)}</span>
              <span className="text-stone-600 tabular-nums text-right">{ms}ms</span>
            </div>
          );
        })}
      </div>
      <div className="h-9 px-4 flex items-center border-t border-stone-800 font-mono text-[10.5px] text-stone-600">
        Illustrative traffic · fields match the /v1/predict response
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="scroll-mt-20 border-b border-stone-800">
      <Shell className="pt-20 pb-20 lg:pt-28 lg:pb-24">
        <div className="fade-up flex flex-wrap items-center gap-3 mb-9">
          <span className="inline-flex items-center shrink-0 whitespace-nowrap h-6 px-2.5 border border-stone-700 rounded-full font-mono text-[10.5px] uppercase tracking-label text-stone-400">Open source</span>
          <span className="text-[11px] uppercase tracking-label font-medium text-stone-500">Fraud detection for fintech · MIT · v1.3</span>
        </div>

        <h1 className="fade-up d1 font-display font-semibold text-stone-50 max-w-[18ch] text-[clamp(40px,5.6vw,68px)] leading-[1.04] tracking-tightest">
          Catch fraud in real time, without sending customer data anywhere.
        </h1>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] gap-x-16 gap-y-12 items-start">
          <div className="fade-up d2">
            <p className="text-[19px] leading-[31px] text-stone-300">
              Ojuri is a fraud detection engine you run yourself. It scores every
              transaction before the money moves, tells you exactly why it made
              each call, and never sends a byte outside your own infrastructure.
              Free and open source — no contract, no per-transaction fee.
            </p>
            <div className="mt-10 flex items-center gap-3 flex-wrap">
              <a href="https://github.com/ojuri-io/ojuri" data-umami-event="hero-github" className="group inline-flex items-center gap-2 h-11 px-5 bg-stone-100 text-stone-900 text-[14px] font-medium rounded-sm no-underline hover:bg-white transition-colors">
                <Github size={16} {...ICON} className="transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110" /> View on GitHub
              </a>
              <a href="#how" className="group inline-flex items-center gap-2 h-11 px-5 text-stone-200 text-[14px] font-medium rounded-sm no-underline border border-stone-700 hover:border-stone-500 transition-colors">
                How it works <ArrowDown size={16} {...ICON} className="transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>
          <div className="fade-up d3 w-full min-w-0"><DecisionStream /></div>
        </div>
      </Shell>
    </section>
  );
}

// ── Proof bar ─────────────────────────────────────────────────────
function ProofBar() {
  const stats: Array<[string, string, string]> = [
    ['p99 ≈ 6ms', 'End-to-end decision', 'Measured server-side, request in to verdict out.'],
    ['≈ 49µs', 'Model inference', 'Compiled XGBoost served through ONNX Runtime.'],
    ['0 bytes', 'Leave your network', 'Scoring, training, and investigation all run in your VPC.'],
    ['MIT', 'License', 'No per-call fees, no rate limits, no vendor on the path.'],
  ];
  return (
    <section className="border-b border-stone-800 bg-[#15120F]">
      <Shell>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([big, label, note], i) => (
            <div key={label} className={`py-9 lg:py-11 lg:px-7 lg:first:pl-0 lg:last:pr-0 border-stone-800 ${i > 0 ? 'border-t sm:border-t-0 sm:border-l' : ''} ${i >= 2 ? 'sm:border-t lg:border-t-0' : ''}`}>
              <div className="font-display font-semibold text-stone-50 text-[32px] leading-none tracking-tightest">{big}</div>
              <div className="mt-3 text-[13.5px] font-medium text-stone-200">{label}</div>
              <p className="mt-1.5 text-[13px] leading-[21px] text-stone-500 max-w-[30ch]">{note}</p>
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
}

// ── 02 · Trade-off ────────────────────────────────────────────────
function Dilemma() {
  const cols: Array<[string, string[]]> = [
    ['Buy a fraud API', [
      'Your customers’ payment data is sent to somebody else’s cloud.',
      'You pay per transaction, so success gets more expensive.',
      'The verdict arrives as a score with no explanation attached.',
      'Their outage becomes your outage, mid-checkout.',
    ]],
    ['Build it in-house', [
      'A year of senior engineering before it scores anything.',
      'You still have to solve serving, drift, and retraining.',
      'Analysts get no tooling until someone builds that too.',
      'The maintenance never ends, and it is never the roadmap.',
    ]],
  ];
  return (
    <section id="tradeoff" className="scroll-mt-20 border-b border-stone-800">
      <Shell className="py-24">
        <Marker n="02">The trade-off</Marker>
        <h2 className="mt-7 font-display font-semibold text-stone-50 text-[clamp(28px,3.4vw,40px)] leading-[1.12] tracking-tightest max-w-[20ch]">
          Buying costs you control. Building costs you a year.
        </h2>
        <p className="mt-6 max-w-measure text-[17.5px] leading-[28px] text-stone-400">
          Most teams pick the least bad option and live with it. Ojuri exists
          because the trade-off is an artefact of how fraud tooling is sold, not
          something inherent to the problem.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12">
          {cols.map(([tag, points]) => (
            <div key={tag}>
              <div className="font-mono text-[11px] uppercase tracking-label text-stone-500 pb-4 border-b border-stone-800">{tag}</div>
              <ul className="mt-6 flex flex-col gap-4">
                {points.map((p) => (
                  <li key={p} className="grid grid-cols-[14px_1fr] gap-4 text-[15.5px] leading-[26px] text-stone-300">
                    <span className="mt-[12px] inline-block w-[7px] h-px bg-stone-600 self-start" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-[#C4694F]">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-10 gap-y-4 items-baseline">
            <Wordmark className="text-[30px] text-stone-50" as="div" />
            <p className="max-w-measure font-display text-stone-100 text-[22px] leading-[32px] tracking-tightest">
              A working engine you deploy today, running on your own hardware,
              with the source open in front of you.
            </p>
          </div>
        </div>
      </Shell>
    </section>
  );
}

// ── 03 · What it does ─────────────────────────────────────────────
function WhatItDoes() {
  const items: Array<[string, string, string, [string, string]]> = [
    ['01', 'It stops fraud before the money moves.', 'Every transaction is scored while the authorization is still open, then approved, declined, or sent for review. It is fast enough that a real customer never notices the check happened.', ['The hot path, in detail', '#under-the-hood']],
    ['02', 'It finds the ring, not just the card.', 'Fraud rarely arrives alone. Ojuri watches how accounts, devices, and payees connect over time, so organised rings and mule networks surface before any single transaction looks bad enough to block.', ['How pattern analysis works', '#architecture']],
    ['03', 'It can always tell you why.', 'Every decision is recorded with the exact reasons behind it and the data the model saw at the time. When a regulator, a risk committee, or an angry customer asks why, the answer is a lookup — not an investigation.', ['What lands in the audit log', '#why']],
    ['04', 'It learns from your analysts, not from itself.', 'When a reviewer overrules a decision, that judgement becomes training data. The system gets better at your traffic specifically, and it never trains on its own past guesses.', ['The retraining lifecycle', '#under-the-hood']],
  ];
  return (
    <section id="how" className="scroll-mt-20 border-b border-stone-800">
      <Shell className="py-24">
        <Marker n="03">What it does</Marker>
        <div className="mt-7 grid grid-cols-1 md:grid-cols-12 gap-x-14 gap-y-10">
          <div className="md:col-span-4">
            <h2 className="font-display font-semibold text-stone-50 text-[clamp(27px,3vw,34px)] leading-[1.14] tracking-tightest">
              Four jobs, running the moment you boot it.
            </h2>
            <p className="mt-5 text-[15.5px] leading-[26px] text-stone-500">
              No configuration required to see it work. Tuning it to your
              traffic comes later.
            </p>
          </div>
          <div className="md:col-span-8">
            <ol className="divide-y divide-stone-800">
              {items.map(([num, head, body, link]) => (
                <li key={num} className="py-7 grid grid-cols-[42px_1fr] gap-6 first:pt-0">
                  <span className="font-mono text-[12px] text-stone-600 mt-1.5 tabular-nums">{num}</span>
                  <div>
                    <div className="font-display font-semibold text-stone-50 text-[21px] leading-[1.3] tracking-tightest">{head}</div>
                    <p className="mt-2.5 text-[16px] leading-[27px] text-stone-400 max-w-measure">{body}</p>
                    <a href={link[1]} className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-[11.5px] text-stone-600 hover:text-stone-200 no-underline transition-colors">
                      {link[0]} <ArrowDown size={12} {...ICON} />
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Shell>
    </section>
  );
}

// ── 04 · Sentinel — cream inversion ───────────────────────────────
function SentinelSection() {
  return (
    <section id="sentinel" className="scroll-mt-20 bg-stone-100 text-stone-900">
      <Shell className="py-28">
        <Marker n="04" tone="light">Sentinel</Marker>
        <h2 className="mt-7 font-display font-semibold text-stone-900 text-[clamp(28px,3.2vw,36px)] leading-[1.14] tracking-tightest max-w-[18ch]">
          See it operating.
        </h2>
        <p className="mt-6 text-[17.5px] leading-[28px] text-stone-600 max-w-measure">
          Sentinel is where your risk team lives — the review queue, the decision
          stream, the model registry, and the override that teaches the system
          what it got wrong. Shipped in the box, same licence.
        </p>
        <figure className="m-0 mt-14">
          <div className="border border-stone-300 rounded-lg overflow-hidden">
            <img
              src="/assets/dashboard-home.png"
              width={1600}
              height={900}
              loading="lazy"
              alt="Sentinel dashboard home. A left sidebar groups Detection, Insights, Config, and Access sections. The main panel shows a Things-to-do card, the Champion model card (fraud_model v1.1, threshold 0.65, ACTIVE), Today’s decisions, and a Recent declines list with rule-tagged transactions."
              className="block w-full h-auto"
            />
          </div>
          <figcaption className="mt-5 text-[13.5px] leading-[22px] text-stone-600 max-w-measure">
            Dashboard home — open source, MIT-licensed. Sentinel is a frontend, so
            it runs separately via <span className="font-mono text-[12.5px] text-stone-900">npm run dev</span> against
            the agents you booted in <span className="font-mono text-[12.5px] text-stone-900">docker compose</span>.
          </figcaption>
        </figure>
      </Shell>
    </section>
  );
}

function Handoff() {
  return (
    <section className="border-y border-stone-800 bg-[#15120F]">
      <Shell className="py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-14 gap-y-5 items-baseline">
          <div className="md:col-span-4">
            <div className="flex items-center gap-4 text-[#C4694F]">
              <span className="h-px w-8 bg-[#C4694F]" />
              <span className="text-[11px] uppercase tracking-label font-medium">Below this line, it gets technical</span>
            </div>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-stone-200 text-[21px] leading-[31px] tracking-tightest max-w-measure">
              The rest of this page is written for the engineers who will run it:
              the real topology, the real request and response, and an honest
              account of what the latency numbers do and don’t mean.
            </p>
          </div>
        </div>
      </Shell>
    </section>
  );
}

// ── 06 · Under the hood ───────────────────────────────────────────
function UnderTheHood() {
  const items: Array<[string, string, string]> = [
    ['01', 'ONNX-served XGBoost on the hot path.', 'RDA — a single Fastify service in TypeScript. Zod validation at the edge, PRE rules, Redis feature lookup, ONNX inference at p99 ≈ 49µs, per-segment thresholds, POST rules, audit row, Kafka publish. Idempotent on transaction_id: a duplicate POST returns the cached decision instead of re-scoring.'],
    ['02', 'Graph and velocity analysis, off the hot path.', 'PAA consumes transactions.completed keyed by sender_id, maintains rolling 1h/24h velocity windows and per-receiver pagerank approximations, then writes feature deltas to Redis so RDA’s next prediction sees them. If PAA is down, RDA falls back to default features rather than failing.'],
    ['03', 'LLM investigations on a separate Kafka path.', 'Every DECLINE is republished to transactions.blocked, which only FIA consumes — the LLM never sees the bulk of traffic. A self-hosted Phi-3-mini-4k-instruct writes a structured report: verdict, recommended action, key indicators, narrative. Opt-in via --profile fia, since it pulls ~7.6GB of weights.'],
    ['04', 'A model lifecycle with teeth.', 'MLA watches F1 and PSI over a rolling window and triggers SMOTE-balanced XGBoost retraining when either crosses threshold. Promotion runs CANDIDATE → SHADOW → ACTIVE → RETIRED, gated on McNemar significance (p < 0.05) and ΔF1 ≥ 0.01. A replay CLI re-scores candidates against the live audit log before anything reaches production.'],
  ];
  return (
    <section id="under-the-hood" className="scroll-mt-20 border-b border-stone-800">
      <Shell className="py-24">
        <Marker n="06">Under the hood</Marker>
        <div className="mt-7 grid grid-cols-1 md:grid-cols-12 gap-x-14 gap-y-10">
          <div className="md:col-span-4">
            <h2 className="font-display font-semibold text-stone-50 text-[clamp(27px,3vw,34px)] leading-[1.14] tracking-tightest">
              The same four jobs, specified.
            </h2>
          </div>
          <div className="md:col-span-8">
            <ol className="divide-y divide-stone-800">
              {items.map(([num, head, body]) => (
                <li key={num} className="py-6 grid grid-cols-[42px_1fr] gap-6 first:pt-0">
                  <span className="font-mono text-[12px] text-stone-600 mt-1 tabular-nums">{num}</span>
                  <div>
                    <div className="font-display font-semibold text-stone-50 text-[19.5px] leading-[1.34] tracking-tightest">{head}</div>
                    <p className="mt-2 text-[15.5px] leading-[26px] text-stone-400 max-w-measure">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Shell>
    </section>
  );
}

// ── 07 · Quickstart ───────────────────────────────────────────────
const SHELL_CMD = `$ git clone https://github.com/ojuri-io/ojuri.git && cd ojuri
$ cp .env.example .env
$ docker compose up -d --build
[+] Running 8/8  nginx  postgres  redis  kafka  rda  paa  prometheus  grafana`;

const REQUEST_CMD = `$ curl -X POST http://localhost/v1/predict \\
    -H 'Content-Type: application/json' \\
    -d '{
      "transaction_id":   "550e8400-e29b-41d4-a716-446655440000",
      "sender_id":        "user_a",
      "receiver_id":      "user_b",
      "amount":           300.00,
      "transaction_type": "TRANSFER",
      "timestamp":        1717718400000,
      "is_authenticated": true,
      "account_age_days": 900,
      "customer_type":    "INDIVIDUAL",
      "channel":          "MOBILE",
      "currency":         "NGN",
      "wallet_balance":   15250.75,
      "is_recurring":     false,
      "device_is_trusted": true,
      "device_type":      "ANDROID",
      "ip_is_vpn":        false,
      "ip_country":       "NG",
      "transaction_country": "NG",
      "destination_country": "NG",
      "session_to_txn_seconds": 42
    }'`;

const RESPONSE_JSON = `{
  "transaction_id":    "550e8400-…",
  "fraud":             false,
  "fraud_probability": 0.0773,
  "decision":          "ACCEPT",
  "decision_source":   "ML",
  "reason_codes": [
    { "code": "VELOCITY_1H",     "description": "Transactions in the last hour above baseline",       "contribution":  0.28, "value": 9 },
    { "code": "PAGERANK",        "description": "Network-centrality score from the transaction graph", "contribution": -0.20, "value": 0.35 },
    { "code": "CLUSTERING_COEF", "description": "How tightly the sender clusters with known peers",     "contribution":  0.11, "value": 0 }
  ],
  "model_version": "default",
  "threshold":     0.65,
  "audit_id":      "38fb28d2-…",
  "latency_ms":    9,
  "timestamp":     1717718400123
}`;

function CodeBlock({
  id,
  label,
  body,
  withCaret = false,
  copiedKey,
  onCopy,
}: {
  id: string;
  label: string;
  body: string;
  withCaret?: boolean;
  copiedKey: string | null;
  onCopy: (id: string, body: string) => void;
}) {
  return (
    <div className="rounded-md border border-stone-800 overflow-hidden">
      <div className="flex items-center justify-between bg-[#15120F] border-b border-stone-800 px-4 h-10">
        <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-stone-500">{label}</span>
        <button onClick={() => onCopy(id, body)} className="group inline-flex items-center gap-1.5 h-7 px-2.5 font-mono text-[11px] text-stone-500 hover:text-stone-100 rounded-sm transition-colors">
          <Copy size={14} {...ICON} className="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-px" /> {copiedKey === id ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="bg-[#0F0D0B] text-stone-200 font-mono text-[13px] leading-[22px] m-0 p-6 overflow-x-auto">
        <code>{body}</code>{withCaret && <span className="caret text-stone-200">&nbsp;</span>}
      </pre>
    </div>
  );
}

function Step({ n, title, note, children }: { n: string; title: string; note?: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-x-12 gap-y-5">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-label text-stone-600">Step {n}</div>
        <div className="mt-2 font-display font-semibold text-stone-50 text-[18.5px] leading-[1.3] tracking-tightest">{title}</div>
        {note && <p className="mt-2.5 text-[13.5px] leading-[22px] text-stone-500">{note}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function CodeSection() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = (key: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1200);
  };

  return (
    <section id="quickstart" className="scroll-mt-20 border-b border-stone-800">
      <Shell className="py-24">
        <Marker n="07">Quickstart</Marker>
        <h2 className="mt-7 font-display font-semibold text-stone-50 text-[clamp(28px,3.2vw,36px)] leading-[1.14] tracking-tightest max-w-[20ch]">
          Scoring a live transaction in three steps.
        </h2>
        <p className="mt-6 text-[16.5px] leading-[27px] text-stone-400 max-w-measure">
          One repo, one <span className="font-mono text-[14.5px] text-stone-200">docker compose up</span>, one POST.
          The response carries the decision, the probability, the model version,
          and the reason codes that drove the verdict — each with its feature
          contribution.
        </p>

        <div className="mt-14 flex flex-col gap-12">
          <Step n="1" title="Clone and boot the stack." note="Copy .env.example to .env first — RDA won't start without AUTH_JWT_SECRET. Brings up NGINX, Postgres, Redis, Kafka, and the always-on RDA and PAA agents. MLA and FIA are opt-in.">
            <CodeBlock id="shell" label="Shell" body={SHELL_CMD} withCaret copiedKey={copiedKey} onCopy={copy} />
          </Step>
          <Step n="2" title="POST a transaction." note="transaction_id, sender_id, receiver_id, amount, transaction_type, and timestamp (epoch ms) are required. Everything else is optional context — device, geography, identity, channel — and ~40 such fields sharpen the score when supplied. Pass transaction_id as Idempotency-Key for replay-safe POSTs.">
            <CodeBlock id="request" label="Request" body={REQUEST_CMD} copiedKey={copiedKey} onCopy={copy} />
          </Step>
          <Step n="3" title="Read the verdict and its lineage." note="decision is ACCEPT, REVIEW, or DECLINE. decision_source is ML, PRE_RULE, or POST_RULE. Each reason code carries its description, feature contribution, and observed value.">
            <CodeBlock id="response" label="Response · 200 OK" body={RESPONSE_JSON} copiedKey={copiedKey} onCopy={copy} />
          </Step>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-8 border-t border-stone-800">
          <p className="text-[13px] leading-[21px] text-stone-500 max-w-measure">
            <span className="font-mono text-[12.5px] text-stone-200">Sentinel</span> is a frontend, not a service — it isn’t in the compose file.
            Run it with <span className="font-mono text-[12.5px] text-stone-200">npm run dev</span> against the agents you just booted.
          </p>
          <p className="text-[13px] leading-[21px] text-stone-500 max-w-measure">
            <span className="font-mono text-[12.5px] text-stone-200">FIA</span> is opt-in via <span className="font-mono text-[12.5px] text-stone-200">docker compose --profile fia</span> —
            it pulls ~7.6GB of Phi-3 weights, which most quickstart runs don’t need.
          </p>
        </div>
      </Shell>
    </section>
  );
}

// ── 08 · Why this exists ──────────────────────────────────────────
function Differentiators() {
  const items: Array<[string, ReactNode]> = [
    ['Self-hosted, residency-friendly by construction.', 'Ojuri runs in your VPC, on your hardware, against your databases. Transaction data does not leave your boundary — not for scoring, not for training, not for investigation. That makes strict residency regimes such as GDPR, NDPR, and CBN tractable. Ojuri is not a compliance certification; it removes the egress that usually makes one hard to obtain.'],
    ['Every decision is traceable.', 'Verdict, model_version, threshold, feature snapshot, reason codes with contributions, audit_id, timestamp — every decision RDA emits lands in the audit table before the response returns. Lineage works backwards from a single verdict to the exact feature values the model saw at inference time. Nothing is opaque after the fact.'],
    ['Reviewer overrides close the label loop.', (
      <>
        In Sentinel, an analyst can override any verdict. The override writes back to <span className="font-mono text-[14.5px] text-stone-200">groundTruthFraud</span>, so the next training run learns from the analyst’s judgement — and the model does not learn from its own past decisions. The longer you run it, the better it judges your traffic.
      </>
    )],
    ['No vendor on the authorization path.', 'Open source under MIT. No SaaS dependency, no per-call fees, no rate limits, no vendor outage that takes your authorization offline. The agents you boot are the agents you run; the model registry is your model registry.'],
  ];
  return (
    <section id="why" className="scroll-mt-20 border-b border-stone-800">
      <Shell className="py-24">
        <Marker n="08">Why this exists</Marker>
        <h2 className="mt-7 font-display font-semibold text-stone-50 text-[clamp(28px,3.2vw,36px)] leading-[1.14] tracking-tightest max-w-[24ch]">
          The decisions you ship are auditable, not opaque.
        </h2>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-14">
          {items.map(([head, body]) => (
            <div key={head} className="max-w-measure">
              <h3 className="font-display font-semibold text-stone-50 text-[22px] leading-[1.26] tracking-tightest">{head}</h3>
              <p className="mt-4 text-[16px] leading-[27px] text-stone-400">{body}</p>
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
}

// ── 09 · Changelog ────────────────────────────────────────────────
interface Release {
  tag: string;
  date: string;
  state?: 'next' | 'current';
  head: string;
  body: string;
  points: string[];
  note?: string;
}

const RELEASES: Release[] = [
  {
    tag: 'Next', date: 'On the roadmap', state: 'next',
    head: 'Where we are headed',
    body: 'The core loop is proven. Next is making it easier to deploy at scale and to integrate with existing payment flows.',
    points: [
      'Canary traffic split by API-key cohort',
      'Helm chart and Terraform module for production deploys',
      'TypeScript and Python client SDKs',
    ],
  },
  {
    tag: 'v1.3.0', date: 'July 7, 2026', state: 'current',
    head: 'Measured, then hardened',
    body: 'An independent efficacy validation drove this release: correctness gaps between the platform and its own contracts are fixed, and new behavioral rules turn the graph and velocity signals into verdicts the model misses on trusted, authenticated traffic.',
    points: [
      'Behavioral rule pack — velocity spikes and fan-out sprays routed to review, guarded so mobile-money agents and payroll stay clean',
      'Fresh installs now register the shipped model and per-transaction-type thresholds out of the box',
      'Context-field dropout in training, plus a load-time probe that flags a model keying on integration context instead of behaviour',
      'Reworked Sentinel rule editor: catalogue-aware variable validation and a searchable, grouped variable picker',
    ],
    note: 'The behavioral rules lift velocity-anomaly recall from 0 to 0.80 in the validation harness — with zero added false positives on agent-network, payroll, airtime, and remittance traffic.',
  },
  {
    tag: 'v1.2.0', date: 'July 2, 2026',
    head: 'The learning loop closes',
    body: 'Fraud outcomes now flow back into the model. Chargebacks and disputes become training labels, the model retrains on verified outcomes, and detection improves per deployment.',
    points: [
      'Labels API — chargebacks, disputes, and reviewer overrides feed retraining',
      'Automatic retraining on verified labels, with temporal train/test splits',
      'A binding deployment gate: a new model ships only if it genuinely beats the current one',
      'Live shadow scoring and a REVIEW band that turns uncertainty into labels',
    ],
    note: 'Validated in a 128k-transaction benchmark: 34% of fraud caught cold → 98.8% after one label-driven retrain, at a 1.1% false-positive rate.',
  },
  {
    tag: 'v1.1.0', date: 'June 22, 2026',
    head: 'Hardening and adopter tooling',
    body: 'The first tagged release: durable graph state, richer rule and threshold defaults, and the tooling to bring your own data.',
    points: [
      'Durable transaction-graph state that survives restarts',
      'FATF rule pack, isotonic score calibration, configurable training modes',
      'Chunked training-data import so adopters can load their own history',
      'Per-segment threshold defaults and rule visibility in the audit log',
    ],
  },
  {
    tag: 'v1.0.0', date: 'June 7, 2026',
    head: 'The platform launches',
    body: 'Four cooperating agents, decoupled by Kafka: real-time scoring, off-path graph analysis, drift monitoring, and LLM investigations — self-hosted, MIT-licensed, one docker compose up.',
    points: [
      'Millisecond ONNX scoring on the authorization path',
      'Hot-reloaded rules engine, per-segment thresholds, decision audit log',
      'FIA investigation reports for blocked transactions, on a separate path',
      'Sentinel operator dashboard: live decisions, audit log, model registry',
    ],
  },
];

function Changelog() {
  return (
    <section id="changelog" className="scroll-mt-20 border-b border-stone-800">
      <Shell className="py-24">
        <Marker n="09">Changelog</Marker>
        <h2 className="mt-7 font-display font-semibold text-stone-50 text-[clamp(28px,3.2vw,36px)] leading-[1.14] tracking-tightest max-w-[18ch]">
          From launch to a closed learning loop.
        </h2>
        <p className="mt-6 max-w-measure text-[16.5px] leading-[27px] text-stone-400">
          Where we started, what has shipped, and where we are headed — every
          release tagged and reproducible.
        </p>

        <ol className="mt-16 relative border-l border-stone-800 ml-[5px]">
          {RELEASES.map((r) => (
            <li key={r.tag} className="relative pl-8 sm:pl-10 pb-14 last:pb-0">
              <span
                className={`absolute left-0 top-[6px] -translate-x-1/2 w-[11px] h-[11px] rounded-full border ${r.state === 'next' ? 'border-stone-600 bg-stone-900' : r.state === 'current' ? 'border-[#C4694F] bg-[#C4694F]' : 'border-stone-600 bg-stone-500'}`}
                aria-hidden="true"
              />
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className={`font-mono text-[13px] font-medium ${r.state === 'next' ? 'text-stone-300' : 'text-stone-100'}`}>{r.tag}</span>
                <span className="font-mono text-[10.5px] uppercase tracking-label text-stone-600">{r.date}</span>
                {r.state === 'current' && (
                  <span className="inline-flex items-center h-[19px] px-2 rounded-full bg-[#C4694F] font-mono text-[9.5px] uppercase tracking-label text-stone-50">Current</span>
                )}
              </div>
              <h3 className="mt-3 font-display font-semibold text-stone-50 text-[21px] leading-[1.28] tracking-tightest">{r.head}</h3>
              <p className="mt-3 max-w-measure text-[15.5px] leading-[26px] text-stone-400">{r.body}</p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {r.points.map((p) => (
                  <li key={p} className="grid grid-cols-[14px_1fr] gap-3 max-w-measure text-[14.5px] leading-[24px] text-stone-300">
                    <span className="mt-[11px] inline-block w-[7px] h-px bg-stone-600 self-start" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {r.note && (
                <p className="mt-5 max-w-measure border-l border-[#C4694F] pl-4 text-[14px] leading-[23px] text-stone-400">{r.note}</p>
              )}
            </li>
          ))}
        </ol>

        <a href="https://github.com/ojuri-io/ojuri/releases" className="group mt-14 inline-flex items-center gap-2 font-mono text-[12.5px] text-stone-400 hover:text-stone-100 no-underline transition-colors">
          Full changelog on GitHub <ArrowRight size={14} {...ICON} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </Shell>
    </section>
  );
}

function Disclosure() {
  return (
    <section className="border-b border-stone-800 bg-[#15120F]">
      <Shell className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-14 gap-y-8 items-baseline">
          <div className="md:col-span-4">
            <Marker n="—">Performance, honestly</Marker>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-stone-100 text-[22px] leading-[34px] max-w-measure">
              The numbers on this page — <span className="font-mono text-[18px] text-stone-50">p99 ≈ 6ms</span> server-side,
              <span className="font-mono text-[18px] text-stone-50"> ≈49µs</span> at the model — are
              reference values measured on a single Apple Silicon developer
              workstation. They are <em>not</em> SLA targets. Re-measure on your
              own hardware, with your own feature shape, before relying on them.
            </p>
            <p className="mt-6 text-[13.5px] leading-[22px] text-stone-500 max-w-measure">
              Failure mode is graceful. Circuit breakers around Redis and ONNX
              keep the path degrading instead of failing — predictions still
              succeed against default features when Redis is down. PAA, MLA, and
              FIA can each be unavailable without affecting authorization.
            </p>
            <p className="mt-4 text-[13.5px] leading-[22px] text-stone-500 max-w-measure">
              See <a href="https://github.com/ojuri-io/ojuri/blob/main/docs/ARCHITECTURE.md" className="underline decoration-stone-700 hover:decoration-stone-300">ARCHITECTURE.md</a> for
              the load-test method and the per-feature performance breakdown.
            </p>
          </div>
        </div>
      </Shell>
    </section>
  );
}

function Closing() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Honeypot: a visually hidden "website" field. Real users can't reach it,
    // so any value means a bot — show success but skip the POST.
    const honeypot = new FormData(e.currentTarget).get('website')?.toString() ?? '';
    if (honeypot) {
      setSent(true);
      return;
    }
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("That doesn't look like a valid email.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await submitEmailSignup(value);
    } catch {
      // no-cors swallows errors — treat as sent either way.
    }
    setSubmitting(false);
    setSent(true);
  };

  return (
    <section className="border-b border-stone-800">
      <Shell className="py-24">
        <Marker n="—">Ojuri — the seeing eye</Marker>
        <div className="mt-10">
          <Wordmark as="div" className="text-[clamp(80px,11vw,144px)] text-stone-50 leading-[0.95]" />
        </div>
        <p className="mt-8 max-w-measure font-display text-stone-100 text-[26px] leading-[36px] tracking-tightest">
          Bears witness to every transaction.
        </p>
        <p className="mt-5 max-w-measure text-[15.5px] leading-[26px] text-stone-500">
          Self-hosted, MIT-licensed, in your boundary. One repo, one
          <span className="font-mono text-[13.5px] text-stone-300"> docker compose up</span>, one POST.
        </p>

        <div className="mt-10 flex items-center gap-3 flex-wrap">
          <a href="https://github.com/ojuri-io/ojuri" data-umami-event="closing-github" className="group inline-flex items-center gap-2 h-11 px-5 bg-stone-100 text-stone-900 text-[14px] font-medium rounded-sm no-underline hover:bg-white transition-colors">
            <Github size={16} {...ICON} className="transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110" /> View on GitHub
          </a>
          <a href="https://github.com/ojuri-io/ojuri#readme" className="group inline-flex items-center gap-2 h-11 px-5 text-stone-200 text-[14px] font-medium rounded-sm no-underline border border-stone-700 hover:border-stone-500 transition-colors">
            Read the docs <ArrowRight size={16} {...ICON} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-20 pt-10 border-t border-stone-800 grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-6 items-start">
          <div className="md:col-span-5">
            <div className="font-display font-semibold text-stone-50 text-[19.5px] leading-[1.3] tracking-tightest">
              Running Ojuri at serious volume?
            </div>
            <p className="mt-2.5 text-[14.5px] leading-[24px] text-stone-500">
              Leave an address and you’ll hear about releases, and about paid
              support if and when it exists. Nothing else, and not often.
            </p>
          </div>
          <div className="md:col-span-7 md:pt-1">
            {sent ? (
              <p className="font-mono text-[12.5px] text-stone-300 min-h-11 flex items-center">
                Noted — {email}. Nothing else will arrive until there’s something worth sending.
              </p>
            ) : (
              <form onSubmit={submit} noValidate className="flex items-stretch gap-3 flex-wrap">
                <input
                  type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  className="hidden" onChange={() => {}}
                />
                <input
                  type="email" name="email" required value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
                  placeholder="you@company.com" aria-label="Email address"
                  aria-invalid={error ? true : undefined}
                  className="h-11 px-4 min-w-[250px] flex-1 bg-transparent border border-stone-700 rounded-sm text-[14px] text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-stone-400 transition-colors"
                />
                <button type="submit" disabled={submitting} className="group inline-flex items-center gap-2 h-11 px-5 bg-[#C4694F] text-stone-50 text-[14px] font-medium rounded-sm hover:bg-[#B35F46] disabled:opacity-60 transition-colors">
                  {submitting ? 'Sending…' : 'Keep me posted'} <ArrowRight size={16} {...ICON} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                {error && <p className="w-full font-mono text-[12px] text-[#C4694F]">{error}</p>}
              </form>
            )}
          </div>
        </div>
      </Shell>
    </section>
  );
}

function FooterCol({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div className="col-span-6 md:col-span-2">
      <div className="text-[11px] uppercase tracking-label font-medium text-stone-500 mb-4">{title}</div>
      <ul className="flex flex-col gap-2.5">
        {links.map(([label, href]) => (
          <li key={label}><a href={href} className="text-[13.5px] text-stone-400 hover:text-stone-100 no-underline transition-colors">{label}</a></li>
        ))}
      </ul>
    </div>
  );
}

function FooterB() {
  return (
    <footer>
      <Shell className="py-20">
        <div className="grid grid-cols-12 gap-y-10 gap-x-6 sm:gap-x-12">
          <div className="col-span-12 md:col-span-5">
            <Wordmark className="text-[27px] text-stone-50" as="div" />
            <p className="mt-3 font-mono text-[11.5px] leading-[19px] text-stone-600">
              <em>Ojuri</em> (Yoruba: <em>ojúrí</em>) — “the seeing eye.”<br />A witness to every transaction.
            </p>
          </div>
          <FooterCol title="Project" links={[
            ['Docs', 'https://github.com/ojuri-io/ojuri#readme'],
            ['GitHub', 'https://github.com/ojuri-io/ojuri'],
            ['Roadmap', 'https://github.com/ojuri-io/ojuri/blob/main/ROADMAP.md'],
          ]} />
          <FooterCol title="Operate" links={[
            ['Security', 'https://github.com/ojuri-io/ojuri/blob/main/SECURITY.md'],
            ['Architecture', 'https://github.com/ojuri-io/ojuri/blob/main/docs/ARCHITECTURE.md'],
            ['Releases', 'https://github.com/ojuri-io/ojuri/releases'],
          ]} />
          <FooterCol title="Community" links={[
            ['Contributing', 'https://github.com/ojuri-io/ojuri/blob/main/CONTRIBUTING.md'],
            ['Code of conduct', 'https://github.com/ojuri-io/ojuri/blob/main/CODE_OF_CONDUCT.md'],
            ['License (MIT)', 'https://github.com/ojuri-io/ojuri/blob/main/LICENSE'],
          ]} />
        </div>
        <div className="mt-20 pt-8 border-t border-stone-800 flex items-center justify-between gap-6 flex-wrap">
          <div className="font-mono text-[11.5px] text-stone-600">© 2026 Ojuri Contributors. MIT licensed.</div>
          <div className="font-mono text-[11.5px] text-stone-600">v1.3.0 · released July 7 2026</div>
        </div>
      </Shell>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export function LandingB() {
  const [active, setActive] = useState('top');

  // Ink-first page: paint the document surface dark for this route only, so
  // overscroll and the area outside the content column match. Restored on
  // unmount for the cream-themed /compare and /docs routes.
  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prev = { html: html.style.background, body: body.style.background };
    html.style.background = '#1A1612';
    body.style.background = '#1A1612';
    return () => {
      html.style.background = prev.html;
      body.style.background = prev.body;
    };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTIONS.forEach(([, , id]) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="font-sans bg-stone-900 text-stone-100 min-h-screen">
      <Rail active={active} />
      <TopBar />
      <main id="main" className="xl:pl-[228px]">
        <Hero />
        <ProofBar />
        <Dilemma />
        <WhatItDoes />
        <SentinelSection />
        <Handoff />
        <ArchitectureSection />
        <UnderTheHood />
        <CodeSection />
        <Differentiators />
        <Changelog />
        <Disclosure />
        <Closing />
        <FooterB />
      </main>
    </div>
  );
}
