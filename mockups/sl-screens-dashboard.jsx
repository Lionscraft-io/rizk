// Dashboard — overview / landing screen (Sri Lanka pilot edition)

const DashboardScreen = ({ goTo, side }) => {
  if (side === "cedent") return <CedentDashboard goTo={goTo} />;

  const totalDeposited = POSITIONS.reduce((s, p) => s + p.deposited, 0);
  const totalValue = POSITIONS.reduce((s, p) => s + p.currentValue, 0);
  const totalPremium = POSITIONS.reduce((s, p) => s + p.premiumAccrued, 0);
  const weightedApy = POSITIONS.reduce((s, p) => {
    const v = VAULTS.find(v => v.id === p.vaultId);
    return s + (v ? v.apy * p.currentValue : 0);
  }, 0) / totalValue;

  const tvlTotal = VAULTS.reduce((s, v) => s + v.tvl, 0);
  const avgApy = VAULTS.reduce((s, v) => s + v.apy, 0) / VAULTS.length;
  const featured = VAULTS.find(v => v.id === "VLT-CYC-001");

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Investor Dashboard · Sri Lanka Pilot</div>
          <h1 className="h-display">Programmable capital for <em>resilience.</em></h1>
        </div>
        <div className="meta">
          <div className="stat">
            <div className="label">Protocol TVL</div>
            <div className="val">${(tvlTotal / 1_000_000).toFixed(1)}M</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">Active Vaults</div>
            <div className="val">{VAULTS.length}</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">Avg Yield</div>
            <div className="val" style={{ color: "var(--accent)" }}>{avgApy.toFixed(1)}%</div>
          </div>
        </div>
      </header>

      {/* Portfolio summary row */}
      <section className="grid g-4 mb-24">
        <div className="card card-pad">
          <div className="label mb-8">Your Deposits</div>
          <div className="num" style={{ fontSize: 24, color: "var(--ink-0)" }}>{fmtUSDExact(totalDeposited)}</div>
          <div className="num" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>across {POSITIONS.length} vaults</div>
        </div>
        <div className="card card-pad">
          <div className="label mb-8">Current Value</div>
          <div className="num" style={{ fontSize: 24, color: "var(--ink-0)" }}>{fmtUSDExact(totalValue)}</div>
          <div className="num" style={{ fontSize: 11, color: "var(--accent)", marginTop: 4 }}>+{fmtUSDExact(totalValue - totalDeposited)} ({((totalValue/totalDeposited - 1) * 100).toFixed(2)}%)</div>
        </div>
        <div className="card card-pad">
          <div className="label mb-8">Premium Accrued</div>
          <div className="num" style={{ fontSize: 24, color: "var(--accent)" }}>{fmtUSDExact(totalPremium)}</div>
          <div className="num" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>since position open</div>
        </div>
        <div className="card card-pad">
          <div className="label mb-8">Blended APY</div>
          <div className="num" style={{ fontSize: 24, color: "var(--ink-0)" }}>{weightedApy.toFixed(2)}%</div>
          <div className="num" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>weighted by position</div>
        </div>
      </section>

      <section className="grid mb-24" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        {/* Featured vault */}
        <div className="card">
          <div className="card-head">
            <div className="label">Featured · Pilot Flagship</div>
            <button className="btn sm ghost" onClick={() => goTo("vault", "VLT-CYC-001")}>
              Open <Icon name="arrowR" />
            </button>
          </div>
          <div style={{ padding: "20px 22px" }}>
            <div className="row-flex gap-12 mb-16">
              <CatDot cat="natcat" />
              <div className="eyebrow">Parametric Cat Bond · Active</div>
            </div>
            <div className="h-display" style={{ fontSize: 30, marginBottom: 12 }}>
              Sri Lanka Cyclone + Flood <em>Class A.</em>
            </div>
            <div style={{ color: "var(--ink-2)", fontSize: 13, maxWidth: 540, marginBottom: 20 }}>
              USD 14M of pre-arranged protection for the island's telecom and electricity operators.
              A qualifying cyclone or flood pays out in hours — funding restoration, zero-rated connectivity
              and priority re-energisation of hospitals and shelters.
            </div>

            <div className="grid g-4" style={{ gap: 16 }}>
              <div className="stat">
                <div className="label">Premium APY</div>
                <div className="val" style={{ color: "var(--accent)", fontSize: 22 }}>{featured.apy}%</div>
              </div>
              <div className="stat">
                <div className="label">TVL · Capacity</div>
                <div className="val" style={{ fontSize: 18 }}>$12.3M<span style={{ color: "var(--ink-3)", fontSize: 13 }}> / 14M</span></div>
              </div>
              <div className="stat">
                <div className="label">Term Remaining</div>
                <div className="val" style={{ fontSize: 18 }}>{featured.termRemaining}</div>
              </div>
              <div className="stat">
                <div className="label">Oracle Health</div>
                <div className="val" style={{ fontSize: 18, color: "var(--accent)" }}>{featured.oracleLevel}%</div>
              </div>
            </div>
            <div className="meter mt-16"><span style={{ width: "87.5%" }} /></div>
            <div className="row-flex" style={{ justifyContent: "space-between", marginTop: 6 }}>
              <span className="label" style={{ color: "var(--ink-3)" }}>Capacity filled · 87.5%</span>
              <span className="num" style={{ fontSize: 11, color: "var(--ink-3)" }}>{featured.investors} holders</span>
            </div>
          </div>
        </div>

        {/* Oracle / risk health panel */}
        <div className="card">
          <div className="card-head">
            <div className="label">Live Oracle Signals</div>
            <span className="chip live">Streaming</span>
          </div>
          <div style={{ padding: "8px 0" }}>
            {ORACLE_SIGNALS.slice(0, 5).map(sig => {
              const v = VAULTS.find(v => v.id === sig.vaultId);
              const trendColor = sig.trend === "down" ? "var(--danger)" : sig.trend === "up" ? "var(--warn)" : "var(--ink-2)";
              return (
                <div key={sig.id} className="row-flex" style={{ padding: "10px 22px", borderTop: "1px solid var(--line-1)", justifyContent: "space-between" }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="row-flex gap-8">
                      <CatDot cat={v?.category} />
                      <div style={{ fontSize: 12, color: "var(--ink-0)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sig.name}</div>
                    </div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}>{sig.source}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="num" style={{ color: "var(--ink-0)", fontSize: 13 }}>{sig.value}<span style={{ color: "var(--ink-3)", marginLeft: 4 }}>{sig.unit}</span></div>
                    <div className="num" style={{ fontSize: 10, color: trendColor }}>
                      {sig.change > 0 ? "+" : ""}{sig.change} {sig.unit.split(" ")[0]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activity + holdings */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Your Positions</div>
            <button className="btn sm ghost" onClick={() => goTo("portfolio")}>View All <Icon name="arrowR" /></button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Vault</th>
                <th style={{ textAlign: "right" }}>Deposited</th>
                <th style={{ textAlign: "right" }}>Value</th>
                <th style={{ textAlign: "right" }}>P&L</th>
              </tr>
            </thead>
            <tbody>
              {POSITIONS.map(p => {
                const v = VAULTS.find(v => v.id === p.vaultId);
                const pnl = p.currentValue - p.deposited;
                return (
                  <tr key={p.vaultId} className="row" onClick={() => goTo("vault", p.vaultId)}>
                    <td>
                      <div className="row-flex gap-8">
                        <CatDot cat={v.category} />
                        <div>
                          <div style={{ fontSize: 13, color: "var(--ink-0)" }}>{v.name}</div>
                          <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{v.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="num" style={{ textAlign: "right" }}>{fmtUSDExact(p.deposited)}</td>
                    <td className="num" style={{ textAlign: "right" }}>{fmtUSDExact(p.currentValue)}</td>
                    <td className="num" style={{ textAlign: "right", color: "var(--accent)" }}>+{fmtUSDExact(pnl)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="label">Recent Activity</div>
            <span className="chip">Last 3 days</span>
          </div>
          <div>
            {EVENTS.map((ev, i) => {
              const v = VAULTS.find(v => v.id === ev.vault);
              const colorMap = {
                "trigger-armed": "var(--warn)",
                "trigger-cleared": "var(--ink-2)",
                "deposit": "var(--accent)",
                "premium": "var(--accent)",
                "trade": "var(--info)",
                "cedent-post": "var(--info)",
              };
              const labelMap = {
                "trigger-armed": "TRIGGER WATCH",
                "trigger-cleared": "TRIGGER CLEARED",
                "deposit": "DEPOSIT",
                "premium": "PREMIUM PAID",
                "trade": "SECONDARY TRADE",
                "cedent-post": "CEDENT POST",
              };
              return (
                <div key={i} className="row-flex" style={{ padding: "14px 22px", borderTop: i ? "1px solid var(--line-1)" : "none", gap: 14, alignItems: "flex-start" }}>
                  <div className="mono" style={{ fontSize: 9, color: colorMap[ev.type], minWidth: 110, letterSpacing: "0.1em" }}>{labelMap[ev.type]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "var(--ink-1)" }}>{ev.text}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 4 }}>{v?.name || ev.vault} · {ev.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="placeholder" style={{ background: "var(--bg-1)", border: "1px solid var(--line-1)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Documentation & Market Data</div>
          <div style={{ color: "var(--ink-0)", fontSize: 14 }}>Pilot Brief — parametric facility, AI monitoring, tokenized issuance & settlement. Global vault examples follow real deals from the Artemis.bm catastrophe bond directory.</div>
        </div>
        <div className="row-flex gap-8" style={{ flexShrink: 0 }}>
          <button className="btn">Pilot Brief <Icon name="arrowR" /></button>
          <a className="btn" href="https://www.artemis.bm/deal-directory/" target="_blank" rel="noopener" style={{ textDecoration: "none" }}>Artemis Deal Directory ↗</a>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { DashboardScreen });
