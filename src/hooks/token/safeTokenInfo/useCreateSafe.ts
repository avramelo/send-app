import { useNotifications } from "@/hooks/base/useNotifications";
import { NotificationSeverity } from "@/utils/types/notifications";
import Safe from "@safe-global/protocol-kit";
import { useCallback, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";

export const useCreateSafe = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const createSafe = useCallback(
    async (threshold: number, additionalOwners: string[]) => {
      if (!address || !walletClient) {
        addNotification({
          text: "Wallet not connected",
          severity: NotificationSeverity.ERROR,
        });
        return null;
      }

      setIsLoading(true);

      try {
        const safeFactory = await Safe.init({
          provider: walletClient as any,
          safeAddress: undefined,
          signer: address,
          predictedSafe: {
            safeAccountConfig: {
              owners: [address, ...additionalOwners],
              threshold,
              data: "0x",
            },
            safeDeploymentConfig: {
              saltNonce: "01",
              safeVersion: "1.4.1",
              deploymentType: "canonical",
            },
          },
        });

        // TODO: CHECKPOINT
        console.error(
          "Safe wallet created successfully at",
          safeFactory.getAddress(),
          "owner:",
          address,
        );

        addNotification({
          text: `Safe wallet created successfully at ${safeFactory.getAddress()}`,
          severity: NotificationSeverity.SUCCESS,
          duration: 8000,
        });

        return safeFactory.getAddress();
      } catch (error) {
        console.error("Failed to create Safe:", error);
        const message = error instanceof Error ? error.message : "Unknown error";

        addNotification({
          text: message.includes("User rejected")
            ? "Transaction was rejected by user"
            : "Failed to create Safe wallet. Please try again",
          severity: NotificationSeverity.ERROR,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [address, walletClient, addNotification],
  );

  return {
    createSafe,
    isLoading,
  };
};
