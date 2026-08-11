import { useState } from 'react';
import { ArrowRight, Copy } from 'lucide-react';
import { Marker, Shell } from './primitives';

const ICON = { strokeWidth: 1.5 } as const;

export const SANDBOX_URL = 'https://sandbox.ojuri.io';

// Named for the shape of the request, not for the verdict. The model and the
// active rule pack decide the outcome, and promising one in the label would
// make the demo a liar the first time a threshold moves.
type Scenario = {
  key: string;
  label: string;
  note: string;
  amount: number;
  body: Record<string, unknown>;
};

const SCENARIOS: Scenario[] = [
  {
    key: 'ordinary',
    label: 'Ordinary payment',
    note: 'Aged account, trusted device, domestic, authenticated. The shape most of your traffic has.',
    amount: 4500,
    body: {
      transaction_type: 'PAYMENT',
      is_authenticated: true,
      account_age_days: 900,
      customer_type: 'INDIVIDUAL',
      channel: 'MOBILE',
      currency: 'NGN',
      wallet_balance: 152500.75,
      is_recurring: false,
      device_is_trusted: true,
      device_type: 'ANDROID',
      ip_is_vpn: false,
      ip_country: 'NG',
      transaction_country: 'NG',
      destination_country: 'NG',
      session_to_txn_seconds: 42,
    },
  },
  {
    key: 'structuring',
    label: 'Structuring pattern',
    note: 'Amount sitting just below a reporting threshold, new receiver, fresh account. The FATF rule pack looks for exactly this.',
    amount: 950000,
    body: {
      transaction_type: 'TRANSFER',
      is_authenticated: true,
      account_age_days: 11,
      customer_type: 'INDIVIDUAL',
      channel: 'WEB',
      currency: 'NGN',
      wallet_balance: 1010000,
      is_recurring: false,
      device_is_trusted: false,
      device_type: 'WEB',
      ip_is_vpn: false,
      ip_country: 'NG',
      transaction_country: 'NG',
      destination_country: 'NG',
      session_to_txn_seconds: 9,
    },
  },
  {
    key: 'corridor',
    label: 'High-risk corridor',
    note: 'Cross-border transfer over a VPN from an untrusted device, seconds after login.',
    amount: 2750000,
    body: {
      transaction_type: 'TRANSFER',
      is_authenticated: true,
      account_age_days: 34,
      customer_type: 'INDIVIDUAL',
      channel: 'WEB',
      currency: 'NGN',
      wallet_balance: 3010000,
      is_recurring: false,
      device_is_trusted: false,
      device_type: 'WEB',
      ip_is_vpn: true,
      ip_country: 'RU',
      transaction_country: 'NG',
      destination_country: 'AE',
      session_to_txn_seconds: 4,
    },
  },
];

const RECORDED_REQUEST = `$ curl -X POST https://sandbox.ojuri.io/v1/predict \\
    -H 'X-Api-Key: fdk_9f2c_…' \\
    -d '{ …, "amount": 2750000, "transaction_type": "TRANSFER",
          "ip_is_vpn": true, "ip_country": "RU", "destination_country": "AE" }'`;

const RECORDED_RESPONSE = `{
  "decision":        "DECLINE",
  "decision_source": "PRE_RULE",
  "rule_hit":        "FATF_HIGH_RISK_CORRIDOR",
  "fraud_probability": 0.8412,
  "audit_id":        "38fb28d2-…",
  "latency_ms":      7
}`;

function Block({ label, body, onCopy, copied }: { label: string; body: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="rounded-md border border-stone-800 overflow-hidden">
      <div className="flex items-center justify-between bg-[#15120F] border-b border-stone-800 px-4 h-10">
        <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-stone-500">{label}</span>
        <button onClick={onCopy} className="group inline-flex items-center gap-1.5 h-7 px-2.5 font-mono text-[11px] text-stone-500 hover:text-stone-100 rounded-sm transition-colors">
          <Copy size={14} {...ICON} className="transition-transform duration-300 group-hover:scale-110" /> {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="bg-[#0F0D0B] text-stone-200 font-mono text-[13px] leading-[22px] m-0 p-6 overflow-x-auto">
        <code>{body}</code>
      </pre>
    </div>
  );
}

type Result =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'ok'; body: string }
  | { kind: 'asleep' }
  | { kind: 'error'; message: string };

