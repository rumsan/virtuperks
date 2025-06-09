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
  factory: any;
  deployer?: any;
  owner: any;
  App: any;
  user1: any;
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
 * - RewardManagement contract deployed through factory
 * - ERC2771Forwarder contract
 * Also sets up all necessary roles and mints initial tokens
 * @returns Object containing all deployed contracts and configured accounts
 */
export async function deployRewardManagementFixture(): Promise<RewardManagementFixture> {
  // Deploy base contracts
  const appRegistryFixture = await deployAppRegistryFixture();
  const { appRegistry, APP_ID, owner, admin1, user1, user2, TEST_APP_NAME, OWNER_ROLE, deployer, DEFAULT_ADMIN_ROLE, MINTER, participant1, participant2 } = appRegistryFixture;

  // Create application in AppRegistry
  const App = await appRegistry.createApp(APP_ID, TEST_APP_NAME, admin1!.address, false);
  const app = await appRegistry.isAppExists(APP_ID);
  console.log(app, 'app created');

  // Deploy forwarder and token
  const rumsanForwarder = await ethers.deployContract("ERC2771Forwarder", ['rumsanForwarder']);
  const rewardToken = await ethers.deployContract("RewardToken", [
    "Rahat", "RTH", 0, APP_ID, appRegistry.target, rumsanForwarder.target
  ]);

  // Deploy factory contract
  const RewardManagementFactory = await ethers.getContractFactory('RewardManagementFactory');
  const factory = await RewardManagementFactory.deploy();
  await factory.waitForDeployment();

  // Deploy RewardManagement instance through factory
  const tx = await factory.connect(admin1).createRewardManagement(
    APP_ID,
    "Test Reward Management",
    appRegistry.target
  );
  const receipt = await tx.wait();

  // Get RewardManagement address from event
  const event = receipt?.logs.find(
    (log: any) => log.fragment && log.fragment.name === 'RewardManagementCreated'
  );
  if (!event) throw new Error('RewardManagement creation event not found');
  const [rewardManagementAddress] = event.args;
  console.log('RewardManagement deployed at:', rewardManagementAddress);

  // Get contract instance
  const RewardManagement = await ethers.getContractFactory('RewardManagement');
  const rewardManagement = RewardManagement.attach(rewardManagementAddress);

  // Setup roles for deployed instance
  const ownerRole = await rewardManagement.OWNER();

  const participantRole = await rewardManagement.PARTICIPANT();
  const appId = await rewardManagement.appId();
  console.log(appId, 'appId');
  

  await appRegistry.connect(admin1).grantRoleAdmin(APP_ID, ownerRole, user2.address);
  await appRegistry.connect(admin1).grantRoleAdmin(APP_ID, participantRole, participant1.address);
  await appRegistry.connect(admin1).grantRoleAdmin(APP_ID, MINTER, user2.address);

  // Log role assignments for verification
   console.log(await appRegistry.getRoleAdmins(APP_ID, ownerRole), 'owner role');
  console.log(await appRegistry.getRoleAdmins(APP_ID, participantRole), 'participant role');
  console.log(await appRegistry.getRoleAdmins(APP_ID, MINTER), 'MINTER role');
  console.log(await appRegistry.hasRole(appId, ownerRole,rewardManagementAddress), 'entity-contract has owner role');


  // Mint tokens to deployed instance
  const mintAmount = BigInt(70000);
  await rewardToken.connect(user2).mint(rewardManagementAddress, mintAmount);


    // Verify initial token balance
  const balance = await rewardToken.balanceOf(rewardManagement.target);
  console.log(balance, 'balance');


  // Get signer for task ownership
  const [taskOwner] = await ethers.getSigners();

  return {
    ...appRegistryFixture,
    rewardManagement,
    rewardToken,
    rumsanForwarder,
    factory, // Include factory in returned objects
    App,
    deployer,
    owner,
    participant1,
    participant2,
    taskOwner,
    APP_ID,
    user1,
    user2,
    OWNER_ROLE: "OWNER",
    PARTICIPANT_ROLE: "PARTICIPANT"
  };
}