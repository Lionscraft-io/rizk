/**
 * RIZK Testnet Seeder
 *
 * Seeds Sepolia with 9 markets in various lifecycle states:
 *   - 3 Open (accepting commitment, real multi-day windows)
 *   - 3 Live (fully funded, active trading on order book)
 *   - 2 Matured (completed without trigger, redeemable)
 *   - 1 Triggered (oracle fired, partial payout to risk holder)
 *
 * Usage:
 *   cp .env.example .env   # fill in MNEMONIC + RPC
 *   npm install
 *   npm run seed            # runs all phases sequentially
 *
 * The script uses wallet[0] as the admin/deployer (must have SepoliaETH),
 * wallets[1-3] as risk holders, and wallets[4-13] as investors.
 */

import "dotenv/config";
import {
  createPublicClient,
  createWalletClient,
  http,
  formatEther,
  parseEther,
  parseUnits,
  type Address,
  type WalletClient,
  type PublicClient,
  type Chain,
  type Account,
} from "viem";
import { mnemonicToAccount, HDAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import {
  MockUSDC_ABI,
  RizkRegistry_ABI,
  MarketFactory_ABI,
  MarketRegistry_ABI,
  CommitmentManager_ABI,
  OrderBook_ABI,
  MockOracle_ABI,
  CatbondToken_ABI,
  VaultWrapper_ABI,
} from "./abis.js";
import { MARKETS, type MarketConfig } from "./markets.js";

// ─── Protocol addresses (from deployment) ────────────────────────
const PROTOCOL = {
  MockUSDC: "0x7C6cdaf275C75c699a977F79657F8c0B6e51104C" as Address,
  RizkRegistry: "0x006A5062aE57aEFCf28360bC26E369d51912ed50" as Address,
  MarketRegistry: "0x420ef027A33FA5528C36AE7E878B02b449154C30" as Address,
  MockOracle: "0xbe96710F1Cf451d9aa39A653C401d34bA60bA98B" as Address,
  MarketFactory: "0xfEE4f8151A47Efb9a2FCDcdD3F2C028A1014319c" as Address,
};

// ─── Config ──────────────────────────────────────────────────────
const NUM_INVESTORS = 10;
const ETH_PER_WALLET = parseEther("0.15");      // Gas funding per wallet
const USDC_PER_INVESTOR = parseUnits("2000000", 6); // 2M catUSD each

// ─── Helpers ─────────────────────────────────────────────────────
function log(phase: string, msg: string) {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] [${phase}] ${msg}`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForTimestamp(publicClient: PublicClient, targetTimestamp: number, label: string) {
  while (true) {
    const block = await publicClient.getBlock();
    const now = Number(block.timestamp);
    const remaining = targetTimestamp - now;
    if (remaining <= 0) {
      log("WAIT", `${label} — timestamp reached`);
      return;
    }
    const mins = Math.ceil(remaining / 60);
    log("WAIT", `${label} — ${mins}m remaining (block: ${now}, target: ${targetTimestamp})`);
    await sleep(Math.min(remaining * 1000, 30_000)); // Poll every 30s max
  }
}

// ─── Wallet Setup ────────────────────────────────────────────────
function deriveWallets(mnemonic: string, count: number) {
  const accounts: HDAccount[] = [];
  for (let i = 0; i < count; i++) {
    accounts.push(mnemonicToAccount(mnemonic, { addressIndex: i }));
  }
  return accounts;
}

function makeWalletClient(account: HDAccount, rpcUrl: string): WalletClient {
  return createWalletClient({
    account,
    chain: sepolia,
    transport: http(rpcUrl),
  });
}

// ─── Transaction helper with retry ──────────────────────────────
async function tx(
  walletClient: WalletClient,
  publicClient: PublicClient,
  params: {
    address: Address;
    abi: readonly any[];
    functionName: string;
    args?: any[];
    account: Account;
  },
  label: string
): Promise<any> {
  try {
    const { request } = await publicClient.simulateContract(params);
    const hash = await walletClient.writeContract(request);
    const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
    if (receipt.status === "reverted") {
      throw new Error(`Transaction reverted: ${hash}`);
    }
    log("TX", `${label} — ${hash.slice(0, 10)}...`);
    return receipt;
  } catch (e: any) {
    log("TX", `FAILED: ${label} — ${e.message?.slice(0, 120)}`);
    throw e;
  }
}

// ═════════════════════════════════════════════════════════════════
// PHASE 0: Setup wallets and fund them
// ═════════════════════════════════════════════════════════════════
async function phase0(
  accounts: HDAccount[],
  walletClients: WalletClient[],
  publicClient: PublicClient
) {
  log("PHASE 0", "Setting up wallets and funding...");

  const admin = accounts[0];
  const adminClient = walletClients[0];
  const adminBalance = await publicClient.getBalance({ address: admin.address });
  log("PHASE 0", `Admin wallet: ${admin.address} (${formatEther(adminBalance)} ETH)`);

  if (adminBalance < parseEther("1")) {
    throw new Error("Admin wallet needs at least 1 Sepolia ETH");
  }

  // Fund all other wallets with ETH for gas
  for (let i = 1; i < accounts.length; i++) {
    const balance = await publicClient.getBalance({ address: accounts[i].address });
    if (balance < ETH_PER_WALLET / 2n) {
      const hash = await adminClient.sendTransaction({
        to: accounts[i].address,
        value: ETH_PER_WALLET,
        account: admin,
        chain: sepolia,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      log("PHASE 0", `Funded wallet[${i}] ${accounts[i].address.slice(0, 8)}... with ${formatEther(ETH_PER_WALLET)} ETH`);
    } else {
      log("PHASE 0", `Wallet[${i}] already funded (${formatEther(balance)} ETH)`);
    }
  }

  // Mint catUSD to all wallets
  for (let i = 0; i < accounts.length; i++) {
    const balance = await publicClient.readContract({
      address: PROTOCOL.MockUSDC,
      abi: MockUSDC_ABI,
      functionName: "balanceOf",
      args: [accounts[i].address],
    });

    if ((balance as bigint) < USDC_PER_INVESTOR / 2n) {
      await tx(walletClients[i], publicClient, {
        address: PROTOCOL.MockUSDC,
        abi: MockUSDC_ABI,
        functionName: "mint",
        args: [accounts[i].address, USDC_PER_INVESTOR],
        account: accounts[i],
      }, `Mint ${Number(USDC_PER_INVESTOR) / 1e6} catUSD to wallet[${i}]`);
    } else {
      log("PHASE 0", `Wallet[${i}] already has catUSD`);
    }
  }

  log("PHASE 0", "All wallets funded ✓");
}

// ═════════════════════════════════════════════════════════════════
// PHASE 1: Deploy all 9 markets
// ═════════════════════════════════════════════════════════════════
async function phase1(
  accounts: HDAccount[],
  walletClients: WalletClient[],
  publicClient: PublicClient
): Promise<{ marketId: number; config: MarketConfig; market: any }[]> {
  log("PHASE 1", "Deploying 9 markets...");

  const adminClient = walletClients[0];
  const admin = accounts[0];
  const deployed: { marketId: number; config: MarketConfig; market: any }[] = [];

  for (const mkt of MARKETS) {
    const riskHolder = accounts[mkt.riskHolderWalletIndex];
    const riskHolderClient = walletClients[mkt.riskHolderWalletIndex];

    // 1. Approve risk holder in registry (admin only)
    const isApproved = await publicClient.readContract({
      address: PROTOCOL.RizkRegistry,
      abi: RizkRegistry_ABI,
      functionName: "isApprovedRiskHolder",
      args: [riskHolder.address],
    });

    if (!isApproved) {
      await tx(adminClient, publicClient, {
        address: PROTOCOL.RizkRegistry,
        abi: RizkRegistry_ABI,
        functionName: "approveRiskHolder",
        args: [
          riskHolder.address,
          mkt.riskHolderName,
          mkt.riskHolderJurisdiction,
          ("0x" + "ab".repeat(32)) as `0x${string}`,
        ],
        account: admin,
      }, `Approve risk holder: ${mkt.riskHolderName}`);
    }

    // 2. Calculate initial escrow (1 quarter of annual premium)
    const annualPremium = (mkt.coverageTarget * BigInt(mkt.premiumRateBps)) / 10000n;
    const initialEscrow = annualPremium / 4n;

    // 3. Approve USDC spend for factory (risk holder approves)
    await tx(riskHolderClient, publicClient, {
      address: PROTOCOL.MockUSDC,
      abi: MockUSDC_ABI,
      functionName: "approve",
      args: [PROTOCOL.MarketFactory, initialEscrow],
      account: riskHolder,
    }, `Approve ${Number(initialEscrow) / 1e6} catUSD for factory (${mkt.name})`);

    // 4. Create the market
    const config = {
      riskHolder: riskHolder.address,
      payoutAddress: riskHolder.address,
      coverageTarget: mkt.coverageTarget,
      minimumFillBps: BigInt(mkt.minimumFillBps),
      premiumRateBps: BigInt(mkt.premiumRateBps),
      duration: mkt.duration,
      commitmentWindow: mkt.commitmentWindow,
      commitmentBondBps: BigInt(mkt.commitmentBondBps),
      autoLockAtTarget: false,
      perilType: mkt.perilType,
      regionHash: mkt.regionHash,
      metadataURI: mkt.metadataURI,
      attachmentPoints: mkt.attachmentPoints,
    };

    // We need the risk holder to create the market
    const receipt = await tx(riskHolderClient, publicClient, {
      address: PROTOCOL.MarketFactory,
      abi: MarketFactory_ABI,
      functionName: "createProtectionMarket",
      args: [config, initialEscrow],
      account: riskHolder,
    }, `Create market: ${mkt.name}`);

    // Read market ID from registry
    const totalMarkets = await publicClient.readContract({
      address: PROTOCOL.MarketRegistry,
      abi: MarketRegistry_ABI,
      functionName: "totalMarkets",
    });
    const marketId = Number(totalMarkets);

    // Read market info
    const market = await publicClient.readContract({
      address: PROTOCOL.MarketRegistry,
      abi: MarketRegistry_ABI,
      functionName: "getMarket",
      args: [BigInt(marketId)],
    });

    log("PHASE 1", `Market #${marketId} created: ${mkt.name} (${mkt.target}) — CM: ${(market as any).commitmentManager.slice(0, 10)}...`);
    deployed.push({ marketId, config: mkt, market });
  }

  log("PHASE 1", `All ${deployed.length} markets deployed ✓`);
  return deployed;
}

