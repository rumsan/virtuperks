import chalk from 'chalk';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ethers, network, upgrades } from 'hardhat';
import * as path from 'path';
import prompts from 'prompts';

dotenv.config();

// Types
interface DeploymentConfig {
  network: string;
  initialOwner: string;
  appName: string;
  tokenName: string;
  tokenSymbol: string;
  tokenOwner: string;
  confirmDeploy: boolean;
}

interface NetworkConfig {
  name: string;
  chainId: number;
}

// Utility Functions
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function isValidYesNo(input: string): boolean {
  const normalized = input.toLowerCase().trim();
  return ['y', 'yes', 'n', 'no'].includes(normalized);
}

function parseYesNo(input: string): boolean {
  const normalized = input.toLowerCase().trim();
  return normalized === 'y' || normalized === 'yes';
}

async function getNetworkChoices(): Promise<NetworkConfig[]> {
  const configPath = path.join(__dirname, '..', 'hardhat.config.ts');
  const configContent = fs.readFileSync(configPath, 'utf-8');

  const networks: NetworkConfig[] = [];

  // Find all lines with network definitions - simple line-by-line approach
  const lines = configContent.split('\n');
  let inNetworksBlock = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if we're entering the networks block
    if (line.includes('networks:') && line.includes('{')) {
      inNetworksBlock = true;
      braceDepth = 1;
      continue;
    }

    if (!inNetworksBlock) continue;

    // Count braces to know when we exit the networks block
    braceDepth += (line.match(/\{/g) || []).length;
    braceDepth -= (line.match(/\}/g) || []).length;

    // Check if we've exited the networks block
    if (braceDepth === 0) {
      break;
    }

    // Match network definitions: "network-name": { or network-name: {
    const networkMatch = line.match(/^[\s]*["']?(\w[\w-]*)["']?\s*:\s*\{/);
    if (networkMatch) {
      const networkName = networkMatch[1];

      // Look ahead to find chainId in the next few lines
      let chainId = 31337; // default
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const configLine = lines[j];
        const chainIdMatch = configLine.match(/chainId:\s*(\d+)/);
        if (chainIdMatch) {
          chainId = parseInt(chainIdMatch[1], 10);
          break;
        }
        // Stop if we hit the closing brace of this network
        let tempBraces =
          (configLine.match(/\{/g) || []).length -
          (configLine.match(/\}/g) || []).length;
        if (tempBraces < 0) {
          break;
        }
      }

      networks.push({
        name: networkName,
        chainId: chainId,
      });
    }
  }

  return networks;
}

async function getDeployerAddress(): Promise<string> {
  const [signer] = await ethers.getSigners();
  return await signer.getAddress();
}

function getSeedData(): any {
  try {
    const seedDataStr = process.env.SEED_DATA;
    if (seedDataStr) {
      return JSON.parse(seedDataStr);
    }
  } catch (error) {
    // Ignore seed data parsing errors
  }
  return {};
}

