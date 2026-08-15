// Secondary market — orderbook / trade tokenized positions

const SecondaryScreen = ({ goTo, vaultId }) => {
  const [selectedId, setSelectedId] = useState(vaultId || VAULTS[0].id);
  const v = VAULTS.find(x => x.id === selectedId) || VAULTS[0];
  const [side, setSide] = useState("buy");
  const [price, setPrice] = useState(v.pricePerToken);
  const [size, setSize] = useState(1000);

  const accentColor =
    v.category === "maritime" ? "#4a9eff" :
    v.category === "natcat" ? "#f5b941" :
    v.category === "cyber" ? "#b08cff" :
    "#6ee0c8";

  useEffect(() => { setPrice(v.pricePerToken); }, [v.id]);

  const maxBidDepth = Math.max(...ORDERBOOK_BIDS.map(b => b.depth));
  const maxAskDepth = Math.max(...ORDERBOOK_ASKS.map(a => a.depth));
  const maxDepth = Math.max(maxBidDepth, maxAskDepth);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <div className="eyebrow">Secondary Market</div>
          <h1 className="h-display">Trade <em>tokenized positions.</em></h1>
        </div>
        <div className="meta">
          <div className="stat">
            <div className="label">24h Volume</div>
            <div className="val">$8.4M</div>
          </div>
          <div className="vdivider" />
          <div className="stat">
            <div className="label">24h Trades</div>
            <div className="val">412</div>
          </div>
        </div>
      </header>

      {/* Pair selector strip */}
      <div className="row-flex gap-8 mb-24" style={{ overflowX: "auto" }}>
        {VAULTS.map(vlt => (
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
              <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{vlt.id}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-0)", marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{vlt.name}</div>
            <div className="row-flex" style={{ justifyContent: "space-between" }}>
              <span className="num" style={{ fontSize: 14, color: "var(--ink-0)" }}>${vlt.pricePerToken.toFixed(4)}</span>
              <span className="num" style={{ fontSize: 11, color: "var(--accent)" }}>+{(Math.random() * 2 + 0.2).toFixed(2)}%</span>
            </div>
          </button>
        ))}
      </div>

      {/* Trading layout */}
      <section className="grid mb-24" style={{ gridTemplateColumns: "1.6fr 0.9fr 0.9fr", gap: 16 }}>
        {/* Price chart + spread */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="row-flex gap-12">
                <CatDot cat={v.category} />
                <span className="h-card">{v.name}</span>
                <span className="chip">{v.id}</span>
              </div>
            </div>
            <div className="row-flex gap-24">
              <div>
                <div className="label">Last</div>
                <div className="num" style={{ fontSize: 18, color: "var(--ink-0)" }}>${v.pricePerToken.toFixed(4)}</div>
              </div>
              <div>
                <div className="label">24h Change</div>
                <div className="num" style={{ fontSize: 18, color: "var(--accent)" }}>+1.24%</div>
              </div>
              <div>
                <div className="label">Spread</div>
                <div className="num" style={{ fontSize: 18, color: "var(--ink-0)" }}>0.0020</div>
              </div>
              <div>
                <div className="label">YTM</div>
                <div className="num" style={{ fontSize: 18, color: "var(--ink-0)" }}>{v.apy}%</div>
              </div>
            </div>
          </div>
          <div style={{ padding: 12 }}>
            <ApyChart data={v.priceHistory} color={accentColor} height={280} />
          </div>
        </div>

        {/* Orderbook */}
        <div className="card">
          <div className="card-head">
            <div className="label">Order Book</div>
            <span className="chip">USDC pair</span>
          </div>
          <div style={{ padding: "10px 0" }}>
            <div className="row-flex" style={{ padding: "0 16px 8px", fontFamily: "IBM Plex Mono", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.1em" }}>
              <div style={{ width: "33%" }}>PRICE</div>
              <div style={{ width: "33%", textAlign: "right" }}>SIZE</div>
              <div style={{ width: "34%", textAlign: "right" }}>TOTAL</div>
            </div>
            {/* Asks (reverse) */}
            {[...ORDERBOOK_ASKS].reverse().map((o, i) => (
              <OrderRow key={"a"+i} o={o} side="ask" maxDepth={maxDepth} />
            ))}
            {/* Spread row */}
            <div style={{ padding: "10px 16px", background: "var(--bg-2)", borderTop: "1px solid var(--line-1)", borderBottom: "1px solid var(--line-1)" }}>
              <div className="row-flex" style={{ justifyContent: "space-between" }}>
                <span className="num" style={{ fontSize: 14, color: "var(--ink-0)" }}>${v.pricePerToken.toFixed(4)}</span>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>SPREAD 0.0020 · 0.20%</span>
              </div>
            </div>
            {/* Bids */}
            {ORDERBOOK_BIDS.map((o, i) => (
              <OrderRow key={"b"+i} o={o} side="bid" maxDepth={maxDepth} />
            ))}
          </div>
        </div>

        {/* Trade form */}
        <div className="card" style={{ height: "fit-content" }}>
          <div className="card-head">
            <div className="label">Place Order</div>
          </div>
          <div style={{ padding: 22 }}>
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
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>tokens</span>
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
              <div className="k">Implied YTM</div><div className="v">{v.apy.toFixed(2)}%</div>
              <div className="k">Settles</div><div className="v">T+0 · onchain</div>
            </div>

            <button className="btn primary" style={{ width: "100%", height: 44 }}>
              {side === "buy" ? "Place Buy Order" : "Place Sell Order"}
            </button>
          </div>
        </div>
      </section>

      {/* Recent trades */}
      <section className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div className="label">Recent Trades</div>
            <span className="chip live">Streaming</span>
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
              {RECENT_TRADES.map((t, i) => (
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
                <th>Vault</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th style={{ textAlign: "right" }}>Size · Filled</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="mono" style={{ fontSize: 11, color: "var(--accent)", textTransform: "uppercase" }}>BUY</span></td>
                <td className="mono" style={{ fontSize: 11 }}>VLT-MAR-001</td>
                <td className="num" style={{ textAlign: "right" }}>$1.0202</td>
                <td className="num" style={{ textAlign: "right" }}>5,000 · 1,240</td>
                <td><button className="btn ghost sm">Cancel</button></td>
              </tr>
              <tr>
                <td><span className="mono" style={{ fontSize: 11, color: "var(--danger)", textTransform: "uppercase" }}>SELL</span></td>
                <td className="mono" style={{ fontSize: 11 }}>VLT-NAT-002</td>
                <td className="num" style={{ textAlign: "right" }}>$1.1020</td>
                <td className="num" style={{ textAlign: "right" }}>2,500 · 0</td>
                <td><button className="btn ghost sm">Cancel</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const OrderRow = ({ o, side, maxDepth }) => {
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

Object.assign(window, { SecondaryScreen });
