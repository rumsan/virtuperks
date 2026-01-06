# VirtuPerks Usage Examples

## Complete Usage Examples with Code

### Example 1: Simple Survey Task

**Scenario**: A company wants to reward 10 people for completing a survey with 100 tokens each.

```typescript
import { ethers } from "hardhat";

async function surveyTaskExample() {
  const [superAdmin, entityOwner, taskOwner, ...participants] = await ethers.getSigners();

  // 1. Deploy and setup system (one-time)
  const app = await deployApp(superAdmin);
  const appId = ethers.id("survey-company");
  await app.createApp(appId, "Survey Company");
  
  const entityAddress = await createEntity(app, appId, entityOwner, "Marketing Dept", "https://company.com");
  const entity = await ethers.getContractAt("Entity", entityAddress);

  // 2. Deploy reward token and fund entity
  const token = await deployRewardToken(superAdmin);
  await token.transfer(entityAddress, ethers.parseEther("1000"));

  // 3. Create survey task
  const taskId = ethers.id("survey-q4-2024");
  const task = {
    name: "Q4 Customer Survey",
    detailsUrl: "https://surveys.com/q4-2024",
    owner: taskOwner.address,
    expiryDate: Math.floor(Date.now() / 1000) + 7 * 86400, // 7 days
    rewardToken: await token.getAddress(),
    totalRewardAmount: ethers.parseEther("1000"), // 1000 tokens total
    isOpen: true,
    requireApproval: false, // Auto-accept participants
    isWhitelisted: false, // Open to all
    isTokenDisbursed: false,
    maxParticipants: 10,
    acceptedParticipantCount: 0,
    approvedParticipants: [],
  };

  await entity.connect(entityOwner).createTask(taskId, task, []);
  console.log("✅ Survey task created");

  // 4. Participants complete survey
  for (let i = 0; i < 10; i++) {
    const participant = participants[i];
    
    // Join task
    await entity.connect(participant).participate(taskId);
    console.log(`✅ Participant ${i + 1} joined`);
    
    // Complete with proof
    await entity.connect(participant).completeTask(
      taskId, 
      `https://surveys.com/submission/${participant.address}`
    );
    console.log(`✅ Participant ${i + 1} completed`);
    
    // Task owner approves
    await entity.connect(taskOwner).approveTaskSubmission(taskId, participant.address);
    console.log(`✅ Participant ${i + 1} approved`);
  }

  // 5. Close task and distribute rewards
  await entity.connect(taskOwner).closeTask(taskId);
  await entity.connect(taskOwner).distributeRewards(taskId);
  console.log("✅ Rewards distributed: 100 tokens each to 10 participants");
  
  // Verify balances
  for (let i = 0; i < 10; i++) {
    const balance = await token.balanceOf(participants[i].address);
    console.log(`Participant ${i + 1} balance:`, ethers.formatEther(balance));
  }
}
```

**Output**:
```
✅ Survey task created
✅ Participant 1 joined
✅ Participant 1 completed
✅ Participant 1 approved
... (repeat for 10 participants)
✅ Rewards distributed: 100 tokens each to 10 participants
Participant 1 balance: 100.0
Participant 2 balance: 100.0
...
```

---

### Example 2: Exclusive Beta Tester Task (Whitelisted)

**Scenario**: A project wants to reward only whitelisted beta testers.

```typescript
async function betaTesterExample() {
  const [superAdmin, entityOwner, taskOwner, ...testers] = await ethers.getSigners();

  // Setup (assuming system is already deployed)
  const entity = await ethers.getContractAt("Entity", entityAddress);
  const token = await ethers.getContractAt("RewardToken", tokenAddress);

  // Select only first 5 testers as whitelist
  const whitelistedTesters = testers.slice(0, 5);
  
  const taskId = ethers.id("beta-test-v2");
  const task = {
    name: "Beta Test Version 2.0",
    detailsUrl: "https://project.com/beta-test",
    owner: taskOwner.address,
    expiryDate: Math.floor(Date.now() / 1000) + 14 * 86400, // 14 days
    rewardToken: await token.getAddress(),
    totalRewardAmount: ethers.parseEther("500"),
    isOpen: true,
    requireApproval: false,
    isWhitelisted: true, // ⭐ Whitelist enabled
    isTokenDisbursed: false,
    maxParticipants: 5,
    acceptedParticipantCount: 0,
    approvedParticipants: [],
  };

  // Create task with whitelist
  const whitelistAddresses = whitelistedTesters.map(t => t.address);
  await entity.connect(entityOwner).createTask(taskId, task, whitelistAddresses);
  console.log("✅ Beta test task created with whitelist");

  // Whitelisted tester can join
  await entity.connect(whitelistedTesters[0]).participate(taskId);
  console.log("✅ Whitelisted tester joined");

  // Non-whitelisted tester CANNOT join
  try {
    await entity.connect(testers[10]).participate(taskId);
  } catch (error) {
    console.log("❌ Non-whitelisted tester rejected (as expected)");
  }

  // Complete flow
  await entity.connect(whitelistedTesters[0]).completeTask(
    taskId, 
    "https://feedback.com/report-1"
  );
  await entity.connect(taskOwner).approveTaskSubmission(taskId, whitelistedTesters[0].address);
  
  console.log("✅ Beta tester completed and approved");
}
```

---

### Example 3: Content Creation with Manual Approval

**Scenario**: A media company wants to manually review and approve content submissions.

```typescript
async function contentCreationExample() {
  const [superAdmin, entityOwner, taskOwner, creator1, creator2, creator3] = 
    await ethers.getSigners();

  const entity = await ethers.getContractAt("Entity", entityAddress);
  const token = await ethers.getContractAt("RewardToken", tokenAddress);

  const taskId = ethers.id("content-jan-2024");
  const task = {
    name: "Create Educational Content",
    detailsUrl: "https://media.com/content-guidelines",
    owner: taskOwner.address,
    expiryDate: Math.floor(Date.now() / 1000) + 30 * 86400, // 30 days
    rewardToken: await token.getAddress(),
    totalRewardAmount: ethers.parseEther("3000"),
    isOpen: true,
    requireApproval: true, // ⭐ Manual approval required
    isWhitelisted: false,
    isTokenDisbursed: false,
    maxParticipants: 20,
    acceptedParticipantCount: 0,
    approvedParticipants: [],
  };

  await entity.connect(entityOwner).createTask(taskId, task, []);
  console.log("✅ Content creation task created");

  // Three creators apply
  await entity.connect(creator1).participate(taskId);
  await entity.connect(creator2).participate(taskId);
  await entity.connect(creator3).participate(taskId);
  console.log("✅ 3 creators applied");

  // Check their status (all PENDING)
  let assignment = await entity.getParticipantTaskAssignment(taskId, creator1.address);
  console.log("Creator 1 status:", assignment.status); // 1 = PENDING

  // Task owner reviews applications and accepts 2
  await entity.connect(taskOwner).acceptParticipant(taskId, creator1.address);
  await entity.connect(taskOwner).acceptParticipant(taskId, creator2.address);
  console.log("✅ 2 creators accepted, 1 rejected");

  // Accepted creators submit content
  await entity.connect(creator1).completeTask(taskId, "https://content.com/video-1");
  await entity.connect(creator2).completeTask(taskId, "https://content.com/article-1");
  console.log("✅ Content submitted");

  // Task owner reviews quality
  // Approve creator1, reject creator2
  await entity.connect(taskOwner).approveTaskSubmission(taskId, creator1.address);
  await entity.connect(taskOwner).rejectTaskSubmission(
    taskId, 
    creator2.address, 
    "Content does not meet quality standards"
  );
  console.log("✅ 1 approved, 1 rejected");

  // Distribute rewards (only creator1 gets rewarded)
  await entity.connect(taskOwner).closeTask(taskId);
  await entity.connect(taskOwner).distributeRewards(taskId);
  
  const balance1 = await token.balanceOf(creator1.address);
  const balance2 = await token.balanceOf(creator2.address);
  
  console.log("Creator 1 reward:", ethers.formatEther(balance1)); // 3000 tokens
  console.log("Creator 2 reward:", ethers.formatEther(balance2)); // 0 tokens
}
```

---

### Example 4: Multiple Entities Under One App

**Scenario**: A large organization with multiple departments running tasks.

```typescript
async function multiEntityExample() {
  const [superAdmin, marketingOwner, hrOwner, ...users] = await ethers.getSigners();

  // 1. Create one app for the organization
  const app = await deployApp(superAdmin);
  const appId = ethers.id("acme-corp");
  await app.createApp(appId, "Acme Corporation");
  console.log("✅ Organization app created");

  // 2. Create multiple entities (departments)
  const marketingEntity = await createEntity(
    app, 
    appId, 
    marketingOwner, 
    "Marketing Department", 
    "https://acme.com/marketing"
  );
  
  const hrEntity = await createEntity(
    app, 
    appId, 
    hrOwner, 
    "HR Department", 
    "https://acme.com/hr"
  );
  
  console.log("✅ 2 departments (entities) created");

  // 3. Each department creates their own tasks
  const marketing = await ethers.getContractAt("Entity", marketingEntity);
  const hr = await ethers.getContractAt("Entity", hrEntity);
  const token = await ethers.getContractAt("RewardToken", tokenAddress);

  // Marketing task: Social media campaign
  const marketingTaskId = ethers.id("social-campaign");
  await marketing.connect(marketingOwner).createTask(marketingTaskId, {
    name: "Social Media Campaign",
    detailsUrl: "https://acme.com/social-campaign",
    owner: marketingOwner.address,
    expiryDate: Math.floor(Date.now() / 1000) + 7 * 86400,
    rewardToken: await token.getAddress(),
    totalRewardAmount: ethers.parseEther("500"),
    isOpen: true,
    requireApproval: false,
    isWhitelisted: false,
    isTokenDisbursed: false,
    maxParticipants: 50,
    acceptedParticipantCount: 0,
    approvedParticipants: [],
  }, []);

  // HR task: Employee feedback
  const hrTaskId = ethers.id("employee-feedback");
  await hr.connect(hrOwner).createTask(hrTaskId, {
    name: "Employee Feedback Survey",
    detailsUrl: "https://acme.com/feedback",
    owner: hrOwner.address,
    expiryDate: Math.floor(Date.now() / 1000) + 14 * 86400,
    rewardToken: await token.getAddress(),
    totalRewardAmount: ethers.parseEther("200"),
    isOpen: true,
    requireApproval: false,
    isWhitelisted: false,
    isTokenDisbursed: false,
    maxParticipants: 100,
    acceptedParticipantCount: 0,
    approvedParticipants: [],
  }, []);

  console.log("✅ Both departments have active tasks");

  // 4. Users can participate in tasks from different entities
  await marketing.connect(users[0]).participate(marketingTaskId);
  await hr.connect(users[0]).participate(hrTaskId);
  
  console.log("✅ User participated in tasks from both departments");
}
```

---

### Example 5: Task Expiry and Automatic Closure

**Scenario**: Handling tasks that expire automatically.

```typescript
async function expiryExample() {
  const { entity, token, taskOwner, participants } = await setupSystem();

  const taskId = ethers.id("time-limited-task");
  const task = {
    name: "Limited Time Offer",
    detailsUrl: "https://task.com/limited",
    owner: taskOwner.address,
    expiryDate: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    rewardToken: await token.getAddress(),
    totalRewardAmount: ethers.parseEther("100"),
    isOpen: true,
    requireApproval: false,
    isWhitelisted: false,
    isTokenDisbursed: false,
    maxParticipants: 10,
    acceptedParticipantCount: 0,
    approvedParticipants: [],
  };

  await entity.connect(taskOwner).createTask(taskId, task, []);
  console.log("✅ Time-limited task created (1 hour)");

  // Participant joins and completes quickly
  await entity.connect(participants[0]).participate(taskId);
  await entity.connect(participants[0]).completeTask(taskId, "https://proof.com/1");
  await entity.connect(taskOwner).approveTaskSubmission(taskId, participants[0].address);
  console.log("✅ Participant 1 completed before expiry");

  // Check if task is expired
  let isExpired = await entity.isTaskExpired(taskId);
  console.log("Task expired?", isExpired); // false

  // Fast forward time (simulate 2 hours passing)
  await ethers.provider.send("evm_increaseTime", [7200]);
  await ethers.provider.send("evm_mine", []);

  // Check again
  isExpired = await entity.isTaskExpired(taskId);
  console.log("Task expired?", isExpired); // true

  // Try to participate after expiry - should fail
  try {
    await entity.connect(participants[1]).participate(taskId);
  } catch (error) {
    console.log("❌ Cannot join expired task (as expected)");
  }

  // Can still distribute to those who completed before expiry
  await entity.connect(taskOwner).distributeRewards(taskId);
  console.log("✅ Rewards distributed to participant who completed on time");
}
```

---

### Example 6: Query Task Information

**Scenario**: Getting information about tasks and participants.

```typescript
async function queryExample() {
  const { entity, taskId, participants } = await setupTaskWithParticipants();

  // Get full task info
  const task = await entity.getTask(taskId);
  console.log("Task Name:", task.name);
  console.log("Total Reward:", ethers.formatEther(task.totalRewardAmount));
  console.log("Max Participants:", task.maxParticipants.toString());
  console.log("Accepted Count:", task.acceptedParticipantCount.toString());
  console.log("Is Open:", task.isOpen);
  console.log("Tokens Disbursed:", task.isTokenDisbursed);

  // Get all tasks for entity
  const allTasks = await entity.getAllTasks();
  console.log("Total tasks in entity:", allTasks.length);

  // Get all participants for a task
  const taskParticipants = await entity.getTaskParticipants(taskId);
  console.log("Participants:", taskParticipants.length);

  // Get specific participant's assignment
  const assignment = await entity.getParticipantTaskAssignment(
    taskId, 
    participants[0].address
  );
  console.log("Participant Status:", assignment.status);
  console.log("Completion URL:", assignment.completionUrl);

  // Check if participant is whitelisted
  const isWhitelisted = await entity.isParticipantWhitelisted(
    taskId, 
    participants[0].address
  );
  console.log("Is Whitelisted:", isWhitelisted);

  // Check task status
  console.log("Is Task Open:", await entity.isTaskOpen(taskId));
  console.log("Is Task Expired:", await entity.isTaskExpired(taskId));
  console.log("Max Participants Reached:", await entity.isMaxParticipantsReached(taskId));
}
```

---

### Example 7: Error Handling

**Scenario**: Handling common errors gracefully.

```typescript
async function errorHandlingExample() {
  const { entity, taskId, taskOwner, participant } = await setupSystem();

  // Try to participate twice
  await entity.connect(participant).participate(taskId);
  try {
    await entity.connect(participant).participate(taskId);
  } catch (error) {
    console.log("✅ Error: Already participating (expected)");
  }

  // Try to complete task without being accepted
  const newParticipant = (await ethers.getSigners())[10];
  try {
    await entity.connect(newParticipant).completeTask(taskId, "url");
  } catch (error) {
    console.log("✅ Error: Not an accepted participant (expected)");
  }

  // Try to approve without being task owner
  try {
    await entity.connect(newParticipant).approveTaskSubmission(taskId, participant.address);
  } catch (error) {
    console.log("✅ Error: Not task owner (expected)");
  }

  // Try to distribute rewards before closing task
  try {
    await entity.connect(taskOwner).distributeRewards(taskId);
  } catch (error) {
    console.log("✅ Error: Task still open (expected)");
  }

  // Close task and distribute
  await entity.connect(taskOwner).closeTask(taskId);
  await entity.connect(taskOwner).distributeRewards(taskId);

  // Try to distribute again
  try {
    await entity.connect(taskOwner).distributeRewards(taskId);
  } catch (error) {
    console.log("✅ Error: Rewards already distributed (expected)");
  }
}
```

---

## Helper Functions

```typescript
// Deploy App contract
async function deployApp(owner: SignerWithAddress) {
  const App = await ethers.getContractFactory("App", owner);
  const app = await upgrades.deployProxy(App, [], {
    initializer: "initialize",
    kind: "uups",
  });
  await app.waitForDeployment();
  return app;
}

// Create Entity
async function createEntity(
  app: any,
  appId: string,
  owner: SignerWithAddress,
  name: string,
  url: string
): Promise<string> {
  const tx = await app.createEntity(appId, owner.address, name, url);
  const receipt = await tx.wait();
  
  const entityCreatedEvent = receipt?.logs.find((log: any) => {
    try {
      const parsed = app.interface.parseLog(log);
      return parsed?.name === "EntityCreated";
    } catch {
      return false;
    }
  });
  
  if (entityCreatedEvent) {
    const parsed = app.interface.parseLog(entityCreatedEvent);
    return parsed?.args[1];
  }
  throw new Error("Entity creation failed");
}

// Deploy Reward Token
async function deployRewardToken(owner: SignerWithAddress) {
  const RewardToken = await ethers.getContractFactory("RewardToken", owner);
  const token = await RewardToken.deploy("VirtuPerks Token", "VPT");
  await token.waitForDeployment();
  return token;
}
```

---

These examples demonstrate the complete functionality of the VirtuPerks system in real-world scenarios!
