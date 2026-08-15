// Payouts — controlled disbursement against pre-agreed purposes (Sri Lanka pilot)
// Standby by default; `sim` shows the TC Vidura Tier 2 payout in motion.

const PayoutsScreen = ({ goTo, sim, setSim }) => {
  const total = SL_DISBURSEMENTS.reduce((s, d) => s + d.amount, 0);
  const released = SL_DISBURSEMENTS.reduce((s, d) => s + d.released, 0);

  const msChip = (status) => {
    const map = { "Verified": "live", "In progress": "warn", "Pending": "" };
    return <span className={cls("chip", map[status] ?? "")}>{status}</span>;
  };
  const sectorColor = { telecom: "#4a9eff", power: "#f5b941", joint: "var(--accent)" };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Payouts · Controlled Disbursement {sim ? "· Simulated Tier 2 event — TC Vidura" : "· Standby"}</div>
          <h1 className="h-display" style={{ fontSize: 36 }}>Funds that flow only to <em>agreed purposes.</em></h1>
        </div>
        <div className="meta">
          <div className="stat">
            <div className="label">Authorised</div>
            <div className="val">{sim ? fmtUSD(total) : "—"}</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">Released</div>
            <div className="val" style={{ color: "var(--accent)" }}>{sim ? fmtUSD(released) : "—"}</div>
          </div>
          <div className="vdivider" />
          <button
            className="btn"
            onClick={() => setSim(!sim)}
            style={sim ? {} : { borderColor: "rgba(248,113,113,0.4)", color: "var(--danger)" }}
          >
            <Icon name={sim ? "chevL" : "bolt"} /> {sim ? "Reset to Standby" : "Simulate Tier 2 Payout"}
          </button>
        </div>
      </header>

      {sim ? (
        <div className="alert-banner mb-24">
          <span className="pulse" />
          <div style={{ fontSize: 13 }}>
            Tier 2 trigger confirmed — USD 14.0M payout authorised (GOV-2026-0007). Controlled disbursement in progress
            across 5 pre-agreed purposes; VLT-CYC-001 principal reduced 71.4%.
          </div>
        </div>
      ) : (
        <div className="card card-pad mb-24" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span className="chip">Standby</span>
          <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
            No payout active. The disbursement plan below is agreed, funded and rehearsed — it executes automatically
            in stages once a trigger is confirmed and the governance board authorises a payout.
          </div>
        </div>
      )}

      {/* Funds flow */}
      <div className="card mb-24">
        <div className="card-head">
          <div className="label">Funds Flow</div>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>every hop is a ledger record</span>
        </div>
        <div className="card-pad">
          <div className="row-flex" style={{ gap: 0, width: "100%", flexWrap: "wrap" }}>
            {[
              ["Protection-collateral vault", "VLT-CYC-001 · tokenized MMF", sim ? "drawn" : "funded"],
              ["SPV payout account", "Tier payout amount", sim ? fmtUSD(total) : "—"],
              ["Purpose escrows", "5 pre-agreed purposes", sim ? "staged" : "standby"],
              ["Operator & vendor accounts", "Milestone-gated release", sim ? fmtUSD(released) : "—"],
              ["Outcome reporting", "T+48h participant report", sim ? "published" : "—"],
            ].map(([h, s, v], i, arr) => (
              <React.Fragment key={i}>
                <div style={{ flex: 1, minWidth: 150, padding: "14px 16px", background: "var(--bg-2)", border: "1px solid var(--line-2)", borderRadius: 6 }}>
                  <div style={{ fontSize: 12.5, color: "var(--ink-0)", fontWeight: 500 }}>{h}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{s}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--accent)", marginTop: 6 }}>{v}</div>
                </div>
                {i < arr.length - 1 && <Icon name="chevR" size={14} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Purpose cards */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {SL_DISBURSEMENTS.map(d => {
          const pct = sim ? (d.released / d.amount) * 100 : 0;
          return (
            <div key={d.id} className="card">
              <div className="card-head">
                <div className="row-flex gap-8">
                  <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{d.id}</span>
                  <div className="label" style={{ color: "var(--ink-1)", letterSpacing: "0.06em" }}>{d.purpose}</div>
                </div>
                <span className="num" style={{ fontSize: 13, color: "var(--ink-0)", flexShrink: 0 }}>{fmtUSD(d.amount)}</span>
              </div>
              <div className="card-pad" style={{ paddingTop: 14 }}>
                <div className="row-flex gap-8 mb-8">
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: sectorColor[d.sector], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{d.operator}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 14 }}>{d.items}</div>
                <div className="meter"><span style={{ width: pct + "%" }} /></div>
                <div className="row-flex" style={{ justifyContent: "space-between", marginTop: 5, marginBottom: 12 }}>
                  <span className="label">{sim ? `${fmtUSD(d.released)} released · ${pct.toFixed(0)}%` : "standby · 0% released"}</span>
                </div>
                {d.milestones.map((m, i) => (
                  <div key={i} className="row-flex" style={{ justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--line-1)" }}>
                    <span style={{ fontSize: 12, color: "var(--ink-1)" }}>{m.m}</span>
                    {sim ? msChip(m.status) : <span className="chip">Agreed</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Why controlled disbursement */}
        <div className="card">
          <div className="card-head"><div className="label">Why Controlled Disbursement</div></div>
          <div className="card-pad">
            <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.65 }}>
              Payouts cover pre-agreed extraordinary emergency-response and restoration costs and defined
              public-service commitments — agreed <strong style={{ color: "var(--ink-0)" }}>before</strong> the
              event, verified <strong style={{ color: "var(--ink-0)" }}>during</strong> execution.
            </div>
            <div className="divider" />
            <div className="kv">
              <div className="k">Release model</div><div className="v">Staged · milestone-gated</div>
              <div className="k">Verification</div><div className="v">Independent telemetry · not operator claims</div>
              <div className="k">Funding trace</div><div className="v">Source → purpose → outcome</div>
              <div className="k">Unspent funds</div><div className="v">Return to SPV at term end</div>
            </div>
            <div className="divider" />
            <div style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.55 }}>
              Lesson from Cyclone Ditwah (Nov 2025): operators reported "largely restored" within days while the
              government–UN assessment later found outages of up to 14 days. Milestone releases here are gated on
              measured data — traffic indices, SCADA, satellite imagery — not press releases.
            </div>
          </div>
        </div>
      </section>

      {/* Ledger */}
      <div className="card">
        <div className="card-head">
          <div className="label">Settlement Ledger {sim ? "— TC Vidura payout (simulated)" : "— latest rehearsal (DR-03)"}</div>
          <span className={cls("chip", sim ? "live" : "")}>{sim ? "Reconciled 100%" : "Awaiting event"}</span>
        </div>
        <table className="table">
          <thead>
            <tr><th>Time (IST)</th><th>Type</th><th>Detail</th><th>Ref</th><th style={{ textAlign: "right" }}>Amount</th></tr>
          </thead>
          <tbody>
            {(sim ? SL_LEDGER : SL_REHEARSAL).map((l, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 11, whiteSpace: "nowrap" }}>{l.t}</td>
                <td><span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.08em", color: l.type === "AUTHORISATION" ? "var(--warn)" : l.type === "MILESTONE" || l.type === "REPORT" || l.type === "DRY RUN" ? "var(--info)" : "var(--accent)" }}>{l.type}</span></td>
                <td style={{ fontSize: 12, color: "var(--ink-1)" }}>{l.detail}</td>
                <td className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{l.ref}</td>
                <td className="num" style={{ textAlign: "right" }}>{l.amt ? fmtUSDExact(l.amt) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Object.assign(window, { PayoutsScreen });
