import { AddressType } from "@/utils/types/shared";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { isAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";

const SAFE_ABI = [
  {
    inputs: [],
    name: "getOwners",
    outputs: [{ type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface SafeWalletModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (safeAddress: string) => void;
}

export const SafeWalletModal = ({ open, onClose, onConfirm }: SafeWalletModalProps) => {
  const { address } = useAccount();
  const [safeAddress, setSafeAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  const { data: owners, isLoading } = useReadContract({
    address: (isAddress(safeAddress) ? safeAddress : undefined) as `0x${string}`,
    abi: SAFE_ABI,
    functionName: "getOwners",
    query: {
      enabled: isAddress(safeAddress),
    },
  });

  const isOwner = isAddress(safeAddress) && owners?.includes(address as AddressType);

  const handleAddressChange = (value: string) => {
    setSafeAddress(value);
    if (value && !isAddress(value)) {
      setAddressError("Invalid address format");
    } else {
      setAddressError("");
    }
  };

  const handleConfirm = () => {
    if (isOwner) {
      onConfirm(safeAddress);
      setSafeAddress("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Connect Safe Wallet</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Safe Address"
            value={safeAddress}
            onChange={(e) => handleAddressChange(e.target.value)}
            fullWidth
            error={!!addressError || (isAddress(safeAddress) && !isOwner)}
            helperText={
              addressError ||
              (isAddress(safeAddress) && !isOwner ? "You are not an owner of this Safe" : "")
            }
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!isOwner || isLoading}
            fullWidth
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {isLoading ? "Checking ownership..." : "Connect Safe"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
