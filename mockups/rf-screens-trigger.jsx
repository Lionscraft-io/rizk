// Trigger console — parametric calculation, tiers, governance workflow

const TriggerScreen = ({ goTo, phase }) => {
  const ts = TRIGGER_STATE[phase];
  const meta = PHASE_META[phase];
  const wf = WORKFLOW[phase];

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Trigger Console · {meta.tag}</div>
          <h1 className="h-display" style={{ fontSize: 34 }}>Parametric, graduated, <em>institutionally governed.</em></h1>
        </div>
        <div className="meta">
          <div className="stat"><div className="label">Peak Wind</div><div className="val" style={{ color: ts.windPeak >= 64 ? "var(--danger)" : "var(--ink-0)" }}>{ts.windPeak} kt</div></div>
          <div className="vdivider" />
          <div className="stat"><div className="label">Peak Rain Index</div><div className="val" style={{ color: ts.rainPeak >= 60 ? "var(--danger)" : "var(--ink-0)" }}>{ts.rainPeak}</div></div>
          <div className="vdivider" />
          <div className="stat"><div className="label">Tier Attained</div><div className="val" style={{ color: ts.tierMet ? "var(--danger)" : "var(--accent)" }}>{ts.tierMet || "—"}</div></div>
        </div>
      </header>

      {phase !== "calm" && (
        <div className={cls("alert-banner mb-24", phase === "event" ? "" : "")} style={phase === "event" ? { background: "rgba(245,185,65,0.07)", borderColor: "rgba(245,185,65,0.4)" } : {}}>
          <span className="pulse" style={phase === "event" ? { background: "var(--warn)", boxShadow: "0 0 10px var(--warn)" } : {}} />
          <div style={{ fontSize: 13 }}>
            {phase === "event"
              ? "Tier 2 wind threshold breached 04:52 IST. Calculation agent corroborating with rainfall index and secondary evidence."
              : "Trigger confirmed at Tier 2 by calculation agent 2026-12-05 08:30 IST. Payout of USD 14.0M authorised by Governance Board 09:12 IST."}
          </div>
        </div>
      )}

      <section className="grid mb-24" style={{ gridTemplateColumns: "1.35fr 1fr" }}>
        {/* Trigger parameters */}
        <div className="card">
          <div className="card-head">
            <div className="label">Trigger Parameters — Live Calculation</div>
            <span className={cls("chip", ts.statusClass)}>{ts.status}</span>
          </div>
          <div className="card-pad">
            <TierGauge
              label={TRIGGER.windParam}
              value={ts.wind} max={120} unit="kt"
              color={ts.wind >= 64 ? "var(--danger)" : "var(--accent)"}
              tiers={[{ at: 64, label: "T1 · 64" }, { at: 85, label: "T2 · 85" }, { at: 100, label: "T3 · 100" }]}
            />
            <div style={{ height: 22 }} />
            <TierGauge
              label={TRIGGER.rainParam}
              value={ts.rain} max={100} unit="/100"
              color={ts.rain >= 60 ? "var(--danger)" : "var(--accent)"}
              tiers={[{ at: 60, label: "T1 · 60" }, { at: 75, label: "T2 · 75" }, { at: 90, label: "T3 · 90" }]}
            />
            <div className="divider" />

            {/* Tier table */}
            <table className="table">
              <thead>
                <tr><th>Tier</th><th>Wind</th><th>Rain/Flood</th><th style={{ textAlign: "right" }}>Payout</th><th style={{ textAlign: "right" }}>Amount</th><th></th></tr>
              </thead>
              <tbody>
                {TRIGGER.tiers.map(t => {
                  const met = ts.tierMet >= t.tier;
                  return (
                    <tr key={t.tier}>
                      <td className="mono" style={{ color: met ? "var(--danger)" : "var(--ink-0)" }}>Tier {t.tier}</td>
                      <td className="num">≥ {t.wind} kt</td>
                      <td className="num">≥ {t.rain}</td>
                      <td className="num" style={{ textAlign: "right" }}>{t.payoutPct}%</td>
                      <td className="num" style={{ textAlign: "right" }}>{fmtUSD(t.payout)}</td>
                      <td style={{ textAlign: "right" }}>{met ? <span className="chip danger">Attained</span> : <span className="chip">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 12, lineHeight: 1.55 }}>{TRIGGER.logic} {TRIGGER.window}.</div>
          </div>
        </div>

        {/* Governance workflow */}
        <div className="col gap-16">
          <div className="card">
            <div className="card-head"><div className="label">Trigger-to-Payout Workflow</div></div>
            <div>
              {wf.map((w, i) => (
                <div key={i} className="row-flex" style={{ padding: "13px 22px", borderTop: i ? "1px solid var(--line-1)" : "none", justifyContent: "space-between", gap: 12 }}>
                  <div className="row-flex gap-12" style={{ minWidth: 0 }}>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)", minWidth: 14 }}>{i + 1}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "var(--ink-0)" }}>{w.step}</div>
                      <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}>{w.who}</div>
                    </div>
                  </div>
                  <StepStatus status={w.status} />
                </div>
              ))}
            </div>
          </div>

          {phase === "calm" ? (
            <div className="card">
              <div className="card-head"><div className="label">Dry Runs & Validation</div><span className="chip live">3 passed</span></div>
              <div>
                {DRY_RUNS.map((d, i) => (
                  <div key={d.id} style={{ padding: "13px 22px", borderTop: i ? "1px solid var(--line-1)" : "none" }}>
                    <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 4 }}>
                      <span className="mono" style={{ fontSize: 11, color: "var(--ink-0)" }}>{d.id} · {d.date}</span>
                      <StepStatus status={d.status} />
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-1)" }}>{d.scenario}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 3 }}>{d.result}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-head"><div className="label">Calculation Record</div><span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>on ledger</span></div>
              <div className="card-pad">
                <div className="kv">
                  <div className="k">Event</div><div className="v">TC Vidura · 2026-12</div>
                  <div className="k">Box entry</div><div className="v">2026-12-04 04:02 IST</div>
                  <div className="k">T2 wind breach</div><div className="v">2026-12-04 04:52 IST</div>
                  <div className="k">Corroboration</div><div className="v">{phase === "event" ? "Running — rain 78 ≥ 75" : "Complete · rain 82"}</div>
                  <div className="k">Confirmation</div><div className="v">{phase === "event" ? "Pending" : "2026-12-05 08:30 IST"}</div>
                  <div className="k">Authorisation</div><div className="v">{phase === "event" ? "Board convened" : "GOV-2026-0007 · 09:12"}</div>
                  <div className="k">Funds released</div><div className="v" style={{ color: phase === "payout" ? "var(--accent)" : "var(--ink-0)" }}>{phase === "event" ? "—" : "09:21 IST · T+0"}</div>
                </div>
                {phase === "payout" && (
                  <button className="btn primary mt-16" style={{ width: "100%" }} onClick={() => goTo("disburse")}>
                    View Controlled Disbursement <Icon name="arrowR" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="card card-pad" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <Icon name="flag" size={18} />
        <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink-0)" }}>Who decides what.</strong> AI-assisted analysis supports event detection and
          measurement. The parametric calculation is performed by the independent calculation agent under the bond terms;
          payout authorisation rests with the Facility Governance Board. The digital settlement layer executes and records
          the approved decision — nothing more.
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { TriggerScreen });
