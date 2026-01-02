// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

interface IApp {

    event AppCreated(address indexed owner, string name);
    event AppDeactivated(address indexed by);
    event AppNameUpdated(string oldName, string newName, address indexed by);
    event EntityCreated(address indexed entityAddress, address indexed owner);
    event EntityImplementationUpdated(address indexed oldImpl, address indexed newImpl);
    event AppStopped(address indexed by);
    event TokensRecovered(address indexed token, address indexed to, uint256 amount, address indexed by);

    function deactivateApp() external;
    function updateAppName(string memory newName) external;
    function getAppName() external view returns (string memory);
    function isAppActive() external view returns (bool);
}
