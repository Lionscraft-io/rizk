// Marketplace — browse resilience vaults (adapted from RIZK marketplace)

const MarketScreen = ({ goTo, phase, onDeposit }) => {
  const [sort, setSort] = useState("apy");
  const [view, setView] = useState("fund");
  const [query, setQuery] = useState("");

  let list = [...RF_VAULTS];
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(v => v.name.toLowerCase().includes(q) || v.cedent.toLowerCase().includes(q) || v.categoryLabel.toLowerCase().includes(q));
  }
  if (sort === "apy") list = [...list].sort((a, b) => b.apy - a.apy);
  if (sort === "tvl") list = [...list].sort((a, b) => b.tvl - a.tvl);
  if (sort === "capacity") list = [...list].sort((a, b) => (b.capacity - b.tvl) - (a.capacity - a.tvl));

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Invest · {PHASE_META[phase].tag}</div>
          <h1 className="h-display">Browse <em>resilience vaults.</em></h1>
        </div>
        <div className="meta">
          <div className="stat">
            <div className="label">Open Capacity</div>
            <div className="val">${(RF_VAULTS.reduce((s, v) => s + (v.capacity - v.tvl), 0) / 1_000_000).toFixed(1)}M</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">APY Range</div>
            <div className="val">{Math.min(...RF_VAULTS.map(v => v.apy)).toFixed(1)}–{Math.max(...RF_VAULTS.map(v => v.apy)).toFixed(1)}%</div>
          </div>
        </div>
      </header>

      {phase === "event" && (
        <div className="alert-banner mb-24" style={{ background: "rgba(245,185,65,0.07)", borderColor: "rgba(245,185,65,0.4)" }}>
          <span className="pulse" style={{ background: "var(--warn)", boxShadow: "0 0 10px var(--warn)" }} />
          <div style={{ fontSize: 13 }}>Trigger watch on the Sri Lanka facility — deposits and transfers for SLCIR vaults are suspended until the event window resolves.</div>
        </div>
      )}
      {phase === "payout" && (
        <div className="alert-banner mb-24">
          <span className="pulse" />
          <div style={{ fontSize: 13 }}>TC Vidura Tier 2 payout in progress — {VAULT.token} at 28.6 par. Unaffected vaults continue normal operation.</div>
        </div>
      )}

      {/* Filters bar */}
      <div className="row-flex gap-8 mb-24" style={{ flexWrap: "wrap" }}>
        <span className="chip solid">SLCIR pilot · {RF_VAULTS.filter(v => v.id.startsWith("VLT-SLCIR")).length}</span>
        <span className="chip">Market deals · {RF_VAULTS.filter(v => !v.id.startsWith("VLT-SLCIR")).length}</span>
        <div style={{ flex: 1 }} />
        <div className="input" style={{ width: 240 }}>
          <Icon name="search" />
          <input placeholder="Search vaults, operators…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="input" style={{ paddingRight: 8 }}>
          <span className="label" style={{ margin: 0 }}>Sort</span>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: "transparent", border: "none", color: "var(--ink-0)", fontFamily: "inherit", fontSize: 12, outline: "none" }}>
            <option value="apy">APY (high → low)</option>
            <option value="tvl">TVL</option>
            <option value="capacity">Open capacity</option>
          </select>
        </div>
        <div className="side-toggle" style={{ margin: 0 }}>
          <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} title="Grid view"><Icon name="grid" size={12} /></button>
          <button className={view === "fund" ? "active" : ""} onClick={() => setView("fund")} title="Fund view"><Icon name="card" size={12} /></button>
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} title="List view"><Icon name="list" size={12} /></button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid g-2" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          {list.map(v => <RFVaultCard key={v.id} v={v} goTo={goTo} onDeposit={onDeposit} phase={phase} />)}
        </div>
      ) : view === "fund" ? (
        <div className="grid g-2" style={{ gridTemplateColumns: "repeat(2, 1fr)", alignItems: "stretch" }}>
          {list.map(v => {
            const color = v.category === "maritime" ? "#4a9eff" : v.category === "natcat" ? "#f5b941" : v.category === "cyber" ? "#b08cff" : "#6ee0c8";
            const suspended = phase !== "calm" && v.id === "VLT-SLCIR-A";
            const hitPayout = phase === "payout" && v.id === "VLT-SLCIR-A";
            const st = vaultStatusOf(v);
            const status = hitPayout ? <span className="chip danger">Tier 2 drawn</span>
              : suspended ? <span className="chip warn">Suspended</span>
              : <span className={cls("chip", st.cls)}>{st.label}</span>;
            return (
              <FundCard
                key={v.id}
                ticker={v.ticker || v.token.replace("tSLCIR-", "SLCIR-")}
                name={v.name}
                issuer={v.cedentShort}
                desc={v.description}
                color={color}
                status={status}
                capacity={{ tvl: v.tvl, cap: v.capacity, investors: v.depositors }}
                facts={[
                  ["Premium APY", v.apy + "%", true],
                  ["Term Remaining", v.termRemaining],
                  ["Attachment", v.attach],
                ]}
                tags={[v.categoryLabel, "Parametric", "T+0 Settlement"]}
                link={v.artemisUrl}
                onView={() => goTo("vault", v.id)}
              />
            );
          })}
        </div>
      ) : (
        <RFVaultTable list={list} goTo={goTo} onDeposit={onDeposit} phase={phase} />
      )}

      <div className="card card-pad mt-24" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <Icon name="grid" size={18} />
        <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink-0)" }}>One set of rails, many vaults.</strong> Every vault reuses the facility's
          legal wrapper, trigger framework, AI monitoring and settlement infrastructure — the marketplace is how smaller,
          bespoke ILS transactions become economical and repeatable across operators, hazards and countries.
        </div>
      </div>
    </div>
  );
};

