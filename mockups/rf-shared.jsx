// Resilience Facility — shared components (map, gauges, lifecycle strip)

// Sector dot — telecom / power / joint
const SectorDot = ({ sector }) => {
  const c = sector === "telecom" ? "#7aa5ff" : sector === "power" ? "#f5b941" : "var(--accent)";
  return <span style={{ width: 8, height: 8, borderRadius: 2, display: "inline-block", background: c, flexShrink: 0 }} />;
};

// Phase-aware status chip
const PhaseChip = ({ phase }) => {
  const m = PHASE_META[phase];
  return <span className={cls("chip", m.chipClass)}>{m.chip}</span>;
};

// Lifecycle strip — Issuance → Monitoring → Trigger → Payout → Reporting
const LifecycleStrip = ({ phase }) => {
  const stages = ["Issuance", "Monitoring", "Trigger", "Payout", "Reporting"];
  // active index per phase
  const activeIdx = phase === "calm" ? 1 : phase === "event" ? 2 : 3;
  const doneIdx = phase === "calm" ? 0 : phase === "event" ? 1 : 2;
  return (
    <div className="row-flex" style={{ gap: 0, width: "100%" }}>
      {stages.map((s, i) => {
        const state = i <= doneIdx ? "done" : i === activeIdx ? "active" : "idle";
        const color = state === "done" ? "var(--ink-3)" : state === "active" ? "var(--accent)" : "var(--ink-4)";
        return (
          <div key={s} className="row-flex" style={{ flex: i < stages.length - 1 ? 1 : "0 0 auto", gap: 8 }}>
            <div className="row-flex gap-8" style={{ flexShrink: 0 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: state === "idle" ? "transparent" : color,
                border: `1.5px solid ${color}`,
                boxShadow: state === "active" ? "0 0 8px var(--accent-glow)" : "none",
              }} />
              <span className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: state === "active" ? "var(--ink-0)" : "var(--ink-3)" }}>{s}</span>
            </div>
            {i < stages.length - 1 && <div style={{ flex: 1, height: 1, background: i < activeIdx ? "var(--line-3)" : "var(--line-1)", margin: "0 12px" }} />}
          </div>
        );
      })}
    </div>
  );
};

// Tier gauge — horizontal scale with tier markers and current value
const TierGauge = ({ label, value, max, tiers, unit, color = "var(--accent)" }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 6 }}>
        <span className="label">{label}</span>
        <span className="num" style={{ fontSize: 13, color: "var(--ink-0)" }}>{value} <span style={{ color: "var(--ink-3)", fontSize: 10 }}>{unit}</span></span>
      </div>
      <div style={{ position: "relative", height: 6, background: "var(--bg-3)", borderRadius: 3, overflow: "visible" }}>
        <span style={{ position: "absolute", inset: 0, width: pct + "%", background: color, borderRadius: 3, transition: "width 0.5s ease-out" }} />
        {tiers.map((t, i) => {
          const tx = (t.at / max) * 100;
          const met = value >= t.at;
          return (
            <span key={i} style={{ position: "absolute", left: tx + "%", top: -3, bottom: -3, width: 1.5, background: met ? "var(--danger)" : "var(--line-3)" }} title={t.label} />
          );
        })}
      </div>
      <div style={{ position: "relative", height: 14, marginTop: 4 }}>
        {tiers.map((t, i) => {
          const tx = (t.at / max) * 100;
          const met = value >= t.at;
          return (
            <span key={i} className="mono" style={{ position: "absolute", left: tx + "%", transform: "translateX(-50%)", fontSize: 9, color: met ? "var(--danger)" : "var(--ink-3)", whiteSpace: "nowrap" }}>{t.label}</span>
          );
        })}
      </div>
    </div>
  );
};

// Sri Lanka map with operator assets, hazard overlay + cyclone track
// viewBox 0 0 480 440 — island occupies left half; ocean to the east for storm track
const LANKA_PATH = "M 70 17 L 92 34 L 90 65 L 130 73 L 152 105 L 170 143 L 196 185 L 220 228 L 232 270 L 235 315 L 210 360 L 162 388 L 110 408 L 72 397 L 48 350 L 35 307 L 34 280 L 25 197 L 33 150 L 40 102 L 40 55 L 55 25 Z";

const CITY_MARKS = [
  { name: "Jaffna", x: 62, y: 36 },
  { name: "Trincomalee", x: 168, y: 148 },
  { name: "Batticaloa", x: 216, y: 232 },
  { name: "Kandy", x: 116, y: 272 },
  { name: "Colombo", x: 42, y: 305 },
  { name: "Hambantota", x: 160, y: 384 },
];

