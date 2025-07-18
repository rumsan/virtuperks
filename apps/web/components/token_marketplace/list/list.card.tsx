import {
  useCheckParticipantBalance,
  useRedeemToken,
} from "@/hooks/subgraph/token";
import { PATHS } from "@/routes/paths";
import { getCategoryIcon } from "@/utils/rewardIcon";
// import { hasRole } from "@/utils/roles";
import { DialogButton } from "@/components/common/ui/dialog";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Reward } from "../../../type/token.marketplace";
import { useCreateReward, useGetRewards, useRedeemReward } from "@/hooks/subgraph/token-marketplace";

const TokenMarketListCard = () => {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const { address } = useAccount();
  const { balance } = useCheckParticipantBalance(address as `0x${string}`);
  console.log(balance, 'balance')
  const { toast } = useToast();
 const {RewardRedeem, RedeemPending} = useRedeemReward()
  // hook to fetch rewards
  const data = useGetRewards()
  console.log("Rewards Data:", data.data?.data?.rewardRedemptionCreateds);
  const allRewards = data.data?.data?.rewardRedemptionCreateds || [];

  const router = useRouter();

  // ✅ Check if user has Admin role
  // const hasEntityOwnerRole = hasRole({
  //   role: process.env.NEXT_PUBLIC_DEFAULT_ADMIN_ROLE || "",
  // });
  const {AddReward, rewardPending}= useCreateReward()

  const handleRewardAdd = async (data: any) => {
    try {
  await AddReward({
      name: data.name,
      amount: data.amount,
  });
       setIsDialogOpen(false);
            toast({
              title: "Token transfered Successfully!.",
              variant: "success",
            });
    



}
catch (error: any) {
  




}

  }

  const handlePurchase = async (reward: any) => {
   console.log(reward,'rewardinghhfhhff')
    try {
      if (!address) {
        toast({
          title: "Error",
          description: "Please connect your wallet",
          variant: "destructive",
        });
        return;
      }
      if (!balance || balance < BigInt(reward.tokensRequired)) {
        toast({
          title: "Insufficient Balance",
          description: "Not enough tokens",
          variant: "destructive",
        });
        return;
      }

      await RewardRedeem({ rewardAddress: reward.rewardRedemption, amount: reward.tokensRequired });

      toast({
        title: "Purchase Successful",
        description: `You have redeemed ${reward.title}`,
        variant: "success",
      });
      setSelectedReward(null);
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to complete purchase",
        variant: "destructive",
      });
    }
  };

  const categoryBgMap: Record<string, string> = {
    Entertainment: "bg-purple-100",
    "Food & Beverage": "bg-orange-100",
    Utilities: "bg-blue-100",
    Shopping: "bg-green-100",
    Transportation: "bg-yellow-100",
  };

  const rewards: Reward[] = [
    {
      id: 1,
      title: "Movie Ticket",
      description: "Premium cinema experience",
      tokens: 20,
      category: "Entertainment",
      image: "https://assets.rumsan.net/rumsan-test/cinema-ticket.jpg",
    },
    {
      id: 2,
      title: "Coffee",
      description: "Premium coffee blend",
      tokens: 150,
      category: "Food & Beverage",
      image: "https://assets.rumsan.net/rumsan-test/coffee-.jpg",
    },
    {
      id: 3,
      title: "Mobile TopUp",
      description: "Mobile recharge service",
      tokens: 200,
      category: "Utilities",
      image: "https://assets.rumsan.net/rumsan-test/mobile-topup.png",
    },
    {
      id: 4,
      title: "Gift Card",
      description: "Universal gift voucher",
      tokens: 1000,
      category: "Shopping",
      image: "https://assets.rumsan.net/rumsan-test/gift-card.jpg",
    },
  ];

  return (
    <div className="w-full p-4 mt-10">
      {/* Title and Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A]">Token Marketplace</h1>
        <p className="text-[#64748B] text-sm mt-2">
          Redeem your tokens for amazing services and rewards
        </p>
      </div>

      {/* Grid of Rewards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <Card
          className="w-full flex flex-col items-center justify-center text-green-500 bg-green-50 border border-dashed border-green-300 cursor-pointer hover:shadow-lg hover:text-green-600 transition"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus size={36} />
          <span className="text-center text-base mt-2">Add Token</span>
        </Card>

        {/* Rewards List */}
        {allRewards.map((item:any) => (
          <Card
            key={item.id}
            className="hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            onClick={() =>
              router.push(PATHS.TOKENMARKETPLACE.DETAILS(item.rewardRedemption))
            }
          >
            <CardHeader className="p-0">
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />

                <div
                  className={`absolute top-2 left-2 z-10 flex items-center gap-2 px-2 py-1 rounded-full shadow-sm ${categoryBgMap[item.category] || "bg-gray-100"} backdrop-blur-sm`}
                >
                  {getCategoryIcon(item.category)}
                  <span className="text-xs font-medium text-[#334155]">
                    {item.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-t-lg" />
              </div>

              <div className="px-4 pt-3 pb-2">
                <CardTitle className="text-lg text-[#0F172A]">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm text-[#64748B]">
                  {item.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="mt-auto">
              <div className="text-sm text-[#64748B] mb-1">
                <CardDescription>Tokens Required:</CardDescription>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-[#297AD6] text-xl font-bold">
                  ●{item.tokensRequired}
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-[#297AD6] hover:bg-[#1E61B4] text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReward(item);
                        }}
                      >
                        Redeem
                      </Button>
                    </DialogTrigger>

                    {selectedReward?.id === item.id && (
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {getCategoryIcon(item.category)} Confirm Redemption
                          </DialogTitle>
                          <DialogDescription>
                            Are you sure you want to buy this service?
                          </DialogDescription>
                        </DialogHeader>

                        <div className="bg-[#F8FAFC] rounded-lg p-4 mt-4 space-y-1">
                          <p className="text-sm font-semibold text-[#0F172A]">
                            {item.title}
                          </p>
                          <p className="text-sm text-[#64748B]">
                            {item.description}
                          </p>
                          <p className="text-sm font-medium text-[#297AD6] mt-1">
                            ● {item.tokensRequired} tokens
                          </p>
                        </div>

                        <Button
                          className="bg-[#297AD6] hover:bg-[#1E61B4] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchase(item);
                          }}
                          disabled={
                            RedeemPending ||
                            !balance ||
                            balance < BigInt(item.tokens)
                          }
                        >
                          {RedeemPending ? "Processing..." : "Confirm Purchase"}
                        </Button>
                      </DialogContent>
                    )}
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog for Adding Token */}

          
<DialogButton
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title="Add New Token"
        subTitle="Fill in the details to create a new token"
        buttonName="Create Token"
        submitType="CreateReward"
        inputLabel="Reward Name"
        inputPlaceholder="Enter reward name"
        handleApplyTaskLogic={handleRewardAdd}
        
      />






        
        
        
        
     
    </div>
  );
};

export default TokenMarketListCard;
