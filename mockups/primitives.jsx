// Shared primitives — sparkline, icons, badges, charts

const { useState, useEffect, useRef, useMemo } = React;

function cls(...xs) { return xs.filter(Boolean).join(" "); }

// Tiny inline SVG icon set
const Icon = ({ name, size = 14, className }) => {
  const s = size;
  const stroke = "currentColor";
  const sw = 1.5;
  const paths = {
    chevR: <polyline points="6,4 12,9 6,14" />,
    chevL: <polyline points="12,4 6,9 12,14" />,
    chevD: <polyline points="4,7 9,12 14,7" />,
    plus:  <><line x1="9" y1="3" x2="9" y2="15"/><line x1="3" y1="9" x2="15" y2="9"/></>,
    close: <><line x1="4" y1="4" x2="14" y2="14"/><line x1="14" y1="4" x2="4" y2="14"/></>,
    search: <><circle cx="8" cy="8" r="5"/><line x1="11.5" y1="11.5" x2="15" y2="15"/></>,
    arrowUp: <polyline points="4,9 9,4 14,9" />,
    arrowDn: <polyline points="4,9 9,14 14,9" />,
    arrowR: <polyline points="4,4 14,9 4,14" />,
    bolt:  <polyline points="9,2 4,10 8,10 7,16 13,7 9,7 10,2 9,2"/>,
    shield:<><path d="M9 2 L15 4 V9 C15 12 9 16 9 16 C9 16 3 12 3 9 V4 Z"/></>,
    wave:  <path d="M2 9 Q4 6 6 9 T10 9 T14 9 T18 9" />,
    radar: <><circle cx="9" cy="9" r="6"/><circle cx="9" cy="9" r="3"/><line x1="9" y1="9" x2="13" y2="5"/></>,
    book:  <><path d="M3 3 H8 C9.1 3 10 3.9 10 5 V15 H4 C3.4 15 3 14.6 3 14 Z"/><path d="M15 3 H10 C9 3.1 8.1 4 8 5 V15 H14 C14.6 15 15 14.6 15 14 Z"/></>,
    grid:  <><rect x="3" y="3" width="5" height="5"/><rect x="10" y="3" width="5" height="5"/><rect x="3" y="10" width="5" height="5"/><rect x="10" y="10" width="5" height="5"/></>,
    list:  <><line x1="6" y1="5" x2="15" y2="5"/><line x1="6" y1="9" x2="15" y2="9"/><line x1="6" y1="13" x2="15" y2="13"/><circle cx="3" cy="5" r="0.7" fill="currentColor"/><circle cx="3" cy="9" r="0.7" fill="currentColor"/><circle cx="3" cy="13" r="0.7" fill="currentColor"/></>,
    filter:<polyline points="3,4 15,4 11,9 11,14 7,14 7,9 3,4"/>,
    settings:<><circle cx="9" cy="9" r="2.5"/><path d="M9 2 V4 M9 14 V16 M2 9 H4 M14 9 H16 M3.5 3.5 L5 5 M13 13 L14.5 14.5 M3.5 14.5 L5 13 M13 5 L14.5 3.5"/></>,
    flag:  <><line x1="4" y1="3" x2="4" y2="16"/><path d="M4 3 L14 3 L11 7 L14 11 L4 11"/></>,
    sun:   <><circle cx="9" cy="9" r="3.2"/><line x1="9" y1="1.5" x2="9" y2="3"/><line x1="9" y1="15" x2="9" y2="16.5"/><line x1="1.5" y1="9" x2="3" y2="9"/><line x1="15" y1="9" x2="16.5" y2="9"/><line x1="3.7" y1="3.7" x2="4.7" y2="4.7"/><line x1="13.3" y1="13.3" x2="14.3" y2="14.3"/><line x1="3.7" y1="14.3" x2="4.7" y2="13.3"/><line x1="13.3" y1="4.7" x2="14.3" y2="3.7"/></>,
    moon:  <path d="M14.5 11.2 A6 6 0 1 1 6.8 3.5 A5 5 0 0 0 14.5 11.2 Z"/>,
    card:  <><rect x="2.5" y="4" width="13" height="10.5" rx="1.5"/><line x1="2.5" y1="7.5" x2="15.5" y2="7.5"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 18 18" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name] || null}
    </svg>
  );
};

