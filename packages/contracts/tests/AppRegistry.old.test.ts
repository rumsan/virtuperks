import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { deployAppRegistryFixture } from './fixtures/AppRegistryFixture';

describe('------ App Registry Tests ------', function () {
  // Use the existing fixture instead of defining a new one
  async function fixture() {
    return loadFixture(deployAppRegistryFixture);
  }

  describe('Deployment', function () {
    it('should deploy contract successfully', async function () {
      const { appRegistry } = await fixture();
      expect(appRegistry.target).to.be.properAddress;
    });

    it('should set DEFAULT_ADMIN_ROLE to zero hash', async function () {
      const { appRegistry, DEFAULT_ADMIN_ROLE } = await fixture();
      expect(await appRegistry.DEFAULT_ADMIN_ROLE()).to.equal(DEFAULT_ADMIN_ROLE);
    });

    it('should implement the correct interface', async function () {
      const { appRegistry } = await fixture();
      const interfaceId = ethers.FunctionFragment.from('supportsInterface(bytes4)').selector;
      expect(await appRegistry.supportsInterface(interfaceId)).to.be.true;
    });
  });

  describe('App Creation', function () {
    it('should create a new app correctly', async function () {
      const { appRegistry, APP_ID, admin1 } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      expect(await appRegistry.isAppExists(APP_ID)).to.be.true;

      const [name, isPrivate] = await appRegistry.getAppDetails(APP_ID);
      expect(name).to.equal('Test App');
      expect(isPrivate).to.be.false;

      expect(await appRegistry.isAppAdmin(APP_ID, admin1!.address)).to.be.true;
    });

    it('should revert when creating app with zero app ID', async function () {
      const { appRegistry, admin1 } = await fixture();

      await expect(
        appRegistry.createApp(ethers.ZeroHash, 'Test App', admin1!.address, false),
      ).to.be.revertedWith('AppRegistry: App ID cannot be zero');
    });

    it('should revert when creating app with empty name', async function () {
      const { appRegistry, APP_ID, admin1 } = await fixture();

      await expect(
        appRegistry.createApp(APP_ID, '', admin1!.address, false),
      ).to.be.revertedWith('AppRegistry: App name cannot be empty');
    });

    it('should revert when creating app with zero address admin', async function () {
      const { appRegistry, APP_ID } = await fixture();

      await expect(
        appRegistry.createApp(APP_ID, 'Test App', ethers.ZeroAddress, false),
      ).to.be.revertedWith('AppRegistry: Admin cannot be zero address');
    });

    it('should revert when creating an app that already exists', async function () {
      const { appRegistry, APP_ID, admin1 } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await expect(
        appRegistry.createApp(APP_ID, 'Duplicate App', admin1!.address, false),
      ).to.be.revertedWith('AppRegistry: App already exists.');
    });
  });

  describe('App Management', function () {
    it('should update app name correctly', async function () {
      const { appRegistry, APP_ID, admin1 } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await appRegistry.connect(admin1!).updateAppName(APP_ID, 'Updated App Name');

      const [name] = await appRegistry.getAppDetails(APP_ID);
      expect(name).to.equal('Updated App Name');
    });

    it('should update privacy status correctly', async function () {
      const { appRegistry, APP_ID, admin1 } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await appRegistry.connect(admin1!).setPrivate(APP_ID, true);
      expect(await appRegistry.isPrivate(APP_ID)).to.be.true;

      await appRegistry.connect(admin1!).setPrivate(APP_ID, false);
      expect(await appRegistry.isPrivate(APP_ID)).to.be.false;
    });

    it('should revert when updating app name by non-admin', async function () {
      const { appRegistry, APP_ID, admin1, user1 } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await expect(
        appRegistry.connect(user1!).updateAppName(APP_ID, 'Unauthorized Update'),
      ).to.be.reverted;
    });

    it('should revert when updating privacy status by non-admin', async function () {
      const { appRegistry, APP_ID, admin1, user1 } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await expect(appRegistry.connect(user1!).setPrivate(APP_ID, true)).to.be.reverted;
    });
  });

  describe('AppRegistry Events', function () {
    it('should emit AppCreated event when creating an app', async function () {
      const { appRegistry, APP_ID, admin1, deployer } = await fixture();

      await expect(
        appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false),
      )
        .to.emit(appRegistry, 'AppCreated')
        .withArgs(APP_ID, admin1!.address, deployer!.address);
    });

    it('should emit AppNameUpdated event when updating app name', async function () {
      const { appRegistry, APP_ID, admin1 } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await expect(
        appRegistry.connect(admin1!).updateAppName(APP_ID, 'Updated App Name'),
      )
        .to.emit(appRegistry, 'AppNameUpdated')
        .withArgs(APP_ID, 'Updated App Name', admin1!.address);
    });

    it('should emit AppPrivacyChanged event when updating privacy status', async function () {
      const { appRegistry, APP_ID, admin1 } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await expect(appRegistry.connect(admin1!).setPrivate(APP_ID, true))
        .to.emit(appRegistry, 'AppPrivacyChanged')
        .withArgs(APP_ID, true, admin1!.address);
    });
  });

  describe('Role Event Testing', function () {
    it('should emit RoleGranted event when granting a role', async function () {
      const { appRegistry, APP_ID, admin1, user1, MANAGER_ROLE, DEFAULT_ADMIN_ROLE } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await expect(
        appRegistry.connect(admin1!).grantRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address),
      )
        .to.emit(appRegistry, 'RoleGranted')
        .withArgs(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address, admin1!.address);
    });

    it('should emit RoleRevoked event when revoking a role', async function () {
      const { appRegistry, APP_ID, admin1, user1, DEFAULT_ADMIN_ROLE } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await appRegistry.connect(admin1!).grantRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address);

      await expect(
        appRegistry.connect(admin1!).revokeRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address),
      )
        .to.emit(appRegistry, 'RoleRevoked')
        .withArgs(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address, admin1!.address);
    });

    it('should emit RoleAdminGranted event when granting role admin', async function () {
      const { appRegistry, APP_ID, admin1, admin2, DEFAULT_ADMIN_ROLE } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await expect(
        appRegistry.connect(admin1!).grantRoleAdmin(APP_ID, DEFAULT_ADMIN_ROLE, admin2!.address),
      )
        .to.emit(appRegistry, 'RoleAdminGranted')
        .withArgs(APP_ID, DEFAULT_ADMIN_ROLE, admin2!.address, admin1!.address);
    });

    it('should emit RoleAdminRevoked event when revoking role admin', async function () {
      const { appRegistry, APP_ID, admin1, admin2, DEFAULT_ADMIN_ROLE } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await appRegistry.connect(admin1!).grantRoleAdmin(APP_ID, DEFAULT_ADMIN_ROLE, admin2!.address);

      await expect(
        appRegistry.connect(admin1!).revokeRoleAdmin(APP_ID, DEFAULT_ADMIN_ROLE, admin2!.address),
      )
        .to.emit(appRegistry, 'RoleAdminRevoked')
        .withArgs(APP_ID, DEFAULT_ADMIN_ROLE, admin2!.address, admin1!.address);
    });
  });

  describe('Multi-App Management', function () {
    it('should manage multiple apps independently', async function () {
      const { appRegistry, APP_ID, SECOND_APP_ID, admin1, admin2 } = await fixture();

      await appRegistry.createApp(APP_ID, 'First App', admin1!.address, false);
      await appRegistry.createApp(SECOND_APP_ID, 'Second App', admin2!.address, true);

      let [name, isPrivate] = await appRegistry.getAppDetails(APP_ID);
      expect(name).to.equal('First App');
      expect(isPrivate).to.be.false;

      [name, isPrivate] = await appRegistry.getAppDetails(SECOND_APP_ID);
      expect(name).to.equal('Second App');
      expect(isPrivate).to.be.true;

      expect(await appRegistry.isAppAdmin(APP_ID, admin1!.address)).to.be.true;
      expect(await appRegistry.isAppAdmin(APP_ID, admin2!.address)).to.be.false;
      expect(await appRegistry.isAppAdmin(SECOND_APP_ID, admin2!.address)).to.be.true;
      expect(await appRegistry.isAppAdmin(SECOND_APP_ID, admin1!.address)).to.be.false;
    });
  });

  describe('Role Management', function () {
    it('should grant roles correctly when caller has the right admin permissions', async function () {
      const { appRegistry, APP_ID, admin1, user1, DEFAULT_ADMIN_ROLE } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await appRegistry.connect(admin1!).grantRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address);

      expect(await appRegistry.hasRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address)).to.be.true;
    });

    it('should revoke roles correctly', async function () {
      const { appRegistry, APP_ID, admin1, user1, DEFAULT_ADMIN_ROLE } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await appRegistry.connect(admin1!).grantRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address);

      await appRegistry.connect(admin1!).revokeRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address);

      expect(await appRegistry.hasRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address)).to.be.false;
    });

    it('should allow roles to be renounced', async function () {
      const { appRegistry, APP_ID, admin1, user1, DEFAULT_ADMIN_ROLE } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await appRegistry.connect(admin1!).grantRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address);

      await appRegistry.connect(user1!).renounceRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address);

      expect(await appRegistry.hasRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address)).to.be.false;
    });

    it('should revert when granting role without admin permission', async function () {
      const { appRegistry, APP_ID, admin1, user1, user2, DEFAULT_ADMIN_ROLE } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await expect(
        appRegistry.connect(user1!).grantRole(APP_ID, DEFAULT_ADMIN_ROLE, user2!.address),
      ).to.be.reverted;
    });
  });

  describe('Role Admin Management', function () {
    it('should grant role admin correctly', async function () {
      const { appRegistry, APP_ID, admin1, admin2, MANAGER_ROLE } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await appRegistry.connect(admin1!).grantRoleAdmin(APP_ID, MANAGER_ROLE, admin1!.address);

      await appRegistry.connect(admin1!).grantRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address);

      expect(await appRegistry.isRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address)).to.be.true;
      expect(await appRegistry.hasRole(APP_ID, MANAGER_ROLE, admin2!.address)).to.be.true;
    });

    it('should revoke role admin correctly', async function () {
      const { appRegistry, APP_ID, admin1, admin2, MANAGER_ROLE } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await appRegistry.connect(admin1!).grantRoleAdmin(APP_ID, MANAGER_ROLE, admin1!.address);

      await appRegistry.connect(admin1!).grantRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address);

      await appRegistry.connect(admin1!).revokeRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address);

      expect(await appRegistry.isRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address)).to.be.false;
    });

    it('should not allow revoking the last admin', async function () {
      const { appRegistry, APP_ID, admin1, DEFAULT_ADMIN_ROLE } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await expect(
        appRegistry.connect(admin1!).revokeRoleAdmin(APP_ID, DEFAULT_ADMIN_ROLE, admin1!.address),
      ).to.be.revertedWith('AppRegistry: Cannot revoke last admin');
    });

    it('should allow renouncing role admin', async function () {
      const { appRegistry, APP_ID, admin1, admin2, MANAGER_ROLE } = await fixture();

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await appRegistry.connect(admin1!).grantRoleAdmin(APP_ID, MANAGER_ROLE, admin1!.address);

      await appRegistry.connect(admin1!).grantRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address);

      await appRegistry.connect(admin2!).renounceRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address);

      expect(await appRegistry.isRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address)).to.be.false;
    });
  });
});
