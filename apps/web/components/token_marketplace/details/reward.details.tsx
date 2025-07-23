"use client";

import {
  useGetRedeemedReward,
  useGetRewardById,
} from "@/hooks/subgraph/token-marketplace";
import { useEffect, useState } from "react";
import { imageMap } from "../img/imgLink";
import RedemptionHistory from "./redemption.history";

type RedemptionStatus = "completed" | "pending";

interface Redemption {
  name: string;
  date: string;
  status: RedemptionStatus;
  txnId: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  tokens: number;
  category: string;
  image: string;
}

interface RewardDetailsProps {
  rewardId: string;
  router: any;
}

type Step = "approve" | "redeem" | "completed";

const RewardDetails = ({ rewardId, router }: RewardDetailsProps) => {
  const { data: rewardDetail, isLoading, error } = useGetRewardById(rewardId);

  const {
    data: redeemedRewardsData,
    isLoading: redeemedLoading,
    error: redeemedError,
  } = useGetRedeemedReward();

  console.log("Redemption history data:", redeemedRewardsData);

  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [step, setStep] = useState<Step>("approve");
  const [loading, setLoading] = useState(false);
  const [approvalHash, setApprovalHash] = useState<string | null>(null);

  // Map redeemedRewardsData to redemptions state
  useEffect(() => {
    if (redeemedRewardsData?.data?.rewardRedeemeds) {
      const mappedRedemptions: Redemption[] =
        redeemedRewardsData.data.rewardRedeemeds.map((r: any) => ({
          name: r.from || "Wallet Address",
          date: new Date(Number(r.blockTimestamp) * 1000).toLocaleDateString(),
          status: r.status === 1 ? "completed" : "pending",
          txnId: r.transactionHash,
        }));
      setRedemptions(mappedRedemptions);
    }
  }, [redeemedRewardsData]);

  if (isLoading)
    return <p className="p-6 text-gray-500">Loading reward details...</p>;

  if (error || !rewardDetail?.data) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">
          Failed to load reward details.
        </p>
        <button
          onClick={() => router.push("/token_marketplace")}
          className="text-blue-600 text-sm mt-2"
        >
          &larr; Back to Marketplace
        </button>
      </div>
    );
  }

  const getImageForTitle = (title: string) =>
    imageMap[title] ||
    "https://assets.rumsan.net/rumsan-test/virtualperks-tokenmanagement-defaultimg.jpg";

  const rewardRaw = rewardDetail.data.rewardRedemptionCreated;
  const reward: Reward = {
    id: rewardRaw.id,
    title: rewardRaw.name,
    description: "Token reward",
    tokens: parseInt(rewardRaw.tokensRequired, 10),
    category: "Entertainment",
    image: getImageForTitle(rewardRaw.name),
  };

  // Step Handlers
  const handleApprove = async () => {
    setLoading(true);
    setTimeout(() => {
      setApprovalHash("0xc77417ff150b8");
      setStep("redeem");
      setLoading(false);
    }, 2000);
  };

  const handleRedeem = async () => {
    setLoading(true);
    setTimeout(() => {
      setStep("completed");
      alert("Reward redeemed successfully!");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.push("/token_marketplace")}
        className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
      >
        &larr; Back to Marketplace
      </button>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Section */}
        <div className="flex-[2] border border-gray-200 rounded-lg p-5 bg-white">
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-5">
            <img
              src={reward.image}
              alt={reward.title}
              className="object-cover h-full w-full rounded-lg"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">{reward.title}</h2>
          <p className="text-gray-600 mb-4">{reward.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-2">
            <div>
              <p className="font-medium">Validity</p>
              <p>6 months from redemption</p>
            </div>
            <div>
              <p className="font-medium">Locations</p>
              <p>Available at all premium cinema chains</p>
            </div>
            <div>
              <p className="font-medium">What's Included</p>
              <ul className="list-disc list-inside">
                <li>Premium seating</li>
                <li>Complimentary popcorn</li>
                <li>Priority booking</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Terms & Conditions</p>
              <p>Valid for any movie, any time. Subject to availability.</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-[1] flex">
          <div className="w-full border border-gray-200 shadow-sm rounded-xl p-4 bg-white mx-auto flex flex-col justify-between h-[50%] md:h-auto md:self-start">
            <h3 className="text-lg font-semibold text-center mb-1">
              Redeem Token
            </h3>
            <div className="text-blue-600 text-2xl font-bold text-center my-2">
              🔵 {reward.tokens}
            </div>
            <p className="text-[11px] text-gray-500 text-center mt-1">
              By redeeming, you agree to the terms.
            </p>

            {/* Step 1: Approve */}
            {step === "approve" && (
              <button
                onClick={handleApprove}
                disabled={loading}
                className={`mt-2 py-1.5 px-3 rounded-lg text-sm font-medium transition text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading
                  ? "Approving... Please confirm in wallet"
                  : "Step 1: Approve Token Spending"}
              </button>
            )}

            {/* Approval Success */}
            {step === "redeem" && approvalHash && (
              <>
                <div className="p-2 mt-3 bg-green-50 border border-green-200 rounded text-xs text-green-700 text-center">
                  Approval successful! You can now redeem the reward.
                  <div className="text-gray-500 text-[10px]">
                    {approvalHash}
                  </div>
                </div>
                <button
                  onClick={handleRedeem}
                  disabled={loading}
                  className={`mt-2 py-1.5 px-3 rounded-lg text-sm font-medium transition text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? "Redeeming..." : "Step 2: Redeem Reward"}
                </button>
              </>
            )}

            {/* Completed */}
            {step === "completed" && (
              <div className="flex flex-col gap-4 mt-3">
                <div className="p-3 border border-green-300 bg-green-50 text-green-800 text-sm rounded-md">
                  <div className="flex items-start gap-2">
                    <span>✅</span>
                    <div>
                      <p>
                        Redemption successful! Your reward will be processed
                        shortly.
                      </p>
                      <p className="text-green-700 text-xs mt-1">
                        0xd24688c3c1481
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStep("approve");
                    setApprovalHash(null);
                  }}
                  className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 transition"
                >
                  Redeem Another Reward
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Redemption History */}
      <RedemptionHistory />
    </div>
  );
};

export default RewardDetails;
