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
 
    const accessManagerV2 = await this.deployContract('AccessManagerV2', []);
    this.contracts['accessManagerV2'] = {
      address: accessManagerV2.contract.target as string,
      startBlock: accessManagerV2.blockNumber,
    };
  

    const rewardToken = await this.deployContract('RewardToken', [
      appId,
      'Rahat',
      'RTH',
      0,
      accessManagerV2.contract.target,
      rumsanForwarder.contract.target,
    ]);
    this.contracts['rewardToken'] = {
      address: rewardToken.contract.target as string,
      startBlock: rewardToken.blockNumber,
    };
 

    return {rumsanForwarder, accessManagerV2, rewardToken};
  }

  public async deployEntityContract(
    accessManagerContract: Addressable | string,
    appId: string,
  ) {
    const entity = await this.deployContract('EntityTaskManager', [
      accessManagerContract,
      appId,
    ]);
    this.contracts['entity'] = {
      address: entity.contract.target as string,
      startBlock: entity.blockNumber,
    };
    console.log('Entity Contract deployed', entity.contract.target);
    return {entity};
  }

   public async deployEntityContractFactory(
    
  ) {
    const entityFactory = await this.deployContract('EntityTaskManagerFactory', [
   
    ]);
    this.contracts['entityFactory'] = {
      address: entityFactory.contract.target as string,
      startBlock: entityFactory.blockNumber,
    };
    console.log('EntityFactroy Contract deployed', entityFactory.contract.target);
    return {entityFactory};
  }
}

async function main() {
  const seedProject = new SeedProject();
  const RUMSAN_APP_ID = ethers.id('RUMSAN_APP');
 // const {accessManagerV2} =
   // await seedProject.deployCommonContracts(RUMSAN_APP_ID);
  //console.log('Common contracts deployed');
  // await seedProject.deployEntityContract(
  //   accessManagerV2.contract.target,
  //   ethers.id('RUMSAN_ENTITY'),
  // );
  await seedProject.deployEntityContractFactory();
  await seedProject.writeToDeploymentFile('contracts', seedProject.contracts);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
