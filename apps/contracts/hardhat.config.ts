import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    "base-sepolia": {
      url: process.env.CHAIN_BASE_SEPOLIA,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 84532,
    },
    "polygon-amoy": {
      url: process.env.CHAIN_POLYGON_AMOY,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 80002,
    },
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
