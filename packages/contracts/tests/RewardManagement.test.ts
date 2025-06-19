import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { deployRewardManagementFixture } from './fixtures/RewardManagementFixture';

describe('RewardManagement Contract', function() {
  // Use loadFixture for each test
  async function fixture() {
    return loadFixture(deployRewardManagementFixture);
  }

  describe('Deployment', function() {
    it('should deploy successfully and set initial state', async function() {
      const { rewardManagement, appRegistry, APP_ID, user2 , participant1,} = await fixture();
      expect(await rewardManagement.appId()).to.equal(APP_ID);
      expect(await rewardManagement.name()).to.equal("Test Entity");
     
      
      const ownerRole = await rewardManagement.OWNER();
     
      const participantRole = await rewardManagement.PARTICIPANT();
   
    
      
      // Verify roles are set correctly
      expect(await appRegistry.hasRole(APP_ID, ownerRole, user2.address)).to.be.true;
      expect(await appRegistry.hasRole(APP_ID, participantRole, participant1.address)).to.be.true;
    });
  });

  describe('Task Creation and Management', function() {
    it('should create task with valid parameters', async function() {
      const { rewardManagement, user2, rewardToken, appRegistry, APP_ID } = await fixture();
      
    
      
      // Now create the task
      const taskId = ethers.id('TEST_TASK');
      const future = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
      
      const task = {
        name: "Test Task",
        detailsUrl: "https://test.com",
        owner: user2.address,
        expiryDate: future,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount:BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted:true,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      await expect(rewardManagement.connect(user2).createTask(taskId, task, []))
        .to.emit(rewardManagement, 'TaskCreated')
        .withArgs(taskId, user2.address);

      const createdTask = await rewardManagement.getTask(taskId);
      expect(createdTask.name).to.equal(task.name);
    });

    it('should update task details correctly', async function() {
      const { rewardManagement, user2, rewardToken } = await fixture();
      const taskId = ethers.id('UPDATE_TASK');
      
      // Create initial task
      const task = {
        name: "Update Task",
        detailsUrl: "https://old-details.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      await rewardManagement.connect(user2).createTask(taskId, task, []);
      
      // New details
      const newDetailsUrl = "https://new-details.com";
      const newExpiryDate = Math.floor(Date.now() / 1000) + 172800; // 48 hours from now
      
      // Update task details
      await expect(rewardManagement.connect(user2).updateTaskDetails(
        taskId,
        newDetailsUrl,
        newExpiryDate
      )).to.emit(rewardManagement, 'TaskDetailsUpdated')
        .withArgs(taskId, user2.address);

      // Verify updates
      const updatedTask = await rewardManagement.getTask(taskId);
      expect(updatedTask.detailsUrl).to.equal(newDetailsUrl);
      expect(updatedTask.expiryDate).to.equal(newExpiryDate);
    });

    it('should add participants to whitelist correctly', async function() {
      const { rewardManagement, user2, participant1, rewardToken } = await fixture();
      const taskId = ethers.id('WHITELIST_TASK');
      
      const task = {
        name: "Whitelist Task",
        detailsUrl: "https://whitelist.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: true, // Set task as whitelisted
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      // Create whitelisted task
      await rewardManagement.connect(user2).createTask(taskId, task, []);

      // Add participant to whitelist
      await expect(rewardManagement.connect(user2).addToWhitelist(taskId, participant1.address, true))
        .to.emit(rewardManagement, 'ParticipantWhitelisted')
        .withArgs(taskId, participant1.address, user2.address);

      // Verify participant is whitelisted
      expect(await rewardManagement.isWhitelisted(taskId, participant1.address)).to.be.true;

      // Participant should now be able to participate
      await expect(rewardManagement.connect(participant1).participate(taskId))
        .to.emit(rewardManagement, 'ParticipantApplied')
        .withArgs(taskId, participant1.address);

      // Non-whitelisted participant should not be able to participate
      const [nonWhitelisted] = await ethers.getSigners();
      await expect(rewardManagement.connect(nonWhitelisted).participate(taskId))
        .to.be.revertedWith("User is not whitelisted for this task.");
    });

    it('should remove participant from whitelist correctly', async function() {
      const { rewardManagement, user2, participant1, rewardToken } = await fixture();
      const taskId = ethers.id('REMOVE_WHITELIST_TASK');
      
      const task = {
        name: "Remove Whitelist Task",
        detailsUrl: "https://whitelist-remove.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: true,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      // Create task and add to whitelist
      await rewardManagement.connect(user2).createTask(taskId, task, []);
      await rewardManagement.connect(user2).addToWhitelist(taskId, participant1.address, true);
      
      // Verify initially whitelisted
      expect(await rewardManagement.isWhitelisted(taskId, participant1.address)).to.be.true;

      // Remove from whitelist
      await expect(rewardManagement.connect(user2).removeFromWhitelist(taskId, participant1.address))
        .to.emit(rewardManagement, 'ParticipantRemovedFromWhitelist')
        .withArgs(taskId, participant1.address, user2.address);

      // Verify no longer whitelisted
      expect(await rewardManagement.isWhitelisted(taskId, participant1.address)).to.be.false;

      // Verify participant can no longer participate
      await expect(rewardManagement.connect(participant1).participate(taskId))
        .to.be.revertedWith("User is not whitelisted for this task.");
    });

    it('should retrieve task details correctly', async function() {
      const { rewardManagement, user2, rewardToken } = await fixture();
      const taskId = ethers.id('GET_TASK_TEST');
      
      const task = {
        name: "Get Task Test",
        detailsUrl: "https://get-task.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      // Create task
      await rewardManagement.connect(user2).createTask(taskId, task, []);
      
      // Get task details
      const retrievedTask = await rewardManagement.getTask(taskId);
      
      // Verify all task properties
      expect(retrievedTask.name).to.equal(task.name);
      expect(retrievedTask.detailsUrl).to.equal(task.detailsUrl);
      expect(retrievedTask.owner).to.equal(task.owner);
      expect(retrievedTask.expiryDate).to.equal(task.expiryDate);
      expect(retrievedTask.rewardToken).to.equal(task.rewardToken);
      expect(retrievedTask.totalRewardAmount).to.equal(task.totalRewardAmount);
      expect(retrievedTask.isOpen).to.equal(task.isOpen);
      expect(retrievedTask.requireApproval).to.equal(task.requireApproval);
      expect(retrievedTask.isWhitelisted).to.equal(task.isWhitelisted);
    });

    it('should correctly list open tasks', async function() {
      const { rewardManagement, user2, rewardToken } = await fixture();
      
      // Create multiple tasks
      const taskId1 = ethers.id('OPEN_TASK_1');
      const taskId2 = ethers.id('OPEN_TASK_2');
      const taskId3 = ethers.id('CLOSED_TASK');
      
      const baseTask = {
        detailsUrl: "https://open-tasks.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      // Create three tasks
      await rewardManagement.connect(user2).createTask(taskId1, { ...baseTask, name: "Open Task 1" }, []);
      await rewardManagement.connect(user2).createTask(taskId2, { ...baseTask, name: "Open Task 2" }, []);
      await rewardManagement.connect(user2).createTask(taskId3, { ...baseTask, name: "To Be Closed" }, []);
      
      // Close one task
      await rewardManagement.connect(user2).closeTask(taskId3);
      
      // Get open tasks
      const openTasks = await rewardManagement.getOpenTasks();
      
      // Verify correct tasks are listed
      expect(openTasks).to.include(taskId1);
      expect(openTasks).to.include(taskId2);
      expect(openTasks).to.not.include(taskId3);
      expect(openTasks.length).to.equal(2);
    });

    it('should close task correctly', async function() {
      const { rewardManagement, user2, rewardToken } = await fixture();
      const taskId = ethers.id('CLOSE_TASK');
      
      const task = {
        name: "Close Task",
        detailsUrl: "https://close.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      // Create task
      await rewardManagement.connect(user2).createTask(taskId, task, []);
      
      // Close task
      await expect(rewardManagement.connect(user2).closeTask(taskId))
        .to.emit(rewardManagement, 'TaskClosed')
        .withArgs(taskId, user2.address);

      // Verify task is closed
      const closedTask = await rewardManagement.getTask(taskId);
      expect(closedTask.isOpen).to.be.false;

      // Verify task is removed from open tasks
      const openTasks = await rewardManagement.getOpenTasks();
      expect(openTasks).to.not.include(taskId);
    });

    it('should close expired tasks automatically', async function() {
      const { rewardManagement, user2, rewardToken } = await fixture();
      const taskId1 = ethers.id('EXPIRED_TASK_1');
      const taskId2 = ethers.id('EXPIRED_TASK_2');
      
      // Get current block timestamp
      const latestBlock = await ethers.provider.getBlock('latest');
      const currentTimestamp = latestBlock!.timestamp;
      
      // Set expiry dates relative to current block timestamp
      const nearFuture = currentTimestamp + 3600; // 1 hour from now
      const farFuture = currentTimestamp + 86400; // 24 hours from now

      const task1 = {
        name: "Soon To Expire Task",
        detailsUrl: "https://expired.com",
        owner: user2.address,
        expiryDate: nearFuture,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      const task2 = {
        ...task1,
        name: "Active Task",
        expiryDate: farFuture
      };

      // Create both tasks
      await rewardManagement.connect(user2).createTask(taskId1, task1, []);
      await rewardManagement.connect(user2).createTask(taskId2, task2, []);

      // Verify both tasks are created and open
      expect((await rewardManagement.getTask(taskId1)).isOpen).to.be.true;
      expect((await rewardManagement.getTask(taskId2)).isOpen).to.be.true;

     // Increase time past the first task's expiry
      await ethers.provider.send("evm_setNextBlockTimestamp", [nearFuture + 1]);
      await ethers.provider.send("evm_mine");
     

      // // Close expired tasks
       await rewardManagement.closeExpiredTasks();

      // Verify task states
      const expiredTaskAfter = await rewardManagement.getTask(taskId1);
      const activeTaskAfter = await rewardManagement.getTask(taskId2);
      
      expect(expiredTaskAfter.isOpen).to.be.false;
      expect(activeTaskAfter.isOpen).to.be.true;

      // Verify open tasks list
      const openTasks = await rewardManagement.getOpenTasks();
      expect(openTasks).to.not.include(taskId1);
      expect(openTasks).to.include(taskId2);
    });

    it('should correctly check if task is expired', async function() {
      const { rewardManagement, user2, rewardToken } = await fixture();
      const taskId = ethers.id('EXPIRY_CHECK_TASK');
      
      // Get current block timestamp
      const latestBlock = await ethers.provider.getBlock('latest');
      const currentTimestamp = latestBlock!.timestamp;
      const nearFuture = currentTimestamp + 3600; // 1 hour from now

      const task = {
        name: "Expiry Check Task",
        detailsUrl: "https://expiry.com",
        owner: user2.address,
        expiryDate: nearFuture,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      // Create task
      await rewardManagement.connect(user2).createTask(taskId, task, []);
      
      // Check not expired initially
      expect(await rewardManagement.isTaskExpired(taskId)).to.be.false;

      // Move time past expiry
      await ethers.provider.send("evm_setNextBlockTimestamp", [nearFuture + 1]);
      await ethers.provider.send("evm_mine");

      // Check expired after time move
      expect(await rewardManagement.isTaskExpired(taskId)).to.be.true;
    });

    it('should correctly identify expired tasks', async function() {
      const { rewardManagement, user2, rewardToken } = await fixture();
      const taskId = ethers.id('EXPIRE_CHECK_TASK');
      
      const latestBlock = await ethers.provider.getBlock('latest');
      const currentTimestamp = latestBlock!.timestamp;
      const nearFuture = currentTimestamp + 3600; // 1 hour from now

      const task = {
        name: "Expire Check Task",
        detailsUrl: "https://expire.com",
        owner: user2.address,
        expiryDate: nearFuture,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      await rewardManagement.connect(user2).createTask(taskId, task, []);
      
      // Initially not expired
      expect(await rewardManagement.isTaskExpired(taskId)).to.be.false;

      // Move time forward past expiry
      await ethers.provider.send("evm_setNextBlockTimestamp", [nearFuture + 1]);
      await ethers.provider.send("evm_mine");

      // Should now be expired
      expect(await rewardManagement.isTaskExpired(taskId)).to.be.true;
    });

    it('should correctly track verified participants', async function() {
      const { rewardManagement, user2, participant1, participant2, rewardToken } = await fixture();
      const taskId = ethers.id('VERIFIED_PARTICIPANTS_TASK');
      
      const task = {
        name: "Verified Participants Task",
        detailsUrl: "https://verified.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      await rewardManagement.connect(user2).createTask(taskId, task, []);

      // Initially empty
      expect((await rewardManagement.getTaskVerifiedParticipants(taskId)).length).to.equal(0);

      // Complete flow for first participant
      await rewardManagement.connect(participant1).participate(taskId);
      await rewardManagement.connect(user2).acceptParticipant(taskId, participant1.address);
      await rewardManagement.connect(participant1).completeTask(taskId, "https://completion1.com");
      await rewardManagement.connect(user2).verifyTask(taskId, participant1.address);

      // Complete flow for second participant
      await rewardManagement.connect(participant2).participate(taskId);
      await rewardManagement.connect(user2).acceptParticipant(taskId, participant2.address);
      await rewardManagement.connect(participant2).completeTask(taskId, "https://completion2.com");
      await rewardManagement.connect(user2).verifyTask(taskId, participant2.address);

      // Check verified participants list
      const verifiedParticipants = await rewardManagement.getTaskVerifiedParticipants(taskId);
      expect(verifiedParticipants).to.include(participant1.address);
      expect(verifiedParticipants).to.include(participant2.address);
      expect(verifiedParticipants.length).to.equal(2);
    });

    it('should correctly check maximum participants limit', async function() {
      const { rewardManagement, user2, participant1, participant2, rewardToken } = await fixture();
      const taskId = ethers.id('MAX_PARTICIPANTS_TASK');
      
      const task = {
        name: "Max Participants Task",
        detailsUrl: "https://max.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 1, // Set max to 1 for testing
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      await rewardManagement.connect(user2).createTask(taskId, task, []);

      // Initially not reached
      expect(await rewardManagement.isMaxParticipantsReached(taskId)).to.be.false;

      // Accept first participant
      await rewardManagement.connect(participant1).participate(taskId);
      await rewardManagement.connect(user2).acceptParticipant(taskId, participant1.address);

      // Should now be reached
      expect(await rewardManagement.isMaxParticipantsReached(taskId)).to.be.true;

      // Second participant should not be able to participate
      await expect(rewardManagement.connect(participant2).participate(taskId))
        .to.be.revertedWith("Maximum participants limit reached");
    });
  });

  describe('Task Participation', function() {
    it('should allow participation in open task', async function() {
      const { rewardManagement, user2, participant1, rewardToken } = await fixture();
      const taskId = ethers.id('PARTICIPATE_TASK');
      
      // Create task first
      const task = {
        name: "Participate Task",
        detailsUrl: "https://participate.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      await rewardManagement.connect(user2).createTask(taskId, task, []);
      
      await expect(rewardManagement.connect(participant1).participate(taskId))
        .to.emit(rewardManagement, 'ParticipantApplied')
        .withArgs(taskId, participant1.address);
    });

    it('should allow owner to accept participant', async function() {
      const { rewardManagement, user2, participant1, rewardToken } = await fixture();
      const taskId = ethers.id('ACCEPT_TASK');
      
      // Create task
      const task = {
        name: "Accept Task",
        detailsUrl: "https://accept.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      await rewardManagement.connect(user2).createTask(taskId, task, []);
      
      // Verify initial status is NONE (0)
      let initialStatus = await rewardManagement.getParticipantStatus(taskId, participant1.address);
      expect(initialStatus).to.equal(0); // AssignmentStatus.NONE = 0
   
      // Participant applies
      await rewardManagement.connect(participant1).participate(taskId);
      
      // Verify status is PENDING (2) after participation
      let pendingStatus = await rewardManagement.getParticipantStatus(taskId, participant1.address);
 
       expect(pendingStatus).to.equal(1); // AssignmentStatus.PENDING = 2
      
      // Owner accepts participant
      await expect(rewardManagement.connect(user2).acceptParticipant(taskId, participant1.address))
        .to.emit(rewardManagement, 'TaskAccepted')
        .withArgs(taskId, participant1.address);

      // Verify participant status is ACCEPTED (1)
      const acceptedStatus = await rewardManagement.getParticipantStatus(taskId, participant1.address);
      expect(acceptedStatus).to.equal(2); // AssignmentStatus.ACCEPTED = 1

      // Verify accepted participant count increased
      const updatedTask = await rewardManagement.getTask(taskId);
      expect(updatedTask.acceptedParticipantCount).to.equal(1);
    });

    it('should allow task owner to verify completed task', async function() {
      const { rewardManagement, user2, participant1, rewardToken } = await fixture();
      const taskId = ethers.id('VERIFY_TASK');
      
      const task = {
        name: "Verify Task",
        detailsUrl: "https://verify.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      // Create and setup task
      await rewardManagement.connect(user2).createTask(taskId, task, []);
      await rewardManagement.connect(participant1).participate(taskId);
      await rewardManagement.connect(user2).acceptParticipant(taskId, participant1.address);
      
      // Complete task
      const completionUrl = "https://completion.com";
      await rewardManagement.connect(participant1).completeTask(taskId, completionUrl);
      
      // Verify initial state
      let statusBeforeVerification = await rewardManagement.getParticipantStatus(taskId, participant1.address);
      expect(statusBeforeVerification).to.equal(3); // AssignmentStatus.COMPLETED = 3
      
      // Task owner verifies the task
      await expect(rewardManagement.connect(user2).verifyTask(taskId, participant1.address))
        .to.emit(rewardManagement, 'TaskVerified')
        .withArgs(taskId, participant1.address, user2.address);

      // Verify final state
      const statusAfterVerification = await rewardManagement.getParticipantStatus(taskId, participant1.address);
      expect(statusAfterVerification).to.equal(4); // AssignmentStatus.VERIFIED = 4

      // Verify participant is added to verifiedParticipants array
      const verifiedParticipants = await rewardManagement.getTaskVerifiedParticipants(taskId);
      expect(verifiedParticipants).to.include(participant1.address);
      
      // Check task's verified participants count
      const updatedTask = await rewardManagement.getTask(taskId);
      expect(updatedTask.verifiedParticipants.length).to.equal(1);
    });
  });

  describe('Token Distribution', function() {
    it('should disburse tokens correctly to verified participants', async function() {
      const { rewardManagement, rewardToken, user2, participant1 } = await fixture();
      const taskId = ethers.id('DISBURSE_TASK');
      
      const task = {
        name: "Disburse Task",
        detailsUrl: "https://disburse.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      // Setup complete task flow
      await rewardManagement.connect(user2).createTask(taskId, task, []);
      await rewardManagement.connect(participant1).participate(taskId);
      await rewardManagement.connect(user2).acceptParticipant(taskId, participant1.address);
      await rewardManagement.connect(participant1).completeTask(taskId, "https://completion.com");
      await rewardManagement.connect(user2).verifyTask(taskId, participant1.address);

      // Get initial balances
      const initialParticipantBalance = await rewardToken.balanceOf(participant1.address);
      console.log('Initial Participant Balance:', initialParticipantBalance.toString());
      
      // Disburse tokens
      await expect(rewardManagement.connect(user2).disburseTokensToTask(taskId, BigInt(100)))
        .to.emit(rewardManagement, 'DisbursementToTask')
        .withArgs(taskId, BigInt(100), user2.address);

      // Verify final balances
      const finalParticipantBalance = await rewardToken.balanceOf(participant1.address);
      expect(finalParticipantBalance - initialParticipantBalance).to.equal(BigInt(100));

      // Verify task state
      const updatedTask = await rewardManagement.getTask(taskId);
      expect(updatedTask.isTokenDisbursed).to.be.true;
      expect(updatedTask.isOpen).to.be.false;
    });

    it('should transfer tokens to specified address', async function() {
      const { rewardManagement, rewardToken, user2, participant2 } = await fixture();
      
      // Get initial balances
      const initialReceiverBalance = await rewardToken.balanceOf(participant2.address);
      const initialContractBalance = await rewardToken.balanceOf(rewardManagement.target);
      
      const transferAmount = BigInt(50);
      const remarks = "Test transfer";

      // Transfer tokens
      await expect(rewardManagement.connect(user2).transferToken(
        await rewardToken.getAddress(),
        participant2.address,
        transferAmount,
        remarks
      ))
        .to.emit(rewardManagement, 'TokenTransferred')
        .withArgs(
          await rewardToken.getAddress(),
          participant2.address,
          transferAmount,
          remarks,
          user2.address
        );

      // Verify balances after transfer
      const finalReceiverBalance = await rewardToken.balanceOf(participant2.address);
      const finalContractBalance = await rewardToken.balanceOf(rewardManagement.target);

      expect(finalReceiverBalance - initialReceiverBalance).to.equal(transferAmount);
      expect(initialContractBalance - finalContractBalance).to.equal(transferAmount);
    });

    it('should disburse additional tokens to verified participants', async function() {
      const { rewardManagement, rewardToken, user2, participant1 } = await fixture();
      const taskId = ethers.id('ADDITIONAL_DISBURSE_TASK');
      
      const task = {
        name: "Additional Disburse Task",
        detailsUrl: "https://additional-disburse.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      // Setup complete task flow and initial disbursement
      await rewardManagement.connect(user2).createTask(taskId, task, []);
      await rewardManagement.connect(participant1).participate(taskId);
      await rewardManagement.connect(user2).acceptParticipant(taskId, participant1.address);
      await rewardManagement.connect(participant1).completeTask(taskId, "https://completion.com");
      await rewardManagement.connect(user2).verifyTask(taskId, participant1.address);
      await rewardManagement.connect(user2).disburseTokensToTask(taskId, BigInt(100));

      // Get balance before additional disbursement
      const balanceBeforeAdditional = await rewardToken.balanceOf(participant1.address);
      
      // Disburse additional tokens
      const additionalAmount = BigInt(50);
      const remarks = "Additional reward for excellent work";
      
      await expect(rewardManagement.connect(user2).disburseAdditionalTokenToTask(
        taskId,
        additionalAmount,
        remarks
      ))
        .to.emit(rewardManagement, 'AdditionalDisbursementToTask')
        .withArgs(taskId, additionalAmount, remarks, user2.address);

      // Verify final balance
      const finalBalance = await rewardToken.balanceOf(participant1.address);

      expect(finalBalance - balanceBeforeAdditional).to.equal(additionalAmount);
    });

    it('should correctly calculate total unallocated tokens', async function() {
      const { rewardManagement, rewardToken, user2 } = await fixture();
      
      // Get initial unallocated tokens
      const initialUnallocated = await rewardManagement.getTotalUnallocatedTokens(rewardToken.target);
  
      
      // Create a task that will allocate some tokens
      const taskId = ethers.id('UNALLOCATED_CHECK_TASK');
      const task = {
        name: "Unallocated Check Task",
        detailsUrl: "https://unallocated.com",
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        verifiedParticipants: []
      };

      // Create task (this will allocate tokens)
      await rewardManagement.connect(user2).createTask(taskId, task, []);
      
      // Check unallocated tokens decreased by task amount
    
      const afterTaskUnallocated = await rewardManagement.getTotalUnallocatedTokens(rewardToken.target);
   
     
      
     
     expect(afterTaskUnallocated).to.equal(BigInt(69900));

      // Close and disburse task (this should free up allocated tokens)
      await rewardManagement.connect(user2).closeTask(taskId);
      
      const finalUnallocated = await rewardManagement.getTotalUnallocatedTokens(rewardToken.target);
     
    expect(finalUnallocated).to.equal(afterTaskUnallocated);
    });
  });

});