export function SandboxSection() {
  const [apiKey, setApiKey] = useState('');
  const [scenario, setScenario] = useState(SCENARIOS[2]);
  const [amount, setAmount] = useState(String(SCENARIOS[2].amount));
  const [result, setResult] = useState<Result>({ kind: 'idle' });
  const [copied, setCopied] = useState<string | null>(null);

  function copy(id: string, body: string) {
    void navigator.clipboard?.writeText(body);
    setCopied(id);
    setTimeout(() => setCopied(null), 1600);
  }

  function pick(s: Scenario) {
    setScenario(s);
    setAmount(String(s.amount));
    setResult({ kind: 'idle' });
  }

  async function send() {
    const key = apiKey.trim();
    if (!key) {
      setResult({ kind: 'error', message: 'Paste an API key first — sign in as demo / try-ojuri and issue one from Integrations.' });
      return;
    }
    setResult({ kind: 'sending' });

    // A repeated transaction_id is treated as a replay and short-circuits to
    // 409 without running the model, so every send needs a fresh one or the
    // second click would measure the idempotency path instead of a decision.
    const payload = {
      transaction_id: crypto.randomUUID(),
      sender_id: 'demo_sender',
      receiver_id: 'demo_receiver',
      amount: Number(amount) || 0,
      timestamp: Date.now(),
      ...scenario.body,
    };

    try {
      const res = await fetch(`${SANDBOX_URL}/v1/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': key },
        body: JSON.stringify(payload),
      });

      if (res.status === 503) return setResult({ kind: 'asleep' });
      if (res.status === 401) return setResult({ kind: 'error', message: 'Key rejected. Paste the full fdk_… value, and check it has not been revoked.' });
      if (res.status === 429) return setResult({ kind: 'error', message: 'Rate limit reached for this key. Wait a minute and try again.' });

      const text = await res.text();
      if (!res.ok) return setResult({ kind: 'error', message: `${res.status} — ${text.slice(0, 200)}` });

      setResult({ kind: 'ok', body: JSON.stringify(JSON.parse(text), null, 2) });
    } catch {
      // A sleeping origin fails preflight before any status reaches us, so a
      // network-level failure is far more often "asleep" than "broken".
      setResult({ kind: 'asleep' });
    }
  }

  return (
    <section id="sandbox" className="scroll-mt-20 border-b border-stone-800">
      <Shell className="py-24">
        <Marker n="08">Try it live</Marker>
        <h2 className="mt-7 font-display font-semibold text-stone-50 text-[clamp(28px,3.2vw,36px)] leading-[1.14] tracking-tightest max-w-[22ch]">
          A running Ojuri you can POST to.
        </h2>
        <p className="mt-6 text-[16.5px] leading-[27px] text-stone-400 max-w-measure">
          Every agent — detection, pattern analysis, learning, investigation —
          and the operator dashboard, running together on one machine at{' '}
          <a href={SANDBOX_URL} target="_blank" rel="noopener noreferrer" className="text-stone-100 underline decoration-stone-600 underline-offset-4 hover:decoration-stone-300 transition-colors">sandbox.ojuri.io</a>.
          It stops itself when nobody is using it, so the first visit in a while
          shows a wake button and takes about three minutes to come up.
        </p>

        <div className="mt-8">
          <a
            href={SANDBOX_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 h-11 px-5 rounded-md bg-stone-100 text-stone-900 text-[14px] font-medium no-underline hover:bg-white transition-colors"
          >
            Open the sandbox
            <ArrowRight size={15} {...ICON} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="mt-16">
          <div className="font-mono text-[11px] uppercase tracking-label text-stone-600">When a rule decides instead</div>
          <p className="mt-2.5 text-[13.5px] leading-[22px] text-stone-500 max-w-measure">
            Quickstart above shows the model scoring a transaction and accepting
            it. Not every verdict works that way. Here a written rule matched
            first and decided on its own — the model was never consulted, which is
            what <span className="font-mono text-[12.5px] text-stone-300">decision_source: PRE_RULE</span>{' '}
            records. Abridged; the full response carries the same reason codes and
            lineage as the one above.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6">
            <Block label="Request" body={RECORDED_REQUEST} copied={copied === 'req'} onCopy={() => copy('req', RECORDED_REQUEST)} />
            <Block label="Response · 200 OK" body={RECORDED_RESPONSE} copied={copied === 'res'} onCopy={() => copy('res', RECORDED_RESPONSE)} />
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-stone-800">
          <div className="font-mono text-[11px] uppercase tracking-label text-stone-600">Now run it yourself</div>
          <p className="mt-2.5 text-[13.5px] leading-[22px] text-stone-500 max-w-measure">
            Sign in at <a href={SANDBOX_URL} target="_blank" rel="noopener noreferrer" className="text-stone-300 underline decoration-stone-700 underline-offset-4">sandbox.ojuri.io</a>{' '}
            with <span className="font-mono text-[12.5px] text-stone-300">demo</span> /{' '}
            <span className="font-mono text-[12.5px] text-stone-300">try-ojuri</span> — an account everyone shares. It can
            read the dashboard and issue API keys, but cannot change rules, thresholds
            or any decision, so nothing you do there affects the next visitor. Open{' '}
            <span className="font-mono text-[12.5px] text-stone-300">Integrations</span>, issue yourself an API key, and
            send a transaction below. The same{' '}
            <span className="font-mono text-[12.5px] text-stone-300">audit_id</span> appears in the dashboard under Live
            Decisions within a second or two.
          </p>
          <p className="mt-4 text-[13.5px] leading-[22px] text-stone-400 max-w-measure border-l-2 border-stone-700 pl-4">
            Send made-up data only. The account is shared, so every transaction you
            submit is visible in the audit log to anyone else signed in — and the
            whole environment is wiped without warning.
          </p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-x-12 gap-y-8">
            <div className="flex flex-col gap-6">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-label text-stone-600">API key</span>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="fdk_…"
                  className="h-10 px-3 rounded-md bg-[#0F0D0B] border border-stone-800 text-stone-200 font-mono text-[13px] placeholder:text-stone-700 focus:outline-none focus:border-stone-600"
                />
              </label>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-label text-stone-600">Scenario</span>
                <div className="flex flex-col gap-1.5">
                  {SCENARIOS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => pick(s)}
                      className={`text-left px-3 py-2.5 rounded-md border text-[13.5px] transition-colors ${
                        scenario.key === s.key
                          ? 'border-stone-600 bg-[#15120F] text-stone-100'
                          : 'border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[12.5px] leading-[20px] text-stone-600">{scenario.note}</p>
              </div>

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-label text-stone-600">Amount (NGN)</span>
                <input
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  className="h-10 px-3 rounded-md bg-[#0F0D0B] border border-stone-800 text-stone-200 font-mono text-[13px] focus:outline-none focus:border-stone-600"
                />
              </label>

              <button
                onClick={send}
                disabled={result.kind === 'sending'}
                className="h-11 px-5 rounded-md bg-stone-100 text-stone-900 text-[14px] font-medium hover:bg-white disabled:opacity-50 disabled:hover:bg-stone-100 transition-colors"
              >
                {result.kind === 'sending' ? 'Scoring…' : 'Send transaction'}
              </button>
            </div>

            <div className="min-w-0">
              {result.kind === 'idle' && (
                <div className="rounded-md border border-dashed border-stone-800 p-8 text-[13.5px] leading-[22px] text-stone-600">
                  The decision will appear here, with the reason codes that drove it.
                </div>
              )}
              {result.kind === 'sending' && (
                <div className="rounded-md border border-stone-800 p-8 text-[13.5px] text-stone-500">Scoring…</div>
              )}
              {result.kind === 'ok' && (
                <Block label="Response · 200 OK" body={result.body} copied={copied === 'live'} onCopy={() => copy('live', result.body)} />
              )}
              {result.kind === 'asleep' && (
                <div className="rounded-md border border-stone-800 p-8">
                  <div className="text-[14px] text-stone-200">The sandbox is asleep.</div>
                  <p className="mt-2 text-[13.5px] leading-[22px] text-stone-500">
                    It stops itself when idle. Open it, press the wake button, give it about three minutes, then send again.
                  </p>
                  <a href={SANDBOX_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-[13.5px] text-stone-200 underline decoration-stone-600 underline-offset-4">
                    Wake the sandbox <ArrowRight size={14} {...ICON} />
                  </a>
                </div>
              )}
              {result.kind === 'error' && (
                <div className="rounded-md border border-stone-800 p-8 text-[13.5px] leading-[22px] text-stone-400">{result.message}</div>
              )}
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
