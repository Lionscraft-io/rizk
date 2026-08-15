// Claims & Oracle monitor — live trigger conditions, animated payout demo (adapted from RIZK claims)

const RFClaimsScreen = ({ goTo, phase }) => {
  const [drift, setDrift] = useState(0);
  const [triggerEvent, setTriggerEvent] = useState(null);
  const [animPhase, setAnimPhase] = useState(0); // 0 idle, 1 alert, 2 verifying, 3 settled

  // Live tick — small oracle drift for numeric display
  useEffect(() => {
    const t = setInterval(() => setDrift(d => d + 1), 1800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!triggerEvent) return;
    setAnimPhase(1);
    const t1 = setTimeout(() => setAnimPhase(2), 1600);
    const t2 = setTimeout(() => setAnimPhase(3), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [triggerEvent]);

  const simulate = () => setTriggerEvent({ payout: 14_000_000, time: PHASE_META.event.clock });
  const reset = () => { setTriggerEvent(null); setAnimPhase(0); };

  const ts = TRIGGER_STATE[phase];

  // Trigger watches — phase-dependent
  const watches = {
    calm: [
      { title: "Cyclone — wind parameter", status: "NORMAL", note: "No system in basin · 14 kt baseline", warn: false, pct: 12 },
      { title: "Flood — rain-flood index", status: "NORMAL", note: "SW monsoon within range · index 21 / 60", warn: false, pct: 35 },
      { title: "Hydro-drought — SLHDI", status: "MONITORING", note: "Catchment rainfall 63rd pctile · attaches at 4th", warn: false, pct: 12 },
      { title: "Maldives cyclone (subscribing)", status: "NORMAL", note: "Coverage not yet incepted", warn: false, pct: 0 },
    ],
    event: [
      { title: "Cyclone — wind parameter", status: "TIER 2 BREACHED", note: "88 kt sustained · corroboration running", warn: true, pct: 88 },
      { title: "Flood — rain-flood index", status: "TIER 2 BREACHED", note: "Index 78 / 75 · Eastern province", warn: true, pct: 78 },
      { title: "Hydro-drought — SLHDI", status: "EASING", note: "Heavy rain lifts catchment percentile", warn: false, pct: 8 },
      { title: "Maldives cyclone (subscribing)", status: "NORMAL", note: "System tracking away from atolls", warn: false, pct: 15 },
    ],
    payout: [
      { title: "Cyclone — wind parameter", status: "CONFIRMED", note: "Peak 96 kt · tier 2 locked", warn: true, pct: 96 },
      { title: "Flood — rain-flood index", status: "CONFIRMED", note: "Peak 82 · post-event analysis running", warn: true, pct: 82 },
      { title: "Hydro-drought — SLHDI", status: "NOT MET", note: "Catchments refilled — opposite peril", warn: false, pct: 6 },
      { title: "Maldives cyclone (subscribing)", status: "NORMAL", note: "No impact", warn: false, pct: 5 },
    ],
  }[phase];

  const evals = phase === "payout" ? [EVAL_VIDURA, ...EVAL_HISTORY] : EVAL_HISTORY;

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Claims & Oracle Monitor · {PHASE_META[phase].tag}</div>
          <h1 className="h-display">Live <em>trigger conditions.</em></h1>
        </div>
        <div className="meta">
          <div className="stat">
            <div className="label">Feeds Healthy</div>
            <div className="val" style={{ color: "var(--accent)" }}>{SIGNALS.length} / {SIGNALS.length}</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">Active Watches</div>
            <div className="val" style={{ color: phase === "calm" ? "var(--ink-0)" : "var(--warn)" }}>{watches.filter(w => w.warn).length}</div>
          </div>
          <div className="vdivider" />
          <button className="btn" onClick={simulate} style={{ borderColor: "rgba(248,113,113,0.4)", color: "var(--danger)" }}>
            <Icon name="bolt" /> Simulate Trigger Event
          </button>
        </div>
      </header>

      {triggerEvent && (
        <RFTriggerEventModal event={triggerEvent} phase={animPhase} onClose={reset} />
      )}

      {/* Map + watches */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Parametric Box — Sri Lanka</div>
            <span className={cls("chip", PHASE_META[phase].chipClass)}>{PHASE_META[phase].chip}</span>
          </div>
          <LankaMap phase={phase} height={400} />
        </div>

        <div className="card">
          <div className="card-head">
            <div className="label">Trigger Watches</div>
          </div>
          <div>
            {watches.map((w, i) => (
              <div key={i} style={{ padding: "14px 22px", borderTop: i ? "1px solid var(--line-1)" : "none" }}>
                <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--ink-0)" }}>{w.title}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}>{w.note}</div>
                  </div>
                  <span className={cls("chip", w.warn ? "warn" : "")}>{w.status}</span>
                </div>
                <div className={cls("meter", w.warn ? "warn" : "")}>
                  <span style={{ width: w.pct + "%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live feeds table */}
      <div className="card mb-24">
        <div className="card-head">
          <div className="label">Live Data Feeds — EO + Operator Telemetry</div>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>Refreshing every 1.8s</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Signal</th>
              <th>Source</th>
              <th style={{ textAlign: "right" }}>Current</th>
              <th>Assessment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {SIGNALS.map((s, idx) => {
              const d = s[phase];
              let val = d.v;
              if (typeof val === "number") {
                const wiggle = Math.sin(drift * 1.3 + idx) * (val > 50 ? 0.6 : 0.15);
                val = +(val + wiggle).toFixed(1);
              }
              return (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontSize: 13, color: "var(--ink-0)" }}>{s.name}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{s.id} · {s.group}</div>
                  </td>
                  <td className="mono" style={{ fontSize: 11 }}>{s.source}</td>
                  <td className="num" style={{ textAlign: "right", color: d.alert ? "var(--danger)" : "var(--ink-0)", fontSize: 14 }}>
                    {val}<span style={{ color: "var(--ink-3)", marginLeft: 4, fontSize: 11 }}>{s.unit}</span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--ink-2)", maxWidth: 280 }}>{d.note}</td>
                  <td>
                    <span className={cls("chip", d.alert ? "danger" : "live")}>{d.alert ? "Alert" : "Healthy"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Historical evaluations */}
      <div className="card">
        <div className="card-head">
          <div className="label">Trigger Evaluations & Claims History</div>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>every evaluation on ledger</span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Event</th>
              <th>Outcome</th>
              <th style={{ textAlign: "right" }}>Payout</th>
              <th style={{ textAlign: "right" }}>Settlement</th>
            </tr>
          </thead>
          <tbody>
            {evals.map((r, i) => (
              <tr key={i} className={r.payout > 0 ? "" : ""}>
                <td className="mono" style={{ fontSize: 12 }}>{r.date}</td>
                <td style={{ fontSize: 12 }}>{r.event}</td>
                <td>
                  <span className={cls("chip", r.payout > 0 ? "danger" : r.outcome.includes("passed") || r.outcome.includes("reproduced") ? "live" : "")}>{r.outcome}</span>
                </td>
                <td className="num" style={{ textAlign: "right", color: r.payout > 0 ? "var(--danger)" : "var(--ink-3)" }}>
                  {r.payout > 0 ? fmtUSD(r.payout) : "—"}
                </td>
                <td className="mono" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-3)" }}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Animated trigger event modal — TC Vidura simulation
const RFTriggerEventModal = ({ event, phase, onClose }) => {
  const phases = [
    { idx: 0, label: "Idle", desc: "" },
    { idx: 1, label: "Trigger Alert", desc: "AI monitoring layer flags TC Vidura at 88 kt sustained inside the parametric box — Tier 2 wind threshold breached. Rain-flood index 78 corroborates. Independent calculation agent notified automatically." },
    { idx: 2, label: "Calculation & Authorisation", desc: "Calculation agent evaluates the parametric condition against the bond terms and confirms Tier 2. Facility Governance Board reviews and authorises the payout — resolution recorded on ledger." },
    { idx: 3, label: "Settled", desc: "USD 14.0M released from collateral: the philanthropic first-loss layer absorbs USD 4.0M, Class A vault principal reduces 71.4%. Funds stage into 5 pre-agreed purpose escrows for milestone-gated disbursement." },
  ];
  const cur = phases[phase];

  return (
    <div className="modal-back">
      <div className="modal" style={{ width: 640 }}>
        <div className="modal-head" style={{ background: phase === 3 ? "rgba(248, 113, 113, 0.08)" : "transparent" }}>
          <div className="row-flex gap-12">
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--danger)", boxShadow: "0 0 10px var(--danger)", animation: "pulse 1s ease-in-out infinite" }} />
            <div>
              <div className="label">Parametric Trigger Event · Simulation</div>
              <div className="h-section mt-8">TC Vidura — Sri Lanka Facility</div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" /></button>
        </div>

        <div className="modal-body">
          <div className="row-flex" style={{ marginBottom: 24 }}>
            {[1, 2, 3].map((p, i) => (
              <React.Fragment key={p}>
                <div style={{ flex: i < 2 ? 0 : 1, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    border: "1.5px solid " + (phase >= p ? "var(--danger)" : "var(--line-2)"),
                    background: phase >= p ? "var(--danger)" : "transparent",
                    color: phase >= p ? "#fff" : "var(--ink-3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontFamily: "IBM Plex Mono", transition: "all 0.3s",
                  }}>{p}</div>
                  <div className="mono" style={{ fontSize: 10, color: phase >= p ? "var(--ink-0)" : "var(--ink-3)", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {phases[p].label}
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
              <div className="k">Triggered at</div><div className="v">{event.time}</div>
              <div className="k">Wind reading</div><div className="v">88 kt · Tier 2 ≥ 85 kt</div>
              <div className="k">Rain-flood index</div><div className="v">78 · Tier 2 ≥ 75</div>
              <div className="k">Calculation agent</div><div className="v">Independent · model v2.4</div>
              <div className="k">Decision authority</div><div className="v">Facility Governance Board</div>
            </div>
          )}

          {phase >= 3 && (
            <div className="alert-banner" style={{ background: "rgba(248, 113, 113, 0.08)", borderColor: "rgba(248, 113, 113, 0.4)" }}>
              <div className="pulse" />
              <div>
                <div style={{ color: "var(--ink-0)", fontSize: 14, fontWeight: 500 }}>Payout Authorised & Settled</div>
                <div className="num" style={{ fontSize: 24, color: "var(--danger)", marginTop: 4 }}>{fmtUSDExact(event.payout)} <span style={{ fontSize: 12, color: "var(--ink-3)" }}>→ 5 purpose escrows</span></div>
                <div className="mono mt-8" style={{ fontSize: 11, color: "var(--ink-3)" }}>resolution GOV-2026-0007 · settled T+0 · first-loss $4M + Class A $10M</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          {phase < 3 && <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>Running governed settlement…</span>}
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

Object.assign(window, { RFClaimsScreen, RFTriggerEventModal });
