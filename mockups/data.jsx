// Mock data for RIZK prototype
// Vault examples modelled on real catastrophe bonds from the Artemis.bm deal directory (2026).
// Sizes, sponsors, perils and (where published) spreads/expected losses follow the real deals;
// token prices, holder counts and fill levels are illustrative.

const VAULTS = [
  {
    id: "VLT-CYC-001",
    ticker: "SLCIR-A",
    name: "Sri Lanka Cyclone + Flood — Class A",
    category: "natcat",
    categoryLabel: "Parametric Cat Bond",
    status: "active",
    placed: true,
    apy: 9.75,
    apy7d: [9.5, 9.6, 9.6, 9.7, 9.75, 9.75, 9.75],
    tvl: 14_000_000,
    capacity: 14_000_000,
    cedent: "SLCIR SPC Cell 01 — Serendib Telecom + Lanka Grid Energy",
    cedentShort: "SLCIR Cell 01",
    term: "24 months",
    termRemaining: "23m 0d",
    trigger: "Wind ≥ 64/85/100 kt OR rain-flood index ≥ 60/75/90 in parametric box — graduated payout 40/70/100%",
    triggerShort: "Wind + flood index · 3 tiers",
    oracle: "JTWC/IMD · GPM · Sentinel-1 · via Chainlink",
    oracleLevel: 97,
    oracleTrend: "ok",
    collateral: "USDC + tokenized MMF · BNY custody",
    settlement: "T+0",
    tranche: "Class A",
    rating: "NR · EL 4.05%",
    pricePerToken: 1.0310,
    description: "Flagship cover for Sri Lanka's telecom and electricity operators. Payouts fund pre-agreed emergency response, restoration and public-service commitments — zero-rated connectivity, priority restoration for hospitals and shelters.",
    investors: 148,
    lastTrigger: null,
    parties: [
      { mono: "RR", color: "#1c9b7c", name: "Resilience Re (SL) SPC", role: "Issuer · Segregated Cell" },
      { mono: "ADB", color: "#2563d6", name: "Asian Development Bank", role: "Anchor Sponsor" },
      { mono: "LC", color: "#b8821a", name: "Lionscraft", role: "Structuring & Technology" },
      { mono: "VA", color: "#7a4cc9", name: "Verita Analytics", role: "Independent Calculation Agent" },
      { mono: "EO", color: "#b8821a", name: "NASA GPM · ESA Sentinel-1 · JTWC", role: "Hazard & EO Data" },
      { mono: "TW", color: "#7a4cc9", name: "IODA · Georgia Tech", role: "Independent Outage Data" },
      { mono: "FB", color: "#0a1628", name: "Fireblocks", role: "Wallet & Digital-Asset Custody Tech" },
      { mono: "BNY", color: "#0a1628", name: "BNY", role: "Collateral Custodian" },
      { mono: "LINK", color: "#2563d6", name: "Chainlink", role: "Oracle Network · Onchain Data Delivery" },
      { mono: "RZ", color: "#0a1628", name: "RIZK Protocol", role: "Tokenization · Registry · Settlement" },
    ],
  },
  {
    id: "VLT-DRT-001",
    ticker: "SLCIR-D",
    name: "Sri Lanka Hydro-Drought — Series 2026-2",
    country: "Sri Lanka",
    category: "weather",
    categoryLabel: "Parametric Cat Bond · Drought",
    status: "subscribing",
    apy: 10.25,
    apy7d: [10.25, 10.25, 10.25, 10.25, 10.25, 10.25, 10.25],
    tvl: 2_250_000,
    capacity: 3_000_000,
    cedent: "Lanka Grid Energy PLC — national transmission licensee, ceding 100% via Serendib General Insurance PLC (fronting carrier)",
    cedentShort: "Lanka Grid Energy",
    term: "24 months · 2 hydrological years",
    termRemaining: "on risk 1 Oct 2026",
    trigger: "Sri Lanka Hydro Deficit Index (SLHDI) — catchment-area-weighted cumulative rainfall over the six catchments feeding Kotmale, Victoria, Randenigala, Maussakelle, Castlereagh and Samanalawewa, weighted by each catchment's share of 2015–2025 mean annual hydro production and accumulated over the hydrological year 1 Oct – 30 Sep — at or below the 4th percentile of the 1981–2025 climatology. Graduated payout 40 / 70 / 100% at the 4th / 2nd / 1st percentile. Annual aggregate, one determination per risk year, no reinstatement.",
    triggerShort: "Catchment rainfall ≤ 4th pctile · 1-in-25yr",
    oracle: "CHIRPS v2.0 Final (operative) · GPM IMERG Late v07 (monitoring) · via Chainlink",
    oracleLevel: 96,
    oracleTrend: "ok",
    collateral: "USDC · tokenized USD MMF · BNY custody",
    settlement: "Determination T+31 · payment T+0",
    tranche: "Series 2026-2",
    rating: "NR · EL 2.50%",
    pricePerToken: 1.0000,
    description: "A 24-month collateralised parametric note covering the catchments behind Sri Lanka's hydropower cascade against a 1-in-25-year rainfall deficit — the shortfall that forces emergency thermal generation and rotating outages. It is the one exposure in this facility that gets worse when it does not rain, so it pays in the years the cyclone and flood cover does not.",
    investors: 37,
    lastTrigger: "Backtest 1981–2025 — would have attached twice: 1986-87 at tier 1 (40%), 2016-17 at tier 2 (70%). Realised loss cost 2.50% p.a., matching modelled EL.",
    correlationNote: "Negatively correlated with SLCIR-A. Drought years are dry years; the flagship attaches on excess rainfall and wind, so holding both reduces single-event concentration.",
    parties: [
      { mono: "LGE", color: "#1c9b7c", name: "Lanka Grid Energy PLC", role: "Cedent · Transmission Licensee" },
      { mono: "SGI", color: "#2563d6", name: "Serendib General Insurance PLC", role: "Fronting Carrier" },
      { mono: "RR", color: "#7a4cc9", name: "Resilience Re (SL) SPC — \"Maha Re\"", role: "Issuer · Segregated Account" },
      { mono: "ADB", color: "#2563d6", name: "Asian Development Bank", role: "Anchor Investor · First-Loss Sponsor" },
      { mono: "LC", color: "#b8821a", name: "Lionscraft", role: "Structuring & Technology" },
      { mono: "VA", color: "#7a4cc9", name: "Verita Analytics", role: "Independent Calculation Agent" },
      { mono: "CHC", color: "#b8821a", name: "CHIRPS v2.0 · Climate Hazards Center", role: "Operative Rainfall Data" },
      { mono: "DoM", color: "#56688a", name: "SL Dept. of Meteorology · Mahaweli Authority", role: "Ground Truth · Non-operative" },
      { mono: "FB", color: "#0a1628", name: "Fireblocks", role: "Wallet & Digital-Asset Custody Tech" },
      { mono: "BNY", color: "#0a1628", name: "BNY", role: "Collateral Custodian" },
      { mono: "LINK", color: "#2563d6", name: "Chainlink", role: "Oracle Network · Onchain Data Delivery" },
      { mono: "RZ", color: "#0a1628", name: "RIZK Protocol", role: "Tokenization · Registry · Settlement" },
    ],
  },
  {
    id: "VLT-NAT-001",
    artemisUrl: "https://www.artemis.bm/deal-directory/ibrd-car-jamaica-2026/",
    ticker: "JAM26",
    name: "IBRD CAR Jamaica 2026",
    category: "natcat",
    categoryLabel: "Parametric Cat Bond",
    status: "active",
    placed: true,
    apy: 6.75,
    apy7d: [6.75, 6.75, 6.75, 6.75, 6.75, 6.75, 6.75],
    tvl: 200_000_000,
    capacity: 200_000_000,
    cedent: "Government of Jamaica · World Bank (IBRD) facilitated",
    cedentShort: "Jamaica MoF",
    term: "4 hurricane seasons",
    termRemaining: "to May 2030",
    trigger: "Parametric cat-in-a-grid — NHC central pressure at defined grid points along storm track; graduated payout by intensity",
    triggerShort: "Central-pressure grid (NHC)",
    oracle: "NOAA NHC · independent calc agent · via Chainlink",
    oracleLevel: 92,
    oracleTrend: "warn",
    collateral: "IBRD notes · fully funded",
    settlement: "T+0",
    tranche: "Single",
    rating: "EL 2.48%",
    pricePerToken: 1.0130,
    description: "Parametric hurricane protection for the Government of Jamaica — successor to the 2024 notes that paid out in full after Hurricane Melissa (Oct 2025). Upsized to $200M on strong ILS demand; priced at a 6.75% risk margin.",
    investors: 2140,
    lastTrigger: "2025-10 · predecessor 2024 notes — full payout (Hurricane Melissa)",
    parties: [
      { mono: "GoJ", color: "#1c9b7c", name: "Government of Jamaica", role: "Sponsor · Cedent" },
      { mono: "IBRD", color: "#2563d6", name: "World Bank (IBRD)", role: "Issuer" },
      { mono: "AON", color: "#c43d59", name: "Aon Securities", role: "Joint Structuring Agent & Bookrunner" },
      { mono: "SRCM", color: "#0a1628", name: "Swiss Re Capital Markets", role: "Joint Structuring Agent & Bookrunner" },
      { mono: "RMS", color: "#7a4cc9", name: "RMS (Moody's)", role: "Risk Modeller & Calculation Agent" },
      { mono: "NHC", color: "#b8821a", name: "NOAA National Hurricane Center", role: "Reporting Agency · Hazard Data" },
      { mono: "FB", color: "#0a1628", name: "Fireblocks", role: "Wallet & Digital-Asset Custody Tech" },
      { mono: "BNY", color: "#0a1628", name: "BNY", role: "Collateral Custodian" },
      { mono: "LINK", color: "#2563d6", name: "Chainlink", role: "Oracle Network · Onchain Data Delivery" },
      { mono: "RZ", color: "#0a1628", name: "RIZK Protocol", role: "Tokenization · Registry · Settlement" },
    ],
  },
  {
    id: "VLT-NAT-002",
    artemisUrl: "https://www.artemis.bm/deal-directory/sutter-re-ltd-series-2026-1/",
    ticker: "SUTTER",
    name: "Sutter Re 2026-1 — CEA",
    category: "natcat",
    categoryLabel: "Natural Catastrophe",
    status: "active",
    placed: true,
    apy: 4.6,
    apy7d: [4.6, 4.6, 4.6, 4.6, 4.6, 4.6, 4.6],
    tvl: 425_000_000,
    capacity: 425_000_000,
    cedent: "California Earthquake Authority",
    cedentShort: "CEA",
    term: "36 months",
    termRemaining: "34m 10d",
    trigger: "Indemnity — CEA ultimate net loss above attachment (annual aggregate)",
    triggerShort: "Indemnity · annual aggregate",
    oracle: "USGS ShakeMap · claims development · via Chainlink",
    oracleLevel: 99,
    oracleTrend: "ok",
    collateral: "US T-bill money fund",
    settlement: "T+0",
    tranche: "Class A",
    rating: "NR",
    pricePerToken: 1.0440,
    description: "California earthquake reinsurance for the CEA — Sutter Re Ltd. Series 2026-1, $425M (Jun 2026). Spread indicative.",
    investors: 3210,
    lastTrigger: null,
    parties: [
      { mono: "CEA", color: "#1c9b7c", name: "California Earthquake Authority", role: "Sponsor · Cedent" },
      { mono: "SUT", color: "#2563d6", name: "Sutter Re Ltd.", role: "Issuer · Bermuda SPI" },
      { mono: "AON", color: "#c43d59", name: "Aon Securities", role: "Sole Structuring Agent" },
      { mono: "SRCM", color: "#0a1628", name: "Swiss Re Capital Markets", role: "Joint Bookrunner" },
      { mono: "EQE", color: "#7a4cc9", name: "EQECAT (CoreLogic)", role: "Risk Modeller" },
      { mono: "USGS", color: "#b8821a", name: "USGS ShakeMap", role: "Hazard Data" },
      { mono: "FB", color: "#0a1628", name: "Fireblocks", role: "Wallet & Digital-Asset Custody Tech" },
      { mono: "BNY", color: "#0a1628", name: "BNY", role: "Collateral Custodian" },
      { mono: "LINK", color: "#2563d6", name: "Chainlink", role: "Oracle Network · Onchain Data Delivery" },
      { mono: "RZ", color: "#0a1628", name: "RIZK Protocol", role: "Tokenization · Registry · Settlement" },
    ],
  },
  {
    id: "VLT-NAT-003",
    artemisUrl: "https://www.artemis.bm/deal-directory/alamo-re-ltd-series-2026-1/",
    ticker: "ALAMO",
    name: "Alamo Re 2026-1 — TWIA",
    category: "natcat",
    categoryLabel: "Natural Catastrophe",
    status: "active",
    placed: true,
    apy: 5.25,
    apy7d: [5.2, 5.2, 5.25, 5.25, 5.25, 5.25, 5.25],
    tvl: 300_000_000,
    capacity: 300_000_000,
    cedent: "Texas Windstorm Insurance Association",
    cedentShort: "TWIA",
    term: "36 months",
    termRemaining: "32m 22d",
    trigger: "Indemnity — TWIA named storm & severe thunderstorm losses above attachment",
    triggerShort: "Indemnity · TX wind + SCS",
    oracle: "NHC · PCS · claims development · via Chainlink",
    oracleLevel: 88,
    oracleTrend: "warn",
    collateral: "US T-bill money fund",
    settlement: "T+0",
    tranche: "Class A",
    rating: "NR",
    pricePerToken: 1.0290,
    description: "Class A of the $750M Alamo Re Ltd. Series 2026-1 (May 2026) — Texas named storm and severe thunderstorm protection for TWIA. Class A priced at a 5.25% spread; Classes B and C at 7.25% and 10.5%.",
    investors: 2875,
    lastTrigger: null,
    parties: [
      { mono: "TWIA", color: "#1c9b7c", name: "Texas Windstorm Insurance Assoc.", role: "Sponsor · Cedent" },
      { mono: "ALA", color: "#2563d6", name: "Alamo Re Ltd.", role: "Issuer · Bermuda SPI" },
      { mono: "GS", color: "#c43d59", name: "Gallagher Securities", role: "Sole Structuring Agent & Bookrunner" },
      { mono: "AIR", color: "#7a4cc9", name: "AIR Worldwide (Verisk)", role: "Risk Modeller" },
      { mono: "PCS", color: "#b8821a", name: "PCS · Verisk", role: "Loss Reporting" },
      { mono: "FB", color: "#0a1628", name: "Fireblocks", role: "Wallet & Digital-Asset Custody Tech" },
      { mono: "BNY", color: "#0a1628", name: "BNY", role: "Collateral Custodian" },
      { mono: "LINK", color: "#2563d6", name: "Chainlink", role: "Oracle Network · Onchain Data Delivery" },
      { mono: "RZ", color: "#0a1628", name: "RIZK Protocol", role: "Tokenization · Registry · Settlement" },
    ],
  },
  {
    id: "VLT-NAT-004",
    artemisUrl: "https://www.artemis.bm/deal-directory/matterhorn-re-ltd-series-2026-3/",
    ticker: "MATT26",
    name: "Matterhorn Re 2026-3 — Swiss Re",
    category: "natcat",
    categoryLabel: "Natural Catastrophe",
    status: "active",
    placed: true,
    apy: 7.9,
    apy7d: [7.8, 7.85, 7.9, 7.9, 7.9, 7.9, 7.9],
    tvl: 345_000_000,
    capacity: 345_000_000,
    cedent: "Swiss Re",
    cedentShort: "Swiss Re",
    term: "24 months",
    termRemaining: "22m 05d",
    trigger: "Industry loss — weighted PCS index, US/Canada named storm & earthquake",
    triggerShort: "PCS weighted industry loss",
    oracle: "PCS · via Chainlink",
    oracleLevel: 94,
    oracleTrend: "ok",
    collateral: "US T-bill money fund",
    settlement: "T+0",
    tranche: "Series 2026-3",
    rating: "NR",
    pricePerToken: 1.0180,
    description: "$345M retrocession for Swiss Re on a weighted industry-loss trigger — Matterhorn Re Ltd. Series 2026-3 (Jul 2026). Spread indicative.",
    investors: 1930,
    lastTrigger: null,
    parties: [
      { mono: "SR", color: "#1c9b7c", name: "Swiss Re", role: "Sponsor · Cedent" },
      { mono: "MAT", color: "#2563d6", name: "Matterhorn Re Ltd.", role: "Issuer · Bermuda SPI" },
      { mono: "SRCM", color: "#c43d59", name: "Swiss Re Capital Markets", role: "Sole Structuring Agent & Bookrunner" },
      { mono: "AIR", color: "#7a4cc9", name: "AIR Worldwide (Verisk)", role: "Risk Modeller" },
      { mono: "PCS", color: "#b8821a", name: "PCS · Verisk", role: "Industry Loss Index" },
      { mono: "FB", color: "#0a1628", name: "Fireblocks", role: "Wallet & Digital-Asset Custody Tech" },
      { mono: "BNY", color: "#0a1628", name: "BNY", role: "Collateral Custodian" },
      { mono: "LINK", color: "#2563d6", name: "Chainlink", role: "Oracle Network · Onchain Data Delivery" },
      { mono: "RZ", color: "#0a1628", name: "RIZK Protocol", role: "Tokenization · Registry · Settlement" },
    ],
  },
  {
    id: "VLT-WTR-001",
    artemisUrl: "https://www.artemis.bm/deal-directory/yardstick-re-dac-series-2026-1/",
    ticker: "YRDSTK",
    name: "Yardstick Re 2026-1 — Gothaer",
    category: "weather",
    categoryLabel: "Weather & Climate",
    status: "active",
    placed: true,
    apy: 5.6,
    apy7d: [5.6, 5.6, 5.6, 5.6, 5.6, 5.6, 5.6],
    tvl: 108_000_000,
    capacity: 108_000_000,
    cedent: "Gothaer Allgemeine (Germany)",
    cedentShort: "Gothaer",
    term: "36 months",
    termRemaining: "34m 02d",
    trigger: "Indemnity — German flood losses above attachment (per occurrence)",
    triggerShort: "Indemnity · German flood",
    oracle: "DWD · EFAS · claims development · via Chainlink",
    oracleLevel: 97,
    oracleTrend: "ok",
    collateral: "EBRD notes",
    settlement: "T+0",
    tranche: "Single",
    rating: "Baa2 (sf)",
    pricePerToken: 1.0110,
    description: "€100M of German flood protection — Yardstick Re DAC Series 2026-1 (Jun 2026), the first flood cat bond from a German insurer. Spread indicative.",
    investors: 640,
    lastTrigger: null,
    parties: [
      { mono: "GOT", color: "#1c9b7c", name: "Gothaer Allgemeine Vers. AG", role: "Sponsor · Cedent" },
      { mono: "YRD", color: "#2563d6", name: "Yardstick Re DAC", role: "Issuer · Ireland" },
      { mono: "AON", color: "#c43d59", name: "Aon Securities", role: "Lead Structuring Agent & Bookrunner" },
      { mono: "MRE", color: "#0a1628", name: "Munich Re", role: "Co-manager" },
      { mono: "RMS", color: "#7a4cc9", name: "RMS (Moody's)", role: "Risk Modeller" },
      { mono: "DWD", color: "#b8821a", name: "DWD · EFAS", role: "Hazard Data" },
      { mono: "MDY", color: "#56688a", name: "Moody's — Baa2 (sf)", role: "Rating" },
      { mono: "FB", color: "#0a1628", name: "Fireblocks", role: "Wallet & Digital-Asset Custody Tech" },
      { mono: "BNY", color: "#0a1628", name: "BNY", role: "Collateral Custodian" },
      { mono: "LINK", color: "#2563d6", name: "Chainlink", role: "Oracle Network · Onchain Data Delivery" },
      { mono: "RZ", color: "#0a1628", name: "RIZK Protocol", role: "Tokenization · Registry · Settlement" },
    ],
  },
  {
    id: "VLT-WTR-002",
    artemisUrl: "https://www.artemis.bm/deal-directory/123-lights-re-ltd-series-2026-1/",
    ticker: "LIGHTS",
    name: "123 Lights Re 2026-1 — LADWP",
    category: "weather",
    categoryLabel: "Weather & Climate",
    status: "active",
    placed: true,
    apy: 9.0,
    apy7d: [8.9, 8.9, 9.0, 9.0, 9.0, 9.0, 9.0],
    tvl: 100_000_000,
    capacity: 100_000_000,
    cedent: "Los Angeles Dept. of Water & Power",
    cedentShort: "LADWP",
    term: "36 months",
    termRemaining: "35m 12d",
    trigger: "Industry loss index — California wildfire industry losses above attachment",
    triggerShort: "Industry loss index · CA wildfire",
    oracle: "PCS industry loss · CAL FIRE · VIIRS · via Chainlink",
    oracleLevel: 90,
    oracleTrend: "warn",
    collateral: "US T-bill money fund",
    settlement: "T+0",
    tranche: "Class A",
    rating: "NR",
    pricePerToken: 1.0060,
    description: "$100M of California wildfire protection for LADWP — 123 Lights Re Ltd. Series 2026-1 (Jul 2026), priced at a 9% spread on an industry-loss index trigger. Utility wildfire risk returning to the cat bond market after the 2025 LA fires.",
    investors: 720,
    lastTrigger: null,
    parties: [
      { mono: "LAD", color: "#1c9b7c", name: "LA Dept. of Water & Power", role: "Sponsor · Cedent" },
      { mono: "123", color: "#2563d6", name: "123 Lights Re Ltd.", role: "Issuer · Bermuda SPI" },
      { mono: "AON", color: "#c43d59", name: "Aon Securities", role: "Structuring Agent & Bookrunner" },
      { mono: "AIR", color: "#7a4cc9", name: "AIR Worldwide (Verisk)", role: "Risk Modeller" },
      { mono: "PCS", color: "#b8821a", name: "PCS · CAL FIRE", role: "Industry Loss Index · Hazard Data" },
      { mono: "FB", color: "#0a1628", name: "Fireblocks", role: "Wallet & Digital-Asset Custody Tech" },
      { mono: "BNY", color: "#0a1628", name: "BNY", role: "Collateral Custodian" },
      { mono: "LINK", color: "#2563d6", name: "Chainlink", role: "Oracle Network · Onchain Data Delivery" },
      { mono: "RZ", color: "#0a1628", name: "RIZK Protocol", role: "Tokenization · Registry · Settlement" },
    ],
  },
  {
    id: "VLT-CYB-001",
    artemisUrl: "https://www.artemis.bm/deal-directory/polestar-re-ltd-series-2026-1/",
    ticker: "POLE26",
    name: "PoleStar Re 2026-1 — Beazley",
    category: "cyber",
    categoryLabel: "Cyber Catastrophe",
    status: "active",
    placed: true,
    apy: 7.0,
    apy7d: [7.0, 7.0, 7.0, 7.0, 7.0, 7.0, 7.0],
    tvl: 140_000_000,
    capacity: 140_000_000,
    cedent: "Beazley",
    cedentShort: "Beazley",
    term: "36 months · to Dec 2028",
    termRemaining: "28m 04d",
    trigger: "Indemnity — systemic cyber catastrophe losses above attachment (Classes A–C)",
    triggerShort: "Systemic cyber · 3 classes",
    oracle: "Incident monitors · claims development · via Chainlink",
    oracleLevel: 98,
    oracleTrend: "ok",
    collateral: "US T-bill money fund",
    settlement: "T+0",
    tranche: "Class A (of A–C)",
    rating: "EL 0.82%",
    pricePerToken: 1.0210,
    description: "Class A of the largest cyber cat bond to date — $300M across three classes (Class A $140M at 7.0%, B $100M at 9.0%, C $60M at 10.5%), covering systemic cyber events for Beazley on a per-occurrence basis through end-2028.",
    investors: 1120,
    lastTrigger: null,
    parties: [
      { mono: "BZ", color: "#1c9b7c", name: "Beazley", role: "Sponsor · Cedent" },
      { mono: "PSR", color: "#2563d6", name: "PoleStar Re Ltd.", role: "Issuer · Bermuda SPI" },
      { mono: "GS", color: "#c43d59", name: "Gallagher Securities", role: "Sole Structuring Agent" },
      { mono: "AON", color: "#0a1628", name: "Aon", role: "Joint Bookrunner" },
      { mono: "RMS", color: "#7a4cc9", name: "RMS (Moody's)", role: "Risk Modeller" },
      { mono: "INC", color: "#b8821a", name: "Cyber incident monitors", role: "Event Data" },
      { mono: "FB", color: "#0a1628", name: "Fireblocks", role: "Wallet & Digital-Asset Custody Tech" },
      { mono: "BNY", color: "#0a1628", name: "BNY", role: "Collateral Custodian" },
      { mono: "LINK", color: "#2563d6", name: "Chainlink", role: "Oracle Network · Onchain Data Delivery" },
      { mono: "RZ", color: "#0a1628", name: "RIZK Protocol", role: "Tokenization · Registry · Settlement" },
    ],
  },
];