async function promptForInputs(
  preSelectedNetwork?: string,
): Promise<DeploymentConfig> {
  const seedData = getSeedData();
  console.log(chalk.bold.cyan('\n🚀 VirtuPerks Contract Deployment\n'));
  console.log(
    chalk.yellow(
      "⚠️  Important: The Initial Owner address must be the same as the deployer's address",
    ),
  );
  console.log(
    chalk.yellow(
      '   (the address that will execute the transactions from your private key)\n',
    ),
  );

  const networkChoices = await getNetworkChoices();

  if (networkChoices.length === 0) {
    throw new Error('No networks found in hardhat.config.ts');
  }

  let selectedNetwork = preSelectedNetwork;

  // If network is not pre-selected, ask the user
  if (!selectedNetwork) {
    // Print available networks before prompt
    console.log(chalk.bold.yellow('Available Networks:'));
    networkChoices.forEach((n, i) => {
      console.log(
        `  ${i + 1}. ${chalk.cyan(n.name)} ${chalk.dim(`(Chain ID: ${n.chainId})`)}`,
      );
    });
    console.log('');

    const networkPromptResponse = await prompts({
      type: 'select',
      name: 'network',
      message: 'Select the network to deploy to:',
      choices: networkChoices.map((n) => ({
        title: `${n.name} (Chain ID: ${n.chainId})`,
        value: n.name,
      })),
    });

    if (!networkPromptResponse.network) {
      throw new Error('Deployment cancelled by user');
    }

    selectedNetwork = networkPromptResponse.network;
  } else {
    // Verify that the pre-selected network exists
    const networkExists = networkChoices.find(
      (n) => n.name === selectedNetwork,
    );
    if (!networkExists) {
      throw new Error(
        `Network "${selectedNetwork}" not found in hardhat.config.ts`,
      );
    }
    console.log(
      chalk.green(`✓ Using network: ${chalk.cyan(selectedNetwork)}\n`),
    );
  }

  // Get deployer address to use as default initial owner
  const deployerAddress = await getDeployerAddress();

  const response = await prompts([
    {
      type: 'text',
      name: 'initialOwner',
      message: 'Enter the initial owner address:',
      initial: seedData.initialOwner || deployerAddress,
      validate: (input: string) => {
        const trimmed = input.trim();
        if (!trimmed) {
          return false;
        }
        if (!isValidEthereumAddress(trimmed)) {
          return false;
        }
        return true;
      },
    },
    {
      type: 'text',
      name: 'appName',
      message: 'Enter the App name:',
      initial: seedData.appName,
      validate: (input: string) => {
        const trimmed = input.trim();
        if (!trimmed) {
          return false;
        }
        if (trimmed.length > 100) {
          return false;
        }
        return true;
      },
    },
    {
      type: 'text',
      name: 'tokenName',
      message: 'Enter the reward token name:',
      initial: seedData.tokenName,
      validate: (input: string) => {
        const trimmed = input.trim();
        if (!trimmed) {
          return false;
        }
        if (trimmed.length > 100) {
          return false;
        }
        return true;
      },
    },
    {
      type: 'text',
      name: 'tokenSymbol',
      message: 'Enter the reward token symbol:',
      initial: seedData.tokenSymbol,
      validate: (input: string) => {
        const trimmed = input.trim();
        if (!trimmed) {
          return false;
        }
        if (trimmed.length > 10) {
          return false;
        }
        return true;
      },
    },
    {
      type: 'text',
      name: 'tokenOwner',
      message: 'Enter the reward token owner address:',
      initial: seedData.tokenOwner || deployerAddress,
      validate: (input: string) => {
        const trimmed = input.trim();
        if (!trimmed) {
          return false;
        }
        if (!isValidEthereumAddress(trimmed)) {
          return false;
        }
        return true;
      },
    },
  ]);

  if (
    !response.initialOwner ||
    !response.appName ||
    !response.tokenName ||
    !response.tokenSymbol ||
    !response.tokenOwner
  ) {
    throw new Error('All required fields are necessary. Deployment cancelled.');
  }

  if (!selectedNetwork) {
    throw new Error('Deployment cancelled by user');
  }

  return {
    network: selectedNetwork,
    initialOwner: response.initialOwner.trim(),
    appName: response.appName.trim(),
    tokenName: response.tokenName.trim(),
    tokenSymbol: response.tokenSymbol.trim(),
    tokenOwner: response.tokenOwner.trim(),
    confirmDeploy: false,
  };
}

async function confirmDeployment(
  config: DeploymentConfig,
  deployerAddress: string,
): Promise<boolean> {
  console.log(chalk.bold.yellow('\n📋 Deployment Configuration:\n'));
  console.log(chalk.white('Network:        ') + chalk.green(config.network));
  console.log(chalk.white('Deployer:       ') + chalk.green(deployerAddress));
  console.log(
    chalk.white('Initial Owner:  ') + chalk.green(config.initialOwner),
  );
  console.log(chalk.white('App Name:       ') + chalk.green(config.appName));
  console.log(chalk.white('Token Name:     ') + chalk.green(config.tokenName));
  console.log(
    chalk.white('Token Symbol:   ') + chalk.green(config.tokenSymbol),
  );
  console.log(chalk.white('Token Owner:    ') + chalk.green(config.tokenOwner));

  const response = await prompts({
    type: 'select',
    name: 'confirm',
    message: 'Do you want to proceed with deployment?',
    choices: [
      { title: 'Yes (y)', value: true },
      { title: 'No (n)', value: false },
    ],
  });

  return response.confirm !== false;
}

