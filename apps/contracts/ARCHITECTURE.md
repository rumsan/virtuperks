# VirtuPerks Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Super Admin                             │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        App Contract                             │
│                     (UUPS Upgradeable)                          │
│                                                                 │
│  - createApp(appId, name)                                      │
│  - deactivateApp(appId)                                        │
│  - createEntity(appId, owner, name, url) → Entity Proxy       │
│  - getAppInfo(appId)                                           │
│  - isAppActive(appId)                                          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ creates multiple
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Entity Contracts                            │
│              (UUPS Upgradeable Proxies)                         │
│                                                                 │
│  Each Entity is a separate proxy contract                      │
│  Implements: ITaskManagement + IParticipantManagement          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│ Task Mgmt    │  │ Participant Mgmt │
│              │  │                  │
│ - createTask │  │ - participate    │
│ - closeTask  │  │ - completeTask   │
│ - update     │  │ - approve/reject │
└──────────────┘  └──────┬───────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │   Rewards   │
                  │ Distribution│
                  └─────────────┘
```

## Contract Relationships

```
App (Owner: Super Admin)
 │
 ├─► App 1 (appId: bytes32)
 │    │
 │    ├─► Entity 1 (Owner: Entity Owner 1)
 │    │    ├─► Task 1 (Owner: Task Owner A)
 │    │    ├─► Task 2 (Owner: Task Owner B)
 │    │    └─► Task N...
 │    │
 │    └─► Entity 2 (Owner: Entity Owner 2)
 │         ├─► Task 1
 │         └─► Task N...
 │
 └─► App 2 (appId: bytes32)
      └─► Entity N...
```

## Data Flow

### Task Creation Flow
```
Entity Owner → Entity.createTask()
                  │
                  ├─► Store task metadata
                  ├─► Initialize participants array
                  ├─► Set task status to OPEN
                  └─► Emit TaskCreated event
```

### Participant Flow
```
Participant → participate()
                  │
                  ├─► Check task is open
                  ├─► Check whitelist (if enabled)
                  ├─► Check max participants
                  ├─► Create TaskAssignment
                  │    └─► Status: PENDING or ACCEPTED
                  └─► Emit TaskAssignmentApplied

              ↓ (if requireApproval)
              
Task Owner → acceptParticipant()
                  │
                  └─► Update status to ACCEPTED

              ↓
              
Participant → completeTask(url)
                  │
                  ├─► Update status to COMPLETED
                  └─► Store completion URL

              ↓
              
Task Owner → approveTaskSubmission()
                  │
                  ├─► Update status to APPROVED
                  └─► Add to approvedParticipants array

              ↓
              
Task Owner → closeTask() → distributeRewards()
                               │
                               ├─► Calculate reward per participant
                               ├─► Transfer tokens to each
                               ├─► Update status to DISBURSED
                               └─► Emit RewardsDistributed
```

## State Transitions

### Task States
```
CREATED → OPEN → CLOSED/EXPIRED
           │
           └─► TOKENS_DISBURSED
```

### Assignment States
```
NONE
  ↓
PENDING (if requireApproval)
  ↓
ACCEPTED
  ↓
COMPLETED
  ↓
APPROVED/REJECTED
  ↓
DISBURSED (if APPROVED)
```

## Access Control Matrix

| Function                  | Super Admin | Entity Owner | Task Owner | Participant |
|---------------------------|-------------|--------------|------------|-------------|
| createApp                 | ✅          | ❌           | ❌         | ❌          |
| deactivateApp             | ✅          | ❌           | ❌         | ❌          |
| createEntity              | ✅          | ❌           | ❌         | ❌          |
| createTask                | ❌          | ✅           | ❌         | ❌          |
| closeTask                 | ❌          | ❌           | ✅         | ❌          |
| updateTaskDetails         | ❌          | ❌           | ✅         | ❌          |
| participate               | ❌          | ❌           | ❌         | ✅          |
| completeTask              | ❌          | ❌           | ❌         | ✅          |
| acceptParticipant         | ❌          | ❌           | ✅         | ❌          |
| approveTaskSubmission     | ❌          | ❌           | ✅         | ❌          |
| rejectTaskSubmission      | ❌          | ❌           | ✅         | ❌          |
| distributeRewards         | ❌          | ❌           | ✅         | ❌          |
| addToWhitelist            | ❌          | ✅           | ✅         | ❌          |
| removeFromWhitelist       | ❌          | ❌           | ✅         | ❌          |

## Token Flow

```
Token Owner
    │
    └─► mint/transfer → Entity Contract
                            │
                            └─► depositTokens()
                                    │
                                    └─► Held until distribution
                                            │
                                            └─► distributeRewards()
                                                    │
                                                    └─► Transfer to approved participants
```

## Events Hierarchy

### App Events
- `AppCreated(appId, owner, name)`
- `AppDeactivated(appId, by)`
- `EntityCreated(appId, entityAddress, owner)`

### Entity Events
- `EntityInitialized(appId, owner, name)`
- `EntityDeactivated(by)`

### Task Events
- `TaskCreated(taskId, createdBy)`
- `TaskClosed(taskId, closedBy)`
- `TaskDetailsUpdated(taskId, updatedBy)`

### Participant Events
- `TaskAssignmentApplied(taskId, participant)`
- `TaskAssignmentAccepted(taskId, participant)`
- `TaskAssignmentCompleted(taskId, participant)`
- `TaskAssignmentApproved(taskId, approver)`
- `TaskAssignmentRejected(taskId, participant, rejectedBy, reason)`
- `ParticipantWhitelisted(taskId, participant, by)`
- `ParticipantRemovedFromWhitelist(taskId, participant, by)`

### Reward Events
- `TokensDeposited(token, amount, by)`
- `RewardsDistributed(taskId, totalAmount, participantCount)`

## Security Layers

```
┌─────────────────────────────────────┐
│   Input Validation                  │
│   - require statements              │
│   - parameter checks                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Access Control                    │
│   - onlyOwner                       │
│   - onlyTaskOwner                   │
│   - custom modifiers                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   State Validation                  │
│   - task exists                     │
│   - task is open                    │
│   - not expired                     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Reentrancy Protection             │
│   - ReentrancyGuard                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Safe Token Operations             │
│   - SafeERC20                       │
└─────────────────────────────────────┘
```

## Upgradeability Pattern (UUPS)

```
┌─────────────────────────────────────┐
│         Proxy Contract              │
│  (ERC1967Proxy - Immutable)         │
│                                     │
│  - Stores state                     │
│  - Delegates to implementation      │
│  - Stores implementation address    │
└──────────────┬──────────────────────┘
               │ delegatecall
               ▼
┌─────────────────────────────────────┐
│    Implementation Contract          │
│    (App.sol or Entity.sol)          │
│                                     │
│  - Contains logic                   │
│  - No state storage                 │
│  - Can be upgraded                  │
│                                     │
│  function _authorizeUpgrade()       │
│    - Only owner can upgrade         │
└─────────────────────────────────────┘
```

## Deployment Sequence

```
1. Deploy App Implementation
        ↓
2. Deploy App Proxy → Initialize
        ↓
3. Create App(s) with appId
        ↓
4. Deploy Entity Implementation
        ↓
5. Create Entity via App.createEntity()
   → Deploys Entity Proxy → Initialize
        ↓
6. Deploy/Transfer Reward Tokens
        ↓
7. Create Tasks via Entity
        ↓
8. System Ready for Participants
```

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Upgradeability without data loss
- ✅ Secure access control
- ✅ Efficient token distribution
- ✅ Clear ownership hierarchy
- ✅ Event-driven tracking
- ✅ Modular and extensible design