// Portfolio positions (investor)
const POSITIONS = [
  { vaultId: "VLT-CYC-001", deposited: 20_000, currentValue: 20_700, premiumAccrued: 700, tokens: 19_398, depositedAt: "2026-06-18" },
  { vaultId: "VLT-NAT-001", deposited: 25_000, currentValue: 25_920, premiumAccrued: 920, tokens: 24_679, depositedAt: "2026-05-28" },
  { vaultId: "VLT-NAT-002", deposited: 40_000, currentValue: 40_760, premiumAccrued: 760, tokens: 38_314, depositedAt: "2026-06-12" },
  { vaultId: "VLT-CYB-001", deposited: 15_000, currentValue: 15_540, premiumAccrued: 540, tokens: 14_691, depositedAt: "2026-02-03" },
  { vaultId: "VLT-WTR-002", deposited: 8_000, currentValue: 8_090, premiumAccrued: 90, tokens: 7_952, depositedAt: "2026-07-08" },
];

// Cedent coverage (cedent side — Government of Jamaica view)
const COVERAGES = [
  { id: "COV-NAT-001", vaultId: "VLT-NAT-001", limit: 200_000_000, posted: 200_000_000, premium: 13_500_000, status: "Active", utilization: 100 },
  { id: "COV-NEW-001", vaultId: null, limit: 75_000_000, posted: 0, premium: 0, status: "Draft", utilization: 0,
    name: "Jamaica Excess Rainfall Parametric", trigger: "CHIRPS rainfall grid ≥ threshold across parishes", oracle: "CHIRPS · IBRD calc agent · via Chainlink" },
];

