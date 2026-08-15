// Vault detail — plug stablecoins into a resilience vault (generic, reached from Market)

const VaultScreen = ({ goTo, phase, vaultId, onDeposit }) => {
  const v = RF_VAULTS.find(x => x.id === vaultId) || RF_VAULTS[0];
  const isFlagship = v.id === "VLT-SLCIR-A";
  const pos = isFlagship ? VAULT_POSITION[phase] : RF_POSITIONS.find(p => p.vaultId === v.id);
  const fillPct = (v.tvl / v.capacity) * 100;
  const isPayout = phase === "payout" && isFlagship;
  const suspended = phase === "event" && v.id === "VLT-SLCIR-A";
  const isSLCIR = v.id === "VLT-SLCIR-A";
  const canDeposit = (phase === "calm" || !isSLCIR) && v.status !== "draft";
  const px = isPayout ? 0.286 : v.price;

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">
            <span style={{ cursor: "pointer" }} onClick={() => goTo("market")}>Invest</span> · {v.id} · funds {v.token}
          </div>
          <h1 className="h-display" style={{ fontSize: 34 }}>
            {isFlagship ? <>Plug in stablecoins, <em>back real resilience.</em></> : <>{v.name}<em>.</em></>}
          </h1>
        </div>
        <div className="meta">
          <div className="stat"><div className="label">TVL</div><div className="val">{fmtUSD(v.tvl)}</div></div>
          <div className="vdivider" />
          <div className="stat"><div className="label">Premium APY</div><div className="val" style={{ color: "var(--accent)" }}>{v.apy}%</div></div>
          <div className="vdivider" />
          <div className="stat"><div className="label">Token Price</div><div className="val" style={{ color: isPayout ? "var(--danger)" : "var(--ink-0)" }}>{px.toFixed(4)}</div></div>
        </div>
      </header>

      {suspended && (
        <div className="alert-banner mb-24" style={{ background: "rgba(245,185,65,0.07)", borderColor: "rgba(245,185,65,0.4)" }}>
          <span className="pulse" style={{ background: "var(--warn)", boxShadow: "0 0 10px var(--warn)" }} />
          <div style={{ fontSize: 13 }}>Trigger watch active — deposits, withdrawals and secondary transfers are suspended per bond terms until the event window resolves.</div>
        </div>
      )}
      {isPayout && (
        <div className="alert-banner mb-24">
          <span className="pulse" />
          <div style={{ fontSize: 13 }}>Tier 2 trigger confirmed — vault principal reduced 71.4% to fund the authorised payout. Notes now trade at 28.6 par; remaining collateral stays at risk to term end.</div>
          <button className="btn sm" style={{ marginLeft: "auto", flexShrink: 0 }} onClick={() => goTo("disburse")}>Follow the funds <Icon name="arrowR" /></button>
        </div>
      )}

      <section className="grid mb-24" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        {/* Left — about + yield chart */}
        <div className="col gap-16">
          <div className="card">
            <div className="card-head"><div className="label">How Your Deposit Works</div></div>
            <div className="card-pad">
              <div className="row-flex" style={{ gap: 0, width: "100%", flexWrap: "wrap" }}>
                {[
                  ["Deposit USDC", "min " + fmtUSD(v.minDeposit), "allowlisted wallet"],
                  ["Mint " + v.token, "eligibility & transfer controls", "T+0"],
                  ["Collateralised", "tokenized MMF units at SPV", "segregated"],
                  ["Earn premium", v.apy + "% p.a. streamed", "continuous"],
                  ["Trigger event?", "principal funds payout", "graduated"],
                ].map(([h, s, val], i, arr) => (
                  <React.Fragment key={i}>
                    <div style={{ flex: 1, minWidth: 128, padding: "12px 14px", background: "var(--bg-2)", border: "1px solid var(--line-2)", borderRadius: 6 }}>
                      <div style={{ fontSize: 12, color: "var(--ink-0)", fontWeight: 500 }}>{h}</div>
                      <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 3 }}>{s}</div>
                      <div className="mono" style={{ fontSize: 10, color: "var(--accent)", marginTop: 5 }}>{val}</div>
                    </div>
                    {i < arr.length - 1 && <Icon name="chevR" size={13} />}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.55, marginTop: 14 }}>
                No trigger by term end → principal returns in full plus accrued premium. Small tickets
                (from {fmtUSD(v.minDeposit)}) are how the pilot broadens investor access — measure C2 of the results framework.
              </div>
            </div>
          </div>
        </div>

        {/* Right — deposit + position + params */}
        <div className="col gap-16">
          <div className="card">
            <div className="card-head">
              <div className="label">Deposit</div>
              <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{WALLET.addr} · {fmtUSDExact(WALLET.balance)} USDC</span>
            </div>
            <div className="card-pad">
              <div className="meter"><span style={{ width: fillPct + "%" }} /></div>
              <div className="row-flex" style={{ justifyContent: "space-between", marginTop: 5, marginBottom: 16 }}>
                <span className="label">{fillPct.toFixed(0)}% filled</span>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>open capacity {fmtUSD(v.capacity - v.tvl)}</span>
              </div>
              <button
                className="btn primary"
                style={{ width: "100%", opacity: canDeposit ? 1 : 0.45, cursor: canDeposit ? "pointer" : "not-allowed" }}
                onClick={() => canDeposit && onDeposit(v)}
              >
                {v.status === "draft" ? "In structuring — register interest"
                  : canDeposit ? "Deposit USDC"
                  : phase === "event" ? "Deposits suspended — trigger watch"
                  : "Deposits closed — payout period"}
              </button>
              <div className="row-flex gap-8 mt-8" style={{ justifyContent: "center" }}>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{v.depositors} depositors · {v.term}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="label">Your Position</div>
              {pos ? (pos.reduced ? <span className="chip danger">Principal reduced</span> : pos.frozen ? <span className="chip warn">Frozen</span> : <span className="chip live">Earning</span>) : <span className="chip">None</span>}
            </div>
            <div className="card-pad">
              {pos ? (
                <>
                  <div className="kv">
                    <div className="k">Deposited</div><div className="v">{fmtUSDExact(pos.deposited)} USDC</div>
                    <div className="k">Tokens</div><div className="v">{fmtNum(pos.tokens)} {v.token}</div>
                    <div className="k">Current value</div><div className="v" style={{ color: pos.reduced ? "var(--danger)" : "var(--ink-0)" }}>{fmtUSDExact(pos.value)}</div>
                    <div className="k">Premium accrued</div><div className="v" style={{ color: "var(--accent)" }}>+{fmtUSDExact(pos.premium)}</div>
                    <div className="k">Par</div><div className="v" style={{ color: pos.reduced ? "var(--danger)" : "var(--ink-0)" }}>{(pos.par ?? 100).toFixed(1)} / 100</div>
                  </div>
                  {pos.reduced && (
                    <div style={{ marginTop: 14, padding: 12, background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 6, fontSize: 11.5, color: "var(--ink-1)", lineHeight: 1.55 }}>
                      Your principal helped restore power and connectivity for 2.1M people. Every dollar is traceable on the Payouts screen.
                    </div>
                  )}
                  <button className="btn mt-16" style={{ width: "100%" }} onClick={() => goTo("secondary", v.id)}>Trade on Secondary <Icon name="arrowR" /></button>
                </>
              ) : (
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.6 }}>
                  No position in this vault yet. Deposit stablecoins to mint {v.token} and start earning premium.
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><div className="label">Vault Parameters</div></div>
            <div className="card-pad">
              <div className="kv">
                <div className="k">Asset</div><div className="v">{v.asset} · tokenized cash</div>
                <div className="k">Backs</div><div className="v">{v.token} risk notes</div>
                <div className="k">Coverage</div><div className="v" style={{ maxWidth: 220, whiteSpace: "normal" }}>{v.categoryLabel}</div>
                <div className="k">Operator</div><div className="v" style={{ maxWidth: 220, whiteSpace: "normal" }}>{v.cedentShort}</div>
                <div className="k">Attachment</div><div className="v">{v.attach}</div>
                <div className="k">Trigger</div><div className="v" style={{ maxWidth: 220, whiteSpace: "normal" }}>{v.triggerShort}</div>
                <div className="k">Data & oracle</div><div className="v" style={{ maxWidth: 220, whiteSpace: "normal" }}>{v.oracle}</div>
                <div className="k">Collateral</div><div className="v">Tokenized MMF · segregated</div>
                <div className="k">Eligibility</div><div className="v">KYC allowlist at token layer</div>
                <div className="k">Settlement</div><div className="v">T+0 · regulated DLT</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parties & service providers */}
      <div className="card mb-24">
        <div className="card-head">
          <div className="label">Parties & Service Providers</div>
          <span className="chip solid">{(v.parties || RF_PARTIES).length} parties</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          {(v.parties || RF_PARTIES).map((p, i) => (
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

      {/* Documents */}
      <div className="card mb-24">
        <div className="card-head">
          <div className="label">Documents</div>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>allowlisted access</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 0 }}>
          {RF_DOCS.map((d, i) => (
            <div key={i} className="row-flex" style={{ padding: "12px 22px", borderTop: i >= 2 ? "1px solid var(--line-1)" : "none", borderRight: i % 2 === 0 ? "1px solid var(--line-1)" : "none", justifyContent: "space-between", gap: 12 }}>
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

      <div className="mb-24">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="label">Secondary Mark — % of par</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 4 }}>
                Coupon fixed at issuance ({v.apy}%) — the line is the mark
              </div>
            </div>
            {v.status === "active" ? <span className="chip live">Trading</span> : <span className="chip">{v.status === "subscribing" ? "Pre-inception" : "Indicative"}</span>}
          </div>
          {v.status === "subscribing" ? (
            <div className="card-pad" style={{ height: 236, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span className="chip">Not yet trading</span>
              <div style={{ fontSize: 12.5, color: "var(--ink-2)", textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
                In subscription at par. A secondary mark appears once the notes are issued and the cover incepts.
              </div>
            </div>
          ) : (
            <div style={{ padding: "16px 12px 8px" }}>
              <ApyChart data={v.priceHistory} height={220} />
            </div>
          )}
          <div className="card-pad" style={{ paddingTop: 8 }}>
            <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{v.desc}</div>
          </div>
        </div>
      </div>

      <div className="card card-pad" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <Icon name="shield" size={18} />
        <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--ink-0)" }}>Fully funded, not promised.</strong> Unlike traditional reinsurance,
          every dollar of protection is collateralised in the vault before coverage incepts — operators know the money
          exists, investors know exactly what they can lose{isFlagship ? ", and the philanthropic first-loss layer absorbs the first USD 4M before vault capital is touched" : ""}.
        </div>
      </div>
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

// Deposit modal — USDC in, vault tokens out (generic)
const VaultDepositModal = ({ vault, onClose }) => {
  const { useState } = React;
  const v = vault || RF_VAULTS[0];
  const [amount, setAmount] = useState(5000);
  const [step, setStep] = useState(0); // 0 form, 1 confirm, 2 success
  const max = Math.min(WALLET.balance, v.capacity - v.tvl);
  const tokens = amount / v.price;
  const estPremium = amount * (v.apy / 100);

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>{v.name}</div>
            <div className="h-section">{step === 2 ? "Deposit Confirmed" : "Deposit USDC"}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>{v.id} · backs {v.token}</div>
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
                    style={{ background: "transparent", border: "none", outline: "none", color: "var(--ink-0)", fontFamily: "IBM Plex Mono", fontSize: 28, width: "60%" }}
                  />
                  <div className="mono" style={{ fontSize: 13, color: "var(--ink-2)" }}>USDC</div>
                </div>
                <div className="row-flex" style={{ justifyContent: "space-between", marginTop: 12 }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>Balance: {fmtUSDExact(WALLET.balance)}</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>Open capacity: {fmtUSD(v.capacity - v.tvl)}</span>
                </div>
              </div>
              <input type="range" className="range" min={v.minDeposit} max={max} step={500} value={amount} onChange={e => setAmount(+e.target.value)} style={{ marginBottom: 8 }} />
              <div className="row-flex gap-4 mb-24">
                {[10, 25, 50, 100].map(p => (
                  <button key={p} className="btn ghost sm" style={{ flex: 1 }} onClick={() => setAmount(Math.round(max * p / 100))}>
                    {p === 100 ? "MAX" : p + "%"}
                  </button>
                ))}
              </div>

              <div className="divider" />
              <div className="kv mb-24">
                <div className="k">You receive</div><div className="v">{fmtNum(tokens, 2)} {v.token}</div>
                <div className="k">Token price</div><div className="v">{v.price.toFixed(4)}</div>
                <div className="k">Premium APY</div><div className="v" style={{ color: "var(--accent)" }}>{v.apy}%{v.status !== "active" ? " indicative" : ""}</div>
                <div className="k">Est. premium · 12m</div><div className="v" style={{ color: "var(--accent)" }}>+{fmtUSDExact(estPremium)}</div>
                <div className="k">Term</div><div className="v">{v.term}</div>
                <div className="k">Settlement</div><div className="v">T+0 · regulated DLT</div>
              </div>

              <div style={{ padding: 14, background: "rgba(245,185,65,0.06)", border: "1px solid rgba(245,185,65,0.25)", borderRadius: 6, color: "var(--ink-1)", fontSize: 12, lineHeight: 1.6 }}>
                <strong style={{ color: "var(--warn)" }}>Risk notice.</strong> Capital collateralises disaster protection
                for critical infrastructure. If the parametric trigger fires, principal reduces by the tier payout
                percentage{v.id === "VLT-SLCIR-A" ? " after the USD 4M first-loss layer" : ""}.
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="kv mb-24" style={{ padding: 16, background: "var(--bg-2)", borderRadius: 6 }}>
                <div className="k">Deposit</div><div className="v">{fmtUSDExact(amount)} USDC</div>
                <div className="k">Vault</div><div className="v">{v.id}</div>
                <div className="k">Tokens out</div><div className="v">{fmtNum(tokens, 2)} {v.token}</div>
                <div className="k">Premium APY</div><div className="v" style={{ color: "var(--accent)" }}>{v.apy}%</div>
                <div className="k">Network fee (est.)</div><div className="v">~$0.40</div>
              </div>
              <div className="label mb-8">Transaction Steps</div>
              {[
                ["Eligibility & allowlist check", "Done"],
                ["Approve USDC spending", "Done"],
                ["Submit deposit transaction", "Pending"],
                ["Mint vault tokens to wallet", "Queued"],
              ].map(([s, st], i) => (
                <div key={i} className="row-flex" style={{ padding: "11px 0", borderTop: i ? "1px solid var(--line-1)" : "none", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink-1)", fontSize: 13 }}>{i + 1}. {s}</span>
                  <span className={cls("chip", st === "Done" ? "live" : st === "Pending" ? "warn" : "")}>{st}</span>
                </div>
              ))}
            </>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent)", color: "#052017", display: "inline-flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 10 17 19 7" /></svg>
              </div>
              <div className="h-section mb-8">Position opened</div>
              <div style={{ color: "var(--ink-2)", fontSize: 13, marginBottom: 24 }}>
                {fmtNum(tokens, 2)} {v.token} minted to {WALLET.addr}. Premium starts streaming immediately.
              </div>
              <div className="kv" style={{ padding: 16, background: "var(--bg-2)", borderRadius: 6, textAlign: "left" }}>
                <div className="k">Transaction</div><div className="v">0x9e4a…21c8</div>
                <div className="k">Settlement</div><div className="v">T+0 · finalized</div>
                <div className="k">Collateral destination</div><div className="v">Tokenized MMF · SPV</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          {step === 0 && (<>
            <button className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={() => setStep(1)}>Review Deposit</button>
          </>)}
          {step === 1 && (<>
            <button className="btn ghost" onClick={() => setStep(0)}>Back</button>
            <button className="btn primary" onClick={() => setStep(2)}>Submit · {fmtUSDExact(amount)}</button>
          </>)}
          {step === 2 && (<>
            <button className="btn ghost" onClick={onClose}>Close</button>
            <button className="btn primary" onClick={onClose}>View Position</button>
          </>)}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { VaultScreen, VaultDepositModal });
