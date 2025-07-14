import {
  useCheckParticipantBalance,
  useRedeemToken,
} from "@/hooks/subgraph/token";
import { DepartmentDetails } from "@workspace/sdk/type";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { useToast } from "@workspace/ui/hooks/use-toast";

import { getCategoryIcon } from "@/utils/rewardIcon";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Reward } from "../../../type/token.marketplace";

interface DepartmentListCardProps {
  router: AppRouterInstance;
  entityList: DepartmentDetails[];
}

const TokenMarketListCard = ({}) => {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const { address } = useAccount();
  const { balance } = useCheckParticipantBalance(address as `0x${string}`);
  const { toast } = useToast();
  const { tokenRedeem, redeemPending, redeemError } = useRedeemToken();

  const handlePurchase = async (reward: Reward) => {
    try {
      if (!address) {
        toast({
          title: "Error",
          description: "Please connect your wallet",
          variant: "destructive",
        });
        return;
      }

      if (!balance || balance < BigInt(reward.tokens)) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough tokens for this purchase",
          variant: "destructive",
        });
        return;
      }

      await tokenRedeem({
        amount: reward.tokens,
      });

      toast({
        title: "Purchase Successful",
        description: `You have redeemed ${reward.title}`,
        variant: "success",
      });

      setSelectedReward(null);
    } catch (error: any) {
      console.error("Purchase failed:", error);
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
        {rewards.map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <CardHeader className="p-0">
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                {/* Image fills the card top area */}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />

                {/* Icon + Category - fixed top-left */}
                <div
                  className={`absolute top-2 left-2 z-10 flex items-center gap-2 px-2 py-1 rounded-full shadow-sm 
    ${categoryBgMap[item.category] || "bg-gray-100"} 
    backdrop-blur-sm`}
                >
                  {getCategoryIcon(item.category)}
                  <span className="text-xs font-medium text-[#334155]">
                    {item.category}
                  </span>
                </div>

                {/* Optional gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-t-lg" />
              </div>

              {/* Title + Description */}
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
                  ●{item.tokens}
                </div>

                {/* Trigger Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-[#297AD6] hover:bg-[#1E61B4] text-white"
                      onClick={() => setSelectedReward(item)}
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
                          ● {item.tokens} tokens
                        </p>
                      </div>

                      <DialogFooter className="mt-6 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedReward(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-[#297AD6] hover:bg-[#1E61B4] text-white"
                          onClick={() => handlePurchase(item)}
                          disabled={
                            redeemPending ||
                            !balance ||
                            balance < BigInt(item.tokens)
                          }
                        >
                          {redeemPending ? "Processing..." : "Confirm Purchase"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TokenMarketListCard;
