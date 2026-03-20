// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/RizkRegistry.sol";
import "../src/MarketRegistry.sol";
import "../src/MockOracle.sol";
import "../src/MarketFactory.sol";
import "../src/CoverageAgreement.sol";

/// @title SetupRizk — Post-deployment setup: creates a test market
/// @notice Run after Deploy.s.sol. Reads addresses from deployments/sepolia.json.
///   forge script script/Setup.s.sol:SetupRizk \
///     --rpc-url $SEPOLIA_RPC_URL \
///     --private-key $PRIVATE_KEY \
///     --broadcast
contract SetupRizk is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        // Read deployment addresses
        string memory json = vm.readFile("deployments/sepolia.json");
        address usdcAddr = vm.parseJsonAddress(json, ".MockUSDC");
        address registryAddr = vm.parseJsonAddress(json, ".RizkRegistry");
        address factoryAddr = vm.parseJsonAddress(json, ".MarketFactory");

        MockUSDC usdc = MockUSDC(usdcAddr);
        RizkRegistry registry = RizkRegistry(registryAddr);
        MarketFactory factory = MarketFactory(factoryAddr);

        console.log("Setting up RIZK test market...");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Approve deployer as a risk holder
        registry.approveRiskHolder(
            deployer,
            "Jamaica Catastrophe Fund (Test)",
            "JM",
            keccak256("test-verification-docs")
        );
        console.log("Deployer approved as risk holder");

        // 2. Mint test USDC (1M for escrow + testing)
        usdc.mint(deployer, 1_000_000e6);
        console.log("Minted 1,000,000 test USDC to deployer");

        // 3. Create a test hurricane market
        CoverageAgreement.AttachmentPoint[] memory attachments = new CoverageAgreement.AttachmentPoint[](3);
        attachments[0] = CoverageAgreement.AttachmentPoint({
            threshold: 119, // Category 1: 119 km/h
            slashBps: 2500  // 25% slash
        });
        attachments[1] = CoverageAgreement.AttachmentPoint({
            threshold: 178, // Category 3: 178 km/h
            slashBps: 5000  // 50% slash
        });
        attachments[2] = CoverageAgreement.AttachmentPoint({
            threshold: 252, // Category 5: 252 km/h
            slashBps: 10000 // 100% slash
        });

        // Approve USDC for initial escrow (25,000 USDC — one quarter of 10% of 1M)
        uint256 initialEscrow = 25_000e6;
        usdc.approve(address(factory), initialEscrow);

        MarketFactory.MarketConfig memory config = MarketFactory.MarketConfig({
            riskHolder: deployer,
            payoutAddress: deployer,
            coverageTarget: 1_000_000e6, // 1M USDC
            minimumFillBps: 3000,        // 30% minimum fill
            premiumRateBps: 1000,        // 10% annual premium
            duration: 365 days,           // 1 year coverage
            commitmentWindow: 7 days,     // 7 day commitment window
            commitmentBondBps: 100,       // 1% bond
            autoLockAtTarget: false,
            perilType: "HURRICANE",
            regionHash: keccak256(abi.encodePacked("18.1096,-77.2975,100km")), // Jamaica
            metadataURI: "ipfs://QmTESTMETADATA",
            attachmentPoints: attachments
        });

        uint256 marketId = factory.createProtectionMarket(config, initialEscrow);
        console.log("Test market created with ID:", marketId);

        vm.stopBroadcast();

        console.log("\nSetup complete! Test market is in COMMITTING state.");
        console.log("Users can now mint test USDC and commit to the market.");
    }
}
