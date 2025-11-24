# VirtuPerks Smart Contracts

A modular smart contract system for managing task-based reward programs with role-based access control and multi-application support.

## Overview

VirtuPerks enables organizations to create and manage task-based reward programs on the blockchain. The system supports:

- Task creation and lifecycle management
- Participant whitelisting and task assignments
- Token-based rewards and disbursements
- Role-based access control via AppRegistry
- Multi-application deployment through Factory pattern
- Meta-transaction support via ERC2771

## Core Contracts

### RewardManagement.sol

The main contract that combines all functionality through modular inheritance. Supports:

- Task and participant management
- Token allocation and disbursement
- Pause/unpause emergency controls
- Multicall for batch operations

### AppRegistry.sol

Centralized role-based access control system supporting multiple applications:

- Manages roles and permissions across multiple apps
- Public/private app modes
- Role admin delegation
- Maximum 20 admins per role for security
- ERC-165 interface detection

### RewardManagementFactory.sol

Deploys new RewardManagement instances with proper initialization:

- Creates RewardManagement contracts per entity
- Configures owner roles via AppRegistry
- Supports up to 5 entity owners
- Tracks entity metadata and ownership

### RewardToken.sol

ERC20 token with additional features:

- Burnable tokens
- Role-based minting (MINTER_ROLE)
- AppRegistry integration
- ERC2771 meta-transaction support
- Customizable decimals

## Architecture

### Modular Design

The system uses a layered inheritance pattern for separation of concerns:

```
RewardManagement
└── TokenManagement
    └── DisbursementManagement (+ ReentrancyGuard)
        └── ParticipantManagement
            └── TaskManagement
                └── RewardManagementBase
```

### Module Contracts

1. **RewardManagementBase.sol** (`modules/RewardManagementBase.sol`)
   - Foundation contract with core state and modifiers
   - AppRegistry integration
   - Role-based access control modifiers (`onlyRole`, `onlyOwner`)
   - Pause functionality state
   - Token allocation tracking
   - Inherits from: None (base contract)

2. **TaskManagement.sol** (`modules/TaskManagement.sol`)
   - Task lifecycle management (create, close, expire)
   - Task validation and queries
   - Whitelist management per task
   - Task assignment tracking
   - Inherits from: `RewardManagementBase`, `ITaskManagement`

3. **ParticipantManagement.sol** (`modules/ParticipantManagement.sol`)
   - Participant eligibility checks
   - Task participation flow
   - Assignment status management (PENDING → ACCEPTED → COMPLETED → DISBURSED)
   - Integration with AppRegistry for participant roles
   - Inherits from: `TaskManagement`, `IParticipantManagement`

4. **DisbursementManagement.sol** (`modules/DisbursementManagement.sol`)
   - Token disbursement to participants
   - Single and bulk disbursement operations
   - Reentrancy protection
   - Automatic task closing after full disbursement
   - Inherits from: `ParticipantManagement`, `IDisbursementManagement`, `ReentrancyGuard`

5. **TokenManagement.sol** (`modules/TokenManagement.sol`)
   - Token allocation to tasks from treasury
   - Unallocated token queries
   - Token transfers and Ether withdrawals
   - SafeERC20 for secure token operations
   - Inherits from: `DisbursementManagement`, `ITokenManagement`

### Interfaces

1. **ITaskManagement.sol** - Task lifecycle and queries
2. **IParticipantManagement.sol** - Participant interactions and assignments
3. **IDisbursementManagement.sol** - Token disbursement operations
4. **ITokenManagement.sol** - Token allocation and transfers
5. **IRewardManagement.sol** - Composite interface with pause controls
6. **IAppRegistry.sol** - Role and permission management
7. **IRewardManagementFactory.sol** - Factory deployment interface
8. **IRewardToken.sol** - Token interface with minting

## Key Features

### Access Control

- **AppRegistry Integration**: Centralized role management across multiple applications
- **Hierarchical Roles**: Owner, role admins, and role members
- **Private/Public Apps**: Control participant access at the application level
- **Task-Level Whitelisting**: Additional access control per task

### Security

