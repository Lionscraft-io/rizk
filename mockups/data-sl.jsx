// Mock data for RIZK prototype — Sri Lanka Resilience Pilot edition
// Same shape as data.jsx; vaults adapted to Sri Lanka critical-infrastructure risks.

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
  { vaultId: "VLT-CYC-001", deposited: 25_000, currentValue: 25_874, premiumAccrued: 874, tokens: 24_248, depositedAt: "2026-06-18" },
  { vaultId: "VLT-NAT-001", deposited: 12_000, currentValue: 12_310, premiumAccrued: 310, tokens: 11_846, depositedAt: "2026-05-28" },
  { vaultId: "VLT-CYB-001", deposited: 8_000, currentValue: 8_260, premiumAccrued: 260, tokens: 7_835, depositedAt: "2026-02-10" },
  { vaultId: "VLT-DRT-001", deposited: 5_000, currentValue: 5_140, premiumAccrued: 140, tokens: 4_960, depositedAt: "2026-06-25" },
];

// Cedent coverage (cedent side — Serendib Telecom view)
const COVERAGES = [
  { id: "COV-CYC-001", vaultId: "VLT-CYC-001", limit: 14_000_000, posted: 14_000_000, premium: 1_300_000, status: "Active", utilization: 100 },
  { id: "COV-FLD-001", vaultId: "VLT-DRT-001", limit: 3_000_000, posted: 2_100_000, premium: 372_000, status: "Active", utilization: 70.0 },
  { id: "COV-NEW-001", vaultId: null, limit: 6_000_000, posted: 0, premium: 0, status: "Draft", utilization: 0,
    name: "National Water Board — Flood", trigger: "Rain-flood index ≥ 75 · treatment & pumping assets", oracle: "GPM · Sentinel-1 · via Chainlink" },
];

// Orderbook for secondary market
const ORDERBOOK_BIDS = [
  { price: 1.0295, size: 24_000, depth: 24_000 },
  { price: 1.0288, size: 52_400, depth: 76_400 },
  { price: 1.0280, size: 88_200, depth: 164_600 },
  { price: 1.0272, size: 124_800, depth: 289_400 },
  { price: 1.0265, size: 41_000, depth: 330_400 },
  { price: 1.0258, size: 67_500, depth: 397_900 },
  { price: 1.0250, size: 31_200, depth: 429_100 },
];
const ORDERBOOK_ASKS = [
  { price: 1.0314, size: 18_400, depth: 18_400 },
  { price: 1.0322, size: 44_200, depth: 62_600 },
  { price: 1.0330, size: 71_800, depth: 134_400 },
  { price: 1.0338, size: 92_100, depth: 226_500 },
  { price: 1.0345, size: 38_600, depth: 265_100 },
  { price: 1.0353, size: 56_400, depth: 321_500 },
  { price: 1.0360, size: 24_900, depth: 346_400 },
];
const RECENT_TRADES = [
  { side: "buy",  price: 1.0314, size: 4_200, time: "12:38:14" },
  { side: "buy",  price: 1.0311, size: 1_800, time: "12:37:42" },
  { side: "sell", price: 1.0308, size: 12_400, time: "12:36:11" },
  { side: "buy",  price: 1.0313, size: 7_400, time: "12:34:55" },
  { side: "buy",  price: 1.0315, size: 2_100, time: "12:33:28" },
  { side: "sell", price: 1.0309, size: 9_800, time: "12:32:04" },
  { side: "sell", price: 1.0308, size: 3_200, time: "12:30:47" },
  { side: "buy",  price: 1.0314, size: 14_800, time: "12:29:11" },
];

