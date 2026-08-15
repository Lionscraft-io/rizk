# RIZK — parametric risk-transfer mockups

Three self-contained, clickable prototypes for tokenized parametric disaster-risk transfer.
No build step: plain HTML + React (UMD) + Babel-standalone, served statically.

```bash
python3 serve.py            # http://localhost:8000
```

| Page | What it is | Use it for |
|---|---|---|
| `RIZK.html` | The protocol marketplace, populated with **real catastrophe bonds** from the Artemis deal directory | Showing the platform idea at market scale |
| `RIZK-SL.html` | Same product, centred on the **Sri Lanka pilot** (2 pilot vaults + the 7 market deals) | Investor / product demo |
| `RESILIENCE.html` | The **Lionscraft / ADB facility console** — capital stack, AI monitoring, governance, controlled disbursement, results framework | Institutional / donor pitch |

Every page: Portfolio · Invest · Secondary · claims-and-monitoring · payouts.
`RESILIENCE.html` adds a **Baseline / Event / Payout** phase switcher that drives the whole
app through a simulated Cyclone-Vidura event.

## Data provenance — read before quoting any number

**Sourced from [Artemis](https://www.artemis.bm/deal-directory/)** (each vault links to its deal page):
deal size, sponsor/cedent, peril, trigger type, term, deal parties, and — where published —
the risk spread and expected loss. Examples: IBRD CAR Jamaica 2026 ($200M, 6.75%, EL 2.48%),
PoleStar Re 2026-1 Class A ($140M of $300M, 7.0%, EL 0.82%), Sutter Re, Alamo Re, Matterhorn Re,
Yardstick Re, 123 Lights Re.

**Illustrative — invented for the mockup:** token prices and secondary marks, investor counts,
minimum ticket sizes, subscription build-up curves, oracle "health" percentages, and everything
about the two fictional Sri Lanka vaults (SLCIR-A, SLCIR-D) and their fictional counterparties
(Serendib Telecom, Lanka Grid Energy, Verita Analytics, Resilience Re SPC).

Spreads marked *indicative* in a vault description are not published figures.

## Design rules the prototype enforces

These came out of a research pass on Cyclone Ditwah (Nov 2025) and an ILS structuring review:

- **A coupon is fixed at issuance.** The vault chart plots the *secondary mark* (% of par), never a
  fabricated "yield over time".
- **A vault cannot be on risk while its book is open.** The status badge is derived from funding
  (`tvl < capacity` ⇒ *Subscribing*), not from a hand-set flag — in a fully collateralised structure
  the limit *is* the posted collateral.
- **Already-issued deals are fully placed.** They show a deal size and a *Trade* action, not a
  capacity meter and a *Deposit* button.
- **Restoration is measured, not reported.** After Ditwah, operators said "largely restored" in days
  while the government–UN assessment found outages up to 14 days; milestone releases here are gated
  on independent telemetry, and commitments are written against the *last* district restored rather
  than a national average.
- **Names lead with the country**, so a second vault can't quietly duplicate the first.

## Third-party marks

`logos/` contains company and institutional logos used nominatively to identify real deal
participants and platform partners. They are trademarks of their respective owners. Fine for an
internal prototype; confirm usage rights before anything public-facing.
