import { expect } from "chai";
import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import { deployRahatTokenFixture } from "./fixtures/tokenFixture.ts";
const getFunctionId = (signature: string) => {
  return hre.ethers.FunctionFragment.from(signature).selector;
}

describe('------ Reward Token Tests ------', function () {


  describe("Deployment", function () {
    let rewardToken: any;
    let rumsanForwarder: any;
    let accessManagerV2: any;
    let deployer: any;
    let minter: any;
    // let provider: EthereumProvider;
    before(async function () {
      const fixtures = await loadFixture(deployRahatTokenFixture);
      deployer = fixtures.deployer;
      minter = fixtures.signers[1];
      rewardToken = fixtures.rewardToken;
      rumsanForwarder = fixtures.rumsanForwarder;
      accessManagerV2 = fixtures.accessManagerV2;
    });
    it("should deploy contracts with expected initial values", async function () {
      expect(await rewardToken.name()).to.equal('Rahat');
      expect(await rewardToken.symbol()).to.equal('RTH');
      expect(await rewardToken.decimals()).to.equal(0n);
      expect(await rewardToken.totalSupply()).to.equal(0n);
    });

    it("should not be able to mint tokens without role", async function () {
      await expect(rewardToken.connect(minter).mint(minter.address, 100000n)).to.be.revertedWith('Not a minter');
    });

    it('should set minter', async function () {
      const tokenAppId = hre.ethers.id('TOKEN_APP');
      const MINTER_ROLE = hre.ethers.id('MINTER')
      await accessManagerV2.connect(deployer).grantRole(tokenAppId, MINTER_ROLE, minter.address);
      //check if minter has access to mint function
      const hasRole = await accessManagerV2.hasRole(tokenAppId, MINTER_ROLE, minter.address);
      expect(hasRole).to.equal(true);
    })
    it("should mint tokens", async function () {
      await rewardToken.connect(minter).mint(minter.address, 100000n);
      expect(await rewardToken.balanceOf(minter.address)).to.equal(100000n);
    });

  });
});