// Oracle / claims monitor signals
const ORACLE_SIGNALS = [
  { id: "ORC-WIND", name: "Parametric Box · Max sustained wind", source: "JTWC · IMD", value: 14, unit: "kt", trend: "flat", change: 0, threshold: 64, vaultId: "VLT-CYC-001" },
  { id: "ORC-RAIN", name: "Rain-flood index · 72h", source: "GPM IMERG · Sentinel-1", value: 21, unit: "/100 idx", trend: "flat", change: -2, threshold: 60, vaultId: "VLT-CYC-001" },
  { id: "ORC-SLHDI", name: "Sri Lanka · hydro-catchment rainfall (SLHDI)", source: "CHIRPS v2.0 · Mahaweli Authority", value: 63, unit: "pctile", trend: "down", change: -4, threshold: 4, vaultId: "VLT-DRT-001" },
  { id: "ORC-NETX", name: "Internet traffic vs baseline (SL)", source: "Traffic index · BGP (IODA-style)", value: 99, unit: "% of baseline", trend: "flat", change: 0.2, threshold: 40, vaultId: "VLT-CYC-001" },
  { id: "ORC-TWRB", name: "Telecom towers on backup power (SL)", source: "Tower-co telemetry", value: 38, unit: "twrs", trend: "flat", change: -4, threshold: 1500, vaultId: "VLT-CYC-001" },
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
  { type: "deposit",         vault: "VLT-CYC-001", time: "14m ago",  text: "Investor 0x8f…3a2c deposited 12,500 USDC." },
  { type: "trigger-armed",   vault: "VLT-NAT-003", time: "38m ago",  text: "Invest 94L organising in the Gulf — TWIA aggregate watch opened." },
  { type: "premium",         vault: "VLT-NAT-001", time: "3h ago",   text: "Quarterly risk-margin payment 3.375M USDC distributed to 2,140 holders." },
  { type: "trade",           vault: "VLT-CYB-001", time: "5h ago",   text: "Secondary trade — 18,000 tokens @ 1.0210 USDC." },
  { type: "trigger-cleared", vault: "VLT-NAT-001", time: "1d ago",   text: "TS advisory update — central pressure 994mb, far above grid trigger. No payout." },
  { type: "cedent-post",     vault: "VLT-DRT-001", time: "3d ago",   text: "Lanka Grid Energy signs hydro-drought cover — investors post 500K of additional collateral." },
];

// Pre-agreed disbursement purposes — flagship cyclone bond (Tier 2 payout = USD 14M)
const SL_DISBURSEMENTS = [
  {
    id: "DSB-01", purpose: "Emergency response & network restoration", operator: "Serendib Telecom", sector: "telecom",
    amount: 3_900_000, released: 2_340_000,
    items: "Cells-on-wheels ×46 · shared backup-power systems ×400 · generator fuel logistics · splice crews",
    milestones: [
      { m: "Emergency mobilisation (24h)", status: "Verified" },
      { m: "Backbone fibre restored — 11 cuts", status: "Verified" },
      { m: "≥90% site availability (21d)", status: "In progress" },
    ],
  },
  {
    id: "DSB-02", purpose: "Grid emergency response & restoration", operator: "Lanka Grid Energy", sector: "power",
    amount: 5_100_000, released: 2_805_000,
    items: "Line crews ×38 · mobile transformers ×6 · substation dewatering · fuel & road-access coordination",
    milestones: [
      { m: "Emergency mobilisation (24h)", status: "Verified" },
      { m: "Substations de-flooded & safe", status: "In progress" },
      { m: "≥95% feeders re-energised (28d)", status: "Pending" },
    ],
  },
  {
    id: "DSB-03", purpose: "Zero-rated connectivity — affected customers", operator: "Serendib Telecom", sector: "telecom",
    amount: 1_400_000, released: 700_000,
    items: "90 days free voice/data for 1.2M subscribers in declared districts",
    milestones: [
      { m: "Zero-rating activated (48h)", status: "Verified" },
      { m: "Monthly usage attestation", status: "In progress" },
    ],
  },
  {
    id: "DSB-04", purpose: "Priority restoration — critical facilities", operator: "Joint · both operators", sector: "joint",
    amount: 2_200_000, released: 1_540_000,
    items: "34 hospitals · 61 shelters · 12 water plants — power & connectivity ahead of general queue",
    milestones: [
      { m: "Hospitals re-energised (72h)", status: "Verified" },
      { m: "Shelters connected (7d)", status: "In progress" },
      { m: "Water plants restored (10d)", status: "In progress" },
    ],
  },
  {
    id: "DSB-05", purpose: "Temporary capacity — isolated communities", operator: "Joint · both operators", sector: "joint",
    amount: 1_400_000, released: 560_000,
    items: "Satellite backhaul ×22 sites (pre-contracted) · mobile generation 8 MW · community charging & Wi-Fi points",
    milestones: [
      { m: "Satellite links live (96h)", status: "Verified" },
      { m: "Mobile generation deployed", status: "In progress" },
    ],
  },
];