- **ReentrancyGuard**: Protection against reentrancy attacks in token operations
- **SafeERC20**: Safe token transfers preventing common vulnerabilities
- **Pause Mechanism**: Emergency stop functionality for critical situations
- **Role Verification**: All sensitive operations require proper role authentication

### Token Management

- **Allocation Tracking**: Monitors allocated vs unallocated tokens
- **Multiple Token Support**: Each task can use different ERC20 tokens
- **Treasury Integration**: Token allocation from designated treasury addresses
- **Flexible Disbursement**: Single participant or bulk disbursement options

### Task Lifecycle

1. **Creation**: Task created with parameters (reward amount, participants, expiry, etc.)
2. **Participation**: Eligible participants apply for task assignments
3. **Acceptance**: Task owner or system accepts participants
4. **Completion**: Participants complete and submit task completion URLs
5. **Verification**: Completed tasks are verified by task owner
6. **Disbursement**: Tokens distributed to verified participants
7. **Closure**: Task automatically closed after full disbursement

## Usage Examples

### Creating a Task

```solidity
// Task parameters
bytes32 taskId = keccak256("task-1");
Task memory task = Task({
    name: "Complete Survey",
    detailsUrl: "ipfs://...",
    owner: taskOwnerAddress,
    expiryDate: block.timestamp + 30 days,
    rewardToken: tokenAddress,
    totalRewardAmount: 1000 * 10**18,
    maxParticipants: 10,
    isOpen: true,
    isWhitelisted: false,
    acceptedParticipantCount: 0,
    approvedParticipants: [],
    isTokenDisbursed: false
});

// Create task with whitelist
rewardManagement.createTask(
    taskId,
    task,
    treasuryAddress,
    whitelistedAddresses
);
```

### Participant Flow

```solidity
// Participant applies
rewardManagement.participate(taskId);

// Owner accepts participant
rewardManagement.acceptParticipant(taskId, participantAddress);

// Participant completes task
rewardManagement.completeTask(taskId, "ipfs://completion-proof");

// Owner verifies and approves
rewardManagement.verifyAndApproveTaskSubmission(
    taskId,
    participantAddress
);

// Disburse tokens to all verified participants
rewardManagement.disburseTokensToTaskParticipants(taskId, totalAmount);
```

### Factory Deployment

```solidity
// Entity configuration
Entity memory entity = Entity({
    name: "My Organization",
    entityOwners: [owner1, owner2, owner3]
});

// Deploy new RewardManagement instance
factory.createRewardManagement(
    entityId,
    appId,
    registryAddress,
    entity
);
```

## Benefits

1. **Separation of Concerns**: Each module handles a specific domain
2. **Maintainability**: Easier to locate and modify specific functionality
3. **Testability**: Modules can be tested independently
4. **Reusability**: Modules can be reused in other contracts
5. **Readability**: Smaller, focused files are easier to understand
6. **Gas Optimization**: Modular design allows for efficient bytecode
7. **Upgradeability**: New features can be added through new modules
8. **Multi-tenancy**: Single AppRegistry serves multiple applications

## Development

### Prerequisites

```bash
pnpm install
```

### Compile Contracts

```bash
pnpm compile
```

### Run Tests

```bash
pnpm test
```

### Deploy

```bash
pnpm deploy:local    # Deploy to local network
pnpm deploy:testnet  # Deploy to testnet
```

## Contract Addresses

Deployment addresses are stored in `deployments/` directory after deployment.

## Testing

The contracts include comprehensive test coverage:

- Unit tests for each module
- Integration tests for complete workflows
- Security tests for access control and reentrancy
- Edge case handling

Run tests with:

```bash
pnpm test
```

## Security Considerations

1. **Role Management**: Always verify roles are properly configured in AppRegistry
2. **Token Approvals**: Ensure treasury addresses approve sufficient tokens before task creation
3. **Expiry Dates**: Set reasonable expiry dates to prevent indefinite task duration
4. **Participant Limits**: Configure appropriate maxParticipants to prevent excessive gas costs
5. **Pause Mechanism**: Only contract owners can pause; use judiciously
6. **Reentrancy**: All token operations are protected with ReentrancyGuard

## License

MIT
