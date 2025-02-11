import { useNotifications } from "@/hooks/base/useNotifications";
import { NotificationSeverity } from "@/utils/types/notifications";
import { AddressType } from "@/utils/types/shared";
import { useCallback, useState } from "react";
import { useWriteContract as useWagmiWriteContract, useWaitForTransactionReceipt } from "wagmi";

export const useWriteContract = () => {
  const [error, setError] = useState<string | null>(null);
  const { writeContractAsync, isError: isErrorWriteContract } = useWagmiWriteContract();
  const [hash, setHash] = useState<AddressType | undefined>();
  const {
    isLoading,
    isSuccess,
    data,
    isError: isErrorTransactionReceipt,
  } = useWaitForTransactionReceipt({ hash });
  const { addNotification } = useNotifications();

  const writeContract = useCallback(
    async (config: Parameters<typeof writeContractAsync>[0]) => {
      try {
        setError(null);
        if (!writeContractAsync) return null;

        const txHash = await writeContractAsync(config);
        setHash(txHash);
        return txHash;
      } catch (err: any) {
        setError(err.message);
        addNotification({
          text: err.message,
          severity: NotificationSeverity.ERROR,
        });
        return null;
      }
    },
    [writeContractAsync, addNotification],
  );

  return {
    error,
    isError: isErrorWriteContract || isErrorTransactionReceipt,
    isLoading,
    isSuccess,
    writeContract,
    transactionReceipt: data,
    hash,
  };
};
