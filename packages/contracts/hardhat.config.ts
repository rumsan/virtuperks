/** @type import('hardhat/config').HardhatUserConfig */
import '@nomicfoundation/hardhat-toolbox';
import { HardhatUserConfig } from 'hardhat/config';


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
  },
}

export default config;