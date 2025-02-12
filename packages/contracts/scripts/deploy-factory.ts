import "@nomiclabs/hardhat-ethers";
import { ethers } from 'hardhat';

async function main() {
  // Get the contract factory
    const EntityTaskManagerFactory = await ethers.getContractFactory('EntityTaskManagerFactory');
  console.log(EntityTaskManagerFactory, 'EntityTaskManagerFactory');
    const EntityTaskManager = await ethers.getContractFactory('EntityTaskManager');
    console.log(EntityTaskManager, 'EntityTaskManager');

  // Deploy the logic contract (EntityTaskManager)
  console.log('Deploying EntityTaskManager...');
  const entityTaskManager = await EntityTaskManager.deploy();
  await entityTaskManager.deployed();
  console.log('EntityTaskManager deployed to:', entityTaskManager.address);

  // Deploy the factory contract
  console.log('Deploying EntityTaskManagerFactory...');
  const entityTaskManagerFactory = await EntityTaskManagerFactory.deploy(entityTaskManager.address);
  await entityTaskManagerFactory.deployed();
  console.log('EntityTaskManagerFactory deployed to:', entityTaskManagerFactory.address);

  // Create a new EntityTaskManager instance via the factory
//   const aclAddress = '0xACLAddress'; // Replace with your ACL contract address
//   const appId = ethers.utils.formatBytes32String('myAppId'); // Convert string to bytes32
//   console.log('Creating a new EntityTaskManager...');
//   await entityTaskManagerFactory.createEntityTaskManager(aclAddress, appId);
//   console.log('New EntityTaskManager created!');
}

// Run the deployment script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});