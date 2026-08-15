// Reporting — results measurement framework (A–D) + commitments performance

const ReportScreen = ({ goTo, phase }) => {
  const isPost = phase === "payout";

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Results Measurement · Framework A–D</div>
          <h1 className="h-display" style={{ fontSize: 34 }}>Evidence, not <em>anecdotes.</em></h1>
        </div>
        <div className="meta">
          <div className="stat"><div className="label">Reporting Cadence</div><div className="val" style={{ fontSize: 22 }}>Monthly + T+48h</div></div>
          <div className="vdivider" />
          <div className="stat"><div className="label">Ledger Records</div><div className="val">4,318</div></div>
          <div className="vdivider" />
          <div className="stat"><div className="label">Reconciliation</div><div className="val" style={{ color: "var(--accent)" }}>100%</div></div>
        </div>
      </header>

      {!isPost && (
        <div className="card card-pad mb-24" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span className="chip">Baseline</span>
          <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
            Values below show pilot targets and issuance-phase actuals. Post-event outcome metrics (A2, A3, D1) populate
            fully after a payout — switch to the Payout phase to see the TC Vidura simulation.
          </div>
        </div>
      )}

      {/* Framework sections */}
      {RESULTS.map(sec => (
        <section key={sec.code} className="mb-24">
          <div className="row-flex gap-12 mb-8" style={{ paddingLeft: 2 }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--accent)" }}>({sec.code})</span>
            <span className="eyebrow" style={{ color: "var(--ink-2)" }}>{sec.title}</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${Math.max(sec.metrics.length, 2)}, 1fr)` }}>
            {sec.metrics.map(m => {
              const isOutcome = ["A2", "A3", "D1"].includes(m.id);
              const dimmed = isOutcome && !isPost;
              return (
                <div key={m.id} className="card card-pad" style={dimmed ? { opacity: 0.55 } : {}}>
                  <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                    <span className="label">{m.id} · {m.name}</span>
                    {dimmed && <span className="chip" style={{ height: 18, fontSize: 9 }}>post-event</span>}
                  </div>
                  <div className="num" style={{ fontSize: 30, color: dimmed ? "var(--ink-2)" : "var(--accent)", lineHeight: 1 }}>{m.val}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-1)", marginTop: 10, lineHeight: 1.5 }}>{m.sub}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 8 }}>{m.benchmark}</div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Commitments performance */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Public-Service Commitments {isPost ? "— TC Vidura performance" : "— agreed targets"}</div>
            {isPost && <span className="chip live">Verified reporting</span>}
          </div>
          <table className="table">
            <thead>
              <tr><th>Commitment</th><th>Target</th>{isPost && <th>Actual</th>}<th style={{ textAlign: "right" }}>Status</th></tr>
            </thead>
            <tbody>
              {COMMITMENTS_PERF.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12.5, color: "var(--ink-0)" }}>{c.c}</td>
                  <td className="mono" style={{ fontSize: 11, color: "var(--ink-2)" }}>{c.target}</td>
                  {isPost && <td style={{ fontSize: 12, color: "var(--ink-1)" }}>{c.actual}</td>}
                  <td style={{ textAlign: "right" }}>{isPost ? <StepStatus status={c.status} /> : <span className="chip">Agreed</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head"><div className="label">Report Library</div></div>
          <div>
            {[
              ["Monthly participant report", "Coverage, signals, capital, governance minutes", "Jul 2026"],
              ["Model validation report", "Independent review of cat model v2.4", "Jun 2026"],
              ["Dry-run results — DR-01–03", "End-to-end rehearsal evidence", "Jul 2026"],
              isPost && ["T+48h payout traceability report", "All flows reconciled · RPT-D1-004", "Dec 2026"],
              isPost && ["Event outcome report — TC Vidura", "A2/A3 outcome measurement, model refinement", "Dec 2026"],
            ].filter(Boolean).map(([h, s, d], i) => (
              <div key={i} className="row-flex" style={{ padding: "13px 22px", borderTop: i ? "1px solid var(--line-1)" : "none", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-0)" }}>{h}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{s}</div>
                </div>
                <div className="row-flex gap-12" style={{ flexShrink: 0 }}>
                  <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{d}</span>
                  <button className="btn sm ghost">PDF</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="card card-pad" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <Icon name="book" size={18} />
        <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink-0)" }}>Why this matters.</strong> Auditable transaction and authorisation
          records, traceable funding and payouts, and verified reporting against agreed commitments give sponsors, donors
          and investors clear evidence of how the transaction operated, where funding flowed, and what additional outcomes
          it enabled — the basis for renewal and for scaling to other operators, hazards and sectors.
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ReportScreen });
