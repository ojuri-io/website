import type { ComponentId } from '../data/architectureComponents';

interface DiagramProps {
  selected: ComponentId | null;
  onToggle: (id: ComponentId) => void;
}

const ink    = '#1A1612';
const stone2 = '#F0EBE2';
const stone3 = '#D9D2C6';
const stone5 = '#857E72';
const stone6 = '#5C564C';
const stone7 = '#3F3A33';

interface BoxProps {
  id: ComponentId;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  mono?: boolean;
  dashed?: boolean;
  emphasis?: boolean;
  agent?: boolean;
  selected: ComponentId | null;
  onToggle: (id: ComponentId) => void;
}

/**
 * Single interactive box. Selected box gets a stone-200 backplate.
 * RDA keeps its emphasized 2px ink stroke. Agent boxes (RDA, PAA,
 * MLA, FIA) get a small ink-filled dot at the top-left so the four
 * agents read as a visual group.
 */
function Box({
  id, x, y, w, h, label, sub, mono = false, dashed = false,
  emphasis = false, agent = false, selected, onToggle,
}: BoxProps) {
  const isSelected = selected === id;
  return (
    <g onClick={() => onToggle(id)} style={{ cursor: 'pointer' }} tabIndex={0}
       onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(id); } }}
       role="button" aria-label={`${label} — open details`}>
      <rect
        x={x} y={y} width={w} height={h}
        rx={2} ry={2}
        fill={isSelected ? stone2 : 'transparent'}
        stroke={emphasis ? ink : stone7}
        strokeWidth={emphasis ? 2 : 1.5}
        strokeDasharray={dashed ? '4 4' : undefined}
        className={emphasis ? 'arch-pulse' : undefined}
        style={{ transition: 'fill 160ms ease' }}
      />
      {agent && (
        <circle
          cx={x + 11} cy={y + 11} r={2.5} fill={ink}
          style={{ pointerEvents: 'none' }}
        />
      )}
      <text
        x={x + w / 2} y={y + h / 2 + (sub ? -4 : 5)}
        textAnchor="middle"
        fontFamily={mono ? '"JetBrains Mono", monospace' : '"Source Serif 4", Georgia, serif'}
        fontWeight={mono ? 500 : 600}
        fontSize={mono ? 13 : 18}
        fill={ink}
        letterSpacing={mono ? 0 : -0.2}
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2} y={y + h / 2 + 14}
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight={400}
          fontSize={11}
          fill={stone6}
          style={{ pointerEvents: 'none' }}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Marker({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
    </marker>
  );
}

interface PacketProps {
  d: string;
  dur?: number;
  delay?: number;
  color?: string;
  r?: number;
}

function Packet({ d, dur = 3, delay = 0, color = ink, r = 3.5 }: PacketProps) {
  // Cast to allow CSS custom properties on inline style.
  const style = {
    '--mp': `path('${d}')`,
    '--dur': `${dur}s`,
    '--delay': `${delay}s`,
    pointerEvents: 'none',
  } as React.CSSProperties;
  return (
    <g className="arch-packet" style={style}>
      <circle r={r} fill={color} />
    </g>
  );
}

// Packet paths
const hotPath     = 'M 190 85 L 296 85 L 500 85 L 606 85';
const dropToKafka = 'M 400 124 L 400 175';
const kafkaToPaa  = 'M 130 235 L 130 290';
const kafkaToMla  = 'M 400 235 L 400 290';
const kafkaToFia  = 'M 670 235 L 670 290';
const paaToPg     = 'M 130 370 L 130 400 L 510 400 L 510 420';
const mlaToPg     = 'M 400 370 L 400 400 L 530 400 L 530 420';
const fiaToPg     = 'M 670 370 L 670 400 L 550 400 L 550 420';
const pgToSen     = 'M 550 490 L 550 540';

