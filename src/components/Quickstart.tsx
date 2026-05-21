import { Container } from './ui/Container';
import { Eyebrow } from './ui/Eyebrow';
import { CodeBlock } from './ui/CodeBlock';

const shellSnippet = `$ git clone https://github.com/ojuri-io/ojuri.git && cd ojuri
$ docker compose up -d
[+] Running 6/6  kafka  postgres  redis  rda  paa  mla

$ curl -X POST http://localhost:3000/v1/predict \\
    -H 'content-type: application/json' \\
    -d '{
      "transaction_id":   "550e8400-e29b-41d4-a716-446655440000",
      "sender_id":        "user_a",
      "receiver_id":      "user_b",
      "amount":           1500.00,
      "transaction_type": "TRANSFER",
      "timestamp":        1717718400,
      "segment":          "high_value"
    }'`;

const jsonSnippet = `{
  "transaction_id":    "550e8400-…",
  "fraud":             false,
  "fraud_probability": 0.1842,
  "decision":          "ACCEPT",
  "decision_source":   "ML",
  "reason_codes": [
    { "code": "AMOUNT_HIGH",  "description": "Transaction amount relative to typical range",       "contribution":  0.27, "value": 1500.0 },
    { "code": "VELOCITY_24H", "description": "Transactions in the last 24 hours above baseline",   "contribution": -0.05, "value": 4.0 }
  ],
  "model_version": "default",
  "threshold":     0.65,
  "audit_id":      "f3d7c0bc-…",
  "latency_ms":    3,
  "timestamp":     1717718400123
}`;

/** Quickstart — git clone, docker compose, curl. Tabbed code block. */
export function Quickstart() {
  return (
    <section className="border-b border-stone-300/70">
      <Container className="py-20 sm:py-28">
        <Eyebrow className="mb-4">Quickstart</Eyebrow>
        <h2 className="font-display font-semibold text-stone-900 text-[28px] sm:text-[34px] leading-[1.15] tracking-tightest max-w-[20ch]">
          Try it in thirty seconds.
        </h2>
        <p className="mt-6 text-[17px] sm:text-[18px] leading-[1.55] text-stone-700 max-w-measure">
          One repo, one <span className="font-mono text-[16px]">docker compose up</span>,
          one POST. The response carries the decision, the fraud probability,
          the model version, and the reason codes that drove the verdict — each
          with its feature contribution.
        </p>

        <CodeBlock
          className="mt-12"
          caretTabId="shell"
          tabs={[
            { id: 'shell', label: 'shell',                content: shellSnippet },
            { id: 'json',  label: 'response · 200 OK',    content: jsonSnippet  },
          ]}
        />

        <p className="mt-4 text-[13px] text-stone-500 font-mono">
          FIA is opt-in via <span className="text-stone-700">docker compose --profile fia</span>{' '}
          because it pulls ~7.6&nbsp;GB of Phi-3 weights.
        </p>
      </Container>
    </section>
  );
}
