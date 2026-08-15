// Overview — facility landing screen

const OverviewScreen = ({ goTo, phase }) => {
  const meta = PHASE_META[phase];
  const funded = TRANCHES.reduce((s, t) => s + t.funded, 0);
  const fundedPct = (funded / FACILITY.notional) * 100;
  const feed = FEED[phase];
  const ts = TRIGGER_STATE[phase];

  const feedColor = {
    alert: "var(--danger)", gov: "var(--warn)", signal: "var(--info)", ops: "var(--ink-2)",
    capital: "var(--accent)", settle: "var(--accent)", model: "var(--info)", drill: "var(--ink-2)", report: "var(--ink-2)",
  };
  const feedLabel = {
    alert: "TRIGGER", gov: "GOVERNANCE", signal: "AI SIGNAL", ops: "OPERATOR",
    capital: "CAPITAL", settle: "SETTLEMENT", model: "MODEL", drill: "DRY RUN", report: "REPORTING",
  };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">{FACILITY.id} · {meta.tag}</div>
          <h1 className="h-display">Disaster risk financing for <em>critical infrastructure.</em></h1>
        </div>
        <div className="meta">
          <div className="stat">
            <div className="label">Parametric Protection</div>
            <div className="val">$20.0M</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">Capital Funded</div>
            <div className="val" style={{ color: "var(--accent)" }}>{fundedPct.toFixed(0)}%</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">Facility Status</div>
            <div style={{ paddingTop: 4 }}><PhaseChip phase={phase} /></div>
          </div>
        </div>
      </header>

      {meta.banner && (
        <div className="alert-banner mb-24" style={phase === "event" ? { background: "rgba(245,185,65,0.07)", borderColor: "rgba(245,185,65,0.4)" } : {}}>
          <span className="pulse" style={phase === "event" ? { background: "var(--warn)", boxShadow: "0 0 10px var(--warn)" } : {}} />
          <div style={{ fontSize: 13, lineHeight: 1.55 }}>{meta.banner}</div>
          <button className="btn sm" style={{ marginLeft: "auto", flexShrink: 0 }} onClick={() => goTo(phase === "payout" ? "disburse" : "trigger")}>
            {phase === "payout" ? "View Disbursement" : "Open Trigger Console"} <Icon name="arrowR" />
          </button>
        </div>
      )}

      {/* Lifecycle strip */}
      <div className="card card-pad mb-24">
        <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 14 }}>
          <span className="label">Transaction Lifecycle</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{meta.clock}</span>
        </div>
        <LifecycleStrip phase={phase} />
      </div>

      <section className="grid mb-24" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        {/* Facility card */}
        <div className="card">
          <div className="card-head">
            <div className="label">The Instrument</div>
            <button className="btn sm ghost" onClick={() => goTo("market")}>Browse Vaults <Icon name="arrowR" /></button>
          </div>
          <div style={{ padding: "20px 22px" }}>
            <div className="h-display" style={{ fontSize: 27, marginBottom: 12 }}>
              A parametric cat bond, <em>tokenized end-to-end.</em>
            </div>
            <div style={{ color: "var(--ink-2)", fontSize: 13, maxWidth: 560, marginBottom: 20, lineHeight: 1.6 }}>
              USD 20M of pre-arranged protection for Sri Lanka's telecom and electricity operators.
              When a qualifying cyclone or flood triggers the bond, funds pay out in hours — covering
              emergency response, restoration and public-service commitments such as zero-rated
              connectivity and priority restoration for hospitals and shelters.
            </div>
            <CapitalStack tranches={TRANCHES} />
            <div className="grid g-4 mt-24" style={{ gap: 16 }}>
              <div className="stat"><div className="label">Hazard</div><div className="val" style={{ fontSize: 15 }}>Cyclone + Flood</div></div>
              <div className="stat"><div className="label">Term</div><div className="val" style={{ fontSize: 15 }}>24 months</div></div>
              <div className="stat"><div className="label">Settlement</div><div className="val" style={{ fontSize: 15 }}>T+0 · DLT</div></div>
              <div className="stat"><div className="label">Payout Speed</div><div className="val" style={{ fontSize: 15, color: "var(--accent)" }}>≤48h target</div></div>
            </div>
          </div>
        </div>

        {/* Trigger snapshot */}
        <div className="card">
          <div className="card-head">
            <div className="label">Parametric Trigger — Live</div>
            <span className={cls("chip", ts.statusClass)}>{ts.status}</span>
          </div>
          <div className="card-pad">
            <TierGauge
              label="Sustained wind · box"
              value={ts.wind} max={120} unit="kt"
              color={ts.wind >= 64 ? "var(--danger)" : "var(--accent)"}
              tiers={[{ at: 64, label: "T1" }, { at: 85, label: "T2" }, { at: 100, label: "T3" }]}
            />
            <div style={{ height: 18 }} />
            <TierGauge
              label="72h rainfall + flood index"
              value={ts.rain} max={100} unit="/100"
              color={ts.rain >= 60 ? "var(--danger)" : "var(--accent)"}
              tiers={[{ at: 60, label: "T1" }, { at: 75, label: "T2" }, { at: 90, label: "T3" }]}
            />
            <div className="divider" style={{ margin: "18px 0" }} />
            <div className="kv">
              <div className="k">Tier attained</div>
              <div className="v" style={{ color: ts.tierMet ? "var(--danger)" : "var(--ink-0)" }}>{ts.tierMet ? `Tier ${ts.tierMet} — ${TRIGGER.tiers[ts.tierMet-1].payoutPct}% payout` : "None"}</div>
              <div className="k">Calculation agent</div><div className="v">Independent · model v2.4</div>
              <div className="k">Event window</div><div className="v">{phase === "calm" ? "Not open" : "Open · day " + (phase === "event" ? "1 of 14" : "4 of 14")}</div>
            </div>
            <button className="btn mt-16" style={{ width: "100%" }} onClick={() => goTo("trigger")}>Trigger Console <Icon name="arrowR" /></button>
          </div>
        </div>
      </section>

      {/* Operators + feed */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Covered Operators</div>
            <span className="chip solid">2 cedents</span>
          </div>
          <div>
            {OPERATORS.map((op, i) => (
              <div key={op.id} style={{ padding: "16px 22px", borderTop: i ? "1px solid var(--line-1)" : "none" }}>
                <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                  <div className="row-flex gap-8">
                    <SectorDot sector={op.sector} />
                    <span style={{ fontSize: 14, color: "var(--ink-0)", fontWeight: 500 }}>{op.name}</span>
                    <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{op.sectorLabel}</span>
                  </div>
                  <span className="num" style={{ fontSize: 13, color: "var(--ink-0)" }}>{fmtUSD(op.coverage)} <span style={{ color: "var(--ink-3)", fontSize: 10 }}>cover</span></span>
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 6 }}>{op.assets}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
                  <span className="mono" style={{ fontSize: 9, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginRight: 8 }}>Commitments</span>
                  {op.commitments}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="label">Facility Activity</div>
            <span className="chip">{phase === "calm" ? "Last 14 days" : "Live"}</span>
          </div>
          <div>
            {feed.map((ev, i) => (
              <div key={i} className="row-flex" style={{ padding: "13px 22px", borderTop: i ? "1px solid var(--line-1)" : "none", gap: 14, alignItems: "flex-start" }}>
                <div className="mono" style={{ fontSize: 9, color: feedColor[ev.type], minWidth: 92, letterSpacing: "0.1em", paddingTop: 2 }}>{feedLabel[ev.type]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "var(--ink-1)", lineHeight: 1.5 }}>{ev.text}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 3 }}>{ev.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilot framing footer */}
      <div className="card card-pad" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Pilot · Proposed Partnership with ADB</div>
          <div style={{ color: "var(--ink-1)", fontSize: 13, maxWidth: 760, lineHeight: 1.6 }}>
            The pilot tests how a tokenized digital ILS combined with AI-based monitoring can improve protection design,
            cut transaction and lifecycle costs, broaden access to donor and investor capital, and make smaller bespoke
            ILS transactions economical and repeatable.
          </div>
        </div>
        <button className="btn" onClick={() => goTo("reporting")} style={{ flexShrink: 0 }}>Results Framework <Icon name="arrowR" /></button>
      </div>
    </div>
  );
};

Object.assign(window, { OverviewScreen });
