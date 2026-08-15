// Portfolio — investor positions across resilience vaults (adapted from RIZK portfolio)

const RFPortfolioScreen = ({ goTo, phase }) => {
  const isPayout = phase === "payout";
  const isEvent = phase === "event";

  // phase-adjusted positions: SLCIR-A takes the Tier 2 principal reduction in payout
  const positions = RF_POSITIONS.map(p => {
    if (isPayout && p.vaultId === "VLT-SLCIR-A") return { ...p, value: 7_400, reduced: true };
    return p;
  });

  const totalDeposited = positions.reduce((s, p) => s + p.deposited, 0);
  const totalValue = positions.reduce((s, p) => s + p.value, 0);
  const totalPremium = positions.reduce((s, p) => s + p.premium, 0);
  const pnlPct = (totalValue / totalDeposited - 1) * 100;

  // Allocation by vault category
  const alloc = {};
  positions.forEach(p => {
    const v = RF_VAULTS.find(v => v.id === p.vaultId);
    alloc[v.category] = (alloc[v.category] || 0) + p.value;
  });
  const catLabels = { natcat: "Cyclone + Flood", weather: "Hydro-Drought", maritime: "Maritime", cyber: "Cyber" };
  const allocList = Object.entries(alloc).map(([cat, val]) => ({
    cat, val, pct: (val / totalValue) * 100, label: catLabels[cat] || cat,
  })).sort((a, b) => b.val - a.val);

  // Value over time (synthetic) — drops at the end in payout phase
  const valueHistory = [];
  for (let i = 0; i < 60; i++) {
    let v = totalDeposited + totalPremium * (i / 59) + Math.sin(i * 0.4) * 55;
    if (isPayout && i > 54) v -= (25_000 - 7_400) * ((i - 54) / 5);
    valueHistory.push(v);
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Portfolio · {PHASE_META[phase].tag}</div>
          <h1 className="h-display">Your <em>positions.</em></h1>
        </div>
        <div className="meta">
          <div className="stat">
            <div className="label">Wallet</div>
            <div className="num" style={{ fontSize: 14, color: "var(--ink-0)" }}>{WALLET.addr}</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">Stablecoin Balance</div>
            <div className="num" style={{ fontSize: 14, color: "var(--ink-0)" }}>{fmtUSDExact(WALLET.balance)} USDC</div>
          </div>
        </div>
      </header>

      {isEvent && (
        <div className="alert-banner mb-24" style={{ background: "rgba(245,185,65,0.07)", borderColor: "rgba(245,185,65,0.4)" }}>
          <span className="pulse" style={{ background: "var(--warn)", boxShadow: "0 0 10px var(--warn)" }} />
          <div style={{ fontSize: 13 }}>Trigger watch on SLCIR vaults — valuations shown at last mark; transfers suspended until the event window resolves.</div>
        </div>
      )}
      {isPayout && (
        <div className="alert-banner mb-24">
          <span className="pulse" />
          <div style={{ fontSize: 13 }}>Tier 2 payout executed on {VAULT.token} — your Sri Lanka Resilience Vault position reduced 71.4%. Other positions unaffected.</div>
          <button className="btn sm" style={{ marginLeft: "auto", flexShrink: 0 }} onClick={() => goTo("disburse")}>Follow the funds <Icon name="arrowR" /></button>
        </div>
      )}

      {/* Top stats */}
      <section className="grid g-4 mb-24">
        <div className="card card-pad">
          <div className="label mb-8">Total Deposited</div>
          <div className="num" style={{ fontSize: 28, color: "var(--ink-0)" }}>{fmtUSDExact(totalDeposited)}</div>
          <div className="mono mt-8" style={{ fontSize: 11, color: "var(--ink-3)" }}>Cost basis · {positions.length} vaults</div>
        </div>
        <div className="card card-pad">
          <div className="label mb-8">Current Value</div>
          <div className="num" style={{ fontSize: 28, color: isPayout ? "var(--danger)" : "var(--ink-0)" }}>{fmtUSDExact(totalValue)}</div>
          <div className="mono mt-8" style={{ fontSize: 11, color: pnlPct >= 0 ? "var(--accent)" : "var(--danger)" }}>{pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}% all-time</div>
        </div>
        <div className="card card-pad">
          <div className="label mb-8">Premium Earned</div>
          <div className="num" style={{ fontSize: 28, color: "var(--accent)" }}>+{fmtUSDExact(totalPremium)}</div>
          <div className="mono mt-8" style={{ fontSize: 11, color: "var(--ink-3)" }}>Lifetime · realized + accrued</div>
        </div>
        <div className="card card-pad">
          <div className="label mb-8">Next Distribution</div>
          <div className="num" style={{ fontSize: 28, color: "var(--ink-0)" }}>{isEvent || isPayout ? "—" : "$318.40"}</div>
          <div className="mono mt-8" style={{ fontSize: 11, color: "var(--ink-3)" }}>{isEvent ? "Held — trigger watch" : isPayout ? "Recalculating post-payout" : "Est · in 12 days"}</div>
        </div>
      </section>

      <section className="grid mb-24" style={{ gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Portfolio Value · 60 Days</div>
            <div className="side-toggle" style={{ margin: 0 }}>
              {["30D", "60D", "90D", "ALL"].map((t, i) => (
                <button key={t} className={i === 1 ? "active" : ""}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: 12 }}>
            <ApyChart data={valueHistory} color={isPayout ? "var(--danger)" : "var(--accent)"} height={240} />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="label">Allocation by Coverage</div>
          </div>
          <div style={{ padding: 22 }}>
            <RFAllocationDonut data={allocList} />
            <div className="mt-24">
              {allocList.map(a => (
                <div key={a.cat} className="row-flex" style={{ padding: "8px 0", borderTop: "1px solid var(--line-1)", justifyContent: "space-between" }}>
                  <div className="row-flex gap-8">
                    <CatDot cat={a.cat} />
                    <span style={{ fontSize: 13 }}>{a.label}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="num" style={{ fontSize: 13 }}>{fmtUSDExact(a.val)}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{a.pct.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Positions table */}
      <div className="card">
        <div className="card-head">
          <div className="label">Open Positions</div>
          <div className="row-flex gap-8">
            <button className="btn ghost sm">Export CSV</button>
            <button className="btn sm" onClick={() => goTo("market")}>Add Position</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Vault</th>
              <th>Opened</th>
              <th style={{ textAlign: "right" }}>Tokens</th>
              <th style={{ textAlign: "right" }}>Deposited</th>
              <th style={{ textAlign: "right" }}>Value</th>
              <th style={{ textAlign: "right" }}>Premium</th>
              <th style={{ textAlign: "right" }}>P&L</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {positions.map(p => {
              const v = RF_VAULTS.find(v => v.id === p.vaultId);
              const pnl = p.value - p.deposited;
              const pnlPct = (pnl / p.deposited) * 100;
              const neg = pnl < 0;
              return (
                <tr key={p.vaultId} className="row" onClick={() => goTo("vault", p.vaultId)}>
                  <td>
                    <div className="row-flex gap-12">
                      <CatDot cat={v.category} />
                      <div>
                        <div style={{ color: "var(--ink-0)" }}>{v.name}</div>
                        <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{v.id} · APY {v.apy}%{p.reduced ? " · Tier 2 drawn" : ""}</div>
                      </div>
                    </div>
                  </td>
                  <td className="mono" style={{ fontSize: 11, color: "var(--ink-2)" }}>{p.depositedAt}</td>
                  <td className="num" style={{ textAlign: "right" }}>{fmtNum(p.tokens)}</td>
                  <td className="num" style={{ textAlign: "right" }}>{fmtUSDExact(p.deposited)}</td>
                  <td className="num" style={{ textAlign: "right", color: neg ? "var(--danger)" : "var(--ink-1)" }}>{fmtUSDExact(p.value)}</td>
                  <td className="num" style={{ textAlign: "right", color: "var(--accent)" }}>+{fmtUSDExact(p.premium)}</td>
                  <td className="num" style={{ textAlign: "right", color: neg ? "var(--danger)" : "var(--accent)" }}>{neg ? "" : "+"}{pnlPct.toFixed(2)}%</td>
                  <td>
                    <div className="row-flex gap-4">
                      <button className="btn ghost sm" onClick={e => { e.stopPropagation(); goTo("secondary", p.vaultId); }}>Trade</button>
                      <button className="icon-btn"><Icon name="chevR" size={12} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Premium schedule */}
      <div className="card mt-24">
        <div className="card-head">
          <div className="label">Upcoming Distributions</div>
          {(isEvent || isPayout) && <span className="chip warn">{isEvent ? "Held — trigger watch" : "Recalculating"}</span>}
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vault</th>
              <th>Type</th>
              <th style={{ textAlign: "right" }}>Estimated Amount</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: "2026-07-29", vault: "VLT-SLCIR-A", type: "Monthly Premium", amount: 203.10 },
              { date: "2026-10-31", vault: "VLT-SLCIR-D", type: "Quarterly Spread", amount: 78.10 },
              { date: "2026-08-29", vault: "VLT-SLCIR-A", type: "Monthly Premium", amount: 203.10 },
              { date: "2027-01-31", vault: "VLT-SLCIR-D", type: "Quarterly Spread", amount: 78.10 },
            ].map((d, i) => {
              const v = RF_VAULTS.find(v => v.id === d.vault);
              return (
                <tr key={i}>
                  <td className="mono" style={{ fontSize: 12 }}>{d.date}</td>
                  <td>
                    <div className="row-flex gap-8">
                      <CatDot cat={v.category} />
                      <span>{v.name}</span>
                    </div>
                  </td>
                  <td><span className="chip">{d.type}</span></td>
                  <td className="num" style={{ textAlign: "right", color: "var(--accent)" }}>+${d.amount.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RFAllocationDonut = ({ data }) => {
  const size = 180, r = 70, sw = 22;
  const c = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.val, 0);
  let acc = 0;
  const colors = { maritime: "#4a9eff", natcat: "#f5b941", weather: "#6ee0c8", cyber: "#b08cff" };
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: 220, display: "block", margin: "0 auto" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-3)" strokeWidth={sw} />
      {data.map((d, i) => {
        const len = (d.val / total) * c;
        const off = -acc;
        acc += len;
        return (
          <circle
            key={i}
            cx={size/2} cy={size/2} r={r}
            fill="none"
            stroke={colors[d.cat]}
            strokeWidth={sw}
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={off}
            transform={`rotate(-90 ${size/2} ${size/2})`}
          />
        );
      })}
      <text x={size/2} y={size/2 - 2} textAnchor="middle" fontSize="22" fontFamily="IBM Plex Mono" fill="var(--ink-0)">{fmtUSD(total)}</text>
      <text x={size/2} y={size/2 + 16} textAnchor="middle" fontSize="9" fontFamily="IBM Plex Mono" fill="var(--ink-3)" letterSpacing="0.12em">TOTAL VALUE</text>
    </svg>
  );
};

Object.assign(window, { RFPortfolioScreen, RFAllocationDonut });
