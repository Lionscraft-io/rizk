// Cedent-side views (Sri Lanka pilot edition)

const CedentDashboard = ({ goTo }) => {
  const totalLimit = COVERAGES.reduce((s, c) => s + c.limit, 0);
  const totalPosted = COVERAGES.reduce((s, c) => s + c.posted, 0);
  const totalPremium = COVERAGES.reduce((s, c) => s + c.premium, 0);
  const active = COVERAGES.filter(c => c.status === "Active");

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Cedent Portal · Serendib Telecom · SLCIR</div>
          <h1 className="h-display">Risk transfer, <em>onchain.</em></h1>
        </div>
        <div className="meta">
          <button className="btn primary" onClick={() => setNewCoverage(true)}><Icon name="plus" /> Request New Coverage</button>
        </div>
      </header>

      <section className="grid g-4 mb-24">
        <div className="card card-pad">
          <div className="label mb-8">Total Coverage Limit</div>
          <div className="num" style={{ fontSize: 28, color: "var(--ink-0)" }}>{fmtUSD(totalLimit)}</div>
          <div className="mono mt-8" style={{ fontSize: 11, color: "var(--ink-3)" }}>Across {COVERAGES.length} policies</div>
        </div>
        <div className="card card-pad">
          <div className="label mb-8">Capital Posted</div>
          <div className="num" style={{ fontSize: 28, color: "var(--accent)" }}>{fmtUSD(totalPosted)}</div>
          <div className="mono mt-8" style={{ fontSize: 11, color: "var(--ink-3)" }}>{(totalPosted / totalLimit * 100).toFixed(1)}% of limit filled</div>
        </div>
        <div className="card card-pad">
          <div className="label mb-8">Premium Committed</div>
          <div className="num" style={{ fontSize: 28, color: "var(--ink-0)" }}>{fmtUSD(totalPremium)}</div>
          <div className="mono mt-8" style={{ fontSize: 11, color: "var(--ink-3)" }}>Annualized · all policies</div>
        </div>
        <div className="card card-pad">
          <div className="label mb-8">Avg Settlement</div>
          <div className="num" style={{ fontSize: 28, color: "var(--ink-0)" }}>T+0</div>
          <div className="mono mt-8" style={{ fontSize: 11, color: "var(--accent)" }}>vs T+90 traditional</div>
        </div>
      </section>

      <section className="grid mb-24" style={{ gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Active Coverage</div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Policy</th>
                <th>Risk</th>
                <th style={{ textAlign: "right" }}>Limit</th>
                <th style={{ textAlign: "right" }}>Posted</th>
                <th style={{ textAlign: "right" }}>Utilization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {COVERAGES.map(c => {
                const v = c.vaultId ? VAULTS.find(v => v.id === c.vaultId) : null;
                return (
                  <tr key={c.id} className="row" onClick={() => v && goTo("vault", c.vaultId)}>
                    <td>
                      <div className="mono" style={{ fontSize: 12, color: "var(--ink-0)" }}>{c.id}</div>
                    </td>
                    <td>
                      <div className="row-flex gap-8">
                        {v && <CatDot cat={v.category} />}
                        <span style={{ fontSize: 12 }}>{v?.name || c.name}</span>
                      </div>
                    </td>
                    <td className="num" style={{ textAlign: "right" }}>{fmtUSD(c.limit)}</td>
                    <td className="num" style={{ textAlign: "right" }}>{fmtUSD(c.posted)}</td>
                    <td className="num" style={{ textAlign: "right" }}>
                      {c.utilization.toFixed(1)}%
                      <div className="meter mt-8" style={{ width: 80, marginLeft: "auto" }}>
                        <span style={{ width: c.utilization + "%" }} />
                      </div>
                    </td>
                    <td><StatusChip status={c.status === "Active" ? "active" : "draft"} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="label">Coverage Health</div>
          </div>
          <div style={{ padding: 22 }}>
            <div className="kv mb-24">
              <div className="k">Counter-party</div><div className="v">212 investors</div>
              <div className="k">Avg Pos. Age</div><div className="v">4.2 months</div>
              <div className="k">Largest Holder</div><div className="v">3.8%</div>
              <div className="k">Re-pricing</div><div className="v">Continuous</div>
              <div className="k">Legal Wrapper</div><div className="v">Bermuda SC</div>
              <div className="k">Regulator</div><div className="v">BMA</div>
            </div>
            <div className="divider" />
            <div className="label mb-16">Premium Schedule</div>
            {[
              { date: "2026-09-30", amount: 418_000, label: "Q3 distribution" },
              { date: "2026-12-31", amount: 418_000, label: "Q4 distribution" },
              { date: "2027-03-31", amount: 418_000, label: "Q1 distribution" },
            ].map((p, i) => (
              <div key={i} className="row-flex" style={{ padding: "10px 0", borderTop: i ? "1px solid var(--line-1)" : "none", justifyContent: "space-between" }}>
                <div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--ink-0)" }}>{p.date}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{p.label}</div>
                </div>
                <div className="num" style={{ fontSize: 14, color: "var(--ink-0)" }}>{fmtUSD(p.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why onchain */}
      <div className="card">
        <div className="card-head">
          <div className="label">Onchain vs Traditional</div>
        </div>
        <div className="grid g-4" style={{ padding: 22, gap: 0 }}>
          {[
            ["Settlement", "T+0", "T+30–90"],
            ["Capacity Discovery", "Continuous", "Annual broker cycle"],
            ["Min Position", "$100", "$250K+"],
            ["Secondary Liquidity", "Onchain order book", "Effectively none"],
          ].map(([k, a, b], i) => (
            <div key={i} style={{ borderRight: i < 3 ? "1px solid var(--line-1)" : "none", padding: "0 20px" }}>
              <div className="label mb-8">{k}</div>
              <div className="num" style={{ fontSize: 18, color: "var(--accent)", marginBottom: 2 }}>{a}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>vs {b}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CedentPortfolio = ({ goTo, onCreate, onUpdate }) => {
  const [editing, setEditing] = React.useState(null);
  const [newCoverage, setNewCoverage] = React.useState(false);
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Cedent Portal · Coverage Book</div>
          <h1 className="h-display">Your <em>coverage book.</em></h1>
        </div>
        <div className="meta">
          <button className="btn primary" onClick={() => setNewCoverage(true)}><Icon name="plus" /> New Coverage</button>
        </div>
      </header>

      <section className="grid g-3 mb-24">
        {COVERAGES.map(c => {
          const v = c.vaultId ? VAULTS.find(v => v.id === c.vaultId) : null;
          return (
            <div key={c.id} className="vault-card" onClick={() => v && goTo("vault", c.vaultId)}>
              <div className="vault-card-head">
                <div className="row-flex gap-8">
                  {v && <CatDot cat={v.category} />}
                  <span className="eyebrow">{v?.categoryLabel || "New Policy"}</span>
                </div>
                <StatusChip status={c.status === "Active" ? "active" : "draft"} />
              </div>
              <div className="vault-card-body">
                <div className="h-card" style={{ fontSize: 17, marginBottom: 4 }}>{v?.name || c.name}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginBottom: 16 }}>{c.id}</div>

                <div className="grid g-2" style={{ gap: 12 }}>
                  <div>
                    <div className="label">Limit</div>
                    <div className="num" style={{ fontSize: 18, color: "var(--ink-0)", marginTop: 2 }}>{fmtUSD(c.limit)}</div>
                  </div>
                  <div>
                    <div className="label">Posted</div>
                    <div className="num" style={{ fontSize: 18, color: "var(--accent)", marginTop: 2 }}>{fmtUSD(c.posted)}</div>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                      <span className="label">Fill</span>
                      <span className="num" style={{ fontSize: 11, color: "var(--ink-2)" }}>{c.utilization.toFixed(1)}%</span>
                    </div>
                    <div className="meter"><span style={{ width: c.utilization + "%" }} /></div>
                  </div>
                </div>
              </div>
              <div className="vault-card-foot">
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>Premium · {fmtUSD(c.premium)}/y</span>
                <button className="btn sm" onClick={e => { e.stopPropagation();
                  const vv = (window.VAULTS || []).find(x => x.id === c.vaultId);
                  if (vv && vv.request) setEditing(vv); else setNewCoverage(true); }}>{
                  (window.VAULTS || []).find(x => x.id === c.vaultId && x.request) ? "Edit request" : "Manage"}</button>
              </div>
            </div>
          );
        })}
        {/* New coverage card */}
        <div className="vault-card" onClick={() => setNewCoverage(true)} style={{ borderStyle: "dashed", justifyContent: "center", alignItems: "center", padding: 40, cursor: "pointer", textAlign: "center" }}>
          <div className="icon-btn" style={{ width: 40, height: 40, marginBottom: 12 }}><Icon name="plus" size={18} /></div>
          <div className="h-card">Post New Risk</div>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6, maxWidth: 200 }}>
            Define trigger, term, and capacity. Co-design with the RIZK team and the facility calculation agent.
          </div>
        </div>
      </section>

      {newCoverage && <NewCoverageModal onClose={() => setNewCoverage(false)} onCreate={onCreate} goTo={goTo} />}
      {editing && <NewCoverageModal editVault={editing} onClose={() => setEditing(null)} onUpdate={onUpdate} goTo={goTo} />}
    </div>
  );
};

// Turn a cedent request into a live (pre-issuance) vault on the platform
const CEDENT_SHORT = "Serendib Telecom";
const CEDENT_LONG = "Serendib Telecom PLC — SLCIR facility";
let __reqSeq = 13;
function buildCoverageVault(f) {
  __reqSeq += 1;
  const catMap = {
    "Tropical cyclone + flood": "natcat", "Named storm": "natcat", "Earthquake": "natcat",
    "Excess rainfall / flood": "weather", "Hydrological drought": "weather", "Wildfire": "weather",
  };
  const short = f.peril.split(" ")[0];
  const id = "VLT-REQ-" + String(__reqSeq).padStart(3, "0");
  const limit = f.limit * 1_000_000;
  return {
    id,
    ticker: "REQ" + __reqSeq,
    name: (f.name && f.name.trim()) || (f.region.split("—")[0].trim() + " " + f.peril),
    category: catMap[f.peril] || "weather",
    categoryLabel: "In structuring · " + short,
    status: "structuring",
    apy: 6.4,
    apy7d: [6.4, 6.4, 6.4, 6.4, 6.4, 6.4, 6.4],
    tvl: 0,
    capacity: limit,
    cedent: f.cedent,
    cedentShort: f.cedentShort,
    term: f.term,
    termRemaining: "not yet on risk",
    trigger: f.trigger + " — index to be defined and independently modelled during feasibility.",
    triggerShort: f.trigger.split("—")[0].trim(),
    oracle: "To be defined · via Chainlink",
    oracleLevel: 0,
    oracleTrend: "ok",
    collateral: "USDC · tokenized USD MMF · BNY custody",
    settlement: "T+0 (on issuance)",
    tranche: "Series 2026-" + __reqSeq,
    rating: "Pre-model · EL t.b.d.",
    pricePerToken: 1.0,
    priceHistory: Array.from({ length: 30 }, () => 100),
    description: "Cedent request " + f.ref + " — " + f.limit + "M of " + f.peril.toLowerCase()
      + " cover for " + f.cedentShort + ". In feasibility review: index design and basis-risk analysis before the book opens.",
    investors: 0,
    lastTrigger: null,
    requestRef: f.ref,
    request: { ...f },
    payoutUse: f.use,
    parties: [
      { mono: "CD", color: "#1c9b7c", name: f.cedentShort, role: "Cedent · Requesting Party" },
      { mono: "LC", color: "#b8821a", name: "Lionscraft", role: "Structuring & Technology" },
      { mono: "VA", color: "#7a4cc9", name: "Verita Analytics", role: "Independent Calculation Agent" },
      { mono: "FB", color: "#0a1628", name: "Fireblocks", role: "Wallet & Digital-Asset Custody Tech" },
      { mono: "BNY", color: "#0a1628", name: "BNY", role: "Collateral Custodian" },
      { mono: "LINK", color: "#2563d6", name: "Chainlink", role: "Oracle Network · Onchain Data Delivery" },
      { mono: "RZ", color: "#0a1628", name: "RIZK Protocol", role: "Tokenization · Registry · Settlement" },
    ],
  };
}

// Request New Coverage — cedent-side intake flow
const NewCoverageModal = ({ onClose, onCreate, onUpdate, goTo, editVault }) => {
  const { useState } = React;
  const isEdit = !!editVault;
  const [step, setStep] = useState(0);
  const [f, setF] = useState(editVault && editVault.request ? { ...editVault.request } : {
    name: "Sri Lanka Cyclone Cover 2026",
    peril: "Tropical cyclone + flood",
    region: "Sri Lanka — national parametric box",
    limit: 10,
    term: "24 months",
    trigger: "Parametric — graduated 40/70/100%",
    use: "Emergency response · network & grid restoration · public-service commitments",
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const estRoL = 6.4, estPremium = f.limit * 1_000_000 * estRoL / 100;

  const field = (label, key, opts) => (
    <div style={{ marginBottom: 14 }}>
      <div className="label mb-8">{label}</div>
      {opts ? (
        <div className="input">
          <select value={f[key]} onChange={e => set(key, e.target.value)}
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "var(--ink-0)", fontFamily: "inherit", fontSize: 13 }}>
            {opts.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      ) : (
        <div className="input"><input value={f[key]} onChange={e => set(key, e.target.value)} /></div>
      )}
    </div>
  );

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Cedent · Protection Request</div>
            <div className="h-section">{step === 2 ? (isEdit ? "Request Updated" : "Request Submitted") : (isEdit ? "Edit Coverage Request" : "Request New Coverage")}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
              {step === 2 ? ((isEdit ? editVault.requestRef : "REQ-2026-014") + " · with structuring desk") : "Step " + (step + 1) + " of 2"}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" /></button>
        </div>

        <div className="modal-body">
          {step === 0 && (
            <>
              {field("Coverage name", "name")}
              {field("Peril", "peril", ["Tropical cyclone + flood", "Excess rainfall / flood", "Hydrological drought", "Earthquake", "Wildfire", "Named storm"])}
              {field("Covered region / parametric box", "region")}
              <div className="label mb-8">Limit requested — USD {f.limit}M</div>
              <input type="range" className="range" min={1} max={50} step={1} value={f.limit}
                onChange={e => set("limit", +e.target.value)} style={{ marginBottom: 18 }} />
              {field("Term", "term", ["12 months", "24 months", "36 months", "Seasonal · 6m"])}
              {field("Trigger type", "trigger", ["Parametric — graduated 40/70/100%", "Parametric — binary", "Industry loss index", "Indemnity"])}
              {field("Intended payout use", "use")}
            </>
          )}

          {step === 1 && (
            <>
              <div className="kv mb-24" style={{ padding: 16, background: "var(--bg-2)", borderRadius: 6 }}>
                <div className="k">Coverage name</div><div className="v" style={{ maxWidth: 260, whiteSpace: "normal" }}>{f.name}</div>
                <div className="k">Peril</div><div className="v" style={{ maxWidth: 260, whiteSpace: "normal" }}>{f.peril}</div>
                <div className="k">Region</div><div className="v" style={{ maxWidth: 260, whiteSpace: "normal" }}>{f.region}</div>
                <div className="k">Limit</div><div className="v">USD {f.limit}.0M</div>
                <div className="k">Term</div><div className="v">{f.term}</div>
                <div className="k">Trigger</div><div className="v" style={{ maxWidth: 260, whiteSpace: "normal" }}>{f.trigger}</div>
                <div className="k">Indicative rate on line</div><div className="v" style={{ color: "var(--accent)" }}>{estRoL}%</div>
                <div className="k">Indicative premium</div><div className="v" style={{ color: "var(--accent)" }}>{fmtUSDExact(estPremium)}/yr</div>
              </div>
              <div className="label mb-8">What happens next</div>
              {[
                ["Feasibility & data review", "Structuring desk + calculation agent", "2 weeks"],
                ["Index design & basis-risk analysis", "Independent cat modeller", "4 weeks"],
                ["Capacity sounding", "ILS investors + donor first-loss", "2 weeks"],
                ["Issuance on existing rails", "Reuses facility wrapper — no new SPC", "3 weeks"],
              ].map(([a, b, c], i) => (
                <div key={i} className="row-flex" style={{ padding: "11px 0", borderTop: i ? "1px solid var(--line-1)" : "none", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--ink-0)" }}>{i + 1}. {a}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}>{b}</div>
                  </div>
                  <span className="chip" style={{ flexShrink: 0 }}>{c}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: 14, background: "rgba(245,185,65,0.06)", border: "1px solid rgba(245,185,65,0.25)", borderRadius: 6, fontSize: 12, color: "var(--ink-1)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--warn)" }}>Indicative only.</strong> Pricing is a desk estimate until the
                index is defined and independently modelled. Final terms depend on basis-risk analysis and capacity.
              </div>
            </>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent)", color: "#052017", display: "inline-flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 10 17 19 7" /></svg>
              </div>
              <div className="h-section mb-8">{isEdit ? "Request updated" : "Request logged"}</div>
              <div style={{ color: "var(--ink-2)", fontSize: 13, marginBottom: 24, maxWidth: 380, margin: "0 auto 24px" }}>
                USD {f.limit}.0M of {f.peril.toLowerCase()} cover. The structuring desk will come back with a feasibility
                note and indicative terms within 10 business days.
              </div>
              <div className="kv" style={{ padding: 16, background: "var(--bg-2)", borderRadius: 6, textAlign: "left" }}>
                <div className="k">Reference</div><div className="v">REQ-2026-014</div>
                <div className="k">Status</div><div className="v">Feasibility review</div>
                <div className="k">Desk contact</div><div className="v">Lionscraft structuring</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          {step === 0 && (<>
            <button className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={() => setStep(1)}>Review Request</button>
          </>)}
          {step === 1 && (<>
            <button className="btn ghost" onClick={() => setStep(0)}>Back</button>
            <button className="btn primary" onClick={() => {
              if (isEdit) { onUpdate && onUpdate(editVault.id, f); }
              else { onCreate && onCreate(buildCoverageVault({ ...f, ref: "REQ-2026-014", cedentShort: CEDENT_SHORT, cedent: CEDENT_LONG })); }
              setStep(2);
            }}>{isEdit ? "Save Changes" : "Submit Request"}</button>
          </>)}
          {step === 2 && (<>
            <button className="btn ghost" onClick={onClose}>Close</button>
            <button className="btn primary" onClick={() => { onClose(); goTo && goTo("marketplace"); }}>View on Platform</button>
          </>)}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CedentDashboard, CedentPortfolio, NewCoverageModal });
