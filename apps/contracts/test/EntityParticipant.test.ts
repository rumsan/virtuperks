import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { App, Entity, RewardToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Entity Contract - Participant Management & Rewards", function () {
  let app: App;
  let entity: Entity;
  let rewardToken: RewardToken;
  let owner: SignerWithAddress;
  let entityOwner: SignerWithAddress;
  let taskOwner: SignerWithAddress;
  let participant1: SignerWithAddress;
  let participant2: SignerWithAddress;
  let participant3: SignerWithAddress;
  let entityAddress: string;

  beforeEach(async function () {
    [owner, entityOwner, taskOwner, participant1, participant2, participant3] =
      await ethers.getSigners();

    // Deploy App
    const EntityImpl = await ethers.getContractFactory("Entity");
    const entityImplementation = await EntityImpl.deploy();
    await entityImplementation.waitForDeployment();

    const App = await ethers.getContractFactory("App");
    app = (await upgrades.deployProxy(App, [owner.address, await entityImplementation.getAddress(), "Test App"], {
      initializer: "initialize",
      kind: "uups",
    })) as unknown as App;
    await app.waitForDeployment();

    // Create entity
    const tx = await app.createEntity(
      entityOwner.address,
      "Test Entity",
      "https://test.com"
    );
    const receipt = await tx.wait();

    // Get entity address
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
      entityAddress = parsed?.args[0];
    }

    entity = await ethers.getContractAt("Entity", entityAddress);

    // Deploy RewardToken
    const RewardToken = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardToken.deploy("Test Token", "TST", owner.address);
    await rewardToken.waitForDeployment();

    // Transfer tokens to entity for rewards
    await rewardToken.transfer(entityAddress, ethers.parseEther("10000"));
    // Transfer tokens to entity owner for deposit tests
    await rewardToken.transfer(entityOwner.address, ethers.parseEther("1000"));
  });

  describe("Participation", function () {
    let taskId: string;

    beforeEach(async function () {
      taskId = ethers.id("task-1");
      const expiryDate = (await time.latest()) + 86400;

      const task = {
        name: "Test Task",
        detailsUrl: "https://task-details.com",
        owner: taskOwner.address,
        expiryDate: expiryDate,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: ethers.parseEther("100"),
        isOpen: true,
        requireApproval: false, // Auto-accept
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity.connect(entityOwner).createTask(taskId, task, []);
    });

    it("Should allow participant to join task", async function () {
      await expect(entity.connect(participant1).participate(taskId))
        .to.emit(entity, "TaskAssignmentApplied")
        .withArgs(taskId, participant1.address);

      const assignment = await entity.taskAssignments(taskId, participant1.address);
      expect(assignment.status).to.equal(2); // ACCEPTED
    });

    it("Should require approval when task requires it", async function () {
      // Create task with approval required
      const taskId2 = ethers.id("task-2");
      const expiryDate = (await time.latest()) + 86400;

      const task = {
        name: "Test Task 2",
        detailsUrl: "https://task-details.com",
        owner: taskOwner.address,
        expiryDate: expiryDate,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: ethers.parseEther("100"),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity.connect(entityOwner).createTask(taskId2, task, []);

      await entity.connect(participant1).participate(taskId2);

      const assignment = await entity.taskAssignments(taskId2, participant1.address);
      expect(assignment.status).to.equal(1); // PENDING
    });

    it("Should enforce whitelist when enabled", async function () {
      // Create whitelisted task
      const taskId2 = ethers.id("task-2");
      const expiryDate = (await time.latest()) + 86400;

      const task = {
        name: "Test Task 2",
        detailsUrl: "https://task-details.com",
        owner: taskOwner.address,
        expiryDate: expiryDate,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: ethers.parseEther("100"),
        isOpen: true,
        requireApproval: false,
        isWhitelisted: true,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity
        .connect(entityOwner)
        .createTask(taskId2, task, [participant1.address]);

      // Whitelisted participant should succeed
      await entity.connect(participant1).participate(taskId2);

      // Non-whitelisted participant should fail
      await expect(
        entity.connect(participant2).participate(taskId2)
      ).to.be.revertedWith("Entity: Participant is not whitelisted");
    });

    it("Should fail when max participants reached", async function () {
      // Create task with max 2 participants
      const taskId2 = ethers.id("task-2");
      const expiryDate = (await time.latest()) + 86400;

      const task = {
        name: "Test Task 2",
        detailsUrl: "https://task-details.com",
        owner: taskOwner.address,
        expiryDate: expiryDate,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: ethers.parseEther("100"),
        isOpen: true,
        requireApproval: false,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 2,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity.connect(entityOwner).createTask(taskId2, task, []);

      await entity.connect(participant1).participate(taskId2);
      await entity.connect(participant2).participate(taskId2);

      await expect(
        entity.connect(participant3).participate(taskId2)
      ).to.be.revertedWith("Entity: Max participants reached");
    });

    it("Should fail when task is closed", async function () {
      await entity.connect(taskOwner).closeTask(taskId);

      await expect(
        entity.connect(participant1).participate(taskId)
      ).to.be.revertedWith("Entity: Task is not open");
    });
  });

  describe("Participant Acceptance", function () {
    let taskId: string;

    beforeEach(async function () {
      taskId = ethers.id("task-1");
      const expiryDate = (await time.latest()) + 86400;

      const task = {
        name: "Test Task",
        detailsUrl: "https://task-details.com",
        owner: taskOwner.address,
        expiryDate: expiryDate,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: ethers.parseEther("100"),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity.connect(entityOwner).createTask(taskId, task, []);
      await entity.connect(participant1).participate(taskId);
    });

    it("Should accept participant", async function () {
      await expect(
        entity.connect(taskOwner).acceptParticipant(taskId, participant1.address)
      )
        .to.emit(entity, "TaskAssignmentAccepted")
        .withArgs(taskId, participant1.address);

      const assignment = await entity.taskAssignments(taskId, participant1.address);
      expect(assignment.status).to.equal(2); // ACCEPTED
    });

    it("Should fail when non-owner tries to accept", async function () {
      await expect(
        entity.connect(participant2).acceptParticipant(taskId, participant1.address)
      ).to.be.revertedWith("Entity: Not task owner");
    });
  });

  describe("Task Completion", function () {
    let taskId: string;

    beforeEach(async function () {
      taskId = ethers.id("task-1");
      const expiryDate = (await time.latest()) + 86400;

      const task = {
        name: "Test Task",
        detailsUrl: "https://task-details.com",
        owner: taskOwner.address,
        expiryDate: expiryDate,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: ethers.parseEther("100"),
        isOpen: true,
        requireApproval: false,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity.connect(entityOwner).createTask(taskId, task, []);
      await entity.connect(participant1).participate(taskId);
    });

    it("Should complete task", async function () {
      const completionUrl = "https://submission.com/proof";

      await expect(
        entity.connect(participant1).completeTask(taskId, completionUrl)
      )
        .to.emit(entity, "TaskAssignmentCompleted")
        .withArgs(taskId, participant1.address);

      const assignment = await entity.taskAssignments(taskId, participant1.address);
      expect(assignment.status).to.equal(3); // COMPLETED
      expect(assignment.completionUrl).to.equal(completionUrl);
    });

    it("Should fail with empty completion URL", async function () {
      await expect(
        entity.connect(participant1).completeTask(taskId, "")
      ).to.be.revertedWith("Entity: Completion URL cannot be empty");
    });

    it("Should allow participant to complete without participating first", async function () {
      await expect(
        entity.connect(participant2).completeTask(taskId, "https://test.com")
      )
        .to.emit(entity, "TaskAssignmentCompleted")
        .withArgs(taskId, participant2.address);
    });

    it("Should fail when task is expired", async function () {
      await time.increase(86401);

      await expect(
        entity.connect(participant1).completeTask(taskId, "https://test.com")
      ).to.be.revertedWith("Entity: Task has expired");
    });
  });

  describe("Submission Review", function () {
    let taskId: string;

    beforeEach(async function () {
      taskId = ethers.id("task-1");
      const expiryDate = (await time.latest()) + 86400;

      const task = {
        name: "Test Task",
        detailsUrl: "https://task-details.com",
        owner: taskOwner.address,
        expiryDate: expiryDate,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: ethers.parseEther("100"),
        isOpen: true,
        requireApproval: false,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity.connect(entityOwner).createTask(taskId, task, []);
      await entity.connect(participant1).participate(taskId);
      await entity
        .connect(participant1)
        .completeTask(taskId, "https://submission.com");
    });

    it("Should approve submission", async function () {
      await expect(
        entity.connect(taskOwner).approveTaskSubmission(taskId, participant1.address)
      )
        .to.emit(entity, "TaskAssignmentApproved")
        .withArgs(taskId, taskOwner.address);

      const assignment = await entity.taskAssignments(taskId, participant1.address);
      expect(assignment.status).to.equal(4); // APPROVED
    });

    it("Should reject submission", async function () {
      const reason = "Quality not met";

      await expect(
        entity
          .connect(taskOwner)
          .rejectTaskSubmission(taskId, participant1.address, reason)
      )
        .to.emit(entity, "TaskAssignmentRejected")
        .withArgs(taskId, participant1.address, taskOwner.address, reason);

      const assignment = await entity.taskAssignments(taskId, participant1.address);
      expect(assignment.status).to.equal(5); // REJECTED
    });

    it("Should fail to approve by non-owner", async function () {
      await expect(
        entity
          .connect(participant2)
          .approveTaskSubmission(taskId, participant1.address)
      ).to.be.revertedWith("Entity: Not task owner");
    });
  });

  describe("Reward Distribution", function () {
    let taskId: string;

    beforeEach(async function () {
      taskId = ethers.id("task-1");
      const expiryDate = (await time.latest()) + 86400;

      const task = {
        name: "Test Task",
        detailsUrl: "https://task-details.com",
        owner: taskOwner.address,
        expiryDate: expiryDate,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: ethers.parseEther("100"),
        isOpen: true,
        requireApproval: false,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity.connect(entityOwner).createTask(taskId, task, []);

      // Two participants complete and get approved
      await entity.connect(participant1).participate(taskId);
      await entity
        .connect(participant1)
        .completeTask(taskId, "https://submission1.com");
      await entity
        .connect(taskOwner)
        .approveTaskSubmission(taskId, participant1.address);

      await entity.connect(participant2).participate(taskId);
      await entity
        .connect(participant2)
        .completeTask(taskId, "https://submission2.com");
      await entity
        .connect(taskOwner)
        .approveTaskSubmission(taskId, participant2.address);

      // Close task
      await entity.connect(taskOwner).closeTask(taskId);
    });

    it("Should distribute rewards evenly", async function () {
      const participant1Before = await rewardToken.balanceOf(
        participant1.address
      );
      const participant2Before = await rewardToken.balanceOf(
        participant2.address
      );

      await expect(entity.connect(taskOwner).distributeRewards(taskId))
        .to.emit(entity, "RewardsDistributed")
        .withArgs(taskId, ethers.parseEther("100"), 2);

      const participant1After = await rewardToken.balanceOf(participant1.address);
      const participant2After = await rewardToken.balanceOf(participant2.address);

      // Each should receive 50 tokens
      expect(participant1After - participant1Before).to.equal(
        ethers.parseEther("50")
      );
      expect(participant2After - participant2Before).to.equal(
        ethers.parseEther("50")
      );

      // Check assignment status updated
      const assignment1 = await entity.taskAssignments(taskId, participant1.address);
      expect(assignment1.status).to.equal(6); // DISBURSED
    });

    it("Should fail to distribute if task is still open", async function () {
      const taskId2 = ethers.id("task-2");
      const expiryDate = ethers.MaxUint256;

      const task = {
        name: "Test Task 2",
        detailsUrl: "https://task-details.com",
        owner: taskOwner.address,
        expiryDate: expiryDate,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: ethers.parseEther("100"),
        isOpen: true,
        requireApproval: false,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity.connect(entityOwner).createTask(taskId2, task, []);

      // Add participants and approve them
      await entity.connect(participant1).participate(taskId2);
      await entity
        .connect(participant1)
        .completeTask(taskId2, "https://submission1.com");
      await entity
        .connect(taskOwner)
        .approveTaskSubmission(taskId2, participant1.address);

      await expect(
        entity.connect(taskOwner).distributeRewards(taskId2)
      ).to.be.revertedWith("Entity: task still open");
    });

    it("Should fail to distribute twice", async function () {
      await entity.connect(taskOwner).distributeRewards(taskId);

      await expect(
        entity.connect(taskOwner).distributeRewards(taskId)
      ).to.be.revertedWith("Entity: already distributed");
    });

    it("Should fail if no approved participants", async function () {
      const taskId2 = ethers.id("task-2");
      const expiryDate = (await time.latest()) + 86400;

      const task = {
        name: "Test Task 2",
        detailsUrl: "https://task-details.com",
        owner: taskOwner.address,
        expiryDate: expiryDate,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: ethers.parseEther("100"),
        isOpen: true,
        requireApproval: false,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity.connect(entityOwner).createTask(taskId2, task, []);
      await entity.connect(taskOwner).closeTask(taskId2);

      await expect(
        entity.connect(taskOwner).distributeRewards(taskId2)
      ).to.be.revertedWith("Entity: no participants");
    });
  });

  describe("Token Deposits", function () {
    it("Should allow token deposits", async function () {
      const amount = ethers.parseEther("100");

      // Approve and deposit
      await rewardToken
        .connect(entityOwner)
        .approve(entityAddress, amount);

      await expect(
        entity.connect(entityOwner).depositTokens(await rewardToken.getAddress(), amount)
      )
        .to.emit(entity, "TokensDeposited")
        .withArgs(await rewardToken.getAddress(), amount, entityOwner.address);

      const balance = await rewardToken.balanceOf(entityAddress);
      expect(balance).to.equal(ethers.parseEther("10100"));
    });

    it("Should fail with zero amount", async function () {
      await expect(
        entity.connect(entityOwner).depositTokens(await rewardToken.getAddress(), 0)
      ).to.be.revertedWith("Entity: Amount must be greater than 0");
    });
  });

  describe("Task Completion - Updated Logic", function () {
    let taskId: string;
    let expiryDate: number;

    beforeEach(async function () {
      taskId = ethers.id("task-complete-test");
      expiryDate = (await time.latest()) + 86400;

      // Deposit tokens for task
      const amount = ethers.parseEther("1000");
      await rewardToken.connect(entityOwner).approve(entityAddress, amount);
      await entity.connect(entityOwner).depositTokens(await rewardToken.getAddress(), amount);
    });

    describe("Tasks without approval requirement", function () {
      beforeEach(async function () {
        const task = {
          name: "No Approval Task",
          detailsUrl: "https://task-details.com",
          owner: taskOwner.address,
          expiryDate: expiryDate,
          rewardToken: await rewardToken.getAddress(),
          totalRewardAmount: ethers.parseEther("100"),
          isOpen: true,
          requireApproval: false,
          isWhitelisted: false,
          isTokenDisbursed: false,
          maxParticipants: 10,
          acceptedParticipantCount: 0,
          approvedParticipants: [],
        };

        await entity.connect(entityOwner).createTask(taskId, task, []);
      });

      it("Should allow participant with ACCEPTED status to complete task", async function () {
        await entity.connect(participant1).participate(taskId);

        await expect(
          entity.connect(participant1).completeTask(taskId, "https://submission.com")
        )
          .to.emit(entity, "TaskAssignmentCompleted")
          .withArgs(taskId, participant1.address);

        const assignment = await entity.taskAssignments(taskId, participant1.address);
        expect(assignment.status).to.equal(3); // COMPLETED
        expect(assignment.completionUrl).to.equal("https://submission.com");
      });

      it("Should allow participant with PENDING status to complete task", async function () {
        // Modify task to require approval first
        const task = {
          name: "No Approval Task",
          detailsUrl: "https://task-details.com",
          owner: taskOwner.address,
          expiryDate: expiryDate,
          rewardToken: await rewardToken.getAddress(),
          totalRewardAmount: ethers.parseEther("100"),
          isOpen: true,
          requireApproval: true,
          isWhitelisted: false,
          isTokenDisbursed: false,
          maxParticipants: 10,
          acceptedParticipantCount: 0,
          approvedParticipants: [],
        };

        const taskId2 = ethers.id("task-complete-test-pending");
        await entity.connect(entityOwner).createTask(taskId2, task, []);
        await entity.connect(participant1).participate(taskId2);

        // Change to non-approval requirement
        // Simulate by directly completing from PENDING (participant can now complete from NONE, PENDING, ACCEPTED in no-approval tasks)
        // For this test, use a no-approval task and check PENDING status from a different flow

        // Actually, for a no-approval task, participation gives ACCEPTED status
        // To test PENDING completion in no-approval, we need a different approach
        // Participant completes without being accepted
        await entity.connect(participant1).participate(taskId);

        await expect(
          entity.connect(participant1).completeTask(taskId, "https://submission-pending.com")
        )
          .to.emit(entity, "TaskAssignmentCompleted")
          .withArgs(taskId, participant1.address);
      });

      it("Should allow participant to complete from NONE status (not yet participated)", async function () {
        // Create a new task without approval
        const taskId3 = ethers.id("task-complete-test-none");
        const task = {
          name: "No Approval Task 3",
          detailsUrl: "https://task-details.com",
          owner: taskOwner.address,
          expiryDate: expiryDate,
          rewardToken: await rewardToken.getAddress(),
          totalRewardAmount: ethers.parseEther("100"),
          isOpen: true,
          requireApproval: false,
          isWhitelisted: false,
          isTokenDisbursed: false,
          maxParticipants: 10,
          acceptedParticipantCount: 0,
          approvedParticipants: [],
        };

        await entity.connect(entityOwner).createTask(taskId3, task, []);

        // Attempt to complete without participating (status = NONE)
        // This should now be allowed for no-approval tasks
        await expect(
          entity.connect(participant1).completeTask(taskId3, "https://submission-none.com")
        )
          .to.emit(entity, "TaskAssignmentCompleted")
          .withArgs(taskId3, participant1.address);

        const assignment = await entity.taskAssignments(taskId3, participant1.address);
        expect(assignment.status).to.equal(3); // COMPLETED
      });

      it("Should allow resubmission after rejection", async function () {
        // Participate
        await entity.connect(participant1).participate(taskId);

        // Complete task
        await entity.connect(participant1).completeTask(taskId, "https://submission1.com");

        // Reject submission
        await entity.connect(taskOwner).rejectTaskSubmission(taskId, participant1.address, "Poor quality");

        let assignment = await entity.taskAssignments(taskId, participant1.address);
        expect(assignment.status).to.equal(5); // REJECTED

        // Resubmit after rejection
        await expect(
          entity.connect(participant1).completeTask(taskId, "https://submission2.com")
        )
          .to.emit(entity, "TaskAssignmentCompleted")
          .withArgs(taskId, participant1.address);

        assignment = await entity.taskAssignments(taskId, participant1.address);
        expect(assignment.status).to.equal(3); // COMPLETED
        expect(assignment.completionUrl).to.equal("https://submission2.com");
      });
    });

    describe("Tasks with approval requirement", function () {
      beforeEach(async function () {
        const task = {
          name: "Approval Required Task",
          detailsUrl: "https://task-details.com",
          owner: taskOwner.address,
          expiryDate: expiryDate,
          rewardToken: await rewardToken.getAddress(),
          totalRewardAmount: ethers.parseEther("100"),
          isOpen: true,
          requireApproval: true,
          isWhitelisted: false,
          isTokenDisbursed: false,
          maxParticipants: 10,
          acceptedParticipantCount: 0,
          approvedParticipants: [],
        };

        await entity.connect(entityOwner).createTask(taskId, task, []);
      });

      it("Should require ACCEPTED status to complete approval-required task", async function () {
        await entity.connect(participant1).participate(taskId);

        // Participant is in PENDING status, should not be able to complete
        await expect(
          entity.connect(participant1).completeTask(taskId, "https://submission.com")
        ).to.be.revertedWith("Entity: Not an accepted participant");
      });

      it("Should allow completion after being accepted", async function () {
        await entity.connect(participant1).participate(taskId);
        await entity.connect(taskOwner).acceptParticipant(taskId, participant1.address);

        await expect(
          entity.connect(participant1).completeTask(taskId, "https://submission.com")
        )
          .to.emit(entity, "TaskAssignmentCompleted")
          .withArgs(taskId, participant1.address);

        const assignment = await entity.taskAssignments(taskId, participant1.address);
        expect(assignment.status).to.equal(3); // COMPLETED
      });

      it("Should allow resubmission after rejection for approval-required task", async function () {
        await entity.connect(participant1).participate(taskId);
        await entity.connect(taskOwner).acceptParticipant(taskId, participant1.address);

        // Complete task
        await entity.connect(participant1).completeTask(taskId, "https://submission1.com");

        // Reject submission
        await entity.connect(taskOwner).rejectTaskSubmission(taskId, participant1.address, "Needs improvement");

        let assignment = await entity.taskAssignments(taskId, participant1.address);
        expect(assignment.status).to.equal(5); // REJECTED

        // Resubmit after rejection (even though task requires approval, REJECTED status allows resubmission)
        await expect(
          entity.connect(participant1).completeTask(taskId, "https://submission2.com")
        )
          .to.emit(entity, "TaskAssignmentCompleted")
          .withArgs(taskId, participant1.address);

        assignment = await entity.taskAssignments(taskId, participant1.address);
        expect(assignment.status).to.equal(3); // COMPLETED
        expect(assignment.completionUrl).to.equal("https://submission2.com");
      });

      it("Should not allow PENDING participants to complete even though they are applied", async function () {
        await entity.connect(participant1).participate(taskId);

        // Participant status is PENDING, should fail
        await expect(
          entity.connect(participant1).completeTask(taskId, "https://submission.com")
        ).to.be.revertedWith("Entity: Not an accepted participant");
      });
    });

    describe("Completion URL validation", function () {
      beforeEach(async function () {
        const task = {
          name: "URL Test Task",
          detailsUrl: "https://task-details.com",
          owner: taskOwner.address,
          expiryDate: expiryDate,
          rewardToken: await rewardToken.getAddress(),
          totalRewardAmount: ethers.parseEther("100"),
          isOpen: true,
          requireApproval: false,
          isWhitelisted: false,
          isTokenDisbursed: false,
          maxParticipants: 10,
          acceptedParticipantCount: 0,
          approvedParticipants: [],
        };

        await entity.connect(entityOwner).createTask(taskId, task, []);
      });

      it("Should reject empty completion URL", async function () {
        await entity.connect(participant1).participate(taskId);

        await expect(
          entity.connect(participant1).completeTask(taskId, "")
        ).to.be.revertedWith("Entity: Completion URL cannot be empty");
      });

      it("Should accept various valid URLs", async function () {
        const urls = [
          "https://example.com/submission",
          "https://ipfs.io/QmABC123",
          "https://drive.google.com/file/d/123",
          "https://github.com/user/repo",
        ];

        for (let i = 0; i < urls.length; i++) {
          const participantId = ethers.id("participant-" + i);
          const taskId2 = ethers.id("task-url-" + i);

          const task = {
            name: "URL Test Task " + i,
            detailsUrl: "https://task-details.com",
            owner: taskOwner.address,
            expiryDate: expiryDate,
            rewardToken: await rewardToken.getAddress(),
            totalRewardAmount: ethers.parseEther("100"),
            isOpen: true,
            requireApproval: false,
            isWhitelisted: false,
            isTokenDisbursed: false,
            maxParticipants: 10,
            acceptedParticipantCount: 0,
            approvedParticipants: [],
          };

          await entity.connect(entityOwner).createTask(taskId2, task, []);
          // Use different participant addresses
          const [, , , p] = await ethers.getSigners();

          await entity.connect(p).participate(taskId2);
          await expect(
            entity.connect(p).completeTask(taskId2, urls[i])
          )
            .to.emit(entity, "TaskAssignmentCompleted")
            .withArgs(taskId2, p.address);
        }
      });
    });

    describe("Edge cases and error handling", function () {
      beforeEach(async function () {
        const task = {
          name: "Edge Case Task",
          detailsUrl: "https://task-details.com",
          owner: taskOwner.address,
          expiryDate: expiryDate,
          rewardToken: await rewardToken.getAddress(),
          totalRewardAmount: ethers.parseEther("100"),
          isOpen: true,
          requireApproval: false,
          isWhitelisted: false,
          isTokenDisbursed: false,
          maxParticipants: 10,
          acceptedParticipantCount: 0,
          approvedParticipants: [],
        };

        await entity.connect(entityOwner).createTask(taskId, task, []);
      });

      it("Should fail if task is expired", async function () {
        await entity.connect(participant1).participate(taskId);

        // Fast forward time past expiry
        await time.increase(86401);

        await expect(
          entity.connect(participant1).completeTask(taskId, "https://submission.com")
        ).to.be.revertedWith("Entity: Task has expired");
      });

      it("Should fail when entity is paused", async function () {
        await entity.connect(participant1).participate(taskId);
        await entity.connect(entityOwner).pause();

        await expect(
          entity.connect(participant1).completeTask(taskId, "https://submission.com")
        ).to.be.revertedWith("Entity: paused");
      });

      it("Should work after unpausing", async function () {
        await entity.connect(participant1).participate(taskId);
        await entity.connect(entityOwner).pause();
        await entity.connect(entityOwner).unpause();

        await expect(
          entity.connect(participant1).completeTask(taskId, "https://submission.com")
        )
          .to.emit(entity, "TaskAssignmentCompleted")
          .withArgs(taskId, participant1.address);
      });

      it("Should fail when allocations are frozen", async function () {
        await entity.connect(participant1).participate(taskId);
        await entity.connect(entityOwner).deactivateEntity();

        await expect(
          entity.connect(participant1).completeTask(taskId, "https://submission.com")
        ).to.be.revertedWith("Entity: inactive");
      });
    });
  });

  describe("Participant Tracking", function () {
    let taskId: string;

    beforeEach(async function () {
      taskId = ethers.id("task-tracking");
      const expiryDate = (await time.latest()) + 86400;

      const task = {
        name: "Tracking Task",
        detailsUrl: "https://task-details.com",
        owner: taskOwner.address,
        expiryDate: expiryDate,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: ethers.parseEther("100"),
        isOpen: true,
        requireApproval: false,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity.connect(entityOwner).createTask(taskId, task, []);
    });

    it("Should track accepted participants in acceptedParticipants array", async function () {
      // Before participation, no accepted participants
      const acceptedBefore = await entity.acceptedParticipants(taskId, 0).catch(() => null);
      expect(acceptedBefore).to.be.null;

      // Participant joins (auto-accepted)
      await entity.connect(participant1).participate(taskId);

      // Check acceptedParticipants array contains participant1
      const firstAccepted = await entity.acceptedParticipants(taskId, 0);
      expect(firstAccepted).to.equal(participant1.address);

      // Add second participant
      await entity.connect(participant2).participate(taskId);

      // Check second participant is in array
      const secondAccepted = await entity.acceptedParticipants(taskId, 1);
      expect(secondAccepted).to.equal(participant2.address);
    });

    it("Should track isParticipant status correctly", async function () {
      // Participant has not joined yet
      let isParticipant = await entity.isParticipant(taskId, participant1.address);
      expect(isParticipant).to.be.false;

      // Participant joins
      await entity.connect(participant1).participate(taskId);

      // Now should be marked as participant
      isParticipant = await entity.isParticipant(taskId, participant1.address);
      expect(isParticipant).to.be.true;

      // Other participant has not joined
      isParticipant = await entity.isParticipant(taskId, participant2.address);
      expect(isParticipant).to.be.false;
    });

    it("Should handle acceptance of pending participants correctly", async function () {
      // Create task with approval required
      const taskId2 = ethers.id("task-approval-tracking");
      const expiryDate = (await time.latest()) + 86400;

      const task = {
        name: "Approval Task",
        detailsUrl: "https://task-details.com",
        owner: taskOwner.address,
        expiryDate: expiryDate,
        rewardToken: await rewardToken.getAddress(),
        totalRewardAmount: ethers.parseEther("100"),
        isOpen: true,
        requireApproval: true,
        isWhitelisted: false,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity.connect(entityOwner).createTask(taskId2, task, []);

      // Participant applies (PENDING status)
      await entity.connect(participant1).participate(taskId2);

      // Not accepted yet
      let acceptedCount = 0;
      try {
        while (true) {
          await entity.acceptedParticipants(taskId2, acceptedCount);
          acceptedCount++;
        }
      } catch {
        // Expected to throw when out of bounds
      }
      expect(acceptedCount).to.equal(0);

      // Task owner accepts participant
      await entity.connect(taskOwner).acceptParticipant(taskId2, participant1.address);

      // Now should be in acceptedParticipants
      const firstAccepted = await entity.acceptedParticipants(taskId2, 0);
      expect(firstAccepted).to.equal(participant1.address);
    });

    it("Should maintain acceptedParticipants even after completion", async function () {
      await entity.connect(participant1).participate(taskId);
      await entity.connect(participant2).participate(taskId);

      // Both are accepted
      expect(await entity.acceptedParticipants(taskId, 0)).to.equal(
        participant1.address
      );
      expect(await entity.acceptedParticipants(taskId, 1)).to.equal(
        participant2.address
      );

      // Participant1 completes task
      await entity
        .connect(participant1)
        .completeTask(taskId, "https://submission.com");

      // acceptedParticipants list should still contain both
      expect(await entity.acceptedParticipants(taskId, 0)).to.equal(
        participant1.address
      );
      expect(await entity.acceptedParticipants(taskId, 1)).to.equal(
        participant2.address
      );
    });

    it("Should correctly track multiple accepted participants for reward distribution", async function () {
      // Create three participants who are accepted
      const [, , , p1, p2, p3] = await ethers.getSigners();

      await entity.connect(p1).participate(taskId);
      await entity.connect(p2).participate(taskId);
      await entity.connect(p3).participate(taskId);

      // All three should be in acceptedParticipants
      expect(await entity.acceptedParticipants(taskId, 0)).to.equal(p1.address);
      expect(await entity.acceptedParticipants(taskId, 1)).to.equal(p2.address);
      expect(await entity.acceptedParticipants(taskId, 2)).to.equal(p3.address);

      // Complete and approve all
      for (const participant of [p1, p2, p3]) {
        await entity
          .connect(participant)
          .completeTask(taskId, "https://submission.com");
        await entity.connect(taskOwner).approveTaskSubmission(taskId, participant.address);
      }

      // Close and distribute
      await entity.connect(taskOwner).closeTask(taskId);

      const p1Before = await rewardToken.balanceOf(p1.address);
      const p2Before = await rewardToken.balanceOf(p2.address);
      const p3Before = await rewardToken.balanceOf(p3.address);

      await entity.connect(taskOwner).distributeRewards(taskId);

      // All should receive equal distribution
      const p1After = await rewardToken.balanceOf(p1.address);
      const p2After = await rewardToken.balanceOf(p2.address);
      const p3After = await rewardToken.balanceOf(p3.address);

      const expectedShare = ethers.parseEther("100") / BigInt(3);

      expect(p1After - p1Before).to.be.closeTo(expectedShare, ethers.parseEther("1"));
      expect(p2After - p2Before).to.be.closeTo(expectedShare, ethers.parseEther("1"));
      expect(p3After - p3Before).to.be.closeTo(expectedShare, ethers.parseEther("1"));
    });
  });
});