// Orderbook for secondary market
const ORDERBOOK_BIDS = [
  { price: 1.0185, size: 24_000, depth: 24_000 },
  { price: 1.0178, size: 52_400, depth: 76_400 },
  { price: 1.0170, size: 88_200, depth: 164_600 },
  { price: 1.0162, size: 124_800, depth: 289_400 },
  { price: 1.0155, size: 41_000, depth: 330_400 },
  { price: 1.0148, size: 67_500, depth: 397_900 },
  { price: 1.0140, size: 31_200, depth: 429_100 },
];
const ORDERBOOK_ASKS = [
  { price: 1.0204, size: 18_400, depth: 18_400 },
  { price: 1.0212, size: 44_200, depth: 62_600 },
  { price: 1.0220, size: 71_800, depth: 134_400 },
  { price: 1.0228, size: 92_100, depth: 226_500 },
  { price: 1.0235, size: 38_600, depth: 265_100 },
  { price: 1.0243, size: 56_400, depth: 321_500 },
  { price: 1.0250, size: 24_900, depth: 346_400 },
];
const RECENT_TRADES = [
  { side: "buy",  price: 1.0204, size: 4_200, time: "12:38:14" },
  { side: "buy",  price: 1.0201, size: 1_800, time: "12:37:42" },
  { side: "sell", price: 1.0198, size: 12_400, time: "12:36:11" },
  { side: "buy",  price: 1.0203, size: 7_400, time: "12:34:55" },
  { side: "buy",  price: 1.0205, size: 2_100, time: "12:33:28" },
  { side: "sell", price: 1.0199, size: 9_800, time: "12:32:04" },
  { side: "sell", price: 1.0198, size: 3_200, time: "12:30:47" },
  { side: "buy",  price: 1.0204, size: 14_800, time: "12:29:11" },
];

