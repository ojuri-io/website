/**
 * Architecture component data.
 *
 * Bullet strings use backtick syntax for inline mono identifiers:
 *   'Standard Redis 7. Run via `docker compose`.'
 * ComponentPanel parses backticks and renders them as <code> tags.
 */

export type ComponentId =
  | 'auth-request'
  | 'rda'
  | 'verdict'
  | 'kafka'
  | 'paa'
  | 'mla'
  | 'fia'
  | 'redis'
  | 'postgres'
  | 'sentinel';

export interface ArchitectureComponent {
  id: ComponentId;
  tag: string;       // small uppercase eyebrow
  name: string;      // serif headline
  role: string;      // one-line subtitle
  bullets: string[]; // 3–6 bullets, may contain `inline mono`
}

export const architectureComponents: ArchitectureComponent[] = [
  {
    id: 'auth-request',
    tag: 'AUTH REQUEST',
    name: 'Authorization Request',
    role: 'The synchronous entry point.',
    bullets: [
      'POST `/v1/predict` accepts the transaction payload plus an optional segment.',
      'Schema validated by Zod at the edge; malformed payloads return 400 before any feature lookup.',
      'Bearer-token authentication; per-vendor rate limits enforced upstream.',
      'Caller blocks on this request — verdict, reason codes, and audit ID arrive in the response body.',
      'Idempotent via the `Idempotency-Key` header — set it to your `transaction_id` and duplicate POSTs return the cached decision rather than re-scoring.',
    ],
  },
  {
    id: 'rda',
    tag: 'RDA',
    name: 'Real-Time Detection Agent',
    role: 'The only service on the authorization hot path.',
    bullets: [
      'Fastify service in TypeScript. PRE-rules → feature lookup → ONNX inference → POST-rules.',
      'Serves XGBoost via ONNX Runtime at p99 ≈ 49µs at the model.',
      'Per-segment thresholds; resolution order is segment override → model default → `FRAUD_THRESHOLD` env.',
      'Audit row written for every decision before the response returns — no async write-behind.',
      'Publishes to two Kafka topics: `transactions.completed` (all) and `transactions.blocked` (DECLINE only).',
      'Degrades gracefully: predictions still succeed against default features when Redis is unavailable.',
    ],
  },
  {
    id: 'verdict',
    tag: 'VERDICT',
    name: 'Response Shape',
    role: 'What the caller actually receives.',
    bullets: [
      'Decision is one of: ACCEPT, REVIEW, DECLINE.',
      'Source is one of: ML, RULE (PRE or POST), or DEFAULT (Redis-down fallback).',
      'Reason codes: top contributing features with their numeric contribution and observed value.',
      '`model_version` and `threshold` included so the caller knows which configuration produced the result.',
      '`audit_id` ties the response back to the immutable audit row in Postgres.',
      '`latency_ms` reports server-side processing time, excluding network.',
    ],
  },
  {
    id: 'kafka',
    tag: 'KAFKA',
    name: 'Event Bus',
    role: 'One bus, two topics, two paths.',
    bullets: [
      'Partitioned by `sender_id` and `transaction_id` for ordering and parallelism.',
      '`transactions.completed` — every decision, consumed by PAA and MLA.',
      '`transactions.blocked` — DECLINE only, consumed by FIA so the LLM never sees the bulk of traffic.',
      'Async workers can lag, restart, or fail without back-pressuring authorization.',
      'The audit row is written before the Kafka publish, so reconciliation works even if events are lost.',
    ],
  },
  {
    id: 'paa',
    tag: 'PAA',
    name: 'Pattern Analysis Agent',
    role: 'Graph and velocity features, off the hot path.',
    bullets: [
      'Consumes `transactions.completed` keyed by `sender_id`; processes the full stream asynchronously.',
      'Maintains rolling per-sender velocity windows (1h, 24h) and per-receiver pagerank approximations.',
      'Writes feature deltas back to Redis under predictable keys so RDA’s next prediction sees them.',
      'Surfaces emerging rings and shared-device clusters before any single transaction crosses threshold.',
      'Failure does not block authorization — RDA falls back to default features for any missing keys.',
    ],
  },
  {
    id: 'mla',
    tag: 'MLA',
    name: 'Model Learning Agent',
    role: 'Drift detection and supervised retraining.',
    bullets: [
      'Monitors F1 (poor performance) and PSI (feature distribution shift) over a rolling sample window.',
      'Triggers SMOTE-balanced XGBoost retraining when either signal crosses its configured threshold.',
      'Promotion gates: CANDIDATE → SHADOW → ACTIVE, each requiring explicit approval or auto-promote rules.',
      'McNemar significance check (p < 0.05) and ΔF1 ≥ 0.01 required before any promotion to ACTIVE.',
      'Replay CLI lets candidate models be re-scored against the live audit log without going to production.',
      'Learns from `groundTruthFraud` overrides, not from the model’s own past decisions.',
    ],
  },
  {
    id: 'fia',
    tag: 'FIA',
    name: 'Fraud Investigation Agent',
    role: 'LLM investigations on a separate Kafka path.',
    bullets: [
      'Consumes `transactions.blocked` — DECLINE only.',
      'Self-hosted Phi-3-mini-4k-instruct.',
      'Writes structured reports: verdict, recommended action, key indicators, narrative.',
      'Seconds latency; never touches the authorization path.',
      'Opt-in via `docker compose --profile fia` because of ~7.6 GB weights.',
    ],
  },
  {
    id: 'redis',
    tag: 'REDIS',
    name: 'Feature Cache',
    role: 'The fast lookup layer for hot-path features.',
    bullets: [
      'RDA reads feature keys here during prediction; PAA writes them after pattern analysis.',
      'Key pattern: `feature:{sender_id}:{feature_name}` with TTLs sized to each feature’s freshness budget.',
      'Also holds session state for Sentinel.',
      'Treated as a cache, not a source of truth — RDA degrades to defaults if a lookup misses or fails.',
      'Standard Redis 7. Not Ojuri code; run separately or via the bundled `docker compose`.',
    ],
  },
  {
    id: 'postgres',
    tag: 'POSTGRES',
    name: 'System of Record',
    role: 'Audit, transactions, reports, model registry.',
    bullets: [
      '`decisionAuditLog`: every prediction with features, model version, threshold, latency, verdict.',
      '`transactions`: the canonical transaction record once a decision is finalized.',
      '`fiaReports`: structured FIA investigation outputs linked to their audit row.',
      '`modelRegistry`: versioned model artifacts with status CANDIDATE / SHADOW / ACTIVE / RETIRED.',
      '`groundTruthFraud`: reviewer overrides — the supervised signal feeding the next training run.',
      'Standard Postgres 14. Not Ojuri code; schema lives in `/db/migrations`.',
    ],
  },
  {
    id: 'sentinel',
    tag: 'SENTINEL',
    name: 'Operator Dashboard',
    role: 'The human surface for the four agents.',
    bullets: [
      'React/Vite SPA. Reads via RDA `/v1/admin/*` and FIA `/v1/reports*` endpoints.',
      'Live decisions stream, review queue with SLA tracking, transaction detail with reason codes.',
      'Rule editor with visual, JSON, and examples modes; hot-reloads in seconds.',
      'Model registry view with Champion vs Shadow comparison and per-segment thresholds.',
      'Full RBAC; override authority gated by role.',
      'Runs separately via `npm run dev` — not in the `docker compose` because it’s a frontend, not a service.',
    ],
  },
];

export const findComponent = (id: ComponentId | null): ArchitectureComponent | null => {
  if (!id) return null;
  return architectureComponents.find((c) => c.id === id) ?? null;
};
