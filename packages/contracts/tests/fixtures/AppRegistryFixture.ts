import { ethers } from "hardhat";


/**
 * Interface for the test fixture that defines all components needed for AppRegistry testing
 * @interface AppRegistryFixture
 */
export interface AppRegistryFixture {
  appRegistry: any;
  deployer: any;    // Account that deploys contracts
  admin1: any;      // Primary admin account
  admin2: any;      // Secondary admin account
  user1: any;       // Regular user account
  user2: any;       // Regular user account
  owner?: any;      // Owner account
  APP_ID: string;   // Main test application identifier
  MINTER: string;   // Minting role identifier
  SECOND_APP_ID: string; // Secondary application identifier
  DEFAULT_ADMIN_ROLE: string; // Default admin role
  participant1: any;   // Test participant account
  participant2: any;   // Test participant account
  OWNER_ROLE: string;  // Owner role identifier
  MANAGER_ROLE: string; // Manager role identifier
  CONTRIBUTOR_ROLE: string; // Contributor role identifier
  getFunctionId: (signature: string) => string; // Helper for interface testing
  TEST_APP_NAME: string; // Default application name
}

/**
 * Deploys and configures all contracts needed for AppRegistry testing
 * Sets up necessary roles, accounts, and initial state for testing
 * 
 * @returns {Promise<AppRegistryFixture>} Configured testing environment with:
 * - AppRegistry contract instance
 * - Test accounts (deployer, admins, users)
 * - Roles and constants
 * - Helper functions
 */
export const deployAppRegistryFixture = async (): Promise<AppRegistryFixture> => {
  // Get signers for different test roles
  const [deployer, admin1, admin2, user1, user2, owner, participant1, participant2] = await ethers.getSigners();

  // Deploy AppRegistry contract
  const appRegistry = await ethers.deployContract("AppRegistry", []);

  // Define constant identifiers used across tests
  const APP_ID = ethers.id('TEST_APP');          // Main test application ID
  const SECOND_APP_ID = ethers.id('SECOND_APP'); // Secondary test application ID
  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;    // Built-in admin role
  const MANAGER_ROLE = ethers.id('MANAGER');     // Custom manager role
  const MINTER = ethers.id('MINTER');           // Token minting role
  const OWNER_ROLE = ethers.id('OWNER');        // Owner role
  const CONTRIBUTOR_ROLE = ethers.id('CONTRIBUTOR'); // Contributor role
  const TEST_APP_NAME = "Test App";             // Default test application name

  /**
   * Helper function to get function selector from signature
   * @param signature Function signature string
   * @returns bytes4 function selector
   */
  const getFunctionId = (signature: string) => {
    return ethers.FunctionFragment.from(signature).selector;
  };

  // Return configured fixture
  return {
    appRegistry,
    OWNER_ROLE,
    deployer,    // Account that deploys contracts
    admin1,      // Primary admin account
    admin2,      // Secondary admin account
    user1,       // Regular user account
    user2,       // Regular user account
    APP_ID,      // Main test application identifier
    owner,       // Owner account
    MINTER,      // Minting role identifier
    SECOND_APP_ID, // Secondary application identifier
    DEFAULT_ADMIN_ROLE, // Default admin role
    MANAGER_ROLE,  // Manager role identifier
    CONTRIBUTOR_ROLE, // Contributor role identifier
    getFunctionId,  // Helper for interface testing
    TEST_APP_NAME,  // Default application name
    participant1,   // Test participant account
    participant2,   // Test participant account
  };
};

