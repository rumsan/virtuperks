import { randomBytes } from 'crypto';
import { uuidV4 } from 'ethers';
import * as dotenv from 'dotenv';
import { commonLib } from './_common';

import { ethers } from 'ethers';

dotenv.config();

interface DeployedContract {
  address: string;
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

  // public async deployAccessManagerContract() {
  //   const AccessManager = await this.deployContract('AccessManagerV2', []);

  //   this.contracts['RahatToken'] = {
  //     address: AccessManager.contract.target as string,

  //     startBlock: AccessManager.blockNumber,
  //   };
  //   console.log(
  //     this.contracts.RahatToken.address,
  //     'AccessManagercontractAddress'
  //   );
  // }

  public async deployRewardSystemContract() {
    const address = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
    const appId = ethers.encodeBytes32String('myAppId');

    console.log(appId, 'appId');
    const RewardSystem = await this.deployContract('RewardSystem', [
      address,
      appId,
    ]);

    this.contracts['RahatToken'] = {
      address: RewardSystem.contract.target as string,
      startBlock: RewardSystem.blockNumber,
    };
  }

  public async deployRewardToknen() {
    const appId =
      '0x6d79417070496400000000000000000000000000000000000000000000000000';
    const address = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
    const name = 'RewardToken';
    const symbol = 'RTK';
    const decimals = 18;
    const accessManagerAddress = '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65';
    const RewardToken = await this.deployContract('RewardToken', []);

    this.contracts['RahatToken'] = {
      address: RewardToken.contract.target as string,
      startBlock: RewardToken.blockNumber,
    };
  }
}

async function main() {
  const seedProject = new SeedProject();
  //await seedProject.deployAccessManagerContract();
  //await seedProject.deployRewardToknen();
  await seedProject.deployRewardSystemContract();
  //console.log(seedProject.contracts);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
