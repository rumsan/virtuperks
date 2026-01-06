import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { App, Entity, RewardToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Entity Contract - Task Management", function () {
  let app: App;
  let entity: Entity;
  let rewardToken: RewardToken;
  let owner: SignerWithAddress;
  let entityOwner: SignerWithAddress;
  let taskOwner: SignerWithAddress;
  let participant1: SignerWithAddress;
  let participant2: SignerWithAddress;
  let entityAddress: string;

  beforeEach(async function () {
    [owner, entityOwner, taskOwner, participant1, participant2] =
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

    // Get entity address from event
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

    // Transfer tokens to entity owner for deposits
    await rewardToken.transfer(
      entityOwner.address,
      ethers.parseEther("10000")
    );

    // Deposit tokens to entity
    await rewardToken.connect(entityOwner).approve(entityAddress, ethers.parseEther("10000"));
    await entity.connect(entityOwner).depositTokens(await rewardToken.getAddress(), ethers.parseEther("10000"));
  });

  describe("Task Creation", function () {
    it("Should create a new task", async function () {
      const taskId = ethers.id("task-1");
      const expiryDate = (await time.latest()) + 86400; // 1 day from now

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

      await expect(
        entity.connect(entityOwner).createTask(taskId, task, [])
      )
        .to.emit(entity, "TaskCreated")
        .withArgs(taskId, entityOwner.address);

      const createdTask = await entity.getTask(taskId);
      expect(createdTask.name).to.equal("Test Task");
      expect(createdTask.isOpen).to.be.true;
    });

    it("Should fail to create task with expired date", async function () {
      const taskId = ethers.id("task-1");
      const expiryDate = (await time.latest()) - 100; // Past date

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

      await expect(
        entity.connect(entityOwner).createTask(taskId, task, [])
      ).to.be.revertedWith("Entity: Invalid expiry");
    });

    it("Should fail to create duplicate task", async function () {
      const taskId = ethers.id("task-1");
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

      await expect(
        entity.connect(entityOwner).createTask(taskId, task, [])
      ).to.be.revertedWith("Entity: Task exists");
    });

    it("Should create task with whitelist", async function () {
      const taskId = ethers.id("task-1");
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
        isWhitelisted: true,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity
        .connect(entityOwner)
        .createTask(taskId, task, [participant1.address]);

      expect(
        await entity.whitelistedParticipants(taskId, participant1.address)
      ).to.be.true;
    });
  });

  describe("Task Management", function () {
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
    });

    it("Should close a task", async function () {
      await expect(entity.connect(taskOwner).closeTask(taskId))
        .to.emit(entity, "TaskClosed")
        .withArgs(taskId, taskOwner.address);

      const task = await entity.getTask(taskId);
      expect(task.isOpen).to.be.false;
    });

    it("Should update task details", async function () {
      const newExpiryDate = (await time.latest()) + 172800; // 2 days
      const newUrl = "https://new-details.com";

      await expect(
        entity
          .connect(taskOwner)
          .updateTaskDetails(taskId, newUrl, newExpiryDate)
      )
        .to.emit(entity, "TaskDetailsUpdated")
        .withArgs(taskId, taskOwner.address);

      const task = await entity.getTask(taskId);
      expect(task.detailsUrl).to.equal(newUrl);
      expect(task.expiryDate).to.equal(newExpiryDate);
    });

    it("Should check if task is expired", async function () {
      expect(await entity.isTaskExpired(taskId)).to.be.false;

      // Fast forward time
      await time.increase(86401);

      expect(await entity.isTaskExpired(taskId)).to.be.true;
    });

    it("Should check if task is open", async function () {
      expect(await entity.isTaskOpen(taskId)).to.be.true;

      await entity.connect(taskOwner).closeTask(taskId);

      expect(await entity.isTaskOpen(taskId)).to.be.false;
    });

    it("Should fail to close task by non-owner", async function () {
      await expect(
        entity.connect(participant1).closeTask(taskId)
      ).to.be.revertedWith("Entity: Not task owner");
    });
  });

  describe("Whitelist Management", function () {
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
        isWhitelisted: true,
        isTokenDisbursed: false,
        maxParticipants: 10,
        acceptedParticipantCount: 0,
        approvedParticipants: [],
      };

      await entity.connect(entityOwner).createTask(taskId, task, []);
    });

    it("Should add participant to whitelist", async function () {
      await expect(
        entity
          .connect(taskOwner)
          .addToWhitelist(taskId, participant1.address, true)
      )
        .to.emit(entity, "ParticipantWhitelisted")
        .withArgs(taskId, participant1.address, taskOwner.address);

      expect(
        await entity.whitelistedParticipants(taskId, participant1.address)
      ).to.be.true;
    });

    it("Should remove participant from whitelist", async function () {
      await entity
        .connect(taskOwner)
        .addToWhitelist(taskId, participant1.address, true);

      await expect(
        entity
          .connect(taskOwner)
          .removeFromWhitelist(taskId, participant1.address)
      )
        .to.emit(entity, "ParticipantRemovedFromWhitelist")
        .withArgs(taskId, participant1.address, taskOwner.address);

      expect(
        await entity.whitelistedParticipants(taskId, participant1.address)
      ).to.be.false;
    });

    it("Should fail to add duplicate to whitelist with throwError", async function () {
      await entity
        .connect(taskOwner)
        .addToWhitelist(taskId, participant1.address, true);

      await expect(
        entity
          .connect(taskOwner)
          .addToWhitelist(taskId, participant1.address, true)
      ).to.be.revertedWith("Entity: Participant already whitelisted");
    });
  });
});