// Settlement ledger — simulated Tier 2 payout (TC Vidura)
const SL_LEDGER = [
  { t: "2026-12-05 09:12", type: "AUTHORISATION", ref: "GOV-2026-0007", detail: "Governance board authorises Tier 2 payout USD 14,000,000 — resolution recorded on ledger", amt: null },
  { t: "2026-12-05 09:14", type: "VAULT DRAW", ref: "0x8c41…e2b7", detail: "Protection-collateral vault drawn — VLT-CYC-001 principal reduction 71.4%", amt: 14_000_000 },
  { t: "2026-12-05 09:21", type: "TRANSFER", ref: "0x3fa2…77c1", detail: "SPV → Serendib Telecom restoration escrow (DSB-01)", amt: 1_950_000 },
  { t: "2026-12-05 09:21", type: "TRANSFER", ref: "0x3fa2…77c4", detail: "SPV → Lanka Grid Energy restoration escrow (DSB-02)", amt: 2_550_000 },
  { t: "2026-12-05 10:02", type: "TRANSFER", ref: "0x91d8…04ee", detail: "SPV → joint critical-facilities escrow (DSB-04)", amt: 1_540_000 },
  { t: "2026-12-06 08:40", type: "MILESTONE", ref: "VER-118", detail: "Hospitals re-energised (72h) — verified by monitoring agent · releases DSB-04 stage 2", amt: null },
  { t: "2026-12-06 08:41", type: "TRANSFER", ref: "0xa27b…c114", detail: "Zero-rating activation tranche → Serendib Telecom (DSB-03)", amt: 700_000 },
  { t: "2026-12-06 14:30", type: "MILESTONE", ref: "VER-121", detail: "Severed hill-country backbone fibre restored with army engineering support — coordination event logged", amt: null },
  { t: "2026-12-07 07:15", type: "TRANSFER", ref: "0x5e19…8d02", detail: "Second-stage release — grid restoration (DSB-02)", amt: 255_000 },
  { t: "2026-12-07 11:02", type: "REPORT", ref: "RPT-D1-004", detail: "T+48h traceability report published to all participants — 100% of flows reconciled", amt: null },
];

// Rehearsal ledger — latest dry run (standby view)
const SL_REHEARSAL = [
  { t: "2026-07-12 06:00", type: "DRY RUN", ref: "DR-03", detail: "Synthetic Tier 1 event injected — trigger evaluation to authorisation 26h", amt: null },
  { t: "2026-07-13 08:05", type: "TRANSFER", ref: "0xtest…0001", detail: "Test-value transfer SPV → operator escrows — all controls passed", amt: 5_000 },
  { t: "2026-07-13 08:20", type: "MILESTONE", ref: "VER-T18", detail: "Milestone verification round-trip confirmed (monitoring agent)", amt: null },
  { t: "2026-07-13 09:00", type: "REPORT", ref: "RPT-DR-03", detail: "Rehearsal traceability report — 100% reconciliation, T+0 settlement verified", amt: null },
];

