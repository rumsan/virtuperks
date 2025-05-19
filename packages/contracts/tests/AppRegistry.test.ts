import {loadFixture} from '@nomicfoundation/hardhat-toolbox/network-helpers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

const getFunctionId = (signature: string) => {
  return ethers.FunctionFragment.from(signature).selector;
};

describe('------ App Registry Tests ------', function () {
  // Fixture for deploying the AppRegistry contract
  async function deployAppRegistryFixture() {
    const [deployer, admin1, admin2, user1, user2] = await ethers.getSigners();

    // Deploy AppRegistry contract
    const AppRegistry = await ethers.getContractFactory('AppRegistry');
    const appRegistry = await AppRegistry.deploy();

    // Define constants
    const APP_ID = ethers.id('TEST_APP');
    const SECOND_APP_ID = ethers.id('SECOND_APP');
    const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
    const MANAGER_ROLE = ethers.id('MANAGER');
    const CONTRIBUTOR_ROLE = ethers.id('CONTRIBUTOR');

    return {
      appRegistry,
      deployer,
      admin1,
      admin2,
      user1,
      user2,
      APP_ID,
      SECOND_APP_ID,
      DEFAULT_ADMIN_ROLE,
      MANAGER_ROLE,
      CONTRIBUTOR_ROLE,
    };
  }

  describe('Deployment', function () {
    it('should deploy contract successfully', async function () {
      const {appRegistry} = await loadFixture(deployAppRegistryFixture);
      expect(appRegistry.target).to.be.properAddress;
    });

    it('should set DEFAULT_ADMIN_ROLE to zero hash', async function () {
      const {appRegistry, DEFAULT_ADMIN_ROLE} = await loadFixture(
        deployAppRegistryFixture,
      );
      expect(await appRegistry.DEFAULT_ADMIN_ROLE()).to.equal(
        DEFAULT_ADMIN_ROLE,
      );
    });

    it('should implement the correct interface', async function () {
      const {appRegistry} = await loadFixture(deployAppRegistryFixture);
      // Check IAppRegistry interface support via ERC165
      const interfaceId = getFunctionId('supportsInterface(bytes4)');
      expect(await appRegistry.supportsInterface(interfaceId)).to.be.true;
    });
  });

  describe('App Creation', function () {
    it('should create a new app correctly', async function () {
      const {appRegistry, APP_ID, admin1} = await loadFixture(
        deployAppRegistryFixture,
      );

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Verify app was created
      expect(await appRegistry.isAppExists(APP_ID)).to.be.true;

      // Check app details
      const [name, isPrivate] = await appRegistry.getAppDetails(APP_ID);
      expect(name).to.equal('Test App');
      expect(isPrivate).to.be.false;

      // Check admin role was assigned
      expect(await appRegistry.isAppAdmin(APP_ID, admin1!.address)).to.be.true;
    });

    it('should revert when creating app with zero app ID', async function () {
      const {appRegistry, admin1} = await loadFixture(deployAppRegistryFixture);

      await expect(
        appRegistry.createApp(
          ethers.ZeroHash,
          'Test App',
          admin1!.address,
          false,
        ),
      ).to.be.revertedWith('AppRegistry: App ID cannot be zero');
    });

    it('should revert when creating app with empty name', async function () {
      const {appRegistry, APP_ID, admin1} = await loadFixture(
        deployAppRegistryFixture,
      );

      await expect(
        appRegistry.createApp(APP_ID, '', admin1!.address, false),
      ).to.be.revertedWith('AppRegistry: App name cannot be empty');
    });

    it('should revert when creating app with zero address admin', async function () {
      const {appRegistry, APP_ID} = await loadFixture(deployAppRegistryFixture);

      await expect(
        appRegistry.createApp(APP_ID, 'Test App', ethers.ZeroAddress, false),
      ).to.be.revertedWith('AppRegistry: Admin cannot be zero address');
    });

    it('should revert when creating an app that already exists', async function () {
      const {appRegistry, APP_ID, admin1} = await loadFixture(
        deployAppRegistryFixture,
      );

      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      await expect(
        appRegistry.createApp(APP_ID, 'Duplicate App', admin1!.address, false),
      ).to.be.revertedWith('AppRegistry: App already exists.');
    });
  });

  describe('App Management', function () {
    it('should update app name correctly', async function () {
      const {appRegistry, APP_ID, admin1} = await loadFixture(
        deployAppRegistryFixture,
      );

      // Create app with admin1 as the admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Update app name
      await appRegistry
        .connect(admin1!)
        .updateAppName(APP_ID, 'Updated App Name');

      // Verify name was updated
      const [name] = await appRegistry.getAppDetails(APP_ID);
      expect(name).to.equal('Updated App Name');
    });

    it('should update privacy status correctly', async function () {
      const {appRegistry, APP_ID, admin1} = await loadFixture(
        deployAppRegistryFixture,
      );

      // Create app with admin1 as the admin (initially public)
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Change to private
      await appRegistry.connect(admin1!).setPrivate(APP_ID, true);

      // Verify privacy status was updated
      expect(await appRegistry.isPrivate(APP_ID)).to.be.true;

      // Change back to public
      await appRegistry.connect(admin1!).setPrivate(APP_ID, false);

      // Verify privacy status was updated again
      expect(await appRegistry.isPrivate(APP_ID)).to.be.false;
    });

    it('should revert when updating app name by non-admin', async function () {
      const {appRegistry, APP_ID, admin1, user1} = await loadFixture(
        deployAppRegistryFixture,
      );

      // Create app with admin1 as the admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Attempt to update app name by non-admin
      await expect(
        appRegistry
          .connect(user1!)
          .updateAppName(APP_ID, 'Unauthorized Update'),
      ).to.be.reverted; // Will revert with AccessControlUnauthorizedAccount error
    });

    it('should revert when updating privacy status by non-admin', async function () {
      const {appRegistry, APP_ID, admin1, user1} = await loadFixture(
        deployAppRegistryFixture,
      );

      // Create app with admin1 as the admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Attempt to update privacy status by non-admin
      await expect(appRegistry.connect(user1!).setPrivate(APP_ID, true)).to.be
        .reverted; // Will revert with AccessControlUnauthorizedAccount error
    });
  });

  describe('AppRegistry Events', function () {
    it('should emit AppCreated event when creating an app', async function () {
      const {appRegistry, APP_ID, admin1, deployer} = await loadFixture(
        deployAppRegistryFixture,
      );

      await expect(
        appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false),
      )
        .to.emit(appRegistry, 'AppCreated')
        .withArgs(APP_ID, admin1!.address, deployer!.address);
    });

    it('should emit AppNameUpdated event when updating app name', async function () {
      const {appRegistry, APP_ID, admin1} = await loadFixture(
        deployAppRegistryFixture,
      );

      // Create app with admin1 as the admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Update app name and check for event
      await expect(
        appRegistry.connect(admin1!).updateAppName(APP_ID, 'Updated App Name'),
      )
        .to.emit(appRegistry, 'AppNameUpdated')
        .withArgs(APP_ID, 'Updated App Name', admin1!.address);
    });

    it('should emit AppPrivacyChanged event when updating privacy status', async function () {
      const {appRegistry, APP_ID, admin1} = await loadFixture(
        deployAppRegistryFixture,
      );

      // Create app with admin1 as the admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Update privacy status and check for event
      await expect(appRegistry.connect(admin1!).setPrivate(APP_ID, true))
        .to.emit(appRegistry, 'AppPrivacyChanged')
        .withArgs(APP_ID, true, admin1!.address);
    });
  });

  describe('Role Event Testing', function () {
    it('should emit RoleGranted event when granting a role', async function () {
      const {
        appRegistry,
        APP_ID,
        admin1,
        user1,
        MANAGER_ROLE,
        DEFAULT_ADMIN_ROLE,
        deployer,
      } = await loadFixture(deployAppRegistryFixture);

      // Create app with admin1 as the app admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Since the app admin (admin1) has DEFAULT_ADMIN_ROLE admin rights, they can grant DEFAULT_ADMIN_ROLE to other users
      // Grant DEFAULT_ADMIN_ROLE to user1
      await expect(
        appRegistry
          .connect(admin1!)
          .grantRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address),
      )
        .to.emit(appRegistry, 'RoleGranted')
        .withArgs(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address, admin1!.address);
    });

    it('should emit RoleRevoked event when revoking a role', async function () {
      const {appRegistry, APP_ID, admin1, user1, DEFAULT_ADMIN_ROLE, deployer} =
        await loadFixture(deployAppRegistryFixture);

      // Create app with admin1 as the app admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Grant DEFAULT_ADMIN_ROLE to user1
      await appRegistry
        .connect(admin1!)
        .grantRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address);

      // Revoke DEFAULT_ADMIN_ROLE from user1
      await expect(
        appRegistry
          .connect(admin1!)
          .revokeRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address),
      )
        .to.emit(appRegistry, 'RoleRevoked')
        .withArgs(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address, admin1!.address);
    });

    it('should emit RoleAdminGranted event when granting role admin', async function () {
      const {
        appRegistry,
        APP_ID,
        admin1,
        admin2,
        DEFAULT_ADMIN_ROLE,
        deployer,
      } = await loadFixture(deployAppRegistryFixture);

      // Create app with admin1 as the app admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Grant DEFAULT_ADMIN_ROLE admin rights to admin2 by admin1 (who has DEFAULT_ADMIN_ROLE admin rights)
      await expect(
        appRegistry
          .connect(admin1!)
          .grantRoleAdmin(APP_ID, DEFAULT_ADMIN_ROLE, admin2!.address),
      )
        .to.emit(appRegistry, 'RoleAdminGranted')
        .withArgs(APP_ID, DEFAULT_ADMIN_ROLE, admin2!.address, admin1!.address);
    });

    it('should emit RoleAdminRevoked event when revoking role admin', async function () {
      const {
        appRegistry,
        APP_ID,
        admin1,
        admin2,
        DEFAULT_ADMIN_ROLE,
        deployer,
      } = await loadFixture(deployAppRegistryFixture);

      // Create app with admin1 as the app admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Grant DEFAULT_ADMIN_ROLE admin rights to admin2
      await appRegistry
        .connect(admin1!)
        .grantRoleAdmin(APP_ID, DEFAULT_ADMIN_ROLE, admin2!.address);

      // Revoke DEFAULT_ADMIN_ROLE admin rights from admin2
      await expect(
        appRegistry
          .connect(admin1!)
          .revokeRoleAdmin(APP_ID, DEFAULT_ADMIN_ROLE, admin2!.address),
      )
        .to.emit(appRegistry, 'RoleAdminRevoked')
        .withArgs(APP_ID, DEFAULT_ADMIN_ROLE, admin2!.address, admin1!.address);
    });
  });

  describe('Multi-App Management', function () {
    it('should manage multiple apps independently', async function () {
      const {appRegistry, APP_ID, SECOND_APP_ID, admin1, admin2} =
        await loadFixture(deployAppRegistryFixture);

      // Create two different apps
      await appRegistry.createApp(APP_ID, 'First App', admin1!.address, false);
      await appRegistry.createApp(
        SECOND_APP_ID,
        'Second App',
        admin2!.address,
        true,
      );

      // Verify app details
      let [name, isPrivate] = await appRegistry.getAppDetails(APP_ID);
      expect(name).to.equal('First App');
      expect(isPrivate).to.be.false;

      [name, isPrivate] = await appRegistry.getAppDetails(SECOND_APP_ID);
      expect(name).to.equal('Second App');
      expect(isPrivate).to.be.true;

      // Verify admin roles
      expect(await appRegistry.isAppAdmin(APP_ID, admin1!.address)).to.be.true;
      expect(await appRegistry.isAppAdmin(APP_ID, admin2!.address)).to.be.false;
      expect(await appRegistry.isAppAdmin(SECOND_APP_ID, admin2!.address)).to.be
        .true;
      expect(await appRegistry.isAppAdmin(SECOND_APP_ID, admin1!.address)).to.be
        .false;
    });
  });

  describe('Role Management', function () {
    it('should grant roles correctly when caller has the right admin permissions', async function () {
      const {appRegistry, APP_ID, admin1, user1, DEFAULT_ADMIN_ROLE, deployer} =
        await loadFixture(deployAppRegistryFixture);

      // Create app with admin1 as the app admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // admin1 can grant DEFAULT_ADMIN_ROLE to other users
      await appRegistry
        .connect(admin1!)
        .grantRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address);

      // Verify role was granted
      expect(
        await appRegistry.hasRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address),
      ).to.be.true;
    });

    it('should revoke roles correctly', async function () {
      const {appRegistry, APP_ID, admin1, user1, DEFAULT_ADMIN_ROLE, deployer} =
        await loadFixture(deployAppRegistryFixture);

      // Create app with admin1 as the app admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Grant DEFAULT_ADMIN_ROLE to user1
      await appRegistry
        .connect(admin1!)
        .grantRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address);

      // Revoke DEFAULT_ADMIN_ROLE from user1
      await appRegistry
        .connect(admin1!)
        .revokeRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address);

      // Verify role was revoked
      expect(
        await appRegistry.hasRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address),
      ).to.be.false;
    });

    it('should allow roles to be renounced', async function () {
      const {appRegistry, APP_ID, admin1, user1, DEFAULT_ADMIN_ROLE, deployer} =
        await loadFixture(deployAppRegistryFixture);

      // Create app with admin1 as the app admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Grant DEFAULT_ADMIN_ROLE to user1
      await appRegistry
        .connect(admin1!)
        .grantRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address);

      // user1 renounces DEFAULT_ADMIN_ROLE
      await appRegistry
        .connect(user1!)
        .renounceRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address);

      // Verify role was renounced
      expect(
        await appRegistry.hasRole(APP_ID, DEFAULT_ADMIN_ROLE, user1!.address),
      ).to.be.false;
    });

    it('should revert when granting role without admin permission', async function () {
      const {
        appRegistry,
        APP_ID,
        admin1,
        user1,
        user2,
        DEFAULT_ADMIN_ROLE,
        deployer,
      } = await loadFixture(deployAppRegistryFixture);

      // Create app with admin1 as the app admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Attempt to grant DEFAULT_ADMIN_ROLE to user2 by user1 (who is not an admin)
      await expect(
        appRegistry
          .connect(user1!)
          .grantRole(APP_ID, DEFAULT_ADMIN_ROLE, user2!.address),
      ).to.be.reverted; // Will revert with AccessControlUnauthorizedAccount error
    });
  });

  describe('Role Admin Management', function () {
    it('should grant role admin correctly', async function () {
      const {
        appRegistry,
        APP_ID,
        admin1,
        admin2,
        MANAGER_ROLE,
        DEFAULT_ADMIN_ROLE,
        deployer,
      } = await loadFixture(deployAppRegistryFixture);

      // Create app with admin1 as the admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // admin1 first grants MANAGER_ROLE admin rights to themselves
      await appRegistry
        .connect(admin1!)
        .grantRoleAdmin(APP_ID, MANAGER_ROLE, admin1!.address);

      // Then admin1 grants MANAGER_ROLE admin rights to admin2
      await appRegistry
        .connect(admin1!)
        .grantRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address);

      // Verify admin role was granted
      expect(
        await appRegistry.isRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address),
      ).to.be.true;

      // The role should be granted too (since admins automatically get the role)
      expect(await appRegistry.hasRole(APP_ID, MANAGER_ROLE, admin2!.address))
        .to.be.true;
    });

    it('should revoke role admin correctly', async function () {
      const {
        appRegistry,
        APP_ID,
        admin1,
        admin2,
        MANAGER_ROLE,
        DEFAULT_ADMIN_ROLE,
        deployer,
      } = await loadFixture(deployAppRegistryFixture);

      // Create app with admin1 as the admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // admin1 first grants MANAGER_ROLE admin rights to themselves
      await appRegistry
        .connect(admin1!)
        .grantRoleAdmin(APP_ID, MANAGER_ROLE, admin1!.address);

      // Then admin1 grants MANAGER_ROLE admin rights to admin2
      await appRegistry
        .connect(admin1!)
        .grantRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address);

      // Revoke MANAGER_ROLE admin from admin2
      await appRegistry
        .connect(admin1!)
        .revokeRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address);

      // Verify admin role was revoked
      expect(
        await appRegistry.isRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address),
      ).to.be.false;
    });

    it('should not allow revoking the last admin', async function () {
      const {appRegistry, APP_ID, admin1, DEFAULT_ADMIN_ROLE, deployer} =
        await loadFixture(deployAppRegistryFixture);

      // Create app with admin1 as the admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // Try to revoke the only DEFAULT_ADMIN_ROLE admin
      await expect(
        appRegistry
          .connect(admin1!)
          .revokeRoleAdmin(APP_ID, DEFAULT_ADMIN_ROLE, admin1!.address),
      ).to.be.revertedWith('AppRegistry: Cannot revoke last admin');
    });

    it('should allow renouncing role admin', async function () {
      const {
        appRegistry,
        APP_ID,
        admin1,
        admin2,
        MANAGER_ROLE,
        DEFAULT_ADMIN_ROLE,
        deployer,
      } = await loadFixture(deployAppRegistryFixture);

      // Create app with admin1 as the admin
      await appRegistry.createApp(APP_ID, 'Test App', admin1!.address, false);

      // admin1 first grants MANAGER_ROLE admin rights to themselves
      await appRegistry
        .connect(admin1!)
        .grantRoleAdmin(APP_ID, MANAGER_ROLE, admin1!.address);

      // admin1 grants MANAGER_ROLE admin rights to admin2
      await appRegistry
        .connect(admin1!)
        .grantRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address);

      // admin2 renounces MANAGER_ROLE admin
      await appRegistry
        .connect(admin2!)
        .renounceRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address);

      // Verify admin role was renounced
      expect(
        await appRegistry.isRoleAdmin(APP_ID, MANAGER_ROLE, admin2!.address),
      ).to.be.false;
    });
  });
});
