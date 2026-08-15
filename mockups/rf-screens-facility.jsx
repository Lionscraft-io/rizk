// Facility — bond structure, capital stack, participation, digital asset rails

const FacilityScreen = ({ goTo, phase, onParticipate }) => {
  const funded = TRANCHES.reduce((s, t) => s + t.funded, 0);
  const colors = { "NOTE-A": "var(--accent)", "GRANT-F": "#b08cff", "FUND-P": "#7aa5ff" };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Facility · {FACILITY.spv}</div>
          <h1 className="h-display" style={{ fontSize: 34 }}>One instrument, <em>three sources of capital.</em></h1>
        </div>
        <div className="meta">
          <div className="stat"><div className="label">Notional</div><div className="val">$20.0M</div></div>
          <div className="vdivider" />
          <div className="stat"><div className="label">Funded</div><div className="val" style={{ color: "var(--accent)" }}>{fmtUSD(funded)}</div></div>
          <div className="vdivider" />
          <div className="stat"><div className="label">Participants</div><div className="val">{TRANCHES.reduce((s, t) => s + t.holders, 0)}</div></div>
        </div>
      </header>

      <section className="grid mb-24" style={{ gridTemplateColumns: "1fr 1.5fr" }}>
        {/* Terms */}
        <div className="card">
          <div className="card-head"><div className="label">Bond Terms</div><span className="chip live">Active</span></div>
          <div className="card-pad">
            <div className="kv" style={{ gap: "14px 16px" }}>
              <div className="k">Instrument</div><div className="v" style={{ maxWidth: 240, whiteSpace: "normal", lineHeight: 1.5 }}>{FACILITY.instrument}</div>
              <div className="k">Issuer</div><div className="v">{FACILITY.spv}</div>
              <div className="k">Notional</div><div className="v">USD 20,000,000</div>
              <div className="k">Hazard</div><div className="v" style={{ maxWidth: 240, whiteSpace: "normal" }}>{FACILITY.hazard}</div>
              <div className="k">Parametric box</div><div className="v">{FACILITY.box}</div>
              <div className="k">Term</div><div className="v">{FACILITY.term}</div>
              <div className="k">Trigger</div><div className="v" style={{ maxWidth: 240, whiteSpace: "normal" }}>Graduated · 3 tiers · 40 / 70 / 100%</div>
              <div className="k">Calculation agent</div><div className="v" style={{ maxWidth: 240, whiteSpace: "normal" }}>Independent · validated cat model</div>
              <div className="k">Collateral</div><div className="v">Tokenized MMF units · segregated</div>
              <div className="k">Settlement</div><div className="v">Regulated DLT · T+0</div>
              <div className="k">Sponsor</div><div className="v" style={{ maxWidth: 240, whiteSpace: "normal" }}>{FACILITY.sponsor}</div>
              <div className="k">Governance</div><div className="v" style={{ maxWidth: 240, whiteSpace: "normal" }}>{FACILITY.governance}</div>
            </div>
          </div>
        </div>

        {/* Tranches */}
        <div className="col gap-16">
          {TRANCHES.map(t => {
            const pct = (t.funded / t.size) * 100;
            return (
              <div key={t.id} className="card">
                <div className="card-head">
                  <div className="row-flex gap-8">
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: colors[t.id] }} />
                    <div className="label" style={{ color: "var(--ink-1)" }}>{t.name}</div>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{t.token}</span>
                  </div>
                  <button className="btn sm primary" onClick={() => onParticipate(t)}>{t.type === "investor" ? "Subscribe" : "Contribute"}</button>
                </div>
                <div className="card-pad" style={{ paddingTop: 14 }}>
                  <div style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 14, lineHeight: 1.55 }}>{t.desc}</div>
                  <div className="row-flex gap-24" style={{ marginBottom: 12 }}>
                    <div className="stat"><div className="label">Size</div><div className="val" style={{ fontSize: 17 }}>{fmtUSD(t.size)}</div></div>
                    <div className="stat"><div className="label">Funded</div><div className="val" style={{ fontSize: 17, color: colors[t.id] }}>{fmtUSD(t.funded)}</div></div>
                    <div className="stat"><div className="label">{t.type === "investor" ? "Coupon" : "Return"}</div><div className="val" style={{ fontSize: 17 }}>{t.coupon ? t.coupon + "%" : "Impact"}</div></div>
                    <div className="stat"><div className="label">Holders</div><div className="val" style={{ fontSize: 17 }}>{t.holders}</div></div>
                    <div className="stat"><div className="label">Attachment</div><div className="val" style={{ fontSize: 12, paddingTop: 3 }}>{t.attach}</div></div>
                  </div>
                  <div className="meter"><span style={{ width: pct + "%", background: colors[t.id] }} /></div>
                  <div className="row-flex" style={{ justifyContent: "space-between", marginTop: 5 }}>
                    <span className="label">{pct.toFixed(0)}% subscribed</span>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>min ticket {fmtUSD(t.minTicket)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Participation + rails */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Participants</div>
            <div className="row-flex gap-8">
              <span className="chip">9 new to ILS / DRF</span>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr><th>Participant</th><th>Type</th><th>Tranche</th><th style={{ textAlign: "right" }}>Amount</th><th></th></tr>
            </thead>
            <tbody>
              {PARTICIPANTS.map((p, i) => (
                <tr key={i} className="row">
                  <td style={{ color: "var(--ink-0)" }}>{p.name}</td>
                  <td style={{ color: "var(--ink-2)", fontSize: 12 }}>{p.type}</td>
                  <td><span className="mono" style={{ fontSize: 11, color: colors[p.tranche] }}>{p.tranche}</span></td>
                  <td className="num" style={{ textAlign: "right" }}>{fmtUSD(p.amount)}</td>
                  <td>{p.newTo && <span className="chip" style={{ height: 18, fontSize: 9 }}>new to {p.newTo}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head"><div className="label">Digital Asset Rails</div><span className="chip live">Operational</span></div>
          <div>
            {[
              ["Issuance & subscription", "Tokenized notes and contribution records with built-in eligibility and transfer controls. KYC allowlist enforced at token layer."],
              ["Earmarked contributions", "Each donor record binds sponsor, protection period, amount and eligible purpose — verifiable without manual reconciliation."],
              ["Settlement & custody", "Subscriptions, premiums, contributions and payouts settle T+0 through Fireblocks wallet infrastructure, with collateral held in custody at BNY."],
              ["Controlled disbursement", "Payouts release in stages against verified milestones — funds flow only to pre-agreed purposes."],
              ["Oracle & record-keeping", "Hazard and telemetry data reach the contract through Chainlink. Every authorisation, transfer and milestone is an auditable ledger record."],
            ].map(([h, b], i) => (
              <div key={i} style={{ padding: "13px 22px", borderTop: i ? "1px solid var(--line-1)" : "none" }}>
                <div style={{ fontSize: 13, color: "var(--ink-0)", fontWeight: 500, marginBottom: 3 }}>{h}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.55 }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance note */}
      <div className="card card-pad" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <Icon name="shield" size={18} className="" />
        <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink-0)" }}>Governance boundary.</strong> The catastrophe model, trigger, legal entitlement
          and payout authorisation remain within the agreed institutional governance framework. Digital systems execute and
          record approved processes — they do not determine financial entitlements, payout decisions or operational outcomes.
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { FacilityScreen });