// Oracle / claims monitor signals
const ORACLE_SIGNALS = [
  { id: "ORC-WIND", name: "Sri Lanka box · max sustained wind", source: "JTWC · IMD", value: 14, unit: "kt", trend: "flat", change: 0, threshold: 64, vaultId: "VLT-CYC-001" },
  { id: "ORC-RAIN", name: "Sri Lanka · rain-flood index 72h", source: "GPM IMERG · Sentinel-1", value: 21, unit: "/100 idx", trend: "flat", change: -2, threshold: 60, vaultId: "VLT-CYC-001" },
  { id: "ORC-SLHDI", name: "Sri Lanka · hydro-catchment rainfall (SLHDI)", source: "CHIRPS v2.0 · Mahaweli Authority", value: 63, unit: "pctile", trend: "down", change: -4, threshold: 4, vaultId: "VLT-DRT-001" },
  { id: "ORC-NHC",  name: "Atlantic Basin · storm watch", source: "NOAA NHC", value: 2, unit: "active systems", trend: "up", change: 1, threshold: 4, vaultId: "VLT-NAT-001" },
  { id: "ORC-USGS", name: "California · largest event 24h", source: "USGS", value: 3.1, unit: "M", trend: "flat", change: 0.0, threshold: 6.5, vaultId: "VLT-NAT-002" },
  { id: "ORC-GULF", name: "Gulf of Mexico · storm watch", source: "NOAA NHC", value: 1, unit: "active", trend: "up", change: 1, threshold: 3, vaultId: "VLT-NAT-003" },
  { id: "ORC-PCS",  name: "US industry loss · YTD", source: "PCS", value: 12.4, unit: "$B", trend: "flat", change: 0.2, threshold: 40, vaultId: "VLT-NAT-004" },
  { id: "ORC-EFAS", name: "Germany · flood alert index", source: "DWD · EFAS", value: 14, unit: "/100", trend: "flat", change: -1, threshold: 70, vaultId: "VLT-WTR-001" },
  { id: "ORC-FIRE", name: "SoCal · active fire detections", source: "VIIRS · CAL FIRE", value: 6, unit: "detections", trend: "up", change: 2, threshold: 150, vaultId: "VLT-WTR-002" },
  { id: "ORC-CYB",  name: "Systemic cyber · event monitor", source: "Incident monitors", value: 0, unit: "qualifying events", trend: "flat", change: 0, threshold: 1, vaultId: "VLT-CYB-001" },
];

