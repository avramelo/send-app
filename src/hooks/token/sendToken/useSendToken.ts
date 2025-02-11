import { useLocalStorage } from "@/hooks/base/useLocalStorage";
import { useSafeTransaction } from "@/hooks/token/sendToken/safe/useSafeTransaction";
import { useEOATransaction } from "./eoa/useEOATransaction";

interface SendTokenParams {
  recipient: string;
  amount: string;
  token: {
    address: string;
    symbol: string;
  };
  onSuccess?: () => void;
}

export const useSendToken = (refetchBalances: () => void) => {
  const { value: safeAddress } = useLocalStorage<string>("safeAddress", "");
  const {
    executeTransaction: executeEOA,
    isLoading: isLoadingEOA,
    isSuccess: isSuccessEOA,
  } = useEOATransaction(refetchBalances);
  const {
    executeSafeTransaction,
    isLoading: isLoadingSafe,
    isSuccess: isSuccessSafe,
  } = useSafeTransaction(refetchBalances);

  const isLoading = isLoadingEOA || isLoadingSafe;
  const isSuccess = isSuccessEOA || isSuccessSafe;

  const sendToken = async ({ recipient, amount, token, onSuccess }: SendTokenParams) => {
    try {
      if (safeAddress) {
        await executeSafeTransaction(token.address, amount, recipient);
      } else {
        await executeEOA({ recipient, amount, token });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error sending token:", err);
    }
  };

  return {
    sendToken,
    isLoading,
    isSuccess,
  };
};
