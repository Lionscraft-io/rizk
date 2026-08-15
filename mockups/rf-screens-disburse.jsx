// Disbursement — controlled payout against pre-agreed purposes

const DisburseScreen = ({ goTo, phase }) => {
  const total = DISBURSEMENTS.reduce((s, d) => s + d.amount, 0);
  const released = DISBURSEMENTS.reduce((s, d) => s + d.released, 0);
  const isLive = phase === "payout";

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Controlled Disbursement · {isLive ? "Tier 2 payout — USD 14.0M authorised" : "Standby — pre-agreed plan"}</div>
          <h1 className="h-display" style={{ fontSize: 34 }}>Funds that flow only to <em>agreed purposes.</em></h1>
        </div>
        <div className="meta">
          <div className="stat"><div className="label">Authorised</div><div className="val">{isLive ? fmtUSD(total) : "—"}</div></div>
          <div className="vdivider" />
          <div className="stat"><div className="label">Released</div><div className="val" style={{ color: "var(--accent)" }}>{isLive ? fmtUSD(released) : "—"}</div></div>
          <div className="vdivider" />
          <div className="stat"><div className="label">Traceability</div><div className="val">100%</div></div>
        </div>
      </header>

      {!isLive && (
        <div className="card card-pad mb-24" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span className="chip">{phase === "calm" ? "Standby" : "Armed"}</span>
          <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
            {phase === "calm"
              ? "No payout active. The disbursement plan below is agreed, funded and rehearsed — it executes automatically in stages once a payout is authorised."
              : "Trigger watch active. Disbursement rails are armed; escrow addresses and milestone verifiers are on standby pending governance authorisation."}
            <span style={{ color: "var(--ink-3)" }}> Switch to the Payout phase (top right) to see it in motion.</span>
          </div>
        </div>
      )}

      {/* Funds flow */}
      <div className="card mb-24">
        <div className="card-head">
          <div className="label">Funds Flow</div>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>every hop is a ledger record</span>
        </div>
        <div className="card-pad">
          <div className="row-flex" style={{ gap: 0, width: "100%", flexWrap: "wrap" }}>
            {[
              ["Collateral account", "Tokenized MMF units", isLive ? "drawn" : "funded"],
              ["SPV payout account", "Tier payout amount", isLive ? fmtUSD(total) : "—"],
              ["Purpose escrows", "5 pre-agreed purposes", isLive ? "staged" : "standby"],
              ["Operator & vendor accounts", "Milestone-gated release", isLive ? fmtUSD(released) : "—"],
              ["Outcome reporting", "T+48h participant report", isLive ? "published" : "—"],
            ].map(([h, s, v], i, arr) => (
              <React.Fragment key={i}>
                <div style={{ flex: 1, minWidth: 150, padding: "14px 16px", background: "var(--bg-2)", border: "1px solid var(--line-2)", borderRadius: 6 }}>
                  <div style={{ fontSize: 12.5, color: "var(--ink-0)", fontWeight: 500 }}>{h}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{s}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--accent)", marginTop: 6 }}>{v}</div>
                </div>
                {i < arr.length - 1 && <Icon name="chevR" size={14} className="" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Purpose cards */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {DISBURSEMENTS.map(d => {
          const pct = isLive ? (d.released / d.amount) * 100 : 0;
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
                  <SectorDot sector={d.operator.includes("Serendib") ? "telecom" : d.operator.includes("Grid") ? "power" : "joint"} />
                  <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{d.operator}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 14 }}>{d.items}</div>
                <div className="meter"><span style={{ width: pct + "%" }} /></div>
                <div className="row-flex" style={{ justifyContent: "space-between", marginTop: 5, marginBottom: 12 }}>
                  <span className="label">{isLive ? `${fmtUSD(d.released)} released · ${pct.toFixed(0)}%` : "standby"}</span>
                </div>
                {d.milestones.map((m, i) => (
                  <div key={i} className="row-flex" style={{ justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--line-1)" }}>
                    <span style={{ fontSize: 12, color: "var(--ink-1)" }}>{m.m}</span>
                    {isLive ? <StepStatus status={m.status} /> : <span className="chip">Agreed</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Traceability card fills the grid */}
        <div className="card">
          <div className="card-head"><div className="label">Why Controlled Disbursement</div></div>
          <div className="card-pad">
            <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.65 }}>
              Payouts cover pre-agreed extraordinary emergency-response and restoration costs and defined
              public-service commitments — agreed <em style={{ color: "var(--ink-0)", fontStyle: "normal", fontWeight: 500 }}>before</em> the
              event, verified <em style={{ color: "var(--ink-0)", fontStyle: "normal", fontWeight: 500 }}>during</em> execution.
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
              After Cyclone Ditwah (Nov 2025), operators reported "largely restored" within days while the government–UN
              assessment later found outages of up to 14 days. Releases here are gated on measured data, not press releases.
            </div>
          </div>
        </div>
      </section>

      {/* Ledger */}
      <div className="card">
        <div className="card-head">
          <div className="label">Settlement Ledger {isLive ? "— TC Vidura payout" : "— rehearsal records"}</div>
          <span className={cls("chip", isLive ? "live" : "")}>{isLive ? "Reconciled 100%" : "Awaiting event"}</span>
        </div>
        {isLive ? (
          <table className="table">
            <thead>
              <tr><th>Time (IST)</th><th>Type</th><th>Detail</th><th>Ref</th><th style={{ textAlign: "right" }}>Amount</th></tr>
            </thead>
            <tbody>
              {LEDGER.map((l, i) => (
                <tr key={i}>
                  <td className="mono" style={{ fontSize: 11, whiteSpace: "nowrap" }}>{l.t}</td>
                  <td><span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.08em", color: l.type === "AUTHORISATION" ? "var(--warn)" : l.type === "MILESTONE" || l.type === "REPORT" ? "var(--info)" : "var(--accent)" }}>{l.type}</span></td>
                  <td style={{ fontSize: 12, color: "var(--ink-1)" }}>{l.detail}</td>
                  <td className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>{l.ref}</td>
                  <td className="num" style={{ textAlign: "right" }}>{l.amt ? fmtUSDExact(l.amt) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="card-pad" style={{ color: "var(--ink-3)", fontSize: 13 }}>
            No live payout records. Latest rehearsal: Dry-run #3 (2026-07-12) — synthetic Tier 1 event settled end-to-end in 26h with all controls passing.
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { DisburseScreen });
