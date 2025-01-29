# Dev Deployment
You can deploy either using a test network or using hardhat local network. Using hardhat local network is recommended.

## Deploy using Testnet
- Get RPC URL, example (Arbitrum sepolia: wss://arbitrum-sepolia-rpc.publicnode.com)
- Get testnet ETH using faucet. (You can claim from: https://www.alchemy.com/faucets/arbitrum-sepolia)

## Deploy using hardhat network (Recommended)
### Create a hardhat network
- Navigate to libs/contracts
- Run: npx hardhat node

This will run a local blockchain node and give us accounts (Private key and Wallet Address) with 1000 ETH to test. 
This will also return a RPC URL.

## Replace in env
- DEPLOYER_PRIVATE_KEY=Your_Private_key
- NETWORK_PROVIDER=RPC_URL