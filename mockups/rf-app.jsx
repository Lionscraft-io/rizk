// Resilience Facility — app shell: nav, phase switcher, participate modal, ticker, tweaks

const { useState: useS, useEffect: useE } = React;

const RF_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "day",
  "accent": "#1c9b7c",
  "density": "comfortable"
}/*EDITMODE-END*/;

const RF_NIGHT_ACCENT = "#6ee0c8";
const RF_DAY_ACCENT = "#1c9b7c";

const RF_TABS = [
  { id: "portfolio", label: "Portfolio" },
  { id: "market", label: "Invest" },
  { id: "secondary", label: "Secondary" },
  { id: "monitor", label: "Monitor · Claims" },
  { id: "trigger", label: "Trigger" },
  { id: "disburse", label: "Payouts" },
  { id: "reporting", label: "Reports" },
];

const RF_SCREEN_KEY = "resilience.screen";

function App() {
  const [screen, setScreen] = useS(() => {
    const valid = RF_TABS.map(t => t.id).concat(["vault", "facility"]);
    try { const s = localStorage.getItem(RF_SCREEN_KEY); return valid.includes(s) ? s : "portfolio"; } catch (e) { return "portfolio"; }
  });
  useE(() => { try { localStorage.setItem(RF_SCREEN_KEY, screen); } catch (e) {} }, [screen]);
  const [phase, setPhase] = useS("calm");
  const [vaultId, setVaultId] = useS(null);
  const [depositVault, setDepositVault] = useS(null);
  const [tweaks, setTweaks] = useTweaks((() => {
    try {
      const t = localStorage.getItem("rizk.theme");
      return t === "night" || t === "day" ? { ...RF_TWEAK_DEFAULTS, theme: t } : RF_TWEAK_DEFAULTS;
    } catch (e) { return RF_TWEAK_DEFAULTS; }
  })());
  useE(() => { try { localStorage.setItem("rizk.theme", tweaks.theme); } catch (e) {} }, [tweaks.theme]);

  const goTo = (s, ctx) => {
    setScreen(s);
    if ((s === "vault" || s === "secondary") && ctx) setVaultId(ctx);
    const m = document.querySelector(".main");
    if (m) m.scrollTo({ top: 0, behavior: "smooth" });
  };

  useE(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    document.documentElement.style.setProperty("--accent-glow", tweaks.accent + "30");
  }, [tweaks.accent]);

  useE(() => {
    document.documentElement.dataset.theme = tweaks.theme;
    if (tweaks.theme === "day" && tweaks.accent === RF_NIGHT_ACCENT) setTweaks("accent", RF_DAY_ACCENT);
    else if (tweaks.theme === "night" && tweaks.accent === RF_DAY_ACCENT) setTweaks("accent", RF_NIGHT_ACCENT);
  }, [tweaks.theme]);

  useE(() => {
    document.documentElement.style.setProperty("--gutter", tweaks.density === "compact" ? "20px" : "32px");
  }, [tweaks.density]);

  return (
    <div className="app">
      <RFNav
        screen={screen} setScreen={goTo}
        phase={phase} setPhase={setPhase}
        theme={tweaks.theme}
        toggleTheme={() => setTweaks("theme", tweaks.theme === "night" ? "day" : "night")}
      />

      <main className="main">
        {screen === "market" && <MarketScreen goTo={goTo} phase={phase} onDeposit={setDepositVault} />}
        {screen === "vault" && <VaultScreen goTo={goTo} phase={phase} vaultId={vaultId} onDeposit={setDepositVault} />}
        {screen === "portfolio" && <RFPortfolioScreen goTo={goTo} phase={phase} />}
        {screen === "secondary" && <RFSecondaryScreen goTo={goTo} phase={phase} vaultId={vaultId} />}
        {screen === "monitor" && <MonitorScreen goTo={goTo} phase={phase} />}
        {screen === "trigger" && <TriggerScreen goTo={goTo} phase={phase} />}
        {screen === "disburse" && <DisburseScreen goTo={goTo} phase={phase} />}
        {screen === "reporting" && <ReportScreen goTo={goTo} phase={phase} />}
      </main>

      {depositVault && <VaultDepositModal vault={depositVault} onClose={() => setDepositVault(null)} />}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Scenario">
          <TweakRadio
            label="Phase"
            value={phase}
            onChange={setPhase}
            options={PHASES.map(p => ({ value: p.id, label: p.label }))}
          />
          <TweakButton label="Run Event → Payout Demo" onClick={() => { setPhase("event"); goTo("trigger"); }} />
        </TweakSection>
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
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// Top navigation
const RFNav = ({ screen, setScreen, phase, setPhase, theme, toggleTheme }) => (
  <nav className="nav">
    <div className="nav-brand" onClick={() => setScreen("portfolio")} style={{ cursor: "pointer", minWidth: 175 }}>
      <span className="dot" />
      <span className="logo" style={{ letterSpacing: "0.1em", fontSize: 15 }}>LIONSCRAFT</span>
      <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginLeft: 6 }}>RESILIENCE</span>
    </div>
    <div className="nav-tabs">
      {RF_TABS.map(t => (
        <button
          key={t.id}
          className={cls("nav-tab", screen === t.id || (screen === "vault" && t.id === "market") ? "active" : "")}
          onClick={() => setScreen(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
    <div className="nav-right">
      <div className="side-toggle" title="Demo phase — Baseline (live) / Event / Payout (simulation)">
        {PHASES.map(p => (
          <button key={p.id} className={phase === p.id ? "active" : ""} onClick={() => setPhase(p.id)}>{p.label}</button>
        ))}
      </div>
      <button className="theme-btn" onClick={toggleTheme} title={`Switch to ${theme === "night" ? "day" : "night"} mode`}>
        <Icon name={theme === "night" ? "sun" : "moon"} size={15} />
      </button>
      <button className="wallet-btn" title={FACILITY.id}>
        <span className="wdot" />
        <span>{WALLET.addr}</span>
        <span style={{ color: "var(--ink-3)" }}>·</span>
        <span style={{ color: "var(--ink-2)" }}>${(WALLET.balance / 1000).toFixed(1)}K</span>
      </button>
    </div>
  </nav>
);

// Ticker
const RFTicker = ({ phase }) => {
  const items = SIGNALS.map(s => {
    const d = s[phase];
    return { name: s.id.replace("SIG-", ""), val: (typeof d.v === "number" ? d.v : d.v) + (s.unit ? " " + s.unit : ""), alert: !!d.alert, trend: d.trend };
  });
  RF_VAULTS.filter(v => v.status !== "draft").forEach(v => {
    const down = phase === "payout" && v.id === "VLT-SLCIR-A";
    items.push({ name: v.token, val: "$" + (down ? "0.2860" : v.price.toFixed(4)), alert: down, trend: down ? "down" : "flat" });
  });
  items.push({ name: "COLLATERAL", val: "$18.2M MMF", alert: false, trend: "flat" });
  const doubled = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-label">
        <span className="dot" style={{ width: 6, height: 6, background: "var(--accent)", borderRadius: "50%" }} />
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Facility Feed</span>
      </div>
      <div className="ticker-track">
        <div className="ticker-rail">
          {doubled.map((it, i) => (
            <span key={i} className="tk-item">
              <span className="tk-name">{it.name}</span>
              <span className="tk-val" style={it.alert ? { color: "var(--danger)" } : {}}>{it.val}</span>
              <span className={it.alert ? "tk-dn" : "tk-up"}>{it.trend === "up" ? "▲" : it.trend === "down" ? "▼" : "◆"}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="ticker-label" style={{ borderLeft: "1px solid var(--line-1)", borderRight: "none" }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{PHASE_META[phase].clock}</span>
      </div>
    </div>
  );
};

// Participate modal — subscribe (investor) or contribute (donor)
const ParticipateModal = ({ tranche, onClose }) => {
  const isInvestor = tranche.type === "investor";
  const [amount, setAmount] = useS(tranche.minTicket);
  const [step, setStep] = useS(0); // 0 form, 1 review, 2 done
  const open = tranche.size - tranche.funded;
  const max = Math.min(open, isInvestor ? 5_000_000 : 2_000_000);

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>{tranche.name}</div>
            <div className="h-section">{step === 2 ? (isInvestor ? "Subscription Settled" : "Contribution Recorded") : (isInvestor ? "Subscribe" : "Contribute")}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>{tranche.token} · {FACILITY.spv}</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" /></button>
        </div>

        <div className="modal-body">
          {step === 0 && (
            <>
              <div className="label mb-8">Amount</div>
              <div className="card-pad" style={{ background: "var(--bg-2)", borderRadius: 6, marginBottom: 16 }}>
                <div className="row-flex" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(Math.min(+e.target.value || 0, max))}
                    style={{ background: "transparent", border: "none", outline: "none", color: "var(--ink-0)", fontFamily: "IBM Plex Mono", fontSize: 26, width: "60%" }}
                  />
                  <div className="mono" style={{ fontSize: 13, color: "var(--ink-2)" }}>USD</div>
                </div>
                <div className="row-flex" style={{ justifyContent: "space-between", marginTop: 12 }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>Min ticket: {fmtUSD(tranche.minTicket)}</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>Open: {fmtUSD(open)}</span>
                </div>
              </div>
              <input type="range" className="range" min={tranche.minTicket} max={max} step={5000} value={amount} onChange={e => setAmount(+e.target.value)} style={{ marginBottom: 20 }} />

              <div className="kv mb-24">
                {isInvestor ? (
                  <>
                    <div className="k">Coupon</div><div className="v" style={{ color: "var(--accent)" }}>{tranche.coupon}% p.a.</div>
                    <div className="k">Attachment</div><div className="v">{tranche.attach}</div>
                    <div className="k">Eligibility</div><div className="v">Professional investor · allowlisted</div>
                    <div className="k">Collateral</div><div className="v">Tokenized MMF · segregated</div>
                  </>
                ) : (
                  <>
                    <div className="k">Earmark — sponsor</div><div className="v">Recorded on contribution token</div>
                    <div className="k">Earmark — purpose</div><div className="v">{tranche.id === "FUND-P" ? "Public-service commitments" : "First-loss protection"}</div>
                    <div className="k">Protection period</div><div className="v">Jun 2026 – Jun 2028</div>
                    <div className="k">Reporting</div><div className="v">Verified outcome reports</div>
                  </>
                )}
                <div className="k">Settlement</div><div className="v">T+0 · regulated DLT</div>
              </div>

              <div style={{ padding: 14, background: "rgba(245,185,65,0.06)", border: "1px solid rgba(245,185,65,0.25)", borderRadius: 6, color: "var(--ink-1)", fontSize: 12, lineHeight: 1.6 }}>
                <strong style={{ color: "var(--warn)" }}>{isInvestor ? "Risk notice." : "Note."}</strong>{" "}
                {isInvestor
                  ? "Principal is at risk. If the parametric trigger fires, principal reduces by the payout percentage of the tier attained."
                  : "Contributions are non-refundable and drawn first in a qualifying event. Unused funds at term end are returned or rolled per your earmark instruction."}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="kv mb-24" style={{ padding: 16, background: "var(--bg-2)", borderRadius: 6 }}>
                <div className="k">{isInvestor ? "Subscription" : "Contribution"}</div><div className="v">{fmtUSDExact(amount)}</div>
                <div className="k">Tranche</div><div className="v">{tranche.token}</div>
                {isInvestor && <><div className="k">Coupon</div><div className="v" style={{ color: "var(--accent)" }}>{tranche.coupon}%</div></>}
                <div className="k">Settlement</div><div className="v">T+0</div>
              </div>
              <div className="label mb-8">Steps</div>
              {[
                ["Eligibility & allowlist check", "Done"],
                [isInvestor ? "Sign subscription record" : "Sign contribution record", "Pending"],
                ["Settle against tokenized cash", "Queued"],
                [isInvestor ? "Notes minted with transfer controls" : "Earmarked contribution token minted", "Queued"],
              ].map(([s, st], i) => (
                <div key={i} className="row-flex" style={{ padding: "11px 0", borderTop: i ? "1px solid var(--line-1)" : "none", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink-1)", fontSize: 13 }}>{i + 1}. {s}</span>
                  <span className={cls("chip", st === "Done" ? "live" : st === "Pending" ? "warn" : "")}>{st}</span>
                </div>
              ))}
            </>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center", padding: "18px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent)", color: "#052017", display: "inline-flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 10 17 19 7" /></svg>
              </div>
              <div className="h-section mb-8">{isInvestor ? "Position opened" : "Contribution earmarked"}</div>
              <div style={{ color: "var(--ink-2)", fontSize: 13, marginBottom: 24 }}>
                {fmtUSDExact(amount)} settled T+0. {isInvestor ? `${tranche.token} notes minted with eligibility controls.` : `Sponsor, period and purpose recorded on ${tranche.token}.`}
              </div>
              <div className="kv" style={{ padding: 16, background: "var(--bg-2)", borderRadius: 6, textAlign: "left" }}>
                <div className="k">Record</div><div className="v">0x6d2f…a114</div>
                <div className="k">Network</div><div className="v">Regulated DLT · permissioned</div>
                <div className="k">Reporting</div><div className="v">Monthly + event reports</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          {step === 0 && (<>
            <button className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={() => setStep(1)}>Review</button>
          </>)}
          {step === 1 && (<>
            <button className="btn ghost" onClick={() => setStep(0)}>Back</button>
            <button className="btn primary" onClick={() => setStep(2)}>Submit · {fmtUSDExact(amount)}</button>
          </>)}
          {step === 2 && (<>
            <button className="btn ghost" onClick={onClose}>Close</button>
            <button className="btn primary" onClick={onClose}>Done</button>
          </>)}
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
