import { ethers } from 'hardhat';
interface Fixture {
  _appRegistry: any;
  rumsanForwarder: any;
  rewardToken: any;
  deployer: any;
  signers: any;
}
export const deployRahatTokenFixture = async function (): Promise<Fixture> {
  console.log('deploying fixtures');
  const [deployer, ...signers] = await ethers.getSigners();
  const appId = ethers.id('TOKEN_APP');
  const name = 'Rahat';
  const rumsanForwarder = await ethers.deployContract('ERC2771Forwarder', [
    'rumsanForwarder',
  ]);

  const _appRegistry = await ethers.deployContract('AppRegistry', []);

  const rewardToken = await ethers.deployContract('RewardToken', [
    'Rahat',
    'RTH',
    0,
    appId,
    _appRegistry.target,
    rumsanForwarder.target,
  ]);
  //console.log(rewardToken,'rewardToken')
  if (!deployer) {
    throw new Error('Deployer is undefined');
  }
  await _appRegistry
    .connect(deployer)
    .createApp(appId, name, deployer.address, false);
  console.log('fixtures deployed');
  return {
    rumsanForwarder,
    _appRegistry,
    rewardToken,
    deployer,
    signers,
  };
};
