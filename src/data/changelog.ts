import type { ReactNode } from 'react';

export interface Release {
  version: string;
  date: string;
  /** Short thematic title for the release. */
  title: string;
  /** One-line framing of what the release was about. */
  summary: ReactNode;
  /** Concrete highlights — kept short and skimmable. */
  highlights: string[];
  /** Optional metric line rendered with emphasis. */
  metric?: string;
  /** Marks the release as the current head. */
  current?: boolean;
  /** Marks a forward-looking, not-yet-shipped entry. */
  upcoming?: boolean;
}

export const RELEASES: Release[] = [
  {
    version: 'v1.0.0',
    date: 'June 7, 2026',
    title: 'The platform launches',
    summary:
      'Four cooperating agents, decoupled by Kafka: real-time scoring, off-path graph analysis, drift monitoring, and LLM investigations — self-hosted, MIT-licensed, one docker compose up.',
    highlights: [
      'Millisecond ONNX scoring on the authorization path',
      'Hot-reloaded rules engine, per-segment thresholds, decision audit log',
      'FIA investigation reports for blocked transactions, on a separate path',
      'Sentinel operator dashboard: live decisions, audit log, model registry',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'June 22, 2026',
    title: 'Hardening and adopter tooling',
    summary:
      'The first tagged release: durable graph state, richer rule and threshold defaults, and the tooling to bring your own data.',
    highlights: [
      'Durable transaction-graph state that survives restarts',
      'FATF rule pack, isotonic score calibration, configurable training modes',
      'Chunked training-data import so adopters can load their own history',
      'Per-segment threshold defaults and rule visibility in the audit log',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'July 2, 2026',
    title: 'The learning loop closes',
    summary:
      'Fraud outcomes now flow back into the model. Chargebacks and disputes become training labels, the model retrains on verified outcomes, and detection improves per deployment.',
    highlights: [
      'Labels API — chargebacks, disputes, and reviewer overrides feed retraining',
      'Automatic retraining on verified labels, with temporal train/test splits',
      'A binding deployment gate: a new model ships only if it genuinely beats the current one',
      'Live shadow scoring and a REVIEW band that turns uncertainty into labels',
    ],
    metric:
      'Validated in a 128k-transaction benchmark: 34% of fraud caught cold → 98.8% after one label-driven retrain, at a 1.1% false-positive rate.',
  },
  {
    version: 'v1.3.0',
    date: 'July 7, 2026',
    title: 'Measured, then hardened',
    summary:
      'An independent efficacy validation drove this release: correctness gaps between the platform and its own contracts are fixed, and new behavioral rules turn the graph and velocity signals into verdicts the model misses on trusted, authenticated traffic.',
    highlights: [
      'Behavioral rule pack — velocity spikes and fan-out sprays routed to review, guarded so mobile-money agents and payroll stay clean',
      'Fresh installs now register the shipped model and per-transaction-type thresholds out of the box',
      'Context-field dropout in training, plus a load-time probe that flags a model keying on integration context instead of behaviour',
      'Reworked Sentinel rule editor: catalogue-aware variable validation and a searchable, grouped variable picker',
    ],
    metric:
      'The behavioral rules lift velocity-anomaly recall from 0 to 0.80 in the validation harness — with zero added false positives on agent-network, payroll, airtime, and remittance traffic.',
    current: true,
  },
  {
    version: 'Next',
    date: 'On the roadmap',
    title: 'Where we are headed',
    summary:
      'The core loop is proven. Next is making it easier to deploy at scale and to integrate with existing payment flows.',
    highlights: [
      'Canary traffic split by API-key cohort',
      'Helm chart and Terraform module for production deploys',
      'TypeScript and Python client SDKs',
    ],
    upcoming: true,
  },
];
