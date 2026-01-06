import { ethers, upgrades } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Deploying contracts...");

  // Deploy Entity Implementation
  const Entity = await ethers.getContractFactory("Entity");
  const entityImplementation = await Entity.deploy();
  await entityImplementation.waitForDeployment();
  const entityImplAddress = await entityImplementation.getAddress();
  console.log(`Entity implementation deployed at: ${entityImplAddress}`);

  // Deploy App (UUPS Proxy)
  const App = await ethers.getContractFactory("App");
  const [signer] = await ethers.getSigners();
  const deployerAddress = await signer.getAddress();

  const app = await upgrades.deployProxy(
    App,
    [deployerAddress, entityImplAddress, "Test App"],
    {
      initializer: "initialize",
      kind: "uups",
    }
  );
  await app.waitForDeployment();
  const appAddress = await app.getAddress();
  console.log(`App contract deployed at: ${appAddress}`);

  // Create Entity
  const createEntityTx = await app.createEntity(
    deployerAddress,
    "Test Entity",
    "test.com"
  );
  await createEntityTx.wait();
  console.log("Entity created successfully");

  // Check entities
  const entities = await app.getAppEntities();
  console.log("Entities:", entities);

  if (entities.length > 0) {
    console.log("Entity addresses:");
    entities.forEach((entity: string, index: number) => {
      console.log(`  ${index + 1}: ${entity}`);
    });
  } else {
    console.log("No entities found");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });