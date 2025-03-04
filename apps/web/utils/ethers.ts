//  import { EntityTaskManager } from "@/abis/TaskManagement";
// import { EntityTaskBytesCode } from "@/bytecodes/entityTaskManager";
// import { ethers } from "ethers";
// import {AccessManagerABI} from "@workspace/contracts/abis";


// export const deployEntityTaskManager = async (
//   signer: ethers.Signer,
//   accessManagerContract: string,
//   appId: string,
// ) => {
//   try {
//     const factory = new ethers.ContractFactory(
//       EntityTaskManager,
//       EntityTaskBytesCode,

//       signer,
//     );

//     const contract = await factory.deploy(accessManagerContract, appId);

//     const address = await contract.getAddress();
//     console.log("Contract deployed at:", address);
//     await contract.waitForDeployment();
//     return address; // Return the deployed contract address
//   } catch (error) {
//     console.error("Failed to deploy contract:", error);
//     throw error;
//   }
// };