// ═════════════════════════════════════════════════════════════════
// PHASE 2: Commit capital to markets
// ═════════════════════════════════════════════════════════════════
async function phase2(
  accounts: HDAccount[],
  walletClients: WalletClient[],
  publicClient: PublicClient,
  deployed: { marketId: number; config: MarketConfig; market: any }[]
) {
  log("PHASE 2", "Committing capital...");

  const investorStart = 4;
  const investorEnd = 4 + NUM_INVESTORS;

  for (const { marketId, config: mkt, market } of deployed) {
    const cm = (market as any).commitmentManager as Address;

    if (mkt.target === "open") {
      // Partial fill for open markets
      const targetAmount = (mkt.coverageTarget * BigInt(Math.round((mkt.partialFillPct || 0.3) * 10000))) / 10000n;
      const perInvestor = targetAmount / BigInt(Math.min(NUM_INVESTORS, 5));

      for (let i = investorStart; i < investorStart + 5 && i < investorEnd; i++) {
        const bondAmount = (perInvestor * BigInt(mkt.commitmentBondBps)) / 10000n;

        // Approve bond
        await tx(walletClients[i], publicClient, {
          address: PROTOCOL.MockUSDC,
          abi: MockUSDC_ABI,
          functionName: "approve",
          args: [cm, bondAmount],
          account: accounts[i],
        }, `Approve bond for wallet[${i}] on ${mkt.name}`);

        // Commit
        await tx(walletClients[i], publicClient, {
          address: cm,
          abi: CommitmentManager_ABI,
          functionName: "commit",
          args: [perInvestor],
          account: accounts[i],
        }, `Commit ${Number(perInvestor) / 1e6} to ${mkt.name} from wallet[${i}]`);
      }

      log("PHASE 2", `${mkt.name}: partial fill at ~${((mkt.partialFillPct || 0.3) * 100).toFixed(0)}% ✓`);

    } else {
      // Full fill for live/matured/triggered markets
      const perInvestor = mkt.coverageTarget / BigInt(NUM_INVESTORS);

      for (let i = investorStart; i < investorEnd; i++) {
        const bondAmount = (perInvestor * BigInt(mkt.commitmentBondBps)) / 10000n;

        await tx(walletClients[i], publicClient, {
          address: PROTOCOL.MockUSDC,
          abi: MockUSDC_ABI,
          functionName: "approve",
          args: [cm, bondAmount],
          account: accounts[i],
        }, `Approve bond for wallet[${i}] on ${mkt.name}`);

        await tx(walletClients[i], publicClient, {
          address: cm,
          abi: CommitmentManager_ABI,
          functionName: "commit",
          args: [perInvestor],
          account: accounts[i],
        }, `Commit ${Number(perInvestor) / 1e6} to ${mkt.name} from wallet[${i}]`);
      }

      log("PHASE 2", `${mkt.name}: fully committed ✓`);
    }
  }

  log("PHASE 2", "All commitments placed ✓");
}

