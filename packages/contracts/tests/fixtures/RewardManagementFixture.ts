import { ethers } from 'hardhat';
import { deployAppRegistryFixture } from './AppRegistryFixture';

/**
 * Interface defining the shape of the fixture return object
 * Contains all the deployed contracts and test accounts needed for testing
 */
export interface RewardManagementFixture {
  rewardManagement: any;
  appRegistry: any;
  rewardToken: any;
  rumsanForwarder: any;
  deployer?: any;
  owner: any;
  App: any;
  user1: any;
  admin1: any;
  user2: any;
  OwnerRole?: any;
  participant1: any;
  participant2: any;
  taskOwner: any;
  APP_ID: string;
  OWNER_ROLE: string;
  PARTICIPANT_ROLE: string;
}

/**
 * Deploys all contracts needed for testing the RewardManagement system
 * This includes:
 * - AppRegistry contract
 * - RewardToken contract
 * - RewardManagement contract
 * - ERC2771Forwarder contract
 * Also sets up all necessary roles and mints initial tokens
 * @returns Object containing all deployed contracts and configured accounts
 */
export async function deployRewardManagementFixture(): Promise<RewardManagementFixture> {
  // Deploy and configure AppRegistry
  const appRegistryFixture = await deployAppRegistryFixture();
  const { appRegistry, APP_ID, owner, admin1, user1, user2, TEST_APP_NAME, OWNER_ROLE, deployer, DEFAULT_ADMIN_ROLE, MINTER, participant1, participant2 } = appRegistryFixture;

  // Create application in AppRegistry
  const App = await appRegistry.createApp(APP_ID, TEST_APP_NAME, admin1!.address, false);
  const app = await appRegistry.isAppExists(APP_ID);
  console.log(app, 'app created');

  // Verify admin roles
  console.log(appRegistry.target, 'appRegistry target');
  const isRoleAdmin = await appRegistry.isRoleAdmin(APP_ID, DEFAULT_ADMIN_ROLE, admin1.address);
  console.log(isRoleAdmin, 'is role admin');

  // Verify app admin status
  const isAppAdmin = await appRegistry.isAppAdmin(APP_ID, admin1.address);
  console.log(isAppAdmin, "deployer is app admin");

  // Deploy forwarder for meta-transactions
  const rumsanForwarder = await ethers.deployContract("ERC2771Forwarder", ['rumsanForwarder']);

  // Deploy reward token with meta-transaction support
  const rewardToken = await ethers.deployContract("RewardToken", [
    "Rahat",
    "RTH",
    0,
    APP_ID,
    appRegistry.target,
    rumsanForwarder.target
  ]);
  console.log(rewardToken.target, 'rewardToken');

  // Deploy reward management system
  const RewardManagement = await ethers.getContractFactory('RewardManagement');
  const rewardManagement = await RewardManagement.deploy(
    APP_ID,
    "Test Reward Management",
    appRegistry.target
  );
  await rewardManagement.waitForDeployment();

  // Setup roles for reward management
  const ownerRole = await rewardManagement.OWNER();
 console.log(ownerRole, 'intial owner role');
  const participantRole = await rewardManagement.PARTICIPANT();
  const rewardAppId = await rewardManagement.appId();

  // Grant necessary roles
  appRegistry.connect(admin1).grantRoleAdmin(rewardAppId, ownerRole, admin1.address);
  appRegistry.connect(admin1).grantRoleAdmin(rewardAppId, participantRole, participant1.address);
  appRegistry.connect(admin1).grantRoleAdmin(rewardAppId, MINTER, user2.address);

  // Log role assignments for verification
  console.log(await appRegistry.getRoleAdmins(APP_ID, ownerRole), 'owner role');
  console.log(await appRegistry.getRoleAdmins(APP_ID, participantRole), 'participant role');
  console.log(await appRegistry.getRoleAdmins(APP_ID, MINTER), 'MINTER role');

  // Mint initial tokens to reward management contract
  const mintAmount = BigInt(70000);
  await rewardToken.connect(user2).mint(rewardManagement.target, mintAmount);

  // Verify initial token balance
  const balance = await rewardToken.balanceOf(rewardManagement.target);
  console.log(balance, 'balance');

  // Get additional signer for task ownership
  const [taskOwner] = await ethers.getSigners();

  // Return fixture with all deployed contracts and configured accounts
  return {
    ...appRegistryFixture,
    rewardManagement,
    rewardToken,
    rumsanForwarder,
    App,
    deployer,
    owner,
    participant1,
    participant2,
    taskOwner,
    APP_ID,
    user1,
    admin1,
    user2,
    OWNER_ROLE: "OWNER",
    PARTICIPANT_ROLE: "PARTICIPANT"
  };
}