// Sparkline. data: number[]
const Sparkline = ({ data, color = "var(--accent)", className = "", height = 36, fill = true, smooth = true }) => {
  const w = 200, h = height;
  const min = Math.min(...data), max = Math.max(...data);
  const span = Math.max(max - min, 0.001);
  const pad = h * 0.15;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - pad - ((v - min) / span) * (h - 2 * pad);
    return [x, y];
  });
  const path = smooth
    ? points.reduce((acc, [x, y], i, arr) => {
        if (i === 0) return `M ${x} ${y}`;
        const [px, py] = arr[i - 1];
        const cx = (px + x) / 2;
        return acc + ` Q ${cx} ${py}, ${cx} ${(py + y) / 2} T ${x} ${y}`;
      }, "")
    : points.map(([x, y], i) => (i === 0 ? "M" : "L") + ` ${x} ${y}`).join(" ");
  const fillPath = path + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg className={className} width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {fill && <path d={fillPath} fill={color} fillOpacity="0.1" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// APY area chart with hover
const ApyChart = ({ data, color = "var(--accent)", height = 240, unit = "%", minFloor = null }) => {
  const ref = useRef(null);
  const [hover, setHover] = useState(null);
  const w = 800, h = height;
  const padL = 44, padR = 16, padT = 16, padB = 32;
  const cw = w - padL - padR, ch = h - padT - padB;
  const pad = (Math.max(...data) - Math.min(...data)) * 0.12 || 0.5;
  let min = Math.min(...data) - pad;
  const max = Math.max(...data) + pad;
  if (minFloor !== null) min = Math.min(minFloor, Math.min(...data));
  const span = max - min;

  const points = data.map((v, i) => {
    const x = padL + (i / (data.length - 1)) * cw;
    const y = padT + ch - ((v - min) / span) * ch;
    return [x, y];
  });
  const linePath = points.map(([x, y], i) => (i === 0 ? "M" : "L") + ` ${x} ${y}`).join(" ");
  const fillPath = linePath + ` L ${padL + cw} ${padT + ch} L ${padL} ${padT + ch} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    y: padT + ch - t * ch,
    label: (min + span * t).toFixed(1) + unit
  }));
  const xLabels = ["−30d", "−21d", "−14d", "−7d", "now"];

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * w;
    if (x < padL || x > padL + cw) { setHover(null); return; }
    const idx = Math.round(((x - padL) / cw) * (data.length - 1));
    if (idx >= 0 && idx < data.length) setHover({ idx, ...points[idx] });
  };

  return (
    <svg ref={ref} width="100%" height={h} viewBox={`0 0 ${w} ${h}`} onMouseMove={onMove} onMouseLeave={() => setHover(null)} style={{ display: "block" }}>
      <defs>
        <linearGradient id="apyfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={t.y} x2={padL + cw} y2={t.y} stroke="var(--line-1)" strokeWidth="1" strokeDasharray={i === 0 || i === 4 ? "" : "2,3"} />
          <text x={padL - 8} y={t.y + 3} textAnchor="end" fontSize="9" fontFamily="IBM Plex Mono" fill="var(--ink-3)">{t.label}</text>
        </g>
      ))}
      {xLabels.map((l, i) => {
        const x = padL + (i / (xLabels.length - 1)) * cw;
        return <text key={i} x={x} y={h - 10} textAnchor="middle" fontSize="9" fontFamily="IBM Plex Mono" fill="var(--ink-3)">{l}</text>;
      })}
      <path d={fillPath} fill="url(#apyfade)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.75" strokeLinejoin="round" />
      {hover && (
        <g>
          <line x1={hover[0]} x2={hover[0]} y1={padT} y2={padT + ch} stroke="var(--line-3)" strokeDasharray="2,3" />
          <circle cx={hover[0]} cy={hover[1]} r="4" fill={color} stroke="var(--bg-1)" strokeWidth="2" />
          <g transform={`translate(${Math.min(hover[0] + 10, padL + cw - 90)}, ${hover[1] - 32})`}>
            <rect width="90" height="32" rx="4" fill="var(--bg-2)" stroke="var(--line-2)" />
            <text x="8" y="12" fontSize="9" fontFamily="IBM Plex Mono" fill="var(--ink-3)">D−{29 - hover.idx}</text>
            <text x="8" y="25" fontSize="13" fontFamily="IBM Plex Mono" fill="var(--ink-0)">{data[hover.idx].toFixed(2)}{unit}</text>
          </g>
        </g>
      )}
    </svg>
  );
};

// A vault cannot be "on risk" while its book is still open — in a fully collateralised
// structure the limit IS the posted collateral. Derive the badge instead of trusting a flag.
function vaultStatusOf(v) {
  if (v.status === "structuring") return { label: "In structuring", cls: "" };
  if (v.status === "draft") return { label: "Draft", cls: "" };
  if (v.tvl < v.capacity) return { label: "Subscribing", cls: "warn" };
  return { label: "Active", cls: "live" };
}

// Vault category icon dot
const CatDot = ({ cat }) => <span className={`cat-dot cat-${cat}`} />;

// Status chip
const StatusChip = ({ status }) => {
  if (status === "active") return <span className="chip live">Active</span>;
  if (status === "armed") return <span className="chip warn">Armed</span>;
  if (status === "triggered") return <span className="chip danger">Triggered</span>;
  if (status === "draft") return <span className="chip">Draft</span>;
  return <span className="chip">{status}</span>;
};

// Animated counter
const Counter = ({ value, prefix = "", suffix = "", decimals = 0, duration = 900 }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{prefix}{n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
};

// Real company logos for deal parties (nominative use — trademarks of their owners).
// Missing entries fall back to a coloured monogram, which is correct for SPVs (they have no brand).
const PARTY_LOGOS = {
  "Government of Jamaica": "logos/jamaica.png",
  "World Bank (IBRD)": "logos/worldbank.png",
  "Aon Securities": "logos/aon.png",
  "Aon": "logos/aon.png",
  "Swiss Re Capital Markets": "logos/swissre.png",
  "Swiss Re": "logos/swissre.png",
  "RMS (Moody's)": "logos/moodys.png",
  "Moody's — Baa2 (sf)": "logos/moodys.png",
  "NOAA National Hurricane Center": "logos/noaa.png",
  "California Earthquake Authority": "logos/cea.png",
  "USGS ShakeMap": "logos/usgs.png",
  "Texas Windstorm Insurance Assoc.": "logos/twia.png",
  "Gallagher Securities": "logos/gallagher.png",
  "AIR Worldwide (Verisk)": "logos/verisk.png",
  "PCS · Verisk": "logos/verisk.png",
  "PCS · CAL FIRE": "logos/calfire.png",
  "Gothaer Allgemeine Vers. AG": "logos/gothaer.png",
  "Munich Re": "logos/munichre.png",
  "DWD · EFAS": "logos/dwd.png",
  "LA Dept. of Water & Power": "logos/ladwp.png",
  "Beazley": "logos/beazley.png",
  "Asian Development Bank": "logos/adb.png",
  "Fireblocks": "logos/fireblocks.png",
  "BNY": "logos/bny.png",
  "Chainlink": "logos/chainlink.png",
  "NASA GPM · ESA Sentinel-1 · JTWC": "logos/nasa.png",
  "CHIRPS v2.0 · Climate Hazards Center": "logos/usgs.png",
  "SL Dept. of Meteorology · Mahaweli Authority": "logos/slmet.png",
  "EQECAT (CoreLogic)": "logos/corelogic.png",
  "IODA · Georgia Tech": "logos/gatech.png",
  "Lionscraft": "logos/lionscraft.png",
};
// issuer shorthand shown on marketplace fund cards
const ISSUER_LOGOS = {
  "Jamaica MoF": "logos/jamaica.png",
  "CEA": "logos/cea.png",
  "TWIA": "logos/twia.png",
  "Swiss Re": "logos/swissre.png",
  "Gothaer": "logos/gothaer.png",
  "LADWP": "logos/ladwp.png",
  "Beazley": "logos/beazley.png",
};

// Party avatar — real logo when we have one, monogram otherwise
const PartyLogo = ({ p, size = 64 }) => {
  const src = p.logo || PARTY_LOGOS[p.name];
  if (src) {
    return (
      <span style={{
        width: size, height: size, borderRadius: 14, flexShrink: 0,
        background: "#fff", border: "1px solid var(--line-2)",
        boxShadow: "0 1px 3px rgba(6,13,26,0.07)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <img src={src} alt={p.name} style={{ maxWidth: "74%", maxHeight: "74%", objectFit: "contain" }} />
      </span>
    );
  }
  return (
    <span style={{
      width: size, height: size, borderRadius: 14, background: p.color || "var(--ink-3)", color: "#fff",
      flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 1px 3px rgba(6,13,26,0.07)",
      fontFamily: "var(--font-mono)", fontSize: p.mono && p.mono.length > 3 ? 12 : 16, fontWeight: 600,
      letterSpacing: "0.02em",
    }}>{p.mono}</span>
  );
};

// Securitize-style fund card — image-style banner, chain icons, facts, tags
const FUND_ART = [
  ["#c9c2ae", "#98a1b3"],
  ["#8e9bb3", "#b9c2d0"],
  ["#9aa5b1", "#c4cad2"],
  ["#a3b0a0", "#8f9bb0"],
  ["#b0a4a8", "#98a5bd"],
];

const FundCard = ({ ticker, name, issuer, desc, facts, tags, status, capacity, link, color = "var(--accent)", onView }) => {
  const art = FUND_ART[(ticker.charCodeAt(0) + ticker.length) % FUND_ART.length];
  return (
    <div className="card" style={{
      display: "flex", flexDirection: "column", borderRadius: 14,
      boxShadow: "0 1px 2px rgba(6,13,26,0.05), 0 10px 28px rgba(6,13,26,0.07)",
    }}>
      {/* banner */}
      <div style={{
        position: "relative", height: 128, overflow: "hidden",
        background: `linear-gradient(130deg, ${art[0]}, ${art[1]})`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
          <circle cx="330" cy="18" r="75" fill="rgba(255,255,255,0.14)" />
          <circle cx="48" cy="138" r="95" fill="rgba(255,255,255,0.10)" />
          <circle cx="205" cy="80" r="125" fill={color + "22"} />
          <rect x="258" y="92" width="150" height="95" rx="22" fill="rgba(0,0,0,0.07)" />
          <rect x="-30" y="-40" width="130" height="110" rx="22" fill="rgba(0,0,0,0.05)" />
        </svg>
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 34, letterSpacing: "0.18em", color: "#ffffff", textShadow: "0 1px 10px rgba(0,0,0,0.28)" }}>{ticker}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.88)", marginTop: 2, fontWeight: 500 }}>by {issuer}</div>
        </div>
        <div className="mono" style={{ position: "absolute", right: 12, bottom: 10, fontSize: 8.5, letterSpacing: "0.14em", color: "rgba(255,255,255,0.75)", textTransform: "uppercase" }}>Interop by RIZK</div>
        {status && (
          <div style={{ position: "absolute", top: 10, right: 12, background: "rgba(255,255,255,0.92)", borderRadius: 999, display: "inline-flex" }}>{status}</div>
        )}
      </div>

      {/* identity */}
      <div style={{ padding: "16px 20px 0", display: "flex", gap: 14, alignItems: "flex-start" }}>
        {ISSUER_LOGOS[issuer] ? (
          <span style={{
            width: 46, height: 46, borderRadius: "50%", background: "#fff", flexShrink: 0,
            border: "1px solid var(--line-2)", overflow: "hidden",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <img src={ISSUER_LOGOS[issuer]} alt={issuer} style={{ maxWidth: "72%", maxHeight: "72%", objectFit: "contain" }} />
          </span>
        ) : (
          <span style={{
            width: 46, height: 46, borderRadius: "50%", background: color, color: "#ffffff", flexShrink: 0,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: "0.02em",
          }}>{ticker.length > 6 ? ticker.slice(0, 6) : ticker}</span>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-0)", lineHeight: 1.35 }}>{name}</div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--ink-3)", textTransform: "uppercase", marginTop: 5 }}>{issuer}</div>
        </div>
      </div>

      {/* view + source link */}
      <div style={{ padding: "16px 20px 0", display: "flex", gap: 10 }}>
        <button className="btn" style={{ flex: 1, height: 42, borderRadius: 8 }} onClick={onView}>View</button>
        {link && (
          <a className="btn ghost" href={link} target="_blank" rel="noopener"
            onClick={e => e.stopPropagation()}
            style={{ height: 42, borderRadius: 8, textDecoration: "none", flexShrink: 0 }}>
            Artemis ↗
          </a>
        )}
      </div>

      {/* description — clamped so every card in a row is the same height */}
      <div style={{
        padding: "14px 20px 0", fontSize: 13, color: "var(--ink-1)", lineHeight: "20px",
        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
        overflow: "hidden", height: 60, boxSizing: "content-box", marginBottom: 12,
      }} title={desc}>{desc}</div>

      {/* facts */}
      <div style={{ padding: "0 20px" }}>
        {facts.map(([k, v, accent], i) => (
          <div key={i} className="row-flex" style={{ justifyContent: "space-between", padding: "9px 0", borderTop: "1px solid var(--line-1)", gap: 12 }}>
            <span style={{ fontSize: 13, color: "var(--ink-2)", flexShrink: 0 }}>{k} <span style={{ color: "var(--ink-4)", fontSize: 11 }}>ⓘ</span></span>
            <span className="num" style={{ fontSize: 14, color: accent ? "var(--accent)" : "var(--ink-0)", fontWeight: 600, textAlign: "right" }}>{v}</span>
          </div>
        ))}
        {capacity && (() => {
          const pct = Math.min((capacity.tvl / capacity.cap) * 100, 100);
          return (
            <div style={{ padding: "11px 0", borderTop: "1px solid var(--line-1)" }}>
              <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: 13, color: "var(--ink-2)" }}>Capacity <span style={{ color: "var(--ink-4)", fontSize: 11 }}>ⓘ</span></span>
                <span className="num" style={{ fontSize: 14, color: "var(--ink-0)", fontWeight: 600 }}>
                  {fmtUSD(capacity.tvl)} <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>/ {fmtUSD(capacity.cap)}</span>
                </span>
              </div>
              <div className={cls("meter", pct > 85 ? "warn" : "")}><span style={{ width: pct + "%" }} /></div>
              <div className="row-flex" style={{ justifyContent: "space-between", marginTop: 6 }}>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{pct.toFixed(0)}% filled · open {fmtUSD(capacity.cap - capacity.tvl)}</span>
                {capacity.investors != null && <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{capacity.investors} investors</span>}
              </div>
            </div>
          );
        })()}
      </div>

      {/* tags */}
      <div style={{ padding: "14px 20px 18px", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {tags.map(t => <span key={t} className="chip solid" style={{ height: 26, fontSize: 10, borderRadius: 6 }}>{t}</span>)}
      </div>
    </div>
  );
};

Object.assign(window, { cls, Icon, Sparkline, ApyChart, CatDot, StatusChip, Counter, FundCard, PartyLogo, vaultStatusOf, PARTY_LOGOS, ISSUER_LOGOS });