// telecom sites (circles) and grid substations (squares) — decorative asset layer
const TEL_ASSETS = [[70,60],[110,110],[150,160],[185,215],[200,260],[190,310],[140,350],[95,330],[60,280],[50,220],[70,170],[120,230],[160,290],[105,300]];
const PWR_ASSETS = [[85,85],[135,135],[175,190],[205,240],[175,330],[120,370],[70,310],[45,250],[55,180],[95,250],[145,265],[185,285]];

// cyclone track — approaches Batticaloa from ESE
const TRACK = [[452,196],[408,208],[362,218],[318,226],[276,231],[240,234]];

const LankaMap = ({ phase, height = 380 }) => {
  const showStorm = phase !== "calm";
  const stormIdx = phase === "event" ? 3 : 5; // event: offshore, payout: at coast
  const [sx, sy] = TRACK[stormIdx];
  return (
    <svg width="100%" height={height} viewBox="0 0 480 440" style={{ display: "block", background: "var(--bg-0)" }}>
      <defs>
        <radialGradient id="stormGrad">
          <stop offset="0%" stopColor="var(--danger)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="var(--danger)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--danger)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="floodGrad">
          <stop offset="0%" stopColor="#4a9eff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4a9eff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* graticule */}
      {[80, 160, 240, 320, 400].map(x => <line key={"gx"+x} x1={x} y1="0" x2={x} y2="440" stroke="var(--line-1)" strokeWidth="1" />)}
      {[80, 160, 240, 320, 400].map(y => <line key={"gy"+y} x1="0" y1={y} x2="480" y2={y} stroke="var(--line-1)" strokeWidth="1" />)}

      {/* parametric box */}
      <rect x="10" y="8" width="300" height="424" fill="none" stroke="var(--line-3)" strokeDasharray="4,4" strokeWidth="1" />
      <text x="18" y="24" fontSize="9" fontFamily="IBM Plex Mono" fill="var(--ink-3)">PARAMETRIC BOX · 5.8–9.9°N 79.5–82.0°E</text>

      {/* island */}
      <path d={LANKA_PATH} fill="var(--bg-2)" stroke="var(--line-3)" strokeWidth="1.25" />

      {/* flood overlay — east coast, event/payout only */}
      {showStorm && <ellipse cx="205" cy="245" rx="72" ry="105" fill="url(#floodGrad)" />}

      {/* asset layers */}
      {TEL_ASSETS.map(([x, y], i) => <circle key={"t"+i} cx={x} cy={y} r="2.4" fill="#7aa5ff" opacity="0.85" />)}
      {PWR_ASSETS.map(([x, y], i) => <rect key={"p"+i} x={x-2.2} y={y-2.2} width="4.4" height="4.4" fill="#f5b941" opacity="0.85" />)}

      {/* degraded assets in event/payout — red halos on east side */}
      {showStorm && TEL_ASSETS.filter(([x]) => x > 140).map(([x, y], i) => (
        <circle key={"td"+i} cx={x} cy={y} r="5.5" fill="none" stroke="var(--danger)" strokeWidth="1" opacity="0.7" />
      ))}
      {showStorm && PWR_ASSETS.filter(([x]) => x > 140).map(([x, y], i) => (
        <circle key={"pd"+i} cx={x} cy={y} r="5.5" fill="none" stroke="var(--danger)" strokeWidth="1" opacity="0.7" />
      ))}

      {/* cities */}
      {CITY_MARKS.map(c => (
        <g key={c.name}>
          <circle cx={c.x} cy={c.y} r="1.8" fill="var(--ink-2)" />
          <text x={c.x + 6} y={c.y + 3} fontSize="8.5" fontFamily="IBM Plex Mono" fill="var(--ink-3)">{c.name}</text>
        </g>
      ))}

      {/* storm track + system */}
      {showStorm && (
        <g>
          <path d={"M " + TRACK.map(p => p.join(" ")).join(" L ")} fill="none" stroke="var(--danger)" strokeWidth="1" strokeDasharray="3,4" opacity="0.7" />
          {TRACK.slice(0, stormIdx).map(([x, y], i) => <circle key={"tk"+i} cx={x} cy={y} r="2" fill="var(--danger)" opacity="0.5" />)}
          <circle cx={sx} cy={sy} r="46" fill="url(#stormGrad)" />
          <circle cx={sx} cy={sy} r="10" fill="none" stroke="var(--danger)" strokeWidth="1.5" />
          <circle cx={sx} cy={sy} r="3.5" fill="var(--danger)" />
          <text x={sx} y={sy - 54} textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono" fill="var(--danger)" letterSpacing="0.1em">TC VIDURA</text>
          <text x={sx} y={sy - 42} textAnchor="middle" fontSize="8.5" fontFamily="IBM Plex Mono" fill="var(--ink-2)">{phase === "event" ? "88 KT · W 9 KT" : "LANDFALL 96 KT"}</text>
        </g>
      )}

      {/* legend */}
      <g transform="translate(330, 330)">
        <rect x="-10" y="-14" width="152" height="116" rx="4" fill="var(--bg-1)" stroke="var(--line-2)" />
        <text x="0" y="2" fontSize="8" fontFamily="IBM Plex Mono" fill="var(--ink-3)" letterSpacing="0.1em">LAYERS</text>
        <circle cx="6" cy="18" r="2.4" fill="#7aa5ff" /><text x="16" y="21" fontSize="8.5" fontFamily="IBM Plex Mono" fill="var(--ink-2)">Telecom sites (4,212)</text>
        <rect x="3.8" y="31.8" width="4.4" height="4.4" fill="#f5b941" /><text x="16" y="37" fontSize="8.5" fontFamily="IBM Plex Mono" fill="var(--ink-2)">Grid substations (61)</text>
        <circle cx="6" cy="50" r="4" fill="none" stroke="var(--danger)" strokeWidth="1" /><text x="16" y="53" fontSize="8.5" fontFamily="IBM Plex Mono" fill="var(--ink-2)">Service degraded</text>
        <circle cx="6" cy="66" r="4" fill="#4a9eff" opacity="0.4" /><text x="16" y="69" fontSize="8.5" fontFamily="IBM Plex Mono" fill="var(--ink-2)">Flood extent (SAR)</text>
        <circle cx="6" cy="82" r="3" fill="var(--danger)" /><text x="16" y="85" fontSize="8.5" fontFamily="IBM Plex Mono" fill="var(--ink-2)">Storm system</text>
      </g>
    </svg>
  );
};

