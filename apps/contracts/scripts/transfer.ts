import { ethers } from "hardhat";
import chalk from "chalk";
import * as readline from "readline";

const PRIVATE_KEY = null //"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";


function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  // Connect to anvil network with timeout and retry logic
  let provider: ethers.JsonRpcProvider;
  let retries = 5;
  
  while (retries > 0) {
    try {
      provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      // Test connection
      await provider.getNetwork();
      break;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.log(chalk.red("❌ Error: Cannot connect to Anvil node at http://127.0.0.1:8545"));
        console.log(chalk.white("Make sure Anvil is running: anvil --host 0.0.0.0"));
        process.exit(1);
      }
      console.log(chalk.yellow(`⏳ Retrying connection (${retries} attempts left)...`));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Use the provided private key or get signer from provider
  let wallet: ethers.Wallet | ethers.JsonRpcSigner;
  let senderAddress: string;
  
  if (PRIVATE_KEY) {
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    senderAddress = wallet.address;
  } else {
    // Use the server account (first account from Anvil)
    wallet = provider.getSigner(0);
    // Get the address by listing accounts from the provider
    const accounts = await provider.send("eth_accounts", []);
    senderAddress = accounts[0];
  }

  console.log(chalk.blue("🔗 Connected to Anvil network"));
  console.log(chalk.white("Sender address: ") + chalk.yellow(senderAddress));

  // Ask for recipient address
  let recipientAddress = await askQuestion(chalk.blue("Enter recipient address: "));
  
  if (!recipientAddress || !ethers.isAddress(recipientAddress)) {
    console.log(chalk.red("❌ Error: Invalid recipient address"));
    return;
  }

  // Ask for transfer amount
  let amountStr = await askQuestion(chalk.blue("Enter transfer amount (in ETH): "));
  
  if (!amountStr || parseFloat(amountStr) <= 0) {
    console.log(chalk.red("❌ Error: Please provide a valid transfer amount (in ETH)"));
    return;
  }

  const amount = ethers.parseEther(amountStr);

  console.log(chalk.blue("\n📋 Transfer Details:"));
  console.log(chalk.white("Recipient: ") + chalk.yellow(recipientAddress));
  console.log(chalk.white("Amount:    ") + chalk.yellow(ethers.formatEther(amount)) + " ETH");

  try {
    console.log(chalk.blue("\n🔄 Executing ETH transfer..."));

    // Check sender balance before transfer
    const senderBalance = await provider.getBalance(senderAddress);
    console.log(chalk.white("Sender balance: ") + chalk.yellow(ethers.formatEther(senderBalance)) + " ETH");

    if (senderBalance < amount) {
      console.log(chalk.red("❌ Insufficient balance"));
      return;
    }

    // Execute ETH transfer
    let txHash: string;
    if (PRIVATE_KEY) {
      const tx = await wallet.sendTransaction({
        to: recipientAddress,
        value: amount,
      });
      txHash = tx.hash;
      await tx.wait();
    } else {
      // Use provider.send to execute transaction directly
      txHash = await provider.send("eth_sendTransaction", [
        {
          from: senderAddress,
          to: recipientAddress,
          value: ethers.toBeHex(amount),
        },
      ]);
      await provider.waitForTransaction(txHash);
    }
    console.log(chalk.white("Transaction hash: ") + chalk.yellow(txHash));
    console.log(chalk.green("✅ ETH transfer successful!"));

    // Check balances after transfer
    const newSenderBalance = await provider.getBalance(senderAddress);
    const recipientBalance = await provider.getBalance(recipientAddress);

    console.log(chalk.white("\n📊 Updated Balances:"));
    console.log(chalk.white("Sender:    ") + chalk.yellow(ethers.formatEther(newSenderBalance)) + " ETH");
    console.log(chalk.white("Recipient: ") + chalk.yellow(ethers.formatEther(recipientBalance)) + " ETH");

  } catch (error) {
    console.error(chalk.red("❌ Transfer failed:"), error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(chalk.red("❌ Script failed:"), error);
    process.exit(1);
  });