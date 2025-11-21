"use client";

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@workspace/ui/hooks/use-toast";
import { Check, Copy, Loader2, User, UserMinus } from "lucide-react";
import { useState } from "react";

export function useColumns<
  T extends { participant: string }
>(p0: {
  addToWhitelist: (participant: string) => Promise<void>;
  removeFromWhitelist: (participant: string) => Promise<void>;
  removePending: boolean;
  canRemove: boolean;
}): ColumnDef<T>[] {

  return [
    {
      accessorKey: "participant",
      header: () => (
        <div className="text-left text-gray-600 font-semibold tracking-wide">
          Wallet Address
        </div>
      ),

      cell: ({ row }) => {
        const wallet = row.original.participant;
        const [copied, setCopied] = useState(false);
        const [isRemoving, setIsRemoving] = useState(false);

        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(wallet);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch (err) {
            console.error("Failed to copy address:", err);
          }
        };

        const handleRemove = async () => {
          try {
            setIsRemoving(true);

            await p0.removeFromWhitelist(wallet);

            toast({
              title: "Removed",
              description: `Participant ${wallet} removed from whitelist`,
              variant: "success",
              duration: 5000,
            });
          } catch (err: any) {
            toast({
              title: "Error",
              description: err?.message || "Failed to remove participant",
              variant: "destructive",
              duration: 5000,
            });
          } finally {
            setIsRemoving(false);
          }
        };

        return (
          <div className="flex items-center justify-between gap-6 group transition-all">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 shadow-sm">
                <User className="text-slate-600" size={20} />
              </div>

              <span
                title={wallet}
                className="font-mono text-lg text-gray-800 cursor-pointer group-hover:text-blue-600 transition-colors"
              >
                {wallet}
              </span>

              <button
                onClick={handleCopy}
                className="flex items-center text-xl text-gray-500 hover:text-blue-500 transition-colors"
              >
                {copied ? (
                  <Check size={25} className="text-green-500" />
                ) : (
                  <Copy size={22} />
                )}
              </button>
            </div>

            {/* Remove Button (only for entity owner) */}
            {p0.canRemove && (
              <button
                onClick={handleRemove}
                disabled={isRemoving || p0.removePending}
                className={`flex items-center transition-all ${
                  isRemoving
                    ? "text-red-300 opacity-70 cursor-not-allowed"
                    : "text-red-500 hover:text-red-700"
                }`}
                title="Remove from whitelist"
              >
                {isRemoving ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <UserMinus size={22} />
                )}
              </button>
            )}
          </div>
        );
      },
    },
  ];
}
