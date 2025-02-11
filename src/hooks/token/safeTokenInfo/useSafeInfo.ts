"use client";
import { useNotifications } from "@/hooks/base/useNotifications";
import { NotificationSeverity } from "@/utils/types/notifications";
import Safe from "@safe-global/protocol-kit";
import { useCallback } from "react";
import { useAccount, useWalletClient } from "wagmi";

export const useSafeInfo = () => {
  const { addNotification } = useNotifications();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const getSafeInfo = useCallback(
    async (safeAddress: string) => {
      if (!safeAddress || !walletClient || !address) return null;

      try {
        const safe = await Safe.init({
          provider: walletClient as any,
          signer: address,
          safeAddress,
        });

        const owners = await safe.getOwners();
        const threshold = await safe.getThreshold();
        return { owners, threshold };
      } catch (error) {
        addNotification({
          text: "Error getting Safe info:",
          severity: NotificationSeverity.ERROR,
        });
        return null;
      }
    },
    [walletClient, address, addNotification],
  );

  return { getSafeInfo };
};
