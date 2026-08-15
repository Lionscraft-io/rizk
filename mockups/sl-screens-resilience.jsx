// Resilience — outcomes & impact: who is protected, commitments, pilot measures

const ResilienceScreen = ({ goTo, sim }) => {
  const totalCover = SL_OPERATORS.reduce((s, o) => s + o.coverage, 0);
  const sectorColor = { telecom: "#4a9eff", power: "#f5b941" };
  const stChip = (status) => {
    const map = { "Met": "live", "On track": "live", "In progress": "warn" };
    return <span className={cls("chip", map[status] ?? "")}>{status}</span>;
  };

  // group metrics by section
  const groups = [];
  SL_RESILIENCE_METRICS.forEach(m => {
    let g = groups.find(g => g.name === m.group);
    if (!g) { g = { name: m.group, items: [] }; groups.push(g); }
    g.items.push(m);
  });

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Resilience · Outcomes & Impact {sim ? "· TC Vidura event (simulated)" : ""}</div>
          <h1 className="h-display" style={{ fontSize: 36 }}>Protection that pays out in <em>outcomes.</em></h1>
        </div>
        <div className="meta">
          <div className="stat">
            <div className="label">People Served</div>
            <div className="val">21.9M</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">Operator Cover</div>
            <div className="val">{fmtUSD(totalCover)}</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">Priority Facilities</div>
            <div className="val" style={{ color: "var(--accent)" }}>107</div>
          </div>
        </div>
      </header>

      {sim ? (
        <div className="alert-banner mb-24">
          <span className="pulse" />
          <div style={{ fontSize: 13 }}>
            Post-event measurement active — commitments below show verified TC Vidura performance. Restoration reached
            2.1M people at peak disruption; 27 of 34 hospitals re-energised within 72h.
          </div>
          <button className="btn sm" style={{ marginLeft: "auto", flexShrink: 0 }} onClick={() => goTo("payouts")}>Follow the funds <Icon name="arrowR" /></button>
        </div>
      ) : (
        <div className="card card-pad mb-24" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span className="chip live">Standing</span>
          <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
            When a disaster hits, electricity and telecom operators must fund emergency response immediately while keeping
            essential services running. This facility pre-arranges that funding — and binds it to the public-service
            commitments below, agreed before any event.
          </div>
        </div>
      )}

      {/* Operators + commitments */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {SL_OPERATORS.map(op => (
          <div key={op.id} className="card">
            <div className="card-head">
              <div className="row-flex gap-8">
                <span style={{ width: 8, height: 8, borderRadius: 2, background: sectorColor[op.sector] }} />
                <div className="label" style={{ color: "var(--ink-1)" }}>{op.name}</div>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{op.sectorLabel}</span>
              </div>
              <span className="num" style={{ fontSize: 13, color: "var(--ink-0)" }}>{fmtUSD(op.coverage)} <span style={{ color: "var(--ink-3)", fontSize: 10 }}>cover</span></span>
            </div>
            <div className="card-pad" style={{ paddingTop: 14 }}>
              <div style={{ fontSize: 12.5, color: "var(--ink-1)", marginBottom: 4 }}>{op.assets}</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 14 }}>{op.serves}</div>
              <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.6, paddingTop: 12, borderTop: "1px solid var(--line-1)" }}>
                <span className="mono" style={{ fontSize: 9, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginRight: 8 }}>Commitments</span>
                {op.commitments}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Facilities map + commitments table */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Priority-Restoration Network</div>
            <span className="chip solid">107 facilities</span>
          </div>
          <div style={{ padding: 12 }}>
            <SLFacilityMap />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="label">Public-Service Commitments {sim ? "— verified performance" : "— agreed targets"}</div>
            {sim && <span className="chip live">Verified reporting</span>}
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Commitment</th>
                <th>Target</th>
                {sim && <th>Actual</th>}
                <th style={{ textAlign: "right" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {SL_COMMITMENTS.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12.5, color: "var(--ink-0)" }}>{c.c}</td>
                  <td className="mono" style={{ fontSize: 11, color: "var(--ink-2)" }}>{c.target}</td>
                  {sim && <td style={{ fontSize: 12, color: "var(--ink-1)" }}>{c.actual}</td>}
                  <td style={{ textAlign: "right" }}>{sim ? stChip(c.status) : <span className="chip">Agreed</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="card-pad" style={{ borderTop: "1px solid var(--line-1)", fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.55 }}>
            Commitments are funded by the payout and the preparedness fund, verified by the monitoring agent against
            operator telemetry — reported to every investor and donor.
          </div>
        </div>
      </section>

      {/* The Ditwah gap */}
      <div className="card mb-24">
        <div className="card-head">
          <div className="label">The Ditwah Gap — why restoration is measured, not reported</div>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>Cyclone Ditwah · Nov 2025</span>
        </div>
        <div className="card-pad">
          <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 18, maxWidth: 780 }}>
            Three accounts of the same outage. Early operator updates said the network was "largely restored" within
            days; residents counted one to two weeks; the government–UN assessment agreed with the residents. This
            facility verifies restoration with independent data — so funds and commitments track what people actually
            experience, not the first press release.
          </div>
          {[
            { label: "Early operator / utility claims", days: 6.5, text: "comms ~80% in 2 days · power 85% in 6–7 days", color: "var(--accent)" },
            { label: "Residents & field reports", days: 11, text: "7, 8, even 11 days dark — central highlands & estate sector", color: "#d97757" },
            { label: "Measured data & Govt–UN PDNA", days: 14, text: "outages up to 14 days · traffic down 80–95% across 7 provinces", color: "#b08cff" },
          ].map((b, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12.5, color: "var(--ink-0)" }}>{b.label}</span>
                <span className="num" style={{ fontSize: 12, color: b.color }}>{b.days} days</span>
              </div>
              <div style={{ position: "relative", height: 10, background: "var(--bg-3)", borderRadius: 5 }}>
                <span style={{ position: "absolute", inset: 0, width: (b.days / 14) * 100 + "%", background: b.color, borderRadius: 5, opacity: 0.85 }} />
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 4 }}>{b.text}</div>
            </div>
          ))}
          <div className="row-flex" style={{ justifyContent: "space-between", marginTop: 2 }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>0</span>
            <span className="mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>1 week</span>
            <span className="mono" style={{ fontSize: 9, color: "var(--ink-4)" }}>2 weeks</span>
          </div>
        </div>
      </div>

      {/* Pilot measures */}
      {groups.map(g => (
        <section key={g.name} className="mb-24">
          <div className="eyebrow mb-8" style={{ paddingLeft: 2 }}>{g.name}</div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${Math.max(g.items.length, 2)}, 1fr)`, gap: 16 }}>
            {g.items.map(m => (
              <div key={m.id} className="card card-pad">
                <div className="row-flex" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                  <span className="label">{m.id} · {m.name}</span>
                </div>
                <div className="num" style={{ fontSize: 28, color: "var(--accent)", lineHeight: 1 }}>{m.val}</div>
                <div style={{ fontSize: 12, color: "var(--ink-1)", marginTop: 10, lineHeight: 1.5 }}>{m.sub}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 8 }}>{m.benchmark}</div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="card card-pad" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <Icon name="shield" size={18} />
        <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink-0)" }}>Why it matters.</strong> Conventional insurance rarely covers the full
          cost of emergency response, continuity and recovery. And national averages hide the long tail: after Ditwah,
          "85% restored in a week" was true while estate-highland communities sat dark for up to 14 days. That is why
          commitments here are defined by the last district restored — not the national average — and verified with
          independent data every funder can see.
        </div>
      </div>
    </div>
  );
};

// Sri Lanka map — critical facilities layer
const SLFacilityMap = () => {
  const LANKA = "M 70 17 L 92 34 L 90 65 L 130 73 L 152 105 L 170 143 L 196 185 L 220 228 L 232 270 L 235 315 L 210 360 L 162 388 L 110 408 L 72 397 L 48 350 L 35 307 L 34 280 L 25 197 L 33 150 L 40 102 L 40 55 L 55 25 Z";
  const colors = { hospital: "var(--danger)", shelter: "#4a9eff", water: "var(--accent)" };
  return (
    <svg viewBox="0 0 300 440" style={{ width: "100%", display: "block" }}>
      {[75, 150, 225].map(x => <line key={"x"+x} x1={x} y1="0" x2={x} y2="440" stroke="var(--line-1)" strokeWidth="1" />)}
      {[110, 220, 330].map(y => <line key={"y"+y} x1="0" y1={y} x2="300" y2={y} stroke="var(--line-1)" strokeWidth="1" />)}
      <path d={LANKA} fill="var(--bg-3)" stroke="var(--line-3)" strokeWidth="1.25" opacity="0.9" />
      {SL_FACILITIES.map((f, i) => (
        f.type === "hospital"
          ? <g key={i} transform={`translate(${f.x}, ${f.y})`}>
              <line x1="-3" y1="0" x2="3" y2="0" stroke={colors.hospital} strokeWidth="1.8" />
              <line x1="0" y1="-3" x2="0" y2="3" stroke={colors.hospital} strokeWidth="1.8" />
            </g>
          : f.type === "shelter"
          ? <path key={i} d={`M ${f.x} ${f.y - 3.2} L ${f.x + 3} ${f.y + 2.4} L ${f.x - 3} ${f.y + 2.4} Z`} fill="none" stroke={colors.shelter} strokeWidth="1.4" />
          : <circle key={i} cx={f.x} cy={f.y} r="2.4" fill="none" stroke={colors.water} strokeWidth="1.4" />
      ))}
      <g transform="translate(190, 40)">
        <rect x="-10" y="-14" width="116" height="72" rx="4" fill="var(--bg-1)" stroke="var(--line-2)" />
        <text x="0" y="2" fontSize="8" fontFamily="IBM Plex Mono" fill="var(--ink-3)" letterSpacing="0.1em">PRIORITY QUEUE</text>
        <g transform="translate(4, 16)"><line x1="-3" y1="0" x2="3" y2="0" stroke={colors.hospital} strokeWidth="1.8"/><line x1="0" y1="-3" x2="0" y2="3" stroke={colors.hospital} strokeWidth="1.8"/></g>
        <text x="14" y="19" fontSize="8.5" fontFamily="IBM Plex Mono" fill="var(--ink-2)">Hospitals (34)</text>
        <path d="M 4 28 L 7 34 L 1 34 Z" fill="none" stroke={colors.shelter} strokeWidth="1.4" />
        <text x="14" y="34" fontSize="8.5" fontFamily="IBM Plex Mono" fill="var(--ink-2)">Shelters (61)</text>
        <circle cx="4" cy="46" r="2.4" fill="none" stroke={colors.water} strokeWidth="1.4" />
        <text x="14" y="49" fontSize="8.5" fontFamily="IBM Plex Mono" fill="var(--ink-2)">Water plants (12)</text>
      </g>
      <text x="12" y="428" fontSize="9" fontFamily="IBM Plex Mono" fill="var(--ink-4)">Priority restoration ahead of general queue — not to scale</text>
    </svg>
  );
};

Object.assign(window, { ResilienceScreen, SLFacilityMap });
