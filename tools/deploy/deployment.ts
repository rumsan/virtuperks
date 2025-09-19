import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
import { Addressable, ethers, uuidV4 } from 'ethers';
import { commonLib } from './_common';
import { minterRole, roleAdmin } from './deployments/wallets';

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
    // Deploy Forwarder
    const rumsanForwarder = await this.deployContract('ERC2771Forwarder', [
      'rumsanForwarder',
    ]);
    this.contracts['rumsanForwarder'] = {
      address: rumsanForwarder.contract.target as string,
      startBlock: rumsanForwarder.blockNumber,
    };
    console.log('ERC2771Forwarder deployed:', rumsanForwarder.contract.target);

    // Deploy Access Manager
    const accessManagerV2 = await this.deployContract('AppRegistry', []);
    this.contracts['accessManagerV2'] = {
      address: accessManagerV2.contract.target as string,
      startBlock: accessManagerV2.blockNumber,
    };
    console.log('AppRegistry deployed:', accessManagerV2.contract.target);

    // Create App
    const name = 'Rumsan App';
    await this.createApp(
      accessManagerV2.contract.target as string,
      appId,
      name,
      '0x0EDE41a921F2Db76dfa94B4b032E550746143f24',
      true,
    );

    // Assign MINTER roles
    for (const participant of minterRole) {
      await this.assignRole(
        accessManagerV2.contract.target as string,
        appId,
        'MINTER',
        participant.address,
      );
    }

    // Assign RoleAdmin role
    for (const participant of roleAdmin) {
      await this.assignRole(
        accessManagerV2.contract.target as string,
        appId,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        participant.address,
      );
    }

    // Deploy RewardToken
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
    console.log('RewardToken deployed:', rewardToken.contract.target);

    return { rumsanForwarder, accessManagerV2, rewardToken };
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
    console.log('RewardManagement deployed:', entity.contract.target);
    return { entity };
  }

  public async deployEntityContractFactory(
    accessManager: string,
    appId: string,
  ) {
    const entityFactory = await this.deployContract(
      'RewardManagementFactory',
      [],
    );
    this.contracts['entityFactory'] = {
      address: entityFactory.contract.target as string,
      startBlock: entityFactory.blockNumber,
    };
    console.log(
      'RewardManagementFactory deployed:',
      entityFactory.contract.target,
    );

    // Assign DEFAULT_ADMIN_ROLE to factory
    const role =
      '0x0000000000000000000000000000000000000000000000000000000000000000';
    await this.assignRole(
      accessManager,
      appId,
      role,
      entityFactory.contract.target as string,
    );

    return { entityFactory };
  }
}

async function main() {
  const seedProject = new SeedProject();
  const RUMSAN_APP_ID = ethers.id('RUMSAN_APP');
  const name = 'rumsan';

  const { accessManagerV2, rewardToken } =
    await seedProject.deployCommonContracts(RUMSAN_APP_ID);
  console.log('✅ Common contracts deployed');

  await seedProject.deployEntityContract(
    RUMSAN_APP_ID,
    name,
    accessManagerV2.contract.target as string,
  );

  const { entityFactory } = await seedProject.deployEntityContractFactory(
    accessManagerV2.contract.target as string,
    RUMSAN_APP_ID,
  );
  console.log('✅ Factory contract deployed');

  await seedProject.writeToDeploymentFile('contracts', seedProject.contracts);
}

main().catch((error) => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});
