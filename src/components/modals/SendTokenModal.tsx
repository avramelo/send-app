import { useSendToken } from "@/hooks/token/sendToken/useSendToken";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { isAddress } from "viem";

interface SendTokenModalProps {
  open: boolean;
  onClose: () => void;
  token: {
    symbol: string;
    name: string;
    balance: string;
    address: string;
  };
  refetchBalances: () => void;
}

export const SendTokenModal = ({ open, onClose, token, refetchBalances }: SendTokenModalProps) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [addressError, setAddressError] = useState("");
  const { sendToken, isLoading, isSuccess } = useSendToken(refetchBalances);

  const validateAmount = (value: string) => {
    if (!value) {
      setAmountError("Amount is required");
      return false;
    }
    const numValue = parseFloat(value);
    const balance = parseFloat(token.balance);
    if (isNaN(numValue) || numValue <= 0) {
      setAmountError("Invalid amount");
      return false;
    }
    if (numValue > balance) {
      setAmountError("Insufficient balance");
      return false;
    }
    setAmountError("");
    return true;
  };

  const validateAddress = (value: string) => {
    if (!value) {
      setAddressError("Address is required");
      return false;
    }
    if (!isAddress(value)) {
      setAddressError("Invalid address");
      return false;
    }
    setAddressError("");
    return true;
  };

  const handleSend = async () => {
    const isAmountValid = validateAmount(amount);
    const isAddressValid = validateAddress(recipient);

    if (!isAmountValid || !isAddressValid) return;

    await sendToken({
      recipient,
      amount,
      token: {
        address: token.address,
        symbol: token.symbol,
      },
    });
  };

  // Handle success separately to avoid infinite loop
  useEffect(() => {
    if (isSuccess) {
      setRecipient("");
      setAmount("");
      onClose();
    }
  }, [isSuccess, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Send {token.symbol}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle2">
            Available Balance: {token.balance} {token.symbol}
          </Typography>
          <TextField
            fullWidth
            label="Recipient Address"
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              validateAddress(e.target.value);
            }}
            error={!!addressError}
            helperText={addressError}
          />
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              validateAmount(e.target.value);
            }}
            error={!!amountError}
            helperText={amountError}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!recipient || !amount || isLoading || !!amountError || !!addressError}
            sx={{ alignSelf: "stretch" }}
            startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