// Recent trigger / settlement events
const EVENTS = [
  { type: "trigger-armed",   vault: "VLT-NAT-003", time: "38m ago",  text: "Invest 94L organising in the Gulf — TWIA aggregate watch opened." },
  { type: "deposit",         vault: "VLT-NAT-001", time: "2h ago",   text: "Investor 0x8f…3a2c deposited 12,500 USDC." },
  { type: "premium",         vault: "VLT-CYB-001", time: "5h ago",   text: "Quarterly spread payment 5.25M USDC distributed to 1,120 holders." },
  { type: "trade",           vault: "VLT-NAT-002", time: "9h ago",   text: "Secondary trade — 42,000 tokens @ 1.0440 USDC." },
  { type: "trigger-cleared", vault: "VLT-NAT-001", time: "1d ago",   text: "TS advisory update — central pressure 994mb, far above grid trigger. No payout." },
  { type: "cedent-post",     vault: "VLT-WTR-002", time: "3d ago",   text: "LADWP posted updated exposure schedule — 6,900 circuit-miles monitored." },
];

// Brief 30-pt APY history for chart
// Subscription build-up for vaults still in primary placement: cumulative $ committed
// over the bookbuild. Slow start, an anchor-order step, then a steady retail tail.
function genFillHistory(seed, targetTvl, days) {
  const n = days || 30;
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const curve = 0.10 + 0.90 * Math.pow(t, 0.62);          // decelerating build
    const anchorStep = t > 0.38 ? 0.14 * Math.min(1, (t - 0.38) / 0.06) : 0;  // anchor order lands
    const jitter = Math.sin(i * 1.7 + seed) * 0.012;
    out.push(Math.max(0, Math.min(1, curve * 0.84 + anchorStep + jitter)) * targetTvl);
  }
  out[n - 1] = targetTvl;
  return out.map(v => Math.round(v));
}

