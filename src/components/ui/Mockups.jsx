/**
 * Code-built SVG dashboard/product mockups (theme-aware via CSS vars).
 * Used instead of stock imagery until real product/project screenshots exist.
 * Swap any of these for <Image /> once approved assets are supplied.
 */
import "./Mockups.scss";

// Deterministic pseudo-random so SSR and client render identical markup
const rand = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return Math.round((x - Math.floor(x)) * 1e4) / 1e4;
};
const r2 = (n) => Math.round(n * 100) / 100;
const linePath = (n, w, h, seed, amp = 0.35) =>
  Array.from({ length: n }, (_, i) => {
    const x = (i / (n - 1)) * w;
    const y = h * (0.55 - Math.sin(i * 0.7 + seed) * amp * 0.5 - rand(seed + i) * amp * 0.6);
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

function Chrome({ title, children, className = "" }) {
  return (
    <div className={`mockup ${className}`}>
      <div className="mockup__bar">
        <span />
        <span />
        <span />
        <em>{title}</em>
      </div>
      <div className="mockup__body">{children}</div>
    </div>
  );
}

function NetworkGraph({ seed = 1, nodes = 18, w = 320, h = 180 }) {
  const pts = Array.from({ length: nodes }, (_, i) => [r2(20 + rand(seed + i) * (w - 40)), r2(16 + rand(seed + i * 3.1) * (h - 32))]);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mockup__svg" preserveAspectRatio="xMidYMid slice">
      {pts.map((a, i) =>
        pts.slice(i + 1, i + 3).map((b, j) => (
          <line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="mk-line" />
        ))
      )}
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i % 5 === 0 ? 5 : 2.6} className={i % 5 === 0 ? "mk-node mk-node--hot" : "mk-node"} />
      ))}
    </svg>
  );
}

function LineChart({ seed = 2, w = 320, h = 120, lime }) {
  const d = linePath(24, w, h, seed);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mockup__svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`mk-fill-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((y) => (
        <line key={y} x1="0" x2={w} y1={h * y} y2={h * y} className="mk-grid" />
      ))}
      <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#mk-fill-${seed})`} />
      <path d={d} className={lime ? "mk-stroke mk-stroke--lime" : "mk-stroke"} />
    </svg>
  );
}

function Bars({ seed = 3, n = 12 }) {
  return (
    <div className="mk-bars">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} style={{ height: `${Math.round(25 + rand(seed + i) * 75)}%` }} className={i === n - 3 ? "is-hot" : ""} />
      ))}
    </div>
  );
}

function Cluster({ seed = 4, n = 240, w = 320, h = 200 }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mockup__svg" preserveAspectRatio="xMidYMid slice">
      {Array.from({ length: n }, (_, i) => {
        const a = rand(seed + i) * Math.PI * 2;
        const r = Math.pow(rand(seed + i * 1.7), 0.6) * 80;
        const twist = Math.sin(a * 3) * 18;
        const x = r2(w / 2 + Math.cos(a) * (r + twist));
        const y = r2(h / 2 + Math.sin(a) * (r * 0.75 + twist * 0.5));
        return <rect key={i} x={x} y={y} width="2.6" height="2.6" className={i % 9 === 0 ? "mk-px mk-px--lime" : "mk-px"} />;
      })}
    </svg>
  );
}

function Radar() {
  return (
    <svg viewBox="0 0 200 200" className="mockup__svg mk-radar">
      {[90, 65, 40, 15].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} className="mk-ring" />
      ))}
      <line x1="100" y1="10" x2="100" y2="190" className="mk-grid" />
      <line x1="10" y1="100" x2="190" y2="100" className="mk-grid" />
      <path d="M100,100 L100,10 A90,90 0 0,1 178,55 Z" className="mk-sweep" />
      {[
        [140, 60],
        [70, 130],
        [120, 150],
        [55, 70],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" className={i === 0 ? "mk-node mk-node--lime" : "mk-node mk-node--hot"} />
      ))}
    </svg>
  );
}

const Kpi = ({ label, value, lime }) => (
  <div className="mk-kpi">
    <small>{label}</small>
    <strong className={lime ? "is-lime" : ""}>{value}</strong>
  </div>
);

// ---------------- Product mockups ----------------
export function ProductMockup({ variant }) {
  if (variant === "mesh")
    return (
      <Chrome title="veloce / live-stream" className="mockup--product">
        <div className="mk-row">
          <Kpi label="Events" value="Live" />
          <Kpi label="Channels" value="Multi" />
        </div>
        <LineChart seed={7} h={90} />
      </Chrome>
    );
  if (variant === "shield")
    return (
      <Chrome title="krypton / monitor" className="mockup--product">
        <div className="mk-split">
          <Radar />
          <div className="mk-list">
            <span className="is-ok">Access audit</span>
            <span className="is-ok">TLS check</span>
            <span className="is-warn">Review</span>
          </div>
        </div>
      </Chrome>
    );
  return (
    <Chrome title="core / model-graph" className="mockup--product">
      <NetworkGraph seed={3} nodes={14} h={110} />
      <Bars seed={5} n={14} />
    </Chrome>
  );
}

// ---------------- Project visuals (portfolio) ----------------
export function ProjectVisual({ variant }) {
  if (variant === "pay")
    return (
      <Chrome title="verdant-pay / treasury" className="mockup--project">
        <div className="mk-row">
          <Kpi label="Settlement" value="Realtime" />
          <Kpi label="Corridors" value="Global" />
          <Kpi label="Status" value="Healthy" lime />
        </div>
        <div className="mk-split mk-split--wide">
          <LineChart seed={11} h={150} />
          <div className="mk-stack">
            <Bars seed={13} n={9} />
            <Bars seed={17} n={9} />
          </div>
        </div>
      </Chrome>
    );
  if (variant === "genome")
    return (
      <Chrome title="synapse / molecule-view" className="mockup--project mockup--dark">
        <div className="mk-row">
          <Kpi label="Sequence" value="Chr-07" lime />
          <Kpi label="Render" value="WebGL" />
        </div>
        <Cluster seed={21} h={220} />
      </Chrome>
    );
  return (
    <Chrome title="aura-nexus / command" className="mockup--project">
      <div className="mk-split mk-split--side">
        <div className="mk-list mk-list--side">
          <span className="is-ok">Ingest</span>
          <span className="is-ok">Model</span>
          <span className="is-warn">Anomaly</span>
          <span>Report</span>
        </div>
        <div>
          <NetworkGraph seed={9} nodes={22} h={160} />
          <LineChart seed={4} h={70} />
        </div>
      </div>
    </Chrome>
  );
}