// ═════════════════════════════════════════════════════════════════
// PHASE 3: Wait for short windows, then Deposit Day + Lock
// ═════════════════════════════════════════════════════════════════
async function phase3(
  accounts: HDAccount[],
  walletClients: WalletClient[],
  publicClient: PublicClient,
  deployed: { marketId: number; config: MarketConfig; market: any }[]
) {
  log("PHASE 3", "Processing deposit day for live/matured/triggered markets...");

  const investorStart = 4;
  const investorEnd = 4 + NUM_INVESTORS;
  const shortWindowMarkets = deployed.filter(
    (d) => d.config.target !== "open"
  );

  if (shortWindowMarkets.length === 0) {
    log("PHASE 3", "No short-window markets to process");
    return;
  }

  // Wait for commitment windows to close
  for (const { marketId, config: mkt, market } of shortWindowMarkets) {
    const cm = (market as any).commitmentManager as Address;
    const deadline = await publicClient.readContract({
      address: cm,
      abi: CommitmentManager_ABI,
      functionName: "commitmentDeadline",
    });
    await waitForTimestamp(publicClient, Number(deadline) + 1, `${mkt.name} commitment window`);

    // Transition to deposit day
    await tx(walletClients[0], publicClient, {
      address: cm,
      abi: CommitmentManager_ABI,
      functionName: "startDepositDay",
      args: [],
      account: accounts[0],
    }, `Start deposit day: ${mkt.name}`);

    // All investors deposit (priority round)
    for (let i = investorStart; i < investorEnd; i++) {
      const perInvestor = mkt.coverageTarget / BigInt(NUM_INVESTORS);
      const depositAmount = perInvestor; // Full amount minus bond

      await tx(walletClients[i], publicClient, {
        address: PROTOCOL.MockUSDC,
        abi: MockUSDC_ABI,
        functionName: "approve",
        args: [cm, depositAmount],
        account: accounts[i],
      }, `Approve deposit for wallet[${i}] on ${mkt.name}`);

      await tx(walletClients[i], publicClient, {
        address: cm,
        abi: CommitmentManager_ABI,
        functionName: "deposit",
        args: [],
        account: accounts[i],
      }, `Deposit by wallet[${i}] on ${mkt.name}`);
    }

    // Wait for deposit deadline, then lock
    const depositDeadline = await publicClient.readContract({
      address: cm,
      abi: CommitmentManager_ABI,
      functionName: "depositDeadline",
    });
    await waitForTimestamp(publicClient, Number(depositDeadline) + 1, `${mkt.name} deposit day`);

    // Lock the market (via factory admin)
    await tx(walletClients[0], publicClient, {
      address: PROTOCOL.MarketFactory,
      abi: MarketFactory_ABI,
      functionName: "lockMarket",
      args: [BigInt(marketId)],
      account: accounts[0],
    }, `Lock market: ${mkt.name}`);

    log("PHASE 3", `${mkt.name}: locked and active ✓`);
  }

  log("PHASE 3", "All short-window markets activated ✓");
}

