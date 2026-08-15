// Vault detail — single vault deep view

const DEFAULT_PARTIES = [
  { mono: "SPC", color: "#1c9b7c", name: "Segregated Cell SPV", role: "Issuer · Bermuda SC" },
  { mono: "RZ", color: "#0a1628", name: "RIZK Protocol", role: "Tokenization · Registry · Settlement" },
  { mono: "CA", color: "#7a4cc9", name: "Independent Calc Agent", role: "Trigger Calculation" },
  { mono: "CU", color: "#c43d59", name: "Collateral Custodian", role: "Custody · Tokenized MMF" },
  { mono: "FA", color: "#2563d6", name: "Fund Administrator", role: "Administration" },
  { mono: "AU", color: "#56688a", name: "Auditor", role: "Audit" },
  { mono: "LG", color: "#b8821a", name: "Legal Counsel", role: "Bermuda SC" },
  { mono: "BMA", color: "#56688a", name: "Bermuda Monetary Authority", role: "Regulator" },
];
const DEFAULT_DOCS = [
  { name: "Private Placement Memorandum", meta: "PDF · Jun 2026" },
  { name: "Term Sheet & Trigger Annex", meta: "PDF · Jun 2026" },
  { name: "Subscription Agreement", meta: "PDF · Jun 2026" },
  { name: "Monthly Participant Report", meta: "PDF · latest" },
];

