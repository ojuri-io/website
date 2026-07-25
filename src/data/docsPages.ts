import type { ComponentId } from './architectureComponents';

export interface DocSection {
  heading: string;
  body: string[];
}

export interface DocPageData {
  slug: string;
  agentId: ComponentId;
  eyebrow: string;
  h1: string;
  lede: string;
  sections: DocSection[];
}

export const docsPages: DocPageData[] = [
  {
    slug: 'rda',
    agentId: 'rda',
    eyebrow: 'RDA · Real-Time Detection Agent',
    h1: 'Real-time fraud detection on the authorization hot path',
    lede:
      'The Real-Time Detection Agent is the only Ojuri service that sits synchronously in front of a payment. It scores every transaction and returns an ACCEPT, REVIEW, or DECLINE verdict before the caller unblocks — no external API round-trip, no per-call fee.',
    sections: [
      {
        heading: 'ONNX-served XGBoost, scored in-process',
        body: [
          'RDA is a Fastify service written in TypeScript. Each request flows through a fixed pipeline: PRE-rules, feature lookup, ONNX inference, then POST-rules. The model is a gradient-boosted XGBoost classifier compiled to ONNX and served by ONNX Runtime in the same process.',
          'In the project’s reference benchmark — a single Apple Silicon developer workstation — that measures `p99 ≈ 49µs` at the model and single-digit milliseconds server-side end to end. These are reference values, not SLA targets; re-measure on your own hardware and feature shape before relying on them.',
          'Because inference runs in-process, there is no network hop to a third-party scoring API on the checkout path — authorization latency doesn’t depend on an external vendor’s data center, and transaction payloads never leave your own infrastructure.',
        ],
      },
      {
        heading: 'Deterministic thresholds and a full audit trail',
        body: [
          'Thresholds resolve in a fixed order: per-segment override, then model default, then the `FRAUD_THRESHOLD` environment variable. The response carries the reason codes — the top contributing features with their numeric contribution and observed value — plus `model_version` and `threshold`, so every decision is explainable and reproducible.',
          'An immutable audit row is written for every decision before the response returns; there is no async write-behind that could lose a record. RDA then publishes to two Kafka topics — `transactions.completed` for all decisions and `transactions.blocked` for declines only — which feed the asynchronous agents.',
        ],
      },
      {
        heading: 'Degrades without blocking authorization',
        body: [
          'Feature freshness comes from Redis, but RDA treats it as a cache, not a source of truth. If Redis is unavailable, predictions still succeed against default features rather than failing the transaction. Idempotency is handled with the `Idempotency-Key` header — set it to your `transaction_id` and duplicate POSTs return the cached decision instead of re-scoring.',
        ],
      },
    ],
  },
  {
    slug: 'paa',
    agentId: 'paa',
    eyebrow: 'PAA · Pattern Analysis Agent',
    h1: 'Velocity checks and fraud-ring detection, off the hot path',
    lede:
      'The Pattern Analysis Agent computes the behavioral and relationship features that a single transaction can’t reveal on its own — velocity windows, shared-device clusters, and emerging rings — entirely asynchronously, so none of it slows down authorization.',
    sections: [
      {
        heading: 'Rolling velocity and relationship features',
        body: [
          'PAA consumes the `transactions.completed` Kafka topic keyed by `sender_id` and processes the full stream in the background. It maintains rolling per-sender velocity windows (1h and 24h) and per-receiver pagerank approximations that surface accounts sitting at the center of suspicious flows.',
          'These signals catch fraud rings and shared-device clusters before any single transaction crosses the decision threshold — the kind of coordinated behavior that per-transaction rules miss because each individual payment looks ordinary.',
        ],
      },
      {
        heading: 'Feeding the hot path without coupling to it',
        body: [
          'PAA writes its computed feature deltas back to Redis under predictable keys, so RDA’s next prediction reads the updated behavioral context automatically. The two agents never call each other directly — they communicate only through the feature cache and the event bus.',
          'That decoupling is deliberate: if PAA lags, restarts, or fails, authorization is unaffected. RDA simply falls back to default values for any missing feature keys, so a pattern-analysis outage never blocks a payment.',
        ],
      },
    ],
  },
  {
    slug: 'mla',
    agentId: 'mla',
    eyebrow: 'MLA · Model Learning Agent',
    h1: 'Drift-aware retraining with shadow-to-active promotion gates',
    lede:
      'The Model Learning Agent keeps the fraud model honest as behavior shifts. It watches for performance decay and feature drift, retrains on real labels, and gates every promotion behind statistical checks — a closed loop that static rules engines don’t have.',
    sections: [
      {
        heading: 'Detecting drift before it costs you',
        body: [
          'MLA monitors two signals over a rolling sample window: F1 for degrading predictive performance, and PSI (Population Stability Index) for feature-distribution shift. When either crosses its configured threshold, it triggers a SMOTE-balanced XGBoost retraining run so the model relearns against the current fraud landscape rather than last quarter’s.',
          'Crucially, it learns from `groundTruthFraud` overrides — chargebacks, disputes, and reviewer decisions fed back through the Labels API — not from the model’s own past predictions. Training on your own outputs compounds error; training on ground truth corrects it.',
        ],
      },
      {
        heading: 'Nothing reaches production unproven',
        body: [
          'Every candidate model moves through explicit promotion gates: CANDIDATE → SHADOW → ACTIVE. Promotion to ACTIVE requires a McNemar significance check (`p < 0.05`) and a real improvement of `ΔF1 ≥ 0.01` — a new model has to be statistically better, not just newer.',
          'A replay CLI lets you re-score any candidate against the live audit log without touching production traffic, so you can see exactly how a model would have decided real historical transactions before it ever goes live.',
        ],
      },
    ],
  },
  {
    slug: 'fia',
    agentId: 'fia',
    eyebrow: 'FIA · Fraud Investigation Agent',
    h1: 'Explainable LLM fraud investigations, on a separate path',
    lede:
      'The Fraud Investigation Agent turns blocked transactions into plain-language case files a human analyst can act on. It runs a self-hosted language model on its own Kafka path, so it never touches — and never slows — the authorization flow.',
    sections: [
      {
        heading: 'Investigations only on declines',
        body: [
          'FIA consumes `transactions.blocked` — declines only. By design it never sees the bulk of legitimate traffic, which keeps the LLM workload small and focused on the cases that actually warrant investigation. Latency here is measured in seconds, and it is entirely off the authorization path.',
          'The model is a self-hosted Phi-3-mini-4k-instruct instance. Because it runs under your own roof, transaction details and PII never leave your network to reach a hosted LLM provider — which matters for data-residency obligations under regimes like NDPR, CBN, and GDPR.',
        ],
      },
      {
        heading: 'Structured reports analysts can trust',
        body: [
          'For each blocked transaction, FIA writes a structured report: a verdict, a recommended action, the key indicators that drove the decision, and a narrative that explains the case in ordinary language. Reports link back to their audit row, so an analyst can trace every claim to the underlying decision data.',
          'Because of the roughly 7.6 GB of model weights, FIA is opt-in via `docker compose --profile fia`. Run it when you want automated investigation summaries; leave it off and the rest of the platform is unaffected.',
        ],
      },
    ],
  },
];

export const findDocPage = (slug: string): DocPageData | undefined =>
  docsPages.find((p) => p.slug === slug);
