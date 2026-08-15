// Claims / Oracle monitor — Sri Lanka edition: live trigger conditions, animated payout event

const ClaimsScreen = ({ goTo }) => {
  const [signals, setSignals] = useState(ORACLE_SIGNALS);
  const [triggerEvent, setTriggerEvent] = useState(null);
  const [animPhase, setAnimPhase] = useState(0);  // 0 idle, 1 alert, 2 verifying, 3 settled

  // Live tick — simulate oracle drift
  useEffect(() => {
    const t = setInterval(() => {
      setSignals(prev => prev.map(s => {
        const drift = (Math.random() - 0.5) * 0.4;
        let v = typeof s.value === "number" ? s.value + drift : s.value;
        if (typeof v === "number") v = +v.toFixed(2);
        return { ...s, value: v };
      }));
    }, 1800);
    return () => clearInterval(t);
  }, []);

  // Trigger animation phases
  useEffect(() => {
    if (!triggerEvent) return;
    setAnimPhase(1);
    const t1 = setTimeout(() => setAnimPhase(2), 1600);
    const t2 = setTimeout(() => setAnimPhase(3), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [triggerEvent]);

  const triggerCyclone = () => {
    setTriggerEvent({
      vault: VAULTS.find(v => v.id === "VLT-CYC-001"),
      payout: 14_000_000,
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
    });
  };
  const reset = () => { setTriggerEvent(null); setAnimPhase(0); };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Claims & Oracle Monitor · Sri Lanka</div>
          <h1 className="h-display">Live <em>trigger conditions.</em></h1>
        </div>
        <div className="meta">
          <div className="stat">
            <div className="label">Oracles Healthy</div>
            <div className="val" style={{ color: "var(--accent)" }}>{signals.length} / {signals.length}</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">Active Watches</div>
            <div className="val" style={{ color: "var(--warn)" }}>2</div>
          </div>
          <div className="vdivider" />
          <button className="btn" onClick={triggerCyclone} style={{ borderColor: "rgba(248,113,113,0.4)", color: "var(--danger)" }}>
            <Icon name="bolt" /> Simulate Trigger Event
          </button>
        </div>
      </header>

      {triggerEvent && (
        <TriggerEventModal event={triggerEvent} phase={animPhase} onClose={reset} onView={() => { reset(); goTo("payouts", true); }} />
      )}

      {/* Island map / trigger visualization */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Island Trigger Map</div>
            <span className="chip live">{signals.length} oracles streaming</span>
          </div>
          <div style={{ padding: 12 }}>
            <SLOracleMap signals={signals} />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="label">Trigger Watches</div>
          </div>
          <div>
            {[
              { title: "Sri Lanka Cyclone — Wind Parameter", status: "NORMAL", phase: "No system in basin · 14 kt baseline", color: "ok", pct: 12 },
              { title: "Sri Lanka Rain-Flood Index", status: "NORMAL", phase: "SW monsoon within range · 21 / 60", color: "ok", pct: 35 },
              { title: "Atlantic Hurricane — Jamaica Grid", status: "WATCH", phase: "2 named systems in basin · peak season", color: "warn", pct: 45 },
              { title: "Gulf of Mexico — TWIA", status: "WATCH", phase: "Invest 94L organising · aggregate watch", color: "warn", pct: 30 },
              { title: "SoCal Wildfire — LADWP", status: "WATCH", phase: "6 VIIRS detections · red-flag conditions", color: "warn", pct: 22 },
              { title: "Systemic Cyber — Beazley", status: "NORMAL", phase: "No qualifying events", color: "ok", pct: 2 },
              { title: "Independent Outage Signals (SL)", status: "NORMAL", phase: "Traffic 99% of baseline · BGP stable — corroborates operator feeds", color: "ok", pct: 5 },
            ].map((w, i) => (
              <div key={i} style={{ padding: "14px 22px", borderTop: i ? "1px solid var(--line-1)" : "none" }}>
                <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--ink-0)" }}>{w.title}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}>{w.phase}</div>
                  </div>
                  <span className={cls("chip", w.color === "warn" ? "warn" : "")}>{w.status}</span>
                </div>
                <div className={cls("meter", w.color === "warn" ? "warn" : "")}>
                  <span style={{ width: w.pct + "%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Oracle signals table */}
      <div className="card mb-24">
        <div className="card-head">
          <div className="label">Live Oracle Feeds</div>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>Refreshing every 1.8s</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Signal</th>
              <th>Source</th>
              <th>Vault</th>
              <th style={{ textAlign: "right" }}>Current</th>
              <th style={{ textAlign: "right" }}>Δ 24h</th>
              <th style={{ textAlign: "right" }}>Threshold</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {signals.map(sig => {
              const v = VAULTS.find(v => v.id === sig.vaultId);
              const arm = sig.id === "ORC-NHC" || sig.id === "ORC-GULF" || sig.id === "ORC-FIRE";
              return (
                <tr key={sig.id}>
                  <td>
                    <div style={{ fontSize: 13, color: "var(--ink-0)" }}>{sig.name}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{sig.id}</div>
                  </td>
                  <td className="mono" style={{ fontSize: 11 }}>{sig.source}</td>
                  <td>
                    <div className="row-flex gap-8">
                      <CatDot cat={v?.category} />
                      <span style={{ fontSize: 12 }}>{v?.name}</span>
                    </div>
                  </td>
                  <td className="num" style={{ textAlign: "right", color: "var(--ink-0)", fontSize: 14 }}>
                    {sig.value}<span style={{ color: "var(--ink-3)", marginLeft: 4, fontSize: 11 }}>{sig.unit}</span>
                  </td>
                  <td className="num" style={{ textAlign: "right", color: sig.change < 0 ? "var(--danger)" : sig.change > 0 ? "var(--warn)" : "var(--ink-2)" }}>
                    {sig.change > 0 ? "+" : ""}{sig.change}
                  </td>
                  <td className="num" style={{ textAlign: "right", color: "var(--ink-2)" }}>{sig.threshold}{sig.unit.split(" ")[0]}</td>
                  <td>
                    <span className={cls("chip", arm ? "warn" : "live")}>{arm ? "Watch" : "Healthy"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Historical events */}
      <div className="card">
        <div className="card-head">
          <div className="label">Historical Trigger Evaluations</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vault</th>
              <th>Event</th>
              <th>Outcome</th>
              <th style={{ textAlign: "right" }}>Payout</th>
              <th style={{ textAlign: "right" }}>Settlement</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: "2026-07-12", vault: "VLT-CYC-001", event: "Dry-run #3 — synthetic Tier 1 cyclone, east coast", outcome: "Rehearsal passed", payout: 0, time: "T+0 · 26h e2e" },
              { date: "2026-06-28", vault: "VLT-CYC-001", event: "Cyclone Ditwah 2025 replay (flood parameter)", outcome: "Tier 2 reproduced", payout: 0, time: "T+0 · 41m" },
              { date: "2026-06-21", vault: "VLT-DRT-001", event: "SW-monsoon burst — rain index peaked 41 (flagship parameter)", outcome: "Trigger not met", payout: 0, time: "auto · 12m" },
              { date: "2025-10-28", vault: "VLT-NAT-001", event: "Hurricane Melissa — Jamaica (predecessor 2024 notes)", outcome: "Trigger met — full payout", payout: 150_000_000, time: "weeks (IBRD)" },
              { date: "2024-07-03", vault: "VLT-NAT-001", event: "Hurricane Beryl — grid parameters narrowly missed", outcome: "Trigger not met", payout: 0, time: "per advisory" },
              { date: "2025-11-27", vault: "VLT-CYC-001", event: "Cyclone Ditwah backtest — 55% of consumers dark, ~4,000 towers offline, PDNA outages up to 14d", outcome: "Tier 2 via flood parameter", payout: 14_000_000, time: "T+38h modelled" },
              { date: "2024-11-27", vault: "VLT-CYC-001", event: "Cyclone Fengal — rain index 54 (backtest)", outcome: "Below threshold", payout: 0, time: "—" },
            ].map((r, i) => {
              const v = VAULTS.find(v => v.id === r.vault);
              return (
                <tr key={i}>
                  <td className="mono" style={{ fontSize: 12 }}>{r.date}</td>
                  <td>
                    <div className="row-flex gap-8">
                      <CatDot cat={v?.category} />
                      <span style={{ fontSize: 12 }}>{v?.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12 }}>{r.event}</td>
                  <td>
                    <span className={cls("chip", r.payout > 0 ? "danger" : r.outcome.includes("passed") || r.outcome.includes("reproduced") ? "live" : "")}>{r.outcome}</span>
                  </td>
                  <td className="num" style={{ textAlign: "right", color: r.payout > 0 ? "var(--danger)" : "var(--ink-3)" }}>
                    {r.payout > 0 ? fmtUSD(r.payout) : "—"}
                  </td>
                  <td className="mono" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-3)" }}>{r.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sri Lanka map with oracle pins
const SLOracleMap = ({ signals }) => {
  const LANKA = "M 70 17 L 92 34 L 90 65 L 130 73 L 152 105 L 170 143 L 196 185 L 220 228 L 232 270 L 235 315 L 210 360 L 162 388 L 110 408 L 72 397 L 48 350 L 35 307 L 34 280 L 25 197 L 33 150 L 40 102 L 40 55 L 55 25 Z";
  const pins = [
    { id: "ORC-WIND", x: 320, y: 120, status: "ok",   label: "Param box · wind" },
    { id: "ORC-RAIN", x: 216, y: 232, status: "ok",   label: "Batticaloa · rain" },
    { id: "ORC-MONS", x: 196, y: 300, status: "ok",   label: "East · monsoon" },
    { id: "ORC-NETX", x: 330, y: 200, status: "ok",   label: "Traffic index" },
    { id: "ORC-TWRB", x: 148, y: 108, status: "ok",   label: "Towers · backup" },
  ];

  return (
    <svg viewBox="0 0 480 440" style={{ width: "100%", display: "block" }}>
      {/* graticule */}
      {[80, 160, 240, 320, 400].map(x => <line key={"gx"+x} x1={x} y1="0" x2={x} y2="440" stroke="var(--line-1)" strokeWidth="1" />)}
      {[80, 160, 240, 320, 400].map(y => <line key={"gy"+y} x1="0" y1={y} x2="480" y2={y} stroke="var(--line-1)" strokeWidth="1" />)}

      {/* parametric box */}
      <rect x="10" y="8" width="300" height="424" fill="none" stroke="var(--line-3)" strokeDasharray="4,4" strokeWidth="1" />

      {/* island */}
      <path d={LANKA} fill="var(--bg-3)" stroke="var(--line-3)" strokeWidth="1.25" opacity="0.9" />

      {/* Pins */}
      {pins.map(p => {
        const sig = signals.find(s => s.id === p.id);
        const color = p.status === "warn" ? "var(--warn)" : "var(--accent)";
        return (
          <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
            <circle r="14" fill={color} opacity="0.12">
              {p.status === "warn" && <animate attributeName="r" from="10" to="20" dur="1.8s" repeatCount="indefinite" />}
              {p.status === "warn" && <animate attributeName="opacity" from="0.3" to="0" dur="1.8s" repeatCount="indefinite" />}
            </circle>
            <circle r="4" fill={color} stroke="var(--bg-1)" strokeWidth="1.5" />
            <text x="8" y="3" fontSize="10" fontFamily="IBM Plex Mono" fill="var(--ink-1)" letterSpacing="0.05em">{p.label}</text>
            <text x="8" y="15" fontSize="9" fontFamily="IBM Plex Mono" fill="var(--ink-3)">{sig?.value}{sig?.unit.split(" ")[0]}</text>
          </g>
        );
      })}

      {/* Title overlay */}
      <text x="18" y="30" fontSize="10" fontFamily="IBM Plex Mono" fill="var(--ink-3)" letterSpacing="0.15em">PARAMETRIC ORACLE NETWORK · SRI LANKA</text>
      <text x="18" y="428" fontSize="9" fontFamily="IBM Plex Mono" fill="var(--ink-4)">Box 5.8–9.9°N · 79.5–82.0°E — not to geographic scale</text>
    </svg>
  );
};

// Animated trigger event modal — 4 phases (TC Vidura simulation)
const TriggerEventModal = ({ event, phase, onClose, onView }) => {
  const phases = [
    { idx: 0, label: "Idle", desc: "" },
    { idx: 1, label: "Oracle Alert", desc: "JTWC/IMD report TC Vidura at 88 kt sustained inside the parametric box — Tier 2 wind threshold breached. Rain-flood index 78 corroborates across Eastern province." },
    { idx: 2, label: "Verifying On-Chain", desc: "Aggregating oracle attestations. Independent calculation agent evaluating the parametric condition against bond terms. Governance multi-sig review (15s window)." },
    { idx: 3, label: "Settled", desc: "Tier 2 confirmed. Protection-collateral vault releases $14.0M USDC to SLCIR SPC — staged into pre-agreed purpose escrows for the operators. After Cyclone Ditwah, the first sovereign financing took ~25 days; this settles in hours." },
  ];
  const cur = phases[phase];

  return (
    <div className="modal-back">
      <div className="modal" style={{ width: 640 }}>
        <div className="modal-head" style={{ background: phase === 3 ? "rgba(248, 113, 113, 0.08)" : "transparent" }}>
          <div className="row-flex gap-12">
            <div className="pulse" style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--danger)", boxShadow: "0 0 10px var(--danger)", animation: "pulse 1s ease-in-out infinite" }} />
            <div>
              <div className="label">Parametric Trigger Event · Simulation</div>
              <div className="h-section mt-8">{event.vault.name}</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" /></button>
        </div>

        <div className="modal-body">
          {/* Phase progress */}
          <div className="row-flex" style={{ marginBottom: 24 }}>
            {[1, 2, 3].map((p, i) => (
              <React.Fragment key={p}>
                <div style={{ flex: i < 2 ? 0 : 1, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 26, height: 26,
                    borderRadius: "50%",
                    border: "1.5px solid " + (phase >= p ? "var(--danger)" : "var(--line-2)"),
                    background: phase >= p ? "var(--danger)" : "transparent",
                    color: phase >= p ? "#fff" : "var(--ink-3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontFamily: "IBM Plex Mono",
                    transition: "all 0.3s"
                  }}>{p}</div>
                  <div>
                    <div className="mono" style={{ fontSize: 10, color: phase >= p ? "var(--ink-0)" : "var(--ink-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {phases[p].label}
                    </div>
                  </div>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 1, background: phase > p ? "var(--danger)" : "var(--line-2)", margin: "0 12px", transition: "background 0.3s" }} />}
              </React.Fragment>
            ))}
          </div>

          <div style={{ color: "var(--ink-1)", fontSize: 13, lineHeight: 1.7, marginBottom: 24, minHeight: 80 }}>
            {cur.desc}
          </div>

          {phase >= 1 && (
            <div className="kv" style={{ padding: 16, background: "var(--bg-2)", borderRadius: 6, marginBottom: 16 }}>
              <div className="k">Triggered At</div><div className="v">{event.time}</div>
              <div className="k">Oracle</div><div className="v">JTWC/IMD · GPM IMERG</div>
              <div className="k">Reading</div><div className="v">88 kt · rain index 78</div>
              <div className="k">Threshold</div><div className="v">Tier 2 · ≥85 kt / ≥75</div>
              <div className="k">Corroboration</div><div className="v">Confirmed · 2 of 2 parameters</div>
            </div>
          )}

          {phase >= 3 && (
            <div className="alert-banner" style={{ background: "rgba(248, 113, 113, 0.08)", borderColor: "rgba(248, 113, 113, 0.4)" }}>
              <div className="pulse" />
              <div>
                <div style={{ color: "var(--ink-0)", fontSize: 14, fontWeight: 500 }}>Payout Executed</div>
                <div className="num" style={{ fontSize: 24, color: "var(--danger)", marginTop: 4 }}>{fmtUSDExact(event.payout)} <span style={{ fontSize: 12, color: "var(--ink-3)" }}>USDC → SLCIR SPC · purpose escrows</span></div>
                <div className="mono mt-8" style={{ fontSize: 11, color: "var(--ink-3)" }}>tx 0xa7f3…920c · settled T+0 · resolution GOV-2026-0007</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          {phase < 3 && <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>Running deterministic settlement…</span>}
          {phase >= 3 && (
            <>
              <button className="btn ghost" onClick={onClose}>Close</button>
              <button className="btn primary" onClick={onView || onClose}>View Settlement Record</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ClaimsScreen, TriggerEventModal, SLOracleMap });
