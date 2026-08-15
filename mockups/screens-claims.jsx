// Claims / Oracle monitor — live trigger conditions, animated payout event

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

  const triggerJamaica = () => {
    setTriggerEvent({
      vault: VAULTS.find(v => v.id === "VLT-NAT-001"),
      payout: 200_000_000,
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
    });
  };
  const reset = () => { setTriggerEvent(null); setAnimPhase(0); };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Claims & Oracle Monitor</div>
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
          <button className="btn" onClick={triggerJamaica} style={{ borderColor: "rgba(248,113,113,0.4)", color: "var(--danger)" }}>
            <Icon name="bolt" /> Simulate Trigger Event
          </button>
        </div>
      </header>

      {triggerEvent && (
        <TriggerEventModal event={triggerEvent} phase={animPhase} onClose={reset} />
      )}

      {/* World map / global trigger visualization */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Global Trigger Map</div>
            <span className="chip live">7 oracles streaming</span>
          </div>
          <div style={{ padding: 12 }}>
            <WorldMap signals={signals} />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="label">Trigger Watches</div>
          </div>
          <div>
            {[
              { title: "Atlantic Hurricane Season", status: "WATCH", phase: "2 named systems in basin · peak season", color: "warn", pct: 45 },
              { title: "Gulf of Mexico — TWIA", status: "WATCH", phase: "Invest 94L organising · aggregate watch", color: "warn", pct: 30 },
              { title: "California Seismic — CEA", status: "NORMAL", phase: "Largest 24h event M3.1", color: "ok", pct: 5 },
              { title: "SoCal Wildfire — LADWP", status: "WATCH", phase: "6 VIIRS detections · red-flag conditions", color: "warn", pct: 22 },
              { title: "German Flood — Gothaer", status: "NORMAL", phase: "EFAS index 14 / 70", color: "ok", pct: 14 },
              { title: "Systemic Cyber — Beazley", status: "NORMAL", phase: "No qualifying events", color: "ok", pct: 2 },
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
              const distToTrigger = sig.unit.includes("avg") ? sig.value - sig.threshold :
                                    sig.name.includes("Drought") ? sig.value - sig.threshold :
                                    sig.threshold - sig.value;
              const arm = distToTrigger < 20 && distToTrigger > 0;
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
                    <span className={cls("chip", arm ? "warn" : "live")}>{arm ? "Armed" : "Healthy"}</span>
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
              { date: "2025-10-28", vault: "VLT-NAT-001", event: "Hurricane Melissa — Jamaica (predecessor 2024 notes)", outcome: "Trigger met — full payout", payout: 150_000_000, time: "weeks (IBRD)" },
              { date: "2025-01-08", vault: "VLT-WTR-002", event: "LA wildfires (Palisades / Eaton) — pre-issuance", outcome: "Backtest — above attachment", payout: 0, time: "—" },
              { date: "2024-09-27", vault: "VLT-NAT-004", event: "Hurricane Helene — industry loss development", outcome: "Below index trigger", payout: 0, time: "extended" },
              { date: "2024-07-03", vault: "VLT-NAT-001", event: "Hurricane Beryl — grid parameters narrowly missed", outcome: "Trigger not met", payout: 0, time: "per advisory" },
              { date: "2023-02-06", vault: "VLT-NAT-002", event: "Türkiye M7.8 — TCIP cat bond paid in full (market)", outcome: "Reference event", payout: 0, time: "—" },
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
                    <span className={cls("chip", r.outcome.includes("met —") ? "danger" : "")}>{r.outcome}</span>
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

// World map with oracle pins
const WorldMap = ({ signals }) => {
  // Approximate (x, y in a 800×440 viewport) locations
  const pins = [
    { id: "ORC-WIND", x: 556, y: 250, status: "ok", label: "Sri Lanka · wind" },
    { id: "ORC-SLHDI", x: 596, y: 288, status: "ok", label: "SL hydro-drought" },
    { id: "ORC-NHC",  x: 208, y: 242, status: "warn", label: "Jamaica grid" },
    { id: "ORC-GULF", x: 170, y: 218, status: "warn", label: "Texas coast" },
    { id: "ORC-USGS", x: 112, y: 165, status: "ok", label: "California" },
    { id: "ORC-FIRE", x: 122, y: 190, status: "warn", label: "SoCal fire" },
    { id: "ORC-EFAS", x: 428, y: 148, status: "ok", label: "Germany" },
    { id: "ORC-PCS",  x: 195, y: 155, status: "ok", label: "US industry" },
    { id: "ORC-CYB",  x: 660, y: 355, status: "ok", label: "Cyber · global" },
  ];

  return (
    <svg viewBox="0 0 800 440" style={{ width: "100%", display: "block" }}>
      {/* Background grid */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--line-1)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="800" height="440" fill="url(#grid)" opacity="0.4" />

      {/* Continent silhouettes — abstract blobs (decorative, not geographically precise) */}
      <g fill="var(--bg-3)" opacity="0.5">
        {/* N America */}
        <path d="M 60 110 Q 100 90 160 100 Q 220 120 250 180 Q 240 240 200 270 Q 150 280 110 260 Q 60 220 60 170 Z" />
        {/* S America */}
        <path d="M 200 290 Q 230 280 250 310 Q 260 360 240 400 Q 215 410 200 380 Z" />
        {/* Europe */}
        <path d="M 380 130 Q 430 120 460 140 Q 480 170 460 195 Q 420 210 390 195 Q 370 165 380 130 Z" />
        {/* Africa */}
        <path d="M 410 215 Q 450 220 470 260 Q 480 320 450 360 Q 410 360 390 320 Q 380 270 410 215 Z" />
        {/* Asia */}
        <path d="M 470 130 Q 560 110 660 130 Q 700 170 690 220 Q 640 250 580 240 Q 510 220 480 190 Q 460 160 470 130 Z" />
        {/* Australia */}
        <path d="M 640 320 Q 690 315 715 340 Q 720 365 690 375 Q 650 370 640 350 Z" />
        {/* Antarctica */}
        <path d="M 100 415 L 700 415 Q 720 425 700 435 L 100 435 Q 80 425 100 415 Z" />
      </g>

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
      <text x="20" y="32" fontSize="10" fontFamily="IBM Plex Mono" fill="var(--ink-3)" letterSpacing="0.15em">PARAMETRIC ORACLE NETWORK</text>
      <text x="20" y="425" fontSize="9" fontFamily="IBM Plex Mono" fill="var(--ink-4)">Visualization not to geographic scale</text>
    </svg>
  );
};

// Animated trigger event modal — 4 phases
const TriggerEventModal = ({ event, phase, onClose }) => {
  const phases = [
    { idx: 0, label: "Idle", desc: "" },
    { idx: 1, label: "Oracle Alert", desc: "NHC advisory places a Cat 4 hurricane inside the parametric grid — central pressure 931mb at grid point P-14, below the 936mb payout threshold." },
    { idx: 2, label: "Verifying On-Chain", desc: "Aggregating NHC advisory attestations. Independent calculation agent evaluates the cat-in-a-grid condition per bond terms. Multi-sig guardian review." },
    { idx: 3, label: "Settled", desc: "Trigger confirmed at 100% payout tier. Protection-collateral vault releases $200M USDC to the Government of Jamaica — in days, versus the weeks of the conventional IBRD settlement path." },
  ];
  const cur = phases[phase];

  return (
    <div className="modal-back">
      <div className="modal" style={{ width: 640 }}>
        <div className="modal-head" style={{ background: phase === 3 ? "rgba(248, 113, 113, 0.08)" : "transparent" }}>
          <div className="row-flex gap-12">
            <div className="pulse" style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--danger)", boxShadow: "0 0 10px var(--danger)", animation: "pulse 1s ease-in-out infinite" }} />
            <div>
              <div className="label">Parametric Trigger Event</div>
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
              <div className="k">Oracle</div><div className="v">NOAA NHC · calc agent</div>
              <div className="k">Reading</div><div className="v">931mb @ grid P-14</div>
              <div className="k">Threshold</div><div className="v">≤ 936mb · 100% tier</div>
              <div className="k">Corroboration</div><div className="v">2 consecutive advisories</div>
            </div>
          )}

          {phase >= 3 && (
            <div className="alert-banner" style={{ background: "rgba(248, 113, 113, 0.08)", borderColor: "rgba(248, 113, 113, 0.4)" }}>
              <div className="pulse" />
              <div>
                <div style={{ color: "var(--ink-0)", fontSize: 14, fontWeight: 500 }}>Payout Executed</div>
                <div className="num" style={{ fontSize: 24, color: "var(--danger)", marginTop: 4 }}>{fmtUSDExact(event.payout)} <span style={{ fontSize: 12, color: "var(--ink-3)" }}>USDC → Government of Jamaica</span></div>
                <div className="mono mt-8" style={{ fontSize: 11, color: "var(--ink-3)" }}>tx 0xa7f3…920c · settled T+0 · gas 0.0042 ETH</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          {phase < 3 && <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>Running deterministic settlement…</span>}
          {phase >= 3 && (
            <>
              <button className="btn ghost" onClick={onClose}>Close</button>
              <button className="btn primary" onClick={onClose}>View Settlement Record</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ClaimsScreen, TriggerEventModal, WorldMap });
