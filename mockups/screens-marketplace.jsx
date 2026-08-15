// Marketplace — browse vaults

const MarketplaceScreen = ({ goTo, side, onDeposit }) => {
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("apy");
  const [view, setView] = useState("fund");
  const [query, setQuery] = useState("");

  const CAT_LABELS = { maritime: "Maritime", natcat: "Natural Catastrophe", weather: "Weather & Climate", cyber: "Cyber" };
  const cats = [
    { id: "all", label: "All Vaults", count: VAULTS.length },
    ...Array.from(new Set(VAULTS.map(v => v.category))).map(c => ({
      id: c, label: CAT_LABELS[c] || c, count: VAULTS.filter(v => v.category === c).length,
    })),
  ];

  let list = [...VAULTS];
  if (cat !== "all") list = list.filter(v => v.category === cat);
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(v => v.name.toLowerCase().includes(q) || v.cedent.toLowerCase().includes(q));
  }
  if (sort === "apy") list.sort((a, b) => b.apy - a.apy);
  if (sort === "tvl") list.sort((a, b) => b.tvl - a.tvl);
  if (sort === "term") list.sort((a, b) => a.term.localeCompare(b.term));
  if (sort === "rating") list.sort((a, b) => a.rating.localeCompare(b.rating));

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Invest</div>
          <h1 className="h-display">Browse <em>risk vaults.</em></h1>
        </div>
        <div className="meta">
          <div className="stat">
            <div className="label">Open Capacity</div>
            <div className="val">${(VAULTS.reduce((s, v) => s + (v.capacity - v.tvl), 0) / 1_000_000).toFixed(1)}M</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">APY Range</div>
            <div className="val">{Math.min(...VAULTS.map(v=>v.apy)).toFixed(1)}–{Math.max(...VAULTS.map(v=>v.apy)).toFixed(1)}%</div>
          </div>
        </div>
      </header>

      {/* Filters bar */}
      <div className="row-flex gap-8 mb-24" style={{ flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c.id} className={cls("btn", cat === c.id ? "primary" : "ghost")} onClick={() => setCat(c.id)}>
            {c.label} <span className="num" style={{ opacity: 0.6, marginLeft: 4 }}>{c.count}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div className="input" style={{ width: 240 }}>
          <Icon name="search" />
          <input placeholder="Search vaults, cedents…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="input" style={{ paddingRight: 8 }}>
          <span className="label" style={{ margin: 0 }}>Sort</span>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: "transparent", border: "none", color: "var(--ink-0)", fontFamily: "inherit", fontSize: 12, outline: "none" }}>
            <option value="apy">APY (high → low)</option>
            <option value="tvl">TVL</option>
            <option value="term">Term</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div className="side-toggle" style={{ margin: 0 }}>
          <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} title="Grid view"><Icon name="grid" size={12} /></button>
          <button className={view === "fund" ? "active" : ""} onClick={() => setView("fund")} title="Fund view"><Icon name="card" size={12} /></button>
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} title="List view"><Icon name="list" size={12} /></button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid g-3">
          {list.map(v => <VaultCard key={v.id} v={v} goTo={goTo} onDeposit={onDeposit} />)}
        </div>
      ) : view === "fund" ? (
        <div className="grid g-3" style={{ alignItems: "stretch" }}>
          {list.map(v => {
            const color = v.category === "maritime" ? "#4a9eff" : v.category === "natcat" ? "#f5b941" : v.category === "cyber" ? "#b08cff" : "#6ee0c8";
            const ticker = v.ticker || v.id.split("-")[1];
            return (
              <FundCard
                key={v.id}
                ticker={ticker}
                name={v.name}
                issuer={v.cedentShort}
                desc={v.description}
                color={color}
                status={(() => { const st = vaultStatusOf(v); return <span className={cls("chip", st.cls)}>{st.label}</span>; })()}
                capacity={{ tvl: v.tvl, cap: v.capacity, investors: v.investors }}
                facts={[
                  ["Premium APY", v.apy + "%", true],
                  ["Term Remaining", v.termRemaining],
                  ["Rating · Tranche", v.rating + " · " + v.tranche],
                ]}
                tags={[v.categoryLabel, "Parametric", "T+0 Settlement"]}
                link={v.artemisUrl}
                onView={() => goTo("vault", v.id)}
              />
            );
          })}
        </div>
      ) : (
        <VaultTable list={list} goTo={goTo} onDeposit={onDeposit} />
      )}
    </div>
  );
};

const VaultCard = ({ v, goTo, onDeposit }) => {
  const capPct = (v.tvl / v.capacity) * 100;
  return (
    <div className="vault-card" onClick={() => goTo("vault", v.id)}>
      <div className="vault-card-head">
        <div className="row-flex gap-8">
          <CatDot cat={v.category} />
          <span className="eyebrow">{v.categoryLabel}</span>
        </div>
        <span className="chip">{v.rating}</span>
      </div>
      <div className="vault-card-body">
        <div className="h-card" style={{ fontSize: 17, marginBottom: 4 }}>{v.name}</div>
        <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginBottom: 16 }}>{v.cedentShort} · {v.id}</div>

        <div style={{ marginBottom: 16 }}>
          <Sparkline data={v.apy7d} color={v.category === "maritime" ? "#4a9eff" : v.category === "natcat" ? "#f5b941" : v.category === "cyber" ? "#b08cff" : "#6ee0c8"} height={42} />
        </div>

        <div className="grid g-2" style={{ gap: 12 }}>
          <div>
            <div className="label">Premium APY</div>
            <div className="num" style={{ fontSize: 22, color: "var(--accent)", marginTop: 2 }}>{v.apy}%</div>
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
            <div className={cls("meter", capPct > 80 ? "warn" : "")}>
              <span style={{ width: capPct + "%" }} />
            </div>
          </div>
        </div>
      </div>
      <div className="vault-card-foot">
        <div className="row-flex gap-8">
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>Trigger</span>
          <span style={{ fontSize: 11, color: "var(--ink-1)" }}>{v.triggerShort}</span>
        </div>
        <button className="btn primary sm" onClick={e => { e.stopPropagation(); onDeposit(v); }}>Deposit</button>
      </div>
    </div>
  );
};

const VaultTable = ({ list, goTo, onDeposit }) => (
  <div className="card">
    <table className="table">
      <thead>
        <tr>
          <th>Vault</th>
          <th>Category</th>
          <th style={{ textAlign: "right" }}>APY</th>
          <th style={{ textAlign: "right" }}>TVL / Cap</th>
          <th>Term</th>
          <th>Rating</th>
          <th>Trigger</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {list.map(v => (
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
            <td><button className="btn sm primary" onClick={e => { e.stopPropagation(); onDeposit(v); }}>Deposit</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

Object.assign(window, { MarketplaceScreen });