// ═════════════════════════════════════════════════════════════════
// PHASE 4: Create order book depth for live markets
// ═════════════════════════════════════════════════════════════════
async function phase4(
  accounts: HDAccount[],
  walletClients: WalletClient[],
  publicClient: PublicClient,
  deployed: { marketId: number; config: MarketConfig; market: any }[]
) {
  log("PHASE 4", "Creating order book depth for live markets...");

  const liveMarkets = deployed.filter((d) => d.config.target === "live");

  for (const { marketId, config: mkt, market } of liveMarkets) {
    const orderBook = (market as any).orderBook as Address;
    const catbondToken = (market as any).catbondToken as Address;

    // Place sell orders (asks) — investors selling their catbond tokens
    // Investors 4-7 place asks at different prices
    const askPrices = [940000n, 950000n, 960000n, 970000n]; // $0.94 - $0.97
    const askAmounts = [130000n * 1000000n, 260000n * 1000000n, 180000n * 1000000n, 95000n * 1000000n];

    for (let j = 0; j < 4; j++) {
      const i = 4 + j;
      // Approve catbond tokens for order book
      await tx(walletClients[i], publicClient, {
        address: catbondToken,
        abi: CatbondToken_ABI,
        functionName: "approve",
        args: [orderBook, askAmounts[j]],
        account: accounts[i],
      }, `Approve tokens for ask by wallet[${i}]`);

      await tx(walletClients[i], publicClient, {
        address: orderBook,
        abi: OrderBook_ABI,
        functionName: "placeLimitOrder",
        args: [false, askPrices[j], askAmounts[j]],
        account: accounts[i],
      }, `Place ask: ${Number(askAmounts[j]) / 1e6} tokens @ $${Number(askPrices[j]) / 1e6} on ${mkt.name}`);
    }

    // Place buy orders (bids) — investors 8-11 place bids with USDC
    const bidPrices = [930000n, 920000n, 910000n, 900000n]; // $0.93 - $0.90
    const bidAmounts = [210000n * 1000000n, 145000n * 1000000n, 98000n * 1000000n, 50000n * 1000000n];

    for (let j = 0; j < 4; j++) {
      const i = 8 + j;
      if (i >= accounts.length) break;

      const usdcNeeded = (bidAmounts[j] * bidPrices[j]) / 1000000n;
      await tx(walletClients[i], publicClient, {
        address: PROTOCOL.MockUSDC,
        abi: MockUSDC_ABI,
        functionName: "approve",
        args: [orderBook, usdcNeeded],
        account: accounts[i],
      }, `Approve USDC for bid by wallet[${i}]`);

      await tx(walletClients[i], publicClient, {
        address: orderBook,
        abi: OrderBook_ABI,
        functionName: "placeLimitOrder",
        args: [true, bidPrices[j], bidAmounts[j]],
        account: accounts[i],
      }, `Place bid: ${Number(bidAmounts[j]) / 1e6} tokens @ $${Number(bidPrices[j]) / 1e6} on ${mkt.name}`);
    }

    // Execute a few crossing trades to establish price history
    // Wallet 12 does a small market buy, wallet 13 does a small market sell
    if (accounts.length > 12) {
      const smallBuyUsdc = 5000n * 1000000n; // $5K market buy
      await tx(walletClients[12], publicClient, {
        address: PROTOCOL.MockUSDC,
        abi: MockUSDC_ABI,
        functionName: "approve",
        args: [orderBook, smallBuyUsdc],
        account: accounts[12],
      }, `Approve USDC for market buy`);

      await tx(walletClients[12], publicClient, {
        address: orderBook,
        abi: OrderBook_ABI,
        functionName: "marketBuy",
        args: [smallBuyUsdc],
        account: accounts[12],
      }, `Market buy $5K on ${mkt.name}`);
    }

    log("PHASE 4", `${mkt.name}: order book populated ✓`);
  }

  log("PHASE 4", "All live markets have order book depth ✓");
}

