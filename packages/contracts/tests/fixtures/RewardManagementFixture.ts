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
  user4?: any; // Additional user for testing multiple owners
  user5?: any;
  OwnerRole?: any;
  participant1: any;
  participant2: any;
  taskOwner: any;
  APP_ID: string;
  OWNER_ROLE: string;
  PARTICIPANT_ROLE: string;
}


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

   // CRITICAL: Grant DEFAULT_ADMIN_ROLE to factory contract so it can assign roles

  await appRegistry.connect(admin1).grantRoleAdmin(APP_ID, DEFAULT_ADMIN_ROLE, factory.target);



  // Verify factory has admin role

  const factoryHasAdminRole = await appRegistry.hasRole(APP_ID, DEFAULT_ADMIN_ROLE, factory.target);
    const adminRole = await appRegistry.hasRole(APP_ID, DEFAULT_ADMIN_ROLE, admin1.address);




  
    // Create array of entity owners based on numOwners parameter
  const availableOwners = [user1, user2].filter(Boolean)
  const entityOwnerAddresses = availableOwners.map(user => user.address);
    console.log(`Setting up ${entityOwnerAddresses.length} entity owners:`,entityOwnerAddresses);


  // Deploy RewardManagement instance through factory
  const entityId = ethers.id('Test Entity');
  const entity = {
    name: "Test Entity",
    entityOwners : entityOwnerAddresses,
  }
  const tx = await factory.connect(admin1).createRewardManagement(
    entityId,
    APP_ID,
    
    appRegistry.target,
    entity
  );
  const receipt = await tx.wait();

  // Get RewardManagement address from event
  const event = receipt?.logs.find(
    (log: any) => log.fragment && log.fragment.name === 'RewardManagementCreated'
  );
  if (!event) throw new Error('RewardManagement creation event not found');
  const [rewardManagementAddress, aclAddress, name, eventEntityOwners] = event.args;
  console.log('RewardManagement deployed at:', rewardManagementAddress);
    console.log('Entity owners set:', eventEntityOwners);

  //call getEntityOwners to verify owners

  
  
  // Get contract instance
  const RewardManagement = await ethers.getContractFactory('RewardManagement');
  const rewardManagement = RewardManagement.attach(rewardManagementAddress);

  //call getEntityOwners to verify owners
  const retrievedOwners = await factory.connect(admin1).getEntityOwners(entityId);
  console.log('Retrieved entity owners:', retrievedOwners);

  const participantRole = await rewardManagement.PARTICIPANT();
  const appId = await rewardManagement.appId();
  console.log(appId, 'appId');
  

  await appRegistry.connect(admin1).grantRoleAdmin(APP_ID, participantRole, participant1.address);
  await appRegistry.connect(admin1).grantRoleAdmin(APP_ID, MINTER, user2.address);

  // Log role assignments for verification

  console.log(await appRegistry.getRoleAdmins(APP_ID, participantRole), 'participant role');
  console.log(await appRegistry.getRoleAdmins(APP_ID, MINTER), 'MINTER role');
  // console.log(await appRegistry.hasRole(appId, ownerRole,rewardManagementAddress), 'entity-contract has owner role');


  // Mint tokens to deployed instance
  const mintAmount = BigInt(70000);
  await rewardToken.connect(user2).mint(rewardManagementAddress, mintAmount);


    // Verify initial token balance
  const balance = await rewardToken.balanceOf(rewardManagement.target);



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