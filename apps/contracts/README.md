# VirtuPerks - Token Reward Application

A Solidity-based token reward application where participants are rewarded for completing predefined tasks. Built with upgradeable smart contracts using OpenZeppelin and Hardhat.

## 🎯 Overview

VirtuPerks is a decentralized task management and reward distribution system that allows:
- **Super Admins** to deploy and manage apps
- **Entity Owners** to create and manage entities within apps
- **Task Owners** to create tasks with fixed token rewards
- **Participants** to complete tasks and receive token rewards

## 🏗️ Architecture

### Smart Contracts

#### App Contract (Upgradeable UUPS)
The main entry point for the system. Super Admin deploys this contract to:
- Create apps with unique app IDs
- Deploy entities with entity owners
- Manage app lifecycle (activate/deactivate)

#### Entity Contract (Upgradeable UUPS)
Each entity is deployed as a separate proxy contract with:
- **Task Management**: Create, close, and update tasks
- **Participant Management**: Handle participant applications, approvals, and submissions
- **Reward Distribution**: Distribute tokens evenly to approved participants

#### RewardToken (ERC20)
A standard ERC20 token used for rewards in the test environment.

## ✨ Features

### Task Management
- Create tasks with customizable parameters:
  - Reward token and amount
  - Expiry date
  - Maximum participants
  - Approval requirements
  - Whitelist functionality
- Close tasks manually or automatically upon expiry
- Update task details (URL, expiry date)

### Participant Management
- Open participation or whitelist-only
- Manual or automatic participant acceptance
- Task completion with submission URLs
- Submission approval/rejection by task owners
- Assignment status tracking (NONE, PENDING, ACCEPTED, COMPLETED, APPROVED, REJECTED, DISBURSED)

### Reward Distribution
- Automatic even distribution among approved participants
- Protection against double disbursement
- Only distributable after task closure or expiry
- ERC20 token support via SafeERC20

### Security Features
- Upgradeable contracts using UUPS proxy pattern
- OpenZeppelin security libraries
- ReentrancyGuard protection
- Ownership and access control
- Comprehensive input validation

## 🛠️ Technology Stack

- **Solidity**: ^0.8.22
- **Hardhat**: Development environment and testing
- **OpenZeppelin**: Upgradeable contracts and security
- **TypeScript**: Type-safe deployment and testing
- **Ethers v6**: Ethereum interaction

## 📦 Installation

```bash
# Install dependencies
npm install
```

## 🔧 Configuration

The project is configured in `hardhat.config.ts`:
- Solidity version: 0.8.22
- Optimizer enabled with 200 runs
- Local network: Hardhat (chainId: 31337)

## 🚀 Usage

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm test
```

### Deploy Contracts
```bash
# Deploy App contract only
npm run deploy

# Deploy entire system (App + Entity + RewardToken)
npm run deploy:all
```

### Clean Build Artifacts
```bash
npm run clean
```

## 📝 Contract Interfaces

### ITaskManagement
```solidity
- createTask(bytes32 taskId, Task memory task, address[] memory whitelistParticipants)
- closeTask(bytes32 taskId)
- isTaskExpired(bytes32 taskId) view returns (bool)
- isTaskOpen(bytes32 taskId) view returns (bool)
- isMaxParticipantsReached(bytes32 taskId) view returns (bool)
- updateTaskDetails(bytes32 taskId, string memory newDetailsUrl, uint256 newExpiryDate)
```

### IParticipantManagement
```solidity
- addToWhitelist(bytes32 taskId, address participant, bool throwError)
- removeFromWhitelist(bytes32 taskId, address participant)
- participate(bytes32 taskId)
- acceptParticipant(bytes32 taskId, address participant)
- completeTask(bytes32 taskId, string memory completionUrl)
- rejectTaskSubmission(bytes32 taskId, address participant, string memory reason)
- approveTaskSubmission(bytes32 taskId, address participant)
- getParticipantTaskAssignment(bytes32 taskId, address participant) view
```

### IEntity
```solidity
- initialize(bytes32 appId, address appContract, address owner, string memory name, string memory url)
- getEntityInfo() view returns (Entity memory)
- depositTokens(address token, uint256 amount)
- distributeRewards(bytes32 taskId)
```

### IApp
```solidity
- createApp(bytes32 appId, string memory name)
- deactivateApp(bytes32 appId)
- getAppInfo(bytes32 appId) view returns (AppInfo memory)
- isAppActive(bytes32 appId) view returns (bool)
- createEntity(bytes32 appId, address entityOwner, string memory name, string memory url)
```

## 🧪 Testing

The project includes comprehensive test coverage:

### App.test.ts (17 tests)
- Deployment verification
- App creation and management
- Entity creation
- View functions
- Upgradeability

### EntityTaskManagement.test.ts (15 tests)
- Task creation with various configurations
- Task lifecycle management
- Expiry checking
- Whitelist management
- Access control

### EntityParticipant.test.ts (17 tests)
- Participant registration
- Approval workflows
- Task completion
- Submission review
- Reward distribution
- Token deposits

**Total: 49 passing tests** ✅

## 📊 Workflow Example

1. **Super Admin** deploys `App` contract
2. **Super Admin** creates an app with unique ID
3. **Super Admin** deploys `Entity` contract for entity owner
4. **Entity Owner** creates a task with:
   - Task details and URL
   - Reward token and amount (e.g., 100 tokens)
   - Maximum participants (e.g., 10)
   - Expiry date
5. **Participants** apply to participate in the task
6. **Task Owner** accepts participants (if approval required)
7. **Participants** complete tasks and submit proof URLs
8. **Task Owner** reviews and approves submissions
9. After deadline, **Task Owner** closes task
10. **Task Owner** distributes rewards evenly to approved participants

## 🔐 Security Considerations

- All contracts use OpenZeppelin's battle-tested libraries
- UUPS proxy pattern for upgradeability with restricted upgrade function
- ReentrancyGuard on token transfers and distributions
- Comprehensive access control (onlyOwner, onlyTaskOwner)
- SafeERC20 for secure token transfers
- Input validation on all state-changing functions

## 📁 Project Structure

```
virtuperks-ui/
├── contracts/
│   ├── interfaces/
│   │   ├── IApp.sol
│   │   ├── IEntity.sol
│   │   ├── ITaskManagement.sol
│   │   └── IParticipantManagement.sol
│   ├── App.sol
│   ├── Entity.sol
│   └── RewardToken.sol
├── scripts/
│   ├── deploy.ts
│   └── deployAll.ts
├── test/
│   ├── App.test.ts
│   ├── EntityTaskManagement.test.ts
│   └── EntityParticipant.test.ts
├── hardhat.config.ts
├── tsconfig.json
└── package.json
```

## 🔄 Upgrade Process

Both App and Entity contracts are upgradeable using the UUPS pattern:

```typescript
// Upgrade App contract
const AppV2 = await ethers.getContractFactory("AppV2");
const upgraded = await upgrades.upgradeProxy(appAddress, AppV2);

// Upgrade Entity contract
const EntityV2 = await ethers.getContractFactory("EntityV2");
const upgraded = await upgrades.upgradeProxy(entityAddress, EntityV2);
```

⚠️ **Important**: Only the contract owner can authorize upgrades.

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please ensure all tests pass before submitting a PR:

```bash
npm test
```

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using Solidity, OpenZeppelin, and Hardhat**
