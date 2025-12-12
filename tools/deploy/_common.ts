import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
import { ethers, uuidV4 } from 'ethers';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { ContractArtifacts, ContractDetails } from '../types/contract';

dotenv.config();

export class commonLib {
  provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.NETWORK_PROVIDER);
  }

  static getUUID() {
    return uuidV4(randomBytes(16));
  }

  public sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public getDeployerWallet() {
    return new ethers.Wallet(
      process.env.DEPLOYER_PRIVATE_KEY as string,
      this.provider,
    );
  }

  public async getContractArtifacts(
    contractName: string,
  ): Promise<ContractArtifacts> {
    const contract = require(`../artifacts/${contractName}.json`);

    return contract;
  }

  public async deployContract(contractName: string, args: any[]) {
    const signer = this.getDeployerWallet();
    const { abi, bytecode } = await this.getContractArtifacts(contractName);

    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(...args);

    await contract.waitForDeployment();

    const tx = contract.deploymentTransaction();
    const receipt = await this.provider.waitForTransaction(tx!.hash);
    const address = await contract.getAddress();
    const blockNumber = receipt?.blockNumber || 1;

    console.log(blockNumber);

    return {
      blockNumber,
      contract: new ethers.Contract(address, abi, this.provider),
    };
  }

  public async getDeployedAddress(
    contractAddressFile: string,
    contractName: string,
  ) {
    const fileData = readFileSync(
      `${__dirname}/deployments/${contractAddressFile}.json`,
      'utf8',
    );
    const data = JSON.parse(fileData);
    return data[contractName].address;
  }

  public async getDeployedContractDetails(
    contractAddressFile: string,
    contractNames: string[],
  ) {
    const contractDetails: ContractDetails = {};

    await Promise.all(
      contractNames.map(async (contract) => {
        console.log({ contract });
        const address = await this.getDeployedAddress(
          contractAddressFile,
          contract,
        );
        console.log({ contract, address });
        const { abi } = await this.getContractArtifacts(contract);
        contractDetails[contract] = { address, abi };
      }),
    );

    return contractDetails;
  }

  public async writeToDeploymentFile(fileName: string, newData: any) {
    console.log('Writing to deployment file:', fileName);

    const dirPath = `${__dirname}/deployments`;
    const filePath = `${dirPath}/${fileName}.json`;

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath);
    }

    let fileData = {};
    if (existsSync(filePath)) {
      const existingData = readFileSync(filePath, { encoding: 'utf8' });
      if (existingData) fileData = JSON.parse(existingData);
    }

    fileData = { ...fileData, ...newData };
    writeFileSync(filePath, JSON.stringify(fileData, null, 2));

    console.log('Completed writing to deployment file');
  }

  public async createApp(
    accessManagerAddress: string,
    appId: string,
    name: string,
    address: string,
    _isPrivate: boolean = true,
  ) {
    const signer = this.getDeployerWallet();
    const { abi } = await this.getContractArtifacts('AppRegistry');

    const accessManager = new ethers.Contract(
      accessManagerAddress,
      abi,
      signer,
    );

    if (accessManager.createApp) {
      const tx = await accessManager.createApp(
        appId,
        name,
        address,
        _isPrivate,
      );
      await tx.wait();
      console.log(`App "${appId}" created`);
    } else {
      throw new Error(
        'createApp function is undefined on accessManager contract',
      );
    }
  }

  public async assignRole(
    accessManagerAddress: string,
    appId: string,
    role: string,
    account: string,
  ) {
    const signer = this.getDeployerWallet();
    const { abi } = await this.getContractArtifacts('AppRegistry');

    const accessManager = new ethers.Contract(
      accessManagerAddress,
      abi,
      signer,
    );

    if (role === 'MINTER') {
      if (accessManager.grantRoleAdmin) {
        const roleHash = ethers.id(role);
        const tx = await accessManager.grantRoleAdmin(appId, roleHash, account);
        await tx.wait();
        console.log(`Role "${role}" assigned to account "${account}"`);
      }
    } else {
      if (accessManager.grantRoleAdmin) {
        const tx = await accessManager.grantRoleAdmin(appId, role, account);
        await tx.wait();
        console.log(`Role "${role}" assigned to account "${account}"`);
      } else {
        throw new Error(
          'grantRole function is undefined on accessManager contract',
        );
      }
    }

    console.log(`Role "${role}" assigned to account "${account}"`);
  }
}
