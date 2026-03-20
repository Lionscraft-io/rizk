# RIZK v0.9 — Smart Contracts

## Setup

```bash
# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Clone and install dependencies
cd contracts
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Copy env file and fill in your values
cp .env.example .env

# Build
forge build

# Test
forge test -vvv

# Deploy to Sepolia
source .env
forge script script/Deploy.s.sol:DeployRizk --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY

# Post-deploy setup (creates a test market)
forge script script/Setup.s.sol:SetupRizk --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
```
