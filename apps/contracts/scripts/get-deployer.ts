import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const deployerAddress = await signer.getAddress();
  console.log("Deployer address:", deployerAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });