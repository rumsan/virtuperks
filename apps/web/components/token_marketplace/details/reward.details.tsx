"use client";

import {
  useCheckParticipantBalance,
  useTokenTranfer,
} from "@/hooks/subgraph/token";
import {
  useAddUserPhone,
  useCreateRedemption,
  useGetRewardById,
} from "@/hooks/subgraph/token-marketplace";
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

type Step = "phone-input" | "transfer" | "completed";

export interface RewardDetailsProps {
  rewardId: string;
  router: AppRouterInstance;
}

const RewardDetails = ({ rewardId, router }: RewardDetailsProps) => {
  const { data: rewardDetail, isLoading, error } = useGetRewardById(rewardId);
  const { toast } = useToast();
  console.log(rewardDetail, "rewardDetail");

  const { address, isConnected } = useAccount();
  //hook to check participant balance
  const { participantTotalToken } = useCheckParticipantBalance(
    address as `0x${string}`,
  );

  const [step, setStep] = useState<Step>("phone-input");
  const [loading, setLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneSuccess, setPhoneSuccess] = useState("");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { mutateAsync: addUserPhone } = useAddUserPhone();

  // Phone number validation
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]{10,15}$/;
    return phoneRegex.test(phone.trim());
  };

  const { tokenTransfer, transferPending, transferSuccess, transferError } =
    useTokenTranfer();

  const { mutateAsync: createRedemption } = useCreateRedemption();

  // Handle phone number submission
  const handlePhoneSubmit = async () => {
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedPhone) {
      setPhoneError("Phone number is required");
      return;
    }

    if (!validatePhoneNumber(trimmedPhone)) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    setPhoneLoading(true);
    setPhoneError("");
    setPhoneSuccess("");

    try {
      const response = await addUserPhone({
        phoneNumber: trimmedPhone,
        userWalletAddress: address as `0x${string}`,
      });

      if (response.status === "already_exists") {
        setPhoneSuccess(
          `Phone number ${trimmedPhone} is already registered. Proceeding to transfer.`,
        );
        toast({
          title: "Phone Number Found",
          description: `The phone number ${trimmedPhone} is already registered`,
          variant: "default",
        });
        // Move to next step after a short delay
        setTimeout(() => {
          setStep("transfer");
        }, 1500);
      } else if (response.status === "created") {
        setPhoneSuccess(
          `Phone number ${trimmedPhone} registered successfully!`,
        );
        toast({
          title: "Success!",
          description: "Phone number registered successfully",
          variant: "default",
        });
        // Move to next step after a short delay
        setTimeout(() => {
          setStep("transfer");
        }, 1500);
      }
    } catch (error) {
      console.error("Phone submission failed:", error);
      setPhoneError("Failed to process phone number. Please try again.");
      toast({
        title: "Error",
        description: "Failed to process phone number",
        variant: "destructive",
      });
    } finally {
      setPhoneLoading(false);
    }
  };

  // Handle token transfer and redemption
  const handleTransfer = async () => {
    if (!rewardDetail || !address) {
      toast({
        title: "Error",
        description: "Missing reward details or wallet address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Call API to create redemption record
      const txHash = await tokenTransfer({
        amount: rewardDetail.tokens,
        address: rewardDetail.wallet as `0x${string}`,
      });
      if (!txHash) {
        throw new Error("Token transfer failed, no transaction hash returned");
      }

      await createRedemption({
        rewardId: rewardDetail?.cuid,
        phoneNumber: phoneNumber.trim(),

        transactionHash: txHash,
      });

      setStep("completed");
      toast({
        title: "Success!",
        description: "Redemption initiated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Transfer failed:", error);
      toast({
        title: "Transfer Failed",
        description: "Failed to transfer tokens. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user has sufficient balance
  const hasSufficientBalance =
    participantTotalToken !== undefined &&
    rewardDetail?.tokens &&
    BigInt(participantTotalToken.toString()) >= BigInt(rewardDetail.tokens);

  // Loading and error states
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
                {!hasSufficientBalance && (
                  <div className="text-red-500 font-bold mb-2 text-base">
                    Insufficient balance to redeem this reward.
                  </div>
                )}

                {step === "phone-input" && (
                  <div className="flex flex-col gap-3 justify-center">
                    <p className="font-semibold text-gray-700">
                      Enter your phone number to proceed with redemption
                    </p>
                    <div className="space-y-2">
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setPhoneError("");
                          setPhoneSuccess("");
                        }}
                        className="text-center"
                        disabled={phoneLoading}
                      />
                      {phoneError && (
                        <p className="text-red-500 text-xs">{phoneError}</p>
                      )}
                      {phoneSuccess && (
                        <p className="text-green-600 text-xs">{phoneSuccess}</p>
                      )}
                    </div>
                    <Button
                      onClick={handlePhoneSubmit}
                      disabled={!phoneNumber.trim() || phoneLoading}
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition text-white ${
                        !phoneNumber.trim() || phoneLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {phoneLoading ? "Processing..." : "Continue to Transfer"}
                    </Button>
                  </div>
                )}

                {step === "transfer" && (
                  <div className="flex flex-col gap-3 justify-center">
                    <p className="font-semibold text-gray-700">
                      Phone: {phoneNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Transfer {rewardDetail.tokens} tokens to complete
                      redemption
                    </p>
                    {!hasSufficientBalance && (
                      <div className="text-red-500 font-bold mb-2 text-sm">
                        Insufficient balance to complete this redemption.
                      </div>
                    )}
                    <Button
                      onClick={handleTransfer}
                      disabled={loading || !hasSufficientBalance}
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition text-white ${
                        loading || !hasSufficientBalance
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {loading ? "Processing..." : "Transfer Tokens & Redeem"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep("phone-input");
                        setPhoneSuccess("");
                        setPhoneError("");
                      }}
                      disabled={loading}
                      className="py-2 px-4 text-xs"
                    >
                      Change Phone Number
                    </Button>
                  </div>
                )}

                {step === "completed" && (
                  <div className="flex flex-col gap-3 items-center justify-center">
                    <p className="font-semibold text-green-700">
                      Redemption successful! Your reward will be processed
                      shortly.
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {phoneNumber}
                    </p>
                    {transactionHash && (
                      <p className="text-green-700 text-xs break-all">
                        Transaction: {transactionHash}
                      </p>
                    )}
                    <Button
                      onClick={() => {
                        setStep("phone-input");
                        setPhoneNumber("");
                        setPhoneError("");
                        setPhoneSuccess("");
                        setTransactionHash(null);
                      }}
                      disabled={!hasSufficientBalance}
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition text-white ${
                        !hasSufficientBalance
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-800"
                      }`}
                    >
                      Redeem Another Reward
                    </Button>
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
