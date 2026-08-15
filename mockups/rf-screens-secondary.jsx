// Secondary market — trade tokenized vault positions (adapted from RIZK secondary)

const RFSecondaryScreen = ({ goTo, phase, vaultId }) => {
  const tradable = RF_VAULTS.filter(v => v.status !== "draft");
  const [selectedId, setSelectedId] = useState(vaultId || tradable[0].id);
  const v = RF_VAULTS.find(x => x.id === selectedId) || tradable[0];
  const [side, setSide] = useState("buy");
  const [size, setSize] = useState(1000);

  const isSLCIR = v.id === "VLT-SLCIR-A";
  const suspended = phase === "event" && isSLCIR;
  const distressed = phase === "payout" && v.id === "VLT-SLCIR-A";
  const px = distressed ? 0.2860 : v.pricePerToken;

  const [price, setPrice] = useState(px);
  useEffect(() => { setPrice(px); }, [v.id, phase]);

  const { bids, asks } = makeBook(px);
  const trades = makeTrades(px);
  const maxDepth = Math.max(...bids.map(b => b.depth), ...asks.map(a => a.depth));

  const accentColor =
    v.category === "maritime" ? "#4a9eff" :
    v.category === "natcat" ? "#f5b941" :
    v.category === "cyber" ? "#b08cff" : "#6ee0c8";

  const chg = distressed ? "−72.3%" : "+0.42%";

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Secondary Market · {PHASE_META[phase].tag}</div>
          <h1 className="h-display">Trade <em>tokenized positions.</em></h1>
        </div>
        <div className="meta">
          <div className="stat">
            <div className="label">24h Volume</div>
            <div className="val">{phase === "payout" ? "$3.1M" : "$1.2M"}</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">24h Trades</div>
            <div className="val">{phase === "payout" ? "204" : "86"}</div>
          </div>
        </div>
      </header>

      {suspended && (
        <div className="alert-banner mb-24" style={{ background: "rgba(245,185,65,0.07)", borderColor: "rgba(245,185,65,0.4)" }}>
          <span className="pulse" style={{ background: "var(--warn)", boxShadow: "0 0 10px var(--warn)" }} />
          <div style={{ fontSize: 13 }}>Transfers of SLCIR tokens are suspended per bond terms while the trigger watch is open. Order placement disabled; existing orders held.</div>
        </div>
      )}
      {distressed && (
        <div className="alert-banner mb-24">
          <span className="pulse" />
          <div style={{ fontSize: 13 }}>{v.token} re-opened post-payout at 28.6 par — remaining principal stays at risk to term end. Trading reflects the residual position.</div>
        </div>
      )}

      {/* Pair selector strip */}
      <div className="row-flex gap-8 mb-24" style={{ overflowX: "auto" }}>
        {tradable.map(vlt => {
          const p = phase === "payout" && vlt.id === "VLT-SLCIR-A" ? 0.2860 : vlt.pricePerToken;
          const down = phase === "payout" && vlt.id === "VLT-SLCIR-A";
          return (
            <button
              key={vlt.id}
              className="card-pad"
              onClick={() => setSelectedId(vlt.id)}
              style={{
                minWidth: 200,
                background: selectedId === vlt.id ? "var(--bg-2)" : "var(--bg-1)",
                border: "1px solid " + (selectedId === vlt.id ? "var(--accent)" : "var(--line-1)"),
                borderRadius: 6,
                cursor: "pointer",
                textAlign: "left",
                color: "inherit",
                fontFamily: "inherit",
              }}
            >
              <div className="row-flex gap-8 mb-8">
                <CatDot cat={vlt.category} />
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{vlt.token}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-0)", marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{vlt.name}</div>
              <div className="row-flex" style={{ justifyContent: "space-between" }}>
                <span className="num" style={{ fontSize: 14, color: down ? "var(--danger)" : "var(--ink-0)" }}>${p.toFixed(4)}</span>
                <span className="num" style={{ fontSize: 11, color: down ? "var(--danger)" : "var(--accent)" }}>{down ? "−72.3%" : "+0.4%"}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Trading layout */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1.6fr 0.9fr 0.9fr", gap: 16 }}>
        {/* Price chart */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="row-flex gap-12">
                <CatDot cat={v.category} />
                <span className="h-card">{v.name}</span>
                <span className="chip">{v.token} / USDC</span>
              </div>
            </div>
            <div className="row-flex gap-24">
              <div>
                <div className="label">Last</div>
                <div className="num" style={{ fontSize: 18, color: distressed ? "var(--danger)" : "var(--ink-0)" }}>${px.toFixed(4)}</div>
              </div>
              <div>
                <div className="label">24h Change</div>
                <div className="num" style={{ fontSize: 18, color: distressed ? "var(--danger)" : "var(--accent)" }}>{chg}</div>
              </div>
              <div>
                <div className="label">Spread</div>
                <div className="num" style={{ fontSize: 18, color: "var(--ink-0)" }}>{(px * 0.0014).toFixed(4)}</div>
              </div>
              <div>
                <div className="label">Yield</div>
                <div className="num" style={{ fontSize: 18, color: "var(--ink-0)" }}>{v.apy}%</div>
              </div>
            </div>
          </div>
          <div style={{ padding: 12 }}>
            <ApyChart
              data={distressed
                ? [...v.priceHistory.slice(0, 22), 92, 61, 42, 33, 30, 28.6, 28.4, 28.6]
                : v.priceHistory}
              color={distressed ? "var(--danger)" : accentColor}
              height={280}
            />
          </div>
        </div>

        {/* Orderbook */}
        <div className="card">
          <div className="card-head">
            <div className="label">Order Book</div>
            <span className="chip">USDC pair</span>
          </div>
          <div style={{ padding: "10px 0", position: "relative" }}>
            {suspended && (
              <div style={{ position: "absolute", inset: 0, background: "var(--modal-back)", backdropFilter: "blur(2px)", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="chip warn">Transfers suspended — trigger watch</span>
              </div>
            )}
            <div className="row-flex" style={{ padding: "0 16px 8px", fontFamily: "IBM Plex Mono", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.1em" }}>
              <div style={{ width: "33%" }}>PRICE</div>
              <div style={{ width: "33%", textAlign: "right" }}>SIZE</div>
              <div style={{ width: "34%", textAlign: "right" }}>TOTAL</div>
            </div>
            {[...asks].reverse().map((o, i) => (
              <RFOrderRow key={"a"+i} o={o} side="ask" maxDepth={maxDepth} />
            ))}
            <div style={{ padding: "10px 16px", background: "var(--bg-2)", borderTop: "1px solid var(--line-1)", borderBottom: "1px solid var(--line-1)" }}>
              <div className="row-flex" style={{ justifyContent: "space-between" }}>
                <span className="num" style={{ fontSize: 14, color: distressed ? "var(--danger)" : "var(--ink-0)" }}>${px.toFixed(4)}</span>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>SPREAD {(px * 0.0014).toFixed(4)} · 0.14%</span>
              </div>
            </div>
            {bids.map((o, i) => (
              <RFOrderRow key={"b"+i} o={o} side="bid" maxDepth={maxDepth} />
            ))}
          </div>
        </div>

        {/* Trade form */}
        <div className="card" style={{ height: "fit-content" }}>
          <div className="card-head">
            <div className="label">Place Order</div>
          </div>
          <div style={{ padding: 22, opacity: suspended ? 0.45 : 1, pointerEvents: suspended ? "none" : "auto" }}>
            <div className="side-toggle" style={{ margin: "0 0 16px", width: "100%" }}>
              <button className={side === "buy" ? "active" : ""} onClick={() => setSide("buy")} style={{ flex: 1 }}>Buy</button>
              <button className={side === "sell" ? "active" : ""} onClick={() => setSide("sell")} style={{ flex: 1 }}>Sell</button>
            </div>

            <div className="row-flex gap-8 mb-16">
              <button className="btn ghost sm" style={{ flex: 1 }}>Limit</button>
              <button className="btn sm" style={{ flex: 1, background: "var(--bg-3)" }}>Market</button>
            </div>

            <div className="label mb-8">Price (USDC)</div>
            <div className="input mb-16">
              <input type="number" step="0.0001" value={price.toFixed(4)} onChange={e => setPrice(+e.target.value || 0)} />
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>USDC</span>
            </div>

            <div className="label mb-8">Size (tokens)</div>
            <div className="input mb-8">
              <input type="number" value={size} onChange={e => setSize(+e.target.value || 0)} />
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{v.token}</span>
            </div>
            <div className="row-flex gap-4 mb-16">
              {[25, 50, 75, 100].map(p => (
                <button key={p} className="btn ghost sm" style={{ flex: 1 }} onClick={() => setSize(Math.round(5000 * p / 100))}>{p}%</button>
              ))}
            </div>

            <div className="divider" />
            <div className="kv mb-16">
              <div className="k">Order Value</div><div className="v">${(price * size).toFixed(2)}</div>
              <div className="k">Fee (0.1%)</div><div className="v">${(price * size * 0.001).toFixed(2)}</div>
              <div className="k">Eligibility</div><div className="v">Allowlist enforced</div>
              <div className="k">Settles</div><div className="v">T+0 · DLT</div>
            </div>

            <button className="btn primary" style={{ width: "100%", height: 44 }}>
              {side === "buy" ? "Place Buy Order" : "Place Sell Order"}
            </button>
          </div>
        </div>
      </section>

      {/* Recent trades + open orders */}
      <section className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Recent Trades</div>
            <span className={cls("chip", suspended ? "warn" : "live")}>{suspended ? "Halted" : "Streaming"}</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Side</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th style={{ textAlign: "right" }}>Size</th>
                <th style={{ textAlign: "right" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t, i) => (
                <tr key={i}>
                  <td>
                    <span className="mono" style={{ fontSize: 11, color: t.side === "buy" ? "var(--accent)" : "var(--danger)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.side}</span>
                  </td>
                  <td className="num" style={{ textAlign: "right" }}>${t.price.toFixed(4)}</td>
                  <td className="num" style={{ textAlign: "right" }}>{fmtNum(t.size)}</td>
                  <td className="mono" style={{ textAlign: "right", fontSize: 11, color: "var(--ink-3)" }}>{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="label">Your Open Orders</div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Side</th>
                <th>Token</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th style={{ textAlign: "right" }}>Size · Filled</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="mono" style={{ fontSize: 11, color: "var(--accent)", textTransform: "uppercase" }}>BUY</span></td>
                <td className="mono" style={{ fontSize: 11 }}>tSLCIR-D</td>
                <td className="num" style={{ textAlign: "right" }}>$1.0062</td>
                <td className="num" style={{ textAlign: "right" }}>3,000 · 820</td>
                <td><button className="btn ghost sm">Cancel</button></td>
              </tr>
              <tr>
                <td><span className="mono" style={{ fontSize: 11, color: "var(--danger)", textTransform: "uppercase" }}>SELL</span></td>
                <td className="mono" style={{ fontSize: 11 }}>tSLCIR-A</td>
                <td className="num" style={{ textAlign: "right" }}>{phase === "payout" ? "$0.2950" : "$1.0402"}</td>
                <td className="num" style={{ textAlign: "right" }}>2,500 · 0</td>
                <td><button className="btn ghost sm">{suspended ? "Held" : "Cancel"}</button></td>
              </tr>
            </tbody>
          </table>
          <div className="card-pad" style={{ borderTop: "1px solid var(--line-1)", fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.55 }}>
            Secondary transfers move allowlisted tokens between eligible participants only — every trade settles T+0 with
            the transfer controls and audit trail of the primary issuance.
          </div>
        </div>
      </section>
    </div>
  );
};

const RFOrderRow = ({ o, side, maxDepth }) => {
  const depthPct = (o.depth / maxDepth) * 100;
  const color = side === "ask" ? "var(--danger)" : "var(--accent)";
  return (
    <div style={{ position: "relative", padding: "5px 16px", fontFamily: "IBM Plex Mono", fontSize: 11 }}>
      <div style={{
        position: "absolute",
        right: 0, top: 0, bottom: 0,
        width: depthPct + "%",
        background: side === "ask" ? "rgba(248,113,113,0.08)" : "rgba(110,224,200,0.08)",
        pointerEvents: "none",
      }} />
      <div className="row-flex" style={{ position: "relative" }}>
        <div style={{ width: "33%", color }}>${o.price.toFixed(4)}</div>
        <div style={{ width: "33%", textAlign: "right", color: "var(--ink-1)" }}>{fmtNum(o.size)}</div>
        <div style={{ width: "34%", textAlign: "right", color: "var(--ink-3)" }}>{fmtNum(o.depth)}</div>
      </div>
    </div>
  );
};

Object.assign(window, { RFSecondaryScreen, RFOrderRow });
