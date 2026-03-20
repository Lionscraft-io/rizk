import { parseUnits, keccak256, encodePacked } from "viem";

// ─── Market lifecycle target states ──────────────────────────────
export type MarketTarget = "open" | "live" | "matured" | "triggered";

export interface MarketConfig {
  name: string;
  target: MarketTarget;
  perilType: string;
  riskHolderName: string;
  riskHolderJurisdiction: string;
  riskHolderWalletIndex: number;  // Which derived wallet is the risk holder
  coverageTarget: bigint;         // In USDC (6 decimals)
  premiumRateBps: number;         // e.g. 1000 = 10%
  duration: number;               // In seconds
  commitmentWindow: number;       // In seconds
  minimumFillBps: number;         // e.g. 3000 = 30%
  commitmentBondBps: number;      // e.g. 100 = 1%
  regionHash: `0x${string}`;
  metadataURI: string;
  attachmentPoints: { threshold: bigint; slashBps: bigint }[];
  // For open markets: how much to partially fill (as fraction of target)
  partialFillPct?: number;        // e.g. 0.35 = 35%
  // For triggered markets: what severity to trigger at
  triggerSeverity?: bigint;
}

const USDC = (n: number) => parseUnits(n.toString(), 6);
const DAYS = (n: number) => n * 86400;
const HOURS = (n: number) => n * 3600;
const MINUTES = (n: number) => n * 60;

const region = (s: string) => keccak256(encodePacked(["string"], [s]));

// ─── 9 Markets ───────────────────────────────────────────────────