const VaultScreen = ({ vaultId, goTo, onDeposit, side }) => {
  const v = VAULTS.find(x => x.id === vaultId) || VAULTS[0];
  const PARTIES = v.parties || window.VAULT_PARTIES || DEFAULT_PARTIES;
  const DOCS = window.VAULT_DOCS || DEFAULT_DOCS;
  const [tf, setTf] = useState("30D");
  const position = POSITIONS.find(p => p.vaultId === v.id);

  const accentColor =
    v.category === "maritime" ? "#4a9eff" :
    v.category === "natcat" ? "#f5b941" :
    v.category === "cyber" ? "#b08cff" :
    "#6ee0c8";

  return (
    <div className="page">
      <button className="btn ghost sm mb-16" onClick={() => goTo("marketplace")}>
        <Icon name="chevL" /> All Vaults
      </button>

      <header className="page-head" style={{ alignItems: "flex-start" }}>
        <div>
          <div className="row-flex gap-12 mb-8">
            <CatDot cat={v.category} />
            <div className="eyebrow">{v.categoryLabel}</div>
            <StatusChip status={v.status} />
            <span className="chip">{v.rating}</span>
          </div>
          <h1 className="h-display" style={{ fontSize: 36 }}>{v.name}</h1>
          <div style={{ fontSize: 13, color: "var(--ink-2)", maxWidth: 640, marginTop: 12 }}>{v.description}</div>
          <div className="mono mt-16" style={{ fontSize: 11, color: "var(--ink-3)" }}>
            {v.id} · Cedent: <span style={{ color: "var(--ink-1)" }}>{v.cedent}</span>
            {v.artemisUrl && (
              <> · <a href={v.artemisUrl} target="_blank" rel="noopener" style={{ color: "var(--accent)", textDecoration: "none" }}>View real deal on Artemis.bm ↗</a></>
            )}
          </div>
        </div>
        <div className="col gap-8" style={{ alignItems: "flex-end" }}>
          <button className="btn primary" onClick={() => onDeposit(v)}>
            <Icon name="plus" /> Deposit USDC
          </button>
          {position && (
            <button className="btn ghost sm" onClick={() => goTo("portfolio")}>
              Your Position: {fmtUSDExact(position.currentValue)}
            </button>
          )}
        </div>
      </header>

      {/* Stat strip */}
      <section className="grid g-5 mb-24" style={{ gap: 0 }}>
        {[
          ["Premium APY", v.apy + "%", "var(--accent)"],
          ["TVL", fmtUSD(v.tvl), null],
          ["Capacity", fmtUSD(v.capacity), null],
          ["Term Remaining", v.termRemaining, null],
          ["Token Price", "$" + v.pricePerToken.toFixed(4), null],
        ].map(([k, val, col], i) => (
          <div key={i} className="card-pad" style={{
            background: "var(--bg-1)",
            border: "1px solid var(--line-1)",
            borderLeft: i > 0 ? "none" : "1px solid var(--line-1)",
            borderRadius: i === 0 ? "6px 0 0 6px" : i === 4 ? "0 6px 6px 0" : 0,
          }}>
            <div className="label mb-8">{k}</div>
            <div className="num" style={{ fontSize: 22, color: col || "var(--ink-0)" }}>{val}</div>
          </div>
        ))}
      </section>

      {/* Invest CTA bar */}
      <div className="card mb-24" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap",
        padding: "16px 22px", border: "1px solid var(--accent)", background: "var(--accent-glow)",
      }}>
        <div className="row-flex" style={{ gap: 28, flexWrap: "wrap" }}>
          <div>
            <div className="label mb-8">Open Capacity</div>
            <div className="num" style={{ fontSize: 20, color: "var(--ink-0)" }}>{fmtUSD(v.capacity - v.tvl)}</div>
          </div>
          <div className="vdivider" />
          <div>
            <div className="label mb-8">Premium APY</div>
            <div className="num" style={{ fontSize: 20, color: "var(--accent)" }}>{v.apy}%</div>
          </div>
          <div className="vdivider" />
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-2)", lineHeight: 1.7 }}>
            Min. position $100 · T+0 settlement<br />Premium streams daily to your wallet
          </div>
        </div>
        <button className="btn primary" style={{ height: 46, padding: "0 26px", fontSize: 14, flexShrink: 0 }} onClick={() => onDeposit(v)}>
          <Icon name="plus" /> Deposit USDC
        </button>
      </div>


      <section className="grid mb-24" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Parametric trigger */}
        <div className="card">
          <div className="card-head">
            <div className="label">Parametric Trigger · Live</div>
            <span className={cls("chip", v.oracleLevel < 60 ? "danger" : v.oracleLevel < 85 ? "warn" : "live")}>
              {v.oracleLevel < 60 ? "Critical" : v.oracleLevel < 85 ? "Watch" : "Healthy"}
            </span>
          </div>
          <div style={{ padding: 22 }}>
            <div style={{ color: "var(--ink-0)", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>{v.trigger}</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginBottom: 6 }}>ORACLE · {v.oracle}</div>
            <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 6, alignItems: "baseline" }}>
              <span className="num" style={{ fontSize: 28, color: "var(--ink-0)" }}>{v.oracleLevel}<span style={{ color: "var(--ink-3)", fontSize: 14 }}>%</span></span>
              <span className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>safe range threshold</span>
            </div>
            <div className={cls("meter", v.oracleLevel < 60 ? "danger" : v.oracleLevel < 85 ? "warn" : "")}>
              <span style={{ width: v.oracleLevel + "%" }} />
            </div>
            <div className="mono mt-8" style={{ fontSize: 10, color: "var(--ink-3)" }}>
              Last sample: 14s ago · Sample frequency: 60s
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="card">
          <div className="card-head">
            <div className="label">Terms & Settlement</div>
          </div>
          <div style={{ padding: 22 }}>
            <div className="kv">
              <div className="k">Tranche</div><div className="v">{v.tranche}</div>
              <div className="k">Term</div><div className="v">{v.term}</div>
              <div className="k">Collateral</div><div className="v">{v.collateral}</div>
              <div className="k">Settlement</div><div className="v">{v.settlement}</div>
              <div className="k">Oracle</div><div className="v">{v.oracle}</div>
              <div className="k">Rating</div><div className="v">{v.rating}</div>
              <div className="k">Token Price</div><div className="v">${v.pricePerToken.toFixed(4)}</div>
              <div className="k">Holders</div><div className="v">{fmtNum(v.investors)}</div>
              <div className="k">Min Position</div><div className="v">$100</div>
              <div className="k">Legal Wrapper</div><div className="v">Bermuda SC</div>
            </div>
          </div>
        </div>
      </section>

      {/* Parties & service providers */}
      <div className="card mb-24">
        <div className="card-head">
          <div className="label">Parties & Service Providers</div>
          <div className="row-flex gap-8">
            {v.artemisUrl && <span className="chip">per Artemis deal record</span>}
            <span className="chip solid">{PARTIES.length} parties</span>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          {PARTIES.map((p, i) => (
            <div key={p.name} style={{
              padding: "22px 24px", display: "flex", gap: 16, alignItems: "center",
              borderTop: i >= 3 ? "1px solid var(--line-1)" : "none",
              borderRight: (i + 1) % 3 !== 0 ? "1px solid var(--line-1)" : "none",
            }}>
              <PartyLogo p={p} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14.5, color: "var(--ink-0)", fontWeight: 600, lineHeight: 1.3 }}>{p.name}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-2)", marginTop: 5, letterSpacing: "0.04em" }}>{p.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents + token details */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Documents</div>
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>allowlisted access</span>
          </div>
          <div>
            {DOCS.map((d, i) => (
              <div key={i} className="row-flex" style={{ padding: "12px 22px", borderTop: i ? "1px solid var(--line-1)" : "none", justifyContent: "space-between", gap: 12 }}>
                <div className="row-flex gap-12" style={{ minWidth: 0 }}>
                  <Icon name="book" size={15} />
                  <div>
                    <div style={{ fontSize: 13, color: "var(--ink-0)" }}>{d.name}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}>{d.meta}</div>
                  </div>
                </div>
                <button className="btn ghost sm" style={{ flexShrink: 0 }}>PDF</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><div className="label">Token & Networks</div></div>
          <div style={{ padding: 22 }}>
            <div className="kv">
              <div className="k">Token standard</div><div className="v">Permissioned ERC-20</div>
              <div className="k">Transfer controls</div><div className="v">KYC allowlist · at token layer</div>
              <div className="k">Registrar</div><div className="v">RIZK Protocol</div>
              <div className="k">Wallet infrastructure</div><div className="v">Fireblocks</div>
              <div className="k">Custodian</div><div className="v">BNY</div>
              <div className="k">Oracle network</div><div className="v">Chainlink</div>
              <div className="k">Identifier</div><div className="v">{"RZK-" + v.id}</div>
              <div className="k">Distributions</div><div className="v">USDC · monthly</div>
            </div>
            <div className="divider" />
            <div className="label mb-8">Available Networks</div>
            <div className="row-flex gap-8" style={{ flexWrap: "wrap" }}>
              {["Ethereum", "Polygon", "Avalanche", "Permissioned DLT"].map(n => (
                <span key={n} className="row-flex gap-8" style={{ padding: "7px 12px", background: "var(--bg-2)", border: "1px solid var(--line-2)", borderRadius: 999 }}>
                  <span style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--bg-3)", border: "1px solid var(--line-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}>{n[0]}</span>
                  <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-1)" }}>{n}</span>
                </span>
              ))}
            </div>
            <div className="mono mt-16" style={{ fontSize: 10, color: "var(--ink-3)", lineHeight: 1.6 }}>
              Interop by RIZK — positions move between networks without leaving the eligibility framework.
            </div>
          </div>
        </div>
      </section>

      {/* Activity log */}
      <div className="card">
        <div className="card-head">
          <div className="label">Vault Activity</div>
          <span className="chip live">Streaming</span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Wallet</th>
              <th style={{ textAlign: "right" }}>Size</th>
              <th style={{ textAlign: "right" }}>Price</th>
              <th style={{ textAlign: "right" }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {[
              { type: "Deposit", wallet: "0x8f2a…3a2c", size: 12_500, price: v.pricePerToken, time: "14m ago" },
              { type: "Premium Paid", wallet: "Vault · all", size: 38_420, price: null, time: "1h ago" },
              { type: "Deposit", wallet: "0x4b91…f10d", size: 4_200, price: v.pricePerToken, time: "2h ago" },
              { type: "Secondary Buy", wallet: "0xe10c…91b4", size: 8_800, price: v.pricePerToken - 0.002, time: "3h ago" },
              { type: "Withdraw", wallet: "0x217d…8c44", size: 1_400, price: v.pricePerToken, time: "5h ago" },
              { type: "Deposit", wallet: "0x99fa…0e22", size: 25_000, price: v.pricePerToken, time: "8h ago" },
            ].map((r, i) => (
              <tr key={i}>
                <td>
                  <span className={cls("chip", r.type === "Premium Paid" ? "live" : r.type === "Withdraw" ? "" : "")}>
                    {r.type}
                  </span>
                </td>
                <td className="mono" style={{ fontSize: 12 }}>{r.wallet}</td>
                <td className="num" style={{ textAlign: "right" }}>{fmtUSDExact(r.size)}</td>
                <td className="num" style={{ textAlign: "right", color: "var(--ink-2)" }}>{r.price ? "$" + r.price.toFixed(4) : "—"}</td>
                <td className="mono" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-3)" }}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="grid mt-24" style={{ gridTemplateColumns: "1fr", gap: 16 }}>
        {/* Secondary mark chart */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="label">Secondary Mark · % of Par</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 4 }}>
                Coupon is fixed at issuance ({v.apy}%) — what moves is the mark
              </div>
            </div>
            <div className="side-toggle" style={{ margin: 0 }}>
              {["7D", "30D", "90D", "1Y"].map(t => (
                <button key={t} className={tf === t ? "active" : ""} onClick={() => setTf(t)}>{t}</button>
              ))}
            </div>
          </div>
          {v.status === "subscribing" ? (
            <div className="card-pad" style={{ height: 292, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span className="chip">Not yet trading</span>
              <div style={{ fontSize: 13, color: "var(--ink-2)", textAlign: "center", maxWidth: 340, lineHeight: 1.6 }}>
                In subscription at par. A secondary mark appears once the notes are issued and the cover incepts.
              </div>
            </div>
          ) : (
            <div style={{ padding: "16px 12px" }}>
              <ApyChart data={v.priceHistory} color={accentColor} height={260} />
            </div>
          )}
        </div>

      </section>
      {/* Subscription progress — only while the book is still open */}
      {v.fillHistory && (() => {
        const days = v.fillHistory.length;
        const raised = v.tvl, target = v.capacity;
        const last7 = raised - v.fillHistory[days - 8];
        const perDay = last7 / 7;
        const remaining = target - raised;
        const daysToFull = perDay > 0 ? Math.ceil(remaining / perDay) : null;
        return (
          <div className="card mb-24">
            <div className="card-head">
              <div>
                <div className="label">Subscription Progress</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 4 }}>
                  Cumulative commitments · book open {days} days
                </div>
              </div>
              <span className="chip warn">{((raised / target) * 100).toFixed(0)}% subscribed</span>
            </div>
            <div className="card-pad">
              <div className="grid g-4 mb-16" style={{ gap: 16 }}>
                <div className="stat">
                  <div className="label">Committed</div>
                  <div className="val" style={{ fontSize: 20, color: "var(--accent)" }}>{fmtUSD(raised)}</div>
                </div>
                <div className="stat">
                  <div className="label">Remaining</div>
                  <div className="val" style={{ fontSize: 20 }}>{fmtUSD(remaining)}</div>
                </div>
                <div className="stat">
                  <div className="label">Last 7d Run-rate</div>
                  <div className="val" style={{ fontSize: 20 }}>{fmtUSD(perDay)}<span style={{ fontSize: 12, color: "var(--ink-3)" }}>/day</span></div>
                </div>
                <div className="stat">
                  <div className="label">Projected Full</div>
                  <div className="val" style={{ fontSize: 20 }}>{daysToFull ? "~" + daysToFull + "d" : "—"}</div>
                </div>
              </div>
              <ApyChart data={v.fillHistory.map(x => x / 1_000_000)} color="var(--accent)" height={190} unit="M" minFloor={0} />
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 6 }}>
                USD millions committed · target {fmtUSD(target)}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

Object.assign(window, { VaultScreen });
