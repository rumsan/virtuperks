// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IAccessManagerV1 {
    function updateAdmin(address _address, bool _status) external;

    function updateMinter(address _address, bool _status) external;

    function updateProjectManager(address _address, bool _status) external;

    function isAdmin(address _address) external view returns (bool _status);

    function isMinter(address _address) external view returns (bool _status);

    function isProjectManager(
        address _address
    ) external view returns (bool _status);
}