export const MARKETS: MarketConfig[] = [
  // ═══ OPEN MARKETS (real commitment windows — stay open for demo) ═══

  {
    name: "Hurricane Jamaica",
    target: "open",
    perilType: "HURRICANE",
    riskHolderName: "Government of Jamaica (Test)",
    riskHolderJurisdiction: "JM",
    riskHolderWalletIndex: 1,
    coverageTarget: USDC(1_000_000),
    premiumRateBps: 1000,  // 10%
    duration: DAYS(365),
    commitmentWindow: DAYS(6),
    minimumFillBps: 3000,  // 30%
    commitmentBondBps: 100,
    regionHash: region("18.1096,-77.2975,100km"),
    metadataURI: "ipfs://QmHurricaneJamaica",
    attachmentPoints: [
      { threshold: 119n, slashBps: 2500n },   // Cat 1: 25%
      { threshold: 178n, slashBps: 5000n },   // Cat 3: 50%
      { threshold: 252n, slashBps: 10000n },  // Cat 5: 100%
    ],
    partialFillPct: 0.35,
  },

  {
    name: "SEADRIF Flood",
    target: "open",
    perilType: "FLOOD",
    riskHolderName: "SEADRIF (Test)",
    riskHolderJurisdiction: "SG",
    riskHolderWalletIndex: 3,
    coverageTarget: USDC(3_000_000),
    premiumRateBps: 900,  // 9%
    duration: DAYS(540),  // 18 months
    commitmentWindow: DAYS(12),
    minimumFillBps: 2500,  // 25%
    commitmentBondBps: 100,
    regionHash: region("14.0583,108.2772,500km"),
    metadataURI: "ipfs://QmSEADRIF",
    attachmentPoints: [
      { threshold: 3n, slashBps: 2500n },     // 3m: 25%
      { threshold: 5n, slashBps: 5000n },     // 5m: 50%
      { threshold: 8n, slashBps: 10000n },    // 8m: 100%
    ],
    partialFillPct: 0.24,
  },

  {
    name: "Kizuna III Japan Earthquake",
    target: "open",
    perilType: "EARTHQUAKE",
    riskHolderName: "Tokio Marine (Test)",
    riskHolderJurisdiction: "JP",
    riskHolderWalletIndex: 2,
    coverageTarget: USDC(8_000_000),
    premiumRateBps: 650,  // 6.5%
    duration: DAYS(1825), // 5 years
    commitmentWindow: DAYS(21),
    minimumFillBps: 2500,  // 25%
    commitmentBondBps: 100,
    regionHash: region("35.6762,139.6503,300km"),
    metadataURI: "ipfs://QmKizunaIII",
    attachmentPoints: [
      { threshold: 60n, slashBps: 2500n },    // 6.0: 25%
      { threshold: 70n, slashBps: 5000n },    // 7.0: 50%
      { threshold: 80n, slashBps: 10000n },   // 8.0+: 100%
    ],
    partialFillPct: 0.30,
  },

  // ═══ LIVE MARKETS (short commitment windows — fill fast, then lock) ═══

  {
    name: "Mexico Earthquake",
    target: "live",
    perilType: "EARTHQUAKE",
    riskHolderName: "Government of Mexico (Test)",
    riskHolderJurisdiction: "MX",
    riskHolderWalletIndex: 1,
    coverageTarget: USDC(5_000_000),
    premiumRateBps: 1200,  // 12%
    duration: DAYS(730),   // 2 years
    commitmentWindow: MINUTES(30),
    minimumFillBps: 3000,
    commitmentBondBps: 100,
    regionHash: region("19.4326,-99.1332,200km"),
    metadataURI: "ipfs://QmMexicoEarthquake",
    attachmentPoints: [
      { threshold: 60n, slashBps: 2500n },
      { threshold: 70n, slashBps: 5000n },
      { threshold: 80n, slashBps: 10000n },
    ],
  },

  {
    name: "Cyber Catastrophe",
    target: "live",
    perilType: "CYBER",
    riskHolderName: "Beazley plc (Test)",
    riskHolderJurisdiction: "GB",
    riskHolderWalletIndex: 2,
    coverageTarget: USDC(5_000_000),
    premiumRateBps: 1400,  // 14%
    duration: DAYS(730),   // 2 years
    commitmentWindow: MINUTES(30),
    minimumFillBps: 2000,
    commitmentBondBps: 100,
    regionHash: region("global-cyber"),
    metadataURI: "ipfs://QmCyberCatastrophe",
    attachmentPoints: [
      { threshold: 5n, slashBps: 2500n },     // $5B aggregate: 25%
      { threshold: 15n, slashBps: 5000n },    // $15B: 50%
      { threshold: 30n, slashBps: 10000n },   // $30B: 100%
    ],
  },

  {
    name: "UK Terrorism",
    target: "live",
    perilType: "TERRORISM",
    riskHolderName: "Pool Re (Test)",
    riskHolderJurisdiction: "GB",
    riskHolderWalletIndex: 3,
    coverageTarget: USDC(6_000_000),
    premiumRateBps: 500,  // 5%
    duration: DAYS(730),  // 2 years
    commitmentWindow: MINUTES(30),
    minimumFillBps: 2000,
    commitmentBondBps: 100,
    regionHash: region("51.5074,-0.1278,uk"),
    metadataURI: "ipfs://QmUKTerrorism",
    attachmentPoints: [
      { threshold: 1n, slashBps: 2500n },     // Conventional: 25%
      { threshold: 2n, slashBps: 5000n },     // Major: 50%
      { threshold: 3n, slashBps: 10000n },    // CBRN: 100%
    ],
  },

  // ═══ MATURED MARKETS (short windows + short durations) ═══

  {
    name: "Bangladesh Flood",
    target: "matured",
    perilType: "FLOOD",
    riskHolderName: "Bangladesh Delta Commission (Test)",
    riskHolderJurisdiction: "BD",
    riskHolderWalletIndex: 1,
    coverageTarget: USDC(2_500_000),
    premiumRateBps: 800,  // 8%
    duration: MINUTES(30),  // Short for testing
    commitmentWindow: MINUTES(15),
    minimumFillBps: 2500,
    commitmentBondBps: 100,
    regionHash: region("23.6850,90.3563,200km"),
    metadataURI: "ipfs://QmBangladeshFlood",
    attachmentPoints: [
      { threshold: 3n, slashBps: 2500n },
      { threshold: 5n, slashBps: 5000n },
      { threshold: 8n, slashBps: 10000n },
    ],
  },

  {
    name: "Lottery Jackpot",
    target: "matured",
    perilType: "LOTTERY",
    riskHolderName: "MyLotto24 (Test)",
    riskHolderJurisdiction: "DE",
    riskHolderWalletIndex: 2,
    coverageTarget: USDC(2_000_000),
    premiumRateBps: 700,  // 7%
    duration: MINUTES(30),
    commitmentWindow: MINUTES(15),
    minimumFillBps: 2000,
    commitmentBondBps: 100,
    regionHash: region("52.5200,13.4050,europe"),
    metadataURI: "ipfs://QmLotteryJackpot",
    attachmentPoints: [
      { threshold: 60n, slashBps: 2500n },    // €60M: 25%
      { threshold: 85n, slashBps: 5000n },    // €85M: 50%
      { threshold: 110n, slashBps: 10000n },  // €110M: 100%
    ],
  },

  // ═══ TRIGGERED MARKET (short windows, oracle triggers before maturity) ═══

  {
    name: "Pandemic PEF",
    target: "triggered",
    perilType: "PANDEMIC",
    riskHolderName: "World Bank PEF (Test)",
    riskHolderJurisdiction: "US",
    riskHolderWalletIndex: 3,
    coverageTarget: USDC(4_000_000),
    premiumRateBps: 1100,  // 11%
    duration: HOURS(2),  // Short for testing
    commitmentWindow: MINUTES(15),
    minimumFillBps: 2000,
    commitmentBondBps: 100,
    regionHash: region("global-pandemic"),
    metadataURI: "ipfs://QmPandemicPEF",
    attachmentPoints: [
      { threshold: 1000n, slashBps: 2500n },    // 1000 deaths: 25%
      { threshold: 10000n, slashBps: 5000n },   // 10K deaths: 50%
      { threshold: 100000n, slashBps: 10000n }, // 100K deaths: 100%
    ],
    triggerSeverity: 50000n,  // Between tier 2 and 3 → ~58% slash (tier 2 = 50%)
  },
];
