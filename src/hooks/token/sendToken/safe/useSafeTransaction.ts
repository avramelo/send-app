"use client";

import { useLocalStorage } from "@/hooks/base/useLocalStorage";
import { useNotifications } from "@/hooks/base/useNotifications";
import { NotificationSeverity } from "@/utils/types/notifications";
import { AddressType } from "@/utils/types/shared";
import Safe, { Eip1193Provider } from "@safe-global/protocol-kit";
import { useCallback, useEffect, useState } from "react";
import { encodeFunctionData, erc20Abi, getAddress, parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWalletClient } from "wagmi";

interface SafeTransaction {
  to: string;
  value: string;
  data: string;
}

export const useSafeTransaction = (refetchBalances: () => void) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { value: safeAddress } = useLocalStorage<string>("safeAddress", "");
  const [isError, setIsError] = useState(false);
  const [hash, setHash] = useState<AddressType | undefined>();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: transactionReceipt,
    isLoading: isTransactionReceiptLoading,
    isError: isErrorTransactionReceipt,
    isSuccess: isSuccessTransactionReceipt,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (transactionReceipt) {
      refetchBalances();
      addNotification({
        text: `Safe transaction successful! Hash: ${transactionReceipt.transactionHash.slice(0, 10)}...`,
        severity: NotificationSeverity.SUCCESS,
        duration: 8000,
      });
    }
  }, [transactionReceipt, refetchBalances, addNotification]);

  const executeSafeTransaction = useCallback(
    async (tokenAddress: string, amount: string, recipient: string) => {
      if (!address || !walletClient || !safeAddress) {
        addNotification({
          text: "Wallet or Safe not connected",
          severity: NotificationSeverity.ERROR,
          duration: 5000,
        });
        return null;
      }

      try {
        const isETH = tokenAddress === "ETH";
        const value = isETH ? parseEther(amount).toString() : "0";
        const parsedAmount = parseEther(amount);

        const checksumRecipient = getAddress(recipient);
        const checksumTokenAddress = isETH ? recipient : getAddress(tokenAddress);

        const transaction: SafeTransaction = {
          to: isETH ? checksumRecipient : checksumTokenAddress,
          value,
          data: isETH
            ? "0x"
            : encodeFunctionData({
                abi: erc20Abi,
                functionName: "transfer",
                args: [checksumRecipient, parsedAmount],
              }),
        };

        setIsError(false);
        setIsLoading(true);

        const safe = await Safe.init({
          provider: walletClient as Eip1193Provider,
          signer: address,
          safeAddress: getAddress(safeAddress),
        });

        const safeTransaction = await safe.createTransaction({
          transactions: [transaction],
          options: {
            nonce: await safe.getNonce(),
            safeTxGas: "0",
          },
        });

        const signedSafeTx = await safe.signTransaction(safeTransaction);
        const receipt = await safe.executeTransaction(signedSafeTx);

        addNotification({
          text: "Transaction submitted to Safe",
          severity: NotificationSeverity.SUCCESS,
          duration: 5000,
        });

        setHash(receipt.hash as AddressType);
        return receipt;
      } catch (error) {
        console.warn("Safe transaction failed:", error);
        const message = error instanceof Error ? error.message : "Transaction failed";
        setIsError(true);

        addNotification({
          text: message,
          severity: NotificationSeverity.ERROR,
          duration: 5000,
        });

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [address, walletClient, safeAddress, addNotification],
  );

  return {
    isLoading: isTransactionReceiptLoading || isLoading,
    executeSafeTransaction,
    transactionReceipt,
    isError: isErrorTransactionReceipt || isError,
    isSuccess: isSuccessTransactionReceipt,
  };
};