// Covered operators — resilience view
const SL_OPERATORS = [
  {
    id: "OP-TEL", name: "Serendib Telecom", sector: "telecom", sectorLabel: "Telecommunications",
    coverage: 11_000_000,
    assets: "4,212 cell sites · 18,400 km fibre · 3 mobile switching centres",
    serves: "14.2M subscribers · 82% population coverage",
    commitments: "Zero-rated connectivity 90d · priority restoration for hospitals & shelters · 96h emergency Wi-Fi at relief centres",
  },
  {
    id: "OP-PWR", name: "Lanka Grid Energy", sector: "power", sectorLabel: "Electricity T&D",
    coverage: 9_000_000,
    assets: "61 grid substations · 1,940 feeders · 28,600 km distribution lines",
    serves: "6.1M customer accounts · 21.9M people",
    commitments: "Priority re-energisation of hospitals, water plants & shelters · mobile generation for isolated communities",
  },
];

// Public-service commitments — targets and (simulated event) performance
const SL_COMMITMENTS = [
  { c: "Zero-rated connectivity — declared districts", target: "Activate ≤48h · 90 days", actual: "Activated 31h · 1.2M subscribers", status: "On track" },
  { c: "Priority restoration — hospitals", target: "Re-energise ≤72h", actual: "27 of 34 within 72h · 7 in progress", status: "On track" },
  { c: "Priority restoration — shelters & water plants", target: "≤7–10 days", actual: "44 of 61 shelters connected", status: "In progress" },
  { c: "Temporary capacity — isolated communities", target: "Satellite links ≤96h", actual: "22 of 22 links live at 89h", status: "Met" },
  { c: "Restoration beyond baseline", target: "≥90% cell availability in 21d", actual: "86.9% at day 3 · ahead of plan", status: "On track" },
  { c: "Long-tail restoration — worst-served districts", target: "Last 5% restored ≤ 14 days", actual: "Estate highlands fully restored day 12", status: "Met" },
  { c: "Displacement shelters — sustained power", target: "Monitored supply for 6 months", actual: "61 of 61 shelters on monitored supply", status: "On track" },
];

// Resilience results framework (pilot measures A–D)
const SL_RESILIENCE_METRICS = [
  { id: "A1", group: "Protection quality", name: "Estimated basis risk", val: "6.8%", sub: "independent model validation passed", benchmark: "vs 15–25% typical parametric" },
  { id: "A2", group: "Protection quality", name: "Trigger → funds available", val: "38h", sub: "measured in dry-runs & simulation", benchmark: "vs 6–18 months indemnity claims" },
  { id: "A3", group: "Protection quality", name: "Essential-service continuity", val: "34 + 61", sub: "hospitals + shelters under priority protocol", benchmark: "ahead of general restoration queue" },
  { id: "B1", group: "Transaction economics", name: "Transaction & lifecycle cost", val: "−41%", sub: "issuance + admin vs conventional cat bond", benchmark: "USD 386k saved on USD 20M cover" },
  { id: "B2", group: "Transaction economics", name: "Structure → issuance", val: "11 wks", sub: "87% of components reusable at renewal", benchmark: "vs 26+ weeks conventional" },
  { id: "C1", group: "Capital mobilisation", name: "Philanthropic & concessional", val: "$5.3M", sub: "23 contributors · 8 new to disaster-risk finance", benchmark: "first-loss + commitments funding" },
  { id: "C2", group: "Capital mobilisation", name: "Investor risk capacity", val: "$34.4M", sub: "6 vaults · 1,637 investors · fully collateralised", benchmark: "tickets from $100 vs $250K+ norm" },
  { id: "D1", group: "Reporting", name: "Payout traceability", val: "100%", sub: "every authorisation & transfer on ledger", benchmark: "T+48h participant reporting" },
];

