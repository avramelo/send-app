import { useNotifications } from "@/hooks/base/useNotifications";
import { useWriteContract } from "@/hooks/base/useWriteContract";
import { NotificationSeverity } from "@/utils/types/notifications";
import { AddressType } from "@/utils/types/shared";
import { useEffect } from "react";
import { erc20Abi } from "viem";

interface EOATransactionParams {
  recipient: string;
  amount: string;
  token: {
    address: string;
    symbol: string;
  };
}

export const useEOATransaction = (refetchBalances: () => void) => {
  const { writeContract, isLoading, isSuccess, error, transactionReceipt } = useWriteContract();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (transactionReceipt) {
      refetchBalances();
      addNotification({
        text: "Transaction successful",
        severity: NotificationSeverity.SUCCESS,
      });
    }
  }, [transactionReceipt, addNotification, refetchBalances]);

  useEffect(() => {
    if (error) {
      addNotification({
        text: error,
        severity: NotificationSeverity.ERROR,
      });
    }
  }, [error, addNotification]);

  const executeTransaction = async ({ recipient, amount, token }: EOATransactionParams) => {
    try {
      if (token.address === "ETH") {
        await writeContract({
          abi: [
            {
              name: "transfer",
              type: "function",
              stateMutability: "payable",
              inputs: [],
              outputs: [{ type: "bool" }],
            },
          ] as const,
          address: recipient as `0x${string}`,
          functionName: "transfer",
          // @ts-expect-error - viem types are not updated
          value: BigInt(parseFloat(amount) * 1e18),
        });
      } else {
        await writeContract({
          address: token.address as `0x${string}`,
          abi: erc20Abi,
          functionName: "transfer",
          args: [recipient as AddressType, BigInt(parseFloat(amount) * 1e18)],
        });
      }
    } catch (err) {
      console.error("Error executing EOA transaction:", err);
    }
  };

  return {
    executeTransaction,
    isLoading,
    isSuccess,
  };
};
