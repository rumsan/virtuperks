pragma solidity 0.8.20;
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract RewardClaimer {
  event UpdatedClaimAmount(
    address indexed token,
    bytes32 indexed repoId,
    uint256 claimableAmount
  );

  IERC20 public rewardToken;

  // amount of tokens that can be claimable for each PR of givenRepoId
  // repoId => amount
  mapping(bytes32 => uint256) public claimableAmount;

  //record of address that has claimed the reward
  // repoId => PRId => address
  mapping(bytes32 => mapping(uint => address)) public claimer;

  //Setup Access manager
  constructor(address _rewardToken) {
    rewardToken = IERC20(_rewardToken);
  }

  function updateClaimAmount(
    address _tokenAddress,
    bytes32 _repoId,
    uint256 _claimableAmount
  ) public {
    claimableAmount[_repoId] = _claimableAmount;
    emit UpdatedClaimAmount(_tokenAddress, _repoId, _claimableAmount);
  }

  function claimReward(bytes32 _repoId, uint _PrId) public {
    require(claimer[_repoId][_PrId] == address(0), 'Reward already claimed');
    claimer[_repoId][_PrId] = msg.sender;
    rewardToken.transfer(msg.sender, claimableAmount[_repoId]);
  }
}
