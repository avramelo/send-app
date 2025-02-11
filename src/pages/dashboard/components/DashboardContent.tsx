import { SafeWalletBanner } from "@/components/banners/SafeWalletBanner";
import { CreateSafeModal } from "@/components/modals/CreateSafeModal";
import { SafeWalletModal } from "@/components/modals/SafeWalletModal";
import { SendTokenModal } from "@/components/modals/SendTokenModal";
import { TokenBalancesTable } from "@/components/tables/TokenBalancesTable";
import { Card } from "@/components/ui/Card/Card";
import { useLocalStorage } from "@/hooks/base/useLocalStorage";
import { useNotifications } from "@/hooks/base/useNotifications";
import { useCreateSafe } from "@/hooks/token/safeTokenInfo/useCreateSafe";
import { useTokensBalances } from "@/hooks/token/tokenBalances/useTokensBalances";
import { NotificationSeverity } from "@/utils/types/notifications";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { isAddress } from "viem";

const DashboardContent = () => {
  const { addNotification } = useNotifications();
  const [selectedToken, setSelectedToken] = useState<{
    symbol: string;
    name: string;
    balance: string;
    address: string;
  } | null>(null);
  const [isSafeModalOpen, setIsSafeModalOpen] = useState(false);
  const { value: safeAddress, setValue: setSafeAddress } = useLocalStorage<string>(
    "safeAddress",
    "",
  );
  const {
    balances,
    isLoading: isBalancesLoading,
    refetch: refetchBalances,
  } = useTokensBalances(isAddress(safeAddress) ? safeAddress : undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { createSafe, isLoading: isCreatingSafe } = useCreateSafe();
  const [isCreateSafeModalOpen, setIsCreateSafeModalOpen] = useState(false);

  const handleSafeConfirm = async (address: string = "") => {
    setIsLoading(true);

    try {
      setSafeAddress(address);
      await refetchBalances();
    } catch (error) {
      addNotification({
        text: "Error while confirming Safe Wallet Transaction",
        severity: NotificationSeverity.ERROR,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSafe = async (threshold: number, owners: string[]) => {
    try {
      const safeAddress = await createSafe(threshold, owners);
      if (safeAddress) {
        setSafeAddress(safeAddress);
        setIsCreateSafeModalOpen(false);
        await refetchBalances();
      }
    } catch (error) {
      addNotification({
        text: "Failed to create Safe wallet",
        severity: NotificationSeverity.ERROR,
      });
    }
  };

  if (isLoading || isBalancesLoading || isCreatingSafe) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        {isAddress(safeAddress) && <SafeWalletBanner safeAddress={safeAddress} />}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Token Balances</Typography>
          <Box display="flex" gap={1}>
            {!isAddress(safeAddress) && (
              <Button
                variant="outlined"
                onClick={() => setIsCreateSafeModalOpen(true)}
                color="secondary"
              >
                Create Safe
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={() =>
                !isAddress(safeAddress) ? setIsSafeModalOpen(true) : handleSafeConfirm("")
              }
              startIcon={isAddress(safeAddress) && "✓"}
            >
              {isAddress(safeAddress) ? "Safe Connected" : "Connect Safe"}
            </Button>
          </Box>
        </Box>
        <TokenBalancesTable balances={balances} onRowClick={setSelectedToken} />
      </Box>
      {selectedToken && (
        <SendTokenModal
          open={!!selectedToken}
          onClose={() => setSelectedToken(null)}
          token={selectedToken}
          refetchBalances={refetchBalances}
        />
      )}
      <SafeWalletModal
        open={isSafeModalOpen}
        onClose={() => setIsSafeModalOpen(false)}
        onConfirm={handleSafeConfirm}
      />
      <CreateSafeModal
        open={isCreateSafeModalOpen}
        onClose={() => setIsCreateSafeModalOpen(false)}
        onConfirm={handleCreateSafe}
      />
    </Card>
  );
};

export default DashboardContent;
