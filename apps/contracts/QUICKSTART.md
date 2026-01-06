# Quick Start Guide

## Prerequisites

- Node.js (v22 LTS recommended)
- npm or yarn
- Git

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd virtuperks-ui

# Install dependencies
npm install

# Compile contracts
npm run compile
```

## Run Tests

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/App.test.ts
npx hardhat test test/EntityTaskManagement.test.ts
npx hardhat test test/EntityParticipant.test.ts
```

## Local Deployment

### Option 1: Deploy Full System

```bash
npm run deploy:all
```

This deploys:
- App contract (UUPS proxy)
- Entity contract (UUPS proxy)
- RewardToken (ERC20)

### Option 2: Deploy App Only

```bash
npm run deploy
```

## Using the Contracts

### 1. Deploy App and Create Application

```typescript
import { ethers, upgrades } from "hardhat";

// Deploy App
const App = await ethers.getContractFactory("App");
const app = await upgrades.deployProxy(App, [], {
  initializer: "initialize",
  kind: "uups",
});

// Create an app
const appId = ethers.id("my-app");
await app.createApp(appId, "My Application");
```

### 2. Create Entity

```typescript
const [owner, entityOwner] = await ethers.getSigners();

const tx = await app.createEntity(
  appId,
  entityOwner.address,
  "My Entity",
  "https://my-entity.com"
);

const receipt = await tx.wait();
// Extract entity address from event
```

### 3. Create Task

```typescript
const taskId = ethers.id("task-1");
const expiryDate = Math.floor(Date.now() / 1000) + 86400; // 1 day

const task = {
  name: "Complete Survey",
  detailsUrl: "https://survey.com/details",
  owner: taskOwner.address,
  expiryDate: expiryDate,
  rewardToken: rewardTokenAddress,
  totalRewardAmount: ethers.parseEther("100"),
  isOpen: true,
  requireApproval: false,
  isWhitelisted: false,
  isTokenDisbursed: false,
  maxParticipants: 50,
  acceptedParticipantCount: 0,
  approvedParticipants: [],
};

await entity.connect(entityOwner).createTask(taskId, task, []);
```

### 4. Participant Flow

```typescript
// Participant applies
await entity.connect(participant).participate(taskId);

// Participant completes task
await entity
  .connect(participant)
  .completeTask(taskId, "https://submission.com/proof");

// Task owner approves
await entity
  .connect(taskOwner)
  .approveTaskSubmission(taskId, participant.address);

// Task owner closes task
await entity.connect(taskOwner).closeTask(taskId);

// Distribute rewards
await entity.connect(taskOwner).distributeRewards(taskId);
```

## Hardhat Console

```bash
npx hardhat console --network hardhat
```

```javascript
// Get accounts
const [owner] = await ethers.getSigners();

// Deploy contracts
const App = await ethers.getContractFactory("App");
const app = await upgrades.deployProxy(App, [], {
  initializer: "initialize",
  kind: "uups",
});

// Interact with contracts
const appId = ethers.id("test-app");
await app.createApp(appId, "Test App");
```

## Useful Commands

```bash
# Clean build artifacts
npm run clean

# Compile contracts
npm run compile

# Run tests with coverage
npm run test:coverage

# Run deployment
npm run deploy:all

# Run Hardhat node (local blockchain)
npx hardhat node

# Deploy to local node
npx hardhat run scripts/deployAll.ts --network localhost
```

## Testing Individual Components

### Test App Creation

```bash
npx hardhat test test/App.test.ts --grep "Should create a new app"
```

### Test Task Creation

```bash
npx hardhat test test/EntityTaskManagement.test.ts --grep "Should create a new task"
```

### Test Reward Distribution

```bash
npx hardhat test test/EntityParticipant.test.ts --grep "Should distribute rewards evenly"
```

## Troubleshooting

### Node Version Warning

If you see warnings about Node.js version:
```bash
# Use Node v22 LTS
nvm install 22
nvm use 22
```

### Compilation Errors

```bash
# Clean and recompile
npm run clean
npm run compile
```

### Test Failures

```bash
# Run tests with stack traces
npx hardhat test --show-stack-traces

# Run specific test with verbose output
npx hardhat test test/App.test.ts --verbose
```

## Network Configuration

Edit `hardhat.config.ts` to add networks:

```typescript
networks: {
  hardhat: {
    chainId: 31337,
  },
  sepolia: {
    url: process.env.SEPOLIA_URL || "",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  },
  mainnet: {
    url: process.env.MAINNET_URL || "",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  },
}
```

## Environment Variables

Create `.env` file:

```bash
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
MAINNET_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_key
```

## Common Workflows

### Workflow 1: Simple Task (No Approval Required)

1. Deploy system
2. Create app and entity
3. Create task with `requireApproval: false`
4. Participants join automatically
5. Participants complete tasks
6. Task owner approves submissions
7. Distribute rewards

### Workflow 2: Approved Task

1. Create task with `requireApproval: true`
2. Participants apply
3. Task owner accepts participants
4. Accepted participants complete tasks
5. Task owner reviews and approves
6. Distribute rewards

### Workflow 3: Whitelisted Task

1. Create task with `isWhitelisted: true`
2. Add participants to whitelist
3. Only whitelisted participants can join
4. Complete and distribute as normal

## Next Steps

1. ✅ Compile and test contracts
2. ✅ Deploy to local Hardhat network
3. 🔄 Deploy to testnet (Sepolia)
4. 🔄 Verify contracts on Etherscan
5. 🔄 Build frontend integration
6. 🔄 Security audit
7. 🔄 Deploy to mainnet

## Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## Support

For issues or questions:
1. Check the README.md
2. Review test files for usage examples
3. Open an issue on GitHub
4. Contact the development team

---

Happy coding! 🚀
