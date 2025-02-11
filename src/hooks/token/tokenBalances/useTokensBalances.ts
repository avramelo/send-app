import { TOKENS } from "@/utils/constants/tokens";
import { useEffect, useState } from "react";
import { erc20Abi, formatUnits, getAddress } from "viem";
import { useAccount, useBalance, useReadContracts } from "wagmi";

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  address: string;
}

export const useTokensBalances = (safeAddress?: string) => {
  const { address: ownerAddress } = useAccount();
  const [formattedBalances, setFormattedBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use safe address if provided, otherwise use owner address
  const currentAddress = safeAddress || ownerAddress;

  const {
    data: ethBalance,
    isLoading: ethLoading,
    refetch: refetchEth,
  } = useBalance({
    address: currentAddress as `0x${string}`,
    query: {
      enabled: !!currentAddress,
      staleTime: 0,
    },
  });

  const contracts = TOKENS.filter((token) => token.address !== "ETH").flatMap((token) => [
    {
      address: getAddress(token.address as `0x${string}`),
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [currentAddress as `0x${string}`],
      enabled: !!currentAddress,
    },
    {
      address: getAddress(token.address as `0x${string}`),
      abi: erc20Abi,
      functionName: "decimals",
      enabled: !!currentAddress,
    },
  ]);

  const {
    data: tokenData,
    isLoading: tokenLoading,
    refetch: refetchTokens,
  } = useReadContracts({
    contracts,
    query: {
      enabled: !!currentAddress,
      retry: false,
      staleTime: 0,
    },
  });

  // Reset and refetch when current address changes
  useEffect(() => {
    setFormattedBalances([]);
    setIsLoading(true);
    if (currentAddress) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAddress]);

  useEffect(() => {
    if (!currentAddress) {
      setFormattedBalances([]);
      setIsLoading(false);
      return;
    }

    const balances: TokenBalance[] = [];

    if (ethBalance) {
      balances.push({
        symbol: "ETH",
        name: "Ethereum",
        balance: ethBalance.formatted,
        address: "ETH",
      });
    }

    const tokenList = TOKENS.filter((token) => token.address !== "ETH");

    tokenList.forEach((token, index) => {
      const balanceResult = tokenData?.[index * 2];
      const decimalsResult = tokenData?.[index * 2 + 1];

      if (
        balanceResult?.status === "success" &&
        decimalsResult?.status === "success" &&
        balanceResult.result !== undefined &&
        decimalsResult.result !== undefined
      ) {
        try {
          const formattedBalance = formatUnits(
            BigInt(balanceResult.result.toString()),
            Number(decimalsResult.result),
          );
          balances.push({
            symbol: token.symbol,
            name: token.name,
            balance: formattedBalance,
            address: token.address,
          });
        } catch (error) {
          console.error(`Error formatting balance for ${token.symbol}:`, error);
        }
      }
    });

    setFormattedBalances(balances);
    setIsLoading(false);
  }, [currentAddress, tokenData, ethBalance]);

  const refetch = async () => {
    try {
      await Promise.all([refetchEth(), refetchTokens()]);
    } catch (error) {
      console.error("Refetch failed:", error);
    }
  };

  return {
    balances: formattedBalances,
    isLoading: isLoading || ethLoading || tokenLoading,
    refetch,
  };
};
