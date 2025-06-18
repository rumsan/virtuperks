import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
import { Addressable, ethers, uuidV4 } from 'ethers';
import { commonLib } from './_common';
dotenv.config();

interface DeployedContract {
  address: Addressable | string;
  startBlock: number;
}

class SeedProject extends commonLib {
  contracts: Record<string, DeployedContract>;

  constructor() {
    super();
    this.contracts = {};
  }

  static getUUID() {
    return uuidV4(randomBytes(16));
  }

  public sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async deployCommonContracts(appId: string) {
    const rumsanForwarder = await this.deployContract('ERC2771Forwarder', [
      'rumsanForwarder',
    ]);

    this.contracts['rumsanForwarder'] = {
      address: rumsanForwarder.contract.target as string,
      startBlock: rumsanForwarder.blockNumber,
    };
    console.log('rumsan forwarder deployed', rumsanForwarder.contract.target);
 
    const accessManagerV2 = await this.deployContract('AppRegistry', []);
    this.contracts['accessManagerV2'] = {
      address: accessManagerV2.contract.target as string,
      startBlock: accessManagerV2.blockNumber,
    };
    console.log('AppRegistry deployed', accessManagerV2.contract.target);
    const name = 'Rumsan App';
    // Create app
    await this.createApp(accessManagerV2.contract.target as string, appId,name, "0x127359CD56487f76307b186651ddbf684B9c2dFE", false);

    // Assign MINTER role
    // await this.assignRole(
    //   accessManagerV2.contract.target as string,
    //   appId,
    //   'MINTER',
    //      '0x127359CD56487f76307b186651ddbf684B9c2dFE',

    // );

    // Assign ENTITY_OWNER role to all entity owners
    // for (const owner of entityOwnerWallet) {
    //   await this.assignRole(
    //     accessManagerV2.contract.target as string,
    //     appId,
    //     'ENTITY_OWNER',
    //     owner.address
    //   );
    // }

    // Assign PARTICIPANT role to all participants
    // for (const participant of participantsWallet) {
    //   await this.assignRole(
    //     accessManagerV2.contract.target as string,
    //     appId,
    //     'PARTICIPANT',
    //     participant.address
    //   );
    // }

    const rewardToken = await this.deployContract('RewardToken', [
        'Rahat',
      'RTH',
        0,
       appId,
      accessManagerV2.contract.target,
      rumsanForwarder.contract.target,
    ]);
    this.contracts['rewardToken'] = {
      address: rewardToken.contract.target as string,
      startBlock: rewardToken.blockNumber,
    };
    console.log('rewardToken deployed', rewardToken.contract.target);
 

    return {rumsanForwarder, accessManagerV2, rewardToken};
  }

  public async deployEntityContract(
  
    appId: string,
    name: string,
    accessManagerContract: Addressable | string,
  ) {
    const entity = await this.deployContract('RewardManagement', [
     
      appId,
      name,
       accessManagerContract,
    ]);
    this.contracts['entity'] = {
      address: entity.contract.target as string,
      startBlock: entity.blockNumber,
    };
    console.log('RewardManagement Contract deployed', entity.contract.target);
    return {entity};
  }

   public async deployEntityContractFactory(
     accessManager: string,
     appId: string,
  ) {
    const entityFactory = await this.deployContract('RewardManagementFactory', [
   
    ]);
    this.contracts['entityFactory'] = {
      address: entityFactory.contract.target as string,
      startBlock: entityFactory.blockNumber,
    };  
  
     console.log('RewardManagementFactory Contract deployed', entityFactory.contract.target);
     //assign default admin role to factory address 
     const role = "0x0000000000000000000000000000000000000000000000000000000000000000"
     await this.assignRole(
       accessManager,
       appId,
       role,
       entityFactory.contract.target as string,
      
       
      )
    return {entityFactory};
  }
}

async function main() {
  const seedProject = new SeedProject();
  const RUMSAN_APP_ID = ethers.id('RUMSAN_APP');
  const name = 'rumsan'
 const {accessManagerV2} =
   await seedProject.deployCommonContracts(RUMSAN_APP_ID);
  console.log('Common contracts deployed');
  await seedProject.deployEntityContract(
    
    ethers.id('RUMSAN_APP'),
    name,
    accessManagerV2.contract.target as string,
  );
 const {entityFactory}=  await seedProject.deployEntityContractFactory(accessManagerV2.contract.target as string, RUMSAN_APP_ID);
  console.log('deploy factory contract')

  await seedProject.writeToDeploymentFile('contracts', seedProject.contracts);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
