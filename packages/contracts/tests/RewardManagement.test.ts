import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { deployRewardManagementFixture } from './fixtures/RewardManagementFixture';

describe('RewardManagement Contract', function () {
  // Use loadFixture for each test
  async function fixture() {
    return loadFixture(deployRewardManagementFixture);
  }

  describe('Deployment', function () {
    it('should deploy successfully and set initial state', async function () {
      const { rewardManagement, appRegistry, APP_ID, user2, participant1 } =
        await fixture();
      expect(await rewardManagement.appId()).to.equal(APP_ID);
      expect(await rewardManagement.name()).to.equal('Test Entity');

      const ownerRole = await rewardManagement.OWNER();

      const participantRole = await rewardManagement.PARTICIPANT();

      // Verify roles are set correctly
      expect(await appRegistry.hasRole(APP_ID, ownerRole, user2.address)).to.be
        .true;
      expect(
        await appRegistry.hasRole(
          APP_ID,
          participantRole,
          participant1.address,
        ),
      ).to.be.true;
    });
  });

  describe('Task Creation and Management', function () {
    beforeEach(async function () {
      const {
        user2,
        rewardManagement,

        rewardToken,
      } = await fixture();
      //set up treasury
      const [treasuryOwner] = await ethers.getSigners();
      const minAmount = BigInt(1000);
      await rewardToken.connect(user2).mint(treasuryOwner.address, minAmount);
      //Approve contract to spend treasury's tokens
      await rewardToken
        .connect(treasuryOwner)
        .approve(rewardManagement.target, minAmount);
      await rewardManagement
        .connect(user2)
        .acceptTokenTransfer(
          treasuryOwner.address,
          await rewardToken.getAddress(),
          minAmount,
        );
    });
    it('should create task and allocate tokens from treasury', async function () {
      const {
        user2,
        rewardManagement,
        user1,
        rewardToken,
        appRegistry,
        APP_ID,
      } = await fixture();

      const taskId = ethers.id('TEST_TASK');
      const future = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

      const task = {
        name: 'Treasury Task',
        detailsUrl: 'https://test.com',
        owner: user2.address,
        expiryDate: future,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: true,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await expect(rewardManagement.connect(user2).createTask(taskId, task, []))
        .to.emit(rewardManagement, 'TaskCreated')
        .withArgs(taskId, user2.address);

      const createdTask = await rewardManagement.tasks(taskId);
      expect(createdTask.name).to.equal(task.name);
    });

    it('should update task details correctly', async function () {
      const { rewardManagement, user2, rewardToken } = await fixture();

      const taskId = ethers.id('UPDATE_TASK');

      // Create initial task
      const task = {
        name: 'Update Task',
        detailsUrl: 'https://old-details.com',
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
        approvedParticipants: [],
      };

      await rewardManagement.connect(user2).createTask(taskId, task, []);

      // New details
      const newDetailsUrl = 'https://new-details.com';
      const newExpiryDate = Math.floor(Date.now() / 1000) + 172800; // 48 hours from now

      // Update task details
      await expect(
        rewardManagement
          .connect(user2)
          .updateTaskDetails(taskId, newDetailsUrl, newExpiryDate),
      )
        .to.emit(rewardManagement, 'TaskDetailsUpdated')
        .withArgs(taskId, user2.address);

      // Verify updates
      const updatedTask = await rewardManagement.tasks(taskId);
      expect(updatedTask.detailsUrl).to.equal(newDetailsUrl);
      expect(updatedTask.expiryDate).to.equal(newExpiryDate);
    });

    it('should add participants to whitelist correctly', async function () {
      const { rewardManagement, user2, participant1, rewardToken } =
        await fixture();
      const taskId = ethers.id('WHITELIST_TASK');

      const task = {
        name: 'Whitelist Task',
        detailsUrl: 'https://whitelist.com',
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
        approvedParticipants: [],
      };

      // Create whitelisted task
      await rewardManagement.connect(user2).createTask(taskId, task, []);

      // Add participant to whitelist
      await expect(
        rewardManagement
          .connect(user2)
          .addToWhitelist(taskId, participant1.address, true),
      )
        .to.emit(rewardManagement, 'ParticipantWhitelisted')
        .withArgs(taskId, participant1.address, user2.address);

      // Verify participant is whitelisted
      expect(await rewardManagement.isWhitelisted(taskId, participant1.address))
        .to.be.true;

      // Participant should now be able to participate
      await expect(rewardManagement.connect(participant1).participate(taskId))
        .to.emit(rewardManagement, 'TaskAssignmentApplied')
        .withArgs(taskId, participant1.address);

      // Non-whitelisted participant should not be able to participate
      const [nonWhitelisted] = await ethers.getSigners();
      await expect(
        rewardManagement.connect(nonWhitelisted).participate(taskId),
      ).to.be.revertedWith('User is not whitelisted for this task.');
    });

    it('should remove participant from whitelist correctly', async function () {
      const { rewardManagement, user2, participant1, rewardToken } =
        await fixture();
      const taskId = ethers.id('REMOVE_WHITELIST_TASK');

      const task = {
        name: 'Remove Whitelist Task',
        detailsUrl: 'https://whitelist-remove.com',
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
        approvedParticipants: [],
      };

      // Create task and add to whitelist
      await rewardManagement.connect(user2).createTask(taskId, task, []);
      await rewardManagement
        .connect(user2)
        .addToWhitelist(taskId, participant1.address, true);

      // Verify initially whitelisted
      expect(await rewardManagement.isWhitelisted(taskId, participant1.address))
        .to.be.true;

      // Remove from whitelist
      await expect(
        rewardManagement
          .connect(user2)
          .removeFromWhitelist(taskId, participant1.address),
      )
        .to.emit(rewardManagement, 'ParticipantRemovedFromWhitelist')
        .withArgs(taskId, participant1.address, user2.address);

      // Verify no longer whitelisted
      expect(await rewardManagement.isWhitelisted(taskId, participant1.address))
        .to.be.false;

      // Verify participant can no longer participate
      await expect(
        rewardManagement.connect(participant1).participate(taskId),
      ).to.be.revertedWith('User is not whitelisted for this task.');
    });

    it('should retrieve task details correctly', async function () {
      const { rewardManagement, user2, rewardToken } = await fixture();
      const taskId = ethers.id('GET_TASK_TEST');

      const task = {
        name: 'Get Task Test',
        detailsUrl: 'https://get-task.com',
        owner: user2.address,
        expiryDate: Math.floor(Date.now() / 1000) + 86400,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(200),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      // Create task
      await rewardManagement.connect(user2).createTask(taskId, task, []);

      // Get task details
      const retrievedTask = await rewardManagement.tasks(taskId);

      // Verify all task properties
      expect(retrievedTask.name).to.equal(task.name);
      expect(retrievedTask.detailsUrl).to.equal(task.detailsUrl);
      expect(retrievedTask.owner).to.equal(task.owner);
      expect(retrievedTask.expiryDate).to.equal(task.expiryDate);
      expect(retrievedTask.rewardToken).to.equal(task.rewardToken);
      expect(retrievedTask.isOpen).to.equal(task.isOpen);
      expect(retrievedTask.requireApproval).to.equal(task.requireApproval);
      expect(retrievedTask.isWhitelisted).to.equal(task.isWhitelisted);
    });

    it('should close task correctly', async function () {
      const { rewardManagement, user2, rewardToken } = await fixture();

      const taskId = ethers.id('CLOSE_TASK');

      const task = {
        name: 'Close Task',
        detailsUrl: 'https://close.com',
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
        approvedParticipants: [],
      };

      // Create task
      await rewardManagement.connect(user2).createTask(taskId, task, []);

      // Close task
      await expect(rewardManagement.connect(user2).closeTask(taskId))
        .to.emit(rewardManagement, 'TaskClosed')
        .withArgs(taskId, user2.address);

      // Verify task is closed
      const closedTask = await rewardManagement.tasks(taskId);
      expect(closedTask.isOpen).to.be.false;

      // Verify task is removed from open tasks
      // const openTasks = await rewardManagement.getOpenTasks();
      // expect(openTasks).to.not.include(taskId);
    });
    //second part of the task
    // it('should close expired tasks automatically', async function () {
    //   const { rewardManagement, user2, rewardToken } = await fixture();

    //   const taskId1 = ethers.id('EXPIRED_TASK_1');
    //   const taskId2 = ethers.id('EXPIRED_TASK_2');

    //   // Get current block timestamp
    //   const latestBlock = await ethers.provider.getBlock('latest');
    //   const currentTimestamp = latestBlock!.timestamp;

    //   // Set expiry dates relative to current block timestamp
    //   const nearFuture = currentTimestamp + 3600; // 1 hour from now
    //   const farFuture = currentTimestamp + 86400; // 24 hours from now

    //   const task1 = {
    //     name: 'Soon To Expire Task',
    //     detailsUrl: 'https://expired.com',
    //     owner: user2.address,
    //     expiryDate: nearFuture,
    //     rewardToken: await rewardToken.getAddress(),
    //     totalRewardAmount: BigInt(100),
    //     isOpen: true,
    //     requireApproval: true,
    //     isWhitelisted: false,
    //     isTokenDisbursed: false,
    //     maxParticipants: 10,
    //     acceptedParticipantCount: 0,
    //     approvedParticipants: [],
    //   };

    //   const task2 = {
    //     ...task1,
    //     name: 'Active Task',
    //     expiryDate: farFuture,
    //   };

    //   // Create both tasks
    //   await rewardManagement.connect(user2).createTask(taskId1, task1, []);
    //   await rewardManagement.connect(user2).createTask(taskId2, task2, []);

    //   // Verify both tasks are created and open
    //   expect((await rewardManagement.tasks(taskId1)).isOpen).to.be.true;
    //   expect((await rewardManagement.tasks(taskId2)).isOpen).to.be.true;
    //   // Increase time past the first task's expiry
    //   await ethers.provider.send('evm_setNextBlockTimestamp', [nearFuture + 1]);
    //   await ethers.provider.send('evm_mine', []);

    //   // // Close expired tasks
    //   await rewardManagement.closeExpiredTasks();

    //   // Verify task states
    //   const expiredTaskAfter = await rewardManagement.tasks(taskId1);
    //   const activeTaskAfter = await rewardManagement.tasks(taskId2);

    //   expect(expiredTaskAfter.isOpen).to.be.false;
    //   expect(activeTaskAfter.isOpen).to.be.true;

    //   // Verify open tasks list
    //   // const openTasks = await rewardManagement.getOpenTasks();
    //   // expect(openTasks).to.not.include(taskId1);
    //   // expect(openTasks).to.include(taskId2);
    // });
  });

  describe('Tasks with requireApproval-false allow participant to complete task directly skipping admin acceptance', function () {
    let rewardManagement: any,
      user2: any,
      rewardToken: any,
      treasury: any,
      taskId: string,
      participant1: any,
      task: any;

    beforeEach(async function () {
      const fixtureData = await fixture();
      rewardManagement = fixtureData.rewardManagement;
      user2 = fixtureData.user2;
      rewardToken = fixtureData.rewardToken;
      participant1 = fixtureData.participant1;
      [treasury] = await ethers.getSigners();

      // Mint and approve tokens for treasury
      const mintAmount = BigInt(1000);
      await rewardToken.connect(user2).mint(treasury.address, mintAmount);
      await rewardToken
        .connect(treasury)
        .approve(rewardManagement.target, mintAmount);
      await rewardManagement
        .connect(user2)
        .acceptTokenTransfer(
          treasury.address,
          await rewardToken.getAddress(),
          mintAmount,
        );

      // Task details with requireApproval: false
      taskId = ethers.id('NO_APPROVAL_TASK');
      const future = Math.floor(Date.now() / 1000) + 86400;
      task = {
        name: 'No Approval Task',
        detailsUrl: 'https://no-approval.com',
        owner: user2.address,
        expiryDate: future,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: false,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await rewardManagement.connect(user2).createTask(taskId, task, []);
    });

    it('should allow participant to complete task directly ', async function () {
      // Participant applies
      const totalRewardAmount = BigInt(100);

      // Participant completes task directly (no admin acceptance needed)
      await expect(
        rewardManagement
          .connect(participant1)
          .completeTask(taskId, 'https://completion.com'),
      )
        .to.emit(rewardManagement, 'TaskAssignmentCompleted')
        .withArgs(taskId, participant1.address);

      // Status should be COMPLETED
      const assignment = await rewardManagement.getParticipantTaskAssignment(
        taskId,
        participant1.address,
      );
      expect(assignment.status).to.equal(3); // AssignmentStatus.COMPLETED
    });

    it(' should allow owner to approve participant', async function () {
      const totalRewardAmount = BigInt(100);

      await rewardManagement
        .connect(participant1)
        .completeTask(taskId, 'https://completion.com');

      // Owner approves participant
      await expect(
        rewardManagement
          .connect(user2)
          .approveTaskSubmission(taskId, participant1.address),
      )
        .to.emit(rewardManagement, 'TaskAssignmentVerified')
        .withArgs(taskId, participant1.address, user2.address);
    });

    it(' should allow owner to disburse tokens to task participants', async function () {
      const totalRewardAmount = BigInt(100);

      await rewardManagement
        .connect(participant1)
        .completeTask(taskId, 'https://completion.com');
      await rewardManagement
        .connect(user2)
        .approveTaskSubmission(taskId, participant1.address);

      // Owner disburses tokens to task participants
      await expect(
        rewardManagement
          .connect(user2)
          .disburseTokensToTaskParticipants(taskId, totalRewardAmount),
      )
        .to.emit(rewardManagement, 'DisbursementToTask')
        .withArgs(taskId, totalRewardAmount, user2.address);
    });
  });

  describe('Tasks with requireApproval-true require participant to apply, adming acceptance, comletion , admin approval and then token disbursement', function () {
    let rewardManagement: any,
      user2: any,
      rewardToken: any,
      treasury: any,
      taskId: string,
      participant1: any,
      task: any;

    beforeEach(async function () {
      const fixtureData = await fixture();
      rewardManagement = fixtureData.rewardManagement;
      user2 = fixtureData.user2;
      rewardToken = fixtureData.rewardToken;
      participant1 = fixtureData.participant1;
      [treasury] = await ethers.getSigners();

      // Mint and approve tokens for treasury
      const mintAmount = BigInt(1000);
      await rewardToken.connect(user2).mint(treasury.address, mintAmount);
      await rewardToken
        .connect(treasury)
        .approve(rewardManagement.target, mintAmount);
      await rewardManagement
        .connect(user2)
        .acceptTokenTransfer(
          treasury.address,
          await rewardToken.getAddress(),
          mintAmount,
        );

      // Task details with requireApproval: false
      taskId = ethers.id('NO_APPROVAL_TASK');
      const future = Math.floor(Date.now() / 1000) + 86400;
      task = {
        name: 'No Approval Task',
        detailsUrl: 'https://no-approval.com',
        owner: user2.address,
        expiryDate: future,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: false,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await rewardManagement.connect(user2).createTask(taskId, task, []);
    });

    it('should allow participant to  participate the task ', async function () {
      // Participant applies
      const totalRewardAmount = BigInt(100);

      // Participant participate in task
      await expect(rewardManagement.connect(participant1).participate(taskId))
        .to.emit(rewardManagement, 'TaskAssignmentApplied')
        .withArgs(taskId, participant1.address);

      // Status should be PENDING
      const assignment = await rewardManagement.getParticipantTaskAssignment(
        taskId,
        participant1.address,
      );
      expect(assignment.status).to.equal(1); // AssignmentStatus.PENDING
    });

    it(' should allow owner to accept participant', async function () {
      const totalRewardAmount = BigInt(100);

      await rewardManagement.connect(participant1).participate(taskId);
      // Owner accept participant
      await expect(
        rewardManagement
          .connect(user2)
          .acceptParticipant(taskId, participant1.address),
      )
        .to.emit(rewardManagement, 'TaskAssignmentAccepted')
        .withArgs(taskId, participant1.address);
    });

    it(' should allow participant to complete the task', async function () {
      const totalRewardAmount = BigInt(100);
      await rewardManagement.connect(participant1).participate(taskId);

      await rewardManagement
        .connect(user2)
        .acceptParticipant(taskId, participant1.address);

      // participant complete the task
      await expect(
        rewardManagement
          .connect(participant1)
          .completeTask(taskId, 'https://completion.com'),
      )
        .to.emit(rewardManagement, 'TaskAssignmentCompleted')
        .withArgs(taskId, participant1.address);
    });

    it(' should allow task owner to approve  participant to', async function () {
      const totalRewardAmount = BigInt(100);
      await rewardManagement.connect(participant1).participate(taskId);

      await rewardManagement
        .connect(user2)
        .acceptParticipant(taskId, participant1.address);
      await rewardManagement
        .connect(participant1)
        .completeTask(taskId, 'https://completion.com');

      // owner approve the participant assignment
      await expect(
        rewardManagement
          .connect(user2)
          .approveTaskSubmission(taskId, participant1.address),
      )
        .to.emit(rewardManagement, 'TaskAssignmentVerified')
        .withArgs(taskId, participant1.address, user2.address);
    });
    it(' should allow entity owner to disburse token', async function () {
      const totalRewardAmount = BigInt(100);
      await rewardManagement.connect(participant1).participate(taskId);

      await rewardManagement
        .connect(user2)
        .acceptParticipant(taskId, participant1.address);
      await rewardManagement
        .connect(participant1)
        .completeTask(taskId, 'https://completion.com');
      await rewardManagement
        .connect(user2)
        .approveTaskSubmission(taskId, participant1.address);

      // owner disburse tokens to task participants
      await expect(
        rewardManagement
          .connect(user2)
          .disburseTokensToTaskParticipants(taskId, totalRewardAmount),
      )
        .to.emit(rewardManagement, 'DisbursementToTask')
        .withArgs(taskId, totalRewardAmount, user2.address);
    });
    it(' should allow entity owner to reject participant assignment', async function () {
      const totalRewardAmount = BigInt(100);
      await rewardManagement.connect(participant1).participate(taskId);

      await rewardManagement
        .connect(user2)
        .acceptParticipant(taskId, participant1.address);
      await rewardManagement
        .connect(participant1)
        .completeTask(taskId, 'https://completion.com');

      // owner reject the participant assignment
      await expect(
        rewardManagement
          .connect(user2)
          .rejectTaskSubmission(
            taskId,
            participant1.address,
            'Incomplete work',
          ),
      )
        .to.emit(rewardManagement, 'TaskAssignmentRejected')
        .withArgs(
          taskId,
          participant1.address,
          user2.address,
          'Incomplete work',
        );
    });
  });

  describe('test for disburseToSingleParticipant and disburseAdditionalTokenToTaskParticipants', function () {
    let rewardManagement: any,
      user2: any,
      rewardToken: any,
      treasury: any,
      taskId: string,
      participant1: any,
      task: any;

    beforeEach(async function () {
      const fixtureData = await fixture();
      rewardManagement = fixtureData.rewardManagement;
      user2 = fixtureData.user2;
      rewardToken = fixtureData.rewardToken;
      participant1 = fixtureData.participant1;
      [treasury] = await ethers.getSigners();

      // Mint and approve tokens for treasury
      const mintAmount = BigInt(1000);
      await rewardToken.connect(user2).mint(treasury.address, mintAmount);
      await rewardToken
        .connect(treasury)
        .approve(rewardManagement.target, mintAmount);
      await rewardManagement
        .connect(user2)
        .acceptTokenTransfer(
          treasury.address,
          await rewardToken.getAddress(),
          mintAmount,
        );

      // Task details with requireApproval: false
      taskId = ethers.id('NO_APPROVAL_TASK');
      const future = Math.floor(Date.now() / 1000) + 86400;
      task = {
        name: 'No Approval Task',
        detailsUrl: 'https://no-approval.com',
        owner: user2.address,
        expiryDate: future,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: BigInt(100),
        isOpen: true,
        requireApproval: false,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await rewardManagement.connect(user2).createTask(taskId, task, []);
    });

    it('should allow owner to disburse token to single participant ', async function () {
      // Participant applies
      const totalRewardAmount = BigInt(100);

      // owner disburse token to single participant
      await expect(
        rewardManagement
          .connect(user2)
          .disburseToSingleParticipant(
            taskId,
            participant1.address,
            BigInt(100),
          ),
      )
        .to.emit(rewardManagement, 'DisbursementToParticipant')
        .withArgs(taskId, BigInt(100), participant1.address, user2.address);
    });

    it(' should allow owner to disburse additional token to task', async function () {
      const initialAmount = BigInt(100);
      const totalRewardAmount = BigInt(100);
      const remarks = 'Additional reward for extra effort';

      await rewardManagement
        .connect(participant1)
        .completeTask(taskId, 'https://completion.com');
      await rewardManagement
        .connect(user2)
        .approveTaskSubmission(taskId, participant1.address);
      await rewardManagement
        .connect(user2)
        .disburseTokensToTaskParticipants(taskId, initialAmount);

      // Now you can call additional disbursement
      await expect(
        rewardManagement
          .connect(user2)
          .disburseAdditionalTokenToTaskParticipants(
            taskId,
            totalRewardAmount,
            remarks,
          ),
      )
        .to.emit(rewardManagement, 'AdditionalDisbursementToTask')
        .withArgs(taskId, totalRewardAmount, remarks, user2.address);
    });
    it('should allocate token to task', async function () {
      const initialAmount = BigInt(100);
      const totalRewardAmount = BigInt(100);
      const remarks = 'Additional reward for extra effort';
      const getTokenAddress = await rewardToken.getAddress();

      // call allocae tokens to  task
      await expect(
        rewardManagement
          .connect(user2)
          .allocateTokensToTask(taskId, getTokenAddress, initialAmount),
      )
        .to.emit(rewardManagement, 'TokensAllocatedToTask')
        .withArgs(taskId, getTokenAddress, initialAmount, user2.address);
    });
  });
});
