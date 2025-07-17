import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

import { expect } from "chai";
import { ethers } from "hardhat";
import { deployRewardManagementFixture } from "./fixtures/RewardRedemptionFixture"; // Adjust path as needed

describe("RewardRedemption Integration", function () {
  let fixture: Awaited<ReturnType<typeof deployRewardManagementFixture>>;
    let participant1: any;
    let rewardManagement: any;
  let rewardRedemption: any;
  let rewardToken: any;
    let admin1: any;
    let user1: any;
    let DEFAULT_ADMIN_ROLE: string;
    let appRegistry: any;
    let APP_ID: string;


  beforeEach(async function () {
    fixture = await deployRewardManagementFixture();
    participant1 = fixture.participant1;
    rewardRedemption = fixture.rewardRedemption;
    rewardToken = fixture.rewardToken;
      admin1 = fixture.admin1; // assuming user1 is admin for test
      user1 = fixture.user1; // assuming user1 is the one transferring tokens
    DEFAULT_ADMIN_ROLE = fixture.DEFAULT_ADMIN_ROLE;
      appRegistry = fixture.appRegistry;
    APP_ID = fixture.APP_ID;
  });

  it("should transfer tokens to participant1 and allow them to redeem", async function () {
    
      const startingBalance = await rewardToken.balanceOf(participant1.address);
        await rewardToken.connect(participant1).approve(rewardRedemption.target, 10);
   
    expect(startingBalance).to.equal(1000n);


    // Redeem tokens
    const tx = await rewardRedemption.connect(participant1).redeem(10);
    await tx.wait();

    // Participant1's balance should decrease by 10
    const afterRedeemBalance = await rewardToken.balanceOf(participant1.address);
    expect(afterRedeemBalance).to.equal(990n);

    // Redemption status should be pending
    const appId = fixture.APP_ID;
    const redemption = await rewardRedemption.redemptions(appId, participant1.address);
    expect(redemption.status).to.equal(0); // RedemptionStatus.PENDING
    expect(redemption.amount).to.equal(10n);
    expect(redemption.from).to.equal(participant1.address);
  });

    it("admin can update redemption status to REDEEMED", async function () {
      
        


    // / Participant1 approves and redeems
    await rewardToken.connect(participant1).approve(rewardRedemption.target, 10);
    await rewardRedemption.connect(participant1).redeem(10);

    // Status should be pending
    let redemption = await rewardRedemption.redemptions(fixture.APP_ID, participant1.address);
    expect(redemption.status).to.equal(0);

    // Admin updates status to REDEEMED (status 1)
    await rewardRedemption.connect(admin1).updateRedemptionStatus(participant1.address);
    redemption = await rewardRedemption.redemptions(fixture.APP_ID, participant1.address);
    expect(redemption.status).to.equal(1);
  });

  it("should not allow redemption of zero tokens", async function () {
    await rewardToken.connect(participant1).approve(rewardRedemption.target, 0);
    await expect(
      rewardRedemption.connect(participant1).redeem(0)
    ).to.be.revertedWith("Amount must be greater than zero");
  });

  it("should not allow others to update redemption status", async function () {
    await rewardToken.connect(participant1).approve(rewardRedemption.target, 10);
    await rewardRedemption.connect(participant1).redeem(10);

    // user2 (not admin) tries to update
    await expect(
      rewardRedemption.connect(fixture.user2).updateRedemptionStatus(participant1.address)
    ).to.be.revertedWith("Not authorized");
  });

  it("should emit RewardRedeemed event on redeem and on status update", async function () {
    await rewardToken.connect(participant1).approve(rewardRedemption.target, 10);

    // Redeem should emit
    await expect(rewardRedemption.connect(participant1).redeem(10))
      .to.emit(rewardRedemption, "RewardRedeemed")
      .withArgs(participant1.address, 10, 0);

    // Status update should emit
    await expect(rewardRedemption.connect(admin1).updateRedemptionStatus(participant1.address))
      .to.emit(rewardRedemption, "RewardRedeemed")
      .withArgs(participant1.address, 10,1 );
  });
});