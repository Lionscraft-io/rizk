// Mock data — Resilience Facility prototype
// Sri Lanka Critical Infrastructure Resilience Facility (pilot)
// Parametric 'lite' cat bond · USD 20M · AI monitoring · digital asset infrastructure

const FACILITY = {
  id: "SLCIR-2026-01",
  name: "Sri Lanka Critical Infrastructure Resilience Facility",
  shortName: "SLCIR Pilot",
  instrument: "Privately placed 'lite' catastrophe bond — parametric",
  notional: 20_000_000,
  hazard: "Tropical cyclone + severe flood (dual-parameter)",
  region: "Sri Lanka — national parametric box",
  box: "5.8–9.9°N · 79.5–82.0°E",
  term: "24 months · Jun 2026 – Jun 2028",
  issueDate: "2026-06-15",
  spv: "Resilience Re (SL) SPC — Cell 01",
  calcAgent: "Independent calculation agent (cat model v2.4, validated)",
  settlement: "Fireblocks wallet infrastructure · BNY custody · T+0",
  sponsor: "ADB (anchor sponsor) · Lionscraft (structuring & technology)",
  governance: "Facility Governance Board — ADB, GoSL, operators, calc agent",
};

// Capital stack — tokenized tranches
const TRANCHES = [
  {
    id: "NOTE-A",
    token: "tSLCIR-A",
    name: "Investor Risk Notes · Class A",
    type: "investor",
    size: 14_000_000,
    funded: 14_000_000,
    coupon: 9.75,
    holders: 148,
    minTicket: 1_000,
    attach: "Second loss · USD 4M – 20M",
    status: "active",
    desc: "Fully funded catastrophe risk capacity from ILS funds, reinsurers, family offices — and smaller allowlisted participants via the stablecoin vault. Tokenized notes with eligibility and transfer controls.",
  },
  {
    id: "GRANT-F",
    token: "cSLCIR-F",
    name: "Philanthropic First-Loss Layer",
    type: "donor",
    size: 4_000_000,
    funded: 4_000_000,
    coupon: 0,
    holders: 14,
    minTicket: 25_000,
    attach: "First loss · USD 0 – 4M",
    status: "active",
    desc: "Donor and foundation contributions absorbing first losses — improving pricing for investors and affordability for operators. Digital contribution records earmark sponsor, period and purpose.",
  },
  {
    id: "FUND-P",
    token: "cSLCIR-P",
    name: "Preparedness & Commitments Fund",
    type: "donor",
    size: 2_000_000,
    funded: 1_720_000,
    coupon: 0,
    holders: 9,
    minTicket: 10_000,
    attach: "Public-service commitments · pre & post event",
    status: "active",
    desc: "Concessional funding for pre-agreed public-service commitments — zero-rated connectivity, priority restoration for hospitals and shelters, temporary capacity.",
  },
];

// Covered operators
const OPERATORS = [
  {
    id: "OP-TEL",
    name: "Serendib Telecom",
    sector: "telecom",
    sectorLabel: "Telecommunications",
    coverage: 11_000_000,
    premium: 715_000,
    assets: "4,212 cell sites · 18,400 km fibre · 3 mobile switching centres",
    commitments: "Zero-rated connectivity 90d · priority restoration for hospitals & shelters · 96h emergency Wi-Fi at relief centres",
  },
  {
    id: "OP-PWR",
    name: "Lanka Grid Energy",
    sector: "power",
    sectorLabel: "Electricity T&D",
    coverage: 9_000_000,
    premium: 585_000,
    assets: "61 grid substations · 1,940 feeders · 28,600 km distribution lines",
    commitments: "Priority re-energisation of hospitals, water plants & shelters · mobile generation for isolated communities",
  },
];

// Policies — parametric protection contracts written under the facility
const POLICIES = [
  {
    id: "POL-TEL-01",
    operator: "Serendib Telecom",
    sector: "telecom",
    sectorLabel: "Telecommunications",
    hazard: "Tropical cyclone + severe flood",
    limit: 11_000_000,
    premiumRate: 6.5,
    premium: 715_000,
    term: "24m · Jun 2026 – Jun 2028",
    trigger: "Facility dual-parameter trigger · graduated 40/70/100%",
    payoutUse: "Emergency response · network restoration · zero-rated connectivity · priority restoration",
    commitments: "Zero-rated connectivity 90d · priority restoration hospitals & shelters · 96h emergency Wi-Fi at relief centres",
    status: "active",
    utilization: 0,
  },
  {
    id: "POL-PWR-01",
    operator: "Lanka Grid Energy",
    sector: "power",
    sectorLabel: "Electricity T&D",
    hazard: "Tropical cyclone + severe flood",
    limit: 9_000_000,
    premiumRate: 6.5,
    premium: 585_000,
    term: "24m · Jun 2026 – Jun 2028",
    trigger: "Facility dual-parameter trigger · graduated 40/70/100%",
    payoutUse: "Grid emergency response · substation & feeder restoration · mobile generation · priority re-energisation",
    commitments: "Priority re-energisation of hospitals, water plants & shelters · mobile generation for isolated communities",
    status: "active",
    utilization: 0,
  },
];

// Policy pipeline — repeatability story (reusable legal/analytical/digital components)
const POLICY_PIPELINE = [
  { id: "POL-WTR-01", operator: "National Water Board (SL)", sector: "water", hazard: "Severe flood — treatment & pumping assets", limit: 6_000_000, status: "Structuring", note: "Reuses facility trigger + legal wrapper · target Q4 2026" },
  { id: "POL-MDV-01", operator: "Atoll Telecom (Maldives)", sector: "telecom", hazard: "Cyclone + storm surge", limit: 8_000_000, status: "Assessment", note: "Same instrument, new parametric box · with ADB Pacific DRF team" },
  { id: "POL-NPL-01", operator: "Himal Power Distribution (Nepal)", sector: "power", hazard: "Earthquake — M7+ parametric", limit: 12_000_000, status: "Candidate", note: "Hazard module swap · EO + SCADA telemetry feasibility done" },
];

