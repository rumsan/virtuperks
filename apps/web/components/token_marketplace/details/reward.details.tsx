"use client";

import { Button } from "@workspace/ui/components/button";
import { useEffect, useState } from "react";

type RedemptionStatus = "completed" | "pending";

interface Redemption {
  name: string;
  date: string;
  status: RedemptionStatus;
  txnId: string;
}

interface Reward {
  id: number;
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

const RewardDetails = ({ rewardId, router }: RewardDetailsProps) => {
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

  const [reward, setReward] = useState<Reward | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  useEffect(() => {
    const selectedReward = rewards.find((r) => r.id === Number(rewardId));
    setReward(selectedReward || null);

    setRedemptions([
      {
        name: "John Doe",
        date: "9/12/2024",
        status: "completed",
        txnId: "TXN09834",
      },
      {
        name: "Jane Smith",
        date: "9/12/2024",
        status: "completed",
        txnId: "TXN09833",
      },
      {
        name: "Mike Johnson",
        date: "9/12/2024",
        status: "pending",
        txnId: "TXN09832",
      },
    ]);
  }, [rewardId]);

  if (!reward) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">Reward not found.</p>
        <button
          onClick={() => router.push("/token_marketplace")}
          className="text-blue-600 text-sm mt-2"
        >
          &lt; Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => router.push("/token_marketplace")}
        className="text-blue-600 text-sm"
      >
        &lt; Back to Marketplace
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image and Description */}
        <div className="col-span-2 border rounded-lg p-4">
          <div className="h-48 overflow-hidden rounded mb-4">
            <img
              src={reward.image}
              alt={reward.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">{reward.title}</h2>
          <p className="text-gray-600 mb-4">{reward.description}</p>

          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <strong>Category:</strong> {reward.category}
            </p>
            <p>
              <strong>Validity:</strong> 6 months from redemption
            </p>
            <p>
              <strong>What's Included:</strong> Premium benefits may vary
            </p>
            <p>
              <strong>Terms & Conditions:</strong> Subject to availability
            </p>
          </div>
        </div>

        {/* Redeem Section */}
        <div className="border rounded-lg p-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">Redeem Token</h3>
            <div className="text-blue-600 text-3xl font-bold my-2">
              🔵 {reward.tokens}
            </div>
            <Button className="w-full">Redeem Now</Button>
            <p className="text-xs text-gray-500 mt-2">
              By redeeming, you agree to the terms and conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Redemption History */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Redemption History</h3>
        <div className="space-y-3">
          {redemptions.map((r, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded border"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`px-2 py-1 rounded text-xs font-medium 
                    ${
                      r.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {r.status}
                </div>
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.date}</p>
                </div>
              </div>
              <div className="text-xs text-gray-600 text-right">
                Transaction ID
                <br />
                <strong>{r.txnId}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardDetails;