// Secondary-market price history (% of par). A cat bond's spread is fixed at issuance —
// what moves day to day is the mark, so this is what the vault page charts.
function genPriceHistory(seed, endPar, opts) {
  const o = opts || {};
  const vol = o.vol == null ? 0.18 : o.vol;      // daily points of par
  const drift = o.drift == null ? 0.02 : o.drift; // seasonal pull-to-par / risk-elapsed drift
  const out = [];
  let v = endPar - drift * 29;
  for (let i = 0; i < 30; i++) {
    const shock = Math.sin(i * 1.9 + seed * 2.3) * vol + Math.cos(i * 0.7 + seed) * vol * 0.55;
    out.push(+(v + shock).toFixed(2));
    v += drift;
  }
  out[29] = +endPar.toFixed(2);
  return out;
}

function genApyHistory(seed, mean, vol) {
  const out = [];
  let v = mean;
  for (let i = 0; i < 30; i++) {
    const r = (Math.sin(i * 1.7 + seed) + Math.cos(i * 0.43 + seed * 1.3)) * vol;
    v = mean + r;
    out.push(+v.toFixed(2));
  }
  return out;
}
VAULTS.forEach((v, i) => { if (!v.placed && v.tvl < v.capacity) v.fillHistory = genFillHistory(i + 1, v.tvl, 30); v.priceHistory = genPriceHistory(i + 1, (v.pricePerToken || v.price) * 100, { vol: v.status === 'subscribing' ? 0 : 0.18, drift: v.category === 'natcat' ? 0.03 : 0.015 }); v.apyHistory = genApyHistory(i, v.apy, 0.35); });

function fmtUSD(n) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(1) + "K";
  return "$" + n.toFixed(0);
}
function fmtUSDExact(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtNum(n, d = 0) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

Object.assign(window, {
  VAULTS, POSITIONS, COVERAGES, ORDERBOOK_BIDS, ORDERBOOK_ASKS,
  RECENT_TRADES, ORACLE_SIGNALS, EVENTS, fmtUSD, fmtUSDExact, fmtNum, genPriceHistory, genFillHistory
});