// Stablecoin vaults — marketplace of resilience vaults
// RF_VAULTS[0] is the flagship Class A vault of the SLCIR facility
const RF_VAULTS = [
  {
    id: "VLT-SLCIR-A",
    token: "tSLCIR-A",
    name: "Sri Lanka Resilience Vault",
    category: "natcat",
    categoryLabel: "Cyclone + Flood · Sri Lanka",
    status: "active",
    placed: true,
    apy: 9.75,
    apy7d: [9.6, 9.7, 9.7, 9.75, 9.75, 9.75, 9.75],
    tvl: 14_000_000,
    capacity: 14_000_000,
    cedent: "Serendib Telecom + Lanka Grid Energy",
    cedentShort: "SLCIR Cell 01",
    term: "24 months",
    termRemaining: "23m 0d",
    trigger: "Dual-parameter: wind ≥64/85/100 kt OR rain-flood index ≥60/75/90 · graduated 40/70/100%",
    triggerShort: "Wind + flood index · 3 tiers",
    oracle: "JTWC/IMD · GPM · Sentinel-1 · calc agent · via Chainlink",
    pricePerToken: 1.0310,
    price: 1.0310,
    rating: "NR · EL 4.05%",
    investors: 148,
    depositors: 148,
    minDeposit: 1_000,
    asset: "USDC",
    attach: "Second loss · USD 4M – 20M",
    description: "Flagship vault of the SLCIR facility. Deposits collateralise the Class A risk notes covering Sri Lanka's telecom and electricity operators. Premium streams continuously; a triggered event reduces principal by the tier payout percentage.",
    desc: "Deposit stablecoins to collateralise the Class A risk notes. Deposits convert to tokenized MMF collateral held by the SPV; premium streams to holders continuously. If the parametric trigger fires, principal reduces by the payout percentage of the tier attained.",
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
    id: "VLT-SLCIR-D",
    token: "tSLCIR-D",
    ticker: "SLCIR-D",
    name: "Sri Lanka Hydro-Drought Vault",
    country: "Sri Lanka",
    category: "weather",
    categoryLabel: "Hydro-Drought · Sri Lanka",
    status: "subscribing",
    apy: 10.25,
    apy7d: [10.25, 10.25, 10.25, 10.25, 10.25, 10.25, 10.25],
    tvl: 2_250_000,
    capacity: 3_000_000,
    cedent: "Lanka Grid Energy PLC via Serendib General Insurance PLC (fronting carrier)",
    cedentShort: "Lanka Grid Energy",
    term: "24 months · 2 hydrological years",
    termRemaining: "on risk 1 Oct 2026",
    trigger: "Sri Lanka Hydro Deficit Index (SLHDI) — catchment-area-weighted cumulative rainfall over the six catchments feeding Kotmale, Victoria, Randenigala, Maussakelle, Castlereagh and Samanalawewa, weighted by each catchment's share of 2015–2025 mean annual hydro production and accumulated over the hydrological year 1 Oct – 30 Sep — at or below the 4th percentile of the 1981–2025 climatology. Graduated payout 40 / 70 / 100% at the 4th / 2nd / 1st percentile. Annual aggregate, one determination per risk year, no reinstatement.",
    triggerShort: "Catchment rainfall ≤ 4th pctile · 1-in-25yr",
    oracle: "CHIRPS v2.0 Final · GPM IMERG Late v07 · via Chainlink",
    pricePerToken: 1.0000,
    price: 1.0000,
    rating: "NR · EL 2.50%",
    investors: 37,
    depositors: 37,
    minDeposit: 1_000,
    asset: "USDC",
    attach: "Single layer · 1-in-25yr attachment",
    description: "A 24-month collateralised parametric note covering the catchments behind Sri Lanka's hydropower cascade against a 1-in-25-year rainfall deficit — the shortfall that forces emergency thermal generation and rotating outages. It is the one exposure in this facility that gets worse when it does not rain, so it pays in the years the cyclone and flood cover does not.",
    desc: "Deposit stablecoins to collateralise a 1-in-25-year hydrological drought cover for Sri Lanka's hydropower catchments. It pays in the dry years the flagship cyclone and flood vault does not — the only genuinely diversifying exposure in this facility.",
    correlationNote: "Negatively correlated with the Sri Lanka Resilience Vault.",
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
    token: "JAM26",
    ticker: "JAM26",
    name: "IBRD CAR Jamaica 2026",
    category: "natcat",
    categoryLabel: "Sovereign Parametric · Jamaica",
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
    pricePerToken: 1.0130,
    price: 1.0130,
    rating: "EL 2.48%",
    investors: 2140,
    depositors: 2140,
    minDeposit: 250000,
    asset: "USDC",
    attach: "Single layer · parametric grid",
    description: "Parametric hurricane protection for the Government of Jamaica — successor to the 2024 notes that paid out in full after Hurricane Melissa (Oct 2025). Upsized to $200M on strong ILS demand; priced at a 6.75% risk margin.",
    desc: "Parametric hurricane protection for the Government of Jamaica — successor to the 2024 notes that paid out in full after Hurricane Melissa (Oct 2025). Upsized to $200M on strong ILS demand; priced at a 6.75% risk margin.",
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
    token: "SUTTER",
    ticker: "SUTTER",
    name: "Sutter Re 2026-1 — CEA",
    category: "natcat",
    categoryLabel: "Earthquake · California",
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
    pricePerToken: 1.0440,
    price: 1.0440,
    rating: "NR",
    investors: 3210,
    depositors: 3210,
    minDeposit: 250000,
    asset: "USDC",
    attach: "Class A · indemnity aggregate",
    description: "California earthquake reinsurance for the CEA — Sutter Re Ltd. Series 2026-1, $425M (Jun 2026). Spread indicative.",
    desc: "California earthquake reinsurance for the CEA — Sutter Re Ltd. Series 2026-1, $425M (Jun 2026). Spread indicative.",
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
    token: "ALAMO",
    ticker: "ALAMO",
    name: "Alamo Re 2026-1 — TWIA",
    category: "natcat",
    categoryLabel: "Named Storm · Texas",
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
    pricePerToken: 1.0290,
    price: 1.0290,
    rating: "NR",
    investors: 2875,
    depositors: 2875,
    minDeposit: 250000,
    asset: "USDC",
    attach: "Class A · indemnity",
    description: "Class A of the $750M Alamo Re Ltd. Series 2026-1 (May 2026) — Texas named storm and severe thunderstorm protection for TWIA. Class A priced at a 5.25% spread; Classes B and C at 7.25% and 10.5%.",
    desc: "$750M of Texas named storm and severe thunderstorm protection — Alamo Re Ltd. Series 2026-1 (May 2026). Spread indicative.",
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
    token: "MATT26",
    ticker: "MATT26",
    name: "Matterhorn Re 2026-3 — Swiss Re",
    category: "natcat",
    categoryLabel: "Industry Loss · US/Canada",
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
    pricePerToken: 1.0180,
    price: 1.0180,
    rating: "NR",
    investors: 1930,
    depositors: 1930,
    minDeposit: 250000,
    asset: "USDC",
    attach: "Retro · industry-loss index",
    description: "$345M retrocession for Swiss Re on a weighted industry-loss trigger — Matterhorn Re Ltd. Series 2026-3 (Jul 2026). Spread indicative.",
    desc: "$345M retrocession for Swiss Re on a weighted industry-loss trigger — Matterhorn Re Ltd. Series 2026-3 (Jul 2026). Spread indicative.",
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
    token: "YRDSTK",
    ticker: "YRDSTK",
    name: "Yardstick Re 2026-1 — Gothaer",
    category: "weather",
    categoryLabel: "Flood · Germany",
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
    pricePerToken: 1.0110,
    price: 1.0110,
    rating: "Baa2 (sf)",
    investors: 640,
    depositors: 640,
    minDeposit: 250000,
    asset: "USDC",
    attach: "Single layer · indemnity",
    description: "€100M of German flood protection — Yardstick Re DAC Series 2026-1 (Jun 2026), the first flood cat bond from a German insurer. Spread indicative.",
    desc: "€100M of German flood protection — Yardstick Re DAC Series 2026-1 (Jun 2026), the first flood cat bond from a German insurer. Spread indicative.",
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
    token: "LIGHTS",
    ticker: "LIGHTS",
    name: "123 Lights Re 2026-1 — LADWP",
    category: "weather",
    categoryLabel: "Wildfire Liability · California",
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
    pricePerToken: 1.0060,
    price: 1.0060,
    rating: "NR",
    investors: 720,
    depositors: 720,
    minDeposit: 250000,
    asset: "USDC",
    attach: "Class A · indemnity",
    description: "$100M of California wildfire protection for LADWP — 123 Lights Re Ltd. Series 2026-1 (Jul 2026), priced at a 9% spread on an industry-loss index trigger. Utility wildfire risk returning to the cat bond market after the 2025 LA fires.",
    desc: "$100M of California wildfire liability protection for LADWP — 123 Lights Re Ltd. Series 2026-1 (Jul 2026), utility wildfire risk returning to the cat bond market after the 2025 LA fires. Spread indicative.",
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
    token: "POLE26",
    ticker: "POLE26",
    name: "PoleStar Re 2026-1 — Beazley",
    category: "cyber",
    categoryLabel: "Cyber Catastrophe · Global",
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
    pricePerToken: 1.0210,
    price: 1.0210,
    rating: "EL 0.82%",
    investors: 1120,
    depositors: 1120,
    minDeposit: 250000,
    asset: "USDC",
    attach: "Class A of A–C",
    description: "Class A of the largest cyber cat bond to date — $300M across three classes (Class A $140M at 7.0%, B $100M at 9.0%, C $60M at 10.5%), covering systemic cyber events for Beazley on a per-occurrence basis through end-2028.",
    desc: "The largest cyber cat bond to date — $300M across three classes (spreads 7.0% Class A to 10.5% Class C) covering systemic cyber events for Beazley (Jan 2026).",
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

// 30-pt premium yield history per vault
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

function genHist(mean, seed, vol) {
  return Array.from({ length: 30 }, (_, i) =>
    +(mean + Math.sin(i * 1.7 + seed) * vol + Math.cos(i * 0.43 + seed) * vol * 0.7).toFixed(2));
}
RF_VAULTS.forEach((v, i) => { if (!v.placed && v.tvl < v.capacity) v.fillHistory = genFillHistory(i + 1, v.tvl, 30); v.priceHistory = genPriceHistory(i + 1, (v.pricePerToken || v.price) * 100, { vol: v.status === 'subscribing' ? 0 : 0.18, drift: v.category === 'natcat' ? 0.03 : 0.015 }); v.apyHistory = genHist(v.apy, i + 2, v.status === "active" ? 0.35 : 0.05); });

const VAULT = RF_VAULTS[0];
const VAULT_APY_HISTORY = VAULT.apyHistory;

// Investor positions across vaults (calm-phase values)
const RF_POSITIONS = [
  { vaultId: "VLT-SLCIR-A", deposited: 25_000, value: 25_874, premium: 874, tokens: 24_248, depositedAt: "2026-06-18" },
  { vaultId: "VLT-NAT-001", deposited: 12_000, value: 12_310, premium: 310, tokens: 11_846, depositedAt: "2026-05-28" },
  { vaultId: "VLT-SLCIR-D", deposited: 5_000, value: 5_000, premium: 0, tokens: 5_000, depositedAt: "2026-08-04" },
];

// Orderbook + trades generated around a vault's token price
function makeBook(px) {
  const sizes = [24_000, 52_400, 88_200, 124_800, 41_000, 67_500, 31_200];
  let bd = 0, ad = 0;
  const bids = sizes.map((s, i) => { bd += s; return { price: +(px * (1 - 0.0007 * (i + 1))).toFixed(4), size: s, depth: bd }; });
  const asks = sizes.slice().reverse().map((s, i) => { ad += s; return { price: +(px * (1 + 0.0007 * (i + 1))).toFixed(4), size: s, depth: ad }; });
  return { bids, asks };
}
function makeTrades(px) {
  const rows = [
    ["buy", 1.0002, 4_200, "12:38:14"], ["buy", 1.0000, 1_800, "12:37:42"],
    ["sell", 0.9996, 12_400, "12:36:11"], ["buy", 1.0001, 7_400, "12:34:55"],
    ["buy", 1.0003, 2_100, "12:33:28"], ["sell", 0.9997, 9_800, "12:32:04"],
    ["sell", 0.9996, 3_200, "12:30:47"], ["buy", 1.0002, 14_800, "12:29:11"],
  ];
  return rows.map(([side, m, size, time]) => ({ side, price: +(px * m).toFixed(4), size, time }));
}

// Historical trigger evaluations (claims screen)
const EVAL_HISTORY = [
  { date: "2026-07-12", event: "Dry-run #3 — synthetic Tier 1 cyclone, east coast", outcome: "Rehearsal passed", payout: 0, time: "26h end-to-end" },
  { date: "2026-06-28", event: "Dry-run #2 — Cyclone Ditwah replay (flood parameter)", outcome: "Tier 2 reproduced", payout: 0, time: "T+0 settle" },
  { date: "2026-06-21", event: "SW-monsoon burst — rain index peaked 41", outcome: "Below threshold", payout: 0, time: "auto-evaluated" },
  { date: "2026-06-20", event: "Dry-run #1 — issuance & settlement rehearsal", outcome: "Rehearsal passed", payout: 0, time: "T+0 settle" },
  { date: "2025-11-27", event: "Cyclone Ditwah backtest — 55% of consumers dark, ~4,000 towers offline, PDNA outages up to 14d", outcome: "Tier 2 via flood parameter (modelled)", payout: 14_000_000, time: "T+38h modelled" },
];
const EVAL_VIDURA = { date: "2026-12-05", event: "TC Vidura — 96 kt landfall + rain index 82", outcome: "Tier 2 met — 70% payout", payout: 14_000_000, time: "T+38h funds out" };

// Connected wallet (demo) + vault position per phase
const WALLET = { addr: "0x4b91…f10d", balance: 84_500 };
const VAULT_POSITION = {
  calm:   { deposited: 25_000, tokens: 24_248, value: 25_874, premium: 874, par: 100.0 },
  event:  { deposited: 25_000, tokens: 24_248, value: 25_874, premium: 874, par: 100.0, frozen: true },
  payout: { deposited: 25_000, tokens: 24_248, value: 7_400, premium: 874, par: 28.6, reduced: true },
};

// Parametric trigger — dual parameter, graduated tiers
const TRIGGER = {
  windParam: "1-min sustained wind within parametric box (JTWC/IMD blended)",
  rainParam: "72h rainfall + flood-extent index (GPM IMERG · Sentinel-1 SAR)",
  window: "Event window: 14 days from advisory declaring system inside box",
  tiers: [
    { tier: 1, wind: 64, rain: 60, payoutPct: 40, payout: 8_000_000 },
    { tier: 2, wind: 85, rain: 75, payoutPct: 70, payout: 14_000_000 },
    { tier: 3, wind: 100, rain: 90, payoutPct: 100, payout: 20_000_000 },
  ],
  logic: "Tier attained when EITHER parameter meets its threshold with corroborating secondary evidence; highest tier reached during event window applies.",
};

// ---- Phase-dependent state -------------------------------------------------
// calm  — baseline monitoring (live)
// event — TC Vidura inside parametric box, trigger monitoring (simulation)
// payout — trigger confirmed, controlled disbursement in progress (simulation)

const PHASES = [
  { id: "calm", label: "Baseline" },
  { id: "event", label: "Event" },
  { id: "payout", label: "Payout" },
];

const PHASE_META = {
  calm: {
    chip: "Monitoring",
    chipClass: "live",
    banner: null,
    clock: "2026-07-17 · 14:32 IST",
    tag: "Live monitoring",
  },
  event: {
    chip: "Trigger Watch",
    chipClass: "warn",
    banner: "TC VIDURA inside parametric box — sustained winds 88 kt and rising. Tier 2 threshold breached; corroboration window open. Governance board convened.",
    clock: "2026-12-04 · 06:10 IST",
    tag: "Simulated event · TC Vidura",
  },
  payout: {
    chip: "Payout Active",
    chipClass: "danger",
    banner: "Trigger confirmed at Tier 2 — USD 14.0M payout authorised. Controlled disbursement in progress across 5 pre-agreed purposes.",
    clock: "2026-12-07 · 11:45 IST",
    tag: "Simulated event · T+38h from confirmation",
  },
};

// Live trigger readings per phase
const TRIGGER_STATE = {
  calm:   { wind: 14, rain: 21, tierMet: 0, windPeak: 14, rainPeak: 24, status: "No qualifying event", statusClass: "live" },
  event:  { wind: 88, rain: 78, tierMet: 2, windPeak: 88, rainPeak: 78, status: "Tier 2 breached — corroborating", statusClass: "warn" },
  payout: { wind: 42, rain: 81, tierMet: 2, windPeak: 96, rainPeak: 82, status: "Tier 2 confirmed — payout authorised", statusClass: "danger" },
};

// AI / EO / telemetry signals per phase — { calm, event, payout } values
const SIGNALS = [
  { id: "SIG-TRACK", group: "Hazard & Earth observation", name: "Storm system in basin", source: "JTWC · IMD", unit: "",
    calm: { v: "None", trend: "flat", note: "Bay of Bengal quiet · outlook 7d clear" },
    event: { v: "TC VIDURA", trend: "up", note: "Cat 2 eq. · 88 kt · moving W at 9 kt", alert: true },
    payout: { v: "TC VIDURA", trend: "down", note: "Downgraded post-landfall · exiting box", alert: true } },
  { id: "SIG-WIND", group: "Hazard & Earth observation", name: "Max sustained wind in box", source: "JTWC/IMD blended", unit: "kt",
    calm: { v: 14, trend: "flat", note: "Seasonal baseline" },
    event: { v: 88, trend: "up", note: "Tier 2 (85 kt) breached 04:52 IST", alert: true },
    payout: { v: 42, trend: "down", note: "Peak 96 kt at landfall · Batticaloa" } },
  { id: "SIG-RAIN", group: "Hazard & Earth observation", name: "72h rainfall index", source: "GPM IMERG", unit: "/100",
    calm: { v: 21, trend: "flat", note: "SW monsoon normal range" },
    event: { v: 78, trend: "up", note: "Tier 2 (75) breached · Eastern province", alert: true },
    payout: { v: 81, trend: "down", note: "Peaked 82 · receding" } },
  { id: "SIG-FLOOD", group: "Hazard & Earth observation", name: "Flood extent — monitored districts", source: "Sentinel-1 SAR · AI segmentation", unit: "%",
    calm: { v: 0.4, trend: "flat", note: "Riverine baseline" },
    event: { v: 4.1, trend: "up", note: "Batticaloa · Ampara · Trincomalee", alert: true },
    payout: { v: 6.8, trend: "up", note: "Peak extent · 214k people in affected zone", alert: true } },
  { id: "SIG-CELL", group: "Operator telemetry — Serendib Telecom", name: "Cell site availability", source: "NMS feed · 4,212 sites", unit: "%",
    calm: { v: 99.2, trend: "flat", note: "34 sites on planned maintenance" },
    event: { v: 71.4, trend: "down", note: "1,204 sites down · Eastern & Uva", alert: true },
    payout: { v: 86.9, trend: "up", note: "Restoration crews active · +652 sites 24h" } },
  { id: "SIG-BKHL", group: "Operator telemetry — Serendib Telecom", name: "Fibre & backhaul alarms", source: "NMS · OTDR", unit: "active",
    calm: { v: 12, trend: "flat", note: "Routine faults" },
    event: { v: 847, trend: "up", note: "11 backbone cuts · coastal & hill routes", alert: true },
    payout: { v: 391, trend: "down", note: "Backbone restored · distribution ongoing" } },
  { id: "SIG-BKUP", group: "Operator telemetry — Serendib Telecom", name: "Sites on backup power", source: "Tower-co telemetry · fuel sensors", unit: "sites",
    calm: { v: 38, trend: "flat", note: "Median fuel autonomy 52h" },
    event: { v: 1512, trend: "up", note: "Median fuel autonomy 31h — resupply critical", alert: true },
    payout: { v: 640, trend: "down", note: "Fuel convoys prioritised · grid returning" } },
  { id: "SIG-FEED", group: "Operator telemetry — Lanka Grid Energy", name: "Distribution feeders out", source: "SCADA · OMS", unit: "of 1,940",
    calm: { v: 3, trend: "flat", note: "Planned works" },
    event: { v: 412, trend: "up", note: "21% of network · east coast", alert: true },
    payout: { v: 168, trend: "down", note: "Priority circuits re-energised" } },
  { id: "SIG-SUBS", group: "Operator telemetry — Lanka Grid Energy", name: "Grid substations degraded", source: "SCADA · 61 substations", unit: "",
    calm: { v: 0, trend: "flat", note: "All nominal" },
    event: { v: 9, trend: "up", note: "2 flooded · 7 on partial load", alert: true },
    payout: { v: 4, trend: "down", note: "Kalmunai & Valaichchenai still flooded" } },
  { id: "SIG-CRIT", group: "Critical facilities", name: "Hospitals on backup power", source: "Facility registry · operator feeds", unit: "of 34",
    calm: { v: 0, trend: "flat", note: "All on grid supply" },
    event: { v: 19, trend: "up", note: "Fuel autonomy 31–72h", alert: true },
    payout: { v: 7, trend: "down", note: "27 re-energised under priority protocol" } },
  { id: "SIG-POP", group: "Critical facilities", name: "People in service-loss zone", source: "AI estimate · EO + telemetry + census", unit: "",
    calm: { v: "—", trend: "flat", note: "No active event" },
    event: { v: "1.9M", trend: "up", note: "Connectivity or power loss ≥ 4h", alert: true },
    payout: { v: "0.7M", trend: "down", note: "Restoration tracking against commitments" } },
];

// AI assessment narrative per phase
const AI_ASSESSMENT = {
  calm: {
    headline: "No qualifying event. All systems nominal.",
    body: "Model watch on Bay of Bengal genesis conditions — 7-day cyclogenesis probability 4%. Exposure and vulnerability layers refreshed weekly from EO and operator records; basis-risk estimate stable at 6.8%. Next scheduled model validation: Aug 2026.",
    confidence: 97,
  },
  event: {
    headline: "TC Vidura — Tier 2 wind threshold breached. Estimated 1.9M people in service-loss zone.",
    body: "AI fusion of JTWC/IMD track, GPM rainfall, Sentinel-1 flood segmentation and live operator telemetry estimates 1,204 cell sites down and 412 feeders out, concentrated in Batticaloa, Ampara and Trincomalee. Tower outages are driven mainly by grid failure and generator-fuel depletion — connectivity recovery is coupled to feeder re-energisation. Landfall projected 09:40 IST near Batticaloa. Trigger calculation and payout authorisation remain with the calculation agent and governance board.",
    confidence: 88,
  },
  payout: {
    headline: "Post-event assessment: Tier 2 event confirmed. Restoration tracking active.",
    body: "Peak intensity 96 kt at landfall; 72h rainfall index peaked at 82. Impact analysis maps service disruption to 2.1M people at peak. Restoration progressing ahead of baseline plan: cell availability +15.5 pts in 48h; 27 of 34 hospitals re-energised. All figures feed the public-benefit measurement framework and post-event model refinement.",
    confidence: 94,
  },
};

// Governance / trigger workflow steps per phase
const WORKFLOW = {
  calm: [
    { step: "Event detection & situational assessment", who: "AI monitoring layer", status: "Standing" },
    { step: "Parametric calculation", who: "Independent calculation agent", status: "Standing" },
    { step: "Trigger confirmation", who: "Calculation agent · per bond terms", status: "Idle" },
    { step: "Payout authorisation", who: "Facility Governance Board", status: "Idle" },
    { step: "Controlled disbursement", who: "Digital settlement layer", status: "Idle" },
  ],
  event: [
    { step: "Event detection & situational assessment", who: "AI monitoring layer", status: "Active" },
    { step: "Parametric calculation", who: "Independent calculation agent", status: "Active" },
    { step: "Trigger confirmation", who: "Calculation agent · per bond terms", status: "Pending" },
    { step: "Payout authorisation", who: "Facility Governance Board", status: "Convened" },
    { step: "Controlled disbursement", who: "Digital settlement layer", status: "Armed" },
  ],
  payout: [
    { step: "Event detection & situational assessment", who: "AI monitoring layer", status: "Done" },
    { step: "Parametric calculation", who: "Independent calculation agent", status: "Done" },
    { step: "Trigger confirmation", who: "Calculation agent · per bond terms", status: "Done" },
    { step: "Payout authorisation", who: "Facility Governance Board", status: "Done" },
    { step: "Controlled disbursement", who: "Digital settlement layer", status: "Active" },
  ],
};

// Pre-agreed disbursement purposes (payout = USD 14M at Tier 2)
const DISBURSEMENTS = [
  {
    id: "DSB-01", purpose: "Emergency response & network restoration", operator: "Serendib Telecom",
    amount: 3_900_000, released: 2_340_000,
    items: "Cells-on-wheels ×46 · shared backup-power systems ×400 · generator fuel logistics · splice crews",
    milestones: [
      { m: "Emergency mobilisation (24h)", status: "Verified" },
      { m: "Backbone fibre restored — 11 cuts", status: "Verified" },
      { m: "≥90% site availability (21d)", status: "In progress" },
    ],
  },
  {
    id: "DSB-02", purpose: "Grid emergency response & restoration", operator: "Lanka Grid Energy",
    amount: 5_100_000, released: 2_805_000,
    items: "Line crews ×38 · mobile transformers ×6 · substation dewatering · fuel & road-access coordination",
    milestones: [
      { m: "Emergency mobilisation (24h)", status: "Verified" },
      { m: "Substations de-flooded & safe", status: "In progress" },
      { m: "≥95% feeders re-energised (28d)", status: "Pending" },
    ],
  },
  {
    id: "DSB-03", purpose: "Zero-rated connectivity — affected customers", operator: "Serendib Telecom",
    amount: 1_400_000, released: 700_000,
    items: "90 days free voice/data for 1.2M subscribers in declared districts",
    milestones: [
      { m: "Zero-rating activated (48h)", status: "Verified" },
      { m: "Monthly usage attestation", status: "In progress" },
    ],
  },
  {
    id: "DSB-04", purpose: "Priority restoration — critical facilities", operator: "Joint · both operators",
    amount: 2_200_000, released: 1_540_000,
    items: "34 hospitals · 61 shelters · 12 water plants — power & connectivity restoration ahead of general queue",
    milestones: [
      { m: "Hospitals re-energised (72h)", status: "Verified" },
      { m: "Shelters connected (7d)", status: "In progress" },
      { m: "Water plants restored (10d)", status: "In progress" },
    ],
  },
  {
    id: "DSB-05", purpose: "Temporary capacity — isolated communities", operator: "Joint · both operators",
    amount: 1_400_000, released: 560_000,
    items: "Satellite backhaul ×22 sites (pre-contracted) · mobile generation 8 MW · community charging & Wi-Fi points",
    milestones: [
      { m: "Satellite links live (96h)", status: "Verified" },
      { m: "Mobile generation deployed", status: "In progress" },
    ],
  },
];

// Settlement ledger records (payout phase)
const LEDGER = [
  { t: "2026-12-05 09:12", type: "AUTHORISATION", ref: "GOV-2026-0007", detail: "Governance board authorises Tier 2 payout USD 14,000,000 — resolution recorded on ledger", amt: null },
  { t: "2026-12-05 09:14", type: "TRANCHE DRAW", ref: "0x8c41…e2b7", detail: "First-loss layer cSLCIR-F drawn in full", amt: 4_000_000 },
  { t: "2026-12-05 09:14", type: "TRANCHE DRAW", ref: "0x8c41…e2b9", detail: "Class A notes tSLCIR-A principal reduction 71.4%", amt: 10_000_000 },
  { t: "2026-12-05 09:21", type: "TRANSFER", ref: "0x3fa2…77c1", detail: "SPV → Serendib Telecom restoration escrow (DSB-01)", amt: 1_950_000 },
  { t: "2026-12-05 09:21", type: "TRANSFER", ref: "0x3fa2…77c4", detail: "SPV → Lanka Grid Energy restoration escrow (DSB-02)", amt: 2_550_000 },
  { t: "2026-12-05 10:02", type: "TRANSFER", ref: "0x91d8…04ee", detail: "SPV → joint critical-facilities escrow (DSB-04)", amt: 1_540_000 },
  { t: "2026-12-06 08:40", type: "MILESTONE", ref: "VER-118", detail: "Hospitals re-energised (72h) — verified by monitoring agent · releases DSB-04 stage 2", amt: null },
  { t: "2026-12-06 08:41", type: "TRANSFER", ref: "0xa27b…c settlement", detail: "Zero-rating activation tranche → Serendib Telecom (DSB-03)", amt: 700_000 },
  { t: "2026-12-07 07:15", type: "TRANSFER", ref: "0x5e19…8d02", detail: "Second-stage release — grid restoration (DSB-02)", amt: 255_000 },
  { t: "2026-12-07 11:02", type: "REPORT", ref: "RPT-D1-004", detail: "T+48h traceability report published to all participants — 100% of flows reconciled", amt: null },
];

// Participants — investors & contributors
const PARTICIPANTS = [
  { name: "Meridian ILS Partners", type: "ILS fund", tranche: "NOTE-A", amount: 4_000_000, newTo: null },
  { name: "Alpenrose Re", type: "Reinsurer", tranche: "NOTE-A", amount: 3_000_000, newTo: null },
  { name: "Cinnamon Capital (SG)", type: "Family office", tranche: "NOTE-A", amount: 1_750_000, newTo: "ILS" },
  { name: "Batavia Sovereign Partners", type: "Asset manager", tranche: "NOTE-A", amount: 2_250_000, newTo: "ILS" },
  { name: "Harbourlight Foundation", type: "Foundation", tranche: "GRANT-F", amount: 1_500_000, newTo: null },
  { name: "Global Resilience Fund", type: "Donor pool", tranche: "GRANT-F", amount: 1_200_000, newTo: null },
  { name: "Digital-asset philanthropy pool", type: "Crypto philanthropy", tranche: "GRANT-F", amount: 900_000, newTo: "DRF" },
  { name: "Ceylon Diaspora Collective", type: "Diaspora giving", tranche: "FUND-P", amount: 620_000, newTo: "DRF" },
  { name: "Nordic Development Facility", type: "Bilateral donor", tranche: "FUND-P", amount: 1_100_000, newTo: null },
];

// Results measurement framework (PDF section 2) — per phase where relevant
const RESULTS = [
  {
    code: "A", title: "Protection Quality & Resilience Outcomes",
    metrics: [
      { id: "A1", name: "Better-calibrated protection", val: "6.8%", sub: "estimated basis risk · independent model validation passed", benchmark: "vs 15–25% typical parametric" },
      { id: "A2", name: "Faster post-event funding", val: "38h", sub: "trigger confirmation → funds available", benchmark: "vs 6–18 months indemnity claims" },
      { id: "A3", name: "Continuity of essential services", val: "27/34", sub: "hospitals re-energised in 72h · 1.2M zero-rated subscribers", benchmark: "priority protocol vs general queue" },
    ],
  },
  {
    code: "B", title: "Transaction Economics & Efficiency",
    metrics: [
      { id: "B1", name: "Lower transaction & lifecycle cost", val: "−41%", sub: "issuance + admin vs conventional cat bond benchmark", benchmark: "USD 386k saved on USD 20M cover" },
      { id: "B2", name: "Faster, reusable processes", val: "11 wks", sub: "structure → issuance · 87% components reusable at renewal", benchmark: "vs 26+ weeks conventional" },
    ],
  },
  {
    code: "C", title: "Capital Mobilisation",
    metrics: [
      { id: "C1", name: "Philanthropic & concessional participation", val: "USD 5.3M", sub: "23 contributors · 8 new to disaster-risk financing", benchmark: "first-loss + commitments fund" },
      { id: "C2", name: "Investor risk capacity", val: "USD 12.3M", sub: "22 investors · 9 new to ILS · fully collateralised", benchmark: "avg ticket USD 557k — below ILS norm" },
    ],
  },
  {
    code: "D", title: "Results Measurement & Reporting",
    metrics: [
      { id: "D1", name: "Complete, auditable reporting", val: "100%", sub: "payout flows traceable end-to-end · T+48h participant reporting", benchmark: "every authorisation & transfer on ledger" },
    ],
  },
];

// Commitments performance (payout phase)
const COMMITMENTS_PERF = [
  { c: "Zero-rated connectivity — declared districts", target: "Activate ≤48h · 90 days", actual: "Activated 31h · 1.2M subscribers", status: "On track" },
  { c: "Priority restoration — hospitals", target: "Re-energise ≤72h", actual: "27 of 34 within 72h · 7 in progress", status: "On track" },
  { c: "Priority restoration — shelters & water plants", target: "≤7–10 days", actual: "44 of 61 shelters connected", status: "In progress" },
  { c: "Temporary capacity — isolated communities", target: "Satellite links ≤96h", actual: "22 of 22 links live at 89h", status: "Met" },
  { c: "Restoration beyond baseline", target: "≥90% cell availability in 21d", actual: "86.9% at day 3 · ahead of plan", status: "On track" },
  { c: "Long-tail restoration — worst-served districts", target: "Last 5% restored ≤ 14 days", actual: "Estate highlands fully restored day 12", status: "Met" },
  { c: "Displacement shelters — sustained power", target: "Monitored supply for 6 months", actual: "61 of 61 shelters on monitored supply", status: "On track" },
];

// Activity feed per phase
const FEED = {
  calm: [
    { type: "signal", time: "22m ago", text: "Weekly exposure refresh — Sentinel-2 composite ingested; 118 new telecom assets registered." },
    { type: "capital", time: "3h ago", text: "Contribution settled — USD 250,000 to Preparedness Fund (cSLCIR-P) from Ceylon Diaspora Collective." },
    { type: "capital", time: "1d ago", text: "Class A subscription — USD 750,000 from Batavia Sovereign Partners. T+0 settlement." },
    { type: "model", time: "2d ago", text: "Quarterly basis-risk review — estimate revised 7.1% → 6.8% after telemetry back-testing." },
    { type: "drill", time: "5d ago", text: "Dry-run #3 complete — synthetic Tier 1 event; trigger-to-authorisation 26h (target ≤48h)." },
    { type: "report", time: "12d ago", text: "Monthly participant report published — coverage, signals, capital, governance minutes." },
  ],
  event: [
    { type: "alert", time: "4m ago", text: "Wind 88 kt sustained — Tier 2 threshold breached. Corroboration protocol running (rainfall index 78)." },
    { type: "gov", time: "18m ago", text: "Governance board convened — quorum confirmed (ADB, GoSL, operators, calc agent observer)." },
    { type: "signal", time: "42m ago", text: "AI situational estimate: 1.9M people in service-loss zone; 1,204 cell sites down; 412 feeders out." },
    { type: "ops", time: "1h ago", text: "Serendib Telecom activates emergency operations centre — pre-positioned COW fleet moving east." },
    { type: "signal", time: "2h ago", text: "TC Vidura entered parametric box 04:02 IST — 14-day event window opened." },
    { type: "capital", time: "6h ago", text: "Class A notes flagged trigger-watch on secondary transfer registry — transfers suspended per terms." },
  ],
  payout: [
    { type: "settle", time: "9m ago", text: "Second-stage release USD 255,000 → Lanka Grid restoration escrow. Milestone VER-121 verified." },
    { type: "report", time: "43m ago", text: "T+48h traceability report published — 100% of authorised flows reconciled on ledger." },
    { type: "ops", time: "2h ago", text: "27 of 34 hospitals re-energised under priority protocol — commitment A3 on track." },
    { type: "settle", time: "1d ago", text: "Zero-rating activation tranche USD 700,000 released — 1.2M subscribers zero-rated at 31h." },
    { type: "gov", time: "2d ago", text: "Payout authorised — Tier 2, USD 14.0M. Resolution GOV-2026-0007 recorded on ledger." },
    { type: "alert", time: "2d ago", text: "Calculation agent confirms Tier 2 trigger — peak wind 96 kt, rainfall index 82. Report published." },
  ],
};

// Dry-run / historical calculation events (calm phase)
const DRY_RUNS = [
  { id: "DR-03", date: "2026-07-12", scenario: "Synthetic Tier 1 cyclone — east coast", result: "Trigger→authorisation 26h · settlement T+0 · all controls passed", status: "Passed" },
  { id: "DR-02", date: "2026-06-28", scenario: "Cyclone Ditwah replay (Nov 2025 · flood parameter)", result: "Tier 2 flood trigger reproduced · a wind-only design would have missed the event", status: "Passed" },
  { id: "DR-01", date: "2026-06-20", scenario: "Issuance & settlement rehearsal", result: "Subscription, eligibility controls, T+0 settlement verified", status: "Passed" },
];

// Parties & service providers + documents (vault detail)
const RF_PARTIES = [
  { mono: "RR", color: "#1c9b7c", name: "Resilience Re (SL) SPC", role: "Issuer · Segregated Cell" },
  { mono: "ADB", color: "#2563d6", name: "Asian Development Bank", role: "Anchor Sponsor" },
  { mono: "LC", color: "#b8821a", name: "Lionscraft", role: "Structuring & Technology" },
  { mono: "VA", color: "#7a4cc9", name: "Verita Analytics", role: "Independent Calculation Agent" },
  { mono: "CF", color: "#1c9b7c", name: "Cinnamon Fund Services", role: "Fund Administrator" },
  { mono: "HA", color: "#56688a", name: "Halcyon & Partners", role: "Auditor" },
  { mono: "HC", color: "#2563d6", name: "Harbour Chambers", role: "Legal Counsel" },
  { mono: "EO", color: "#b8821a", name: "NASA GPM · ESA Sentinel-1 · JTWC", role: "Hazard & EO Data" },
  { mono: "TW", color: "#7a4cc9", name: "Tower-co Telemetry · IODA", role: "Independent Outage Data" },
  { mono: "GB", color: "#0a1628", name: "Facility Governance Board", role: "Payout Authorisation" },
  { mono: "BMA", color: "#56688a", name: "Bermuda Monetary Authority", role: "Regulator" },
];
const RF_DOCS = [
  { name: "Private Placement Memorandum", meta: "PDF · 32 pages · Jun 2026" },
  { name: "Term Sheet & Trigger Mechanics Annex", meta: "PDF · 9 pages · Jun 2026" },
  { name: "Independent Model Validation Report", meta: "PDF · 18 pages · Jun 2026" },
  { name: "Subscription Agreement (allowlisted)", meta: "PDF · 12 pages · Jun 2026" },
  { name: "Cyclone Ditwah Backtest Note", meta: "PDF · 6 pages · Jul 2026" },
  { name: "Monthly Participant Report", meta: "PDF · latest · Jul 2026" },
];

const fmtUSD = (n) => n >= 1_000_000 ? "$" + (n / 1_000_000).toFixed(1) + "M" : n >= 1_000 ? "$" + (n / 1_000).toFixed(0) + "K" : "$" + n;
const fmtUSDExact = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtNum = (n, d = 0) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

Object.assign(window, {
  FACILITY, TRANCHES, OPERATORS, TRIGGER, PHASES, PHASE_META, TRIGGER_STATE,
  SIGNALS, AI_ASSESSMENT, WORKFLOW, DISBURSEMENTS, LEDGER, PARTICIPANTS,
  RESULTS, COMMITMENTS_PERF, FEED, DRY_RUNS, fmtUSD, fmtUSDExact, fmtNum, genPriceHistory, genFillHistory,
  POLICIES, POLICY_PIPELINE, VAULT, VAULT_APY_HISTORY, WALLET, VAULT_POSITION,
  RF_VAULTS, RF_POSITIONS, makeBook, makeTrades, EVAL_HISTORY, EVAL_VIDURA, genHist,
  RF_PARTIES, RF_DOCS,
});
