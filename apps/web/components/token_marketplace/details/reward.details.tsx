"use client";

import {
  useCheckParticipantBalance,
  useTokenTranfer,
} from "@/hooks/subgraph/token";
import {
  useCreateRedemption,
  useGetRewardById,
  useUpdateRedemption,
} from "@/hooks/subgraph/token-marketplace";
import { useExecuteOfframpMutation } from "@/offramp/offramp.service";
import { validatePhoneNumber } from "@/utils/formatDate";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Coins } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import { categoryColorMap } from "../img/imgLink";
import RedemptionHistory from "./redemption.history";

type Step = "phone-input" | "processing" | "completed";

export interface RewardDetailsProps {
  rewardId: string;
  router: AppRouterInstance;
}

const RewardDetails = ({ rewardId, router }: RewardDetailsProps) => {
  const { data: rewardDetail, isLoading, error } = useGetRewardById(rewardId);
  const { toast } = useToast();

  const { address } = useAccount();
  const { participantTotalToken } = useCheckParticipantBalance(
    address as `0x${string}`,
  );

  const [step, setStep] = useState<Step>("phone-input");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const { tokenTransfer } = useTokenTranfer();
  const { mutateAsync: createRedemption } = useCreateRedemption();
  const { mutateAsync: updateRedemption } = useUpdateRedemption();
  const executeOfframpApi = useExecuteOfframpMutation();

  const handleOneClickRedemption = async () => {
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedPhone) {
      setPhoneError("Phone number is required");
      return;
    }

    if (!validatePhoneNumber(trimmedPhone)) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setPhoneError("");
    setStep("processing");

    try {
      // Step 1: Token Transfer
      const txHash = await tokenTransfer({
        amount: rewardDetail?.tokens || 0,
        address: rewardDetail?.wallet as string,
      });

      if (!txHash) {
        throw new Error("Token transfer failed");
      }

      setTransactionHash(txHash);

      // Step 2: Create Redemption
      const redemption = await createRedemption({
        rewardId: rewardDetail?.cuid,
        userWalletAddress: address as string,
        transactionHash: txHash,
        details: JSON.stringify({
          phoneNumber: trimmedPhone,
          timestamp: new Date().toISOString(),
        }),
      });

      // Step 3: Call Offramp API
      const paymentProviderId =
        process.env.NEXT_PUBLIC_OFFFRAMP_PROVIDER_ID ?? "";

      await executeOfframpApi.mutateAsync({
        transactionHash: txHash,
        tokenAmount: rewardDetail?.tokens || 0,
        paymentProviderId: paymentProviderId,
        senderAddress: address as string,
        paymentDetails: {
          phoneNumber: trimmedPhone,
          amount: rewardDetail?.tokens || 0,
        },
      });

      // Step 4: Update Redemption Status
      await updateRedemption({
        cuid: redemption.cuid,
        data: { status: "SUCCESS" },
      });

      setStep("completed");

      toast({
        title: "Success!",
        description: "Your reward has been successfully redeemed!",
        variant: "default",
      });
    } catch (error) {
      console.error("Redemption failed:", error);
      setPhoneError(
        error instanceof Error ? error.message : "Redemption failed",
      );
      setStep("phone-input");

      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user has sufficient tokens
  const hasEnoughTokens =
    participantTotalToken !== undefined &&
    rewardDetail?.tokens &&
    BigInt(participantTotalToken.toString()) >= BigInt(rewardDetail.tokens);

  if (isLoading) {
    return (
      <main className="bg-gray-50 flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading reward details...</p>
      </main>
    );
  }

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading reward details...</div>;
  }

  if (error || !rewardDetail) {
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

  return (
    <main className="w-full gap-4 p-4 sm:px-8 sm:py-4 md:gap-8 lg:px-16 bg-gray-50">
      <div className="space-y-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/token_marketplace")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 hover:text-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <span className="text-lg">&larr;</span>
          <span>Back to Marketplace</span>
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Section */}
          <div className="flex-[3] border border-gray-200 rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            {/* Image Section */}
            <div className="relative rounded-xl overflow-hidden h-72 mb-6">
              <Image
                alt={rewardDetail?.title}
                src={
                  categoryColorMap["Mobile-TopUp"]?.image ??
                  "https://assets.rumsan.net/rumsan-test/virtualperks-tokenmanagement-defaultimg.jpg"
                }
                width={800}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 bg-white/90 text-gray-800 text-xs px-3 py-1 rounded-full shadow">
                {
                  "Mobile-TopUp" /* Replace with dynamic category if available */
                }
              </div>
            </div>

            {/* Title & Description */}
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {rewardDetail?.title}
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {rewardDetail?.description}
            </p>

            {/* Token Info */}
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <span className="font-medium">Required Tokens:</span>
              <span className="text-blue-600 flex items-center gap-1 font-semibold text-lg">
                {rewardDetail?.tokens} <Coins size={20} strokeWidth={2.4} />
              </span>
            </div>

            {/* Details Grid */}
          </div>

          {/* Right Section */}
          <div className="flex-[1.2] flex">
            <div className="w-full border border-gray-200 shadow-md rounded-xl p-5 bg-white mx-auto flex flex-col justify-between min-h-[400px] md:min-h-auto md:self-start">
              {/* Available Tokens */}
              <div className="mb-4 p-3 text-center border-b border-gray-300">
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  Available Tokens
                </p>
                <div className="flex justify-center items-center text-blue-700 text-2xl font-bold gap-2">
                  {/* Correctly display bigint as string */}
                  {participantTotalToken?.toString() ?? 0} <Coins size={24} />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-center mb-1">
                Token Required to Redeem
              </h3>
              <div className="text-blue-600 text-2xl font-bold text-center my-2 flex items-center justify-center gap-2">
                {rewardDetail?.tokens} <Coins size={24} strokeWidth={2.65} />
              </div>
              <p className="text-xs text-gray-500 text-center mt-1">
                By redeeming, you agree to the terms.
              </p>

              {/* Redemption Steps */}
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-xs text-green-700 text-center flex flex-col justify-between min-h-[150px] transition-all">
                {/* Insufficient balance message */}
                {!hasEnoughTokens && (
                  <div className="text-red-500 font-bold mb-2 text-base">
                    Insufficient balance to redeem this reward.
                  </div>
                )}

                {/* Phone input step */}
                {step === "phone-input" && (
                  <div className="flex flex-col gap-3 justify-center">
                    <p className="font-semibold text-gray-700">
                      Enter your phone number to redeem
                    </p>
                    <div className="space-y-3">
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setPhoneError("");
                        }}
                        className="w-full"
                      />

                      {phoneError && (
                        <div className="text-red-500 text-sm">{phoneError}</div>
                      )}

                      <Button
                        onClick={handleOneClickRedemption}
                        disabled={loading || !hasEnoughTokens}
                        className="w-full"
                      >
                        {loading ? "Processing..." : "Redeem Reward"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Processing step */}
                {step === "processing" && (
                  <div className="flex flex-col gap-3 justify-center">
                    <p className="font-semibold text-gray-700">
                      Processing your redemption...
                    </p>
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Please wait while we transfer tokens and process your
                      reward
                    </p>
                  </div>
                )}

                {/* Completed step */}
                {step === "completed" && (
                  <div className="flex flex-col gap-3 justify-center">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="font-semibold text-green-700">
                      Redemption completed successfully!
                    </p>
                    {transactionHash && (
                      <p className="text-xs text-gray-600">
                        Transaction: {transactionHash.slice(0, 10)}...
                        {transactionHash.slice(-8)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Redemption History */}
        <RedemptionHistory rewardId={rewardId} />
      </div>
    </main>
  );
};

export default RewardDetails;
