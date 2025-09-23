import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';

const prisma = new PrismaClient();


const rewardsData = [
  {
    title: "Mobile Recharge",
    description: "Get a mobile recharge worth 100",
    tokens: 100,
    isActive: true,
    imageUrl: "https://assets.rumsan.net/rumsan-test/gift-card.jpg"
  },
 
];

async function createRewardsWithWallets() {
  console.log('🎁 Starting reward creation with wallet generation...\n');

  try {
    // Clear existing rewards (optional - remove if you want to keep existing data)
    console.log('🧹 Cleaning existing rewards...');
    await prisma.reward.deleteMany();
    console.log('✅ Existing rewards cleared\n');



    for (let i = 0; i < rewardsData.length; i++) {
      const rewardData = rewardsData[i];
      
      // Generate a new wallet for this reward
      console.log(`🔐 Generating wallet for: "${rewardData.title}"`);
      const wallet = ethers.Wallet.createRandom();
      
      console.log(`   📧 Wallet Address: ${wallet.address}`);
      console.log(`   🔑 Private Key: ${wallet.privateKey}`);
      
      // Create reward with generated wallet
      const reward = await prisma.reward.create({
        data: {
          ...rewardData,
          wallet: wallet.address
        }
      });


      
    }

    console.log('🎉 All rewards created successfully!');


    // Summary table
    console.log('📋 REWARDS SUMMARY:');
    console.log('==========================================');




  } catch (error) {
    console.error('❌ Error creating rewards:', error);
    throw error;
  }
}



// Main execution function
async function main() {
  try {
  
    await createRewardsWithWallets();
    
 

  } catch (error) {
    console.error('❌ Script execution failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})