// ═════════════════════════════════════════════════════════════════
// PHASE 5: Mature/Trigger settled markets
// ═════════════════════════════════════════════════════════════════
async function phase5(
  accounts: HDAccount[],
  walletClients: WalletClient[],
  publicClient: PublicClient,
  deployed: { marketId: number; config: MarketConfig; market: any }[]
) {
  log("PHASE 5", "Settling matured/triggered markets...");

  const settledMarkets = deployed.filter(
    (d) => d.config.target === "matured" || d.config.target === "triggered"
  );

  for (const { marketId, config: mkt, market } of settledMarkets) {
    if (mkt.target === "triggered" && mkt.triggerSeverity) {
      // Trigger via oracle before maturity
      log("PHASE 5", `Triggering ${mkt.name} with severity ${mkt.triggerSeverity}...`);
      await tx(walletClients[0], publicClient, {
        address: PROTOCOL.MockOracle,
        abi: MockOracle_ABI,
        functionName: "triggerEvent",
        args: [BigInt(marketId), mkt.triggerSeverity],
        account: accounts[0],
      }, `Trigger event: ${mkt.name}`);

      log("PHASE 5", `${mkt.name}: triggered ✓`);
    } else {
      // Wait for duration to pass, then mature
      // Re-read the market to get lockedAt
      const updatedMarket = await publicClient.readContract({
        address: PROTOCOL.MarketRegistry,
        abi: MarketRegistry_ABI,
        functionName: "getMarket",
        args: [BigInt(marketId)],
      });
      const lockedAt = Number((updatedMarket as any).lockedAt);
      const maturityTime = lockedAt + mkt.duration;

      await waitForTimestamp(publicClient, maturityTime + 1, `${mkt.name} maturity`);

      await tx(walletClients[0], publicClient, {
        address: PROTOCOL.MarketFactory,
        abi: MarketFactory_ABI,
        functionName: "matureMarket",
        args: [BigInt(marketId)],
        account: accounts[0],
      }, `Mature market: ${mkt.name}`);

      log("PHASE 5", `${mkt.name}: matured ✓`);
    }
  }

  // Have some investors claim premium on settled markets
  for (const { marketId, config: mkt, market } of settledMarkets) {
    const vaultWrapper = (market as any).vaultWrapper as Address;
    // First 3 investors claim
    for (let i = 4; i < 7; i++) {
      try {
        await tx(walletClients[i], publicClient, {
          address: vaultWrapper,
          abi: VaultWrapper_ABI,
          functionName: "claimRewards",
          args: [],
          account: accounts[i],
        }, `Claim premium on ${mkt.name} by wallet[${i}]`);
      } catch {
        // May fail if no rewards — that's fine
      }
    }
  }

  log("PHASE 5", "All settled markets processed ✓");
}

