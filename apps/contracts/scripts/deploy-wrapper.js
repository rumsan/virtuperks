#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const prompts = require('prompts');
const fs = require('fs');

// Get command line arguments
const args = process.argv.slice(2);

// Look for network argument
let network = undefined;

// Check if first argument is a network name (when npm passes it without --network)
// or look for --network flag
if (args.length > 0) {
  const networkIndex = args.indexOf('--network');
  if (networkIndex !== -1 && networkIndex + 1 < args.length) {
    network = args[networkIndex + 1];
  } else if (args.length === 1 && !args[0].startsWith('-')) {
    // First arg is the network name
    network = args[0];
  }
}

// Function to load seed data
function loadSeedData() {
  const seedPath = path.join(__dirname, 'seed.json');
  try {
    if (fs.existsSync(seedPath)) {
      const seedContent = fs.readFileSync(seedPath, 'utf-8');
      return JSON.parse(seedContent);
    }
  } catch (error) {
    console.warn('Warning: Could not load seed.json, proceeding without defaults');
  }
  return {};
}

// Function to extract networks from hardhat config
function getNetworksFromConfig() {
  const configPath = path.join(__dirname, '..', 'hardhat.config.ts');
  const configContent = fs.readFileSync(configPath, 'utf-8');
  
  const networks = [];
  const lines = configContent.split('\n');
  let inNetworksBlock = false;
  let braceDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('networks:') && line.includes('{')) {
      inNetworksBlock = true;
      braceDepth = 1;
      continue;
    }
    
    if (!inNetworksBlock) continue;
    
    braceDepth += (line.match(/\{/g) || []).length;
    braceDepth -= (line.match(/\}/g) || []).length;
    
    if (braceDepth === 0) {
      break;
    }
    
    const networkMatch = line.match(/^[\s]*["']?(\w[\w-]*)["']?\s*:\s*\{/);
    if (networkMatch) {
      const networkName = networkMatch[1];
      
      let chainId = 31337;
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const configLine = lines[j];
        const chainIdMatch = configLine.match(/chainId:\s*(\d+)/);
        if (chainIdMatch) {
          chainId = parseInt(chainIdMatch[1], 10);
          break;
        }
        let tempBraces = (configLine.match(/\{/g) || []).length - (configLine.match(/\}/g) || []).length;
        if (tempBraces < 0) {
          break;
        }
      }
      
      networks.push({
        name: networkName,
        chainId: chainId
      });
    }
  }
  
  return networks;
}

// Function to select network interactively if not provided
async function selectNetworkIfNeeded(seedData) {
  if (network) {
    return network;
  }
  
  const networks = getNetworksFromConfig();
  if (networks.length === 0) {
    throw new Error('No networks found in hardhat.config.ts');
  }
  
  const response = await prompts({
    type: 'select',
    name: 'network',
    message: 'Select the network to deploy to:',
    choices: networks.map(n => ({
      title: `${n.name} (Chain ID: ${n.chainId})`,
      value: n.name
    })),
    initial: seedData.network ? networks.findIndex(n => n.name === seedData.network) : 0
  });
  
  if (!response.network) {
    throw new Error('Deployment cancelled by user');
  }
  
  return response.network;
}

// Main execution
(async () => {
  try {
    // Load seed data
    const seedData = loadSeedData();
    
    // Get the network (either from args or by asking user)
    network = await selectNetworkIfNeeded(seedData);
    
    // Build the hardhat command with the network flag and seed data
    let command = 'npx hardhat run scripts/deploy.ts';
    command += ` --network ${network}`;
    
    console.log(`Running: ${command}\n`);
    
    // Change to the project root directory before running
    const projectRoot = path.resolve(__dirname, '..');
    const env = process.env;
    env['SEED_DATA'] = JSON.stringify(seedData);
    execSync(command, { 
      cwd: projectRoot, 
      stdio: 'inherit',
      shell: true,
      env: env
    });
  } catch (error) {
    process.exit(1);
  }
})();




