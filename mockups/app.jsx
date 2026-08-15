// Main app — top nav, screen switching, deposit modal, ticker, tweaks

const { useState: useS, useEffect: useE, useMemo: useM } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "day",
  "accent": "#1c9b7c",
  "density": "comfortable",
  "showCedent": true
}/*EDITMODE-END*/;

const NIGHT_DEFAULT_ACCENT = "#6ee0c8";
const DAY_DEFAULT_ACCENT = "#1c9b7c";

const NAV_TABS = [
  { id: "portfolio",   label: "Portfolio" },
  { id: "marketplace", label: "Invest" },
  { id: "claims",      label: "Claims · Oracle" },
  { id: "secondary",   label: "Secondary" },
];

const RZ_SCREEN_KEY = "rizk.screen";

function App() {
  const [screen, setScreen] = useS(() => {
    const valid = NAV_TABS.map(t => t.id).concat(["vault"]);
    try { const s = localStorage.getItem(RZ_SCREEN_KEY); return valid.includes(s) ? s : "portfolio"; } catch (e) { return "portfolio"; }
  });
  useE(() => { try { localStorage.setItem(RZ_SCREEN_KEY, screen); } catch (e) {} }, [screen]);
  const [vaultId, setVaultId] = useS(null);
  const [side, setSide] = useS("investor"); // investor | cedent
  const [depositVault, setDepositVault] = useS(null);
  const [, setVaultRev] = useS(0);
  const addCoverage = (vault) => {
    VAULTS.unshift(vault);
    COVERAGES.unshift({ id: "COV-" + vault.id.slice(4), vaultId: vault.id, limit: vault.capacity,
      posted: 0, premium: 0, status: "Structuring", utilization: 0 });
    setVaultRev(r => r + 1);
  };
  const updateCoverage = (vaultId, form) => {
    const v = VAULTS.find(x => x.id === vaultId);
    if (v) {
      const limit = form.limit * 1_000_000;
      Object.assign(v, {
        request: { ...form },
        capacity: limit,
        term: form.term,
        trigger: form.trigger + " — index to be defined and independently modelled during feasibility.",
        triggerShort: form.trigger.split("\u2014")[0].trim(),
        payoutUse: form.use,
        name: (form.name && form.name.trim()) || (form.region.split("\u2014")[0].trim() + " " + form.peril),
        categoryLabel: "In structuring · " + form.peril.split(" ")[0],
        description: "Cedent request " + v.requestRef + " — " + form.limit + "M of " + form.peril.toLowerCase()
          + " cover for " + v.cedentShort + ". In feasibility review: index design and basis-risk analysis before the book opens.",
      });
      const cov = COVERAGES.find(c => c.vaultId === vaultId);
      if (cov) cov.limit = limit;
    }
    setVaultRev(r => r + 1);
  };
  const [tweaks, setTweaks] = useTweaks((() => {
    try {
      const t = localStorage.getItem("rizk.theme");
      return t === "night" || t === "day" ? { ...TWEAK_DEFAULTS, theme: t } : TWEAK_DEFAULTS;
    } catch (e) { return TWEAK_DEFAULTS; }
  })());
  useE(() => { try { localStorage.setItem("rizk.theme", tweaks.theme); } catch (e) {} }, [tweaks.theme]);

  const goTo = (s, ctx) => {
    setScreen(s === "vault" ? "vault" : s);
    if (s === "vault") setVaultId(ctx);
    if (s === "secondary" && ctx) setVaultId(ctx);
    if (s === "portfolio") {} // no-op
    // scroll top
    const m = document.querySelector(".main");
    if (m) m.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDeposit = (v) => setDepositVault(v);
  const closeDeposit = () => setDepositVault(null);

  // Apply accent override
  useE(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    // glow + dim derived
    document.documentElement.style.setProperty("--accent-glow", tweaks.accent + "30");
  }, [tweaks.accent]);

  // theme — sets data-theme attribute; swaps default accent if user hasn't customized
  useE(() => {
    document.documentElement.dataset.theme = tweaks.theme;
    if (tweaks.theme === "day" && tweaks.accent === NIGHT_DEFAULT_ACCENT) {
      setTweaks("accent", DAY_DEFAULT_ACCENT);
    } else if (tweaks.theme === "night" && tweaks.accent === DAY_DEFAULT_ACCENT) {
      setTweaks("accent", NIGHT_DEFAULT_ACCENT);
    }
  }, [tweaks.theme]);

  // density
  useE(() => {
    document.documentElement.style.setProperty("--gutter", tweaks.density === "compact" ? "20px" : "32px");
  }, [tweaks.density]);

  return (
    <div className="app">
      <TopNav
        screen={screen}
        setScreen={goTo}
        side={side}
        setSide={setSide}
        showCedentToggle={tweaks.showCedent}
        theme={tweaks.theme}
        toggleTheme={() => setTweaks("theme", tweaks.theme === "night" ? "day" : "night")}
      />

      <main className="main">
        {screen === "marketplace" && (side === "cedent" ? <CedentPortfolio goTo={goTo} onCreate={addCoverage} onUpdate={updateCoverage} /> : <MarketplaceScreen goTo={goTo} side={side} onDeposit={onDeposit} />)}
        {screen === "vault" && <VaultScreen vaultId={vaultId} goTo={goTo} onDeposit={onDeposit} side={side} />}
        {screen === "portfolio" && <PortfolioScreen goTo={goTo} side={side} />}
        {screen === "claims" && <ClaimsScreen goTo={goTo} />}
        {screen === "secondary" && <SecondaryScreen goTo={goTo} vaultId={vaultId} />}
      </main>

      {depositVault && <DepositModal vault={depositVault} onClose={closeDeposit} />}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Theme">
          <TweakRadio
            label="Mode"
            value={tweaks.theme}
            onChange={v => setTweaks("theme", v)}
            options={[{ value: "night", label: "Night" }, { value: "day", label: "Day" }]}
          />
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            onChange={v => setTweaks("accent", v)}
            options={tweaks.theme === "day"
              ? ["#1c9b7c", "#2563d6", "#b8821a", "#7a4cc9", "#c43d59"]
              : ["#6ee0c8", "#7aa5ff", "#f5b941", "#b08cff", "#ff7a8a"]}
          />
        </TweakSection>
        <TweakSection title="Layout">
          <TweakRadio
            label="Density"
            value={tweaks.density}
            onChange={v => setTweaks("density", v)}
            options={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]}
          />
          <TweakToggle label="Cedent toggle in nav" value={tweaks.showCedent} onChange={v => setTweaks("showCedent", v)} />
        </TweakSection>
        <TweakSection title="Demo">
          <TweakButton label="Open Trigger Event Demo" onClick={() => goTo("claims")} />
          <TweakButton label="Reset to Investor View" onClick={() => { setSide("investor"); goTo("marketplace"); }} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// Top navigation bar
const TopNav = ({ screen, setScreen, side, setSide, showCedentToggle, theme, toggleTheme }) => (
  <nav className="nav">
    <div className="nav-brand" onClick={() => setScreen("portfolio")} style={{ cursor: "pointer" }}>
      <span className="dot" />
      <span className="logo">RIZK</span>
      <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginLeft: 8 }}>v0.7</span>
    </div>
    <div className="nav-tabs">
      {NAV_TABS.map(t => (
        <button
          key={t.id}
          className={cls("nav-tab", screen === t.id || (screen === "vault" && t.id === "marketplace") ? "active" : "")}
          onClick={() => setScreen(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
    <div className="nav-right">
      {showCedentToggle && (
        <div className="side-toggle">
          <button className={side === "investor" ? "active" : ""} onClick={() => setSide("investor")}>Investor</button>
          <button className={side === "cedent" ? "active" : ""} onClick={() => setSide("cedent")}>Cedent</button>
        </div>
      )}
      <button
        className="theme-btn"
        onClick={toggleTheme}
        title={`Switch to ${theme === "night" ? "day" : "night"} mode`}
        aria-label={`Switch to ${theme === "night" ? "day" : "night"} mode`}
      >
        <Icon name={theme === "night" ? "sun" : "moon"} size={15} />
      </button>
      <button className="wallet-btn">
        <span className="wdot" />
        <span>0x4b91…f10d</span>
        <span style={{ color: "var(--ink-3)" }}>·</span>
        <span style={{ color: "var(--ink-2)" }}>$98.2K</span>
      </button>
    </div>
  </nav>
);

// Ticker bar at bottom
const TickerBar = () => {
  // Build live ticker text from ORACLE_SIGNALS plus VAULT prices
  const items = [
    ...VAULTS.map(v => ({
      name: v.id,
      val: "$" + v.pricePerToken.toFixed(4),
      delta: ((Math.random() * 2 - 0.4)).toFixed(2),
    })),
    ...ORACLE_SIGNALS.map(s => ({
      name: s.id,
      val: s.value + " " + s.unit.split(" ")[0],
      delta: (s.change > 0 ? "+" : "") + s.change,
    })),
  ];
  const doubled = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-label">
        <span className="dot" style={{ width: 6, height: 6, background: "var(--accent)", borderRadius: "50%" }} />
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>RIZK Feed</span>
      </div>
      <div className="ticker-track">
        <div className="ticker-rail">
          {doubled.map((it, i) => {
            const isUp = parseFloat(it.delta) >= 0;
            return (
              <span key={i} className="tk-item">
                <span className="tk-name">{it.name}</span>
                <span className="tk-val">{it.val}</span>
                <span className={isUp ? "tk-up" : "tk-dn"}>{isUp ? "▲" : "▼"} {Math.abs(parseFloat(it.delta))}</span>
              </span>
            );
          })}
        </div>
      </div>
      <div className="ticker-label" style={{ borderLeft: "1px solid var(--line-1)", borderRight: "none" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>BLOCK 21,148,302</span>
      </div>
    </div>
  );
};

// Deposit Modal — slider + confirm
const DepositModal = ({ vault, onClose }) => {
  const [amount, setAmount] = useS(5000);
  const [step, setStep] = useS(0);  // 0 form, 1 confirm, 2 success
  const balance = 98_241;
  const tokens = amount / vault.pricePerToken;
  const annualPremium = amount * (vault.apy / 100);
  const termMonths = 12;
  const projectedPremium = annualPremium * (termMonths / 12);

  const max = Math.min(balance, vault.capacity - vault.tvl);
  const pct = (amount / max) * 100;

  const confirm = () => setStep(1);
  const submit = () => setStep(2);

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="row-flex gap-8 mb-8">
              <CatDot cat={vault.category} />
              <span className="eyebrow">{vault.categoryLabel}</span>
            </div>
            <div className="h-section">{step === 2 ? "Deposit Confirmed" : "Deposit USDC"}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>{vault.name} · {vault.id}</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" /></button>
        </div>

        <div className="modal-body">
          {step === 0 && (
            <>
              {/* Amount */}
              <div className="label mb-8">Amount</div>
              <div className="card-pad" style={{ background: "var(--bg-2)", borderRadius: 6, marginBottom: 16 }}>
                <div className="row-flex" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Math.min(+e.target.value || 0, max))}
                    style={{ background: "transparent", border: "none", outline: "none", color: "var(--ink-0)", fontFamily: "IBM Plex Mono", fontSize: 28, width: "60%" }}
                  />
                  <div className="mono" style={{ fontSize: 13, color: "var(--ink-2)" }}>USDC</div>
                </div>
                <div className="row-flex" style={{ justifyContent: "space-between", marginTop: 12 }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>Balance: {fmtUSDExact(balance)}</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>Open capacity: {fmtUSD(vault.capacity - vault.tvl)}</span>
                </div>
              </div>

              <input
                type="range"
                className="range"
                min={100}
                max={max}
                step={100}
                value={amount}
                onChange={e => setAmount(+e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <div className="row-flex gap-4 mb-24">
                {[10, 25, 50, 100].map(p => (
                  <button key={p} className="btn ghost sm" style={{ flex: 1 }} onClick={() => setAmount(Math.round(max * p / 100))}>
                    {p === 100 ? "MAX" : p + "%"}
                  </button>
                ))}
              </div>

              <div className="divider" />

              <div className="kv mb-24">
                <div className="k">You receive</div><div className="v">{fmtNum(tokens, 2)} {vault.id} tokens</div>
                <div className="k">Token price</div><div className="v">${vault.pricePerToken.toFixed(4)}</div>
                <div className="k">Premium APY</div><div className="v" style={{ color: "var(--accent)" }}>{vault.apy}%</div>
                <div className="k">Term</div><div className="v">{vault.term}</div>
                <div className="k">Settlement</div><div className="v">T+0 onchain</div>
                <div className="k">Est. premium · {termMonths}m</div><div className="v" style={{ color: "var(--accent)" }}>+{fmtUSDExact(projectedPremium)}</div>
              </div>

              <div style={{ padding: 14, background: "rgba(245, 185, 65, 0.06)", border: "1px solid rgba(245, 185, 65, 0.25)", borderRadius: 6, color: "var(--ink-1)", fontSize: 12, lineHeight: 1.6 }}>
                <strong style={{ color: "var(--warn)" }}>Risk notice.</strong> Capital is locked as protection collateral. If the parametric trigger fires, your principal is paid out to the cedent and your position closes early.
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="kv mb-24" style={{ padding: 16, background: "var(--bg-2)", borderRadius: 6 }}>
                <div className="k">Deposit</div><div className="v">{fmtUSDExact(amount)} USDC</div>
                <div className="k">Vault</div><div className="v">{vault.id}</div>
                <div className="k">Tokens out</div><div className="v">{fmtNum(tokens, 2)}</div>
                <div className="k">Premium APY</div><div className="v" style={{ color: "var(--accent)" }}>{vault.apy}%</div>
                <div className="k">Gas (est.)</div><div className="v">~$1.20</div>
                <div className="k">Slippage</div><div className="v">0.00%</div>
              </div>
              <div className="label mb-8">Transaction Steps</div>
              <div>
                {[
                  ["Approve USDC spending", "Done"],
                  ["Submit deposit transaction", "Pending"],
                  ["Mint vault tokens to wallet", "Queued"],
                ].map(([s, st], i) => (
                  <div key={i} className="row-flex" style={{ padding: "12px 0", borderTop: i ? "1px solid var(--line-1)" : "none", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--ink-1)", fontSize: 13 }}>{i + 1}. {s}</span>
                    <span className={cls("chip", st === "Done" ? "live" : st === "Pending" ? "warn" : "")}>{st}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent)", color: "#052017", display: "inline-flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 10 17 19 7" /></svg>
              </div>
              <div className="h-section mb-8">Position opened</div>
              <div style={{ color: "var(--ink-2)", fontSize: 13, marginBottom: 24 }}>
                {fmtNum(tokens, 2)} {vault.id} tokens minted to 0x4b91…f10d.
              </div>
              <div className="kv" style={{ padding: 16, background: "var(--bg-2)", borderRadius: 6, textAlign: "left" }}>
                <div className="k">Transaction</div><div className="v">0x7a3c…b91d</div>
                <div className="k">Block</div><div className="v">21,148,302</div>
                <div className="k">Gas</div><div className="v">$1.18</div>
                <div className="k">First premium</div><div className="v">in 14 days</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          {step === 0 && (
            <>
              <button className="btn ghost" onClick={onClose}>Cancel</button>
              <button className="btn primary" onClick={confirm}>Review Deposit</button>
            </>
          )}
          {step === 1 && (
            <>
              <button className="btn ghost" onClick={() => setStep(0)}>Back</button>
              <button className="btn primary" onClick={submit}>Submit · {fmtUSDExact(amount)}</button>
            </>
          )}
          {step === 2 && (
            <>
              <button className="btn ghost" onClick={onClose}>Close</button>
              <button className="btn primary" onClick={onClose}>View Position</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