async function deployContracts(config: DeploymentConfig) {
  console.log(chalk.bold.cyan('\n🔨 Starting deployment...\n'));

  try {
    // Step 1: Deploy Entity Implementation
    console.log(chalk.blue('📦 Step 1/3: Deploying Entity implementation...'));
    const Entity = await ethers.getContractFactory('Entity');
    const entityImplementation = await Entity.deploy();
    await entityImplementation.waitForDeployment();
    const entityImplAddress = await entityImplementation.getAddress();
    const entityBlockNumber = await ethers.provider.getBlockNumber();
    console.log(
      chalk.green(
        `✓ Entity implementation deployed at: ${entityImplAddress} (Block: ${entityBlockNumber})\n`,
      ),
    );

    // Step 2: Deploy App (UUPS Proxy)
    console.log(
      chalk.blue('📦 Step 2/3: Deploying App contract (UUPS Proxy)...'),
    );
    const App = await ethers.getContractFactory('App');
    const app = await upgrades.deployProxy(
      App,
      [config.initialOwner, entityImplAddress, config.appName],
      {
        initializer: 'initialize',
        kind: 'uups',
      },
    );
    await app.waitForDeployment();
    const appAddress = await app.getAddress();
    const appBlockNumber = await ethers.provider.getBlockNumber();
    console.log(
      chalk.green(
        `✓ App contract deployed at: ${appAddress} (Block: ${appBlockNumber})\n`,
      ),
    );

    const appImplAddress =
      await upgrades.erc1967.getImplementationAddress(appAddress);
    console.log(
      chalk.green(`✓ App implementation deployed at: ${appImplAddress}\n`),
    );

    const appId = ethers.id(config.appName);

    // Step 3: Deploy RewardToken
    console.log(chalk.blue('📦 Step 3/3: Deploying RewardToken...'));
    const RewardToken = await ethers.getContractFactory('RewardToken');
    const rewardToken = await RewardToken.deploy(
      config.tokenName,
      config.tokenSymbol,
      config.tokenOwner,
    );
    await rewardToken.waitForDeployment();
    const tokenAddress = await rewardToken.getAddress();
    const tokenBlockNumber = await ethers.provider.getBlockNumber();
    console.log(
      chalk.green(
        `✓ RewardToken deployed at: ${tokenAddress} (Block: ${tokenBlockNumber})\n`,
      ),
    );

    // Display summary
    console.log(chalk.bold.green('\n✅ Deployment completed successfully!\n'));
    console.log(chalk.bold.cyan('📝 Deployment Summary:\n'));
    console.log(
      chalk.white('Network:                 ') + chalk.yellow(config.network),
    );
    console.log(
      chalk.white('Entity Implementation:   ') +
        chalk.yellow(`${entityImplAddress} (Block: ${entityBlockNumber})`),
    );
    console.log(
      chalk.white('App Contract (Proxy):    ') +
        chalk.yellow(`${appAddress} (Block: ${appBlockNumber})`),
    );
    console.log(
      chalk.white('App Implementation:      ') +
        chalk.yellow(`${appImplAddress} (Block: ${appBlockNumber})`),
    );
    console.log(chalk.white('App ID:                  ') + chalk.yellow(appId));
    console.log(
      chalk.white('RewardToken:             ') +
        chalk.yellow(`${tokenAddress} (Block: ${tokenBlockNumber})`),
    );

    // Save deployment info to file
    const deploymentInfo: any = {
      network: config.network,
      chainId: network.config.chainId,
      timestamp: new Date().toISOString(),
      contracts: {
        entityImplementation: {
          address: entityImplAddress,
          blockNumber: entityBlockNumber,
        },
        appProxy: {
          address: appAddress,
          blockNumber: appBlockNumber,
        },
        appImplementation: {
          address: appImplAddress,
          blockNumber: appBlockNumber, // Assuming same block as proxy
        },
        rewardToken: {
          address: tokenAddress,
          blockNumber: tokenBlockNumber,
        },
      },
      app: {
        id: appId,
        name: config.appName,
        owner: config.initialOwner,
      },
      configuration: {
        initialOwner: config.initialOwner,
        appName: config.appName,
        tokenName: config.tokenName,
        tokenSymbol: config.tokenSymbol,
        tokenOwner: config.tokenOwner,
      },
    };

    const deploymentsDir = path.join(__dirname, '..', '.deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }

    const filename = `deployment-${config.network}.json`;
    const filepath = path.join(deploymentsDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));

    console.log(
      chalk.white('\n💾 Deployment info saved to: ') + chalk.cyan(filepath),
    );
  } catch (error: any) {
    console.log(chalk.bold.red('\n❌ Deployment failed!\n'));
    console.log(chalk.red(error.message));
    throw error;
  }
}

async function main() {
  try {
    // Get the current network from hardhat (which was specified via --network flag)
    const currentNetwork = network.name;

    // Get deployment configuration from user
    const config = await promptForInputs(currentNetwork);

    // Get deployer address
    const deployerAddress = await getDeployerAddress();

    // Confirm deployment
    const confirmed = await confirmDeployment(config, deployerAddress);

    if (!confirmed) {
      console.log(chalk.yellow('\n⚠️  Deployment cancelled by user.\n'));
      process.exit(0);
    }

    // Deploy contracts
    await deployContracts(config);

    console.log(chalk.bold.green('\n🎉 All done!\n'));
  } catch (error: any) {
    console.log(chalk.bold.red('\n❌ Error occurred:\n'));
    console.log(chalk.red(error.message || error));
    process.exit(1);
  }
}

// Execute main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