// Capital stack — horizontal stacked bar of tranches
const CapitalStack = ({ tranches, height = 44 }) => {
  const total = tranches.reduce((s, t) => s + t.size, 0);
  const colors = { "NOTE-A": "var(--accent)", "GRANT-F": "#b08cff", "FUND-P": "#7aa5ff" };
  return (
    <div>
      <div style={{ display: "flex", height, borderRadius: 6, overflow: "hidden", border: "1px solid var(--line-2)" }}>
        {tranches.map(t => {
          const w = (t.size / total) * 100;
          const fundedPct = (t.funded / t.size) * 100;
          return (
            <div key={t.id} style={{ width: w + "%", position: "relative", background: "var(--bg-2)", borderRight: "1px solid var(--bg-0)" }} title={`${t.name} — ${fmtUSD(t.funded)} / ${fmtUSD(t.size)}`}>
              <div style={{ position: "absolute", inset: 0, width: fundedPct + "%", background: colors[t.id], opacity: 0.75 }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-0)", letterSpacing: "0.08em", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{t.token} · {fmtUSD(t.size)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="row-flex mt-8" style={{ gap: 20, flexWrap: "wrap" }}>
        {tranches.map(t => (
          <span key={t.id} className="row-flex gap-8">
            <span style={{ width: 8, height: 8, borderRadius: 2, background: colors[t.id] }} />
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-2)" }}>{t.name} — {((t.funded / t.size) * 100).toFixed(0)}% funded</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// Simple donut for funded ratio
const Donut = ({ pct, size = 84, color = "var(--accent)", label }) => {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-3)" strokeWidth="7" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${(pct/100)*c} ${c}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x="50%" y="47%" textAnchor="middle" fontSize="15" fontFamily="IBM Plex Mono" fill="var(--ink-0)">{pct.toFixed(0)}%</text>
      {label && <text x="50%" y="62%" textAnchor="middle" fontSize="7.5" fontFamily="IBM Plex Mono" fill="var(--ink-3)" letterSpacing="0.08em">{label}</text>}
    </svg>
  );
};

// Status pill for workflow / milestones
const StepStatus = ({ status }) => {
  const map = {
    "Standing": "", "Idle": "", "Pending": "warn", "Convened": "warn", "Armed": "warn",
    "Active": "live", "Done": "live", "Verified": "live", "In progress": "warn",
    "On track": "live", "Met": "live", "Passed": "live",
  };
  return <span className={cls("chip", map[status] ?? "")}>{status}</span>;
};

Object.assign(window, { SectorDot, PhaseChip, LifecycleStrip, TierGauge, LankaMap, CapitalStack, Donut, StepStatus });