// ═════════════════════════════════════════════════════════════════
// MAIN
// ═════════════════════════════════════════════════════════════════
async function main() {
  const mnemonic = process.env.MNEMONIC;
  const rpcUrl = process.env.SEPOLIA_RPC_URL;

  if (!mnemonic || !rpcUrl) {
    console.error("Missing MNEMONIC or SEPOLIA_RPC_URL in .env");
    process.exit(1);
  }

  log("MAIN", "RIZK Testnet Seeder starting...");
  log("MAIN", `RPC: ${rpcUrl.slice(0, 30)}...`);

  // Derive wallets: 0 = admin, 1-3 = risk holders, 4-13 = investors
  const totalWallets = 4 + NUM_INVESTORS;
  const accounts = deriveWallets(mnemonic, totalWallets);
  log("MAIN", `Derived ${totalWallets} wallets from mnemonic`);
  log("MAIN", `Admin: ${accounts[0].address}`);
  log("MAIN", `Risk Holders: ${accounts[1].address.slice(0, 10)}, ${accounts[2].address.slice(0, 10)}, ${accounts[3].address.slice(0, 10)}`);
  log("MAIN", `Investors: wallet[4] through wallet[${totalWallets - 1}]`);

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  });

  const walletClients = accounts.map((acc) => makeWalletClient(acc, rpcUrl));

  // Check if markets already exist
  const existingMarkets = await publicClient.readContract({
    address: PROTOCOL.MarketRegistry,
    abi: MarketRegistry_ABI,
    functionName: "totalMarkets",
  });
  log("MAIN", `Existing markets on-chain: ${existingMarkets}`);

  if (Number(existingMarkets) > 0) {
    log("MAIN", "⚠️  Markets already exist. This script is designed for a fresh deployment.");
    log("MAIN", "   If you want to re-seed, redeploy the protocol contracts first.");
    process.exit(1);
  }

  // Run all phases
  await phase0(accounts, walletClients, publicClient);
  const deployed = await phase1(accounts, walletClients, publicClient);
  await phase2(accounts, walletClients, publicClient, deployed);
  await phase3(accounts, walletClients, publicClient, deployed);
  await phase4(accounts, walletClients, publicClient, deployed);
  await phase5(accounts, walletClients, publicClient, deployed);

  log("MAIN", "");
  log("MAIN", "═══════════════════════════════════════════════");
  log("MAIN", "  RIZK testnet seeding complete!");
  log("MAIN", "═══════════════════════════════════════════════");
  log("MAIN", "");

  // Print summary
  for (const { marketId, config: mkt } of deployed) {
    const market = await publicClient.readContract({
      address: PROTOCOL.MarketRegistry,
      abi: MarketRegistry_ABI,
      functionName: "getMarket",
      args: [BigInt(marketId)],
    });
    const statusNames = ["COMMITTING", "DEPOSIT_DAY", "ACTIVE", "TRIGGERED", "MATURED", "EARLY_EXIT"];
    log("SUMMARY", `Market #${marketId}: ${mkt.name} — ${statusNames[(market as any).status] || "?"}`);
  }

  log("MAIN", "");
  log("MAIN", "Next: run `npm run dev` in the frontend directory to see the markets!");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
