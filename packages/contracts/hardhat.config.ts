/** @type import('hardhat/config').HardhatUserConfig */
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

import '@nomicfoundation/hardhat-ethers';
import '@typechain/hardhat';
import { HardhatUserConfig } from 'hardhat/config';
dotenv.config();




const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }


  },
  paths: {

    sources: "./src",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts"
  },
   typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v6',
  // },
   
  // networks: {
  //   ganache: {
  //     url: "http://0.0.0.0:8545/",
  //     chainId: 8545,
  //     accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`]
  // }
 }
}

export default config;