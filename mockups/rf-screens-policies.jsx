// Policies — parametric protection contracts under the facility + pipeline

const PoliciesScreen = ({ goTo, phase }) => {
  const totalLimit = POLICIES.reduce((s, p) => s + p.limit, 0);
  const totalPremium = POLICIES.reduce((s, p) => s + p.premium, 0);
  const isPayout = phase === "payout";

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Policies · Protection written under {FACILITY.id}</div>
          <h1 className="h-display" style={{ fontSize: 34 }}>Pre-agreed protection, <em>per operator.</em></h1>
        </div>
        <div className="meta">
          <div className="stat"><div className="label">Active Policies</div><div className="val">{POLICIES.length}</div></div>
          <div className="vdivider" />
          <div className="stat"><div className="label">Limit Written</div><div className="val">{fmtUSD(totalLimit)}</div></div>
          <div className="vdivider" />
          <div className="stat"><div className="label">Annual Premium</div><div className="val" style={{ color: "var(--accent)" }}>{fmtUSD(totalPremium)}</div></div>
        </div>
      </header>

      {/* Active policy cards */}
      <section className="grid g-2 mb-24">
        {POLICIES.map(p => {
          const drawn = isPayout ? (p.id === "POL-TEL-01" ? 7_000_000 : 7_000_000) : 0;
          const drawnPct = (drawn / p.limit) * 100;
          return (
            <div key={p.id} className="card">
              <div className="card-head">
                <div className="row-flex gap-8">
                  <SectorDot sector={p.sector} />
                  <div className="label" style={{ color: "var(--ink-1)" }}>{p.id} · {p.operator}</div>
                </div>
                {isPayout ? <span className="chip danger">Tier 2 payout drawn</span> : <span className="chip live">Active</span>}
              </div>
              <div className="card-pad" style={{ paddingTop: 14 }}>
                <div className="grid g-4" style={{ gap: 14, marginBottom: 16 }}>
                  <div className="stat"><div className="label">Limit</div><div className="val" style={{ fontSize: 18 }}>{fmtUSD(p.limit)}</div></div>
                  <div className="stat"><div className="label">Rate on Line</div><div className="val" style={{ fontSize: 18 }}>{p.premiumRate}%</div></div>
                  <div className="stat"><div className="label">Premium</div><div className="val" style={{ fontSize: 18, color: "var(--accent)" }}>{fmtUSD(p.premium)}</div></div>
                  <div className="stat"><div className="label">Term</div><div className="val" style={{ fontSize: 12, paddingTop: 4 }}>{p.term}</div></div>
                </div>

                <div className="kv" style={{ gap: "10px 16px", marginBottom: 16 }}>
                  <div className="k">Hazard</div><div className="v" style={{ maxWidth: 320, whiteSpace: "normal" }}>{p.hazard}</div>
                  <div className="k">Trigger</div><div className="v" style={{ maxWidth: 320, whiteSpace: "normal" }}>{p.trigger}</div>
                  <div className="k">Payout use</div><div className="v" style={{ maxWidth: 320, whiteSpace: "normal", fontSize: 11.5 }}>{p.payoutUse}</div>
                </div>

                <div style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.55, marginBottom: 14 }}>
                  <span className="mono" style={{ fontSize: 9, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginRight: 8 }}>Commitments</span>
                  {p.commitments}
                </div>

                <div className={cls("meter", isPayout ? "danger" : "")}><span style={{ width: (isPayout ? drawnPct : 0) + "%" }} /></div>
                <div className="row-flex" style={{ justifyContent: "space-between", marginTop: 5 }}>
                  <span className="label">{isPayout ? `${fmtUSD(drawn)} drawn · ${drawnPct.toFixed(0)}% of limit` : "0% drawn · no qualifying event"}</span>
                  <button className="btn sm ghost" onClick={() => goTo(isPayout ? "disburse" : "trigger")}>
                    {isPayout ? "Disbursement" : "Trigger terms"} <Icon name="arrowR" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Pipeline + repeatability */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Policy Pipeline — next operators, hazards, sectors</div>
            <span className="chip solid">{POLICY_PIPELINE.length} in progress</span>
          </div>
          <table className="table">
            <thead>
              <tr><th>Candidate</th><th>Hazard</th><th style={{ textAlign: "right" }}>Target Limit</th><th>Status</th></tr>
            </thead>
            <tbody>
              {POLICY_PIPELINE.map(p => (
                <tr key={p.id} className="row">
                  <td>
                    <div className="row-flex gap-8">
                      <SectorDot sector={p.sector} />
                      <div>
                        <div style={{ fontSize: 13, color: "var(--ink-0)" }}>{p.operator}</div>
                        <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{p.id} · {p.note}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--ink-2)" }}>{p.hazard}</td>
                  <td className="num" style={{ textAlign: "right" }}>{fmtUSD(p.limit)}</td>
                  <td><span className="chip">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head"><div className="label">Why Policies Get Cheaper</div></div>
          <div className="card-pad">
            <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.65, marginBottom: 14 }}>
              Each policy reuses the facility's legal wrapper, validated trigger framework, AI monitoring stack and
              digital issuance rails — only the parametric box, exposure data and operator terms change.
            </div>
            <div className="kv">
              <div className="k">Components reusable</div><div className="v" style={{ color: "var(--accent)" }}>87%</div>
              <div className="k">Marginal structuring time</div><div className="v">~4 weeks</div>
              <div className="k">Marginal cost vs policy #1</div><div className="v" style={{ color: "var(--accent)" }}>−63%</div>
              <div className="k">Renewal path</div><div className="v">Same rails · re-price only</div>
            </div>
            <div className="divider" />
            <div style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.55 }}>
              This is measure B2 of the pilot framework: faster, simpler, more reusable processes make smaller bespoke
              transactions economical and repeatable.
            </div>
          </div>
        </div>
      </section>

      <div className="card card-pad" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Capacity behind these policies</div>
          <div style={{ color: "var(--ink-1)", fontSize: 13 }}>
            Policies are backed by the facility's fully collateralised capital stack — including the stablecoin vault funding the Class A risk notes.
          </div>
        </div>
        <button className="btn primary" onClick={() => goTo("vault")} style={{ flexShrink: 0 }}>Open Vault <Icon name="arrowR" /></button>
      </div>
    </div>
  );
};

Object.assign(window, { PoliciesScreen });
