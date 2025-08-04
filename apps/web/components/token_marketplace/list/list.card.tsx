import { DialogButton } from "@/components/common/ui/dialog";
import { useCheckParticipantBalance } from "@/hooks/subgraph/token";
import {
  useCreateReward,
  useGetRedeemedRewardByParticiant,
  useGetRewards,
} from "@/hooks/subgraph/token-marketplace";
import { PATHS } from "@/routes/paths";
import { getCategoryIcon } from "@/utils/rewardIcon";
import { createId } from "@paralleldrive/cuid2";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { toUtf8Bytes } from "ethers";
import { Coins, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { keccak256 } from "viem";
import { useAccount } from "wagmi";
import { categoryColorMap } from "../img/imgLink";
import { add } from "date-fns";

const TokenMarketListCard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { address } = useAccount();
  const { participantTotalToken } = useCheckParticipantBalance(
    address as `0x${string}`,
  );

  const { toast } = useToast();
  const tokenData = useGetRewards();
  const tokenList = tokenData?.data?.data?.rewardRedemptionCreateds || [];
  console.log("Token Data: ++", tokenList);
  // const totalRewards = tokenList.length;
  const affordableRewards = tokenList.filter(
    (item: any) =>
      parseInt(item.tokensRequired) <= (participantTotalToken ?? 0),
  ).length;
  const router = useRouter();
  const { AddReward, rewardPending } = useCreateReward();

  const handleRewardAdd = async (data: any) => {
    try {
      const cuid = createId();
      const rewardId = keccak256(toUtf8Bytes(cuid));

      await AddReward({
        rewardId: rewardId,
        name: data.name,
        amount: data.amount,
        category: data.category,
        ownerAddress: data.ownerAddress,
      });
      setIsDialogOpen(false);
      toast({
        title: "Token transferred successfully!",
        variant: "success",
      });
    } catch (error: any) {}
  };

  const handleCardClick = (rewardId: string) => {
    router.push(PATHS.TOKENMARKETPLACE.DETAILS(rewardId));
  };

  return (
    <div className="w-full p-4 mt-10">
      {/* Title and Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A]">Token Marketplace</h1>
        <p className="text-[#64748B] text-sm mt-2">
          Redeem your tokens for amazing services and rewards
        </p>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Rewards</p>
          <p className="text-xl font-semibold text-[#0F172A]">
            {tokenList.length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Affordable Rewards</p>
          <p className="text-xl font-semibold text-[#0F172A]">
            {affordableRewards}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center gap-2">
          <div>
            <p className="text-sm text-gray-500">Available Tokens</p>
            <p className="text-xl font-semibold text-[#0F172A]">
              {participantTotalToken}
              <Coins size={20} className="text-[#297AD6]" />
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Rewards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Add Token Card */}
        <Card
          className="w-full flex flex-col items-center justify-center text-green-500 bg-green-50 border border-dashed border-green-300 cursor-pointer hover:shadow-lg hover:text-green-600 transition"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus size={36} />
          <span className="text-center text-base mt-2">Add Token</span>
        </Card>

        {/* Rewards List */}
        {tokenList.map((item: any) => (
          <Card
            key={item.id}
            className="hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            onClick={() => handleCardClick(item.rewardRedemption)}
          >
            <CardHeader className="p-0">
              <div className="relative w-full h-36 overflow-hidden rounded-t-lg">
                <img
                  src={
                    categoryColorMap[item.category]?.image ||
                    "https://assets.rumsan.net/rumsan-test/virtualperks-tokenmanagement-defaultimg.jpg"
                  }
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />

                <div
                  className={`absolute top-2 left-2 z-10 flex items-center gap-2 px-2 py-1 rounded-full shadow-sm backdrop-blur-sm ${
                    categoryColorMap[item.category]?.bg || "bg-gray-100"
                  }`}
                >
                  {getCategoryIcon(item.category)}
                  <span
                    className={`text-xs font-medium ${
                      categoryColorMap[item.category]?.text || "text-gray-700"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-t-lg" />
              </div>

              <div className="px-4 pt-3 pb-2">
                <CardTitle className="text-lg text-[#0F172A]">
                  {item.name}
                </CardTitle>
                <CardDescription className="text-sm text-[#64748B]">
                  {"Reward Description"}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="mt-auto">
              <div className="text-sm text-[#64748B] mb-1">
                <CardDescription>Tokens Required:</CardDescription>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-[#297AD6] text-xl font-bold">
                  <Coins size={18} strokeWidth={2.65} />
                  {parseInt(item.tokensRequired)}
                </div>

                {/* Button also navigates */}
                <Button
                  className="bg-[#297AD6] hover:bg-[#1E61B4] text-white"
                  onClick={() => handleCardClick(item.id.toString())}
                >
                  Approve and Redeem
                </Button>
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
        buttonName={rewardPending ? "Processing..." : "Create Token"}
        submitType="CreateReward"
        inputLabel="Reward Name"
        inputPlaceholder="Enter reward name"
        handleApplyTaskLogic={handleRewardAdd}
      />
    </div>
  );
};

export default TokenMarketListCard;
