import hre from "hardhat";
interface Fixture {
    accessManagerV2: any;
    rumsanForwarder: any;
    rewardToken: any;
    deployer: any;
    signers: any;
}
export const deployRahatTokenFixture = async function (): Promise<Fixture> {
    console.log("deploying fixtures");
    const [deployer, ...signers] = await hre.ethers.getSigners();
    const tokenAppId = hre.ethers.id('TOKEN_APP');
    const rumsanForwarder = await hre.ethers.deployContract("ERC2771Forwarder", ['rumsanForwarder']);
    const accessManagerV2 = await hre.ethers.deployContract("AccessManagerV2", []);
    const rewardToken = await hre.ethers.deployContract("RewardToken",
        [tokenAppId, "Rahat", "RTH", 0, accessManagerV2.target, rumsanForwarder.target]);
    await accessManagerV2.connect(deployer).createApp(tokenAppId, deployer.address);
    console.log('fixtures deployed')
    return {
        rumsanForwarder,
        accessManagerV2,
        rewardToken,
        deployer,
        signers
    };
}