import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { App, Entity, RewardToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("App Contract", function () {
  let app: App;
  let owner: SignerWithAddress;
  let entityOwner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async function () {
    [owner, entityOwner, addr1] = await ethers.getSigners();

    const Entity = await ethers.getContractFactory("Entity");
    const entityImplementation = await Entity.deploy();
    await entityImplementation.waitForDeployment();

    const App = await ethers.getContractFactory("App");
    app = (await upgrades.deployProxy(App, [owner.address, await entityImplementation.getAddress(), "Test App"], {
      initializer: "initialize",
      kind: "uups",
    })) as unknown as App;
    await app.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await app.owner()).to.equal(owner.address);
    });

    it("Should initialize the app with name and active status", async function () {
      expect(await app.getAppName()).to.equal("Test App");
      expect(await app.isAppActive()).to.be.true;
    });
  });

  describe("App Management", function () {

    it("Should update app name", async function () {
      await expect(app.updateAppName("Updated App Name"))
        .to.emit(app, "AppNameUpdated")
        .withArgs("Test App", "Updated App Name", owner.address);

      expect(await app.getAppName()).to.equal("Updated App Name");
    });

    it("Should fail to update app name with empty string", async function () {
      await expect(app.updateAppName("")).to.be.revertedWith("App: name empty");
    });

    it("Should transfer app ownership", async function () {
      await expect(app.transferOwnership(addr1.address))
        .to.emit(app, "OwnershipTransferred")
        .withArgs(owner.address, addr1.address);

      expect(await app.owner()).to.equal(addr1.address);
    });

    it("Should fail to transfer to zero address", async function () {
      await expect(app.transferOwnership(ethers.ZeroAddress)).to.be.revertedWithCustomError(
        app,
        "OwnableInvalidOwner"
      );
    });

    it("Should fail when non-owner tries to update name", async function () {
      await expect(app.connect(addr1).updateAppName("New Name")).to.be.revertedWithCustomError(
        app,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should fail when non-owner tries to transfer ownership", async function () {
      await expect(app.connect(addr1).transferOwnership(addr1.address)).to.be.revertedWithCustomError(
        app,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should deactivate the app", async function () {
      await expect(app.deactivateApp())
        .to.emit(app, "AppDeactivated")
        .withArgs(owner.address);

      expect(await app.isAppActive()).to.be.false;
    });

    it("Should fail to deactivate already deactivated app", async function () {
      await app.deactivateApp();
      await expect(app.deactivateApp()).to.be.revertedWith(
        "App: already deactivated"
      );
    });

    it("Should fail when non-owner tries to deactivate app", async function () {
      await expect(app.connect(addr1).deactivateApp()).to.be.revertedWithCustomError(
        app,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("Entity Creation", function () {

    it("Should create a new entity", async function () {
      const tx = await app.createEntity(
        entityOwner.address,
        "Test Entity",
        "https://test.com"
      );
      const receipt = await tx.wait();

      expect(receipt).to.not.be.null;

      // Check that entity was added to app
      const entities = await app.getAppEntities();
      expect(entities.length).to.equal(1);
    });

    it("Should fail to create entity for deactivated app", async function () {
      await app.deactivateApp();
      await expect(
        app.createEntity(
          entityOwner.address,
          "Test Entity",
          "https://test.com"
        )
      ).to.be.revertedWith("App: app is deactivated");
    });

    it("Should fail with invalid entity owner", async function () {
      await expect(
        app.createEntity(
          ethers.ZeroAddress,
          "Test Entity",
          "https://test.com"
        )
      ).to.be.revertedWith("App: invalid entity owner");
    });
  });

  describe("Global Shutdown Control", function () {
    it("Should allow owner to stop the app", async function () {
      await expect(app.stop())
        .to.emit(app, "AppStopped")
        .withArgs(owner.address);

      expect(await app.stopped()).to.be.true;
    });

    it("Should fail to create entity when app is stopped", async function () {
      await app.stop();
      await expect(
        app.createEntity(
          entityOwner.address,
          "Test Entity",
          "https://test.com"
        )
      ).to.be.revertedWith("App: stopped");
    });

    it("Should fail to stop app twice", async function () {
      await app.stop();
      await expect(app.stop()).to.be.revertedWith("App: already stopped");
    });
  });

  describe("Entity Implementation Management", function () {
    it("Should update entity implementation", async function () {
      const EntityV2 = await ethers.getContractFactory("Entity");
      const newImpl = await EntityV2.deploy();
      await newImpl.waitForDeployment();
      const newImplAddress = await newImpl.getAddress();

      await expect(app.setEntityImplementation(newImplAddress))
        .to.emit(app, "EntityImplementationUpdated")
        .withArgs(await app.entityImplementation(), newImplAddress);

      expect(await app.entityImplementation()).to.equal(newImplAddress);
    });

    it("Should fail to set entity implementation when stopped", async function () {
      const EntityV2 = await ethers.getContractFactory("Entity");
      const newImpl = await EntityV2.deploy();
      await newImpl.waitForDeployment();
      const newImplAddress = await newImpl.getAddress();

      await app.stop();
      await expect(
        app.setEntityImplementation(newImplAddress)
      ).to.be.revertedWith("App: stopped");
    });
  });

  describe("View Functions", function () {
    it("Should get app info", async function () {
      expect(await app.getAppName()).to.equal("Test App");
      expect(await app.owner()).to.equal(owner.address);
      expect(await app.isAppActive()).to.be.true;
    });

    it("Should check if app is active", async function () {
      expect(await app.isAppActive()).to.be.true;

      await app.deactivateApp();
      expect(await app.isAppActive()).to.be.false;
    });
  });

  describe("Upgradeability", function () {
    it("Should upgrade the contract", async function () {
      const AppV2 = await ethers.getContractFactory("App");
      const upgraded = await upgrades.upgradeProxy(
        await app.getAddress(),
        AppV2
      );
      
      expect(await upgraded.getAddress()).to.equal(await app.getAddress());
    });

    it("Should fail when non-owner tries to upgrade", async function () {
      const AppV2 = await ethers.getContractFactory("App", addr1);
      await expect(
        upgrades.upgradeProxy(await app.getAddress(), AppV2)
      ).to.be.reverted;
    });
  });
});
