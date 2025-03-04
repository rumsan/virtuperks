import "@nomiclabs/hardhat-ethers";
import { ethers } from 'hardhat';


const getJsonContract = async (contractName: string) => { 



const contract = require(`../build/artifacts/src/contracts/${contractName}.json`);
    return contract;
}
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(deployer.address, 'deployer.address');
 
   // const EntityTaskManagerFactory = await ethers.getContractFactory('EntityTaskManagerFactory');
    //console.log(EntityTaskManagerFactory, 'EntityTaskManagerFactory');
    const getFactoryContract = await getJsonContract('EntityTaskManagerFactory');
    console.log(getFactoryContract, 'getFactoryContract');
    //const EntityTaskManager = await ethers.getContractFactory('EntityTaskManager');
   // console.log(EntityTaskManager, 'EntityTaskManager');

 
//     console.log('Deploying EntityTaskManager...');
//     const aclAddress = '0x50D75C1BC6a1cE35002C9f92D0AF4B3684aa6B74'
//     const appId = '0xa1fc19c2993ca75efe2fe53553345fe836c6ba997a4c9a694ac03793180eb23f'; // Convert string to bytes32
//     const gasLimit = 5000000;
//   const entityTaskManager = await EntityTaskManager.deploy(aclAddress, appId, { gasLimit });
//   await entityTaskManager.waitForDeployment()
//   console.log('EntityTaskManager deployed to:', entityTaskManager.address);

  
//   console.log('Deploying EntityTaskManagerFactory...');
//   const entityTaskManagerFactory = await EntityTaskManagerFactory.deploy(entityTaskManager.address);
//   await entityTaskManagerFactory.waitForDeployment();
//   console.log('EntityTaskManagerFactory deployed to:', entityTaskManagerFactory.address);

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