// Critical facilities under priority-restoration protocol (map layer)
const SL_FACILITIES = [
  { type: "hospital", x: 44, y: 300 }, { type: "hospital", x: 118, y: 268 }, { type: "hospital", x: 214, y: 230 },
  { type: "hospital", x: 168, y: 146 }, { type: "hospital", x: 62, y: 38 }, { type: "hospital", x: 160, y: 384 },
  { type: "hospital", x: 90, y: 340 }, { type: "hospital", x: 196, y: 300 },
  { type: "shelter", x: 200, y: 260 }, { type: "shelter", x: 224, y: 288 }, { type: "shelter", x: 150, y: 200 },
  { type: "shelter", x: 100, y: 120 }, { type: "shelter", x: 130, y: 310 }, { type: "shelter", x: 70, y: 240 },
  { type: "shelter", x: 180, y: 350 }, { type: "shelter", x: 50, y: 190 },
  { type: "water", x: 40, y: 320 }, { type: "water", x: 126, y: 236 }, { type: "water", x: 206, y: 210 },
  { type: "water", x: 96, y: 82 }, { type: "water", x: 140, y: 366 },
];

// Parties & service providers (vault detail — Securitize-style)
const VAULT_PARTIES = [
  { mono: "RR", color: "#1c9b7c", name: "Resilience Re (SL) SPC", role: "Issuer · Segregated Cell" },
  { mono: "ADB", color: "#2563d6", name: "Asian Development Bank", role: "Anchor Sponsor" },
  { mono: "LC", color: "#b8821a", name: "Lionscraft", role: "Structuring & Technology" },
  { mono: "VA", color: "#7a4cc9", name: "Verita Analytics", role: "Independent Calculation Agent" },
  { mono: "MT", color: "#c43d59", name: "Meridian Trust", role: "Collateral Custodian" },
  { mono: "CF", color: "#1c9b7c", name: "Cinnamon Fund Services", role: "Fund Administrator" },
  { mono: "HA", color: "#56688a", name: "Halcyon & Partners", role: "Auditor" },
  { mono: "HC", color: "#2563d6", name: "Harbour Chambers", role: "Legal Counsel · Bermuda SC" },
  { mono: "EO", color: "#b8821a", name: "NASA GPM · ESA Sentinel-1 · JTWC", role: "Hazard & EO Data" },
  { mono: "TW", color: "#7a4cc9", name: "Tower-co Telemetry · IODA", role: "Independent Outage Data" },
  { mono: "RZ", color: "#0a1628", name: "RIZK Protocol", role: "Tokenization · Registry · Settlement" },
  { mono: "BMA", color: "#56688a", name: "Bermuda Monetary Authority", role: "Regulator" },
];

// Documents (vault detail)
const VAULT_DOCS = [
  { name: "Private Placement Memorandum", meta: "PDF · 32 pages · Jun 2026" },
  { name: "Term Sheet & Trigger Mechanics Annex", meta: "PDF · 9 pages · Jun 2026" },
  { name: "Independent Model Validation Report", meta: "PDF · 18 pages · Jun 2026" },
  { name: "Subscription Agreement (allowlisted)", meta: "PDF · 12 pages · Jun 2026" },
  { name: "Cyclone Ditwah Backtest Note", meta: "PDF · 6 pages · Jul 2026" },
  { name: "Monthly Participant Report", meta: "PDF · latest · Jul 2026" },
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
VAULTS.forEach((v, i) => { if (!v.placed && v.tvl < v.capacity) v.fillHistory = genFillHistory(i + 1, v.tvl, 30); v.priceHistory = genPriceHistory(i + 1, (v.pricePerToken || v.price) * 100, { vol: v.status === 'subscribing' ? 0 : 0.18, drift: v.category === 'natcat' ? 0.03 : 0.015 }); v.apyHistory = genApyHistory(i, v.apy, 0.6); });

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
  RECENT_TRADES, ORACLE_SIGNALS, EVENTS, fmtUSD, fmtUSDExact, fmtNum, genPriceHistory, genFillHistory,
  SL_DISBURSEMENTS, SL_LEDGER, SL_REHEARSAL,
  SL_OPERATORS, SL_COMMITMENTS, SL_RESILIENCE_METRICS, SL_FACILITIES,
  VAULT_PARTIES, VAULT_DOCS,
});
