// ─── Minimal ABIs for the seed script ─────────────────────────────

export const MockUSDC_ABI = [
  { name: "mint", type: "function", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [] },
  { name: "approve", type: "function", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
] as const;

export const RizkRegistry_ABI = [
  { name: "approveRiskHolder", type: "function", stateMutability: "nonpayable", inputs: [{ name: "entity", type: "address" }, { name: "name", type: "string" }, { name: "jurisdiction", type: "string" }, { name: "verificationHash", type: "bytes32" }], outputs: [] },
  { name: "isApprovedRiskHolder", type: "function", stateMutability: "view", inputs: [{ name: "entity", type: "address" }], outputs: [{ type: "bool" }] },
] as const;

export const MarketFactory_ABI = [
  {
    name: "createProtectionMarket",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "config",
        type: "tuple",
        components: [
          { name: "riskHolder", type: "address" },
          { name: "payoutAddress", type: "address" },
          { name: "coverageTarget", type: "uint256" },
          { name: "minimumFillBps", type: "uint256" },
          { name: "premiumRateBps", type: "uint256" },
          { name: "duration", type: "uint32" },
          { name: "commitmentWindow", type: "uint32" },
          { name: "commitmentBondBps", type: "uint256" },
          { name: "autoLockAtTarget", type: "bool" },
          { name: "perilType", type: "string" },
          { name: "regionHash", type: "bytes32" },
          { name: "metadataURI", type: "string" },
          {
            name: "attachmentPoints",
            type: "tuple[]",
            components: [
              { name: "threshold", type: "uint256" },
              { name: "slashBps", type: "uint256" },
            ],
          },
        ],
      },
      { name: "initialEscrow", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  { name: "lockMarket", type: "function", stateMutability: "nonpayable", inputs: [{ name: "marketId", type: "uint256" }], outputs: [] },
  { name: "matureMarket", type: "function", stateMutability: "nonpayable", inputs: [{ name: "marketId", type: "uint256" }], outputs: [] },
] as const;

export const MarketRegistry_ABI = [
  {
    name: "getMarket",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [{
      type: "tuple",
      components: [
        { name: "marketId", type: "uint256" },
        { name: "riskHolder", type: "address" },
        { name: "coverageAgreement", type: "address" },
        { name: "vaultWrapper", type: "address" },
        { name: "catbondToken", type: "address" },
        { name: "premiumEscrow", type: "address" },
        { name: "commitmentManager", type: "address" },
        { name: "orderBook", type: "address" },
        { name: "simpleVault", type: "address" },
        { name: "perilType", type: "string" },
        { name: "status", type: "uint8" },
        { name: "coverageTarget", type: "uint256" },
        { name: "actualFill", type: "uint256" },
        { name: "premiumRateBps", type: "uint256" },
        { name: "duration", type: "uint32" },
        { name: "lockedAt", type: "uint256" },
        { name: "metadataURI", type: "string" },
      ],
    }],
  },
  { name: "totalMarkets", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

export const CommitmentManager_ABI = [
  { name: "commit", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { name: "deposit", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { name: "depositOpen", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
  { name: "startDepositDay", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { name: "lockMarket", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { name: "totalCommitted", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "totalDeposited", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "commitmentDeadline", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "depositDeadline", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "state", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { name: "fillPercentageBps", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "claimBondRefund", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
] as const;

export const OrderBook_ABI = [
  { name: "placeLimitOrder", type: "function", stateMutability: "nonpayable", inputs: [{ name: "isBuy", type: "bool" }, { name: "price", type: "uint256" }, { name: "amount", type: "uint256" }], outputs: [{ type: "uint256" }] },
  { name: "marketBuy", type: "function", stateMutability: "nonpayable", inputs: [{ name: "usdcAmount", type: "uint256" }], outputs: [{ type: "uint256" }] },
  { name: "marketSell", type: "function", stateMutability: "nonpayable", inputs: [{ name: "tokenAmount", type: "uint256" }], outputs: [{ type: "uint256" }] },
  { name: "bestBid", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "bestAsk", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "totalTrades", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

export const MockOracle_ABI = [
  { name: "triggerEvent", type: "function", stateMutability: "nonpayable", inputs: [{ name: "marketId", type: "uint256" }, { name: "severityValue", type: "uint256" }], outputs: [] },
  { name: "isResolved", type: "function", stateMutability: "view", inputs: [{ name: "marketId", type: "uint256" }], outputs: [{ type: "bool" }] },
] as const;

export const CatbondToken_ABI = [
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "approve", type: "function", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
  { name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

export const VaultWrapper_ABI = [
  { name: "claimRewards", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "redeem", type: "function", stateMutability: "nonpayable", inputs: [{ name: "shares", type: "uint256" }], outputs: [{ type: "uint256" }] },
  { name: "getRedemptionRate", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "totalAssets", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "claimableRewards", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "distributePremium", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
] as const;

export const PremiumEscrow_ABI = [
  { name: "dripPremium", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "totalEscrowed", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "totalDripped", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;