const RFVaultCard = ({ v, goTo, onDeposit, phase }) => {
  const capPct = (v.tvl / v.capacity) * 100;
  const suspended = phase !== "calm" && v.id === "VLT-SLCIR-A";
  const hitPayout = phase === "payout" && v.id === "VLT-SLCIR-A";
  const sparkColor = v.category === "maritime" ? "#4a9eff" : v.category === "natcat" ? "#f5b941" : v.category === "cyber" ? "#b08cff" : "#6ee0c8";
  const st = vaultStatusOf(v);
  const statusChip = hitPayout ? <span className="chip danger">Tier 2 drawn</span>
    : suspended ? <span className="chip warn">Suspended</span>
    : <span className={cls("chip", st.cls)}>{st.label}</span>;

  return (
    <div className="vault-card" onClick={() => goTo("vault", v.id)}>
      <div className="vault-card-head">
        <div className="row-flex gap-8">
          <CatDot cat={v.category} />
          <span className="eyebrow">{v.categoryLabel}</span>
        </div>
        {statusChip}
      </div>
      <div className="vault-card-body">
        <div className="h-card" style={{ fontSize: 17, marginBottom: 4 }}>{v.name}</div>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginBottom: 16 }}>{v.cedentShort} · {v.id} · {v.token}</div>

        <div style={{ marginBottom: 16 }}>
          <Sparkline data={v.apy7d} color={sparkColor} height={42} />
        </div>

        <div className="grid g-2" style={{ gap: 12 }}>
          <div>
            <div className="label">Premium APY</div>
            <div className="num" style={{ fontSize: 22, color: "var(--accent)", marginTop: 2 }}>{v.apy}%{v.status !== "active" && <span style={{ fontSize: 10, color: "var(--ink-3)" }}> ind.</span>}</div>
          </div>
          <div>
            <div className="label">Term</div>
            <div className="num" style={{ fontSize: 14, color: "var(--ink-0)", marginTop: 2 }}>{v.termRemaining}</div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 1 }}>of {v.term}</div>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 6 }}>
              <span className="label">Capacity</span>
              <span className="num" style={{ fontSize: 11, color: "var(--ink-2)" }}>
                {fmtUSD(v.tvl)} <span style={{ color: "var(--ink-3)" }}>/ {fmtUSD(v.capacity)}</span>
              </span>
            </div>
            <div className={cls("meter", hitPayout ? "danger" : capPct > 80 ? "warn" : "")}>
              <span style={{ width: capPct + "%" }} />
            </div>
          </div>
        </div>
      </div>
      <div className="vault-card-foot">
        <div className="row-flex gap-8" style={{ minWidth: 0 }}>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)", flexShrink: 0 }}>Trigger</span>
          <span style={{ fontSize: 11, color: "var(--ink-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.triggerShort}</span>
        </div>
        {v.status === "draft" ? (
          <button className="btn sm ghost" onClick={e => e.stopPropagation()}>Register interest</button>
        ) : (
          <button
            className="btn primary sm"
            style={suspended ? { opacity: 0.45, cursor: "not-allowed" } : {}}
            onClick={e => { e.stopPropagation(); if (!suspended) onDeposit(v); }}
          >
            {suspended ? "Suspended" : "Deposit"}
          </button>
        )}
      </div>
    </div>
  );
};

const RFVaultTable = ({ list, goTo, onDeposit, phase }) => (
  <div className="card">
    <table className="table">
      <thead>
        <tr>
          <th>Vault</th>
          <th>Coverage</th>
          <th style={{ textAlign: "right" }}>APY</th>
          <th style={{ textAlign: "right" }}>TVL / Cap</th>
          <th>Term</th>
          <th>Rating</th>
          <th>Trigger</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {list.map(v => {
          const suspended = phase !== "calm" && v.id === "VLT-SLCIR-A";
          return (
            <tr key={v.id} className="row" onClick={() => goTo("vault", v.id)}>
              <td>
                <div>
                  <div style={{ color: "var(--ink-0)" }}>{v.name}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{v.id} · {v.cedentShort}</div>
                </div>
              </td>
              <td>
                <div className="row-flex gap-8">
                  <CatDot cat={v.category} />
                  <span style={{ fontSize: 12 }}>{v.categoryLabel}</span>
                </div>
              </td>
              <td className="num" style={{ textAlign: "right", color: "var(--accent)" }}>{v.apy}%</td>
              <td className="num" style={{ textAlign: "right" }}>
                {fmtUSD(v.tvl)} <span style={{ color: "var(--ink-3)" }}>/ {fmtUSD(v.capacity)}</span>
              </td>
              <td className="mono" style={{ fontSize: 12 }}>{v.termRemaining}</td>
              <td><span className="chip">{v.rating}</span></td>
              <td style={{ fontSize: 12, color: "var(--ink-2)", maxWidth: 220 }}>{v.triggerShort}</td>
              <td>
                {v.status === "draft"
                  ? <button className="btn ghost sm" onClick={e => e.stopPropagation()}>Interest</button>
                  : <button className="btn sm primary" style={suspended ? { opacity: 0.45 } : {}} onClick={e => { e.stopPropagation(); if (!suspended) onDeposit(v); }}>{suspended ? "Susp." : "Deposit"}</button>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

Object.assign(window, { MarketScreen });