export function ArchitectureDiagram({ selected, onToggle }: DiagramProps) {
  // On narrow viewports, allow horizontal scroll inside a fixed container
  // rather than letting the SVG squash beyond legibility.
  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
      <svg
        viewBox="0 0 1100 660"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Ojuri architecture: four agents decoupled by Kafka. RDA (Real-Time Detection) is the only service on the authorization hot path. PAA (Pattern Analysis), MLA (Model Learning), and FIA (Fraud Investigation) run asynchronously. Redis is RDA's feature cache. The Sentinel dashboard reads via RDA admin and FIA report endpoints."
        className="w-full h-auto arch-svg"
        style={{ minWidth: 600 }}
      >
        <defs>
          <Marker id="ar-ink"    color={ink} />
          <Marker id="ar-stone7" color={stone7} />
          <Marker id="ar-stone5" color={stone5} />
        </defs>

        {/* Row 1 — Hot path */}
        <text x={20} y={26} fontFamily="Inter, sans-serif" fontSize={11} fontWeight={500} letterSpacing={1} fill={stone5}>
          AUTHORIZATION HOT PATH · SYNCHRONOUS
        </text>

        <Box id="auth-request" x={20}  y={50} w={170} h={70} label="Auth request" sub="POST /v1/predict" mono selected={selected} onToggle={onToggle} />
        <Box id="rda"          x={300} y={40} w={200} h={84} label="RDA" sub="Real-time detection" emphasis agent selected={selected} onToggle={onToggle} />
        <Box id="verdict"      x={610} y={50} w={200} h={70} label="Verdict + reasons" sub="allow · decline · review" mono selected={selected} onToggle={onToggle} />

        <line x1={190} y1={85} x2={296} y2={85} stroke={ink} strokeWidth={1.5} markerEnd="url(#ar-ink)" />
        <line x1={500} y1={85} x2={606} y2={85} stroke={ink} strokeWidth={1.5} markerEnd="url(#ar-ink)" />
        <text x={553} y={73} textAnchor="middle" fontFamily='"JetBrains Mono", monospace' fontSize={11} fill={stone6}>
          p99 ≈ 6ms
        </text>

        {/* RDA → Kafka */}
        <line x1={400} y1={124} x2={400} y2={175} stroke={stone7} strokeWidth={1.5} markerEnd="url(#ar-stone7)" />

        {/* RDA ↔ Redis — marching dashes */}
        <path
          d="M 500 40 L 500 14 L 905 14 L 905 290"
          fill="none"
          stroke={stone5}
          strokeWidth={1}
          strokeDasharray="3 3"
          markerEnd="url(#ar-stone5)"
          className="arch-dashed"
          style={{ pointerEvents: 'none' }}
        />
        <text x={700} y={29} textAnchor="middle" fontFamily="Inter, sans-serif" fontStyle="italic" fontSize={11} fill={stone6}>
          feature lookup
        </text>

        {/* Row 2 — Kafka */}
        <g
          onClick={() => onToggle('kafka')}
          style={{ cursor: 'pointer' }}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle('kafka'); } }}
          role="button"
          aria-label="Kafka — open details"
        >
          <rect
            x={20} y={175} width={1060} height={60} rx={2}
            fill={selected === 'kafka' ? '#2A2620' : ink}
            style={{ transition: 'fill 160ms ease' }}
          />
          <text x={42} y={205} fontFamily='"Source Serif 4", Georgia, serif' fontSize={18} fontWeight={600} fill="#FAF6F0" style={{ pointerEvents: 'none' }}>Kafka</text>
          <text x={42} y={223} fontFamily="Inter, sans-serif" fontSize={11} fill="#B0A89B" style={{ pointerEvents: 'none' }}>event bus · partitioned by sender_id / transaction_id</text>
          <text x={1058} y={205} textAnchor="end" fontFamily='"JetBrains Mono", monospace' fontSize={12} fill="#D9D2C6" style={{ pointerEvents: 'none' }}>transactions.completed</text>
          <text x={1058} y={223} textAnchor="end" fontFamily='"JetBrains Mono", monospace' fontSize={12} fill="#857E72" style={{ pointerEvents: 'none' }}>transactions.blocked · DECLINE only</text>
        </g>

        {/* Kafka → async agents */}
        <line x1={130} y1={235} x2={130} y2={290} stroke={stone7} strokeWidth={1.5} markerEnd="url(#ar-stone7)" />
        <line x1={400} y1={235} x2={400} y2={290} stroke={stone7} strokeWidth={1.5} markerEnd="url(#ar-stone7)" />
        <line x1={670} y1={235} x2={670} y2={290} stroke={stone7} strokeWidth={1.5} markerEnd="url(#ar-stone7)" />

        {/* Row 3 — async agents */}
        <text x={20} y={278} fontFamily="Inter, sans-serif" fontSize={11} fontWeight={500} letterSpacing={1} fill={stone5}>
          ASYNCHRONOUS WORKERS · OFF THE HOT PATH
        </text>

        <Box id="paa"   x={45}  y={290} w={170} h={80} label="PAA" sub="Pattern analysis" agent selected={selected} onToggle={onToggle} />
        <Box id="mla"   x={315} y={290} w={170} h={80} label="MLA" sub="Model learning" agent selected={selected} onToggle={onToggle} />
        <Box id="fia"   x={585} y={290} w={170} h={80} label="FIA" sub="Fraud investigation" agent selected={selected} onToggle={onToggle} />
        <Box id="redis" x={820} y={290} w={170} h={80} label="Redis" sub="feature cache · sessions" mono dashed selected={selected} onToggle={onToggle} />

        {/* Async → Postgres */}
        <line x1={130} y1={370} x2={130} y2={400} stroke={stone5} strokeWidth={1.5} />
        <line x1={130} y1={400} x2={510} y2={400} stroke={stone5} strokeWidth={1.5} />
        <line x1={510} y1={400} x2={510} y2={420} stroke={stone5} strokeWidth={1.5} markerEnd="url(#ar-stone5)" />
        <line x1={400} y1={370} x2={400} y2={400} stroke={stone5} strokeWidth={1.5} />
        <line x1={400} y1={400} x2={530} y2={400} stroke={stone5} strokeWidth={1.5} />
        <line x1={530} y1={400} x2={530} y2={420} stroke={stone5} strokeWidth={1.5} markerEnd="url(#ar-stone5)" />
        <line x1={670} y1={370} x2={670} y2={400} stroke={stone5} strokeWidth={1.5} />
        <line x1={670} y1={400} x2={550} y2={400} stroke={stone5} strokeWidth={1.5} />
        <line x1={550} y1={400} x2={550} y2={420} stroke={stone5} strokeWidth={1.5} markerEnd="url(#ar-stone5)" />

        <text x={415} y={415} textAnchor="end" fontFamily="Inter, sans-serif" fontStyle="italic" fontSize={11} fill={stone6}>
          write transactions · reports · model versions
        </text>

        {/* Row 4 — Postgres */}
        <Box id="postgres" x={400} y={420} w={300} h={70} label="Postgres" sub="audit · transactions · reports · registry" mono dashed selected={selected} onToggle={onToggle} />

        {/* Postgres → Sentinel */}
        <line x1={550} y1={490} x2={550} y2={540} stroke={stone7} strokeWidth={1.5} markerEnd="url(#ar-stone7)" />
        <text x={560} y={519} fontFamily="Inter, sans-serif" fontStyle="italic" fontSize={11} fill={stone6}>
          via RDA /v1/admin/* + FIA /v1/reports*
        </text>

        {/* Row 5 — Sentinel */}
        <Box id="sentinel" x={380} y={540} w={340} h={70} label="Sentinel" sub="operator dashboard" selected={selected} onToggle={onToggle} />

        {/* Footer rule */}
        <line x1={20} y1={640} x2={1080} y2={640} stroke={stone3} strokeWidth={1} />

        {/* Animated packets (drawn last; non-interactive) */}
        <Packet d={hotPath} dur={3.2} delay={0}   color={ink} />
        <Packet d={hotPath} dur={3.2} delay={1.0} color={ink} />
        <Packet d={hotPath} dur={3.2} delay={2.1} color={ink} />
        <Packet d={dropToKafka} dur={1.4} delay={0.4} color={stone7} r={3} />
        <Packet d={dropToKafka} dur={1.4} delay={1.6} color={stone7} r={3} />
        <Packet d={dropToKafka} dur={1.4} delay={2.7} color={stone7} r={3} />
        <Packet d={kafkaToPaa} dur={1.6} delay={0.2} color={stone7} r={3} />
        <Packet d={kafkaToMla} dur={1.6} delay={0.9} color={stone7} r={3} />
        <Packet d={kafkaToFia} dur={1.6} delay={1.5} color={stone7} r={3} />
        <Packet d={paaToPg} dur={3.8} delay={0.6} color={stone5} r={2.5} />
        <Packet d={mlaToPg} dur={3.8} delay={1.4} color={stone5} r={2.5} />
        <Packet d={fiaToPg} dur={3.8} delay={2.2} color={stone5} r={2.5} />
        <Packet d={pgToSen} dur={2.4} delay={1.2} color={stone7} r={3} />
      </svg>
    </div>
  );
}
