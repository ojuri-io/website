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
  },
  {
    version: 'v1.4.0',
    date: 'August 9, 2026',
    title: 'Every line reviewed',
    summary:
      'We reviewed the entire platform line by line and fixed all 45 issues we found, verifying each fix on a running system. The release also adds an optional stronger audit mode: every decision is permanently recorded before the customer gets an answer, so no record is ever lost — even if a server crashes mid-request.',
    highlights: [
      'If the scoring engine fails, transactions go to human review instead of being declined — a customer is never rejected because of an internal outage',
      'Removing someone’s access or changing their role now takes effect immediately, not at their next login',
      'Choose how many detection servers to run with a single setting — no config surgery to scale up',
      'More trustworthy scores and safer operations: calibrated probabilities now reach serving, and the graph service protects itself from being run twice by mistake',
    ],
    metric:
      'Verified under load after the fixes: 2,000 requests, every single one succeeded, and 99 out of 100 answered within 85 ms — down from 295 ms before.',
  },
  {
    version: 'v1.5.0',
    date: 'August 11, 2026',
    title: 'Run it without installing it',
    summary:
      'A one-command deployment that puts a complete Ojuri on a single cloud machine, behind HTTPS, and stops itself when nobody is using it. Standing it up surfaced three faults that made services unrunnable rather than merely awkward — each is fixed, and each was verified on the running system rather than in a test.',
    highlights: [
      'A public sandbox you can sign into and POST to, which sleeps when idle and wakes from a button on the page',
      'The operator dashboard can finally be served from the shipped stack — it had a published image but nothing wired to run it',
      'Production mode starts: the detection agent refused to boot because a required setting never reached it',
      'The learning agent runs on current servers again, and investigation follow-ups answer the question asked instead of inventing their own',
    ],
    metric:
      'Follow-up answers went from 248 seconds and four invented questions to 67 seconds and a straight answer — the model had been generating text nobody would read.',
  },
  {
    version: 'v1.5.1',
    date: 'August 11, 2026',
    title: 'Fixes found by running it',
    summary:
      'Standing the public sandbox up exercised paths that unit tests do not, and turned up five faults — two of which made a feature look like it worked while doing nothing at all. All are fixed and verified against the running environment.',
    highlights: [
      'API keys are saved. The dashboard showed you a key and quietly discarded it, so every request made with one was rejected',
      'The API stays reachable after a restart — the proxy kept sending requests to an address the detection agent no longer had',
      'A server that is merely unreachable no longer reports itself as misconfigured, which sent operators to change a setting that was already correct',
      'A self-stopping deployment now really does stop itself; the timers were being skipped whenever the stack failed to start',
    ],
    metric:
      'Verified end to end on the live sandbox: sign in, issue a key, score a transaction, and read the decision back with its rule and audit trail.',
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

/**
 * The shipped version, taken from whichever release is marked current.
 * Hardcoding it beside each mention meant a release could update two of three
 * and leave the hero announcing an older one, which is exactly what happened
 * with v1.4.
 */
export const CURRENT_RELEASE =
  RELEASES.find((r) => r.current) ?? RELEASES[RELEASES.length - 1];

export const CURRENT_VERSION = CURRENT_RELEASE.version;

/** Marketing shorthand: v1.5.1 -> v1.5 */
export const CURRENT_VERSION_SHORT = CURRENT_VERSION.split('.').slice(0, 2).join('.');
