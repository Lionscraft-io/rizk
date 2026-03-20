// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/RizkRegistry.sol";
import "../src/MarketRegistry.sol";
import "../src/MockOracle.sol";
import "../src/VaultDeployer.sol";
import "../src/MarketDeployer.sol";
import "../src/AgreementDeployer.sol";
import "../src/MarketFactory.sol";

/// @title DeployRizk — Deploys all RIZK v0.9 protocol contracts
contract DeployRizk is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying RIZK v0.9 protocol...");
        console.log("Deployer:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        MockUSDC usdc = new MockUSDC();
        console.log("MockUSDC:", address(usdc));

        RizkRegistry registry = new RizkRegistry();
        console.log("RizkRegistry:", address(registry));

        MarketRegistry marketRegistry = new MarketRegistry();
        console.log("MarketRegistry:", address(marketRegistry));

        MockOracle oracle = new MockOracle(deployer);
        console.log("MockOracle:", address(oracle));

        VaultDeployer vaultDeployer = new VaultDeployer();
        console.log("VaultDeployer:", address(vaultDeployer));

        MarketDeployer marketDeployer = new MarketDeployer();
        console.log("MarketDeployer:", address(marketDeployer));

        AgreementDeployer agreementDeployer = new AgreementDeployer();
        console.log("AgreementDeployer:", address(agreementDeployer));

        MarketFactory factory = new MarketFactory(
            address(usdc),
            address(registry),
            address(marketRegistry),
            address(oracle),
            address(vaultDeployer),
            address(marketDeployer),
            address(agreementDeployer),
            deployer
        );
        console.log("MarketFactory:", address(factory));

        marketRegistry.setFactory(address(factory));
        oracle.setRegistrar(address(factory));
        console.log("Wiring complete");

        vm.stopBroadcast();

        string memory json = string.concat(
            '{\n',
            '  "network": "sepolia",\n',
            '  "deployer": "', vm.toString(deployer), '",\n',
            '  "MockUSDC": "', vm.toString(address(usdc)), '",\n',
            '  "RizkRegistry": "', vm.toString(address(registry)), '",\n',
            '  "MarketRegistry": "', vm.toString(address(marketRegistry)), '",\n',
            '  "MockOracle": "', vm.toString(address(oracle)), '",\n',
            '  "VaultDeployer": "', vm.toString(address(vaultDeployer)), '",\n',
            '  "MarketDeployer": "', vm.toString(address(marketDeployer)), '",\n',
            '  "AgreementDeployer": "', vm.toString(address(agreementDeployer)), '",\n',
            '  "MarketFactory": "', vm.toString(address(factory)), '"\n',
            '}'
        );

        vm.writeFile("deployments/sepolia.json", json);
        console.log("Deployment addresses written to deployments/sepolia.json");
    }
}
