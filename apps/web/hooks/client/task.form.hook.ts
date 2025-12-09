import { useParticipantLookup } from "@/hooks/client/participant.lookup";
import { useGetEntityById } from "@/hooks/subgraph/entity";
import { useGetApprovedTokens } from "@/hooks/subgraph/token";
import { useGetTreasurerWallets } from "@/hooks/subgraph/treasurer.role.check";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { isAddress } from "viem";

export const useTaskForm = (form: UseFormReturn<any>) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentWallet, setCurrentWallet] = useState("");
  const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
  const [showAddParticipants, setShowAddParticipants] = useState(false);
  const params = useParams();
  const cuid = params?.id as string;
  const { data: entity, isLoading: entityLoading } = useGetEntityById(cuid);
  
  const {
    watch,
    setError,
    clearErrors,
    setValue,
    trigger,
  } = form;

  const entityAddress = watch("entityAddress");
  const totalRewardAmount = watch("totalRewardAmount");
  const isWhitelisted = watch("isWhitelisted");

  const { data: participantsResponse = {}, isLoading: participantsLoading } = useParticipantLookup();
  const participants = participantsResponse.data || [];

  const participantOptions = participants.map((p: any) => ({
    label: p.name,
    value: p.address,
  }));

  const { 
    data: treasurerWallets, 
    isLoading: treasurerWalletsLoading
  } = useGetTreasurerWallets(process.env.NEXT_PUBLIC_MINTER_ROLE!);

  const { totalApproved: unallocatedTokens } =
    useGetApprovedTokens(entityAddress ?? "");

  useEffect(() => {
    if (entity?.rewardManagement) {
      setValue("entityAddress", entity.rewardManagement);
    }
  }, [entity, setValue]);

  useEffect(() => {
    if (!entityAddress) return;
    if (unallocatedTokens === undefined) return;

    if (unallocatedTokens === "0") {
      setError("entityAddress", {
        type: "manual",
        message:
          "This entity has no tokens available. Please mint tokens first.",
      });
    } else {
      clearErrors("entityAddress");
    }
  }, [entityAddress, unallocatedTokens, setError, clearErrors]);

  const handleAddWallet = async () => {
    if (currentWallet && isAddress(currentWallet)) {
      const updated = [...walletAddresses, currentWallet];

      setWalletAddresses(updated);

      setValue("whitelistedParticipants", updated, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      await trigger("whitelistedParticipants");

      setCurrentWallet("");
    }
  };

  const removeWallet = async (addressToRemove: string) => {
    const updated = walletAddresses.filter((addr) => addr !== addressToRemove);
    setWalletAddresses(updated);
    setValue("whitelistedParticipants", updated, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    await trigger("whitelistedParticipants");
  };

  useEffect(() => {
    if (!entityAddress || unallocatedTokens === undefined) return;
    if (!totalRewardAmount) return;

    try {
      const totalAmount = BigInt(totalRewardAmount.toString());
      const availableAmount = BigInt(unallocatedTokens);

      if (totalAmount > availableAmount) {
        setError("totalRewardAmount", {
          type: "manual",
          message: `Insufficient tokens. Available: ${availableAmount.toString()}`,
        });
      } else {
        clearErrors("totalRewardAmount");
      }
    } catch (err) {
      console.error("Error parsing totalRewardAmount:", err);
    }
  }, [
    entityAddress,
    totalRewardAmount,
    unallocatedTokens,
    setError,
    clearErrors,
  ]);

  // Treasurer Mapping Logic
  const participantMap: Record<string, string> = {};
  participants.forEach((p: any) => {
    participantMap[p.address.toLowerCase()] = p.name;
  });

  const treasurerOptions =
    treasurerWallets?.map((wallet: string) => {
      const lower = wallet.toLowerCase();
      const name = participantMap[lower];

      return {
        wallet,
        label: name ? name : wallet, // fallback to address
      };
    }) ?? [];

  return {
    isPopoverOpen,
    setIsPopoverOpen,
    currentWallet,
    setCurrentWallet,
    walletAddresses,
    setWalletAddresses,
    showAddParticipants,
    setShowAddParticipants,
    entity,
    entityLoading,
    participantOptions,
    unallocatedTokens,
    treasurerOptions,
    treasurerWalletsLoading,
    participantsLoading,
    handleAddWallet,
    removeWallet,
  };
};
